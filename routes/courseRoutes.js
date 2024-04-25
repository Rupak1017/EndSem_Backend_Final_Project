// routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const { getCourses } = require('../controllers/courseController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// @route   GET /courses
// @desc    Get all courses
// @access  Public
router.get('/', getCourses);

// Add other CRUD routes for courses

module.exports = router;
