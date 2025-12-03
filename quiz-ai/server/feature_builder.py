# server/feature_builder.py
import json
import numpy as np
from collections import defaultdict

WEAK_TOPIC_THRESHOLD = 0.7

def build_features_from_submission(submission: dict, known_topics: list = None):
    """
    submission: {
      "user_id": ...,
      "quiz_id": ...,
      "responses": [ {question_id, topic, difficulty, is_correct, time_taken}, ... ],
      "start_time": ..., "end_time": ...
    }
    known_topics: list of topics expected by the model's meta (optional)
    Returns dict of features matching feature_cols from training meta.
    """
    responses = submission.get("responses", [])
    total_q = len(responses)
    correct = sum(1 for r in responses if r.get("is_correct"))
    quiz_score = (correct / total_q) * 100.0 if total_q>0 else 0.0
    times = [max(0.001, float(r.get("time_taken", 0))) for r in responses] if total_q>0 else [0.0]
    avg_time = float(np.mean(times))
    median_time = float(np.median(times))
    time_std = float(np.std(times))
    topic_stats = defaultdict(lambda: {"correct": 0, "total": 0})
    difficulty_stats = defaultdict(lambda: {"correct": 0, "total": 0})
    for r in responses:
        t = r.get("topic", "unknown")
        is_c = bool(r.get("is_correct", False))
        topic_stats[t]["total"] += 1
        if is_c:
            topic_stats[t]["correct"] += 1
        d = r.get("difficulty", "medium")
        difficulty_stats[d]["total"] += 1
        if is_c:
            difficulty_stats[d]["correct"] += 1

    # build base features
    feat = {
        "correct_count": correct,
        "total_questions": total_q,
        "avg_time": avg_time,
        "median_time": median_time,
        "time_std": time_std,
        "easy_acc": (difficulty_stats["easy"]["correct"]/difficulty_stats["easy"]["total"]) if difficulty_stats["easy"]["total"]>0 else np.nan,
        "medium_acc": (difficulty_stats["medium"]["correct"]/difficulty_stats["medium"]["total"]) if difficulty_stats["medium"]["total"]>0 else np.nan,
        "hard_acc": (difficulty_stats["hard"]["correct"]/difficulty_stats["hard"]["total"]) if difficulty_stats["hard"]["total"]>0 else np.nan,
    }

    # topic_acc fields for known topics
    if known_topics is None:
        # use topics seen in submission
        known_topics = list(topic_stats.keys())

    for topic in known_topics:
        key = f"topic_acc__{topic}"
        if topic in topic_stats and topic_stats[topic]["total"]>0:
            feat[key] = topic_stats[topic]["correct"] / topic_stats[topic]["total"]
        else:
            feat[key] = np.nan

    # final features - order will be controlled by meta.feature_cols
    return feat
