import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ChevronDown, CheckCircle, Clock, AlertTriangle, XCircle } from 'lucide-react';

type StatusType = 
  | 'NEW' | 'TRIAGED' | 'ASSIGNED' | 'IN_PROGRESS' | 'DEPT_ESCALATED' | 'RESOLVED' | 'CLOSED'
  | 'REQUESTED' | 'IN_REVIEW' | 'APPROVED' | 'LETTER_ISSUED' | 'UTILIZED' | 'EXPIRED'
  | 'INTAKE' | 'DOCS_VERIFIED' | 'SANCTION_REQUESTED' | 'SANCTIONED' | 'DISBURSED' | 'UTILIZATION_SUBMITTED'
  | 'VERIFIED' | 'REJECTED' | 'PENDING'
  | 'UNASSIGNED' | 'STAGE_1_COMPLETE' | 'STAGE_2_COMPLETE';

interface StatusTransition {
  from: StatusType;
  to: StatusType;
  label: string;
  requiresRole?: ('L1_MASTER_ADMIN' | 'L2_EXEC_ADMIN')[];
  requiresComment?: boolean;
}

interface StatusChipProps {
  status: StatusType;
  allowedTransitions?: StatusTransition[];
  userRole?: 'L1_MASTER_ADMIN' | 'L2_EXEC_ADMIN' | 'L3_CITIZEN';
  onStatusChange?: (newStatus: StatusType, comment?: string) => void;
  disabled?: boolean;
  size?: 'sm' | 'default' | 'lg';
}

const statusConfig: Record<StatusType, { 
  variant: 'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'info';
  icon: React.ComponentType<{ className?: string }>;
  label?: string;
}> = {
  // Grievance statuses
  NEW: { variant: 'secondary', icon: Clock, label: 'New' },
  TRIAGED: { variant: 'info', icon: AlertTriangle, label: 'Triaged' },
  ASSIGNED: { variant: 'default', icon: Clock, label: 'Assigned' },
  IN_PROGRESS: { variant: 'info', icon: Clock, label: 'In Progress' },
  DEPT_ESCALATED: { variant: 'warning', icon: AlertTriangle, label: 'Escalated' },
  RESOLVED: { variant: 'success', icon: CheckCircle, label: 'Resolved' },
  CLOSED: { variant: 'success', icon: CheckCircle, label: 'Closed' },
  
  // Temple Letter statuses
  REQUESTED: { variant: 'secondary', icon: Clock, label: 'Requested' },
  IN_REVIEW: { variant: 'info', icon: Clock, label: 'In Review' },
  APPROVED: { variant: 'success', icon: CheckCircle, label: 'Approved' },
  LETTER_ISSUED: { variant: 'success', icon: CheckCircle, label: 'Letter Issued' },
  UTILIZED: { variant: 'success', icon: CheckCircle, label: 'Utilized' },
  EXPIRED: { variant: 'destructive', icon: XCircle, label: 'Expired' },
  
  // CMRF statuses
  INTAKE: { variant: 'secondary', icon: Clock, label: 'Intake' },
  DOCS_VERIFIED: { variant: 'info', icon: CheckCircle, label: 'Docs Verified' },
  SANCTION_REQUESTED: { variant: 'warning', icon: Clock, label: 'Sanction Requested' },
  SANCTIONED: { variant: 'success', icon: CheckCircle, label: 'Sanctioned' },
  DISBURSED: { variant: 'success', icon: CheckCircle, label: 'Disbursed' },
  UTILIZATION_SUBMITTED: { variant: 'success', icon: CheckCircle, label: 'Utilization Submitted' },
  
  // General statuses
  VERIFIED: { variant: 'success', icon: CheckCircle, label: 'Verified' },
  REJECTED: { variant: 'destructive', icon: XCircle, label: 'Rejected' },
  PENDING: { variant: 'warning', icon: Clock, label: 'Pending' },
  
  // Assignment statuses
  UNASSIGNED: { variant: 'destructive', icon: AlertTriangle, label: 'Unassigned' },
  STAGE_1_COMPLETE: { variant: 'info', icon: CheckCircle, label: 'Stage 1 Complete' },
  STAGE_2_COMPLETE: { variant: 'success', icon: CheckCircle, label: 'Stage 2 Complete' },
};

// Default transitions for different case types
const defaultGrievanceTransitions: StatusTransition[] = [
  { from: 'NEW', to: 'TRIAGED', label: 'Triage Case' },
  { from: 'TRIAGED', to: 'ASSIGNED', label: 'Assign Case' },
  { from: 'ASSIGNED', to: 'IN_PROGRESS', label: 'Start Work' },
  { from: 'IN_PROGRESS', to: 'DEPT_ESCALATED', label: 'Escalate to Department' },
  { from: 'IN_PROGRESS', to: 'RESOLVED', label: 'Mark Resolved' },
  { from: 'DEPT_ESCALATED', to: 'RESOLVED', label: 'Mark Resolved' },
  { from: 'RESOLVED', to: 'CLOSED', label: 'Close Case', requiresRole: ['L1_MASTER_ADMIN', 'L2_EXEC_ADMIN'] },
];

const defaultTempleTransitions: StatusTransition[] = [
  { from: 'REQUESTED', to: 'IN_REVIEW', label: 'Start Review' },
  { from: 'IN_REVIEW', to: 'APPROVED', label: 'Approve Request', requiresRole: ['L1_MASTER_ADMIN'] },
  { from: 'IN_REVIEW', to: 'REJECTED', label: 'Reject Request', requiresComment: true },
  { from: 'APPROVED', to: 'LETTER_ISSUED', label: 'Issue Letter' },
  { from: 'LETTER_ISSUED', to: 'UTILIZED', label: 'Mark Utilized' },
  { from: 'LETTER_ISSUED', to: 'EXPIRED', label: 'Mark Expired' },
];

export function StatusChip({ 
  status, 
  allowedTransitions,
  userRole = 'L2_EXEC_ADMIN',
  onStatusChange,
  disabled = false,
  size = 'default'
}: StatusChipProps) {
  const config = statusConfig[status];
  const IconComponent = config.icon;
  
  // Use provided transitions or determine based on status type
  const transitions = allowedTransitions || getDefaultTransitions(status);
  
  // Filter transitions based on user role
  const availableTransitions = transitions.filter(transition => 
    transition.from === status && 
    (!transition.requiresRole || (userRole !== 'L3_CITIZEN' && transition.requiresRole.includes(userRole as 'L1_MASTER_ADMIN' | 'L2_EXEC_ADMIN')))
  );

  function getDefaultTransitions(currentStatus: StatusType): StatusTransition[] {
    // Determine transition set based on status
    if (['NEW', 'TRIAGED', 'ASSIGNED', 'IN_PROGRESS', 'DEPT_ESCALATED', 'RESOLVED', 'CLOSED'].includes(currentStatus)) {
      return defaultGrievanceTransitions;
    }
    if (['REQUESTED', 'IN_REVIEW', 'APPROVED', 'LETTER_ISSUED', 'UTILIZED', 'EXPIRED'].includes(currentStatus)) {
      return defaultTempleTransitions;
    }
    return [];
  }

  const handleStatusChange = (newStatus: StatusType, requiresComment: boolean = false) => {
    if (onStatusChange) {
      // In a real app, you might show a comment dialog here if requiresComment is true
      onStatusChange(newStatus, requiresComment ? 'Status changed by user' : undefined);
    }
  };

  if (availableTransitions.length === 0 || disabled || !onStatusChange) {
    // Static badge when no transitions available
    return (
      <Badge variant={config.variant} className={size === 'sm' ? 'text-xs px-2 py-1' : undefined}>
        <IconComponent className={`mr-1 ${size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'}`} />
        {config.label || status.replace(/_/g, ' ')}
      </Badge>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={size}
          className="h-auto p-0 hover:bg-transparent"
        >
          <Badge 
            variant={config.variant} 
            className={`cursor-pointer hover:opacity-80 ${size === 'sm' ? 'text-xs px-2 py-1' : ''}`}
          >
            <IconComponent className={`mr-1 ${size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'}`} />
            {config.label || status.replace(/_/g, ' ')}
            <ChevronDown className={`ml-1 ${size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'}`} />
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
          Change Status
        </div>
        <DropdownMenuSeparator />
        
        {availableTransitions.map((transition) => {
          const targetConfig = statusConfig[transition.to];
          const TargetIcon = targetConfig.icon;
          
          return (
            <DropdownMenuItem
              key={transition.to}
              onClick={() => handleStatusChange(transition.to, transition.requiresComment)}
              className="cursor-pointer"
            >
              <TargetIcon className="mr-2 h-4 w-4" />
              <span className="flex-1">{transition.label}</span>
              {transition.requiresRole && (
                <Badge variant="outline" className="text-xs ml-2">
                  {transition.requiresRole.includes('L1_MASTER_ADMIN') ? 'L1' : 'L2'}
                </Badge>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}