const express = require('express');
const router = express.Router();
const timestampController = require('../controllers/timestamp');

// GET /api/
// Returns the current time
router.get('/', timestampController.getCurrentTime);

// GET /api/:date
// Returns the time for the given date string or timestamp
router.get('/:date', timestampController.getParsedTime);

module.exports = router;
