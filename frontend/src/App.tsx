import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import DashboardPage from './pages/DashboardPage';
import RepositoriesPage from './pages/RepositoriesPage';
import RepositoryDetailPage from './pages/RepositoryDetailPage';
import VulnerabilitiesPage from './pages/VulnerabilitiesPage';
import VulnerabilityDetailPage from './pages/VulnerabilityDetailPage';
import HowItWorksPage from './pages/HowItWorksPage';
import PricingPage from './pages/PricingPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#030712', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <div className="spinner" />
        <span style={{ color: '#6b7280', fontSize: 14 }}>Loading...</span>
      </div>
    );
  }

  if (!token) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
}

function AppRoutes() {
  const { token } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />

      {/* Standalone public pages (also work in-app) */}
      <Route path="/how-it-works" element={token ? <ProtectedRoute><HowItWorksPage /></ProtectedRoute> : <HowItWorksPage />} />
      <Route path="/pricing" element={token ? <ProtectedRoute><PricingPage /></ProtectedRoute> : <PricingPage />} />

      {/* Protected app routes */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/repositories" element={<ProtectedRoute><RepositoriesPage /></ProtectedRoute>} />
      <Route path="/repositories/:id" element={<ProtectedRoute><RepositoryDetailPage /></ProtectedRoute>} />
      <Route path="/vulnerabilities" element={<ProtectedRoute><VulnerabilitiesPage /></ProtectedRoute>} />
      <Route path="/vulnerabilities/:id" element={<ProtectedRoute><VulnerabilityDetailPage /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

      {/* Root redirect */}
      <Route path="/" element={<Navigate to={token ? '/dashboard' : '/login'} replace />} />
      {/* 404 → redirect home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
