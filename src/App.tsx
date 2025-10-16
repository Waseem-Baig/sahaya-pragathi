import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Assignments from "./pages/Assignments";
import Verification from "./pages/Verification";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/Dashboard";
import WorkQueues from "./pages/admin/WorkQueues";
import Grievances from "./pages/admin/Grievances";
import GrievanceDetail from "./pages/admin/GrievanceDetail";
import GrievanceForm from "./pages/admin/GrievanceForm";
import Disputes from "./pages/admin/Disputes";
import TempleLetters from "./pages/admin/TempleLetters";
import CMRelief from "./pages/admin/CMRelief";
import EducationSupport from "./pages/admin/EducationSupport";
import CSRIndustrial from "./pages/admin/CSRIndustrial";
import AppointmentsAdmin from "./pages/admin/AppointmentsAdmin";
import Programs from "./pages/admin/Programs";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/assignments" element={<Assignments userRole="L2_EXEC_ADMIN" />} />
          <Route path="/verification" element={<Verification userRole="L2_EXEC_ADMIN" />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/work-queues" element={<WorkQueues />} />
          <Route path="/admin/grievances" element={<Grievances />} />
          <Route path="/admin/grievances/new" element={<GrievanceForm />} />
          <Route path="/admin/grievances/:id" element={<GrievanceDetail />} />
          <Route path="/admin/grievances/:id/edit" element={<GrievanceForm />} />
          <Route path="/admin/disputes" element={<Disputes />} />
          <Route path="/admin/temple-letters" element={<TempleLetters />} />
          <Route path="/admin/cm-relief" element={<CMRelief />} />
          <Route path="/admin/education" element={<EducationSupport />} />
          <Route path="/admin/csr-industrial" element={<CSRIndustrial />} />
          <Route path="/admin/appointments" element={<AppointmentsAdmin />} />
          <Route path="/admin/programs" element={<Programs />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
