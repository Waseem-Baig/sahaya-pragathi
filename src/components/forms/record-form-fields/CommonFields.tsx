import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CommonFieldsProps {
  formData: Record<string, unknown>;
  updateField: (field: string, value: string) => void;
}

export function CommonFields({ formData, updateField }: CommonFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="applicant_name">Applicant Name *</Label>
          <Input
            id="applicant_name"
            value={(formData.applicant_name as string) || ''}
            onChange={(e) => updateField('applicant_name', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact">Contact Number *</Label>
          <Input
            id="contact"
            type="tel"
            value={(formData.contact as string) || ''}
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
          value={(formData.email as string) || ''}
          onChange={(e) => updateField('email', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="district">District *</Label>
          <Select 
            value={(formData.district as string) || ''} 
            onValueChange={(value) => updateField('district', value)}
          >
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
          <Select 
            value={(formData.mandal as string) || ''} 
            onValueChange={(value) => updateField('mandal', value)}
          >
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
            value={(formData.ward as string) || ''}
            onChange={(e) => updateField('ward', e.target.value)}
          />
        </div>
      </div>
    </>
  );
}
