// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { secretKey } = require('../config/config');
const { Student } = require('../models/student');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// controllers/authController.js
const { authenticateToken } = require('../middlewares/authMiddleware');
var localStorage = require('localStorage')


// controllers/authController.js
exports.login = async (req, res) => {
  // Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
      // Check if student exists
      const student = await prisma.student.findFirst({
          where: {
              username: username
          }
      });

      if (!student) {
          return res.render('login', { error: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, student.password);

      if (!isMatch) {
          return res.render('login', { error: 'Invalid credentials' });
      }

      // JWT payload
      const payload = {
          student: {
              id: student.id
          }
      };

      // Sign JWT

      
      jwt.sign(payload, secretKey, { expiresIn: '1h' }, (err, token) => {
          if (err) throw err;
          
          localStorage.setItem('token', token);
          res.redirect(`/auth/dashboard?token=${token}&studentid=${payload.student.id}`);
        });
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
  }
};


exports.getDashboard = async (req, res) => {
  try {
    // Extract studentId from the query parameters
    const studentId = Number(req.query.studentid);
    // Fetch the course details using the studentId
    const courses = await prisma.registration.findMany({
      where: {
        studentId: studentId
      },
      include: {
        course: true
      }
    });
    const token = localStorage.getItem('token');
    // Render the dashboard view with course details
    res.render('dashboard', { courses, studentid : studentId, token: token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.register = async (req, res) => {
  // Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    // Check if username already exists
    const existingStudent = await prisma.student.findFirst({
      where: {
        username: username
      }
    });

    if (existingStudent) {
      return res.render('register', { msg: 'Username already exists' });
    }

    // Create new student
    const hashedPassword = await bcrypt.hash(password, 10);
   await prisma.student.create({
      data: {
        username: username,
        password: hashedPassword
      }
    });

    res.redirect('/auth/login');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getRegisterPage = (req, res) => {
  res.render('register', { msg: 'Welcome! Please register.' });
};

exports.getLoginPage = (req, res) => {
  // Render login page
  res.render('login', { error: null });
};
