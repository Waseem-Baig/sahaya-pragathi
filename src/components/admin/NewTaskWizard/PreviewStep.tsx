import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Clock, User, FileText, AlertTriangle } from 'lucide-react';

interface PreviewStepProps {
  taskData: {
    module: string;
    details: Record<string, any>;
    assignment: {
      assignedTo?: string;
      department?: string;
      sla?: string;
      priority?: string;
      notes?: string;
    };
  };
}

const moduleNames: Record<string, string> = {
  grievance: 'Grievance',
  dispute: 'Dispute Resolution',
  temple: 'Temple Darshan Letter',
  cmr: 'CM Relief Fund',
  education: 'Education Support',
  csr: 'CSR & Industrial',
  appointment: 'Appointments',
  program: 'Programs/Job Melas',
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  P1: { label: 'Critical (48h)', color: 'destructive' },
  P2: { label: 'High (120h)', color: 'warning' },
  P3: { label: 'Medium (240h)', color: 'default' },
  P4: { label: 'Low (480h)', color: 'secondary' },
};

export const PreviewStep = ({ taskData }: PreviewStepProps) => {
  const { module, details, assignment } = taskData;
  const moduleName = moduleNames[module] || 'Unknown';
  
  // Generate task ID preview
  const generateTaskId = () => {
    const moduleCode = module.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    return `${moduleCode}-${new Date().getFullYear()}-${timestamp}`;
  };

  const taskId = generateTaskId();

  return (
    <div className="space-y-6">
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <CheckCircle className="h-5 w-5" />
            Task Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">{moduleName}</h3>
              <p className="text-sm text-muted-foreground">Task ID: {taskId}</p>
            </div>
            <Badge variant="outline" className="px-3 py-1">
              Ready to Create
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Task Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {details.time && (
              <div>
                <span className="text-sm font-medium">Time:</span>
                <p className="text-sm text-muted-foreground">
                  {new Date(details.time).toLocaleString()}
                </p>
              </div>
            )}
            
            {details.place && (
              <div>
                <span className="text-sm font-medium">Place:</span>
                <p className="text-sm text-muted-foreground">{details.place}</p>
              </div>
            )}
            
            {details.reason && (
              <div>
                <span className="text-sm font-medium">Reason:</span>
                <p className="text-sm text-muted-foreground">{details.reason}</p>
              </div>
            )}

            {details.description && (
              <div>
                <span className="text-sm font-medium">Description:</span>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {details.description}
                </p>
              </div>
            )}

            {/* Module-specific fields */}
            {module === 'grievance' && (
              <>
                {details.citizenName && (
                  <div>
                    <span className="text-sm font-medium">Citizen:</span>
                    <p className="text-sm text-muted-foreground">{details.citizenName}</p>
                  </div>
                )}
                {details.category && (
                  <div>
                    <span className="text-sm font-medium">Category:</span>
                    <p className="text-sm text-muted-foreground">{details.category}</p>
                  </div>
                )}
              </>
            )}

            {module === 'temple' && (
              <>
                {details.applicantName && (
                  <div>
                    <span className="text-sm font-medium">Applicant:</span>
                    <p className="text-sm text-muted-foreground">{details.applicantName}</p>
                  </div>
                )}
                {details.templeId && (
                  <div>
                    <span className="text-sm font-medium">Temple:</span>
                    <p className="text-sm text-muted-foreground">{details.templeId}</p>
                  </div>
                )}
                {details.darshanType && (
                  <div>
                    <span className="text-sm font-medium">Type:</span>
                    <Badge variant="outline">{details.darshanType}</Badge>
                  </div>
                )}
              </>
            )}

            {details.attachments && details.attachments.length > 0 && (
              <div>
                <span className="text-sm font-medium">Attachments:</span>
                <p className="text-sm text-muted-foreground">
                  {details.attachments.length} file(s) attached
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Assignment Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Assignment & SLA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {assignment.assignedTo && (
              <div>
                <span className="text-sm font-medium">Assigned to:</span>
                <p className="text-sm text-muted-foreground">{assignment.assignedTo}</p>
              </div>
            )}

            {assignment.department && (
              <div>
                <span className="text-sm font-medium">Department:</span>
                <p className="text-sm text-muted-foreground">{assignment.department}</p>
              </div>
            )}

            {assignment.priority && (
              <div>
                <span className="text-sm font-medium">Priority:</span>
                <Badge 
                  variant={priorityConfig[assignment.priority]?.color as any}
                  className="ml-2"
                >
                  {assignment.priority} - {priorityConfig[assignment.priority]?.label}
                </Badge>
              </div>
            )}

            {assignment.sla && (
              <div>
                <span className="text-sm font-medium">SLA Deadline:</span>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{assignment.sla}</span>
                </div>
              </div>
            )}

            {assignment.notes && (
              <div>
                <span className="text-sm font-medium">Instructions:</span>
                <p className="text-sm text-muted-foreground">{assignment.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Validation Warnings */}
      <Card className="border-orange-200 bg-orange-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <AlertTriangle className="h-5 w-5" />
            Review Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Module selected and details provided</span>
            </div>
            <div className="flex items-center gap-2">
              {assignment.assignedTo ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-orange-600" />
              )}
              <span>Executive admin assigned</span>
            </div>
            <div className="flex items-center gap-2">
              {assignment.priority ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-orange-600" />
              )}
              <span>Priority and SLA set</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};