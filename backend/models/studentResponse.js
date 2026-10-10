/**
 * Student Response Model
 * Tracks student answers to practice exercises for DKT analysis
 */

const supabase = require('../config/supabase');

class StudentResponse {
  /**
   * Record a student's response to a practice question
   * @param {string} userId - Supabase user ID
   * @param {string} skillId - The skill/concept being tested
   * @param {string} exerciseId - The specific exercise/question ID
   * @param {number} selectedOption - The option index student selected (0-3)
   * @param {number} correctOption - The correct answer index
   * @param {number} responseTimeMs - Time taken to answer in milliseconds
   * @returns {Promise<Object>} Saved response record
   */
  static async createResponse({
    userId,
    skillId,
    exerciseId,
    selectedOption,
    correctOption,
    responseTimeMs,
  }) {
    try {
      const isCorrect = selectedOption === correctOption;
      const timestamp = new Date().toISOString();

      const { data, error } = await supabase
        .from('student_responses')
        .insert([
          {
            user_id: userId,
            skill_id: skillId,
            exercise_id: exerciseId,
            selected_option: selectedOption,
            correct_option: correctOption,
            is_correct: isCorrect,
            response_time_ms: responseTimeMs,
            created_at: timestamp,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating student response:', error);
      throw error;
    }
  }

  /**
   * Get all responses for a student
   * @param {string} userId
   * @returns {Promise<Array>} List of all responses
   */
  static async getResponsesByUser(userId) {
    try {
      const { data, error } = await supabase
        .from('student_responses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching responses:', error);
      throw error;
    }
  }

  /**
   * Get responses for a specific skill
   * @param {string} userId
   * @param {string} skillId
   * @returns {Promise<Array>}
   */
  static async getResponsesBySkill(userId, skillId) {
    try {
      const { data, error } = await supabase
        .from('student_responses')
        .select('*')
        .eq('user_id', userId)
        .eq('skill_id', skillId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching skill responses:', error);
      throw error;
    }
  }

  /**
   * Get accuracy stats for a skill
   * @param {string} userId
   * @param {string} skillId
   * @returns {Promise<Object>} { totalAttempts, correctCount, accuracy }
   */
  static async getSkillAccuracy(userId, skillId) {
    try {
      const responses = await this.getResponsesBySkill(userId, skillId);
      
      if (responses.length === 0) {
        return {
          totalAttempts: 0,
          correctCount: 0,
          accuracy: 0,
        };
      }

      const correctCount = responses.filter((r) => r.is_correct).length;
      return {
        totalAttempts: responses.length,
        correctCount,
        accuracy: (correctCount / responses.length) * 100,
      };
    } catch (error) {
      console.error('Error calculating accuracy:', error);
      throw error;
    }
  }

  /**
   * Delete all responses (for testing)
   * @param {string} userId
   */
  static async deleteUserResponses(userId) {
    try {
      const { error } = await supabase
        .from('student_responses')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting responses:', error);
      throw error;
    }
  }
}

module.exports = StudentResponse;
