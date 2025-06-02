import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import AdminPanel from '@/pages/AdminPanel';
import LeadsManagement from '@/pages/LeadsManagement';
import LeadProfile from '@/pages/LeadProfile';
import CallCenter from '@/pages/CallCenter';
import CampaignManagement from '@/pages/CampaignManagement';
import Reports from '@/pages/Reports';
import QualityManagement from '@/pages/QualityManagement';
import Communication from '@/pages/Communication';
import AdvisorPerformance from '@/pages/AdvisorPerformance';
import CampaignAnalytics from '@/pages/CampaignAnalytics';
import NotFound from '@/pages/NotFound';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navigation from '@/components/Navigation';
import { Toaster } from "@/components/ui/toaster"

const queryClient = new QueryClient();

function App() {
  return (
    <AuthProvider>
      <Router>
        <QueryClientProvider client={queryClient}>
          <Toaster />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <div className="min-h-screen bg-gray-50">
                    <Navigation />
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      
                      {/* Rutas del Admin */}
                      <Route
                        path="/admin"
                        element={
                          <ProtectedRoute allowedRoles={['ADMIN']}>
                            <AdminPanel />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/users"
                        element={
                          <ProtectedRoute allowedRoles={['ADMIN']}>
                            <div className="p-6">
                              <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
                              <p>Panel de gestión de usuarios en desarrollo...</p>
                            </div>
                          </ProtectedRoute>
                        }
                      />

                      {/* Rutas compartidas con control de acceso */}
                      <Route
                        path="/leads"
                        element={
                          <ProtectedRoute allowedRoles={['ADMIN', 'SUPERVISOR', 'AGENT']}>
                            <LeadsManagement />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/leads/:leadId"
                        element={
                          <ProtectedRoute allowedRoles={['ADMIN', 'SUPERVISOR', 'AGENT']}>
                            <LeadProfile />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/callcenter"
                        element={
                          <ProtectedRoute allowedRoles={['ADMIN', 'SUPERVISOR', 'AGENT']}>
                            <CallCenter />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/campaigns"
                        element={
                          <ProtectedRoute allowedRoles={['ADMIN', 'SUPERVISOR']}>
                            <CampaignManagement />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/reports"
                        element={
                          <ProtectedRoute allowedRoles={['ADMIN', 'SUPERVISOR']}>
                            <Reports />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/quality"
                        element={
                          <ProtectedRoute allowedRoles={['ADMIN', 'SUPERVISOR']}>
                            <QualityManagement />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/communication"
                        element={
                          <ProtectedRoute allowedRoles={['ADMIN']}>
                            <Communication />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/advisor-performance"
                        element={
                          <ProtectedRoute allowedRoles={['AGENT']}>
                            <AdvisorPerformance />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/campaign-analytics"
                        element={
                          <ProtectedRoute allowedRoles={['ADMIN']}>
                            <CampaignAnalytics />
                          </ProtectedRoute>
                        }
                      />

                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </QueryClientProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
