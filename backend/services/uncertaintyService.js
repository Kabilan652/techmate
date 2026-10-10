class UncertaintyService {
  static normalizeSkillId(skillId) {
    return String(skillId || "unknown_skill").trim();
  }

  static estimateSkillUncertainty(records) {
    const bySkill = new Map();

    for (const record of records) {
      const skillId = this.normalizeSkillId(record.skillId || record.skill_id);
      const isCorrect = Number(record.correct ?? record.is_correct ?? 0);

      if (!bySkill.has(skillId)) {
        bySkill.set(skillId, {
          total: 0,
          correct: 0,
          recent: [],
        });
      }

      const item = bySkill.get(skillId);
      item.total += 1;
      item.correct += isCorrect;

      item.recent.push({
        correct: isCorrect,
        timestamp: record.timestamp || record.created_at || new Date().toISOString(),
      });
    }

    const result = {};

    for (const [skillId, stats] of bySkill.entries()) {
      const accuracy = stats.total ? (stats.correct / stats.total) * 100 : 0;
      const p = stats.total ? stats.correct / stats.total : 0.5;

      // High uncertainty when few attempts or highly inconsistent answers
      const confidenceFactor = Math.min(1, stats.total / 10);
      const variance = p * (1 - p);
      const uncertainty = Math.max(
        0.05,
        (1 - confidenceFactor) * 0.5 + (1 - variance) * 0.5
      );

      // More recent attempts should reduce uncertainty slightly
      const recentWindow = stats.recent.slice(-5);
      const recentCorrect = recentWindow.reduce((sum, item) => sum + item.correct, 0);
      const recentAccuracy = recentWindow.length
        ? (recentCorrect / recentWindow.length) * 100
        : accuracy;

      const recencyBoost = recentWindow.length
        ? Math.max(0, 1 - Math.abs(recentAccuracy - 50) / 100)
        : 0.5;

      const finalUncertainty = Math.min(
        1,
        Math.max(0, uncertainty * (1 - recencyBoost * 0.4))
      );

      result[skillId] = {
        totalAttempts: stats.total,
        correctAttempts: stats.correct,
        accuracy,
        masteryEstimate: Math.max(0, Math.min(1, p)),
        uncertainty: Number(finalUncertainty.toFixed(4)),
        uncertaintyPercent: Math.round(finalUncertainty * 100),
      };
    }

    return result;
  }

  static estimateOverallUncertainty(records) {
    const skillMap = this.estimateSkillUncertainty(records);

    if (Object.keys(skillMap).length === 0) {
      return {
        skills: {},
        averageUncertainty: 0,
      };
    }

    const avg =
      Object.values(skillMap).reduce((sum, item) => sum + item.uncertainty, 0) /
      Object.values(skillMap).length;

    return {
      skills: skillMap,
      averageUncertainty: Number(avg.toFixed(4)),
    };
  }

  static getHighestUncertaintySkills(records) {
    const skillMap = this.estimateSkillUncertainty(records);

    return Object.entries(skillMap)
      .map(([skillId, value]) => ({
        skillId,
        uncertainty: value.uncertainty,
        masteryEstimate: value.masteryEstimate,
        accuracy: value.accuracy,
      }))
      .sort((a, b) => b.uncertainty - a.uncertainty);
  }
}

module.exports = UncertaintyService;
