const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

// GET /stats - Get feedback statistics
router.get('/', statsController.getStats);

module.exports = router;