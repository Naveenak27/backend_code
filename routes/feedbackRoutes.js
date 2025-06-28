const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// GET /feedbacks - Get all feedbacks with optional filtering and sorting
router.get('/', feedbackController.getAllFeedbacks);

// GET /feedbacks/:id - Get single feedback
router.get('/:id', feedbackController.getFeedbackById);

// POST /feedbacks - Submit new feedback
router.post('/', feedbackController.createFeedback);

// PATCH /feedbacks/:id/upvote - Increment upvote count
router.patch('/:id/upvote', feedbackController.upvoteFeedback);

// PATCH /feedbacks/:id/status - Update status (admin only)
router.patch('/:id/status', feedbackController.updateFeedbackStatus);

// POST /feedbacks/:id/comments - Add comment to feedback
router.post('/:id/comments', feedbackController.addComment);

module.exports = router;