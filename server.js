
// server.js
'use strict';

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Course = require('./models/Course');
const Log = require('./models/Log');
const path = require('path');

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB Connected Successfully');
    console.log('Connection String:', process.env.MONGODB_URI.replace(/:[^:]*@/, ':****@')); // Hides password
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// ASCII art and startup messages
function displayStartupInfo() {
  console.log('\x1b[36m%s\x1b[0m', '\\{^_^}/ hi!');
  console.log('\nConnecting to MongoDB Atlas');
  console.log('Done\n');
  console.log('\x1b[32m%s\x1b[0m', 'Resources');
  console.log(`http://localhost:${PORT}/api/v1/logs`);
  console.log(`http://localhost:${PORT}/api/v1/courses\n`);
  console.log('\x1b[32m%s\x1b[0m', 'Routes');
  console.log('GET    /api/v1/logs');
  console.log('GET    /api/v1/courses');
  console.log('POST   /api/v1/logs\n');
  console.log('\x1b[32m%s\x1b[0m', 'Home');
  console.log(`http://localhost:${PORT}\n`);
}

// Middleware
app.use(express.json());
app.use(express.static('public'));

// API Routes
// GET courses
app.get('/api/v1/courses', async (req, res) => {
  try {
    const courses = await Course.find({}, { _id: 0, __v: 0 });
    res.json(courses);
  } catch (error) {
    res.status(500).redirect('/error?message=Error fetching courses');
  }
});

// GET logs with filtering
app.get('/api/v1/logs', async (req, res) => {
  try {
    const { courseId, uvuId } = req.query;
    const filter = {};
    
    if (courseId) filter.courseId = courseId;
    if (uvuId) filter.uvuId = uvuId;
    
    const logs = await Log.find(filter, { _id: 0, __v: 0 });
    res.json(logs);
  } catch (error) {
    res.status(500).redirect('/error?message=Error fetching logs');
  }
});

// POST new log
app.post('/api/v1/logs', async (req, res) => {
  try {
    const newLog = new Log({
      ...req.body,
      id: uuidv4()
    });
    
    await newLog.save();
    res.status(201).json(newLog);
  } catch (error) {
    res.status(500).redirect('/error?message=Error creating log');
  }
});


// POST new course
app.post('/api/v1/courses', async (req, res) => {
  try {
    console.log('Attempting to create course:', req.body);
    const newCourse = new Course({
      id: req.body.id,
      display: req.body.display
    });
    
    const savedCourse = await newCourse.save();
    console.log('Course saved successfully:', savedCourse);
    res.status(201).json(savedCourse);
  } catch (error) {
    console.error('Error saving course:', error);
    res.status(500).redirect('/error?message=' + encodeURIComponent(error.message));
  }
});

// Error page route
app.get('/error', (req, res) => {
    const errorMessage = req.query.message || 'An unknown error occurred';
    res.status(500).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Error - Student Logs</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    background-color: #f8f9fa;
                }
                .error-container {
                    background-color: white;
                    padding: 2rem;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    text-align: center;
                }
                .error-title {
                    color: #dc3545;
                    margin-bottom: 1rem;
                }
                .error-message {
                    color: #6c757d;
                    margin-bottom: 1.5rem;
                }
                .back-button {
                    background-color: #007bff;
                    color: white;
                    padding: 0.5rem 1rem;
                    border-radius: 4px;
                    text-decoration: none;
                }
                .back-button:hover {
                    background-color: #0056b3;
                }
            </style>
        </head>
        <body>
            <div class="error-container">
                <h1 class="error-title">Error</h1>
                <p class="error-message">${errorMessage}</p>
                <a href="/" class="back-button">Return to Home</a>
            </div>
        </body>
        </html>
    `);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.redirect('/error?message=' + encodeURIComponent(err.message || 'Something went wrong!'));
});

// 404 handler
app.use((req, res) => {
    res.redirect('/error?message=Page not found');
});

// Initialize server
app.listen(PORT, () => {
    displayStartupInfo();
});