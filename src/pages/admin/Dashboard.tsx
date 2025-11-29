import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Clock,
  FileCheck,
  Plus,
  ArrowLeft,
  AlertTriangle,
  GraduationCap,
  Factory,
  Calendar,
  Users,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  educationAPI,
  csrIndustrialAPI,
  appointmentAPI,
  programAPI,
} from "@/lib/api";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  // State for real data
  const [educationStats, setEducationStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
  });
  const [csrStats, setCsrStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
  });
  const [appointmentStats, setAppointmentStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0,
  });
  const [programStats, setProgramStats] = useState({
    total: 0,
    upcoming: 0,
    ongoing: 0,
    completed: 0,
  });

  // Fetch real data from APIs
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch Education Support stats
        const educationResponse = await educationAPI.getAll({ limit: 1000 });
        const educationData = Array.isArray(educationResponse.data)
          ? educationResponse.data
          : (educationResponse.data as { data?: unknown[] })?.data || [];
        setEducationStats({
          total: educationData.length,
          pending: educationData.filter(
            (e: unknown) => (e as { status?: string }).status === "PENDING"
          ).length,
          approved: educationData.filter(
            (e: unknown) => (e as { status?: string }).status === "APPROVED"
          ).length,
        });

        // Fetch CSR Industrial stats
        const csrResponse = await csrIndustrialAPI.getAll({ limit: 1000 });
        const csrData = Array.isArray(csrResponse.data)
          ? csrResponse.data
          : (csrResponse.data as { data?: unknown[] })?.data || [];
        setCsrStats({
          total: csrData.length,
          pending: csrData.filter(
            (c: unknown) => (c as { status?: string }).status === "PENDING"
          ).length,
          approved: csrData.filter(
            (c: unknown) => (c as { status?: string }).status === "APPROVED"
          ).length,
        });

        // Fetch Appointment stats
        const appointmentResponse = await appointmentAPI.getAll({
          limit: 1000,
        });
        const appointmentData = Array.isArray(appointmentResponse.data)
          ? appointmentResponse.data
          : (appointmentResponse.data as { data?: unknown[] })?.data || [];
        setAppointmentStats({
          total: appointmentData.length,
          upcoming: appointmentData.filter(
            (a: unknown) =>
              (a as { status?: string }).status === "CONFIRMED" ||
              (a as { status?: string }).status === "PENDING"
          ).length,
          completed: appointmentData.filter(
            (a: unknown) => (a as { status?: string }).status === "COMPLETED"
          ).length,
        });

        // Fetch Program stats
        const programResponse = await programAPI.getStats();
        const stats =
          (programResponse.data as {
            total?: number;
            upcoming?: number;
            ongoing?: number;
            completed?: number;
          }) || {};
        setProgramStats({
          total: stats.total || 0,
          upcoming: stats.upcoming || 0,
          ongoing: stats.ongoing || 0,
          completed: stats.completed || 0,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const totalRecords =
    educationStats.total +
    csrStats.total +
    appointmentStats.total +
    programStats.total;
  const totalPending =
    educationStats.pending + csrStats.pending + appointmentStats.upcoming;

  return (
    <div className="w-full max-w-full">
      <div className="space-y-6 p-6">
        {/* Back Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Role Selection
        </Button>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Master Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              System overview and real-time statistics
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <FileCheck className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* KPI Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Records
              </CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRecords}</div>
              <p className="text-xs text-muted-foreground">
                Across all modules
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Items
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPending}</div>
              <p className="text-xs text-muted-foreground">Require attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Programs Active
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{programStats.ongoing}</div>
              <p className="text-xs text-muted-foreground">
                {programStats.upcoming} upcoming
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Appointments
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appointmentStats.total}</div>
              <p className="text-xs text-muted-foreground">
                {appointmentStats.upcoming} upcoming
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 w-full">
          {/* Module Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Module Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Education Support */}
              <div
                className="flex items-center justify-between p-4 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                onClick={() => navigate("/admin/education")}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <GraduationCap className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">Education Support</div>
                    <div className="text-sm text-muted-foreground">
                      {educationStats.pending} pending •{" "}
                      {educationStats.approved} approved
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {educationStats.total}
                </div>
              </div>

              {/* CSR Industrial */}
              <div
                className="flex items-center justify-between p-4 bg-purple-50 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors"
                onClick={() => navigate("/admin/csr-industrial")}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Factory className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium">CSR Industrial</div>
                    <div className="text-sm text-muted-foreground">
                      {csrStats.pending} pending • {csrStats.approved} approved
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  {csrStats.total}
                </div>
              </div>

              {/* Appointments */}
              <div
                className="flex items-center justify-between p-4 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition-colors"
                onClick={() => navigate("/admin/appointments")}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium">Appointments</div>
                    <div className="text-sm text-muted-foreground">
                      {appointmentStats.upcoming} upcoming •{" "}
                      {appointmentStats.completed} completed
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {appointmentStats.total}
                </div>
              </div>

              {/* Programs & Job Melas */}
              <div
                className="flex items-center justify-between p-4 bg-orange-50 rounded-lg cursor-pointer hover:bg-orange-100 transition-colors"
                onClick={() => navigate("/admin/programs")}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Users className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-medium">Programs & Job Melas</div>
                    <div className="text-sm text-muted-foreground">
                      {programStats.ongoing} ongoing • {programStats.completed}{" "}
                      completed
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-orange-600">
                  {programStats.total}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions & Alerts */}
          <div className="space-y-6">
            {/* Priority Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Priority Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {totalPending > 0 && (
                    <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                      <Clock className="h-4 w-4 text-orange-500 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">Pending Items</div>
                        <div className="text-xs text-muted-foreground">
                          {totalPending} items require attention
                        </div>
                      </div>
                    </div>
                  )}
                  {appointmentStats.upcoming > 0 && (
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <Calendar className="h-4 w-4 text-blue-500 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">
                          Upcoming Appointments
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {appointmentStats.upcoming} appointments scheduled
                        </div>
                      </div>
                    </div>
                  )}
                  {programStats.ongoing > 0 && (
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">
                          Active Programs
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {programStats.ongoing} programs currently running
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => navigate("/admin/education/new")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Education Support
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => navigate("/admin/csr-industrial/new")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New CSR Industrial
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => navigate("/admin/appointments/new")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Appointment
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => navigate("/admin/programs/new")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Program
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
