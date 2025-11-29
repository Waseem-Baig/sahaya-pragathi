import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface CMRFFieldsProps {
  formData: Record<string, unknown>;
  updateField: (field: string, value: string) => void;
  admissionDate: Date | undefined;
  setAdmissionDate: (date: Date | undefined) => void;
}

export function CMRFFields({ formData, updateField, admissionDate, setAdmissionDate }: CMRFFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="patient_name">Patient Name *</Label>
          <Input
            id="patient_name"
            value={(formData.patient_name as string) || ''}
            onChange={(e) => updateField('patient_name', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hospital_name">Hospital Name *</Label>
          <Input
            id="hospital_name"
            value={(formData.hospital_name as string) || ''}
            onChange={(e) => updateField('hospital_name', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="illness_diagnosis">Illness/Diagnosis *</Label>
        <Textarea
          id="illness_diagnosis"
          value={(formData.illness_diagnosis as string) || ''}
          onChange={(e) => updateField('illness_diagnosis', e.target.value)}
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="estimated_cost">Estimated Treatment Cost *</Label>
          <Input
            id="estimated_cost"
            type="number"
            value={(formData.estimated_cost as string) || ''}
            onChange={(e) => updateField('estimated_cost', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Admission Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !admissionDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {admissionDate ? format(admissionDate, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={admissionDate}
                onSelect={setAdmissionDate}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </>
  );
}
