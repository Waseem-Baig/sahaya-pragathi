import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserCheck, Clock, AlertCircle, CheckCircle2, User, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Assignment {
  id: string;
  caseId: string;
  caseType: string;
  citizenName: string;
  assignedBy: string;
  assignedTo?: string;
  status: 'UNASSIGNED' | 'ASSIGNED' | 'IN_PROGRESS' | 'STAGE_1_COMPLETE' | 'STAGE_2_COMPLETE' | 'VERIFIED';
  priority: 'P1' | 'P2' | 'P3' | 'P4';
  assignedAt?: Date;
  dueDate: Date;
  verificationStage: 1 | 2 | null;
  notes?: string;
}

interface AssignmentManagerProps {
  userRole: 'L1_MASTER_ADMIN' | 'L2_EXEC_ADMIN';
  userId: string;
}

export function AssignmentManager({ userRole, userId }: AssignmentManagerProps) {
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: 'ASG-001',
      caseId: 'GRV-AP-NLR-2025-000123-X4',
      caseType: 'Grievance',
      citizenName: 'Ram Kumar',
      assignedBy: 'Master Admin',
      assignedTo: 'Executive Admin 1',
      status: 'STAGE_1_COMPLETE',
      priority: 'P2',
      assignedAt: new Date('2025-01-15'),
      dueDate: new Date('2025-01-20'),
      verificationStage: 1,
      notes: 'Water supply issue requires site verification'
    },
    {
      id: 'ASG-002',
      caseId: 'TDL-AP-GTR-2025-000045-Y8',
      caseType: 'Temple Letter',
      citizenName: 'Sita Devi',
      assignedBy: 'Master Admin',
      status: 'UNASSIGNED',
      priority: 'P3',
      dueDate: new Date('2025-01-25'),
      verificationStage: null,
    }
  ]);

  const [selectedAssignment, setSelectedAssignment] = useState<string>('');
  const [assigneeId, setAssigneeId] = useState<string>('');
  const [assignmentNotes, setAssignmentNotes] = useState<string>('');

  const executives = [
    { id: 'exec-1', name: 'Ravi Kumar', department: 'Water Supply' },
    { id: 'exec-2', name: 'Priya Sharma', department: 'Revenue' },
    { id: 'exec-3', name: 'Anil Reddy', department: 'Municipal' },
  ];

  const getStatusIcon = (status: Assignment['status']) => {
    switch (status) {
      case 'UNASSIGNED':
        return <AlertCircle className="h-4 w-4 text-warning" />;
      case 'ASSIGNED':
        return <Clock className="h-4 w-4 text-info" />;
      case 'IN_PROGRESS':
        return <User className="h-4 w-4 text-primary" />;
      case 'STAGE_1_COMPLETE':
        return <UserCheck className="h-4 w-4 text-success" />;
      case 'STAGE_2_COMPLETE':
        return <Users className="h-4 w-4 text-success" />;
      case 'VERIFIED':
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: Assignment['status']) => {
    const variants = {
      'UNASSIGNED': 'destructive',
      'ASSIGNED': 'secondary',
      'IN_PROGRESS': 'default',
      'STAGE_1_COMPLETE': 'success',
      'STAGE_2_COMPLETE': 'success',
      'VERIFIED': 'success',
    } as const;
    
    return (
      <Badge variant={variants[status] || 'secondary'}>
        {status.replace(/_/g, ' ')}
      </Badge>
    );
  };

  const handleAssign = () => {
    if (!selectedAssignment || !assigneeId) {
      toast({
        title: "Missing Information",
        description: "Please select assignment and assignee",
        variant: "destructive"
      });
      return;
    }

    setAssignments(prev => prev.map(assignment => 
      assignment.id === selectedAssignment 
        ? { 
            ...assignment, 
            assignedTo: executives.find(e => e.id === assigneeId)?.name,
            status: 'ASSIGNED' as const,
            assignedAt: new Date(),
            notes: assignmentNotes 
          }
        : assignment
    ));

    toast({
      title: "Assignment Successful",
      description: "Case has been assigned successfully"
    });

    setSelectedAssignment('');
    setAssigneeId('');
    setAssignmentNotes('');
  };

  const handleSelfAssign = (assignmentId: string) => {
    setAssignments(prev => prev.map(assignment => 
      assignment.id === assignmentId 
        ? { 
            ...assignment, 
            assignedTo: 'Current User',
            status: 'ASSIGNED' as const,
            assignedAt: new Date()
          }
        : assignment
    ));

    toast({
      title: "Self-Assignment Successful",
      description: "You have been assigned to this case"
    });
  };

  const unassignedCount = assignments.filter(a => a.status === 'UNASSIGNED').length;
  const inProgressCount = assignments.filter(a => a.status === 'IN_PROGRESS').length;
  const verificationCount = assignments.filter(a => a.status.includes('STAGE')).length;

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              <div>
                <p className="text-sm font-medium">Unassigned</p>
                <p className="text-2xl font-bold">{unassignedCount}</p>
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
              <UserCheck className="h-5 w-5 text-success" />
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
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="assignments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="assignments">All Assignments</TabsTrigger>
          <TabsTrigger value="assign">Assign Cases</TabsTrigger>
          <TabsTrigger value="verification">Verification Queue</TabsTrigger>
        </TabsList>

        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assignment Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignments.map((assignment) => (
                  <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(assignment.status)}
                      <div>
                        <p className="font-medium">{assignment.caseId}</p>
                        <p className="text-sm text-muted-foreground">
                          {assignment.caseType} - {assignment.citizenName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Due: {assignment.dueDate.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge variant={assignment.priority === 'P1' ? 'destructive' : 'secondary'}>
                        {assignment.priority}
                      </Badge>
                      {getStatusBadge(assignment.status)}
                      
                      {userRole === 'L2_EXEC_ADMIN' && assignment.status === 'UNASSIGNED' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleSelfAssign(assignment.id)}
                        >
                          Self Assign
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assign" className="space-y-4">
          {userRole === 'L1_MASTER_ADMIN' && (
            <Card>
              <CardHeader>
                <CardTitle>Assign Cases to Executive Admins</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Select Case</label>
                  <Select value={selectedAssignment} onValueChange={setSelectedAssignment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select case to assign" />
                    </SelectTrigger>
                    <SelectContent>
                      {assignments
                        .filter(a => a.status === 'UNASSIGNED')
                        .map((assignment) => (
                          <SelectItem key={assignment.id} value={assignment.id}>
                            {assignment.caseId} - {assignment.citizenName}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Assign to Executive</label>
                  <Select value={assigneeId} onValueChange={setAssigneeId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select executive admin" />
                    </SelectTrigger>
                    <SelectContent>
                      {executives.map((exec) => (
                        <SelectItem key={exec.id} value={exec.id}>
                          {exec.name} - {exec.department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Assignment Notes</label>
                  <Textarea
                    placeholder="Add any special instructions or notes..."
                    value={assignmentNotes}
                    onChange={(e) => setAssignmentNotes(e.target.value)}
                  />
                </div>

                <Button onClick={handleAssign} className="w-full">
                  Assign Case
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="verification" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cases in Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignments
                  .filter(a => a.status.includes('STAGE') || a.status === 'IN_PROGRESS')
                  .map((assignment) => (
                    <div key={assignment.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{assignment.caseId}</h4>
                        {getStatusBadge(assignment.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {assignment.citizenName} - {assignment.caseType}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>Assigned to: {assignment.assignedTo}</span>
                        <span>Stage: {assignment.verificationStage || 'Initial'}</span>
                        <span>Due: {assignment.dueDate.toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}