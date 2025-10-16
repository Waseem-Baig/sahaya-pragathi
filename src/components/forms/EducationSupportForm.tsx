import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { GraduationCap, ArrowLeft, ArrowRight, Send } from 'lucide-react';
import { EducationSupportFormData, UserRole } from '@/types/government';
import { FileUpload } from '@/components/shared/FileUpload';

interface EducationSupportFormProps {
  onBack: () => void;
  onSubmit: (data: EducationSupportFormData) => void;
  userRole: UserRole;
}

interface ExtendedEducationFormData extends Partial<EducationSupportFormData> {
  draftRecommendation?: string;
  institutionConfirmation?: string[];
  supportingDocs?: string[];
}

export const EducationSupportForm = ({ onBack, onSubmit, userRole }: EducationSupportFormProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ExtendedEducationFormData>({
    status: 'APPLIED'
  });

  const handleNext = () => setStep(step + 1);
  const handlePrevious = () => setStep(step - 1);

  const handleSubmit = () => {
    const educationData: EducationSupportFormData = {
      id: `EDU-${Date.now()}`,
      studentName: formData.studentName || '',
      studentAge: formData.studentAge || 0,
      contact: formData.contact || '',
      institutionName: formData.institutionName || '',
      programApplied: formData.programApplied || '',
      feeConcessionPercentage: formData.feeConcessionPercentage || 0,
      status: formData.status || 'APPLIED',
      assignedTo: formData.assignedTo,
      createdAt: new Date().toISOString(),
    };
    onSubmit(educationData);
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
            <GraduationCap className="h-5 w-5" />
            Education Support Application
          </CardTitle>
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground">Step {step} of {totalSteps}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Student Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="studentName">Student Name *</Label>
                  <Input
                    id="studentName"
                    value={formData.studentName || ''}
                    onChange={(e) => updateFormData('studentName', e.target.value)}
                    placeholder="Enter student's full name"
                  />
                </div>
                <div>
                  <Label htmlFor="studentAge">Student Age *</Label>
                  <Input
                    id="studentAge"
                    type="number"
                    value={formData.studentAge || ''}
                    onChange={(e) => updateFormData('studentAge', parseInt(e.target.value))}
                    placeholder="Age in years"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="contact">Contact Number *</Label>
                <Input
                  id="contact"
                  value={formData.contact || ''}
                  onChange={(e) => updateFormData('contact', e.target.value)}
                  placeholder="Mobile number"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Institution & Program Details</h3>
              <div>
                <Label htmlFor="institutionName">Institution Name *</Label>
                <Input
                  id="institutionName"
                  value={formData.institutionName || ''}
                  onChange={(e) => updateFormData('institutionName', e.target.value)}
                  placeholder="Name of educational institution"
                />
              </div>
              <div>
                <Label htmlFor="programApplied">Program/Course Applied *</Label>
                <Input
                  id="programApplied"
                  value={formData.programApplied || ''}
                  onChange={(e) => updateFormData('programApplied', e.target.value)}
                  placeholder="Course or program name"
                />
              </div>
              <div>
                <Label htmlFor="feeConcessionPercentage">Fee Concession Requested (%)</Label>
                <Input
                  id="feeConcessionPercentage"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.feeConcessionPercentage || ''}
                  onChange={(e) => updateFormData('feeConcessionPercentage', parseInt(e.target.value))}
                  placeholder="Percentage of fee concession"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Supporting Documents</h3>
              <FileUpload 
                onFilesChange={(files: File[]) => updateFormData('documents', files.map(f => f.name))}
                acceptedTypes={['application/pdf', 'image/jpeg', 'image/png']}
                maxSizePerFile={10 * 1024 * 1024}
                maxFiles={5}
              />
              <div className="text-sm text-muted-foreground">
                <p>Required documents:</p>
                <ul className="list-disc list-inside mt-2">
                  <li>Income certificate</li>
                  <li>Previous academic marksheets</li>
                  <li>Admission letter (if available)</li>
                  <li>Caste certificate (if applicable)</li>
                  <li>Any other supporting documents</li>
                </ul>
              </div>
            </div>
          )}

          {step === 4 && userRole !== 'L3_CITIZEN' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Administrative Review</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="institutionConfirmation">Institution Confirmation</Label>
                  <FileUpload 
                    onFilesChange={(files: File[]) => updateFormData('institutionConfirmation', files.map(f => f.name))}
                    acceptedTypes={['application/pdf', 'image/jpeg', 'image/png']}
                    maxSizePerFile={10 * 1024 * 1024}
                    maxFiles={1}
                  />
                </div>
                <div>
                  <Label htmlFor="supportingDocs">Additional Supporting Documents</Label>
                  <FileUpload 
                    onFilesChange={(files: File[]) => updateFormData('supportingDocs', files.map(f => f.name))}
                    acceptedTypes={['application/pdf', 'image/jpeg', 'image/png']}
                    maxSizePerFile={10 * 1024 * 1024}
                    maxFiles={3}
                  />
                </div>
                <div>
                  <Label htmlFor="draftRecommendation">Draft Recommendation Letter</Label>
                  <Textarea
                    id="draftRecommendation"
                    value={formData.draftRecommendation || ''}
                    onChange={(e) => updateFormData('draftRecommendation', e.target.value)}
                    placeholder="Draft the recommendation letter..."
                    rows={4}
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