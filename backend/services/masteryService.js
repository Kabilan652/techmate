class MasteryService {
  static normalizeSkillId(skillId) {
    return String(skillId || "unknown_skill").trim();
  }

  static calculateSkillMastery(records) {
    const bySkill = new Map();

    for (const record of records) {
      const skillId = this.normalizeSkillId(record.skillId || record.skill_id);
      if (!bySkill.has(skillId)) {
        bySkill.set(skillId, {
          total: 0,
          correct: 0,
          recent: [],
        });
      }

      const bucket = bySkill.get(skillId);
      bucket.total += 1;
      bucket.correct += Number(record.correct ?? record.is_correct ?? 0);
      bucket.recent.push({
        correct: Number(record.correct ?? record.is_correct ?? 0),
        timestamp: record.timestamp || record.created_at || new Date().toISOString(),
      });
    }

    const result = {};
    for (const [skillId, stats] of bySkill.entries()) {
      const accuracy = stats.total ? (stats.correct / stats.total) * 100 : 0;

      // recency weighting
      let recentWeight = 0;
      let recentTotal = 0;

      for (const item of stats.recent.slice(-5)) {
        recentWeight += item.correct;
        recentTotal += 1;
      }

      const recentAccuracy = recentTotal
        ? (recentWeight / recentTotal) * 100
        : accuracy;

      // smooth mastery between 0 and 1
      const mastery = Math.max(0, Math.min(1, (accuracy * 0.7 + recentAccuracy * 0.3) / 100));

      result[skillId] = {
        totalAttempts: stats.total,
        correctAttempts: stats.correct,
        accuracy,
        recentAccuracy,
        mastery,
        masteryPercent: Math.round(mastery * 100),
      };
    }

    return result;
  }

  static estimateMasteryForStudent(studentResponses) {
    const skillMap = this.calculateSkillMastery(studentResponses);

    return {
      skills: skillMap,
      overallMastery:
        Object.values(skillMap).length > 0
          ? Object.values(skillMap).reduce((sum, item) => sum + item.mastery, 0) /
            Object.values(skillMap).length
          : 0,
    };
  }

  static estimateNextSkillPriority(studentResponses) {
    const skills = this.calculateSkillMastery(studentResponses);

    return Object.entries(skills)
      .map(([skillId, value]) => ({
        skillId,
        masteryPercent: value.masteryPercent,
        accuracy: value.accuracy,
        recentAccuracy: value.recentAccuracy,
      }))
      .sort((a, b) => a.masteryPercent - b.masteryPercent);
  }
}

module.exports = MasteryService;
