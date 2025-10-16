import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RecordForm } from '@/components/shared/RecordForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { FileUpload } from '@/components/shared/FileUpload';

// Step 1: Citizen Information
const CitizenInfoStep = ({ data, onChange }: any) => {
  const updateField = (field: string, value: any) => {
    onChange({ [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Citizen Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="citizen_name">Full Name *</Label>
            <Input
              id="citizen_name"
              value={data.citizen_name || ''}
              onChange={(e) => updateField('citizen_name', e.target.value)}
              placeholder="Enter full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile Number *</Label>
            <Input
              id="mobile"
              value={data.mobile || ''}
              onChange={(e) => updateField('mobile', e.target.value)}
              placeholder="10-digit mobile number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={data.email || ''}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="Enter email address"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="aadhaar_number">Aadhaar Number</Label>
            <Input
              id="aadhaar_number"
              value={data.aadhaar_number || ''}
              onChange={(e) => updateField('aadhaar_number', e.target.value)}
              placeholder="12-digit Aadhaar number"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address *</Label>
          <Textarea
            id="address"
            value={data.address || ''}
            onChange={(e) => updateField('address', e.target.value)}
            placeholder="Complete address"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="district">District *</Label>
            <Select value={data.district || ''} onValueChange={(value) => updateField('district', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select District" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Nellore">Nellore</SelectItem>
                <SelectItem value="Tirupati">Tirupati</SelectItem>
                <SelectItem value="Vijayawada">Vijayawada</SelectItem>
                <SelectItem value="Visakhapatnam">Visakhapatnam</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mandal">Mandal *</Label>
            <Select value={data.mandal || ''} onValueChange={(value) => updateField('mandal', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Mandal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Nellore Rural">Nellore Rural</SelectItem>
                <SelectItem value="Gudur">Gudur</SelectItem>
                <SelectItem value="Kavali">Kavali</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ward">Ward *</Label>
            <Select value={data.ward || ''} onValueChange={(value) => updateField('ward', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Ward" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ward 1">Ward 1</SelectItem>
                <SelectItem value="Ward 2">Ward 2</SelectItem>
                <SelectItem value="Ward 15">Ward 15</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pincode">Pincode</Label>
            <Input
              id="pincode"
              value={data.pincode || ''}
              onChange={(e) => updateField('pincode', e.target.value)}
              placeholder="6-digit pincode"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Step 2: Grievance Details
const GrievanceDetailsStep = ({ data, onChange }: any) => {
  const [incidentDate, setIncidentDate] = useState<Date | undefined>(
    data.incident_date ? new Date(data.incident_date) : undefined
  );

  const updateField = (field: string, value: any) => {
    onChange({ [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grievance Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={data.category || ''} onValueChange={(value) => updateField('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Water Supply">Water Supply</SelectItem>
                <SelectItem value="Electricity">Electricity</SelectItem>
                <SelectItem value="Roads">Roads</SelectItem>
                <SelectItem value="Sanitation">Sanitation</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subcategory">Subcategory *</Label>
            <Select value={data.subcategory || ''} onValueChange={(value) => updateField('subcategory', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Subcategory" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New Connection">New Connection</SelectItem>
                <SelectItem value="Repair">Repair</SelectItem>
                <SelectItem value="Billing Issue">Billing Issue</SelectItem>
                <SelectItem value="Quality Issue">Quality Issue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={data.description || ''}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Describe your grievance in detail (500-2000 characters)"
            rows={6}
            minLength={500}
            maxLength={2000}
          />
          <div className="text-xs text-muted-foreground text-right">
            {data.description?.length || 0} / 2000 characters
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Incident Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !incidentDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {incidentDate ? format(incidentDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={incidentDate}
                  onSelect={(date) => {
                    setIncidentDate(date);
                    updateField('incident_date', date?.toISOString().split('T')[0]);
                  }}
                  disabled={(date) => date > new Date()}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="incident_place">Incident Place</Label>
            <Input
              id="incident_place"
              value={data.incident_place || ''}
              onChange={(e) => updateField('incident_place', e.target.value)}
              placeholder="Where did the incident occur?"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority *</Label>
          <Select value={data.priority || 'P3'} onValueChange={(value) => updateField('priority', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="P1">P1 - Critical (Emergency)</SelectItem>
              <SelectItem value="P2">P2 - High (Urgent)</SelectItem>
              <SelectItem value="P3">P3 - Medium (Normal)</SelectItem>
              <SelectItem value="P4">P4 - Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Attachments</Label>
          <FileUpload
            onFilesChange={(files) => updateField('attachments', files.map(f => f.name))}
            acceptedTypes={['image/jpeg', 'image/png', 'application/pdf']}
            maxSizePerFile={10 * 1024 * 1024} // 10MB
            maxFiles={10}
          />
        </div>
      </CardContent>
    </Card>
  );
};

// Step 3: Assignment (Admin Only)
const AssignmentStep = ({ data, onChange }: any) => {
  const [slaDate, setSlaDate] = useState<Date | undefined>(
    data.sla_due_at ? new Date(data.sla_due_at) : undefined
  );

  const updateField = (field: string, value: any) => {
    onChange({ [field]: value });
  };

  const availableOfficers = [
    { id: 'officer1', name: 'Priya Sharma', department: 'Water Supply', workload: '15 cases' },
    { id: 'officer2', name: 'Rajesh Kumar', department: 'Electricity', workload: '12 cases' },
    { id: 'officer3', name: 'Meera Devi', department: 'Roads', workload: '18 cases' },
  ];

  const departments = [
    'Water Supply Department',
    'Electricity Department', 
    'Roads & Buildings Department',
    'Municipal Corporation',
    'Health Department'
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assignment & Routing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="assigned_to">Assign To Executive Admin</Label>
            <Select value={data.assigned_to || ''} onValueChange={(value) => updateField('assigned_to', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Officer" />
              </SelectTrigger>
              <SelectContent>
                {availableOfficers.map(officer => (
                  <SelectItem key={officer.id} value={officer.name}>
                    <div>
                      <div className="font-medium">{officer.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {officer.department} • {officer.workload}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assigned_dept">Department</Label>
            <Select value={data.assigned_dept || ''} onValueChange={(value) => updateField('assigned_dept', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>SLA Due Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !slaDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {slaDate ? format(slaDate, "PPP") : "Select SLA due date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={slaDate}
                onSelect={(date) => {
                  setSlaDate(date);
                  updateField('sla_due_at', date?.toISOString());
                }}
                disabled={(date) => date < new Date()}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="progress_notes">Initial Notes</Label>
          <Textarea
            id="progress_notes"
            value={data.progress_notes || ''}
            onChange={(e) => updateField('progress_notes', e.target.value)}
            placeholder="Add initial assessment or routing instructions"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Initial Status</Label>
          <Select value={data.status || 'NEW'} onValueChange={(value) => updateField('status', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NEW">New</SelectItem>
              <SelectItem value="TRIAGED">Triaged</SelectItem>
              <SelectItem value="ASSIGNED">Assigned</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default function GrievanceForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const steps = [
    {
      id: 'citizen-info',
      title: 'Citizen Information',
      description: 'Basic details of the person filing the grievance',
      component: CitizenInfoStep,
      required: true,
      validation: (data: any) => {
        const errors = [];
        if (!data.citizen_name) errors.push('Citizen name is required');
        if (!data.mobile) errors.push('Mobile number is required');
        if (!data.address) errors.push('Address is required');
        if (!data.district) errors.push('District is required');
        if (!data.mandal) errors.push('Mandal is required');
        if (!data.ward) errors.push('Ward is required');
        return errors.length > 0 ? errors : null;
      }
    },
    {
      id: 'grievance-details',
      title: 'Grievance Details',
      description: 'Specific information about the grievance',
      component: GrievanceDetailsStep,
      required: true,
      validation: (data: any) => {
        const errors = [];
        if (!data.category) errors.push('Category is required');
        if (!data.subcategory) errors.push('Subcategory is required');
        if (!data.description) errors.push('Description is required');
        if (data.description && data.description.length < 500) {
          errors.push('Description must be at least 500 characters');
        }
        return errors.length > 0 ? errors : null;
      }
    },
    {
      id: 'assignment',
      title: 'Assignment & Routing',
      description: 'Assign to officers and set priorities',
      component: AssignmentStep,
      required: false
    }
  ];

  const handleSubmit = async (data: any, isDraft = false) => {
    console.log('Submitting grievance:', { ...data, isDraft });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (isDraft) {
      console.log('Saved as draft');
    } else {
      console.log('Grievance submitted successfully');
      navigate('/admin/grievances');
    }
  };

  const handleCancel = () => {
    navigate('/admin/grievances');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">
          {isEdit ? 'Edit Grievance' : 'New Grievance'}
        </h1>
      </div>

      <RecordForm
        steps={steps}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        title={isEdit ? 'Edit Grievance' : 'Create New Grievance'}
        allowDraft={true}
      />
    </div>
  );
}