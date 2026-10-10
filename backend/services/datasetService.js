const fs = require("fs");
const path = require("path");

class DatasetService {
  static normalizeRecord(raw) {
    const record = {
      studentId: String(raw.studentId ?? raw.student_id ?? raw.user_id ?? raw.student ?? ""),
      skillId: String(raw.skillId ?? raw.skill_id ?? raw.skill ?? raw.concept ?? "unknown_skill"),
      exerciseId: String(raw.exerciseId ?? raw.exercise_id ?? raw.question_id ?? raw.item_id ?? raw.problem_id ?? ""),
      correct: Number(raw.correct ?? raw.is_correct ?? raw.correctness ?? raw.label ?? 0),
      responseTimeMs: Number(raw.responseTimeMs ?? raw.response_time_ms ?? raw.elapsed_time_ms ?? 0),
      timestamp: raw.timestamp || raw.created_at || new Date().toISOString(),
      attempt: Number(raw.attempt ?? raw.attempt_no ?? 0),
    };

    // Ensure correct is binary 0/1
    record.correct = record.correct === 1 || record.correct === true ? 1 : 0;

    return record;
  }

  static async readJsonFile(filePath) {
    const absPath = path.resolve(filePath);

    if (!fs.existsSync(absPath)) {
      throw new Error(`Dataset file not found: ${absPath}`);
    }

    const raw = fs.readFileSync(absPath, "utf8");
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      throw new Error("Dataset JSON must be an array of records.");
    }

    return parsed.map((row) => this.normalizeRecord(row));
  }

  static async loadDataset({ source, filePath, limit = null }) {
    let records = [];

    if (source === "json") {
      records = await this.readJsonFile(filePath);
    } else if (source === "assistments") {
      const defaultPath = path.resolve(__dirname, "../data/assistments/sample_records.json");
      records = await this.readJsonFile(defaultPath);
    } else if (source === "ednet") {
      const defaultPath = path.resolve(__dirname, "../data/ednet/sample_records.json");
      if (!fs.existsSync(defaultPath)) {
        throw new Error("EDNet sample dataset not found. Add backend/data/ednet/sample_records.json first.");
      }
      records = await this.readJsonFile(defaultPath);
    } else {
      throw new Error(`Unsupported dataset source: ${source}`);
    }

    if (limit && Number(limit) > 0) {
      records = records.slice(0, Number(limit));
    }

    return records;
  }

  static getDatasetSummary(records) {
    const students = new Set();
    const skills = new Set();
    const exercises = new Set();
    let correctAnswers = 0;
    let totalAttempts = 0;

    for (const record of records) {
      students.add(record.studentId);
      skills.add(record.skillId);
      exercises.add(record.exerciseId);
      totalAttempts += 1;
      correctAnswers += record.correct;
    }

    return {
      totalStudents: students.size,
      totalSkills: skills.size,
      totalExercises: exercises.size,
      totalAttempts,
      correctAnswers,
      accuracy: totalAttempts ? (correctAnswers / totalAttempts) * 100 : 0,
      sampleIds: {
        firstStudent: Array.from(students)[0] || null,
        firstSkill: Array.from(skills)[0] || null,
      },
    };
  }
}

module.exports = DatasetService;
