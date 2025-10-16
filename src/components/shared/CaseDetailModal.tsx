import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Calendar, 
  MapPin, 
  Phone, 
  User, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  FileText
} from "lucide-react";
import { StatusBadge } from "../StatusBadge";

interface CaseDetailModalProps {
  open: boolean;
  onClose: () => void;
  case: any;
}

export function CaseDetailModal({ open, onClose, case: caseData }: CaseDetailModalProps) {
  if (!caseData) return null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'P1': return 'destructive';
      case 'P2': return 'warning';
      case 'P3': return 'info';
      default: return 'secondary';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Case Details - {caseData.id}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Header Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{caseData.type}</Badge>
                <Badge variant={getPriorityColor(caseData.priority)}>
                  {caseData.priority}
                </Badge>
              </div>
              <StatusBadge status={caseData.status} />
            </div>

            <Separator />

            {/* Citizen Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Citizen Information
                </h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Name:</strong> {caseData.citizen}</p>
                  <p><strong>Category:</strong> {caseData.category}</p>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{caseData.location}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Timeline
                </h3>
                <div className="space-y-2 text-sm">
                  <p><strong>SLA Remaining:</strong> {caseData.slaHours}h</p>
                  <p><strong>Created:</strong> Today, 9:30 AM</p>
                  <p><strong>Last Updated:</strong> 2 hours ago</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Assignment Information */}
            <div className="space-y-3">
              <h3 className="font-semibold">Assignment Details</h3>
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{caseData.assignee}</p>
                    <p className="text-sm text-muted-foreground">Assigned Officer</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4 mr-1" />
                    Contact
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            {/* Case Description */}
            <div className="space-y-3">
              <h3 className="font-semibold">Case Description</h3>
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
                  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
            </div>

            {/* Progress Notes */}
            <div className="space-y-3">
              <h3 className="font-semibold">Progress Notes</h3>
              <div className="space-y-2">
                <div className="border-l-2 border-primary pl-4 py-2">
                  <p className="text-sm font-medium">Initial Assessment Completed</p>
                  <p className="text-xs text-muted-foreground">2 hours ago by {caseData.assignee}</p>
                </div>
                <div className="border-l-2 border-muted pl-4 py-2">
                  <p className="text-sm font-medium">Case Assigned</p>
                  <p className="text-xs text-muted-foreground">Today, 9:30 AM by System</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="government">
            Take Action
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}