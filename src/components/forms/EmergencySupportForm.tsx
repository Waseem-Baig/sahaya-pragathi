import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, ArrowLeft, Send } from 'lucide-react';
import { EmergencySupportFormData, UserRole, EMERGENCY_TYPES } from '@/types/government';
import { FileUpload } from '@/components/shared/FileUpload';

interface EmergencySupportFormProps {
  onBack: () => void;
  onSubmit: (data: EmergencySupportFormData) => void;
  userRole: UserRole;
}

interface ExtendedEmergencyFormData extends Partial<EmergencySupportFormData> {
  proofDocuments?: string[];
}

export const EmergencySupportForm = ({ onBack, onSubmit, userRole }: EmergencySupportFormProps) => {
  const [formData, setFormData] = useState<ExtendedEmergencyFormData>({
    status: 'LOGGED'
  });

  const handleSubmit = () => {
    const emergencyData: EmergencySupportFormData = {
      id: `EMR-${Date.now()}`,
      applicantName: formData.applicantName || '',
      mobile: formData.mobile || '',
      emergencyType: formData.emergencyType || 'OTHER',
      location: formData.location || '',
      description: formData.description || '',
      officerContact: formData.officerContact,
      actionTaken: formData.actionTaken,
      status: formData.status || 'LOGGED',
      assignedTo: formData.assignedTo,
      createdAt: new Date().toISOString(),
    };
    onSubmit(emergencyData);
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Auto-detect location if available
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          updateFormData('location', `${latitude}, ${longitude}`);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="border-red-200">
        <CardHeader className="bg-red-50">
          <CardTitle className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="h-5 w-5" />
            Emergency Support Request
          </CardTitle>
          <Progress value={100} className="w-full" />
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-red-800 font-medium">
              🚨 For immediate life-threatening emergencies, please call 108 or 112 directly
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Emergency Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="applicantName">Your Name *</Label>
                <Input
                  id="applicantName"
                  value={formData.applicantName || ''}
                  onChange={(e) => updateFormData('applicantName', e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="mobile">Mobile Number *</Label>
                <Input
                  id="mobile"
                  value={formData.mobile || ''}
                  onChange={(e) => updateFormData('mobile', e.target.value)}
                  placeholder="Mobile number"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="emergencyType">Emergency Type *</Label>
              <Select onValueChange={(value) => updateFormData('emergencyType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select emergency type" />
                </SelectTrigger>
                <SelectContent>
                  {EMERGENCY_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location">Location *</Label>
              <div className="flex gap-2">
                <Input
                  id="location"
                  value={formData.location || ''}
                  onChange={(e) => updateFormData('location', e.target.value)}
                  placeholder="Describe location or GPS coordinates"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGetLocation}
                  className="whitespace-nowrap"
                >
                  Get GPS
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Emergency Description *</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => updateFormData('description', e.target.value)}
                placeholder="Describe the emergency situation in detail..."
                rows={4}
              />
            </div>

            {userRole !== 'L3_CITIZEN' && (
              <div className="space-y-4 border-t pt-4">
                <h4 className="font-semibold">Administrative Response</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="officerContact">Officer Contact Assigned</Label>
                    <Input
                      id="officerContact"
                      value={formData.officerContact || ''}
                      onChange={(e) => updateFormData('officerContact', e.target.value)}
                      placeholder="Assigned officer contact"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="actionTaken">Action Taken</Label>
                  <Textarea
                    id="actionTaken"
                    value={formData.actionTaken || ''}
                    onChange={(e) => updateFormData('actionTaken', e.target.value)}
                    placeholder="Describe actions taken..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="proofDocuments">Upload Proof (FIR copy, Medical slip, etc.)</Label>
                  <FileUpload 
                    onFilesChange={(files: File[]) => updateFormData('proofDocuments', files.map(f => f.name))}
                    acceptedTypes={['application/pdf', 'image/jpeg', 'image/png']}
                    maxSizePerFile={10 * 1024 * 1024}
                    maxFiles={3}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between pt-4">
            <Button 
              onClick={onBack} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            
            <Button 
              onClick={handleSubmit}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
            >
              Submit Emergency Request
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};