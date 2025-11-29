import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Clock } from "lucide-react";

interface Activity {
  type: string;
  caseId?: string;
  category?: string;
  description?: string;
  deadline?: string;
  time: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "case_resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "new_assignment":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "sla_warning":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "case_resolved":
        return "bg-green-500";
      case "new_assignment":
        return "bg-blue-500";
      case "sla_warning":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case "case_resolved":
        return (
          <>
            Case <Badge variant="outline" className="mx-1">{activity.caseId}</Badge>
            ({activity.category}) resolved
          </>
        );
      case "new_assignment":
        return activity.description;
      case "sla_warning":
        return (
          <>
            SLA warning for <Badge variant="outline" className="mx-1">{activity.caseId}</Badge>
            (Due in {activity.deadline})
          </>
        );
      default:
        return activity.description;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex gap-3">
              <div className="relative">
                <div className={`h-2 w-2 rounded-full ${getActivityColor(activity.type)} mt-2`} />
                {index < activities.length - 1 && (
                  <div className="absolute left-1 top-4 h-full w-px bg-border" />
                )}
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-start gap-2">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1">
                    <p className="text-sm">{getActivityText(activity)}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
