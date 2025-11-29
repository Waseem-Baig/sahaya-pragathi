import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EducationFieldsProps {
  formData: Record<string, unknown>;
  updateField: (field: string, value: string) => void;
}

export function EducationFields({ formData, updateField }: EducationFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="student_name">Student Name *</Label>
          <Input
            id="student_name"
            value={(formData.student_name as string) || ''}
            onChange={(e) => updateField('student_name', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="student_age">Student Age</Label>
          <Input
            id="student_age"
            type="number"
            value={(formData.student_age as string) || ''}
            onChange={(e) => updateField('student_age', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="institution_name">Institution Name *</Label>
        <Input
          id="institution_name"
          value={(formData.institution_name as string) || ''}
          onChange={(e) => updateField('institution_name', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="program_applied">Program Applied *</Label>
        <Input
          id="program_applied"
          value={(formData.program_applied as string) || ''}
          onChange={(e) => updateField('program_applied', e.target.value)}
          required
        />
      </div>
    </>
  );
}
