import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Filter, X } from "lucide-react";

interface FilterModalProps {
  open: boolean;
  onClose: () => void;
  filters: {
    type: string;
    status: string;
    priority: string;
    location: string;
  };
  onApplyFilters: (filters: any) => void;
}

export function FilterModal({ open, onClose, filters, onApplyFilters }: FilterModalProps) {
  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters = {
      type: "",
      status: "",
      priority: "",
      location: ""
    };
    onApplyFilters(clearedFilters);
  };

  const caseTypes = [
    "Grievance",
    "Dispute", 
    "Temple Letter",
    "CM Relief",
    "Education",
    "CSR Industrial",
    "Appointment",
    "Emergency"
  ];

  const statusOptions = [
    "NEW",
    "ASSIGNED", 
    "IN_PROGRESS",
    "PENDING_INFO",
    "IN_REVIEW",
    "MEDIATION_SCHEDULED",
    "COMPLETED",
    "CLOSED"
  ];

  const priorityOptions = [
    "P1",
    "P2", 
    "P3"
  ];

  const locationOptions = [
    "Nellore",
    "Guntur",
    "Vijayawada",
    "Visakhapatnam",
    "Tirupati"
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Cases
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Case Type</Label>
            <Select 
              value={filters.type} 
              onValueChange={(value) => onApplyFilters({...filters, type: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select case type" />
              </SelectTrigger>
              <SelectContent>
                {caseTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select 
              value={filters.status} 
              onValueChange={(value) => onApplyFilters({...filters, status: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>
            <Select 
              value={filters.priority} 
              onValueChange={(value) => onApplyFilters({...filters, priority: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {priority}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <Input
              placeholder="Enter location"
              value={filters.location}
              onChange={(e) => onApplyFilters({...filters, location: e.target.value})}
            />
          </div>

          <Separator />

          <div className="flex justify-between gap-2">
            <Button variant="outline" onClick={handleClear} className="flex-1">
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
            <Button onClick={handleApply} className="flex-1">
              Apply Filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}