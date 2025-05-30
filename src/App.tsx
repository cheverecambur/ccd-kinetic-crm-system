
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import QuickActions from "./components/QuickActions";
import Dashboard from "./pages/Dashboard";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main className="relative">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/leads" element={<LeadsManagement />} />
              <Route path="/callcenter" element={<CallCenter />} />
              <Route path="/campaigns" element={<CampaignManagement />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/communication" element={<Communication />} />
              <Route path="/advisor-performance" element={<AdvisorPerformance />} />
              <Route path="/lead-follow-up/:leadId" element={<LeadFollowUp />} />
              <Route path="/promotions" element={<PromotionsManagement />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <QuickActions />
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
