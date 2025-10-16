import { useState } from 'react';
import { Users, Building, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface AssignDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recordId: string;
  recordType: string;
  currentAssignee?: string;
  onAssign: (assigneeId: string, departmentId?: string, notes?: string) => Promise<void>;
}

interface User {
  id: string;
  name: string;
  role: string;
  department: string;
}

interface Department {
  id: string;
  name: string;
  description: string;
}

// Mock data - would come from API
const users: User[] = [
  { id: '1', name: 'Ravi Kumar', role: 'Executive Admin', department: 'Water Supply' },
  { id: '2', name: 'Priya Sharma', role: 'Executive Admin', department: 'Electricity' },
  { id: '3', name: 'Suresh Reddy', role: 'Executive Admin', department: 'Roads & Buildings' },
];

const departments: Department[] = [
  { id: '1', name: 'Water Supply', description: 'Water supply and sanitation issues' },
  { id: '2', name: 'Electricity', description: 'Power supply and electrical issues' },
  { id: '3', name: 'Roads & Buildings', description: 'Infrastructure and construction' },
];

export function AssignDrawer({
  open,
  onOpenChange,
  recordId,
  recordType,
  currentAssignee,
  onAssign,
}: AssignDrawerProps) {
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAssign = async () => {
    if (!selectedUser && !selectedDepartment) return;

    setLoading(true);
    try {
      await onAssign(selectedUser, selectedDepartment, notes);
      onOpenChange(false);
      // Reset form
      setSelectedUser('');
      setSelectedDepartment('');
      setNotes('');
    } catch (error) {
      console.error('Assignment failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Assign Record</SheetTitle>
          <SheetDescription>
            Assign {recordType} {recordId} to a user or department
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-6 py-6">
          {/* Assign to User */}
          <div className="space-y-2">
            <Label htmlFor="user-select" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Assign to User
            </Label>
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger>
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{user.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {user.department}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Assign to Department */}
          <div className="space-y-2">
            <Label htmlFor="department-select" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Route to Department
            </Label>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Select a department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    <div>
                      <div>{dept.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {dept.description}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Assignment Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Assignment Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes or instructions..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Current Assignment */}
          {currentAssignee && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm font-medium">Currently assigned to:</div>
              <div className="text-sm text-muted-foreground">{currentAssignee}</div>
            </div>
          )}
        </div>

        <SheetFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleAssign} 
            disabled={loading || (!selectedUser && !selectedDepartment)}
          >
            {loading ? 'Assigning...' : 'Assign'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}