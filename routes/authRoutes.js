// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { login, getDashboard, register, getRegisterPage, getLoginPage } = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { Student } = require('../models/student');
const { PrismaClient } = require('@prisma/client');
const { render } = require('ejs');
const prisma = new PrismaClient();
var localStorage = require('localStorage')

router.get('/login', getLoginPage);


// @route   POST /auth/login
// @desc    Authenticate student & get token
// @access  Public
router.post('/login', [
  check('username', 'Please include a valid username').exists(),
  check('password', 'Password is required').exists()
], login);


router.get('/register', getRegisterPage);

// @route   POST /auth/register
// @desc    Register a new student
// @access  Public
router.post('/register', register);

// @route   GET /auth/dashboard
// @desc    Get student dashboard
// @access  Private
router.get('/dashboard',authenticateToken, getDashboard);



router.get('/courses_reg',(req, res) =>{
res.render('courses_reg')
});


router.post('/add_course', async (req, res) =>{
 
  const existingCourse= await prisma.Course.findFirst({
    where: {
      name: req.body.courseName,
    }
  });

  if(!existingCourse){
    await prisma.Course.create({
      data: {
        name: req.body.courseName,
        instructor: req.body.instructorName
      }
    });
  
  }
  
 const studentid =Number(req.body.id);
 const courseid =Number(req.body.courseId);

  await prisma.registration.create({
    data: {
      studentId: studentid, 
      courseId: courseid
    }
  });
  const token = localStorage.getItem('token');

  res.redirect(`/auth/dashboard?token=${token}&studentid=${studentid}`);
  });


  router.post('/delete_course', async (req, res) => {
    try {
        const courseId = Number(req.body.courseId);
        const studentid = Number(req.body.studentid); // Assuming req.body.id contains the student ID

        await prisma.registration.deleteMany({
            where: {
                courseId: courseId,
                studentId: studentid
            }
        });
        const token = localStorage.getItem('token');

        res.redirect(`/auth/dashboard?token=${token}&studentid=${studentid}`);

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});



module.exports = router;
