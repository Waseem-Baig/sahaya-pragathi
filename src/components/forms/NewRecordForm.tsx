import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Upload } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface NewRecordFormProps {
  recordType: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function NewRecordForm({ recordType, onSubmit, onCancel }: NewRecordFormProps) {
  const [formData, setFormData] = useState<any>({});
  const [preferredDate, setPreferredDate] = useState<Date>();
  const [incidentDate, setIncidentDate] = useState<Date>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      preferred_date: preferredDate,
      incident_date: incidentDate,
      status: getInitialStatus(recordType),
      created_at: new Date().toISOString(),
    });
  };

  const getInitialStatus = (type: string) => {
    const statusMap = {
      grievance: 'NEW',
      dispute: 'NEW',
      temple: 'REQUESTED',
      cmrf: 'INTAKE',
      education: 'APPLIED',
      csr: 'APPLIED',
      appointment: 'REQUESTED',
      program: 'PLANNED'
    };
    return statusMap[type as keyof typeof statusMap] || 'NEW';
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const renderCommonFields = () => (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="applicant_name">Applicant Name *</Label>
          <Input
            id="applicant_name"
            value={formData.applicant_name || ''}
            onChange={(e) => updateField('applicant_name', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact">Contact Number *</Label>
          <Input
            id="contact"
            type="tel"
            value={formData.contact || ''}
            onChange={(e) => updateField('contact', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={formData.email || ''}
          onChange={(e) => updateField('email', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="district">District *</Label>
          <Select value={formData.district || ''} onValueChange={(value) => updateField('district', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select District" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nellore">Nellore</SelectItem>
              <SelectItem value="chittoor">Chittoor</SelectItem>
              <SelectItem value="tirupati">Tirupati</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="mandal">Mandal</Label>
          <Select value={formData.mandal || ''} onValueChange={(value) => updateField('mandal', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Mandal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nellore-rural">Nellore Rural</SelectItem>
              <SelectItem value="kavali">Kavali</SelectItem>
              <SelectItem value="gudur">Gudur</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="ward">Ward</Label>
          <Input
            id="ward"
            value={formData.ward || ''}
            onChange={(e) => updateField('ward', e.target.value)}
          />
        </div>
      </div>
    </>
  );

  const renderSpecificFields = () => {
    switch (recordType) {
      case 'grievance':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category || ''} onValueChange={(value) => updateField('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="water_supply">Water Supply</SelectItem>
                    <SelectItem value="roads">Roads & Transportation</SelectItem>
                    <SelectItem value="electricity">Electricity</SelectItem>
                    <SelectItem value="sanitation">Sanitation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={formData.priority || 'P3'} onValueChange={(value) => updateField('priority', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="P1">P1 - Critical</SelectItem>
                    <SelectItem value="P2">P2 - High</SelectItem>
                    <SelectItem value="P3">P3 - Medium</SelectItem>
                    <SelectItem value="P4">P4 - Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => updateField('description', e.target.value)}
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={incidentDate}
                      onSelect={setIncidentDate}
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
                  value={formData.incident_place || ''}
                  onChange={(e) => updateField('incident_place', e.target.value)}
                />
              </div>
            </div>
          </>
        );

      case 'dispute':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="party_a_name">Party A Name *</Label>
                <Input
                  id="party_a_name"
                  value={formData.party_a_name || ''}
                  onChange={(e) => updateField('party_a_name', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="party_a_contact">Party A Contact *</Label>
                <Input
                  id="party_a_contact"
                  value={formData.party_a_contact || ''}
                  onChange={(e) => updateField('party_a_contact', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="party_b_name">Party B Name *</Label>
                <Input
                  id="party_b_name"
                  value={formData.party_b_name || ''}
                  onChange={(e) => updateField('party_b_name', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="party_b_contact">Party B Contact *</Label>
                <Input
                  id="party_b_contact"
                  value={formData.party_b_contact || ''}
                  onChange={(e) => updateField('party_b_contact', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Dispute Category *</Label>
              <Select value={formData.category || ''} onValueChange={(value) => updateField('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="land">Land Dispute</SelectItem>
                  <SelectItem value="property">Property Dispute</SelectItem>
                  <SelectItem value="family">Family Dispute</SelectItem>
                  <SelectItem value="business">Business Dispute</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Dispute Description *</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => updateField('description', e.target.value)}
                rows={4}
                required
              />
            </div>
          </>
        );

      case 'temple':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="temple_name">Temple Name *</Label>
                <Select value={formData.temple_name || ''} onValueChange={(value) => updateField('temple_name', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Temple" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tirumala">Tirumala</SelectItem>
                    <SelectItem value="tirupati">Tirupati</SelectItem>
                    <SelectItem value="kanipakam">Kanipakam</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="darshan_type">Darshan Type *</Label>
                <Select value={formData.darshan_type || ''} onValueChange={(value) => updateField('darshan_type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VIP">VIP Darshan</SelectItem>
                    <SelectItem value="GENERAL">General Darshan</SelectItem>
                    <SelectItem value="SPECIAL">Special Darshan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Preferred Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !preferredDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {preferredDate ? format(preferredDate, "PPP") : "Select preferred date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={preferredDate}
                    onSelect={setPreferredDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </>
        );

      case 'cmrf':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patient_name">Patient Name *</Label>
                <Input
                  id="patient_name"
                  value={formData.patient_name || ''}
                  onChange={(e) => updateField('patient_name', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hospital_name">Hospital Name *</Label>
                <Input
                  id="hospital_name"
                  value={formData.hospital_name || ''}
                  onChange={(e) => updateField('hospital_name', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="illness_diagnosis">Illness/Diagnosis *</Label>
              <Textarea
                id="illness_diagnosis"
                value={formData.illness_diagnosis || ''}
                onChange={(e) => updateField('illness_diagnosis', e.target.value)}
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="estimated_cost">Estimated Treatment Cost *</Label>
                <Input
                  id="estimated_cost"
                  type="number"
                  value={formData.estimated_cost || ''}
                  onChange={(e) => updateField('estimated_cost', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Admission Date</Label>
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
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={incidentDate}
                      onSelect={setIncidentDate}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </>
        );

      case 'education':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="student_name">Student Name *</Label>
                <Input
                  id="student_name"
                  value={formData.student_name || ''}
                  onChange={(e) => updateField('student_name', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student_age">Student Age</Label>
                <Input
                  id="student_age"
                  type="number"
                  value={formData.student_age || ''}
                  onChange={(e) => updateField('student_age', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="institution_name">Institution Name *</Label>
              <Input
                id="institution_name"
                value={formData.institution_name || ''}
                onChange={(e) => updateField('institution_name', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="program_applied">Program Applied *</Label>
              <Input
                id="program_applied"
                value={formData.program_applied || ''}
                onChange={(e) => updateField('program_applied', e.target.value)}
                required
              />
            </div>
          </>
        );

      case 'csr':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name *</Label>
                <Input
                  id="company_name"
                  value={formData.company_name || ''}
                  onChange={(e) => updateField('company_name', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_person">Contact Person *</Label>
                <Input
                  id="contact_person"
                  value={formData.contact_person || ''}
                  onChange={(e) => updateField('contact_person', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="project_name">Project Name *</Label>
              <Input
                id="project_name"
                value={formData.project_name || ''}
                onChange={(e) => updateField('project_name', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget Estimate</Label>
              <Input
                id="budget"
                type="number"
                value={formData.budget || ''}
                onChange={(e) => updateField('budget', e.target.value)}
              />
            </div>
          </>
        );

      case 'appointment':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose of Meeting *</Label>
              <Textarea
                id="purpose"
                value={formData.purpose || ''}
                onChange={(e) => updateField('purpose', e.target.value)}
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Preferred Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !preferredDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {preferredDate ? format(preferredDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={preferredDate}
                    onSelect={setPreferredDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferred_time">Preferred Time</Label>
                <Input
                  id="preferred_time"
                  type="time"
                  value={formData.preferred_time || ''}
                  onChange={(e) => updateField('preferred_time', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meeting_place">Meeting Place</Label>
              <Input
                id="meeting_place"
                value={formData.meeting_place || ''}
                onChange={(e) => updateField('meeting_place', e.target.value)}
              />
            </div>
          </>
        );

      case 'program':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="program_name">Program Name *</Label>
              <Input
                id="program_name"
                value={formData.program_name || ''}
                onChange={(e) => updateField('program_name', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="program_type">Program Type *</Label>
              <Select value={formData.program_type || ''} onValueChange={(value) => updateField('program_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="job_mela">Job Mela</SelectItem>
                  <SelectItem value="training">Training Program</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="seminar">Seminar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="venue">Venue *</Label>
              <Input
                id="venue"
                value={formData.venue || ''}
                onChange={(e) => updateField('venue', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Program Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !preferredDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {preferredDate ? format(preferredDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={preferredDate}
                    onSelect={setPreferredDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {renderCommonFields()}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{recordType.charAt(0).toUpperCase() + recordType.slice(1)} Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {renderSpecificFields()}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => updateField('notes', e.target.value)}
              rows={3}
              placeholder="Any additional information..."
            />
          </div>

          <div className="space-y-2">
            <Label>Attachments</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Drop files here or click to upload
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supported: PDF, JPG, PNG (Max 10MB each)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="government">
          Submit for Approval
        </Button>
      </div>
    </form>
  );
}