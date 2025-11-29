import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RecordDetail } from "@/components/shared/RecordDetail";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  Phone,
  Mail,
  Calendar,
  User as UserIcon,
  Building,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  UserCheck,
} from "lucide-react";
import { casesAPI, usersAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import type { User } from "@/types/auth";

const mockGrievance = {
  id: "GRV-AP-NLR-2025-000001",
  citizen_name: "Ravi Kumar",
  mobile: "9876543210",
  email: "ravi.kumar@email.com",
  address: "H.No 12-34, Gandhi Road, Nellore",
  district: "Nellore",
  mandal: "Nellore Rural",
  ward: "Ward 15",
  pincode: "524001",
  category: "Water Supply",
  subcategory: "New Connection",
  description:
    "I have been waiting for a new water connection for the past 3 months. Despite multiple visits to the water board office and submitting all required documents, no action has been taken. The officials keep asking me to come back later without providing any timeline. This is causing severe inconvenience to my family.",
  incident_date: "2025-01-10",
  incident_place: "Water Board Office, Nellore",
  priority: "P2",
  status: "IN_PROGRESS",
  assigned_to: "Priya Sharma",
  assigned_dept: "Water Supply Department",
  officer_contact: "9876543211",
  progress_notes:
    "Field verification completed. Connection approval pending from higher authorities.",
  escalation_priority: null,
  sla_due_at: "2025-01-20T10:00:00Z",
  completion_percentage: 60,
  created_at: "2025-01-15T10:00:00Z",
  updated_at: "2025-01-17T14:30:00Z",
  closed_at: null,
  citizen_id: "citizen-123",
};

export default function GrievanceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [grievance, setGrievance] = useState<Record<string, unknown> | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedOfficer, setSelectedOfficer] = useState<string>("");
  const [officers, setOfficers] = useState<
    Array<{
      id: string;
      name: string;
      department: string;
    }>
  >([]);
  const [loadingOfficers, setLoadingOfficers] = useState(false);

  // Helper function to transform backend case data to frontend format
  const transformCaseData = (case_: Record<string, unknown>) => {
    return {
      id: case_.caseId,
      // Citizen Information
      citizen_name: case_.citizenName,
      mobile:
        (case_.citizenContact as Record<string, unknown>)?.phone ||
        case_.mobile ||
        "-",
      email: (case_.citizenContact as Record<string, unknown>)?.email || "-",
      address:
        (case_.citizenContact as Record<string, unknown>)?.address || "-",
      district: case_.district || "-",
      mandal: case_.mandal || "-",
      ward: case_.ward || "-",
      pincode: case_.pincode || "-",
      aadhaar_number: case_.aadhaarNumber || "-",

      // Grievance Details
      category: case_.category || "-",
      subcategory: case_.subcategory || case_.reason || "-",
      subject: case_.subject || "-",
      description: case_.description || "",
      reason: case_.reason || "-",
      incident_date: case_.time || case_.createdAt,
      incident_place: case_.place || "-",

      // Assignment & Priority
      priority: case_.priority || "P3",
      status: case_.status || "pending",
      assigned_to: (case_.assignedTo as Record<string, unknown>)?.firstName
        ? `${(case_.assignedTo as Record<string, unknown>).firstName} ${
            (case_.assignedTo as Record<string, unknown>).lastName
          }`
        : "Unassigned",
      assigned_dept: case_.department || "-",
      officer_contact:
        (case_.assignedTo as Record<string, unknown>)?.phoneNumber ||
        (case_.assignedTo as Record<string, unknown>)?.email ||
        "-",
      progress_notes: case_.assignmentNotes || "-",

      // SLA & Timeline
      escalation_priority: null,
      sla_due_at: (case_.sla as Record<string, unknown>)?.dueDate || null,
      sla_duration: (case_.sla as Record<string, unknown>)?.duration || "-",
      sla_status:
        (case_.sla as Record<string, unknown>)?.status || "within-sla",

      // Progress & Status
      completion_percentage:
        case_.status === "completed"
          ? 100
          : case_.status === "in-progress"
          ? 50
          : case_.status === "under-review"
          ? 75
          : 0,

      // Timestamps
      created_at: case_.createdAt,
      updated_at: case_.updatedAt,
      closed_at: case_.closedAt || null,

      // Additional
      citizen_id: case_.createdBy,
      case_type: case_.caseType,
      attachments: case_.attachments || [],

      // Created By User Info
      created_by_name: (case_.createdBy as Record<string, unknown>)?.firstName
        ? `${(case_.createdBy as Record<string, unknown>).firstName} ${
            (case_.createdBy as Record<string, unknown>).lastName
          }`
        : "-",
      created_by_email:
        (case_.createdBy as Record<string, unknown>)?.email || "-",
    };
  };

  // Fetch executive admins when assignment dialog opens
  useEffect(() => {
    const fetchOfficers = async () => {
      if (!assignDialogOpen) return;

      try {
        setLoadingOfficers(true);
        const response = await usersAPI.getAllUsers({ role: "L2_EXEC_ADMIN" });

        if (response.success && response.data) {
          const officersList = response.data.map((user: User) => ({
            id: user._id,
            name: `${user.firstName} ${user.lastName}`,
            department: user.department || "General",
          }));
          setOfficers(officersList);
        }
      } catch (error) {
        console.error("Error fetching officers:", error);
        toast({
          title: "Warning",
          description: "Could not load officers list",
          variant: "destructive",
        });
      } finally {
        setLoadingOfficers(false);
      }
    };

    fetchOfficers();
  }, [assignDialogOpen, toast]);

  // Fetch grievance details from backend
  useEffect(() => {
    const fetchGrievance = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await casesAPI.getById(id);

        if (response.success && response.data) {
          const case_ = response.data;
          setGrievance(transformCaseData(case_));
        }
      } catch (error) {
        console.error("Error fetching grievance:", error);
        toast({
          title: "Error",
          description: "Failed to load grievance details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGrievance();
  }, [id, toast]);

  const handleEdit = () => {
    navigate(`/admin/grievances/${id}/edit`);
  };

  const handleAssign = async () => {
    setAssignDialogOpen(true);
  };

  const handleConfirmAssign = async () => {
    if (!id || !selectedOfficer) return;

    try {
      const response = await casesAPI.update(id, {
        assignedTo: selectedOfficer,
      });

      if (response.success) {
        toast({
          title: "Success",
          description: "Case assigned successfully",
        });

        setAssignDialogOpen(false);
        setSelectedOfficer("");

        // Refresh grievance data
        const updatedResponse = await casesAPI.getById(id);
        if (updatedResponse.success && updatedResponse.data) {
          setGrievance(transformCaseData(updatedResponse.data));
        }
      }
    } catch (error) {
      console.error("Error assigning case:", error);
      toast({
        title: "Error",
        description: "Failed to assign case",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (status: string) => {
    if (!id) return;

    try {
      const response = await casesAPI.update(id, {
        status: status.toLowerCase(),
      });

      if (response.success) {
        toast({
          title: "Success",
          description: `Status updated to ${status}`,
        });

        // Refresh grievance data
        const updatedResponse = await casesAPI.getById(id);
        if (updatedResponse.success && updatedResponse.data) {
          setGrievance(transformCaseData(updatedResponse.data));
        }
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const handleAction = async (action: string) => {
    switch (action) {
      case "route-dept":
        toast({
          title: "Route to Department",
          description: "Department routing will be implemented",
        });
        break;
      case "generate-letter":
        toast({
          title: "Generate Letter",
          description: "Letter generation will be implemented",
        });
        break;
      case "request-info":
        toast({
          title: "Request Information",
          description: "Information request will be implemented",
        });
        break;
      case "close":
        await handleStatusChange("CLOSED");
        break;
      default:
        console.log("Unknown action:", action);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show error if no grievance found
  if (!grievance) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="text-2xl font-semibold">Grievance Not Found</h2>
        <Button onClick={() => navigate("/admin/grievances")}>
          ← Back to Grievances
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => navigate("/admin/grievances")}>
          ← Back to Grievances
        </Button>
        <div className="flex gap-2 items-center">
          {/* Status Change Dropdown */}
          <Select
            value={String(grievance.status)}
            onValueChange={(value) => handleStatusChange(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Change Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="under-review">Under Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={() => handleAction("route-dept")}>
            Route to Department
          </Button>
          <Button
            variant="outline"
            onClick={() => handleAction("generate-letter")}
          >
            Generate Letter
          </Button>
          <Button
            variant="outline"
            onClick={() => handleAction("request-info")}
          >
            Request Info
          </Button>
          <Button onClick={() => handleAction("close")}>Close Case</Button>
        </div>
      </div>

      <RecordDetail
        record={grievance}
        onEdit={handleEdit}
        onAssign={handleAssign}
        onStatusChange={handleStatusChange}
      >
        {/* Custom Summary Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-full">
          {/* Citizen Information */}
          <Card className="min-w-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Citizen Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="font-medium">
                  {String(grievance.citizen_name)}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {String(grievance.mobile)}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {String(grievance.email)}
                </div>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mt-0.5" />
                  <div>
                    {String(grievance.address)}
                    <br />
                    {String(grievance.district)}, {String(grievance.mandal)}
                    <br />
                    Ward: {String(grievance.ward)}, PIN:{" "}
                    {String(grievance.pincode)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Grievance Details */}
          <Card className="min-w-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Grievance Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 overflow-hidden">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Category
                  </div>
                  <Badge variant="outline">{String(grievance.category)}</Badge>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Subcategory
                  </div>
                  <Badge variant="secondary">
                    {String(grievance.subcategory)}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Incident Date:{" "}
                  {new Date(
                    String(grievance.incident_date)
                  ).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <span className="text-sm">
                  {String(grievance.incident_place)}
                </span>
              </div>

              <Separator />

              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  Description
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words overflow-hidden">
                  {String(grievance.description)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Assignment & Progress */}
          <Card className="min-w-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Assignment & Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 overflow-hidden">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Assigned To
                  </div>
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4" />
                    {String(grievance.assigned_to)}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Department
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    {String(grievance.assigned_dept)}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Officer Contact
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {String(grievance.officer_contact)}
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  Progress Notes
                </div>
                <p className="text-sm whitespace-pre-wrap break-words overflow-hidden">
                  {String(grievance.progress_notes)}
                </p>
              </div>

              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  Completion
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Number(grievance.completion_percentage)}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {Number(grievance.completion_percentage)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status & SLA */}
          <Card className="min-w-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Status & SLA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 overflow-hidden">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Status
                  </div>
                  <Badge variant="default">
                    {String(grievance.status).replace("_", " ")}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Priority
                  </div>
                  <Badge
                    variant={
                      String(grievance.priority) === "P1"
                        ? "destructive"
                        : "warning"
                    }
                  >
                    {String(grievance.priority)}
                  </Badge>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  SLA Due
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">
                    {grievance.sla_due_at
                      ? new Date(String(grievance.sla_due_at)).toLocaleString()
                      : "N/A"}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  Timeline
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    Created:{" "}
                    {new Date(String(grievance.created_at)).toLocaleString()}
                  </div>
                  <div>
                    Last Updated:{" "}
                    {new Date(String(grievance.updated_at)).toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </RecordDetail>

      {/* Assignment Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Case</DialogTitle>
            <DialogDescription>
              Select an officer to assign this case to
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="officer">Officer</Label>
              <Select
                value={selectedOfficer}
                onValueChange={setSelectedOfficer}
              >
                <SelectTrigger id="officer">
                  <SelectValue placeholder="Select an officer" />
                </SelectTrigger>
                <SelectContent>
                  {officers.map((officer) => (
                    <SelectItem key={officer.id} value={officer.id}>
                      {officer.name} - {officer.department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setAssignDialogOpen(false);
                setSelectedOfficer("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmAssign} disabled={!selectedOfficer}>
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
