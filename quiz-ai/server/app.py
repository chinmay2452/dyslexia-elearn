# server/app.py
import os
import joblib
import uuid
import datetime
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from supabase import create_client, Client
from server.feature_builder import build_features_from_submission
import numpy as np

load_dotenv()
SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_KEY"]
MODEL_DIR = os.environ.get("MODEL_DIR", "../models")
PORT = int(os.environ.get("PORT", 8000))

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# load models & meta
meta = joblib.load(f"{MODEL_DIR}/meta.pkl")
feature_cols = meta["feature_cols"]
weak_cols = meta["weak_cols"]

reg_model = joblib.load(f"{MODEL_DIR}/lgb_reg_quiz_score.pkl")
cls_model = joblib.load(f"{MODEL_DIR}/lgb_cls_skill_level.pkl")
conf_model = joblib.load(f"{MODEL_DIR}/lgb_reg_confidence.pkl")
weak_models = {}
for w in weak_cols:
    path = f"{MODEL_DIR}/lgb_weak_{w}.pkl"
    if os.path.exists(path):
        weak_models[w] = joblib.load(path)

app = FastAPI(title="Quiz AI Inference API")

class ResponseItem(BaseModel):
    question_id: str
    topic: str
    difficulty: str
    is_correct: bool
    time_taken: float

class QuizSubmission(BaseModel):
    user_id: str
    quiz_id: str
    responses: list[ResponseItem]
    start_time: str | None = None
    end_time: str | None = None

@app.post("/predict")
def predict(sub: QuizSubmission):
    # convert to dict
    submission = sub.dict()
    # build raw features
    feats = build_features_from_submission(submission, known_topics=[c.replace("topic_acc__", "") for c in meta["feature_cols"] if c.startswith("topic_acc__")])
    # ensure feature order
    x = []
    for c in feature_cols:
        v = feats.get(c)
        # LightGBM accepts np.nan for missing numeric
        x.append(np.nan if v is None else v)
    import numpy as np
    X = np.array(x).reshape(1, -1)

    # predictions
    try:
        pred_score = float(reg_model.predict(X)[0])
        pred_score = max(0.0, min(100.0, pred_score))
        cls_probs = cls_model.predict(X)
        skill_idx = int(np.argmax(cls_probs, axis=1)[0])
        skill_map = {0: "Beginner", 1: "Intermediate", 2: "Advanced"}
        pred_skill = skill_map.get(skill_idx, "Intermediate")
        pred_conf = float(conf_model.predict(X)[0])
        pred_conf = float(max(0.0, min(1.0, pred_conf)))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model prediction error: {e}")

    # weak topics decisions
    weak_topics = []
    for w_col, w_model in weak_models.items():
        p = float(w_model.predict(X)[0])
        if p > 0.5:
            topic_name = w_col.replace("weak_topic__", "")
            weak_topics.append(topic_name)

    # result JSON
    result = {
        "id": str(uuid.uuid4()),
        "user_id": submission["user_id"],
        "quiz_id": submission["quiz_id"],
        "quiz_score": round(pred_score, 2),
        "skill_level": pred_skill,
        "weak_topics": weak_topics,
        "confidence_score": round(pred_conf, 2),
        "taken_at": datetime.datetime.utcnow().isoformat() + "Z"
    }

    # store to Supabase
    try:
        resp = supabase.table("quiz_results").insert(result).execute()
        # resp.data may contain row; ignore for now
    except Exception as e:
        # log error but still return prediction
        print("Supabase insert error:", e)

    return result

# health endpoint
@app.get("/health")
def health():
    return {"status": "ok", "time": datetime.datetime.utcnow().isoformat() + "Z"}
