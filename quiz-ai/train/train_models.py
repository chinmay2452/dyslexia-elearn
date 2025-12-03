#!/usr/bin/env python3
import os
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
import lightgbm as lgb

DATA_CSV = os.environ.get("FEATURE_CSV", os.path.join(os.path.dirname(__file__), "../prepared_quiz_features.csv"))
MODEL_DIR = os.environ.get("MODEL_DIR", os.path.join(os.path.dirname(__file__), "../models"))
os.makedirs(MODEL_DIR, exist_ok=True)

df = pd.read_csv(DATA_CSV)
# identify columns
ignore_cols = ["user_id", "quiz_id", "weak_topics_list"]
target_reg = "quiz_score"
target_conf = "confidence_score"
target_cls = "skill_level_label"

# weak topic columns follow pattern weak_topic__*
weak_cols = [c for c in df.columns if c.startswith("weak_topic__")]
# feature columns are numeric columns excluding targets + weak_cols
excluded = set([target_reg, target_conf, target_cls] + weak_cols + ignore_cols)
feature_cols = [c for c in df.columns if c not in excluded and df[c].dtype in [np.float64, np.float32, np.int64, np.int32]]

print("Feature cols:", feature_cols[:30])
print("Weak topic cols:", weak_cols)

# split (by user ideally) - here simple random split
train_df, valid_df = train_test_split(df, test_size=0.2, random_state=42)

# ------- regression model for quiz_score
train_data = lgb.Dataset(train_df[feature_cols], label=train_df[target_reg])
valid_data = lgb.Dataset(valid_df[feature_cols], label=valid_df[target_reg])

params_reg = {
    "objective": "regression",
    "metric": "mae",
    "learning_rate": 0.05,
    "num_leaves": 31,
    "verbosity": -1,
    "seed": 42
}

reg_model = lgb.train(
    params_reg,
    train_data,
    num_boost_round=1000,
    valid_sets=[valid_data],
    callbacks=[lgb.early_stopping(stopping_rounds=50)]
)

joblib.dump(reg_model, os.path.join(MODEL_DIR, "lgb_reg_quiz_score.pkl"))
print("Saved reg model.")

# ------- classifier for skill level
params_cls = {
    "objective": "multiclass",
    "num_class": len(df[target_cls].unique()),
    "metric": "multi_logloss",
    "learning_rate": 0.05,
    "num_leaves": 31,
    "verbosity": -1,
    "seed": 42
}
train_c = lgb.Dataset(train_df[feature_cols], label=train_df[target_cls])
valid_c = lgb.Dataset(valid_df[feature_cols], label=valid_df[target_cls])
cls_model = lgb.train(
    params_cls,
    train_c,
    num_boost_round=1000,
    valid_sets=[valid_c],
    callbacks=[lgb.early_stopping(stopping_rounds=50)]
)

joblib.dump(cls_model, os.path.join(MODEL_DIR, "lgb_cls_skill_level.pkl"))
print("Saved class model.")

# ------- weak topic binary models (one per topic)
weak_models = {}
for col in weak_cols:
    print("Training weak model for", col)
    tr = lgb.Dataset(train_df[feature_cols], label=train_df[col])
    va = lgb.Dataset(valid_df[feature_cols], label=valid_df[col])
    p = {
        "objective": "binary",
        "metric": "binary_logloss",
        "learning_rate": 0.05,
        "num_leaves": 31,
        "verbosity": -1,
        "seed": 42
    }
m = lgb.train(
    p,
    tr,
    num_boost_round=500,
    valid_sets=[va],
    callbacks=[lgb.early_stopping(stopping_rounds=20)]
)

joblib.dump(m, os.path.join(MODEL_DIR, f"lgb_weak_{col}.pkl"))
weak_models[col] = os.path.join(MODEL_DIR, f"lgb_weak_{col}.pkl")

# ------- confidence model (regression)
train_conf = lgb.Dataset(train_df[feature_cols], label=train_df[target_conf])
valid_conf = lgb.Dataset(valid_df[feature_cols], label=valid_df[target_conf])
conf_model = lgb.train(
    params_reg, train_conf,
    num_boost_round=500,
    valid_sets=[valid_conf],
    callbacks=[lgb.early_stopping(stopping_rounds=30)]
)

joblib.dump(conf_model, os.path.join(MODEL_DIR, "lgb_reg_confidence.pkl"))
print("Saved confidence model.")

# Save metadata (feature_cols, weak_cols)
meta = {"feature_cols": feature_cols, "weak_cols": weak_cols}
joblib.dump(meta, os.path.join(MODEL_DIR, "meta.pkl"))
print("Saved metadata.")
