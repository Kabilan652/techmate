const express = require("express");
const DKTService = require("../services/dktService");

const router = express.Router();

router.post("/train", async (req, res) => {
  try {
    const { records } = req.body;

    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({
        success: false,
        error: "records array is required",
      });
    }

    const result = await DKTService.trainFromRecords(records);

    return res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("DKT route error:", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.get("/health", (req, res) => {
  return res.json({
    success: true,
    status: "DKT service ready",
  });
});

module.exports = router;
