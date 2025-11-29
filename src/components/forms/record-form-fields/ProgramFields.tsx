import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ProgramFieldsProps {
  formData: Record<string, unknown>;
  updateField: (field: string, value: string) => void;
  programDate: Date | undefined;
  setProgramDate: (date: Date | undefined) => void;
}

export function ProgramFields({ formData, updateField, programDate, setProgramDate }: ProgramFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="program_name">Program Name *</Label>
        <Input
          id="program_name"
          value={(formData.program_name as string) || ''}
          onChange={(e) => updateField('program_name', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="program_type">Program Type *</Label>
        <Select 
          value={(formData.program_type as string) || ''} 
          onValueChange={(value) => updateField('program_type', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="job_mela">Job Mela</SelectItem>
            <SelectItem value="training">Training Program</SelectItem>
            <SelectItem value="workshop">Workshop</SelectItem>
            <SelectItem value="seminar">Seminar</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="venue">Venue *</Label>
        <Input
          id="venue"
          value={(formData.venue as string) || ''}
          onChange={(e) => updateField('venue', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Program Date *</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !programDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {programDate ? format(programDate, "PPP") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={programDate}
              onSelect={setProgramDate}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
