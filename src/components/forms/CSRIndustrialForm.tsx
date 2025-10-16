import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Building2, ArrowLeft, ArrowRight, Send } from 'lucide-react';
import { CSRIndustrialFormData, UserRole } from '@/types/government';
import { FileUpload } from '@/components/shared/FileUpload';

interface CSRIndustrialFormProps {
  onBack: () => void;
  onSubmit: (data: CSRIndustrialFormData) => void;
  userRole: UserRole;
}

interface ExtendedCSRFormData extends Partial<CSRIndustrialFormData> {
  milestoneReports?: string[];
  govtAcknowledgment?: string[];
}

export const CSRIndustrialForm = ({ onBack, onSubmit, userRole }: CSRIndustrialFormProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ExtendedCSRFormData>({
    status: 'APPLIED'
  });

  const handleNext = () => setStep(step + 1);
  const handlePrevious = () => setStep(step - 1);

  const handleSubmit = () => {
    const csrData: CSRIndustrialFormData = {
      id: `CSR-${Date.now()}`,
      companyName: formData.companyName || '',
      contactPerson: formData.contactPerson || '',
      cinPan: formData.cinPan,
      projectName: formData.projectName || '',
      budget: formData.budget || 0,
      district: formData.district,
      mandal: formData.mandal,
      tenderReference: formData.tenderReference,
      status: formData.status || 'APPLIED',
      assignedTo: formData.assignedTo,
      createdAt: new Date().toISOString(),
    };
    onSubmit(csrData);
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const totalSteps = userRole === 'L3_CITIZEN' ? 3 : 4;
  const progress = (step / totalSteps) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            CSR & Industrial Relations Application
          </CardTitle>
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground">Step {step} of {totalSteps}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Company Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName || ''}
                    onChange={(e) => updateFormData('companyName', e.target.value)}
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <Label htmlFor="contactPerson">Contact Person *</Label>
                  <Input
                    id="contactPerson"
                    value={formData.contactPerson || ''}
                    onChange={(e) => updateFormData('contactPerson', e.target.value)}
                    placeholder="Contact person name"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="cinPan">CIN/PAN Number</Label>
                <Input
                  id="cinPan"
                  value={formData.cinPan || ''}
                  onChange={(e) => updateFormData('cinPan', e.target.value)}
                  placeholder="Company identification number"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Project Details</h3>
              <div>
                <Label htmlFor="projectName">Project Name *</Label>
                <Input
                  id="projectName"
                  value={formData.projectName || ''}
                  onChange={(e) => updateFormData('projectName', e.target.value)}
                  placeholder="Name of the project/initiative"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="budget">Project Budget (₹) *</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={formData.budget || ''}
                    onChange={(e) => updateFormData('budget', parseFloat(e.target.value))}
                    placeholder="Budget amount"
                  />
                </div>
                <div>
                  <Label htmlFor="district">District</Label>
                  <Input
                    id="district"
                    value={formData.district || ''}
                    onChange={(e) => updateFormData('district', e.target.value)}
                    placeholder="Project district"
                  />
                </div>
                <div>
                  <Label htmlFor="mandal">Mandal</Label>
                  <Input
                    id="mandal"
                    value={formData.mandal || ''}
                    onChange={(e) => updateFormData('mandal', e.target.value)}
                    placeholder="Project mandal"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="tenderReference">Tender Reference (if any)</Label>
                <Input
                  id="tenderReference"
                  value={formData.tenderReference || ''}
                  onChange={(e) => updateFormData('tenderReference', e.target.value)}
                  placeholder="Tender reference number"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Required Documents</h3>
              <FileUpload 
                onFilesChange={(files: File[]) => updateFormData('documents', files.map(f => f.name))}
                acceptedTypes={['application/pdf', 'image/jpeg', 'image/png']}
                maxSizePerFile={10 * 1024 * 1024}
                maxFiles={5}
              />
              <div className="text-sm text-muted-foreground">
                <p>Required documents:</p>
                <ul className="list-disc list-inside mt-2">
                  <li>MoU/Agreement draft</li>
                  <li>Project proposal</li>
                  <li>Company CSR policy</li>
                  <li>Registration certificates</li>
                  <li>Financial statements</li>
                </ul>
              </div>
            </div>
          )}

          {step === 4 && userRole !== 'L3_CITIZEN' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Administrative Review</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="progressNotes">Progress Notes</Label>
                  <Textarea
                    id="progressNotes"
                    value={formData.progressNotes || ''}
                    onChange={(e) => updateFormData('progressNotes', e.target.value)}
                    placeholder="Add progress notes and updates..."
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="milestoneReports">Milestone Reports</Label>
                  <FileUpload 
                    onFilesChange={(files: File[]) => updateFormData('milestoneReports', files.map(f => f.name))}
                    acceptedTypes={['application/pdf', 'image/jpeg', 'image/png']}
                    maxSizePerFile={10 * 1024 * 1024}
                    maxFiles={3}
                  />
                </div>
                <div>
                  <Label htmlFor="govtAcknowledgment">Government Department Acknowledgment</Label>
                  <FileUpload 
                    onFilesChange={(files: File[]) => updateFormData('govtAcknowledgment', files.map(f => f.name))}
                    acceptedTypes={['application/pdf', 'image/jpeg', 'image/png']}
                    maxSizePerFile={10 * 1024 * 1024}
                    maxFiles={2}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button 
              onClick={onBack} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            
            <div className="flex gap-2">
              {step > 1 && (
                <Button 
                  onClick={handlePrevious} 
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>
              )}
              
              {step < totalSteps ? (
                <Button 
                  onClick={handleNext}
                  className="flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  className="flex items-center gap-2"
                >
                  Submit Application
                  <Send className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};