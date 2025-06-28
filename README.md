Feedback Management API
A RESTful API built with Express.js and Supabase for managing user feedback, comments, and statistics. This API provides comprehensive feedback management functionality with features like upvoting, commenting, status tracking, and analytics.
🚀 Features
    • Feedback Management: Create, read, update feedback entries 
    • Voting System: Upvote feedback to show popularity 
    • Comment System: Add comments to feedback entries 
    • Status Tracking: Track feedback progress (Open, Planned, In Progress, Done) 
    • Search & Filter: Search by keywords, filter by status/category 
    • Analytics: Get comprehensive statistics on feedback data 
    • Categorization: Organize feedback by type (Feature, Bug, UI, Enhancement) 
🛠️ Tech Stack
    • Backend: Node.js, Express.js 
    • Database: Supabase (PostgreSQL) 
    • Environment: dotenv for configuration 
    • Architecture: MVC pattern with separate routes and controllers 
📁 Project Structure
feedback-api/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   ├── feedbackController.js # Feedback business logic
│   └── statsController.js    # Statistics logic
├── routes/
│   ├── feedbackRoutes.js     # Feedback endpoints
│   └── statsRoutes.js        # Statistics endpoints
├── .env                      # Environment variables (create this)
├── .gitignore               # Git ignore rules
├── server.js                # Main application file
├── package.json             # Dependencies and scripts
└── README.md                # This file


Environment Setup
Create a .env file in the root directory:
env
# Server Configuration
PORT=5000

# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Environment
NODE_ENV=development
Database Setup
Create the following tables in your Supabase database:
Feedbacks Table
sql
CREATE TABLE feedbacks (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR NOT NULL CHECK (category IN ('Feature', 'Bug', 'UI', 'Enhancement')),
  status VARCHAR NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'Planned', 'In Progress', 'Done')),
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
Comments Table
sql
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  feedback_id INTEGER REFERENCES feedbacks(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  author VARCHAR DEFAULT 'Anonymous',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
start the server
bash
# Development mode
npm run dev

# Production mode
npm start
The server will start on http://localhost:5000
📚 API Documentation
Base URL
http://localhost:5000
Health Check
http
GET /health
Feedback Endpoints
Get All Feedbacks
http
GET /feedbacks
Query Parameters:
    • status - Filter by status (Open, Planned, In Progress, Done) 
    • category - Filter by category (Feature, Bug, UI, Enhancement) 
    • search - Search in title and description 
    • sort - Sort by (upvotes, newest, oldest) 
Example:
http
GET /feedbacks?status=Open&sort=upvotes&search=login
Get Single Feedback
http
GET /feedbacks/:id
Create Feedback
http
POST /feedbacks
Content-Type: application/json

{
  "title": "Add dark mode",
  "description": "Please add a dark mode option to the application",
  "category": "Feature"
}
Upvote Feedback
http
PATCH /feedbacks/:id/upvote
Update Feedback Status (Admin)
http
PATCH /feedbacks/:id/status
Content-Type: application/json

{
  "status": "In Progress"
}
Add Comment
http
POST /feedbacks/:id/comments
Content-Type: application/json

{
  "comment": "Great idea! I'd love to see this implemented.",
  "author": "John Doe"
}
Statistics Endpoint
Get Statistics
http
GET /stats
Returns comprehensive statistics including:
    • Total feedback count 
    • Count by status 
    • Count by category 
    • Total upvotes 
🔒 Data Validation
The API includes comprehensive validation:
    • Required fields: title, description, category 
    • Valid categories: Feature, Bug, UI, Enhancement 
    • Valid statuses: Open, Planned, In Progress, Done 
    • Input sanitization: Automatic trimming of whitespace 
📝 Response Format
All API responses follow this consistent format:
json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "total": 10,
  "errors": []
}
🚨 Error Handling
The API provides detailed error responses:
json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["Title is required", "Invalid category"]
}
Common HTTP status codes:
    • 200 - Success 
    • 201 - Created 
    • 400 - Bad Request (validation errors) 
    • 404 - Not Found 
    • 500 - Internal Server Error
