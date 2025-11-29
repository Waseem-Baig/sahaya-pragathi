import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { CommonFields } from "./record-form-fields/CommonFields";
import { GrievanceFields } from "./record-form-fields/GrievanceFields";
import { DisputeFields } from "./record-form-fields/DisputeFields";
import { TempleFields } from "./record-form-fields/TempleFields";
import { CMRFFields } from "./record-form-fields/CMRFFields";
import { EducationFields } from "./record-form-fields/EducationFields";
import { CSRFields } from "./record-form-fields/CSRFields";
import { AppointmentFields } from "./record-form-fields/AppointmentFields";
import { ProgramFields } from "./record-form-fields/ProgramFields";

interface NewRecordFormProps {
  recordType: string;
  onSubmit: (data: Record<string, unknown>) => void;
  onCancel: () => void;
}

export function NewRecordForm({ recordType, onSubmit, onCancel }: NewRecordFormProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [preferredDate, setPreferredDate] = useState<Date>();
  const [incidentDate, setIncidentDate] = useState<Date>();
  const [admissionDate, setAdmissionDate] = useState<Date>();
  const [programDate, setProgramDate] = useState<Date>();

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

  const updateField = (field: string, value: string) => {
    setFormData((prev: Record<string, unknown>) => ({ ...prev, [field]: value }));
  };

  const renderSpecificFields = () => {
    switch (recordType) {
      case 'grievance':
        return <GrievanceFields formData={formData} updateField={updateField} incidentDate={incidentDate} setIncidentDate={setIncidentDate} />;
      case 'dispute':
        return <DisputeFields formData={formData} updateField={updateField} />;
      case 'temple':
        return <TempleFields formData={formData} updateField={updateField} preferredDate={preferredDate} setPreferredDate={setPreferredDate} />;
      case 'cmrf':
        return <CMRFFields formData={formData} updateField={updateField} admissionDate={admissionDate} setAdmissionDate={setAdmissionDate} />;
      case 'education':
        return <EducationFields formData={formData} updateField={updateField} />;
      case 'csr':
        return <CSRFields formData={formData} updateField={updateField} />;
      case 'appointment':
        return <AppointmentFields formData={formData} updateField={updateField} preferredDate={preferredDate} setPreferredDate={setPreferredDate} />;
      case 'program':
        return <ProgramFields formData={formData} updateField={updateField} programDate={programDate} setProgramDate={setProgramDate} />;
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
          <CommonFields formData={formData} updateField={updateField} />
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
              value={(formData.notes as string) || ''}
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