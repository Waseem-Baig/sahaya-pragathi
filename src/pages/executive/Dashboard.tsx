import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  MessageSquare,
  Scale,
  Church,
  Heart,
  GraduationCap,
  Building2,
  Calendar,
  Briefcase,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { executiveAPI } from "@/lib/api";

interface AssignedTask {
  id: string;
  module: string;
  caseId: string;
  title: string;
  status: "ASSIGNED" | "IN_PROGRESS" | "PENDING_APPROVAL" | "COMPLETED";
  priority: "P1" | "P2" | "P3" | "P4";
  assignedAt: string;
  dueDate: string;
  assignedBy: string;
}

export default function ExecutiveDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    pendingApproval: 0,
    completed: 0,
  });
  const [assignedTasks, setAssignedTasks] = useState<AssignedTask[]>([]);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      if (!user?._id) {
        toast({
          title: "Error",
          description: "User not found",
          variant: "destructive",
        });
        return;
      }

      // Fetch assigned tasks from API
      const response = await executiveAPI.getAssignedTasks(user._id);

      if (response.success && Array.isArray(response.data)) {
        setAssignedTasks(response.data);

        // Calculate stats
        const statusCounts = {
          total: response.data.length,
          inProgress: response.data.filter(
            (t: AssignedTask) => t.status === "IN_PROGRESS"
          ).length,
          pendingApproval: response.data.filter(
            (t: AssignedTask) => t.status === "PENDING_APPROVAL"
          ).length,
          completed: response.data.filter(
            (t: AssignedTask) => t.status === "COMPLETED"
          ).length,
        };

        setStats(statusCounts);
      } else {
        setAssignedTasks([]);
        setStats({
          total: 0,
          inProgress: 0,
          pendingApproval: 0,
          completed: 0,
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
      setAssignedTasks([]);
    } finally {
      setLoading(false);
    }
  }, [toast, user]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const getModuleIcon = (module: string) => {
    const icons: Record<string, React.ElementType> = {
      Grievances: MessageSquare,
      Disputes: Scale,
      "Temple Letters": Church,
      "CM Relief": Heart,
      Education: GraduationCap,
      "CSR/Industrial": Building2,
      Appointments: Calendar,
      Programs: Briefcase,
    };
    const Icon = icons[module] || MessageSquare;
    return <Icon className="h-4 w-4" />;
  };

  const getStatusBadge = (status: AssignedTask["status"]) => {
    const variants: Record<
      string,
      {
        variant: "default" | "secondary" | "destructive" | "outline";
        label: string;
      }
    > = {
      ASSIGNED: { variant: "secondary", label: "Assigned" },
      IN_PROGRESS: { variant: "default", label: "In Progress" },
      PENDING_APPROVAL: { variant: "outline", label: "Pending Approval" },
      COMPLETED: { variant: "outline", label: "Completed" },
    };
    const config = variants[status] || variants["ASSIGNED"];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority: AssignedTask["priority"]) => {
    const variants: Record<
      string,
      "destructive" | "default" | "secondary" | "outline"
    > = {
      P1: "destructive",
      P2: "default",
      P3: "secondary",
      P4: "outline",
    };
    return (
      <Badge variant={variants[priority] || "secondary"}>{priority}</Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Executive Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.fullName || user?.username}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Assigned
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Tasks assigned to you
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">
              Currently working on
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Approval
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApproval}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">
              Successfully completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Assigned Tasks */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>My Assigned Tasks</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/executive/assignments")}
            >
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {assignedTasks.length === 0 ? (
            <div className="text-center py-12">
              <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No tasks assigned yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {assignedTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                  onClick={() =>
                    navigate(`/executive/assignments/${task.module}/${task.id}`)
                  }
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                      {getModuleIcon(task.module)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{task.title}</h4>
                        {getPriorityBadge(task.priority)}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span>{task.module}</span>
                        <span>•</span>
                        <span>{task.caseId}</span>
                        <span>•</span>
                        <span>Assigned by {task.assignedBy}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right text-sm">
                      <div className="text-muted-foreground">Due date</div>
                      <div className="font-medium">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                    {getStatusBadge(task.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Button
              variant="outline"
              className="h-auto flex-col items-start p-4"
              onClick={() => navigate("/executive/assignments")}
            >
              <UserCheck className="h-5 w-5 mb-2" />
              <span className="font-medium">View Assignments</span>
              <span className="text-xs text-muted-foreground">
                See all tasks assigned to you
              </span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col items-start p-4"
              onClick={() => navigate("/executive/verification")}
            >
              <CheckCircle2 className="h-5 w-5 mb-2" />
              <span className="font-medium">Verification Queue</span>
              <span className="text-xs text-muted-foreground">
                Review pending verifications
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
