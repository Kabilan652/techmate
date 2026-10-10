const express = require("express");
const MasteryService = require("../services/masteryService");

const router = express.Router();

router.post("/estimate", async (req, res) => {
  try {
    const { records } = req.body;

    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({
        success: false,
        error: "records array is required",
      });
    }

    const estimation = MasteryService.estimateMasteryForStudent(records);

    return res.json({
      success: true,
      estimation,
    });
  } catch (error) {
    console.error("Mastery estimation error:", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.post("/priority", async (req, res) => {
  try {
    const { records } = req.body;

    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({
        success: false,
        error: "records array is required",
      });
    }

    const priority = MasteryService.estimateNextSkillPriority(records);

    return res.json({
      success: true,
      priority,
    });
  } catch (error) {
    console.error("Priority estimation error:", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
