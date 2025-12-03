#!/usr/bin/env python3
"""
Build features from raw per-question quiz responses.

Raw input format (one quiz attempt):
{
  "user_id": "<uuid>",
  "quiz_id": "<uuid>",
  "responses": [
      {"question_id": "q1", "topic": "spelling", "difficulty": "easy", "is_correct": true, "time_taken": 12.3},
      ...
  ],
  "start_time": "2025-11-04T12:00:00Z",
  "end_time": "2025-11-04T12:05:00Z"
}

This script supports two modes:
- dev: load from a local CSV of raw events
- prod: you can adapt to fetch from Supabase and produce same features
"""
import os
import json
import pandas as pd
import numpy as np
from collections import defaultdict
from typing import List, Dict

INPUT_RAW_CSV = os.environ.get("RAW_INPUT_CSV", "raw_quiz_responses.csv")
OUTPUT_FEATURE_CSV = os.environ.get("OUTPUT_FEATURE_CSV", "prepared_quiz_features.csv")
# threshold for weak topic (used to create labels)
WEAK_TOPIC_THRESHOLD = float(os.environ.get("WEAK_TOPIC_THRESHOLD", 0.7))

def process_one_attempt(row):
    # row.responses expected as JSON string or python list
    if isinstance(row.get("responses"), str):
        responses = json.loads(row["responses"])
    else:
        responses = row.get("responses", [])

    total_q = len(responses)
    if total_q == 0:
        return None

    correct = sum(1 for r in responses if r.get("is_correct"))
    quiz_score = (correct / total_q) * 100.0

    times = [max(0.001, float(r.get("time_taken", 0))) for r in responses]
    avg_time = float(np.mean(times))
    median_time = float(np.median(times))
    time_std = float(np.std(times))
    max_time_gap = 0.0
    # if you have per-question timestamps, compute real gaps - else skip

    # topic-level aggregates
    topic_stats = defaultdict(lambda: {"correct": 0, "total": 0, "times": []})
    difficulty_stats = defaultdict(lambda: {"correct": 0, "total": 0})
    for r in responses:
        t = r.get("topic", "unknown")
        is_c = bool(r.get("is_correct"))
        topic_stats[t]["total"] += 1
        if is_c:
            topic_stats[t]["correct"] += 1
        topic_stats[t]["times"].append(max(0.001, float(r.get("time_taken", 0))))

        d = r.get("difficulty", "medium")
        difficulty_stats[d]["total"] += 1
        if is_c:
            difficulty_stats[d]["correct"] += 1

    # create flattened columns for top N topics seen across dataset
    # We'll create dynamic topic columns later; here generate a compact representation
    topic_acc = {f"topic_acc__{k}": (v["correct"] / v["total"]) for k, v in topic_stats.items()}

    easy_acc = (difficulty_stats["easy"]["correct"] / difficulty_stats["easy"]["total"]) if difficulty_stats["easy"]["total"]>0 else np.nan
    medium_acc = (difficulty_stats["medium"]["correct"] / difficulty_stats["medium"]["total"]) if difficulty_stats["medium"]["total"]>0 else np.nan
    hard_acc = (difficulty_stats["hard"]["correct"] / difficulty_stats["hard"]["total"]) if difficulty_stats["hard"]["total"]>0 else np.nan

    # label weak topics
    weak_topics = [k for k, v in topic_stats.items() if (v["correct"] / v["total"]) < WEAK_TOPIC_THRESHOLD]

    out = {
        "user_id": row.get("user_id"),
        "quiz_id": row.get("quiz_id"),
        "quiz_score": quiz_score,
        "correct_count": correct,
        "total_questions": total_q,
        "avg_time": avg_time,
        "median_time": median_time,
        "time_std": time_std,
        "easy_acc": easy_acc,
        "medium_acc": medium_acc,
        "hard_acc": hard_acc,
        "weak_topics_list": json.dumps(weak_topics)
    }
    # add topic_acc fields
    for k, v in topic_acc.items():
        out[k] = v
    return out

def main():
    df_raw = pd.read_csv(INPUT_RAW_CSV)
    processed = []
    for _, r in df_raw.iterrows():
        rec = process_one_attempt(r.to_dict())
        if rec:
            processed.append(rec)
    df_feat = pd.DataFrame(processed).fillna(np.nan)

    # convert weak topics to multiple binary columns (weak_{topic})
    # find the top topics across dataset
    topic_cols = [c for c in df_feat.columns if c.startswith("topic_acc__")]
    topics = [c.replace("topic_acc__", "") for c in topic_cols]
    for topic in topics:
        # weak topic = 1 if topic_acc__topic < threshold OR topic absent -> 0
        src = f"topic_acc__{topic}"
        df_feat[f"weak_topic__{topic}"] = df_feat[src].apply(lambda x: 1 if (pd.notna(x) and x < WEAK_TOPIC_THRESHOLD) else 0)

    # derive skill_level_label
    def skill_label(score):
        if score < 50: return 0
        if score < 80: return 1
        return 2
    df_feat["skill_level_label"] = df_feat["quiz_score"].apply(skill_label)

    # confidence target (simple heuristic): accuracy * (1 / (1 + time_std))
    df_feat["confidence_score"] = (df_feat["quiz_score"] / 100.0) * (1.0 / (1.0 + df_feat["time_std"].fillna(0.0)))
    # clamp 0.0-1.0
    df_feat["confidence_score"] = df_feat["confidence_score"].clip(0.0, 1.0)

    df_feat.to_csv(OUTPUT_FEATURE_CSV, index=False)
    print(f"Saved features to {OUTPUT_FEATURE_CSV}, shape={df_feat.shape}")

if __name__ == "__main__":
    main()
