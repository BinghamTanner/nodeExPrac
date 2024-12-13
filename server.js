'use strict';

const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const app = express();
const PORT = 3000;

// ASCII art and startup messages
function displayStartupInfo() {
    console.log('\x1b[36m%s\x1b[0m', '\\{^_^}/ hi!');
    console.log('\nLoading db.json');
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

// In-memory database
let db = {
    logs: [],
    courses: []
};

// Load database from file
async function loadDatabase() {
    try {
        try {
            await fs.access(path.join(__dirname, 'db.json'));
        } catch {
            await fs.writeFile(
                path.join(__dirname, 'db.json'),
                JSON.stringify({ logs: [], courses: [] }, null, 2),
                'utf8'
            );
        }
        const data = await fs.readFile(path.join(__dirname, 'db.json'), 'utf8');
        db = JSON.parse(data);
        console.log('Database loaded successfully');
    } catch (error) {
        console.error('Error loading database:', error);
        process.exit(1);
    }
}

// Save database to file
async function saveDatabase() {
    try {
        await fs.writeFile(
            path.join(__dirname, 'db.json'),
            JSON.stringify(db, null, 2),
            'utf8'
        );
        console.log('Database saved successfully');
        console.log('Current logs:', db.logs);
    } catch (error) {
        console.error('Error saving database:', error);
    }
}

// API Routes
// GET courses
app.get('/api/v1/courses', (req, res) => {
    res.json(db.courses);
});

// GET logs with filtering
app.get('/api/v1/logs', (req, res) => {
    const { courseId, uvuId } = req.query;
    let filteredLogs = db.logs;
    
    if (courseId) {
        filteredLogs = filteredLogs.filter(log => log.courseId === courseId);
    }
    if (uvuId) {
        filteredLogs = filteredLogs.filter(log => log.uvuId === uvuId);
    }
    
    res.json(filteredLogs);
});

// Debug route to see all logs
app.get('/api/v1/all-logs', (req, res) => {
    res.json(db.logs);
});

// POST new log
app.post('/api/v1/logs', async (req, res) => {
    const newLog = {
        ...req.body,
        id: uuidv4()
    };
    
    db.logs.push(newLog);
    await saveDatabase();
    res.status(201).json(newLog);
});

// Test error route
app.get('/test-error', (req, res, next) => {
    throw new Error('This is a test error');
});

// Error page route
// Error page route
app.get('/error', (req, res) => {
    const errorMessage = req.query.message || 'An unknown error occurred';
    const isJSError = errorMessage.includes('JavaScript is required');
    
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
                    max-width: 500px;
                    margin: 20px;
                }
                .error-title {
                    color: #dc3545;
                    margin-bottom: 1rem;
                }
                .error-message {
                    color: #6c757d;
                    margin-bottom: 1.5rem;
                }
                .error-details {
                    font-size: 0.9rem;
                    color: #6c757d;
                    margin-top: 1rem;
                    padding-top: 1rem;
                    border-top: 1px solid #dee2e6;
                }
                .back-button {
                    background-color: #007bff;
                    color: white;
                    padding: 0.5rem 1rem;
                    border-radius: 4px;
                    text-decoration: none;
                    display: inline-block;
                    margin-top: 1rem;
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
                ${isJSError ? `
                    <div class="error-details">
                        <p>To enable JavaScript:</p>
                        <ol style="text-align: left;">
                            <li>Open your browser settings</li>
                            <li>Find the JavaScript or Content settings</li>
                            <li>Enable JavaScript</li>
                            <li>Refresh this page</li>
                        </ol>
                    </div>
                ` : ''}
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

// 404 handler - must be last route
app.use((req, res) => {
    res.redirect('/error?message=Page not found');
});

// Initialize server
async function initServer() {
    await loadDatabase();
    app.listen(PORT, () => {
        displayStartupInfo();
    });
}

initServer();