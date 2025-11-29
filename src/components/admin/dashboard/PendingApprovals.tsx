import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface Approval {
  type: string;
  count: number;
  urgency: string;
}

interface PendingApprovalsProps {
  approvals: Approval[];
  onViewDetails?: (type: string) => void;
}

export function PendingApprovals({ approvals, onViewDetails }: PendingApprovalsProps) {
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Pending Approvals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {approvals.map((approval) => (
          <div
            key={approval.type}
            className="flex items-center justify-between p-3 rounded-lg border"
          >
            <div>
              <h4 className="font-medium">{approval.type}</h4>
              <p className="text-sm text-muted-foreground">
                {approval.count > 0
                  ? `${approval.count} pending`
                  : "No pending approvals"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {approval.count > 0 && (
                <>
                  <Badge variant={getUrgencyColor(approval.urgency) as "default" | "secondary" | "destructive" | "outline"}>
                    {approval.urgency}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewDetails?.(approval.type)}
                  >
                    Review
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
