import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import Assignments from "./pages/Assignments";
import Verification from "./pages/Verification";
import NotFound from "./pages/NotFound";
import ExecutiveDashboard from "./pages/executive/Dashboard";
import AssignmentDetail from "./pages/executive/AssignmentDetail";
import AdminDashboard from "./pages/admin/Dashboard";
import WorkQueues from "./pages/admin/WorkQueues";
import Grievances from "./pages/admin/Grievances";
import GrievanceDetail from "./pages/admin/GrievanceDetail";
import GrievanceForm from "./pages/admin/GrievanceForm";
import Disputes from "./pages/admin/Disputes";
import DisputeForm from "./pages/admin/DisputeForm";
import DisputeDetail from "./pages/admin/DisputeDetail";
import TempleLetters from "./pages/admin/TempleLetters";
import TempleForm from "./pages/admin/TempleForm";
import TempleDetail from "./pages/admin/TempleDetail";
import CMRelief from "./pages/admin/CMRelief";
import CMReliefForm from "./pages/admin/CMReliefForm";
import CMReliefDetail from "./pages/admin/CMReliefDetail";
import EducationSupport from "./pages/admin/EducationSupport";
import EducationForm from "./pages/admin/EducationForm";
import EducationDetail from "./pages/admin/EducationDetail";
import CSRIndustrial from "./pages/admin/CSRIndustrial";
import CSRIndustrialForm from "./pages/admin/CSRIndustrialForm";
import CSRIndustrialDetail from "./pages/admin/CSRIndustrialDetail";
import AppointmentsAdmin from "./pages/admin/AppointmentsAdmin";
import AppointmentForm from "./pages/admin/AppointmentForm";
import AppointmentDetail from "./pages/admin/AppointmentDetail";
import Programs from "./pages/admin/Programs";
import ProgramForm from "./pages/admin/ProgramForm";
import ProgramDetail from "./pages/admin/ProgramDetail";
import { AppShell } from "./components/layout/AppShell";
import { MasterAdminShell } from "./components/layout/MasterAdminShell";
import CitizenPortalPage from "./pages/CitizenPortal";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Citizen Portal - Protected */}
            <Route
              path="/citizen"
              element={
                <ProtectedRoute allowedRoles={["L3_CITIZEN"]}>
                  <CitizenPortalPage />
                </ProtectedRoute>
              }
            />

            {/* Executive Admin Routes (L2) - Protected and wrapped in AppShell */}
            <Route
              path="/executive"
              element={
                <ProtectedRoute allowedRoles={["L2_EXEC_ADMIN"]}>
                  <AppShell userRole="L2_EXEC_ADMIN" />
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={<Navigate to="/executive/dashboard" replace />}
              />
              <Route path="dashboard" element={<ExecutiveDashboard />} />
              <Route
                path="assignments"
                element={<Assignments userRole="L2_EXEC_ADMIN" />}
              />
              <Route
                path="assignments/:module/:id"
                element={<AssignmentDetail />}
              />
              <Route
                path="verification"
                element={<Verification userRole="L2_EXEC_ADMIN" />}
              />
            </Route>

            {/* Master Admin Routes (L1) - Protected and wrapped in MasterAdminShell */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["L1_MASTER_ADMIN"]}>
                  <MasterAdminShell />
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={<Navigate to="/admin/dashboard" replace />}
              />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="work-queues" element={<WorkQueues />} />
              <Route path="grievances" element={<Grievances />} />
              <Route path="grievances/new" element={<GrievanceForm />} />
              <Route path="grievances/:id" element={<GrievanceDetail />} />
              <Route path="grievances/:id/edit" element={<GrievanceForm />} />
              <Route path="disputes" element={<Disputes />} />
              <Route path="disputes/new" element={<DisputeForm />} />
              <Route path="disputes/:id" element={<DisputeDetail />} />
              <Route path="disputes/:id/edit" element={<DisputeForm />} />
              <Route path="temple-letters" element={<TempleLetters />} />
              <Route path="temple-letters/new" element={<TempleForm />} />
              <Route path="temple-letters/:id" element={<TempleDetail />} />
              <Route path="temple-letters/:id/edit" element={<TempleForm />} />
              <Route path="cm-relief" element={<CMRelief />} />
              <Route path="cm-relief/new" element={<CMReliefForm />} />
              <Route path="cm-relief/:id" element={<CMReliefDetail />} />
              <Route path="cm-relief/:id/edit" element={<CMReliefForm />} />
              <Route path="education" element={<EducationSupport />} />
              <Route path="education/new" element={<EducationForm />} />
              <Route path="education/:id" element={<EducationDetail />} />
              <Route path="education/:id/edit" element={<EducationForm />} />
              <Route path="csr-industrial" element={<CSRIndustrial />} />
              <Route
                path="csr-industrial/new"
                element={<CSRIndustrialForm />}
              />
              <Route
                path="csr-industrial/:id"
                element={<CSRIndustrialDetail />}
              />
              <Route
                path="csr-industrial/:id/edit"
                element={<CSRIndustrialForm />}
              />
              <Route path="appointments" element={<AppointmentsAdmin />} />
              <Route path="appointments/new" element={<AppointmentForm />} />
              <Route path="appointments/:id" element={<AppointmentDetail />} />
              <Route
                path="appointments/:id/edit"
                element={<AppointmentForm />}
              />
              <Route path="programs" element={<Programs />} />
              <Route path="programs/new" element={<ProgramForm />} />
              <Route path="programs/:id" element={<ProgramDetail />} />
              <Route path="programs/:id/edit" element={<ProgramForm />} />
            </Route>

            {/* Catch-all 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
