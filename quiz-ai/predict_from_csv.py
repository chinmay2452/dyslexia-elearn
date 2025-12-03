import os
import joblib
import pandas as pd
import numpy as np

# Define paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")
DATA_CSV = os.path.join(BASE_DIR, "prepared_quiz_features.csv")
OUTPUT_CSV = os.path.join(BASE_DIR, "model_predictions.csv")

def main():
    print(f"Loading models from {MODEL_DIR}...")
    
    # Load metadata and models
    try:
        meta = joblib.load(os.path.join(MODEL_DIR, "meta.pkl"))
        feature_cols = meta["feature_cols"]
        weak_cols = meta["weak_cols"]
        
        reg_model = joblib.load(os.path.join(MODEL_DIR, "lgb_reg_quiz_score.pkl"))
        cls_model = joblib.load(os.path.join(MODEL_DIR, "lgb_cls_skill_level.pkl"))
        conf_model = joblib.load(os.path.join(MODEL_DIR, "lgb_reg_confidence.pkl"))
        
        weak_models = {}
        for w in weak_cols:
            path = os.path.join(MODEL_DIR, f"lgb_weak_{w}.pkl")
            if os.path.exists(path):
                weak_models[w] = joblib.load(path)
                
    except FileNotFoundError as e:
        print(f"Error loading models: {e}")
        print("Make sure you have trained the models first.")
        return

    print(f"Reading data from {DATA_CSV}...")
    try:
        df = pd.read_csv(DATA_CSV)
    except FileNotFoundError:
        print(f"Error: Could not find {DATA_CSV}")
        return

    # Prepare features
    print("Generating predictions...")
    
    # Ensure all feature columns exist, fill missing with 0 or NaN
    X = df[feature_cols].values
    
    # Predict Quiz Score
    pred_scores = reg_model.predict(X)
    df["pred_quiz_score"] = [max(0.0, min(100.0, s)) for s in pred_scores]
    
    # Predict Skill Level
    cls_probs = cls_model.predict(X)
    skill_indices = np.argmax(cls_probs, axis=1)
    skill_map = {0: "Beginner", 1: "Intermediate", 2: "Advanced"}
    df["pred_skill_level"] = [skill_map.get(i, "Intermediate") for i in skill_indices]
    
    # Predict Confidence
    pred_confs = conf_model.predict(X)
    df["pred_confidence"] = [max(0.0, min(1.0, c)) for c in pred_confs]
    
    # Predict Weak Topics
    for w_col, w_model in weak_models.items():
        probs = w_model.predict(X)
        topic_name = w_col.replace("weak_topic__", "")
        df[f"pred_weak_{topic_name}"] = probs > 0.5

    # Save results
    print(f"Saving predictions to {OUTPUT_CSV}...")
    df.to_csv(OUTPUT_CSV, index=False)
    print("Done!")
    print("\nSample predictions:")
    print(df[["user_id", "quiz_id", "pred_quiz_score", "pred_skill_level"]].head())

if __name__ == "__main__":
    main()
