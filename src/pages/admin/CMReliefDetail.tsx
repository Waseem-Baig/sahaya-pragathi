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
  Heart,
  DollarSign,
  Building2,
  Users,
  Loader2,
  Download,
  CheckCircle,
  XCircle,
  CreditCard,
} from "lucide-react";
import { cmReliefAPI, usersAPI } from "@/lib/api";
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

const RELIEF_TYPE_LABELS: Record<string, string> = {
  MEDICAL: "Medical Treatment",
  EDUCATION: "Education Support",
  ACCIDENT: "Accident Relief",
  NATURAL_DISASTER: "Natural Disaster",
  FINANCIAL_ASSISTANCE: "Financial Assistance",
  FUNERAL: "Funeral Assistance",
  OTHER: "Other",
};

const STATUS_OPTIONS = [
  { value: "REQUESTED", label: "Requested" },
  { value: "UNDER_REVIEW", label: "Under Review" },
  { value: "VERIFICATION_PENDING", label: "Verification Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "AMOUNT_DISBURSED", label: "Amount Disbursed" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

const PRIORITY_OPTIONS = [
  { value: "LOW", label: "Low", color: "bg-blue-500" },
  { value: "MEDIUM", label: "Medium", color: "bg-yellow-500" },
  { value: "HIGH", label: "High", color: "bg-orange-500" },
  { value: "CRITICAL", label: "Critical", color: "bg-red-500" },
];

export default function CMReliefDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cmRelief, setCmRelief] = useState<Record<string, unknown> | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [officers, setOfficers] = useState<User[]>([]);
  const [selectedOfficer, setSelectedOfficer] = useState("");

  useEffect(() => {
    const fetchCMRelief = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const response = await cmReliefAPI.getById(id);
        setCmRelief(response.data);
      } catch (error) {
        console.error("Error fetching CM Relief request:", error);
        toast({
          title: "Error",
          description: "Failed to load CM Relief request details",
          variant: "destructive",
        });
        navigate("/admin/cm-relief");
      } finally {
        setLoading(false);
      }
    };

    fetchCMRelief();
  }, [id, navigate, toast]);

  const handleStatusChange = async (newStatus: string) => {
    if (!id || !cmRelief) return;

    try {
      await cmReliefAPI.update(id, { status: newStatus });

      toast({
        title: "Success",
        description: "CM Relief request status updated successfully",
      });

      // Refresh data
      const response = await cmReliefAPI.getById(id);
      setCmRelief(response.data);
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update CM Relief request status",
        variant: "destructive",
      });
    }
  };

  const handlePriorityChange = async (newPriority: string) => {
    if (!id || !cmRelief) return;

    try {
      await cmReliefAPI.update(id, { priority: newPriority });

      toast({
        title: "Success",
        description: "Priority updated successfully",
      });

      // Refresh data
      const response = await cmReliefAPI.getById(id);
      setCmRelief(response.data);
    } catch (error) {
      console.error("Error updating priority:", error);
      toast({
        title: "Error",
        description: "Failed to update priority",
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
      await cmReliefAPI.update(id, { assignedTo: selectedOfficer });

      toast({
        title: "Success",
        description: "Officer assigned successfully",
      });

      setAssignDialogOpen(false);

      // Refresh data
      const response = await cmReliefAPI.getById(id);
      setCmRelief(response.data);
    } catch (error) {
      console.error("Error assigning officer:", error);
      toast({
        title: "Error",
        description: "Failed to assign officer",
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

  if (!cmRelief) {
    return (
      <div className="container mx-auto p-6">
        <p>CM Relief request not found</p>
      </div>
    );
  }

  const assignedTo = cmRelief.assignedTo as Record<string, unknown> | undefined;
  const assignedOfficerName = assignedTo
    ? `${assignedTo.firstName || ""} ${assignedTo.lastName || ""}`.trim() ||
      (assignedTo.email as string)
    : "Unassigned";

  const medicalDetails = cmRelief.medicalDetails as
    | Record<string, unknown>
    | undefined;
  const incomeDetails = cmRelief.incomeDetails as
    | Record<string, unknown>
    | undefined;
  const bankDetails = cmRelief.bankDetails as
    | Record<string, unknown>
    | undefined;
  const verifiedBy = cmRelief.verifiedBy as Record<string, unknown> | undefined;
  const approvalDetails = cmRelief.approvalDetails as
    | Record<string, unknown>
    | undefined;
  const approvedBy = approvalDetails?.approvedBy as
    | Record<string, unknown>
    | undefined;
  const disbursementDetails = cmRelief.disbursementDetails as
    | Record<string, unknown>
    | undefined;

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/cm-relief")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">CM Relief Request</h1>
            <p className="text-muted-foreground font-mono text-sm">
              {cmRelief.cmrfId as string}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate(`/admin/cm-relief/${id}/edit`)}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">
                    {cmRelief.applicantName as string}
                  </p>
                </div>
                {cmRelief.fatherOrHusbandName && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Father/Husband
                    </p>
                    <p className="font-medium">
                      {cmRelief.fatherOrHusbandName as string}
                    </p>
                  </div>
                )}
                {cmRelief.age && (
                  <div>
                    <p className="text-sm text-muted-foreground">Age</p>
                    <p className="font-medium">
                      {cmRelief.age as number} years
                    </p>
                  </div>
                )}
                {cmRelief.gender && (
                  <div>
                    <p className="text-sm text-muted-foreground">Gender</p>
                    <p className="font-medium">{cmRelief.gender as string}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Mobile</p>
                  <p className="font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {cmRelief.mobile as string}
                  </p>
                </div>
                {cmRelief.email && (
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {cmRelief.email as string}
                    </p>
                  </div>
                )}
                {cmRelief.aadhaar && (
                  <div>
                    <p className="text-sm text-muted-foreground">Aadhaar</p>
                    <p className="font-medium font-mono">
                      {cmRelief.aadhaar as string}
                    </p>
                  </div>
                )}
              </div>
              {cmRelief.address && (
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {cmRelief.address as string}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {[
                      cmRelief.ward,
                      cmRelief.mandal,
                      cmRelief.district,
                      cmRelief.pincode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Relief Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Relief Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Relief Type</p>
                  <Badge variant="outline" className="mt-1">
                    {RELIEF_TYPE_LABELS[cmRelief.reliefType as string] ||
                      (cmRelief.reliefType as string)}
                  </Badge>
                </div>
                {cmRelief.urgency && (
                  <div>
                    <p className="text-sm text-muted-foreground">Urgency</p>
                    <Badge
                      variant={
                        cmRelief.urgency === "CRITICAL"
                          ? "destructive"
                          : "secondary"
                      }
                      className="mt-1"
                    >
                      {cmRelief.urgency as string}
                    </Badge>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">
                    Requested Amount
                  </p>
                  <p className="font-bold text-lg flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />₹
                    {(cmRelief.requestedAmount as number)?.toLocaleString()}
                  </p>
                </div>
                {cmRelief.approvedAmount && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Approved Amount
                    </p>
                    <p className="font-bold text-lg text-green-600 flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />₹
                      {(cmRelief.approvedAmount as number)?.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
              {cmRelief.purpose && (
                <div>
                  <p className="text-sm text-muted-foreground">Purpose</p>
                  <p className="font-medium">{cmRelief.purpose as string}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Medical Details */}
          {medicalDetails && Object.keys(medicalDetails).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Medical Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {medicalDetails.hospitalName && (
                    <div>
                      <p className="text-sm text-muted-foreground">Hospital</p>
                      <p className="font-medium">
                        {medicalDetails.hospitalName as string}
                      </p>
                    </div>
                  )}
                  {medicalDetails.disease && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Disease/Condition
                      </p>
                      <p className="font-medium">
                        {medicalDetails.disease as string}
                      </p>
                    </div>
                  )}
                  {medicalDetails.treatmentCost && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Treatment Cost
                      </p>
                      <p className="font-medium">
                        ₹
                        {(
                          medicalDetails.treatmentCost as number
                        )?.toLocaleString()}
                      </p>
                    </div>
                  )}
                  {medicalDetails.doctorName && (
                    <div>
                      <p className="text-sm text-muted-foreground">Doctor</p>
                      <p className="font-medium">
                        {medicalDetails.doctorName as string}
                      </p>
                    </div>
                  )}
                  {medicalDetails.admissionDate && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Admission Date
                      </p>
                      <p className="font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {format(
                          new Date(medicalDetails.admissionDate as string),
                          "PPP"
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Income Details */}
          {incomeDetails && Object.keys(incomeDetails).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Income & Family Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {incomeDetails.monthlyIncome && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Monthly Income
                      </p>
                      <p className="font-medium">
                        ₹
                        {(
                          incomeDetails.monthlyIncome as number
                        )?.toLocaleString()}
                      </p>
                    </div>
                  )}
                  {incomeDetails.occupation && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Occupation
                      </p>
                      <p className="font-medium">
                        {incomeDetails.occupation as string}
                      </p>
                    </div>
                  )}
                  {incomeDetails.familyMembers && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Family Members
                      </p>
                      <p className="font-medium">
                        {incomeDetails.familyMembers as number}
                      </p>
                    </div>
                  )}
                  {incomeDetails.dependents && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Dependents
                      </p>
                      <p className="font-medium">
                        {incomeDetails.dependents as number}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bank Details */}
          {bankDetails && Object.keys(bankDetails).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Bank Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {bankDetails.accountHolderName && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Account Holder
                      </p>
                      <p className="font-medium">
                        {bankDetails.accountHolderName as string}
                      </p>
                    </div>
                  )}
                  {bankDetails.accountNumber && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Account Number
                      </p>
                      <p className="font-medium font-mono">
                        {bankDetails.accountNumber as string}
                      </p>
                    </div>
                  )}
                  {bankDetails.ifscCode && (
                    <div>
                      <p className="text-sm text-muted-foreground">IFSC Code</p>
                      <p className="font-medium font-mono">
                        {bankDetails.ifscCode as string}
                      </p>
                    </div>
                  )}
                  {bankDetails.bankName && (
                    <div>
                      <p className="text-sm text-muted-foreground">Bank</p>
                      <p className="font-medium">
                        {bankDetails.bankName as string}
                      </p>
                    </div>
                  )}
                  {bankDetails.branchName && (
                    <div>
                      <p className="text-sm text-muted-foreground">Branch</p>
                      <p className="font-medium">
                        {bankDetails.branchName as string}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Verification Section */}
          {cmRelief.verificationStatus && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Verification Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Verification Status
                    </p>
                    <Badge variant="outline" className="mt-1">
                      {cmRelief.verificationStatus as string}
                    </Badge>
                  </div>
                  {verifiedBy && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Verified By
                      </p>
                      <p className="font-medium">
                        {`${verifiedBy.firstName || ""} ${
                          verifiedBy.lastName || ""
                        }`.trim() || (verifiedBy.email as string)}
                      </p>
                    </div>
                  )}
                  {cmRelief.verificationDate && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Verification Date
                      </p>
                      <p className="font-medium">
                        {format(
                          new Date(cmRelief.verificationDate as string),
                          "PPP"
                        )}
                      </p>
                    </div>
                  )}
                </div>
                {cmRelief.verificationNotes && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Verification Notes
                    </p>
                    <p className="font-medium">
                      {cmRelief.verificationNotes as string}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Approval Section */}
          {approvalDetails && Object.keys(approvalDetails).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Approval Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {approvedBy && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Approved By
                      </p>
                      <p className="font-medium">
                        {`${approvedBy.firstName || ""} ${
                          approvedBy.lastName || ""
                        }`.trim() || (approvedBy.email as string)}
                      </p>
                    </div>
                  )}
                  {approvalDetails.approvalDate && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Approval Date
                      </p>
                      <p className="font-medium">
                        {format(
                          new Date(approvalDetails.approvalDate as string),
                          "PPP"
                        )}
                      </p>
                    </div>
                  )}
                </div>
                {approvalDetails.approvalNotes && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Approval Notes
                    </p>
                    <p className="font-medium">
                      {approvalDetails.approvalNotes as string}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Disbursement Section */}
          {disbursementDetails &&
            Object.keys(disbursementDetails).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Disbursement Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {disbursementDetails.amount && (
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Disbursed Amount
                        </p>
                        <p className="font-bold text-lg text-green-600">
                          ₹
                          {(
                            disbursementDetails.amount as number
                          )?.toLocaleString()}
                        </p>
                      </div>
                    )}
                    {disbursementDetails.transactionId && (
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Transaction ID
                        </p>
                        <p className="font-medium font-mono">
                          {disbursementDetails.transactionId as string}
                        </p>
                      </div>
                    )}
                    {disbursementDetails.disbursementDate && (
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Disbursement Date
                        </p>
                        <p className="font-medium">
                          {format(
                            new Date(
                              disbursementDetails.disbursementDate as string
                            ),
                            "PPP"
                          )}
                        </p>
                      </div>
                    )}
                    {disbursementDetails.disbursementMode && (
                      <div>
                        <p className="text-sm text-muted-foreground">Mode</p>
                        <Badge variant="outline">
                          {disbursementDetails.disbursementMode as string}
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

          {/* Attachments */}
          {cmRelief.attachments &&
            (cmRelief.attachments as unknown[]).length > 0 && (
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
                      cmRelief.attachments as Array<Record<string, unknown>>
                    ).map((attachment, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm">
                            {attachment.filename as string}
                          </span>
                        </div>
                        <Button variant="ghost" size="sm">
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
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Current Status</Label>
                <Select
                  value={cmRelief.status as string}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className="mt-2">
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
              </div>

              <Separator />

              <div>
                <Label>Priority</Label>
                <Select
                  value={(cmRelief.priority as string) || "MEDIUM"}
                  onValueChange={handlePriorityChange}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-2 w-2 rounded-full ${option.color}`}
                          />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="text-sm font-medium">
                  {cmRelief.createdAt
                    ? formatDistanceToNow(
                        new Date(cmRelief.createdAt as string),
                        {
                          addSuffix: true,
                        }
                      )
                    : "N/A"}
                </p>
              </div>

              {cmRelief.rejectReason && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    Rejection Reason
                  </p>
                  <p className="text-sm font-medium text-red-600">
                    {cmRelief.rejectReason as string}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assignment Card */}
          <Card>
            <CardHeader>
              <CardTitle>Assignment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Assigned Officer
                </p>
                <p className="font-medium">{assignedOfficerName}</p>
                {assignedTo?.email && (
                  <p className="text-sm text-muted-foreground">
                    {assignedTo.email as string}
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleAssignOfficer}
              >
                <UserIcon className="h-4 w-4 mr-2" />
                {assignedTo ? "Reassign" : "Assign"} Officer
              </Button>
            </CardContent>
          </Card>

          {/* Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
              <Button variant="outline" className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                Send Notification
              </Button>
              {cmRelief.status === "APPROVED" && (
                <Button
                  variant="default"
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Process Disbursement
                </Button>
              )}
              {cmRelief.status === "REQUESTED" && (
                <Button variant="destructive" className="w-full">
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Request
                </Button>
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
              Select an officer to assign this CM Relief request to.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Officer</Label>
              <Select
                value={selectedOfficer}
                onValueChange={setSelectedOfficer}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select an officer" />
                </SelectTrigger>
                <SelectContent>
                  {officers.map((officer) => (
                    <SelectItem key={officer._id} value={officer._id}>
                      {officer.firstName} {officer.lastName} ({officer.email})
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
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
