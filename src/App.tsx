
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navigation from '@/components/Navigation';
import { Toaster } from "@/components/ui/toaster";

// Pages
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import AdvisorDashboard from '@/pages/AdvisorDashboard';
import AdminPanel from '@/pages/AdminPanel';
import LeadsManagement from '@/pages/LeadsManagement';
import CallCenter from '@/pages/CallCenter';
import CampaignManagement from '@/pages/CampaignManagement';
import Reports from '@/pages/Reports';
import QualityManagement from '@/pages/QualityManagement';
import Communication from '@/pages/Communication';
import AdvisorPerformance from '@/pages/AdvisorPerformance';
import LeadProfile from '@/pages/LeadProfile';
import NotFound from '@/pages/NotFound';

import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      retry: 3,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Rutas públicas */}
              <Route path="/login" element={<Login />} />
              
              {/* Rutas protegidas */}
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <div className="flex min-h-screen">
                      <Navigation />
                      <main className="flex-1 ml-0 lg:ml-64 overflow-y-auto bg-gray-50">
                        <div className="min-h-full">
                          <Routes>
                            <Route path="/" element={<Index />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            
                            {/* Rutas específicas del asesor */}
                            <Route path="/agent" element={<AdvisorDashboard />} />
                            <Route path="/advisor" element={<AdvisorDashboard />} />
                            <Route path="/advisor-dashboard" element={<AdvisorDashboard />} />
                            
                            {/* Rutas administrativas */}
                            <Route path="/admin" element={<AdminPanel />} />
                            <Route path="/leads" element={<LeadsManagement />} />
                            <Route path="/leads/:id" element={<LeadProfile />} />
                            <Route path="/call-center" element={<CallCenter />} />
                            <Route path="/callcenter" element={<CallCenter />} />
                            <Route path="/campaigns" element={<CampaignManagement />} />
                            <Route path="/reports" element={<Reports />} />
                            <Route path="/quality" element={<QualityManagement />} />
                            <Route path="/communication" element={<Communication />} />
                            <Route path="/advisor-performance" element={<AdvisorPerformance />} />
                            
                            {/* Redirecciones */}
                            <Route path="/index" element={<Navigate to="/" replace />} />
                            
                            {/* 404 */}
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </div>
                      </main>
                    </div>
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
