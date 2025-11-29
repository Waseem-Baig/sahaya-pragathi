import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CSRFieldsProps {
  formData: Record<string, unknown>;
  updateField: (field: string, value: string) => void;
}

export function CSRFields({ formData, updateField }: CSRFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="company_name">Company Name *</Label>
          <Input
            id="company_name"
            value={(formData.company_name as string) || ''}
            onChange={(e) => updateField('company_name', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact_person">Contact Person *</Label>
          <Input
            id="contact_person"
            value={(formData.contact_person as string) || ''}
            onChange={(e) => updateField('contact_person', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="project_name">Project Name *</Label>
        <Input
          id="project_name"
          value={(formData.project_name as string) || ''}
          onChange={(e) => updateField('project_name', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="budget">Budget Estimate</Label>
        <Input
          id="budget"
          type="number"
          value={(formData.budget as string) || ''}
          onChange={(e) => updateField('budget', e.target.value)}
        />
      </div>
    </>
  );
}
