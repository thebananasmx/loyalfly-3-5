import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import MainLayout from './components/MainLayout';
import AppLayout from './components/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import DocsLayout from './components/DocsLayout';
import AnalyticsTracker from './components/AnalyticsTracker';

import LandingPage from './pages/LandingPage';
import PricingPage from './pages/PricingPage';
import TermsPage from './pages/TermsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CardEditorPage from './pages/CardEditorPage';
import StyleGuidePage from './pages/StyleGuidePage';
import PublicCardPage from './pages/PublicCardPage';
import NewCustomerPage from './pages/NewCustomerPage';
import ChangelogPage from './pages/ChangelogPage';
import EditCustomerPage from './pages/EditCustomerPage';
import SurveyPage from './pages/SurveyPage';
import PublicVotePage from './pages/PublicVotePage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import SuperAdminProtectedRoute from './components/SuperAdminProtectedRoute';
import AdminLayout from './components/AdminLayout';
import UserFlowsPage from './pages/UserFlowsPage';

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <AnalyticsTracker />
        <Routes>
          {/* Public & Main Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/terminos" element={<TermsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            <Route path="/docs" element={<DocsLayout />}>
              <Route index element={<Navigate to="/docs/style-guide" replace />} />
              <Route path="style-guide" element={<StyleGuidePage />} />
              <Route path="changelog" element={<ChangelogPage />} />
              <Route path="flujos" element={<UserFlowsPage />} />
            </Route>
          </Route>
          
          {/* Public Card & Vote Routes (no layout) */}
          <Route path="/view/:slug" element={<PublicCardPage />} />
          <Route path="/vote/:slug" element={<PublicVotePage />} />

          {/* Business App Routes */}
          <Route 
            path="/app"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="tarjeta" element={<CardEditorPage />} />
            <Route path="nuevo-cliente" element={<NewCustomerPage />} />
            <Route path="editar-cliente/:customerId" element={<EditCustomerPage />} />
            <Route path="vote" element={<SurveyPage />} />
          </Route>

          {/* Super Admin Routes */}
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route 
            path="/admin"
            element={
              <SuperAdminProtectedRoute>
                <AdminLayout />
              </SuperAdminProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboardPage />} />
          </Route>

        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;