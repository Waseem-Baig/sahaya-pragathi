import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  UserCheck,
  Clock,
  AlertCircle,
  CheckCircle2,
  User,
  Users,
  ExternalLink,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { executiveAPI } from "@/lib/api";

interface Assignment {
  id: string;
  module: string;
  caseId: string;
  title: string;
  status:
    | "ASSIGNED"
    | "IN_PROGRESS"
    | "PENDING_APPROVAL"
    | "COMPLETED"
    | "UNASSIGNED"
    | "STAGE_1_COMPLETE"
    | "STAGE_2_COMPLETE"
    | "VERIFIED";
  priority: "P1" | "P2" | "P3" | "P4";
  assignedAt: string;
  dueDate: string;
  assignedBy: string;
}

interface AssignmentManagerProps {
  userRole: "L1_MASTER_ADMIN" | "L2_EXEC_ADMIN";
  userId: string;
}

export function AssignmentManager({ userRole }: AssignmentManagerProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const fetchAssignments = useCallback(async () => {
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

      const response = await executiveAPI.getAssignedTasks(user._id);

      if (response.success && Array.isArray(response.data)) {
        setAssignments(response.data);
      } else {
        setAssignments([]);
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
      toast({
        title: "Error",
        description: "Failed to load assignments",
        variant: "destructive",
      });
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  }, [toast, user]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const getStatusIcon = (status: Assignment["status"]) => {
    switch (status) {
      case "UNASSIGNED":
        return <AlertCircle className="h-4 w-4 text-warning" />;
      case "ASSIGNED":
        return <Clock className="h-4 w-4 text-info" />;
      case "IN_PROGRESS":
        return <User className="h-4 w-4 text-primary" />;
      case "STAGE_1_COMPLETE":
        return <UserCheck className="h-4 w-4 text-success" />;
      case "STAGE_2_COMPLETE":
        return <Users className="h-4 w-4 text-success" />;
      case "VERIFIED":
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case "PENDING_APPROVAL":
        return <Clock className="h-4 w-4 text-warning" />;
      case "COMPLETED":
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: Assignment["status"]) => {
    const variants = {
      UNASSIGNED: "destructive",
      ASSIGNED: "secondary",
      IN_PROGRESS: "default",
      STAGE_1_COMPLETE: "success",
      STAGE_2_COMPLETE: "success",
      VERIFIED: "success",
      PENDING_APPROVAL: "warning",
      COMPLETED: "success",
    } as const;

    return (
      <Badge variant={variants[status] || "secondary"}>
        {status.replace(/_/g, " ")}
      </Badge>
    );
  };

  const totalCount = assignments.length;
  const assignedCount = assignments.filter(
    (a) => a.status === "ASSIGNED"
  ).length;
  const inProgressCount = assignments.filter(
    (a) => a.status === "IN_PROGRESS"
  ).length;
  const verificationCount = assignments.filter(
    (a) => a.status.includes("STAGE") || a.status === "PENDING_APPROVAL"
  ).length;
  const completedCount = assignments.filter(
    (a) => a.status === "COMPLETED" || a.status === "VERIFIED"
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading assignments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-secondary" />
              <div>
                <p className="text-sm font-medium">Total Assigned</p>
                <p className="text-2xl font-bold">{totalCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">In Progress</p>
                <p className="text-2xl font-bold">{inProgressCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserCheck className="h-5 w-5 text-warning" />
              <div>
                <p className="text-sm font-medium">In Verification</p>
                <p className="text-2xl font-bold">{verificationCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <div>
                <p className="text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold">{completedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="assignments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="assignments">All Assignments</TabsTrigger>
          <TabsTrigger value="verification">Verification Queue</TabsTrigger>
        </TabsList>

        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assignment Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {assignments.length === 0 ? (
                <div className="text-center py-12">
                  <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No assignments found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {assignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                      onClick={() =>
                        navigate(
                          `/executive/assignments/${assignment.module}/${assignment.id}`
                        )
                      }
                    >
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(assignment.status)}
                        <div>
                          <p className="font-medium">{assignment.caseId}</p>
                          <p className="text-sm text-muted-foreground">
                            {assignment.module} - {assignment.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Due:{" "}
                            {new Date(assignment.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            assignment.priority === "P1"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {assignment.priority}
                        </Badge>
                        {getStatusBadge(assignment.status)}
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cases in Verification</CardTitle>
            </CardHeader>
            <CardContent>
              {assignments.filter(
                (a) =>
                  a.status.includes("STAGE") ||
                  a.status === "IN_PROGRESS" ||
                  a.status === "PENDING_APPROVAL"
              ).length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No cases in verification
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {assignments
                    .filter(
                      (a) =>
                        a.status.includes("STAGE") ||
                        a.status === "IN_PROGRESS" ||
                        a.status === "PENDING_APPROVAL"
                    )
                    .map((assignment) => (
                      <div
                        key={assignment.id}
                        className="p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                        onClick={() =>
                          navigate(
                            `/executive/assignments/${assignment.module}/${assignment.id}`
                          )
                        }
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{assignment.caseId}</h4>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(assignment.status)}
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {assignment.module} - {assignment.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Assigned by: {assignment.assignedBy}
                        </p>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
