
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navigation from "./components/Navigation";
import QuickActions from "./components/QuickActions";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import AgentDashboard from "./pages/AgentDashboard";
import LeadsManagement from "./pages/LeadsManagement";
import CallCenter from "./pages/CallCenter";
import CampaignManagement from "./pages/CampaignManagement";
import Reports from "./pages/Reports";
import Communication from "./pages/Communication";
import NotFound from "./pages/NotFound";
import AdvisorPerformance from "./components/AdvisorPerformance";
import LeadTypification from "./components/LeadTypification";
import LeadFollowUp from "./components/LeadFollowUp";
import PromotionsManagement from "./components/PromotionsManagement";
import LeadProfile from "./pages/LeadProfile";
import CampaignAnalytics from "./pages/CampaignAnalytics";
import QualityManagement from "./pages/QualityManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-50">
                  <Navigation />
                  <main className="relative">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/admin" element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                          <AdminPanel />
                        </ProtectedRoute>
                      } />
                      <Route path="/agent" element={
                        <ProtectedRoute allowedRoles={['AGENT']}>
                          <AgentDashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/leads" element={<LeadsManagement />} />
                      <Route path="/leads/:leadId" element={<LeadProfile />} />
                      <Route path="/callcenter" element={<CallCenter />} />
                      <Route path="/campaigns" element={
                        <ProtectedRoute allowedRoles={['ADMIN', 'SUPERVISOR']}>
                          <CampaignManagement />
                        </ProtectedRoute>
                      } />
                      <Route path="/campaigns/analytics" element={
                        <ProtectedRoute allowedRoles={['ADMIN', 'SUPERVISOR']}>
                          <CampaignAnalytics />
                        </ProtectedRoute>
                      } />
                      <Route path="/reports" element={
                        <ProtectedRoute allowedRoles={['ADMIN', 'SUPERVISOR']}>
                          <Reports />
                        </ProtectedRoute>
                      } />
                      <Route path="/communication" element={<Communication />} />
                      <Route path="/quality" element={
                        <ProtectedRoute allowedRoles={['ADMIN', 'SUPERVISOR']}>
                          <QualityManagement />
                        </ProtectedRoute>
                      } />
                      <Route path="/advisor-performance" element={<AdvisorPerformance />} />
                      <Route path="/lead-follow-up/:leadId" element={<LeadFollowUp leadId={1} leadData={{ name: 'Lead Ejemplo' }} />} />
                      <Route path="/promotions" element={
                        <ProtectedRoute allowedRoles={['ADMIN', 'SUPERVISOR']}>
                          <PromotionsManagement />
                        </ProtectedRoute>
                      } />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                    <QuickActions />
                  </main>
                </div>
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
