const express = require("express");
const StudentResponseModel = require("../models/studentResponseModel");

const router = express.Router();

router.post("/submit", async (req, res) => {
  try {
    const {
      userId,
      skillId,
      exerciseId,
      selectedOption,
      correctOption,
      responseTimeMs,
    } = req.body;

    if (
      !userId ||
      !skillId ||
      exerciseId === undefined ||
      selectedOption === undefined ||
      correctOption === undefined
    ) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: userId, skillId, exerciseId, selectedOption, correctOption",
      });
    }

    const saved = await StudentResponseModel.saveResponse({
      userId,
      skillId,
      exerciseId,
      selectedOption,
      correctOption,
      responseTimeMs,
    });

    return res.status(201).json({
      success: true,
      response: saved,
    });
  } catch (error) {
    console.error("Submit response error:", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const responses = await StudentResponseModel.getByUser(userId);

    return res.json({
      success: true,
      count: responses.length,
      responses,
    });
  } catch (error) {
    console.error("Get responses error:", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.get("/user/:userId/skill/:skillId", async (req, res) => {
  try {
    const { userId, skillId } = req.params;
    const responses = await StudentResponseModel.getBySkill(userId, skillId);

    return res.json({
      success: true,
      skillId,
      responses,
    });
  } catch (error) {
    console.error("Get skill responses error:", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.get("/user/:userId/accuracy", async (req, res) => {
  try {
    const { userId } = req.params;
    const accuracyBySkill = await StudentResponseModel.getAccuracyBySkill(userId);

    return res.json({
      success: true,
      userId,
      accuracyBySkill,
    });
  } catch (error) {
    console.error("Get accuracy error:", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
