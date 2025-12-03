import pandas as pd
import numpy as np
import random

def generate_data(num_samples=200):
    data = []
    
    for i in range(num_samples):
        user_id = f"u{i+1}"
        quiz_id = f"q{random.randint(1, 10)}"
        
        # Assign a "true" skill level to base stats on
        true_skill = np.random.choice(["Beginner", "Intermediate", "Advanced"], p=[0.3, 0.4, 0.3])
        
        if true_skill == "Beginner":
            score_range = (0, 50)
            time_range = (15, 30)
            weak_prob = 0.7
            skill_label = 0
        elif true_skill == "Intermediate":
            score_range = (40, 80)
            time_range = (10, 20)
            weak_prob = 0.4
            skill_label = 1
        else: # Advanced
            score_range = (75, 100)
            time_range = (5, 15)
            weak_prob = 0.1
            skill_label = 2
            
        # Generate metrics based on skill
        quiz_score = int(np.random.normal(np.mean(score_range), (score_range[1]-score_range[0])/4))
        quiz_score = max(0, min(100, quiz_score))
        
        total_questions = 10
        correct_count = int(quiz_score / 100 * total_questions)
        
        avg_time = np.random.uniform(*time_range)
        median_time = avg_time * np.random.uniform(0.9, 1.1)
        time_std = avg_time * 0.2
        
        # Topic accuracy
        easy_acc = min(1.0, quiz_score / 100 + np.random.uniform(0, 0.2))
        medium_acc = min(1.0, max(0.0, quiz_score / 100 - np.random.uniform(0, 0.1)))
        hard_acc = min(1.0, max(0.0, quiz_score / 100 - np.random.uniform(0.1, 0.3)))
        
        # Weak topics
        weak_spelling = 1 if np.random.random() < weak_prob else 0
        weak_grammar = 1 if np.random.random() < weak_prob else 0
        weak_vocab = 1 if np.random.random() < weak_prob else 0
        
        confidence = quiz_score / 100 * np.random.uniform(0.8, 1.0)
        
        row = {
            "user_id": user_id,
            "quiz_id": quiz_id,
            "correct_count": correct_count,
            "total_questions": total_questions,
            "avg_time": round(avg_time, 1),
            "median_time": round(median_time, 1),
            "time_std": round(time_std, 1),
            "easy_acc": round(easy_acc, 2),
            "medium_acc": round(medium_acc, 2),
            "hard_acc": round(hard_acc, 2),
            "weak_topic__spelling": weak_spelling,
            "weak_topic__grammar": weak_grammar,
            "weak_topic__vocabulary": weak_vocab,
            "quiz_score": quiz_score,
            "confidence_score": round(confidence, 2),
            "skill_level_label": skill_label
        }
        data.append(row)
        
    df = pd.DataFrame(data)
    return df

if __name__ == "__main__":
    df = generate_data(200)
    df.to_csv("prepared_quiz_features.csv", index=False)
    print("Generated 200 samples of synthetic data to prepared_quiz_features.csv")
