
# Student Logs Application with MongoDB

A Node.js application for managing student logs and courses using MongoDB Atlas as the database.

## Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/student_logs?retryWrites=true&w=majority
```

4. Start the server:
```bash
node server.js
```

## Features

- Course management (Add/View courses)
- Student log entries (Add/View logs)
- MongoDB Atlas integration
- Error handling
- Dark/Light mode toggle

## API Endpoints

### Courses

#### GET /api/v1/courses
Returns all courses in the database.

#### POST /api/v1/courses
Add a new course.

Example using cURL:
```bash
curl -X POST http://localhost:3000/api/v1/courses \
  -H "Content-Type: application/json" \
  -d '{"id":"cs3380","display":"CS 3380"}'
```

Example course data format:
```json
{
  "id": "cs3380",      // Course ID (required)
  "display": "CS 3380" // Display name (required)
}
```

### Logs

#### GET /api/v1/logs
Returns logs filtered by courseId and uvuId if provided.

Query parameters:
- courseId (optional)
- uvuId (optional)

Example:
```
/api/v1/logs
```

#### POST /api/v1/logs
Add a new log entry.

Example using cURL:
```bash
curl -X POST http://localhost:3000/api/v1/logs \
  -H "Content-Type: application/json" \
  -d '{"courseId":"cs4660","uvuId":"10111111","text":"Log entry","date":"2024-12-13"}'
```

## Database Structure

### Courses Collection
```json
{
  "id": "cs3380",
  "display": "CS 3380"
}
```

### Logs Collection
```json
{
  "courseId": "cs4660",
  "uvuId": "10111111",
  "date": "2024-12-13",
  "text": "Log entry",
  "id": "unique-identifier"
}
```

## Adding Initial Course Data

After setting up the application, you can add courses using the POST endpoint:

```bash
# Add CS 3380
curl -X POST http://localhost:3000/api/v1/courses \
  -H "Content-Type: application/json" \
  -d '{"id":"cs3380","display":"CS 3380"}'

# Add CS 4660
curl -X POST http://localhost:3000/api/v1/courses \
  -H "Content-Type: application/json" \
  -d '{"id":"cs4660","display":"CS 4660"}'

# Add CS 4690
curl -X POST http://localhost:3000/api/v1/courses \
  -H "Content-Type: application/json" \
  -d '{"id":"cs4690","display":"CS 4690"}'
```

These commands will:
1. Insert new courses into MongoDB
2. Update the database automatically
3. Reflect in the GUI dropdown menu immediately

## Error Handling

The application includes error handling for:
- Invalid MongoDB connection
- Failed database operations
- Missing required fields
- Invalid routes
- Disabled JavaScript

## Environment Variables

Required environment variables in `.env`:
- `MONGODB_URI`: MongoDB Atlas connection string

A `.sample-env` file is included for reference.

## Notes

- JavaScript must be enabled in the browser
- MongoDB Atlas free tier is sufficient for this application
- The frontend updates automatically when database changes occur



## Code Documentation

The code includes detailed comments that were generated with AI assistance. These comments help explain:
- Function purposes and parameters
- MongoDB schema designs
- API endpoint behaviors
- Error handling strategies
- Database operations
- Frontend and backend interactions

Note: Code comments were generated with assistance from Anthropic's Claude AI to ensure clarity and comprehensive documentation.

