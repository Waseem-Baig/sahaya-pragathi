import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Calendar, ArrowLeft, ArrowRight, Send } from 'lucide-react';
import { DISPUTE_CATEGORIES, DisputeFormData, UserRole } from '@/types/government';
import { FileUpload } from '@/components/shared/FileUpload';

interface DisputeFormProps {
  onBack: () => void;
  onSubmit: (data: DisputeFormData) => void;
  userRole: UserRole;
}

export const DisputeForm = ({ onBack, onSubmit, userRole }: DisputeFormProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<DisputeFormData>>({
    status: 'NEW'
  });

  const handleNext = () => setStep(step + 1);
  const handlePrevious = () => setStep(step - 1);

  const handleSubmit = () => {
    const disputeData: DisputeFormData = {
      id: `DIS-${Date.now()}`,
      partyAName: formData.partyAName || '',
      partyAContact: formData.partyAContact || '',
      partyAAddress: formData.partyAAddress || '',
      partyBName: formData.partyBName || '',
      partyBContact: formData.partyBContact || '',
      partyBAddress: formData.partyBAddress || '',
      category: formData.category || '',
      description: formData.description || '',
      incidentPlace: formData.incidentPlace || '',
      incidentDate: formData.incidentDate || '',
      status: formData.status || 'NEW',
      assignedTo: formData.assignedTo,
      createdAt: new Date().toISOString(),
    };
    onSubmit(disputeData);
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const totalSteps = userRole === 'L3_CITIZEN' ? 4 : 5;
  const progress = (step / totalSteps) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Dispute Resolution Form
          </CardTitle>
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground">Step {step} of {totalSteps}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Party A Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="partyAName">Party A Name *</Label>
                  <Input
                    id="partyAName"
                    value={formData.partyAName || ''}
                    onChange={(e) => updateFormData('partyAName', e.target.value)}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="partyAContact">Party A Contact *</Label>
                  <Input
                    id="partyAContact"
                    value={formData.partyAContact || ''}
                    onChange={(e) => updateFormData('partyAContact', e.target.value)}
                    placeholder="Mobile number"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="partyAAddress">Party A Address *</Label>
                <Textarea
                  id="partyAAddress"
                  value={formData.partyAAddress || ''}
                  onChange={(e) => updateFormData('partyAAddress', e.target.value)}
                  placeholder="Complete address"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Party B Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="partyBName">Party B Name *</Label>
                  <Input
                    id="partyBName"
                    value={formData.partyBName || ''}
                    onChange={(e) => updateFormData('partyBName', e.target.value)}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="partyBContact">Party B Contact *</Label>
                  <Input
                    id="partyBContact"
                    value={formData.partyBContact || ''}
                    onChange={(e) => updateFormData('partyBContact', e.target.value)}
                    placeholder="Mobile number"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="partyBAddress">Party B Address *</Label>
                <Textarea
                  id="partyBAddress"
                  value={formData.partyBAddress || ''}
                  onChange={(e) => updateFormData('partyBAddress', e.target.value)}
                  placeholder="Complete address"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Dispute Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Dispute Category *</Label>
                  <Select onValueChange={(value) => updateFormData('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {DISPUTE_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="incidentDate">Incident Date</Label>
                  <Input
                    id="incidentDate"
                    type="date"
                    value={formData.incidentDate || ''}
                    onChange={(e) => updateFormData('incidentDate', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="incidentPlace">Incident Place</Label>
                <Input
                  id="incidentPlace"
                  value={formData.incidentPlace || ''}
                  onChange={(e) => updateFormData('incidentPlace', e.target.value)}
                  placeholder="Location where dispute occurred"
                />
              </div>
              <div>
                <Label htmlFor="description">Dispute Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  placeholder="Describe the dispute in detail..."
                  rows={4}
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Supporting Documents</h3>
              <FileUpload 
                onFilesChange={(files: File[]) => updateFormData('documents', files.map(f => f.name))}
                acceptedTypes={['application/pdf', 'image/jpeg', 'image/png']}
                maxSizePerFile={10 * 1024 * 1024}
                maxFiles={5}
              />
              <div className="text-sm text-muted-foreground">
                <p>Upload relevant documents:</p>
                <ul className="list-disc list-inside mt-2">
                  <li>Property documents (if applicable)</li>
                  <li>Previous correspondence</li>
                  <li>Photographs of disputed items/property</li>
                  <li>Any legal notices</li>
                </ul>
              </div>
            </div>
          )}

          {step === 5 && userRole !== 'L3_CITIZEN' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Administrative Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mediatorId">Assign Mediator</Label>
                  <Select onValueChange={(value) => updateFormData('mediatorId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select mediator" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="med1">Mediator 1</SelectItem>
                      <SelectItem value="med2">Mediator 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="hearingDate">Schedule Hearing</Label>
                  <Input
                    id="hearingDate"
                    type="datetime-local"
                    value={formData.hearingDate || ''}
                    onChange={(e) => updateFormData('hearingDate', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="hearingPlace">Hearing Place</Label>
                <Input
                  id="hearingPlace"
                  value={formData.hearingPlace || ''}
                  onChange={(e) => updateFormData('hearingPlace', e.target.value)}
                  placeholder="Venue for hearing"
                />
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
                  Submit Dispute
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