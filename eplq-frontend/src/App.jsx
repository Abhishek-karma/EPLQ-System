import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminUpload from "./pages/AdminUpload";
import Search from "./pages/Search";
import Profile from './pages/Profile';
import AdminHome from './pages/AdminHome';
import LandingPage from './pages/LandingPage';
import { Toaster } from 'react-hot-toast';

const WithNavbarLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#1f2937',
              color: '#fff',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)'
            }
          }}
        />
        <Routes>
          {/* Landing Page (without navbar) */}
          <Route path="/" element={<LandingPage />} />
          {/* All other pages with navbar */}
          <Route element={<WithNavbarLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Protected user routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/search" element={<Search />} />
            </Route>
            {/* Protected admin routes */}
            <Route element={<ProtectedRoute role="admin" />}>
              <Route path="/admin-upload" element={<AdminUpload />} />
              <Route path="/admin-home" element={<AdminHome />} />
            </Route>
            {/* 404 Page */}
            <Route path="*" element={<div className="flex items-center justify-center h-screen text-3xl text-gray-500">404 Not Found</div>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}