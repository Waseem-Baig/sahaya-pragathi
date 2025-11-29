import { useNavigate } from "react-router-dom";
import { AssignmentManager } from "@/components/assignment/AssignmentManager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserCheck, Clock, AlertCircle, ArrowLeft } from "lucide-react";

interface AssignmentsPageProps {
  userRole: "L1_MASTER_ADMIN" | "L2_EXEC_ADMIN";
  userId?: string;
}

export default function Assignments({
  userRole = "L2_EXEC_ADMIN",
  userId = "current-user",
}: AssignmentsPageProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 p-6">
      {/* Back Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate("/")}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Assignment Management</h1>
          <p className="text-muted-foreground">
            Manage case assignments and workflow distribution
          </p>
        </div>
        <Badge
          variant={userRole === "L1_MASTER_ADMIN" ? "default" : "secondary"}
        >
          {userRole === "L1_MASTER_ADMIN" ? "Master Admin" : "Executive Admin"}
        </Badge>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <UserCheck className="h-5 w-5 mr-2 text-primary" />
              Assignment Workflow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {userRole === "L1_MASTER_ADMIN"
                ? "Assign cases to Executive Admins and monitor progress"
                : "Self-assign available cases and manage your workload"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <Clock className="h-5 w-5 mr-2 text-info" />
              SLA Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Monitor case deadlines and ensure timely completion of assigned
              tasks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-warning" />
              Priority Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Handle high-priority cases first and balance workload across teams
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Assignment Manager Component */}
      <AssignmentManager userRole={userRole} userId={userId} />
    </div>
  );
}
