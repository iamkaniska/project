import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './components/pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import Profile from './components/profile/Profile';
import EditProfile from './components/profile/EditProfile';
import Questions from './components/questions/Questions';
import GenerateQuestions from './components/questions/GenerateQuestions';
import Interviews from './components/interviews/Interviews';
import InterviewDetail from './components/interviews/InterviewDetail';
import CreateInterview from './components/interviews/CreateInterview';
import AdminPanel from './components/admin/AdminPanel';
import NotFound from './components/pages/NotFound';
import PrivateRoute from './components/routing/PrivateRoute';
import RoleRoute from './components/routing/RoleRoute';
import { AuthProvider } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';
import Alert from './components/layout/Alert';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <AlertProvider>
        <Router>
          <div className="app-container">
            <Navbar />
            <Alert />
            <main className="container">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } />
                <Route path="/profile" element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } />
                <Route path="/edit-profile" element={
                  <PrivateRoute>
                    <EditProfile />
                  </PrivateRoute>
                } />
                <Route path="/questions" element={
                  <PrivateRoute>
                    <Questions />
                  </PrivateRoute>
                } />
                <Route path="/generate-questions" element={
                  <PrivateRoute>
                    <GenerateQuestions />
                  </PrivateRoute>
                } />
                <Route path="/interviews" element={
                  <PrivateRoute>
                    <Interviews />
                  </PrivateRoute>
                } />
                <Route path="/interviews/:id" element={
                  <PrivateRoute>
                    <InterviewDetail />
                  </PrivateRoute>
                } />
                <Route path="/create-interview" element={
                  <RoleRoute roles={[ 'admin']}>
                    <CreateInterview />
                  </RoleRoute>
                } />
                <Route path="/admin" element={
                  <RoleRoute roles={['admin']}>
                    <AdminPanel />
                  </RoleRoute>
                } />
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AlertProvider>
    </AuthProvider>
  );
}

export default App;