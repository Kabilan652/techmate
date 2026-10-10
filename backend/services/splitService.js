class SplitService {
  static sortByTimestamp(records) {
    return [...records].sort((a, b) => {
      const aTime = new Date(a.timestamp || a.created_at || 0).getTime();
      const bTime = new Date(b.timestamp || b.created_at || 0).getTime();

      return aTime - bTime;
    });
  }

  static groupByStudent(records) {
    const grouped = new Map();

    for (const record of records) {
      const studentId = String(record.studentId || record.student_id || "unknown_student");
      if (!grouped.has(studentId)) grouped.set(studentId, []);
      grouped.get(studentId).push(record);
    }

    return grouped;
  }

  static splitStudentTimeline(studentRecords, trainRatio = 0.8) {
    if (!Array.isArray(studentRecords) || studentRecords.length === 0) {
      return { train: [], test: [] };
    }

    const sorted = this.sortByTimestamp(studentRecords);

    const cutoff = Math.max(
      1,
      Math.floor(sorted.length * trainRatio)
    );

    const train = sorted.slice(0, cutoff);
    const test = sorted.slice(cutoff);

    return { train, test };
  }

  static createChronologicalSplit(records, trainRatio = 0.8) {
    if (!Array.isArray(records) || records.length === 0) {
      return {
        train: [],
        test: [],
        summary: {
          totalStudents: 0,
          totalTrainRecords: 0,
          totalTestRecords: 0,
        },
      };
    }

    const grouped = this.groupByStudent(records);
    const train = [];
    const test = [];

    for (const [studentId, studentRecords] of grouped.entries()) {
      const { train: studentTrain, test: studentTest } = this.splitStudentTimeline(
        studentRecords,
        trainRatio
      );

      train.push(...studentTrain);
      test.push(...studentTest);
    }

    const summary = {
      totalStudents: grouped.size,
      totalTrainRecords: train.length,
      totalTestRecords: test.length,
      totalRecords: records.length,
      trainRatio,
    };

    return { train, test, summary };
  }

  static getSkillSummary(records) {
    const map = new Map();

    for (const record of records) {
      const skillId = String(record.skillId || record.skill_id || "unknown_skill");
      if (!map.has(skillId)) map.set(skillId, { count: 0, correct: 0 });

      map.get(skillId).count += 1;
      map.get(skillId).correct += record.correct || 0;
    }

    return Object.fromEntries(
      Array.from(map.entries()).map(([skillId, value]) => [
        skillId,
        {
          totalAttempts: value.count,
          correctCount: value.correct,
          accuracy: value.count ? (value.correct / value.count) * 100 : 0,
        },
      ])
    );
  }
}

module.exports = SplitService;
