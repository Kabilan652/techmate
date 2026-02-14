# TechMate - System Design Document

## 1. Project Overview

TechMate is an AI-powered educational platform designed to assist students and developers in their learning journey. The application provides interactive features including AI chat assistance, automated notes generation, quiz creation, code help, and personalized learning roadmaps.

### Tech Stack

**Frontend:**
- React 19.2.0
- React Router DOM 7.13.0
- Vite (Build tool)
- Tailwind CSS (Styling)
- Lucide React (Icons)

**Backend:**
- Node.js with Express 5.2.1
- MongoDB with Mongoose 9.2.1
- JWT Authentication
- CORS enabled
- Morgan (Logging)

## 2. System Architecture

### High-Level Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│  React Frontend │◄───────►│  Express API    │◄───────►│    MongoDB      │
│  (Port 5173)    │  HTTP   │  (Port 5000)    │         │    Database     │
│                 │         │                 │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

### Application Layers

1. **Presentation Layer** (Frontend)
   - React components
   - Client-side routing
   - State management (localStorage)
   - UI/UX with Tailwind CSS

2. **API Layer** (Backend)
   - RESTful endpoints
   - Request validation
   - Authentication middleware
   - Error handling

3. **Business Logic Layer**
   - Controllers for each feature
   - Service logic
   - Data transformation

4. **Data Layer**
   - Mongoose models
   - Database operations
   - Data validation

## 3. Frontend Architecture

### Component Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.jsx      # Main layout with sidebar navigation
│   ├── Dashboard.jsx   # Dashboard statistics display
│   ├── ChatInterface.jsx
│   ├── CodeHelper.jsx
│   ├── LearningRoadmap.jsx
│   ├── NotesGenerator.jsx
│   └── QuizGenerator.jsx
├── pages/              # Route-level page components
│   ├── LandingPage.jsx
│   ├── LoginPage.jsx
│   ├── SignupPage.jsx
│   ├── DashboardPage.jsx
│   ├── ChatPage.jsx
│   ├── NotesPage.jsx
│   ├── QuizPage.jsx
│   ├── CodePage.jsx
│   └── RoadmapPage.jsx
├── App.jsx             # Main app with routing
└── main.jsx            # Application entry point
```

### Routing Strategy

- **Public Routes:** Landing, Login, Signup
- **Protected Routes:** All feature pages (Dashboard, Chat, Notes, Quiz, Code, Roadmap)
- **Route Protection:** Token-based authentication check via localStorage
- **Layout Wrapper:** Nested routes use shared Layout component with sidebar

### State Management

- **Authentication:** JWT token stored in localStorage
- **User Data:** User object cached in localStorage
- **Component State:** React hooks (useState, useEffect)
- **Navigation:** React Router DOM for SPA routing

## 4. Backend Architecture

### API Structure

```
backend/
├── controllers/        # Request handlers
│   ├── authController.js
│   ├── chatController.js
│   ├── codeController.js
│   ├── dashboardController.js
│   ├── noteController.js
│   ├── quizController.js
│   └── roadmapController.js
├── models/            # Mongoose schemas
│   ├── User.js
│   ├── Note.js
│   └── Quiz.js
├── routes/            # API route definitions
│   ├── authRoutes.js
│   ├── chatRoutes.js
│   ├── codeRoutes.js
│   ├── dashboardRoutes.js
│   ├── noteRoutes.js
│   ├── quizRoutes.js
│   └── roadmapRoutes.js
└── server.js          # Express app configuration
```

### API Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

#### Dashboard
- `GET /api/dashboard/stats` - Fetch user statistics and activity

#### Notes
- `POST /api/notes` - Generate notes for a topic
- `GET /api/notes` - Retrieve saved notes
- `DELETE /api/notes/:id` - Delete a note

#### Quiz
- `POST /api/quiz/generate` - Generate quiz questions
- `GET /api/quiz` - Retrieve quizzes
- `POST /api/quiz/submit` - Submit quiz answers

#### Code Helper
- `POST /api/code/help` - Get code assistance
- `POST /api/code/debug` - Debug code snippets

#### Chat
- `POST /api/chat` - Send message to AI assistant
- `GET /api/chat/history` - Retrieve chat history

#### Roadmap
- `GET /api/roadmap` - Get learning roadmap
- `POST /api/roadmap/progress` - Update progress

### Middleware Stack

1. **CORS** - Cross-origin resource sharing
2. **express.json()** - JSON body parser
3. **morgan** - HTTP request logger
4. **JWT Verification** - Authentication middleware (to be implemented)

## 5. Data Models

### User Model
```javascript
{
  id: Number,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String,
  level: String,
  avatar: String,
  createdAt: Date
}
```

### Note Model
```javascript
{
  topic: String (required),
  content: String (required),
  keyPoints: [String],
  createdAt: Date (default: now)
}
```

### Quiz Model
```javascript
{
  topic: String (required),
  questions: [{
    question: String,
    options: [String],
    correctAnswer: String,
    explanation: String
  }],
  createdAt: Date (default: now)
}
```

## 6. Key Features

### 1. Dashboard
- User statistics (topics learned, quizzes taken, average score)
- Learning streak tracking
- Recent activity feed
- Progress visualization
- Course progress tracking

### 2. AI Chat Assistant
- Real-time conversational AI
- Context-aware responses
- Learning assistance
- Question answering

### 3. Notes Generator
- AI-powered note generation
- Topic-based organization
- Key points extraction
- Save and retrieve functionality

### 4. Quiz Generator
- Automated quiz creation
- Multiple choice questions
- Instant feedback
- Score tracking
- Explanations for answers

### 5. Code Helper
- Code debugging assistance
- Syntax help
- Best practices suggestions
- Code optimization tips

### 6. Learning Roadmap
- Personalized learning paths
- Progress tracking
- Course recommendations
- Milestone achievements

## 7. Security Considerations

### Current Implementation
- CORS configuration for frontend origin
- JWT token-based authentication
- Password validation (basic)

### Recommended Enhancements
- Password hashing (bcrypt)
- JWT token expiration and refresh
- Rate limiting on API endpoints
- Input sanitization and validation
- HTTPS in production
- Environment variable protection
- SQL injection prevention (using Mongoose)
- XSS protection
- CSRF tokens for state-changing operations

## 8. Authentication Flow

```
1. User submits credentials → POST /api/auth/login
2. Server validates credentials
3. Server generates JWT token
4. Token sent to client
5. Client stores token in localStorage
6. Client includes token in subsequent requests
7. Server validates token on protected routes
```

## 9. Development Workflow

### Frontend Development
```bash
cd frontend
npm install
npm run dev          # Start development server (port 5173)
npm run build        # Production build
npm run lint         # Code linting
```

### Backend Development
```bash
cd backend
npm install
node server.js       # Start server (port 5000)
```

### Environment Variables
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/techmate
JWT_SECRET=your_secret_key
NODE_ENV=development
```

## 10. Database Schema Design

### Collections

1. **users** - User accounts and profiles
2. **notes** - Generated and saved notes
3. **quizzes** - Quiz questions and metadata
4. **chat_history** - AI chat conversations
5. **progress** - User learning progress
6. **roadmaps** - Learning path data

### Relationships
- User → Notes (one-to-many)
- User → Quizzes (one-to-many)
- User → Chat History (one-to-many)
- User → Progress (one-to-one)

## 11. Performance Considerations

### Frontend Optimization
- Code splitting with React.lazy()
- Image optimization
- Lazy loading for routes
- Memoization for expensive computations
- Debouncing for search/input operations

### Backend Optimization
- Database indexing on frequently queried fields
- Response caching for static data
- Pagination for large datasets
- Connection pooling for MongoDB
- Compression middleware

## 12. Deployment Architecture

### Recommended Setup

```
┌─────────────────┐
│   Vercel/Netlify│  ← Frontend (Static hosting)
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   Heroku/Railway│  ← Backend API
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  MongoDB Atlas  │  ← Database (Cloud)
└─────────────────┘
```

### Environment Separation
- Development: Local MongoDB, local servers
- Staging: Cloud database, test deployment
- Production: Full cloud infrastructure

## 13. Future Enhancements

### Phase 1 (Core Features)
- Complete AI integration (OpenAI/Gemini API)
- Real-time chat with WebSockets
- Enhanced authentication (OAuth, 2FA)
- Email verification

### Phase 2 (Advanced Features)
- Video content integration
- Collaborative learning (study groups)
- Gamification (badges, leaderboards)
- Mobile app (React Native)

### Phase 3 (Scale & Analytics)
- Analytics dashboard for instructors
- Content recommendation engine
- Multi-language support
- Advanced progress tracking

## 14. Testing Strategy

### Frontend Testing
- Unit tests: Jest + React Testing Library
- Component tests: Vitest
- E2E tests: Cypress/Playwright
- Visual regression: Chromatic

### Backend Testing
- Unit tests: Jest/Mocha
- Integration tests: Supertest
- API tests: Postman/Newman
- Load testing: Artillery/k6

## 15. Monitoring & Logging

### Application Monitoring
- Error tracking: Sentry
- Performance monitoring: New Relic/DataDog
- Uptime monitoring: Pingdom/UptimeRobot

### Logging Strategy
- Morgan for HTTP request logging
- Winston for application logging
- Log levels: error, warn, info, debug
- Centralized logging: ELK Stack/CloudWatch

## 16. API Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## 17. Conclusion

TechMate is designed as a scalable, modular educational platform with clear separation of concerns. The architecture supports future growth and feature additions while maintaining code quality and performance. The system prioritizes user experience, security, and maintainability.