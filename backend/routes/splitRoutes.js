const express = require("express");
const SplitService = require("../services/splitService");

const router = express.Router();

router.get("/summary", async (req, res) => {
  try {
    const { trainRatio = 0.8, source = "assistments" } = req.query;

    const datasetPath =
      require("path").resolve(__dirname, "../data/assistments/sample_records.json");

    const fs = require("fs");
    if (!fs.existsSync(datasetPath)) {
      return res.status(404).json({
        success: false,
        error: "Sample dataset not found. Run PS-21.2 first.",
      });
    }

    const raw = JSON.parse(fs.readFileSync(datasetPath, "utf8"));
    const { train, test, summary } = SplitService.createChronologicalSplit(
      raw.map((row) => ({
        ...row,
        studentId: row.studentId || row.student_id || row.student || "unknown_student",
        skillId: row.skillId || row.skill_id || row.skill || "unknown_skill",
        exerciseId: row.exerciseId || row.exercise_id || row.question_id || "unknown_exercise",
        correct: Number(row.correct ?? row.is_correct ?? row.label ?? 0),
      })),
      Number(trainRatio)
    );

    return res.json({
      success: true,
      source,
      split: {
        trainRatio: Number(trainRatio),
        summary,
        trainSample: train.slice(0, 5),
        testSample: test.slice(0, 5),
      },
    });
  } catch (error) {
    console.error("Split error:", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.post("/build", async (req, res) => {
  try {
    const { records, trainRatio = 0.8 } = req.body;

    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({
        success: false,
        error: "records array is required",
      });
    }

    const { train, test, summary } = SplitService.createChronologicalSplit(
      records,
      Number(trainRatio)
    );

    return res.json({
      success: true,
      trainRatio: Number(trainRatio),
      summary,
      train: train.slice(0, 10),
      test: test.slice(0, 10),
    });
  } catch (error) {
    console.error("Split build error:", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
