import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Calendar, ArrowLeft, Send } from 'lucide-react';
import { AppointmentFormData, UserRole, PURPOSE_TYPES } from '@/types/government';

interface AppointmentBookingFormProps {
  onBack: () => void;
  onSubmit: (data: AppointmentFormData) => void;
  userRole: UserRole;
}

export const AppointmentBookingForm = ({ onBack, onSubmit, userRole }: AppointmentBookingFormProps) => {
  const [formData, setFormData] = useState<Partial<AppointmentFormData>>({
    status: 'REQUESTED'
  });

  const handleSubmit = () => {
    const appointmentData: AppointmentFormData = {
      id: `APT-${Date.now()}`,
      applicantName: formData.applicantName || '',
      contact: formData.contact || '',
      purpose: formData.purpose || 'CITIZEN',
      preferredDate: formData.preferredDate || '',
      preferredTime: formData.preferredTime,
      notes: formData.notes,
      status: formData.status || 'REQUESTED',
      assignedTo: formData.assignedTo,
      createdAt: new Date().toISOString(),
    };
    onSubmit(appointmentData);
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Appointment Booking
          </CardTitle>
          <Progress value={100} className="w-full" />
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Appointment Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="applicantName">Applicant Name *</Label>
                <Input
                  id="applicantName"
                  value={formData.applicantName || ''}
                  onChange={(e) => updateFormData('applicantName', e.target.value)}
                  placeholder="Enter your full name"
                />
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

            <div>
              <Label htmlFor="purpose">Purpose of Meeting *</Label>
              <Select onValueChange={(value) => updateFormData('purpose', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent>
                  {PURPOSE_TYPES.map((purpose) => (
                    <SelectItem key={purpose.value} value={purpose.value}>
                      {purpose.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="preferredDate">Preferred Date *</Label>
                <Input
                  id="preferredDate"
                  type="date"
                  value={formData.preferredDate || ''}
                  onChange={(e) => updateFormData('preferredDate', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="preferredTime">Preferred Time</Label>
                <Input
                  id="preferredTime"
                  type="time"
                  value={formData.preferredTime || ''}
                  onChange={(e) => updateFormData('preferredTime', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes/Reason for Meeting</Label>
              <Textarea
                id="notes"
                value={formData.notes || ''}
                onChange={(e) => updateFormData('notes', e.target.value)}
                placeholder="Briefly describe the purpose of your meeting..."
                rows={4}
              />
            </div>

            {userRole !== 'L3_CITIZEN' && (
              <div className="space-y-4 border-t pt-4">
                <h4 className="font-semibold">Administrative Actions</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="confirmedSlot">Confirmed Slot</Label>
                    <Input
                      id="confirmedSlot"
                      type="datetime-local"
                      value={formData.confirmedSlot || ''}
                      onChange={(e) => updateFormData('confirmedSlot', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="meetingPlace">Meeting Place</Label>
                    <Input
                      id="meetingPlace"
                      value={formData.meetingPlace || ''}
                      onChange={(e) => updateFormData('meetingPlace', e.target.value)}
                      placeholder="Meeting venue"
                    />
                  </div>
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
              className="flex items-center gap-2"
            >
              Book Appointment
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};