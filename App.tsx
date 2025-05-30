
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TournamentsListPage from './pages/TournamentsListPage';
import TournamentDetailPage from './pages/TournamentDetailPage';
import Layout from './components/layout/Layout';
import { useAuth } from './hooks/useAuth';
import NotFoundPage from './pages/NotFoundPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Layout><DashboardPage /></Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/tournaments" 
          element={
            <ProtectedRoute>
              <Layout><TournamentsListPage /></Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/tournaments/:tournamentId" 
          element={
            <ProtectedRoute>
              <Layout><TournamentDetailPage /></Layout>
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
