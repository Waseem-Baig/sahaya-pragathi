import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Edit,
  User as UserIcon,
  GraduationCap,
  DollarSign,
  Users,
  Award,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { educationAPI, usersAPI } from "@/lib/api";
import { StatusBadge } from "@/components/StatusBadge";
import { format } from "date-fns";
import type { User } from "@/types/auth";

interface EducationDetail {
  _id: string;
  educationId: string;
  eduId?: string; // Keep for backward compatibility

  // Student Information (flat structure from backend)
  studentName: string;
  fatherOrGuardianName?: string;
  dateOfBirth?: string;
  age?: number;
  gender?: string;
  mobile: string;
  email?: string;
  aadhaarNumber?: string;
  address?: string;
  district?: string;
  mandal?: string;
  ward?: string;
  pincode?: string;

  // Education Details (flat structure)
  educationType: string;
  currentClass?: string;
  institutionName: string;
  institutionType?: string;
  courseOrStream?: string;
  academicYear?: string;
  rollNumber?: string;

  // Support Details (flat structure)
  supportType: string;
  requestedAmount: number;
  approvedAmount?: number;
  purpose?: string;
  urgency?: string;

  // Academic Performance (nested object)
  academicPerformance?: {
    lastExamPercentage?: number;
    gpa?: number;
    rank?: number;
    achievements?: string;
    attendance?: number;
  };

  // Financial Details (nested object)
  familyIncome?: {
    monthlyIncome?: number;
    occupation?: string;
    familyMembers?: number;
    siblings?: number;
    siblingsInEducation?: number;
  };

  // Bank Details (nested object)
  bankDetails?: {
    accountNumber?: string;
    ifscCode?: string;
    bankName?: string;
    branchName?: string;
    accountHolderName?: string;
  };

  // Status & Assignment
  status: string;
  assignedTo?:
    | {
        _id: string;
        firstName: string;
        lastName: string;
      }
    | string;
  priority?: string;

  // Verification
  verificationStatus?: string;
  verifiedBy?:
    | {
        _id: string;
        firstName: string;
        lastName: string;
      }
    | string;
  verificationDate?: string;
  verificationNotes?: string;

  // Disbursement
  disbursementDetails?: {
    amount?: number;
    transactionId?: string;
    disbursementDate?: string;
    disbursementMode?: string;
    remarks?: string;
  };

  // Approval/Rejection
  approvalDetails?: {
    approvedBy?:
      | {
          _id: string;
          firstName: string;
          lastName: string;
        }
      | string;
    approvalDate?: string;
    approvalNotes?: string;
  };
  rejectReason?: string;

  // Documents
  attachments?: Array<{
    filename: string;
    url: string;
    uploadedAt: string;
  }>;

  // Tracking
  statusHistory?: Array<{
    status: string;
    changedBy?:
      | {
          _id: string;
          firstName: string;
          lastName: string;
        }
      | string;
    changedAt: string;
    remarks?: string;
  }>;

  comments?: Array<{
    _id: string;
    text: string;
    createdBy: {
      _id: string;
      firstName: string;
      lastName: string;
    };
    createdAt: string;
  }>;

  createdAt: string;
  updatedAt: string;
  createdBy?:
    | {
        _id: string;
        firstName: string;
        lastName: string;
      }
    | string;
}

export default function EducationDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [education, setEducation] = useState<EducationDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const [newComment, setNewComment] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingPriority, setUpdatingPriority] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedOfficer, setSelectedOfficer] = useState<string>("");
  const [updatingAssignment, setUpdatingAssignment] = useState(false);

  useEffect(() => {
    if (id) {
      fetchEducationDetail();
      fetchUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchEducationDetail = async () => {
    try {
      setLoading(true);
      const response = await educationAPI.getById(id!);
      if (response.success && response.data) {
        setEducation(response.data as unknown as EducationDetail);
      }
    } catch (error) {
      console.error("Error fetching education detail:", error);
      toast({
        title: "Error",
        description: "Failed to fetch education details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await usersAPI.getAll({ role: "L2_EXEC_ADMIN" });
      if (response.success && response.data) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleAssignOfficer = async () => {
    if (!education || !selectedOfficer) return;

    try {
      setUpdatingAssignment(true);
      await educationAPI.update(education._id, {
        assignedTo: selectedOfficer === "UNASSIGNED" ? null : selectedOfficer,
      });
      toast({
        title: "Success",
        description: "Officer assigned successfully",
      });
      setShowAssignDialog(false);
      fetchEducationDetail();
    } catch (error) {
      console.error("Error assigning officer:", error);
      toast({
        title: "Error",
        description: "Failed to assign officer",
        variant: "destructive",
      });
    } finally {
      setUpdatingAssignment(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!education) return;

    try {
      setUpdatingStatus(true);
      await educationAPI.update(education._id, { status: newStatus });
      toast({
        title: "Success",
        description: "Status updated successfully",
      });
      fetchEducationDetail();
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handlePriorityChange = async (newPriority: string) => {
    if (!education) return;

    try {
      setUpdatingPriority(true);
      await educationAPI.update(education._id, { priority: newPriority });
      toast({
        title: "Success",
        description: "Priority updated successfully",
      });
      fetchEducationDetail();
    } catch (error) {
      console.error("Error updating priority:", error);
      toast({
        title: "Error",
        description: "Failed to update priority",
        variant: "destructive",
      });
    } finally {
      setUpdatingPriority(false);
    }
  };

  const handleAddComment = async () => {
    if (!education || !newComment.trim()) return;

    try {
      await educationAPI.addComment(education._id, newComment);
      toast({
        title: "Success",
        description: "Comment added successfully",
      });
      setNewComment("");
      fetchEducationDetail();
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            Loading education details...
          </p>
        </div>
      </div>
    );
  }

  if (!education) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">
            Education Request Not Found
          </h2>
          <p className="text-muted-foreground mb-4">
            The education support request you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/admin/education")}>
            Back to Education Support
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/admin/education")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Education Support Details</h1>
            <p className="text-muted-foreground">
              Request ID: <span className="font-mono">{education.eduId}</span>
            </p>
          </div>
        </div>
        <Button onClick={() => navigate(`/admin/education/${id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" />
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
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Mobile</p>
                  <p className="font-medium">{education.mobile || "N/A"}</p>
                </div>
                {education.email && (
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{education.email}</p>
                  </div>
                )}
                {education.aadhaarNumber && (
                  <div>
                    <p className="text-sm text-muted-foreground">Aadhaar</p>
                    <p className="font-medium">{education.aadhaarNumber}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">
                    {[
                      education.ward,
                      education.mandal,
                      education.district,
                      education.pincode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Student Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Student Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Student Name</p>
                  <p className="font-medium">
                    {education.studentName || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gender</p>
                  <p className="font-medium">{education.gender || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Father/Guardian Name
                  </p>
                  <p className="font-medium">
                    {education.fatherOrGuardianName || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">
                    {education.dateOfBirth
                      ? format(new Date(education.dateOfBirth), "dd MMM yyyy")
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Class/Year</p>
                  <p className="font-medium">
                    {education.currentClass || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Institution</p>
                  <p className="font-medium">
                    {education.institutionName || "N/A"}
                  </p>
                </div>
                {education.rollNumber && (
                  <div>
                    <p className="text-sm text-muted-foreground">Roll Number</p>
                    <p className="font-medium">{education.rollNumber}</p>
                  </div>
                )}
                {education.courseOrStream && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Course/Stream
                    </p>
                    <p className="font-medium">{education.courseOrStream}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Education & Fee Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Education & Fee Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Education Type
                  </p>
                  <Badge variant="outline">
                    {education.educationType?.replace(/_/g, " ") || "N/A"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Support Type</p>
                  <Badge variant="secondary">
                    {education.supportType?.replace(/_/g, " ") || "N/A"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Institution Type
                  </p>
                  <Badge>
                    {education.institutionType?.replace(/_/g, " ") || "N/A"}
                  </Badge>
                </div>
                {education.academicYear && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Academic Year
                    </p>
                    <p className="font-medium">{education.academicYear}</p>
                  </div>
                )}
                {education.courseOrStream && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Course/Stream
                    </p>
                    <p className="font-medium">{education.courseOrStream}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Amount Requested
                  </p>
                  <p className="text-lg font-bold text-blue-600">
                    ₹{education.requestedAmount?.toLocaleString("en-IN") || "0"}
                  </p>
                </div>
                {education.approvedAmount && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Amount Approved
                    </p>
                    <p className="text-lg font-bold text-green-600">
                      ₹{education.approvedAmount.toLocaleString("en-IN")}
                    </p>
                  </div>
                )}
                {education.urgency && (
                  <div>
                    <p className="text-sm text-muted-foreground">Urgency</p>
                    <Badge
                      variant={
                        education.urgency === "HIGH"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {education.urgency}
                    </Badge>
                  </div>
                )}
              </div>

              {education.academicPerformance && (
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">
                    Academic Performance
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    {education.academicPerformance.lastExamPercentage && (
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Last Exam %
                        </p>
                        <p className="font-medium">
                          {education.academicPerformance.lastExamPercentage}%
                        </p>
                      </div>
                    )}
                    {education.academicPerformance.gpa && (
                      <div>
                        <p className="text-sm text-muted-foreground">GPA</p>
                        <p className="font-medium">
                          {education.academicPerformance.gpa}
                        </p>
                      </div>
                    )}
                    {education.academicPerformance.rank && (
                      <div>
                        <p className="text-sm text-muted-foreground">Rank</p>
                        <p className="font-medium">
                          {education.academicPerformance.rank}
                        </p>
                      </div>
                    )}
                    {education.academicPerformance.attendance && (
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Attendance
                        </p>
                        <p className="font-medium">
                          {education.academicPerformance.attendance}%
                        </p>
                      </div>
                    )}
                  </div>
                  {education.academicPerformance.achievements && (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">
                        Achievements
                      </p>
                      <p className="font-medium">
                        {education.academicPerformance.achievements}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Family Income */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Family Income Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Monthly Income
                  </p>
                  <p className="font-medium">
                    ₹
                    {education.familyIncome.monthlyIncome.toLocaleString(
                      "en-IN"
                    )}
                  </p>
                </div>
                {education.familyIncome.monthlyIncome && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Monthly Income
                    </p>
                    <p className="font-medium">
                      ₹
                      {education.familyIncome.monthlyIncome.toLocaleString(
                        "en-IN"
                      )}
                    </p>
                  </div>
                )}
                {education.familyIncome.occupation && (
                  <div>
                    <p className="text-sm text-muted-foreground">Occupation</p>
                    <p className="font-medium">
                      {education.familyIncome.occupation}
                    </p>
                  </div>
                )}
                {education.familyIncome.familyMembers && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Family Members
                    </p>
                    <p className="font-medium">
                      {education.familyIncome.familyMembers}
                    </p>
                  </div>
                )}
                {education.familyIncome.siblings && (
                  <div>
                    <p className="text-sm text-muted-foreground">Siblings</p>
                    <p className="font-medium">
                      {education.familyIncome.siblings}
                    </p>
                  </div>
                )}
                {education.familyIncome.siblingsInEducation && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Siblings in Education
                    </p>
                    <p className="font-medium">
                      {education.familyIncome.siblingsInEducation}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Approval Details */}
          {education.approvalDetails &&
            education.approvalDetails.approvedBy && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Approval Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Approved By
                      </p>
                      <p className="font-medium">
                        {typeof education.approvalDetails.approvedBy ===
                        "object"
                          ? `${education.approvalDetails.approvedBy.firstName} ${education.approvalDetails.approvedBy.lastName}`
                          : education.approvalDetails.approvedBy}
                      </p>
                    </div>
                    {education.approvalDetails.approvalDate && (
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Approval Date
                        </p>
                        <p className="font-medium">
                          {format(
                            new Date(education.approvalDetails.approvalDate),
                            "dd MMM yyyy"
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                  {education.approvalDetails.approvalNotes && (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">
                        Approval Notes
                      </p>
                      <p className="text-sm">
                        {education.approvalDetails.approvalNotes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

          {/* Disbursement Details */}
          {education.disbursementDetails &&
            education.disbursementDetails.transactionId && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Disbursement Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Amount Disbursed
                      </p>
                      <p className="text-lg font-bold text-green-600">
                        ₹
                        {education.disbursementDetails.amount?.toLocaleString(
                          "en-IN"
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Transaction ID
                      </p>
                      <p className="font-mono text-sm">
                        {education.disbursementDetails.transactionId}
                      </p>
                    </div>
                    {education.disbursementDetails.disbursementDate && (
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Disbursement Date
                        </p>
                        <p className="font-medium">
                          {format(
                            new Date(
                              education.disbursementDetails.disbursementDate
                            ),
                            "dd MMM yyyy"
                          )}
                        </p>
                      </div>
                    )}
                    {education.disbursementDetails.disbursementMode && (
                      <div>
                        <p className="text-sm text-muted-foreground">Mode</p>
                        <Badge>
                          {education.disbursementDetails.disbursementMode}
                        </Badge>
                      </div>
                    )}
                  </div>
                  {education.disbursementDetails.remarks && (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">Remarks</p>
                      <p className="text-sm">
                        {education.disbursementDetails.remarks}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

          {/* Additional Information */}
          {education.purpose && (
            <Card>
              <CardHeader>
                <CardTitle>Purpose / Additional Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{education.purpose}</p>
              </CardContent>
            </Card>
          )}

          {/* Attachments */}
          {education.attachments && education.attachments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Attachments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {education.attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{file.filename}</p>
                        <p className="text-xs text-muted-foreground">
                          Uploaded{" "}
                          {format(new Date(file.uploadedAt), "dd MMM yyyy")}
                        </p>
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Comments */}
          <Card>
            <CardHeader>
              <CardTitle>Comments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {education.comments && education.comments.length > 0 && (
                <div className="space-y-3">
                  {education.comments.map((comment, index) => (
                    <div
                      key={index}
                      className="border-l-2 border-primary pl-4 py-2"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm">
                          {comment.createdBy.firstName}{" "}
                          {comment.createdBy.lastName}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {format(
                            new Date(comment.createdAt),
                            "dd MMM yyyy, HH:mm"
                          )}
                        </span>
                      </div>
                      <p className="text-sm">{comment.text}</p>
                    </div>
                  ))}
                </div>
              )}
              <div className="space-y-2">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                />
                <Button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  size="sm"
                >
                  Add Comment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Current Status
                </p>
                <StatusBadge status={education.status} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Update Status
                </p>
                <Select
                  value={education.status}
                  onValueChange={handleStatusChange}
                  disabled={updatingStatus}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="REQUESTED">Requested</SelectItem>
                    <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                    <SelectItem value="VERIFICATION_PENDING">
                      Verification Pending
                    </SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                    <SelectItem value="AMOUNT_DISBURSED">
                      Amount Disbursed
                    </SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {education.rejectReason && (
                <div>
                  <p className="text-sm text-muted-foreground">Reject Reason</p>
                  <p className="text-sm text-destructive">
                    {education.rejectReason}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Priority Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Priority</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Current Priority
                </p>
                <Badge
                  variant={
                    education.priority === "URGENT"
                      ? "destructive"
                      : education.priority === "HIGH"
                      ? "default"
                      : "secondary"
                  }
                >
                  {education.priority}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Update Priority
                </p>
                <Select
                  value={education.priority}
                  onValueChange={handlePriorityChange}
                  disabled={updatingPriority}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Assignment Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Assignment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Assigned To
                </p>
                {education.assignedTo ? (
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <UserIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {typeof education.assignedTo === "object"
                          ? `${education.assignedTo.firstName} ${education.assignedTo.lastName}`
                          : education.assignedTo}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Unassigned</p>
                )}
              </div>

              {showAssignDialog ? (
                <div className="space-y-2">
                  <Select
                    value={selectedOfficer}
                    onValueChange={setSelectedOfficer}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select officer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UNASSIGNED">Unassigned</SelectItem>
                      {users.map((user) => (
                        <SelectItem key={user._id} value={user._id}>
                          {user.firstName} {user.lastName} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleAssignOfficer}
                      disabled={!selectedOfficer || updatingAssignment}
                      className="flex-1"
                    >
                      {updatingAssignment ? "Assigning..." : "Confirm"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setShowAssignDialog(false);
                        setSelectedOfficer(
                          typeof education.assignedTo === "object"
                            ? education.assignedTo._id
                            : education.assignedTo || ""
                        );
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSelectedOfficer(
                      typeof education.assignedTo === "object"
                        ? education.assignedTo._id
                        : education.assignedTo || "UNASSIGNED"
                    );
                    setShowAssignDialog(true);
                  }}
                >
                  <UserIcon className="h-4 w-4 mr-2" />
                  {education.assignedTo ? "Reassign" : "Assign"} Officer
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Timeline Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Created</p>
                  <p className="text-xs text-muted-foreground">
                    {format(
                      new Date(education.createdAt),
                      "dd MMM yyyy, HH:mm"
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Last Updated</p>
                  <p className="text-xs text-muted-foreground">
                    {format(
                      new Date(education.updatedAt),
                      "dd MMM yyyy, HH:mm"
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
