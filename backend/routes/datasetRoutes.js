const express = require("express");
const path = require("path");
const DatasetService = require("../services/datasetService");

const router = express.Router();

router.get("/summary", async (req, res) => {
  try {
    const { source = "assistments", limit } = req.query;

    const filePath =
      req.query.filePath ||
      path.resolve(__dirname, "../data/assistments/sample_records.json");

    const records = await DatasetService.loadDataset({
      source,
      filePath,
      limit,
    });

    const summary = DatasetService.getDatasetSummary(records);

    return res.json({
      success: true,
      source,
      summary,
      totalRecords: records.length,
      sample: records.slice(0, 5),
    });
  } catch (error) {
    console.error("Dataset summary error:", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.post("/load", async (req, res) => {
  try {
    const { source = "assistments", filePath, limit } = req.body;

    if (!source) {
      return res.status(400).json({
        success: false,
        error: "source is required",
      });
    }

    const records = await DatasetService.loadDataset({
      source,
      filePath,
      limit,
    });

    const summary = DatasetService.getDatasetSummary(records);

    return res.json({
      success: true,
      source,
      summary,
      totalRecords: records.length,
    });
  } catch (error) {
    console.error("Dataset load error:", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
