import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Building2, FileText, Send } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface DepartmentRoutingModalProps {
  open: boolean;
  onClose: () => void;
  recordType?: string;
  recordId?: string;
  recordTitle?: string;
}

const departments = [
  {
    id: 'water',
    name: 'Water Supply Department',
    description: 'Water connections, quality issues, billing',
    officers: ['Chief Engineer - Water', 'Assistant Engineer - Zone 1', 'Assistant Engineer - Zone 2'],
  },
  {
    id: 'electricity', 
    name: 'Electricity Department',
    description: 'Power supply, connections, faults',
    officers: ['Superintending Engineer', 'Assistant Engineer - Urban', 'Assistant Engineer - Rural'],
  },
  {
    id: 'roads',
    name: 'Roads & Buildings Department',
    description: 'Road maintenance, construction, infrastructure',
    officers: ['Executive Engineer', 'Assistant Engineer - Roads', 'Junior Engineer'],
  },
  {
    id: 'municipal',
    name: 'Municipal Corporation',
    description: 'Sanitation, permits, local administration',
    officers: ['Municipal Commissioner', 'Health Officer', 'Engineering Officer'],
  },
  {
    id: 'health',
    name: 'Health Department', 
    description: 'Healthcare services, hospital administration',
    officers: ['District Medical Officer', 'Civil Surgeon', 'Public Health Officer'],
  },
];

export function DepartmentRoutingModal({
  open,
  onClose,
  recordType = 'Record',
  recordId,
  recordTitle,
}: DepartmentRoutingModalProps) {
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedOfficer, setSelectedOfficer] = useState('');
  const [outwardNumber, setOutwardNumber] = useState('');
  const [expectedDate, setExpectedDate] = useState<Date>();
  const [memoContent, setMemoContent] = useState('');
  const [priority, setPriority] = useState('normal');

  // Generate outward number when department is selected
  const handleDepartmentChange = (deptId: string) => {
    setSelectedDepartment(deptId);
    setSelectedOfficer('');
    
    // Auto-generate outward number
    const dept = departments.find(d => d.id === deptId);
    if (dept) {
      const deptCode = dept.name.split(' ').map(w => w[0]).join('').toUpperCase();
      const dateCode = format(new Date(), 'yyyyMMdd');
      const seqNumber = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
      setOutwardNumber(`OUT/${deptCode}/${dateCode}/${seqNumber}`);
    }
  };

  const handleRoute = () => {
    const routingData = {
      recordId,
      department: selectedDepartment,
      officer: selectedOfficer,
      outwardNumber,
      expectedDate: expectedDate?.toISOString(),
      memoContent,
      priority,
      routedAt: new Date().toISOString(),
      routedBy: 'Current User', // Would come from auth context
    };

    console.log('Routing data:', routingData);
    
    // Here you would make the API call to route to department
    // This would also generate the memo PDF and log to timeline
    
    onClose();
  };

  const selectedDept = departments.find(d => d.id === selectedDepartment);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Route to Department
          </DialogTitle>
          <DialogDescription>
            Forward this {recordType.toLowerCase()} to the appropriate department for action.
            {recordId && ` Record: ${recordId}`}
            {recordTitle && ` - ${recordTitle}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Department Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Select Department</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedDepartment} onValueChange={handleDepartmentChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept.id} value={dept.id}>
                      <div>
                        <div className="font-medium">{dept.name}</div>
                        <div className="text-xs text-muted-foreground">{dept.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedDept && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">{selectedDept.name}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{selectedDept.description}</p>
                  <div className="space-y-2">
                    <Label htmlFor="officer">Assign to Officer</Label>
                    <Select value={selectedOfficer} onValueChange={setSelectedOfficer}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select officer (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedDept.officers.map(officer => (
                          <SelectItem key={officer} value={officer}>
                            {officer}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Routing Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Routing Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="outward">Outward Number</Label>
                  <Input
                    id="outward"
                    value={outwardNumber}
                    onChange={(e) => setOutwardNumber(e.target.value)}
                    placeholder="Auto-generated"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urgent">
                        <div className="flex items-center gap-2">
                          <Badge variant="destructive">Urgent</Badge>
                          <span>Immediate action required</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="high">
                        <div className="flex items-center gap-2">
                          <Badge variant="warning">High</Badge>
                          <span>Within 24 hours</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="normal">
                        <div className="flex items-center gap-2">
                          <Badge variant="default">Normal</Badge>
                          <span>Standard processing</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Expected Response Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !expectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {expectedDate ? format(expectedDate, "PPP") : "Select expected date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={expectedDate}
                      onSelect={setExpectedDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>

          {/* Memo Content */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Official Memo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="memo">Memo Content</Label>
                <Textarea
                  id="memo"
                  value={memoContent}
                  onChange={(e) => setMemoContent(e.target.value)}
                  placeholder="Enter the official memo content that will be sent to the department..."
                  rows={6}
                />
              </div>

              {memoContent && (
                <div className="p-3 bg-muted/50 rounded-lg border-l-4 border-primary">
                  <h5 className="font-medium mb-2">Memo Preview</h5>
                  <div className="text-sm space-y-2">
                    <div><strong>To:</strong> {selectedDept?.name}</div>
                    {selectedOfficer && <div><strong>Attention:</strong> {selectedOfficer}</div>}
                    <div><strong>Reference:</strong> {outwardNumber}</div>
                    <div><strong>Subject:</strong> {recordType} - {recordId}</div>
                    <Separator className="my-2" />
                    <div className="whitespace-pre-wrap">{memoContent}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={handleRoute} className="flex-1">
              <Send className="h-4 w-4 mr-2" />
              Route to Department
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}