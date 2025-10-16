import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUpload } from '@/components/shared/FileUpload';

interface TaskDetailsStepProps {
  module: string;
  details: Record<string, any>;
  onChange: (details: Record<string, any>) => void;
}

export const TaskDetailsStep = ({ module, details, onChange }: TaskDetailsStepProps) => {
  const updateField = (field: string, value: any) => {
    onChange({ ...details, [field]: value });
  };

  const renderCommonFields = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="time">Time *</Label>
          <Input
            id="time"
            type="datetime-local"
            value={details.time || ''}
            onChange={(e) => updateField('time', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="place">Place *</Label>
          <Input
            id="place"
            placeholder="Location/Address"
            value={details.place || ''}
            onChange={(e) => updateField('place', e.target.value)}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="reason">Reason/Purpose *</Label>
        <Textarea
          id="reason"
          placeholder="Brief description of the reason..."
          value={details.reason || ''}
          onChange={(e) => updateField('reason', e.target.value)}
          rows={3}
        />
      </div>
      
      <div>
        <Label htmlFor="description">Detailed Description *</Label>
        <Textarea
          id="description"
          placeholder="Detailed description..."
          value={details.description || ''}
          onChange={(e) => updateField('description', e.target.value)}
          rows={4}
        />
      </div>
      
      <div>
        <Label>Attachments</Label>
        <FileUpload
          onFilesChange={(files) => updateField('attachments', files)}
          maxFiles={10}
          acceptedTypes={['application/pdf', 'image/jpeg', 'image/png']}
        />
      </div>
    </>
  );

  const renderModuleSpecificFields = () => {
    switch (module) {
      case 'grievance':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="citizenName">Citizen Name *</Label>
                <Input
                  id="citizenName"
                  value={details.citizenName || ''}
                  onChange={(e) => updateField('citizenName', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="mobile">Mobile *</Label>
                <Input
                  id="mobile"
                  value={details.mobile || ''}
                  onChange={(e) => updateField('mobile', e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select onValueChange={(value) => updateField('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="infrastructure">Infrastructure</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="water">Water Supply</SelectItem>
                  <SelectItem value="electricity">Electricity</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );
      
      case 'dispute':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="partyA">Party A Name *</Label>
                <Input
                  id="partyA"
                  value={details.partyA || ''}
                  onChange={(e) => updateField('partyA', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="partyB">Party B Name *</Label>
                <Input
                  id="partyB"
                  value={details.partyB || ''}
                  onChange={(e) => updateField('partyB', e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="disputeCategory">Dispute Category *</Label>
              <Select onValueChange={(value) => updateField('disputeCategory', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="land">Land Disputes</SelectItem>
                  <SelectItem value="society">Society Issues</SelectItem>
                  <SelectItem value="welfare">Welfare Schemes</SelectItem>
                  <SelectItem value="tenancy">Tenancy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );
      
      case 'temple':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="applicantName">Applicant Name *</Label>
                <Input
                  id="applicantName"
                  value={details.applicantName || ''}
                  onChange={(e) => updateField('applicantName', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="templeId">Temple *</Label>
                <Select onValueChange={(value) => updateField('templeId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select temple" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tirupati">Tirupati</SelectItem>
                    <SelectItem value="srisailam">Srisailam</SelectItem>
                    <SelectItem value="simhachalam">Simhachalam</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="darshanType">Darshan Type *</Label>
                <Select onValueChange={(value) => updateField('darshanType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VIP">VIP</SelectItem>
                    <SelectItem value="GENERAL">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="preferredDate">Preferred Date *</Label>
                <Input
                  id="preferredDate"
                  type="date"
                  value={details.preferredDate || ''}
                  onChange={(e) => updateField('preferredDate', e.target.value)}
                />
              </div>
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  if (!module) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Please select a module first</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {renderModuleSpecificFields()}
        {renderCommonFields()}
      </CardContent>
    </Card>
  );
};