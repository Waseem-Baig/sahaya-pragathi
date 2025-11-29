import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/StatusBadge";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  User as UserIcon,
  Phone,
  Mail,
  FileText,
  Edit,
  Church,
  Users,
  Loader2,
  Download,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { templesAPI, usersAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow, format } from "date-fns";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { User } from "@/types/auth";

const DARSHAN_TYPE_LABELS: Record<string, string> = {
  VIP: "VIP Darshan",
  GENERAL: "General Darshan",
  SPECIAL: "Special Darshan",
  DIVYA_DARSHAN: "Divya Darshan",
  SARVA_DARSHAN: "Sarva Darshan",
};

const STATUS_OPTIONS = [
  { value: "REQUESTED", label: "Requested" },
  { value: "UNDER_REVIEW", label: "Under Review" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "LETTER_ISSUED", label: "Letter Issued" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default function TempleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [temple, setTemple] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [letterDialogOpen, setLetterDialogOpen] = useState(false);
  const [officers, setOfficers] = useState<User[]>([]);
  const [selectedOfficer, setSelectedOfficer] = useState("");
  const [letterNumber, setLetterNumber] = useState("");
  const [letterValidUntil, setLetterValidUntil] = useState("");

  useEffect(() => {
    const fetchTemple = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const response = await templesAPI.getById(id);
        setTemple(response.data);
      } catch (error) {
        console.error("Error fetching temple letter:", error);
        toast({
          title: "Error",
          description: "Failed to load temple letter details",
          variant: "destructive",
        });
        navigate("/admin/temple-letters");
      } finally {
        setLoading(false);
      }
    };

    fetchTemple();
  }, [id, navigate, toast]);

  const handleStatusChange = async (newStatus: string) => {
    if (!id || !temple) return;

    try {
      await templesAPI.update(id, { status: newStatus });

      toast({
        title: "Success",
        description: "Temple letter status updated successfully",
      });

      // Refresh temple data
      const response = await templesAPI.getById(id);
      setTemple(response.data);
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update temple letter status",
        variant: "destructive",
      });
    }
  };

  const handleAssignOfficer = async () => {
    setAssignDialogOpen(true);

    // Fetch officers
    try {
      const response = await usersAPI.getAllUsers({ role: "L2_EXEC_ADMIN" });
      setOfficers(response.data);
    } catch (error) {
      console.error("Error fetching officers:", error);
      toast({
        title: "Error",
        description: "Failed to load officers",
        variant: "destructive",
      });
    }
  };

  const handleConfirmAssign = async () => {
    if (!id || !selectedOfficer) return;

    try {
      await templesAPI.update(id, { assignedTo: selectedOfficer });

      toast({
        title: "Success",
        description: "Officer assigned successfully",
      });

      setAssignDialogOpen(false);

      // Refresh temple data
      const response = await templesAPI.getById(id);
      setTemple(response.data);
    } catch (error) {
      console.error("Error assigning officer:", error);
      toast({
        title: "Error",
        description: "Failed to assign officer",
        variant: "destructive",
      });
    }
  };

  const handleIssueLetter = async () => {
    if (!id || !letterNumber) {
      toast({
        title: "Error",
        description: "Please enter letter number",
        variant: "destructive",
      });
      return;
    }

    try {
      await templesAPI.update(id, {
        status: "LETTER_ISSUED",
        letterNumber,
        letterIssuedDate: new Date().toISOString(),
        letterValidUntil: letterValidUntil || undefined,
      });

      toast({
        title: "Success",
        description: "Letter issued successfully",
      });

      setLetterDialogOpen(false);

      // Refresh temple data
      const response = await templesAPI.getById(id);
      setTemple(response.data);
    } catch (error) {
      console.error("Error issuing letter:", error);
      toast({
        title: "Error",
        description: "Failed to issue letter",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!temple) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Temple letter not found</h1>
          <Button
            onClick={() => navigate("/admin/temple-letters")}
            className="mt-4"
          >
            Back to Temple Letters
          </Button>
        </div>
      </div>
    );
  }

  const assignedTo = temple.assignedTo as {
    firstName?: string;
    lastName?: string;
    fullName?: string;
    email?: string;
    department?: string;
  } | null;

  // Compute display name for assigned officer
  const assignedToName = assignedTo
    ? assignedTo.fullName ||
      `${assignedTo.firstName || ""} ${assignedTo.lastName || ""}`.trim() ||
      assignedTo.email
    : null;

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/temple-letters")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{temple.templeId as string}</h1>
            <p className="text-muted-foreground">
              Created{" "}
              {formatDistanceToNow(new Date(temple.createdAt as string), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={temple.status as string}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/temple-letters/${id}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Applicant Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Applicant Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Name</Label>
                  <p className="font-medium">
                    {temple.applicantName as string}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Mobile</Label>
                  <p className="font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {temple.mobile as string}
                  </p>
                </div>
                {temple.email && (
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {temple.email as string}
                    </p>
                  </div>
                )}
                {temple.aadhaarNumber && (
                  <div>
                    <Label className="text-muted-foreground">
                      Aadhaar Number
                    </Label>
                    <p className="font-medium">
                      {temple.aadhaarNumber as string}
                    </p>
                  </div>
                )}
              </div>
              {temple.address && (
                <div>
                  <Label className="text-muted-foreground">Address</Label>
                  <p className="font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {temple.address as string}
                  </p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {temple.district && (
                  <div>
                    <Label className="text-muted-foreground">District</Label>
                    <p className="font-medium">{temple.district as string}</p>
                  </div>
                )}
                {temple.mandal && (
                  <div>
                    <Label className="text-muted-foreground">Mandal</Label>
                    <p className="font-medium">{temple.mandal as string}</p>
                  </div>
                )}
                {temple.pincode && (
                  <div>
                    <Label className="text-muted-foreground">Pincode</Label>
                    <p className="font-medium">{temple.pincode as string}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Temple & Darshan Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Church className="h-5 w-5" />
                Temple & Darshan Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Temple Name</Label>
                  <p className="font-medium">{temple.templeName as string}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Darshan Type</Label>
                  <Badge
                    variant={
                      temple.darshanType === "VIP" ? "default" : "secondary"
                    }
                  >
                    {DARSHAN_TYPE_LABELS[temple.darshanType as string] ||
                      (temple.darshanType as string)}
                  </Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">
                    Preferred Date
                  </Label>
                  <p className="font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(temple.preferredDate as string), "PPP")}
                  </p>
                </div>
                {temple.numberOfPeople && (
                  <div>
                    <Label className="text-muted-foreground">
                      Number of People
                    </Label>
                    <p className="font-medium flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {temple.numberOfPeople as number}
                    </p>
                  </div>
                )}
              </div>
              {temple.purpose && (
                <div>
                  <Label className="text-muted-foreground">Purpose</Label>
                  <p className="font-medium">{temple.purpose as string}</p>
                </div>
              )}
              {temple.remarks && (
                <div>
                  <Label className="text-muted-foreground">Remarks</Label>
                  <p className="font-medium">{temple.remarks as string}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Letter Information */}
          {temple.status === "LETTER_ISSUED" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Letter Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">
                      Letter Number
                    </Label>
                    <p className="font-medium">
                      {temple.letterNumber as string}
                    </p>
                  </div>
                  {temple.letterIssuedDate && (
                    <div>
                      <Label className="text-muted-foreground">
                        Issued Date
                      </Label>
                      <p className="font-medium">
                        {format(
                          new Date(temple.letterIssuedDate as string),
                          "PPP"
                        )}
                      </p>
                    </div>
                  )}
                  {temple.letterValidUntil && (
                    <div>
                      <Label className="text-muted-foreground">
                        Valid Until
                      </Label>
                      <p className="font-medium">
                        {format(
                          new Date(temple.letterValidUntil as string),
                          "PPP"
                        )}
                      </p>
                    </div>
                  )}
                  {temple.quotaAllocated && (
                    <div>
                      <Label className="text-muted-foreground">
                        Quota Allocated
                      </Label>
                      <p className="font-medium">
                        {temple.quotaAllocated as number}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Attachments */}
          {temple.attachments &&
            Array.isArray(temple.attachments) &&
            (temple.attachments as Array<{ filename: string; url: string }>)
              .length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Attachments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {(
                      temple.attachments as Array<{
                        filename: string;
                        url: string;
                      }>
                    ).map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <span className="text-sm">{file.filename}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(file.url, "_blank")}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Priority */}
          <Card>
            <CardHeader>
              <CardTitle>Status & Priority</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <div className="mt-1">
                  <StatusBadge status={temple.status as string} />
                </div>
              </div>
              {temple.priority && (
                <div>
                  <Label className="text-muted-foreground">Priority</Label>
                  <div className="mt-1">
                    <Badge
                      variant={
                        temple.priority === "URGENT"
                          ? "destructive"
                          : temple.priority === "HIGH"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {temple.priority as string}
                    </Badge>
                  </div>
                </div>
              )}
              <Separator />
              <div>
                <Label className="text-muted-foreground">Quota Available</Label>
                <div className="mt-1 flex items-center gap-2">
                  {temple.quotaAvailable ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="font-medium">
                    {temple.quotaAvailable ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assignment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Assignment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {assignedTo ? (
                <div>
                  <Label className="text-muted-foreground">Assigned To</Label>
                  <p className="font-medium mt-1">{assignedToName}</p>
                  {assignedTo.department && (
                    <p className="text-sm text-muted-foreground">
                      {assignedTo.department}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Not assigned yet
                </p>
              )}
              <Button
                variant="outline"
                className="w-full"
                onClick={handleAssignOfficer}
              >
                {assignedTo ? "Reassign" : "Assign"} Officer
              </Button>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {temple.status === "APPROVED" && (
                <Button
                  variant="default"
                  className="w-full"
                  onClick={() => setLetterDialogOpen(true)}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Issue Letter
                </Button>
              )}
              {temple.rejectReason && (
                <div className="p-3 bg-destructive/10 border border-destructive rounded-lg">
                  <Label className="text-destructive">Rejection Reason</Label>
                  <p className="text-sm mt-1">
                    {temple.rejectReason as string}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Assign Officer Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Officer</DialogTitle>
            <DialogDescription>
              Select an officer to handle this temple letter request
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="officer">Officer</Label>
              <Select
                value={selectedOfficer}
                onValueChange={setSelectedOfficer}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select officer" />
                </SelectTrigger>
                <SelectContent>
                  {officers.map((officer) => (
                    <SelectItem key={officer._id} value={officer._id}>
                      {officer.firstName && officer.lastName
                        ? `${officer.firstName} ${officer.lastName}`
                        : officer.fullName || officer.email}{" "}
                      ({officer.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAssignDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmAssign} disabled={!selectedOfficer}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Issue Letter Dialog */}
      <Dialog open={letterDialogOpen} onOpenChange={setLetterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Issue Letter</DialogTitle>
            <DialogDescription>
              Enter letter details to issue the darshan letter
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="letterNumber">Letter Number *</Label>
              <Input
                id="letterNumber"
                value={letterNumber}
                onChange={(e) => setLetterNumber(e.target.value)}
                placeholder="e.g., TDL/2025/001"
              />
            </div>
            <div>
              <Label htmlFor="letterValidUntil">Valid Until (Optional)</Label>
              <Input
                id="letterValidUntil"
                type="date"
                value={letterValidUntil}
                onChange={(e) => setLetterValidUntil(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setLetterDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleIssueLetter} disabled={!letterNumber}>
              Issue Letter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
