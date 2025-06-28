# 🚀 Feedback Management API

A simple RESTful API built with Express.js and Supabase for managing user feedback, comments, and statistics.

## ✨ Features

- **Feedback Management** - Create, read, and update feedback
- **Voting System** - Upvote feedback to show popularity  
- **Comment System** - Add comments to feedback entries
- **Status Tracking** - Track progress (Open, Planned, In Progress, Done)
- **Search & Filter** - Search and filter feedback by various criteria
- **Analytics** - Get statistics on feedback data

## 🛠️ Tech Stack

- **Node.js** + **Express.js**
- **Supabase** (PostgreSQL database)
- **dotenv** for environment configuration

## 📁 Project Structure

```
feedback-api/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   ├── feedbackController.js # Feedback logic
│   └── statsController.js    # Statistics logic
├── routes/
│   ├── feedbackRoutes.js     # Feedback endpoints
│   └── statsRoutes.js        # Statistics endpoints
├── .env                      # Environment variables
├── server.js                 # Main application file
└── package.json             # Dependencies
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file:
```env
PORT=5000
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
NODE_ENV=development
```

### 3. Database Setup
Create these tables in Supabase:

**Feedbacks Table:**
```sql
CREATE TABLE feedbacks (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR NOT NULL CHECK (category IN ('Feature', 'Bug', 'UI', 'Enhancement')),
  status VARCHAR NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'Planned', 'In Progress', 'Done')),
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Comments Table:**
```sql
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  feedback_id INTEGER REFERENCES feedbacks(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  author VARCHAR DEFAULT 'Anonymous',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. Start the Server
```bash
# Development
npm run dev

# Production
npm start
```

Server runs on `http://localhost:5000`

## 📚 API Endpoints

### Feedback Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/feedbacks` | Get all feedback (with filters) |
| `GET` | `/feedbacks/:id` | Get single feedback |
| `POST` | `/feedbacks` | Create new feedback |
| `PATCH` | `/feedbacks/:id/upvote` | Upvote feedback |
| `PATCH` | `/feedbacks/:id/status` | Update status |
| `POST` | `/feedbacks/:id/comments` | Add comment |

### Statistics
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/stats` | Get application statistics |

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Check API status |

## 🔍 Usage Examples

### Get All Feedbacks with Filters
```http
GET /feedbacks?status=Open&category=Feature&sort=upvotes
```

### Create New Feedback
```http
POST /feedbacks
Content-Type: application/json

{
  "title": "Add dark mode",
  "description": "Please add a dark mode option",
  "category": "Feature"
}
```

### Add Comment
```http
POST /feedbacks/1/comments
Content-Type: application/json

{
  "comment": "Great idea!",
  "author": "John Doe"
}
```

### Update Status (Admin)
```http
PATCH /feedbacks/1/status
Content-Type: application/json

{
  "status": "In Progress"
}
```

## 📊 Response Format

All responses follow this format:
```json
{
  "success": true,
  "message": "Operation completed successfully", 
  "data": {...},
  "total": 10
}
```

Error responses:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["Title is required"]
}
```

## 🎯 Query Parameters

### Filtering Feedbacks
- `status` - Filter by status (Open, Planned, In Progress, Done)
- `category` - Filter by category (Feature, Bug, UI, Enhancement)  
- `search` - Search in title and description
- `sort` - Sort by (upvotes, newest, oldest)

## 🔒 Validation Rules

- **Title**: Required, minimum length
- **Description**: Required, minimum length
- **Category**: Must be one of: Feature, Bug, UI, Enhancement
- **Status**: Must be one of: Open, Planned, In Progress, Done

## 🚨 HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error


