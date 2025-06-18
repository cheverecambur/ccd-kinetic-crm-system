
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/toaster';
import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import CallCenter from './pages/CallCenter';
import LeadsManagement from './pages/LeadsManagement';
import LeadProfile from './pages/LeadProfile';
import CampaignManagement from './pages/CampaignManagement';
import Reports from './pages/Reports';
import Communication from './pages/Communication';
import QualityManagement from './pages/QualityManagement';
import CampaignAnalytics from './pages/CampaignAnalytics';
import AgentDashboard from './pages/AgentDashboard';
import AdvisorDashboard from './pages/AdvisorDashboard';
import AdvisorPerformance from './pages/AdvisorPerformance';
import AdminPanel from './pages/AdminPanel';
import AdminUsers from './pages/AdminUsers';
import AdminAlerts from './pages/AdminAlerts';
import AdminSettings from './pages/AdminSettings';
import AdminVicidial from './pages/AdminVicidial';
import AdminAnalytics from './pages/AdminAnalytics';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main className="pt-16">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Index />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/call-center"
                  element={
                    <ProtectedRoute>
                      <CallCenter />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/leads"
                  element={
                    <ProtectedRoute>
                      <LeadsManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/leads/:id"
                  element={
                    <ProtectedRoute>
                      <LeadProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/campaigns"
                  element={
                    <ProtectedRoute>
                      <CampaignManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute>
                      <Reports />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/communication"
                  element={
                    <ProtectedRoute>
                      <Communication />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/quality"
                  element={
                    <ProtectedRoute>
                      <QualityManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/campaign-analytics"
                  element={
                    <ProtectedRoute>
                      <CampaignAnalytics />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/agent"
                  element={
                    <ProtectedRoute>
                      <AgentDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/advisor"
                  element={
                    <ProtectedRoute>
                      <AdvisorDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/advisor-performance"
                  element={
                    <ProtectedRoute>
                      <AdvisorPerformance />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminPanel />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute>
                      <AdminUsers />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/alerts"
                  element={
                    <ProtectedRoute>
                      <AdminAlerts />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/settings"
                  element={
                    <ProtectedRoute>
                      <AdminSettings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/vicidial"
                  element={
                    <ProtectedRoute>
                      <AdminVicidial />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/analytics"
                  element={
                    <ProtectedRoute>
                      <AdminAnalytics />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
