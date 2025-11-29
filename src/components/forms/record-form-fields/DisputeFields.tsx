import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DisputeFieldsProps {
  formData: Record<string, unknown>;
  updateField: (field: string, value: string) => void;
}

export function DisputeFields({ formData, updateField }: DisputeFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="party_a_name">Party A Name *</Label>
          <Input
            id="party_a_name"
            value={(formData.party_a_name as string) || ''}
            onChange={(e) => updateField('party_a_name', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="party_a_contact">Party A Contact *</Label>
          <Input
            id="party_a_contact"
            value={(formData.party_a_contact as string) || ''}
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
            value={(formData.party_b_name as string) || ''}
            onChange={(e) => updateField('party_b_name', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="party_b_contact">Party B Contact *</Label>
          <Input
            id="party_b_contact"
            value={(formData.party_b_contact as string) || ''}
            onChange={(e) => updateField('party_b_contact', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Dispute Category *</Label>
        <Select 
          value={(formData.category as string) || ''} 
          onValueChange={(value) => updateField('category', value)}
        >
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
          value={(formData.description as string) || ''}
          onChange={(e) => updateField('description', e.target.value)}
          rows={4}
          required
        />
      </div>
    </>
  );
}
