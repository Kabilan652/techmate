import json
import os
from collections import defaultdict

def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def build_student_sequences(records):
    by_student = defaultdict(list)

    for row in records:
        student_id = str(row.get("studentId") or row.get("student_id") or "unknown_student")
        by_student[student_id].append(row)

    for student_id in by_student:
        by_student[student_id].sort(key=lambda x: x.get("timestamp") or x.get("created_at") or "1970-01-01T00:00:00Z")

    return by_student

def build_skill_index(records):
    skills = sorted({str(r.get("skillId") or r.get("skill_id") or "unknown_skill") for r in records})
    skill_to_index = {skill: i for i, skill in enumerate(skills)}
    return skill_to_index, len(skills)

def build_exercise_index(records):
    exercises = sorted({str(r.get("exerciseId") or r.get("exercise_id") or "unknown_exercise") for r in records})
    exercise_to_index = {exercise: i for i, exercise in enumerate(exercises)}
    return exercise_to_index, len(exercises)

def encode_sequence(student_records, skill_to_index):
    sequence = []
    for rec in student_records:
        skill_id = str(rec.get("skillId") or rec.get("skill_id") or "unknown_skill")
        correct = int(rec.get("correct") or rec.get("is_correct") or 0)
        skill_idx = skill_to_index[skill_id]
        sequence.append((skill_idx, correct))
    return sequence
