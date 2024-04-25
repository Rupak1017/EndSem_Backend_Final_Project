// app.js
const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const localStorage = require('node-localstorage');
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
app.use('/auth', authRoutes);
app.use('/courses', courseRoutes);
// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

const { Student } = require('./models/student'); // Import the Student model

app.get('/', async (req, res) => {
  try {
    const students = await Student.findMany({
      select: {
        username: true // Assuming 'fullName' is the field storing student names
      }
    });

    res.render('home', { students });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
})


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
