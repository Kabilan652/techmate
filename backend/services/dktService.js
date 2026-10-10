const { spawnSync } = require("child_process");
const path = require("path");
const fs = require("fs");

class DKTService {
  static trainFromRecords(records) {
    const scriptPath = path.resolve(__dirname, "../dkt/train_dkt.py");

    if (!fs.existsSync(scriptPath)) {
      throw new Error("DKT training script not found at backend/dkt/train_dkt.py");
    }

    const payloadPath = path.resolve(__dirname, "../dkt/records.json");

    fs.writeFileSync(payloadPath, JSON.stringify(records, null, 2), "utf8");

    const result = spawnSync("python", [scriptPath, payloadPath], {
      cwd: path.resolve(__dirname, "../"),
      encoding: "utf8",
      timeout: 120000,
    });

    if (result.error) {
      throw result.error;
    }

    if (result.status !== 0) {
      const stderr = result.stderr || "";
      throw new Error(`DKT training failed: ${stderr || "unknown error"}`);
    }

    const cleaned = result.stdout.trim();

    try {
      return JSON.parse(cleaned);
    } catch (error) {
      throw new Error(`Failed to parse Python training output: ${stderr || cleaned}`);
    }
  }
}

module.exports = DKTService;
