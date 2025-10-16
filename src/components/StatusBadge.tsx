import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  variant?: "default" | "success" | "warning" | "info" | "destructive";
  className?: string;
}

const statusConfig: Record<string, { variant: "default" | "success" | "warning" | "info" | "destructive"; label: string }> = {
  // Grievance statuses
  NEW: { variant: "info", label: "New" },
  TRIAGED: { variant: "warning", label: "Triaged" },
  ASSIGNED: { variant: "warning", label: "Assigned" },
  IN_PROGRESS: { variant: "info", label: "In Progress" },
  DEPT_ESCALATED: { variant: "warning", label: "Dept Escalated" },
  RESOLVED: { variant: "success", label: "Resolved" },
  CLOSED: { variant: "default", label: "Closed" },
  
  // Temple Letter statuses
  REQUESTED: { variant: "info", label: "Requested" },
  IN_REVIEW: { variant: "warning", label: "In Review" },
  APPROVED: { variant: "success", label: "Approved" },
  LETTER_ISSUED: { variant: "success", label: "Letter Issued" },
  UTILIZED: { variant: "default", label: "Utilized" },
  EXPIRED: { variant: "destructive", label: "Expired" },
  
  // Appointment statuses
  CONFIRMED: { variant: "success", label: "Confirmed" },
  CHECKED_IN: { variant: "info", label: "Checked In" },
  COMPLETED: { variant: "default", label: "Completed" },
  NO_SHOW: { variant: "destructive", label: "No Show" },
};

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  const badgeVariant = variant || config?.variant || "default";
  const label = config?.label || status;

  return (
    <Badge 
      variant={badgeVariant as any} 
      className={cn("font-medium shadow-status", className)}
    >
      {label}
    </Badge>
  );
}