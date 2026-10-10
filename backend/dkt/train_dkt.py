import json
import os
from collections import defaultdict

import torch
import torch.nn as nn
from torch.utils.data import DataLoader, TensorDataset

from model import DKTModel
from utils import build_student_sequences, build_skill_index, encode_sequence

def train_model(records, epochs=20, hidden_dim=32, learning_rate=1e-3):
    if not records:
        raise ValueError("No records provided.")

    student_sequences = build_student_sequences(records)
    skill_to_index, num_skills = build_skill_index(records)

    all_sequences = []
    for student_id, records_list in student_sequences.items():
        sequence = encode_sequence(records_list, skill_to_index)
        all_sequences.append(sequence)

    # Build training tensors
    max_len = max(len(seq) for seq in all_sequences)
    skill_tensor = []
    answer_tensor = []
    target_tensor = []

    for seq in all_sequences:
        seq_len = len(seq)

        skills = [item[0] for item in seq]
        answers = [item[1] for item in seq]

        pad_len = max_len - seq_len
        skills = skills + [0] * pad_len
        answers = answers + [0] * pad_len

        skill_tensor.append(skills)
        answer_tensor.append(answers)
        target_tensor.append([1 if a > 0 else 0 for a in answers])  # pseudo-target for shape

    skill_tensor = torch.tensor(skill_tensor, dtype=torch.long)
    answer_tensor = torch.tensor(answer_tensor, dtype=torch.float32)
    target_tensor = torch.tensor(target_tensor, dtype=torch.float32)

    model = DKTModel(num_skills=num_skills, hidden_dim=hidden_dim)
    optimizer = torch.optim.Adam(model.parameters(), lr=learning_rate)
    criterion = nn.BCEWithLogitsLoss()

    for epoch in range(epochs):
        model.train()
        optimizer.zero_grad()

        logits = model(skill_tensor, answer_tensor)
        loss = criterion(logits.reshape(-1), target_tensor.reshape(-1))
        loss.backward()
        optimizer.step()

    return {
        "model": model,
        "num_skills": num_skills,
        "hidden_dim": hidden_dim,
        "epochs": epochs,
        "final_loss": float(loss.item()),
    }

def save_model(model, path):
    torch.save(model.state_dict(), path)

def load_model(path):
    model = DKTModel(num_skills=1)
    model.load_state_dict(torch.load(path, map_location="cpu"))
    return model

if __name__ == "__main__":
    example_records = [
        {"studentId": "s1", "skillId": "js", "correct": 1, "timestamp": "2026-01-01T00:00:00Z"},
        {"studentId": "s1", "skillId": "js", "correct": 0, "timestamp": "2026-01-01T00:05:00Z"},
        {"studentId": "s2", "skillId": "js", "correct": 1, "timestamp": "2026-01-01T00:10:00Z"},
        {"studentId": "s2", "skillId": "js", "correct": 1, "timestamp": "2026-01-01T00:15:00Z"},
    ]
    result = train_model(example_records)
    print(json.dumps({
        "num_skills": result["num_skills"],
        "final_loss": result["final_loss"],
        "epochs": result["epochs"],
    }, indent=2))
