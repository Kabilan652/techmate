const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn(
    "Supabase config missing. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env"
  );
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

class StudentResponseModel {
  static async saveResponse({
    userId,
    skillId,
    exerciseId,
    selectedOption,
    correctOption,
    responseTimeMs = 0,
  }) {
    if (!userId || !skillId || exerciseId === undefined) {
      throw new Error("userId, skillId, and exerciseId are required.");
    }

    if (selectedOption === undefined || correctOption === undefined) {
      throw new Error("selectedOption and correctOption are required.");
    }

    const isCorrect = Number(selectedOption) === Number(correctOption);
    const createdAt = new Date().toISOString();

    const { data, error } = await supabase
      .from("student_responses")
      .insert([
        {
          user_id: userId,
          skill_id: skillId,
          exercise_id: exerciseId,
          selected_option: Number(selectedOption),
          correct_option: Number(correctOption),
          is_correct: isCorrect,
          response_time_ms: Number(responseTimeMs || 0),
          created_at: createdAt,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  static async getByUser(userId) {
    const { data, error } = await supabase
      .from("student_responses")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  }

  static async getBySkill(userId, skillId) {
    const { data, error } = await supabase
      .from("student_responses")
      .select("*")
      .eq("user_id", userId)
      .eq("skill_id", skillId)
      .order("created_at", { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  }

  static async getAccuracyBySkill(userId) {
    const responses = await this.getByUser(userId);

    const grouped = {};
    for (const response of responses) {
      const key = response.skill_id;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(response);
    }

    const result = {};
    for (const [skillId, list] of Object.entries(grouped)) {
      const total = list.length;
      const correct = list.filter((r) => r.is_correct).length;
      result[skillId] = {
        totalAttempts: total,
        correctCount: correct,
        accuracy: total ? (correct / total) * 100 : 0,
      };
    }

    return result;
  }

  static async deleteAllForUser(userId) {
    const { error } = await supabase
      .from("student_responses")
      .delete()
      .eq("user_id", userId);

    if (error) {
      throw error;
    }

    return { success: true };
  }
}

module.exports = StudentResponseModel;
