import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Clock, AlertTriangle } from 'lucide-react';

interface AssignmentStepProps {
  assignment: {
    assignedTo?: string;
    department?: string;
    sla?: string;
    priority?: string;
    notes?: string;
  };
  onChange: (assignment: any) => void;
}

const executiveAdmins = [
  { id: 'exec1', name: 'Rajesh Kumar', workload: 12, specialization: 'Grievances, Temple Letters' },
  { id: 'exec2', name: 'Priya Sharma', workload: 8, specialization: 'Education, CSR' },
  { id: 'exec3', name: 'Suresh Reddy', workload: 15, specialization: 'Disputes, Appointments' },
  { id: 'exec4', name: 'Meera Patel', workload: 6, specialization: 'CM Relief, Programs' },
];

const departments = [
  'Revenue Department',
  'Health Department',
  'Education Department',
  'Police Department',
  'GHMC',
  'Electricity Board',
  'Water Works',
];

const priorities = [
  { value: 'P1', label: 'Critical (48h)', color: 'destructive' },
  { value: 'P2', label: 'High (120h)', color: 'warning' },
  { value: 'P3', label: 'Medium (240h)', color: 'default' },
  { value: 'P4', label: 'Low (480h)', color: 'secondary' },
];

const slaOptions = [
  { value: '2h', label: '2 Hours' },
  { value: '24h', label: '24 Hours' },
  { value: '48h', label: '48 Hours' },
  { value: '72h', label: '72 Hours' },
  { value: '5d', label: '5 Days' },
  { value: '7d', label: '7 Days' },
  { value: '14d', label: '14 Days' },
];

export const AssignmentStep = ({ assignment, onChange }: AssignmentStepProps) => {
  const updateField = (field: string, value: any) => {
    onChange({ ...assignment, [field]: value });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Executive Admin Assignment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="assignedTo">Assign to Executive Admin *</Label>
            <Select onValueChange={(value) => updateField('assignedTo', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select executive admin" />
              </SelectTrigger>
              <SelectContent>
                {executiveAdmins.map((admin) => (
                  <SelectItem key={admin.id} value={admin.id}>
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <div className="font-medium">{admin.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {admin.specialization}
                        </div>
                      </div>
                      <Badge 
                        variant={admin.workload > 12 ? 'destructive' : admin.workload > 8 ? 'warning' : 'secondary'}
                        className="ml-2"
                      >
                        {admin.workload} tasks
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="department">Related Department (Optional)</Label>
            <Select onValueChange={(value) => updateField('department', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select department if applicable" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            SLA & Priority Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority">Priority *</Label>
              <Select onValueChange={(value) => updateField('priority', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      <div className="flex items-center gap-2">
                        <Badge variant={priority.color as any} className="text-xs">
                          {priority.value}
                        </Badge>
                        {priority.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="sla">SLA Deadline *</Label>
              <Select onValueChange={(value) => updateField('sla', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select SLA" />
                </SelectTrigger>
                <SelectContent>
                  {slaOptions.map((sla) => (
                    <SelectItem key={sla.value} value={sla.value}>
                      {sla.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assignment Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="notes">Instructions for Executive Admin</Label>
            <Textarea
              id="notes"
              placeholder="Add any specific instructions or context..."
              value={assignment.notes || ''}
              onChange={(e) => updateField('notes', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};