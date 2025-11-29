import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Edit,
  Building2,
  User,
  FolderKanban,
  MapPin,
  DollarSign,
  Calendar,
  FileText,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { csrIndustrialAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { StatusBadge } from "@/components/StatusBadge";

interface CSRProject {
  _id: string;
  csrId: string;
  companyName: string;
  companyType?: string;
  cinNumber?: string;
  panNumber?: string;
  gstNumber?: string;
  companyAddress?: string;
  companyWebsite?: string;
  industry?: string;
  contactPersonName: string;
  contactDesignation?: string;
  contactMobile: string;
  contactEmail?: string;
  alternateContactName?: string;
  alternateContactMobile?: string;
  alternateContactEmail?: string;
  projectName: string;
  projectCategory?: string;
  projectDescription?: string;
  projectObjectives?: string;
  targetBeneficiaries?: string;
  expectedOutcomes?: string;
  district?: string;
  mandal?: string;
  village?: string;
  implementationArea?: string;
  proposedBudget: number;
  approvedBudget?: number;
  fundingModel?: string;
  duration?: number;
  proposedStartDate?: string;
  proposedEndDate?: string;
  actualStartDate?: string;
  actualEndDate?: string;
  mouSignedDate?: string;
  mouValidUpto?: string;
  mouDocumentUrl?: string;
  progressPercentage?: number;
  progressNotes?: string;
  lastReviewDate?: string;
  nextReviewDate?: string;
  beneficiariesReached?: number;
  dueDiligenceStatus?: string;
  dueDiligenceNotes?: string;
  riskAssessment?: string;
  status: string;
  priority?: string;
  notes?: string;
  attachments?: Array<{
    filename: string;
    url: string;
    uploadedAt: string;
    documentType?: string;
  }>;
  milestones?: Array<{
    _id?: string;
    milestoneName: string;
    description?: string;
    targetDate?: string;
    completionDate?: string;
    status?: string;
    deliverables?: string;
    amountDisbursed?: number;
  }>;
  assignedTo?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  reviewedBy?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  approvedBy?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function CSRIndustrialDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [csr, setCSR] = useState<CSRProject | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCSRProject = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await csrIndustrialAPI.getById(id);

      if (response.success && response.data) {
        setCSR(response.data as CSRProject);
      }
    } catch (error) {
      console.error("Error fetching CSR project:", error);
      toast({
        title: "Error",
        description: "Failed to load CSR project details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCSRProject();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const formatCurrency = (amount?: number) => {
    if (!amount) return "N/A";
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const formatDate = (date?: string) => {
    if (!date) return "N/A";
    return format(new Date(date), "dd MMM yyyy");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!csr) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              CSR project not found
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/admin/csr-industrial")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to List
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={() => navigate(`/admin/csr-industrial/${id}/edit`)}
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit Project
        </Button>
      </div>

      {/* Title Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-2xl">{csr.projectName}</CardTitle>
                <StatusBadge status={csr.status} />
              </div>
              <p className="text-sm text-muted-foreground">ID: {csr.csrId}</p>
            </div>
            {csr.priority && (
              <Badge
                variant={
                  csr.priority === "HIGH" || csr.priority === "CRITICAL"
                    ? "destructive"
                    : "secondary"
                }
              >
                {csr.priority}
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Company Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Company Name</Label>
            <p className="font-medium">{csr.companyName}</p>
          </div>
          <div>
            <Label>Company Type</Label>
            <p>{csr.companyType || "N/A"}</p>
          </div>
          <div>
            <Label>Industry</Label>
            <p>{csr.industry || "N/A"}</p>
          </div>
          <div>
            <Label>CIN Number</Label>
            <p className="font-mono text-sm">{csr.cinNumber || "N/A"}</p>
          </div>
          <div>
            <Label>PAN Number</Label>
            <p className="font-mono text-sm">{csr.panNumber || "N/A"}</p>
          </div>
          <div>
            <Label>GST Number</Label>
            <p className="font-mono text-sm">{csr.gstNumber || "N/A"}</p>
          </div>
          {csr.companyWebsite && (
            <div>
              <Label>Website</Label>
              <a
                href={csr.companyWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {csr.companyWebsite}
              </a>
            </div>
          )}
          {csr.companyAddress && (
            <div className="md:col-span-2">
              <Label>Address</Label>
              <p>{csr.companyAddress}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Contact Person</Label>
            <p className="font-medium">{csr.contactPersonName}</p>
          </div>
          <div>
            <Label>Designation</Label>
            <p>{csr.contactDesignation || "N/A"}</p>
          </div>
          <div>
            <Label>Mobile</Label>
            <p className="font-mono">{csr.contactMobile}</p>
          </div>
          <div>
            <Label>Email</Label>
            <p>{csr.contactEmail || "N/A"}</p>
          </div>
          {(csr.alternateContactName || csr.alternateContactMobile) && (
            <>
              <Separator className="md:col-span-2" />
              <div>
                <Label>Alternate Contact</Label>
                <p>{csr.alternateContactName || "N/A"}</p>
              </div>
              <div>
                <Label>Alternate Mobile</Label>
                <p className="font-mono">
                  {csr.alternateContactMobile || "N/A"}
                </p>
              </div>
              {csr.alternateContactEmail && (
                <div>
                  <Label>Alternate Email</Label>
                  <p>{csr.alternateContactEmail}</p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Project Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5" />
            Project Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {csr.projectCategory && (
            <div>
              <Label>Category</Label>
              <Badge variant="outline" className="mt-1">
                {csr.projectCategory.replace(/_/g, " ")}
              </Badge>
            </div>
          )}
          {csr.projectDescription && (
            <div>
              <Label>Description</Label>
              <p className="text-sm">{csr.projectDescription}</p>
            </div>
          )}
          {csr.projectObjectives && (
            <div>
              <Label>Objectives</Label>
              <p className="text-sm whitespace-pre-wrap">
                {csr.projectObjectives}
              </p>
            </div>
          )}
          {csr.targetBeneficiaries && (
            <div>
              <Label>Target Beneficiaries</Label>
              <p className="text-sm">{csr.targetBeneficiaries}</p>
            </div>
          )}
          {csr.expectedOutcomes && (
            <div>
              <Label>Expected Outcomes</Label>
              <p className="text-sm whitespace-pre-wrap">
                {csr.expectedOutcomes}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Location & Financial */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label>District</Label>
              <p>{csr.district || "N/A"}</p>
            </div>
            <div>
              <Label>Mandal</Label>
              <p>{csr.mandal || "N/A"}</p>
            </div>
            <div>
              <Label>Village/Area</Label>
              <p>{csr.village || "N/A"}</p>
            </div>
            {csr.implementationArea && (
              <div>
                <Label>Implementation Area</Label>
                <p>{csr.implementationArea}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Financial Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label>Proposed Budget</Label>
              <p className="text-lg font-semibold">
                {formatCurrency(csr.proposedBudget)}
              </p>
            </div>
            <div>
              <Label>Approved Budget</Label>
              <p className="text-lg font-semibold text-green-600">
                {formatCurrency(csr.approvedBudget)}
              </p>
            </div>
            {csr.fundingModel && (
              <div>
                <Label>Funding Model</Label>
                <Badge>{csr.fundingModel.replace(/_/g, " ")}</Badge>
              </div>
            )}
            {csr.duration && (
              <div>
                <Label>Duration</Label>
                <p>{csr.duration} months</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Proposed Start Date</Label>
            <p>{formatDate(csr.proposedStartDate)}</p>
          </div>
          <div>
            <Label>Proposed End Date</Label>
            <p>{formatDate(csr.proposedEndDate)}</p>
          </div>
          <div>
            <Label>Actual Start Date</Label>
            <p>{formatDate(csr.actualStartDate)}</p>
          </div>
          <div>
            <Label>Actual End Date</Label>
            <p>{formatDate(csr.actualEndDate)}</p>
          </div>
          {csr.mouSignedDate && (
            <>
              <div>
                <Label>MoU Signed Date</Label>
                <p>{formatDate(csr.mouSignedDate)}</p>
              </div>
              <div>
                <Label>MoU Valid Upto</Label>
                <p>{formatDate(csr.mouValidUpto)}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Progress & Impact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Progress & Impact
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {csr.progressPercentage !== undefined && (
            <div>
              <Label>Progress</Label>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex-1 bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${csr.progressPercentage}%` }}
                  />
                </div>
                <span className="text-sm font-medium">
                  {csr.progressPercentage}%
                </span>
              </div>
            </div>
          )}
          {csr.progressNotes && (
            <div>
              <Label>Progress Notes</Label>
              <p className="text-sm">{csr.progressNotes}</p>
            </div>
          )}
          {csr.beneficiariesReached && (
            <div>
              <Label>Beneficiaries Reached</Label>
              <p className="text-xl font-semibold">
                {csr.beneficiariesReached.toLocaleString()}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Milestones */}
      {csr.milestones && csr.milestones.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {csr.milestones.map((milestone, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">{milestone.milestoneName}</h4>
                    {milestone.status && (
                      <StatusBadge status={milestone.status} />
                    )}
                  </div>
                  {milestone.description && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {milestone.description}
                    </p>
                  )}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <Label>Target Date</Label>
                      <p>{formatDate(milestone.targetDate)}</p>
                    </div>
                    <div>
                      <Label>Completion Date</Label>
                      <p>{formatDate(milestone.completionDate)}</p>
                    </div>
                    {milestone.amountDisbursed && (
                      <div>
                        <Label>Amount Disbursed</Label>
                        <p>{formatCurrency(milestone.amountDisbursed)}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attachments */}
      {csr.attachments && csr.attachments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Attachments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {csr.attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-secondary/20"
                >
                  <div>
                    <p className="font-medium">{file.filename}</p>
                    <p className="text-sm text-muted-foreground">
                      {file.documentType && `${file.documentType} • `}
                      {formatDate(file.uploadedAt)}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(file.url, "_blank")}
                  >
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Notes */}
      {csr.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Additional Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{csr.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground mb-1">{children}</p>;
}
