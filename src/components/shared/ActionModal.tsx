import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Send,
  UserCheck,
  MessageSquare
} from "lucide-react";
import { StatusBadge } from "../StatusBadge";
import { useToast } from "@/hooks/use-toast";

interface ActionModalProps {
  open: boolean;
  onClose: () => void;
  case: any;
}

export function ActionModal({ open, onClose, case: caseData }: ActionModalProps) {
  const [action, setAction] = useState("");
  const [notes, setNotes] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [escalateTo, setEscalateTo] = useState("");
  const { toast } = useToast();

  if (!caseData) return null;

  const handleSubmitAction = () => {
    if (!action) return;

    // Simulate action submission
    toast({
      title: "Action Submitted",
      description: `${action} has been processed for case ${caseData.id}`,
    });

    // Reset form
    setAction("");
    setNotes("");
    setNewStatus("");
    setEscalateTo("");
    onClose();
  };

  const actionOptions = [
    { value: "approve", label: "Approve Case", icon: CheckCircle, color: "success" },
    { value: "request_info", label: "Request More Information", icon: MessageSquare, color: "warning" },
    { value: "escalate", label: "Escalate to Senior Officer", icon: AlertTriangle, color: "destructive" },
    { value: "reassign", label: "Reassign Case", icon: UserCheck, color: "info" },
    { value: "schedule_visit", label: "Schedule Site Visit", icon: Clock, color: "secondary" },
    { value: "close", label: "Close Case", icon: CheckCircle, color: "success" }
  ];

  const statusOptions = [
    "IN_PROGRESS",
    "PENDING_INFO",
    "SCHEDULED",
    "COMPLETED",
    "CLOSED",
    "ESCALATED"
  ];

  const officerOptions = [
    "Senior Officer Reddy",
    "Supervisor Kumar",
    "District Collector",
    "Department Head"
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Take Action - {caseData?.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Case Summary */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{caseData?.type}</Badge>
                <Badge variant={caseData?.priority === 'P1' ? 'destructive' : 'warning'}>
                  {caseData?.priority}
                </Badge>
              </div>
              <StatusBadge status={caseData?.status} />
            </div>
            <p className="font-medium">{caseData?.citizen}</p>
            <p className="text-sm text-muted-foreground">{caseData?.category}</p>
          </div>

          <Separator />

          {/* Action Selection */}
          <div className="space-y-4">
            <h3 className="font-semibold">Select Action</h3>
            <div className="grid grid-cols-2 gap-3">
              {actionOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <Button
                    key={option.value}
                    variant={action === option.value ? "government" : "outline"}
                    className="h-auto p-4 justify-start"
                    onClick={() => setAction(option.value)}
                  >
                    <IconComponent className="h-4 w-4 mr-2" />
                    <span className="text-sm">{option.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Conditional Fields */}
          {action && (
            <>
              <Separator />
              
              <div className="space-y-4">
                {(action === "approve" || action === "request_info") && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Update Status</label>
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select new status" />
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
                )}

                {(action === "escalate" || action === "reassign") && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {action === "escalate" ? "Escalate To" : "Reassign To"}
                    </label>
                    <Select value={escalateTo} onValueChange={setEscalateTo}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select officer" />
                      </SelectTrigger>
                      <SelectContent>
                        {officerOptions.map((officer) => (
                          <SelectItem key={officer} value={officer}>
                            {officer}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium">Notes/Comments</label>
                  <Textarea
                    placeholder="Add your notes or comments..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="government" 
            onClick={handleSubmitAction}
            disabled={!action}
          >
            Submit Action
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}