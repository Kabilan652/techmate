import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import Layout from './components/Layout';

import ChatPage from './pages/ChatPage';
import NotesPage from './pages/NotesPage';
import QuizPage from './pages/QuizPage';
import CodePage from './pages/CodePage';
import RoadmapPage from './pages/RoadmapPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import LandingPage from './pages/LandingPage';
import CourseProgress from './pages/CourseProgress';
import AdaptiveLearningPage from './pages/AdaptiveLearningPage';
import LiveClassroomPage from './pages/LiveClassroomPage';
import AIJobMatchingPage from './pages/AIJobMatchingPage';

import { useAuth } from './context/AuthContext';

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="mt-4 text-sm text-gray-600">
            Loading TechMate AI...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/signup" element={<SignupPage />} />

        {/* Protected application routes with shared layout */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/dashboard"
            element={<DashboardPage />}
          />

          <Route
            path="/chat"
            element={<ChatPage />}
          />

          <Route
            path="/notes"
            element={<NotesPage />}
          />

          <Route
            path="/quiz"
            element={<QuizPage />}
          />

          <Route
            path="/code"
            element={<CodePage />}
          />

          <Route
            path="/roadmap"
            element={<RoadmapPage />}
          />

          <Route
            path="/adaptive"
            element={<AdaptiveLearningPage />}
          />

          <Route
            path="/course"
            element={<CourseProgress />}
          />

          {/* Live Classroom */}
          <Route
            path="/live-classroom"
            element={<LiveClassroomPage />}
          />

          {/* AI Job Matching */}
          <Route
            path="/job-matching"
            element={<AIJobMatchingPage />}
          />
        </Route>

        {/* Fallback route */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
