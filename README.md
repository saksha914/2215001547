# Social Media Analytics Dashboard

A modern dashboard built with Next.js that displays social media analytics. The application consists of a frontend dashboard and a backend service that communicates with an external evaluation API.

## Project Structure

The project is organized into two main folders:
- `Backend`: Contains the Node.js/Express backend service
- `frontend-next`: Contains the Next.js frontend application
- `Output Screenschot`: Contains screenshots of the output

## Prerequisites

Before starting, make sure you have:
- Node.js (version 18 or later recommended)
- npm or yarn package manager

## Dependencies

### Backend Dependencies
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "axios": "^1.3.4"
  }
}
```

### Frontend Dependencies
```json
{
  "dependencies": {
    "next": "^13.4.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "antd": "^5.4.0",
    "@ant-design/icons": "^5.0.0",
    "axios": "^1.3.4",
    "recharts": "^2.4.0"
  }
}
```

## How to Run the Application

### 1. Setting up the Backend

1. Open your terminal and navigate to the Backend folder
2. Install all required dependencies by running:
   npm install
3. Start the backend server:
   npm run dev

The backend will start running on `http://localhost:3000`

### 2. Setting up the Frontend

1. Open a new terminal and navigate to the frontend-next folder
2. Install all required dependencies:
   npm install
3. Start the frontend development server:
   npm run dev

The frontend will start running on `http://localhost:3000`

## Features

The application provides:
- User Authentication (Sign Up / Sign In)
- Feed showing latest posts from users
- Top Users ranking based on post count
- Trending Posts section showing most commented posts
- Integration with external evaluation API

## UI Implementation with Ant Design

The frontend is built using Ant Design (antd) components to create a modern and responsive interface. Here are the key antd components used:

### Layout Components
- `Layout`: Main application layout structure
- `Menu`: Navigation menu with icons
- `Card`: Content containers for posts and user information
- `Grid`: Responsive grid system for layout organization

### Form Components
- `Form`: Authentication forms
- `Input`: Text input fields
- `Button`: Action buttons with various styles
- `Select`: Dropdown selection menus


## Data Processing Logic

```

## Application Screenshots

All Screenshots are Stored in Output ScreenShot

## API Overview

The application uses a two-tier API structure:
1. Frontend → Backend: Your frontend communicates with your local backend service
2. Backend → External API: Your backend service communicates with the evaluation API

### Available API Endpoints

Your backend provides these main endpoints:

Authentication:
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login existing user

Data:
- GET /api/users/top - Get top users by post count
- GET /api/posts/trending - Get trending posts by comment count
- GET /api/posts/latest - Get latest posts

Each endpoint supports optional query parameters like `limit` to control the amount of data returned. 
