import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface AppointmentFieldsProps {
  formData: Record<string, unknown>;
  updateField: (field: string, value: string) => void;
  preferredDate: Date | undefined;
  setPreferredDate: (date: Date | undefined) => void;
}

export function AppointmentFields({ formData, updateField, preferredDate, setPreferredDate }: AppointmentFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="purpose">Purpose of Meeting *</Label>
        <Textarea
          id="purpose"
          value={(formData.purpose as string) || ''}
          onChange={(e) => updateField('purpose', e.target.value)}
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Preferred Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !preferredDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {preferredDate ? format(preferredDate, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={preferredDate}
                onSelect={setPreferredDate}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label htmlFor="preferred_time">Preferred Time</Label>
          <Input
            id="preferred_time"
            type="time"
            value={(formData.preferred_time as string) || ''}
            onChange={(e) => updateField('preferred_time', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="meeting_place">Meeting Place</Label>
        <Input
          id="meeting_place"
          value={(formData.meeting_place as string) || ''}
          onChange={(e) => updateField('meeting_place', e.target.value)}
        />
      </div>
    </>
  );
}
