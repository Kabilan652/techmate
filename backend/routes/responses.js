/**
 * API Routes for Student Responses
 */

const express = require('express');
const StudentResponse = require('../models/studentResponse');

const router = express.Router();

/**
 * POST /api/responses/submit
 * Submit a student's response to a quiz question
 */
router.post('/submit', async (req, res) => {
  try {
    const { userId, skillId, exerciseId, selectedOption, correctOption, responseTimeMs } = req.body;

    // Validation
    if (!userId || !skillId || exerciseId === undefined || selectedOption === undefined || correctOption === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await StudentResponse.createResponse({
      userId,
      skillId,
      exerciseId,
      selectedOption,
      correctOption,
      responseTimeMs: responseTimeMs || 0,
    });

    return res.json({
      success: true,
      response: result.data,
    });
  } catch (error) {
    console.error('Error submitting response:', error);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/responses/:userId
 * Get all responses for a user
 */
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const responses = await StudentResponse.getResponsesByUser(userId);

    return res.json({
      success: true,
      count: responses.length,
      responses,
    });
  } catch (error) {
    console.error('Error fetching responses:', error);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/responses/:userId/skill/:skillId
 * Get responses for a specific skill
 */
router.get('/:userId/skill/:skillId', async (req, res) => {
  try {
    const { userId, skillId } = req.params;
    const responses = await StudentResponse.getResponsesBySkill(userId, skillId);
    const stats = await StudentResponse.getSkillAccuracy(userId, skillId);

    return res.json({
      success: true,
      skill: skillId,
      stats,
      responses,
    });
  } catch (error) {
    console.error('Error fetching skill responses:', error);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/responses/:userId/accuracy
 * Get accuracy for all skills
 */
router.get('/:userId/accuracy', async (req, res) => {
  try {
    const { userId } = req.params;
    const allResponses = await StudentResponse.getResponsesByUser(userId);

    // Group by skill
    const skillMap = {};
    for (const response of allResponses) {
      if (!skillMap[response.skill_id]) {
        skillMap[response.skill_id] = [];
      }
      skillMap[response.skill_id].push(response);
    }

    // Calculate accuracy per skill
    const accuracyData = {};
    for (const [skillId, responses] of Object.entries(skillMap)) {
      const correctCount = responses.filter((r) => r.is_correct).length;
      accuracyData[skillId] = {
        totalAttempts: responses.length,
        correctCount,
        accuracy: (correctCount / responses.length) * 100,
      };
    }

    return res.json({
      success: true,
      accuracyBySkill: accuracyData,
    });
  } catch (error) {
    console.error('Error calculating accuracy:', error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
