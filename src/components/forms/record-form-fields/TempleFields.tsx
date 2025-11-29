import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TempleFieldsProps {
  formData: Record<string, unknown>;
  updateField: (field: string, value: string) => void;
  preferredDate: Date | undefined;
  setPreferredDate: (date: Date | undefined) => void;
}

export function TempleFields({ formData, updateField, preferredDate, setPreferredDate }: TempleFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="temple_name">Temple Name *</Label>
          <Select 
            value={(formData.temple_name as string) || ''} 
            onValueChange={(value) => updateField('temple_name', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Temple" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tirumala">Tirumala</SelectItem>
              <SelectItem value="tirupati">Tirupati</SelectItem>
              <SelectItem value="kanipakam">Kanipakam</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="darshan_type">Darshan Type *</Label>
          <Select 
            value={(formData.darshan_type as string) || ''} 
            onValueChange={(value) => updateField('darshan_type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="VIP">VIP Darshan</SelectItem>
              <SelectItem value="GENERAL">General Darshan</SelectItem>
              <SelectItem value="SPECIAL">Special Darshan</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

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
              {preferredDate ? format(preferredDate, "PPP") : "Select preferred date"}
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
    </>
  );
}
