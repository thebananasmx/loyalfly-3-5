
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import MainLayout from './components/MainLayout';
import AppLayout from './components/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import DocsLayout from './components/DocsLayout';

import LandingPage from './pages/LandingPage';
import PricingPage from './pages/PricingPage';
import TermsPage from './pages/TermsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CardEditorPage from './pages/CardEditorPage';
import StyleGuidePage from './pages/StyleGuidePage';
import PublicCardPage from './pages/PublicCardPage';
import AddStampPage from './pages/AddStampPage';
import NewCustomerPage from './pages/NewCustomerPage';
import ChangelogPage from './pages/ChangelogPage';

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
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
            </Route>
          </Route>
          
          <Route path="/view/:slug" element={<PublicCardPage />} />

          <Route 
            path="/app"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="tarjeta" element={<CardEditorPage />} />
            <Route path="agregar-sello" element={<AddStampPage />} />
            <Route path="nuevo-cliente" element={<NewCustomerPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;