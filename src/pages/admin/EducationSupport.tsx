import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RecordList } from "@/components/shared/RecordList";
import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { educationAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface EducationRecord {
  _id: string;
  educationId: string;
  eduId?: string; // For backwards compatibility
  studentName: string;
  fatherOrGuardianName?: string;
  mobile: string;
  email?: string;
  currentClass?: string;
  institutionName: string;
  institutionType?: string;
  gender?: string;
  educationType: string;
  supportType: string;
  requestedAmount: number;
  approvedAmount?: number;
  status: string;
  urgency?: string;
  district?: string;
  assignedTo?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  [key: string]: unknown;
}

const columns = [
  {
    key: "educationId",
    label: "ID",
    sortable: true,
    render: (value: string, record: EducationRecord) => (
      <span className="font-mono text-sm text-primary">
        {value || record.eduId || "N/A"}
      </span>
    ),
  },
  {
    key: "studentName",
    label: "Student",
    sortable: true,
    render: (value: string) => value || "N/A",
  },
  {
    key: "institutionName",
    label: "Institution",
    sortable: true,
    render: (value: string) => value || "N/A",
  },
  {
    key: "educationType",
    label: "Type",
    sortable: true,
    render: (value: string) => (
      <Badge variant="outline">
        {value ? value.replace(/_/g, " ") : "N/A"}
      </Badge>
    ),
  },
  {
    key: "supportType",
    label: "Support Type",
    sortable: true,
    render: (value: string) => (
      <Badge variant="secondary">
        {value ? value.replace(/_/g, " ") : "N/A"}
      </Badge>
    ),
  },
  {
    key: "requestedAmount",
    label: "Amount",
    render: (value: number) => `₹${value?.toLocaleString("en-IN") || 0}`,
  },
  {
    key: "status",
    label: "Status",
    render: (value: string) => <StatusBadge status={value} />,
  },
  {
    key: "assignedTo",
    label: "Assigned To",
    render: (_: unknown, record: EducationRecord) =>
      record.assignedTo
        ? `${record.assignedTo.firstName} ${record.assignedTo.lastName}`
        : "Unassigned",
  },
  {
    key: "createdAt",
    label: "Applied",
    render: (value: string) =>
      formatDistanceToNow(new Date(value), { addSuffix: true }),
  },
];

const filters = [
  {
    key: "educationType",
    label: "Education Type",
    type: "select" as const,
    options: [
      { value: "SCHOOL", label: "School" },
      { value: "INTERMEDIATE", label: "Intermediate" },
      { value: "UNDERGRADUATE", label: "Undergraduate" },
      { value: "POSTGRADUATE", label: "Postgraduate" },
      { value: "DIPLOMA", label: "Diploma" },
      { value: "VOCATIONAL", label: "Vocational" },
      { value: "SKILL_TRAINING", label: "Skill Training" },
      { value: "OTHER", label: "Other" },
    ],
  },
  {
    key: "educationLevel",
    label: "Education Level",
    type: "select" as const,
    options: [
      { value: "PRIMARY", label: "Primary" },
      { value: "SECONDARY", label: "Secondary" },
      { value: "HIGHER_SECONDARY", label: "Higher Secondary" },
      { value: "UNDERGRADUATE", label: "Undergraduate" },
      { value: "POSTGRADUATE", label: "Postgraduate" },
      { value: "PROFESSIONAL", label: "Professional" },
    ],
  },
  {
    key: "status",
    label: "Status",
    type: "select" as const,
    options: [
      { value: "REQUESTED", label: "Requested" },
      { value: "UNDER_REVIEW", label: "Under Review" },
      { value: "VERIFICATION_PENDING", label: "Verification Pending" },
      { value: "APPROVED", label: "Approved" },
      { value: "REJECTED", label: "Rejected" },
      { value: "AMOUNT_DISBURSED", label: "Amount Disbursed" },
      { value: "COMPLETED", label: "Completed" },
      { value: "CANCELLED", label: "Cancelled" },
    ],
  },
  {
    key: "district",
    label: "District",
    type: "select" as const,
    options: [
      { value: "Guntur", label: "Guntur" },
      { value: "Krishna", label: "Krishna" },
      { value: "Prakasam", label: "Prakasam" },
      { value: "Nellore", label: "Nellore" },
      { value: "Visakhapatnam", label: "Visakhapatnam" },
    ],
  },
];

const savedViews = [
  {
    id: "pending-verification",
    name: "Pending Verification",
    filters: { status: "VERIFICATION_PENDING" },
  },
  {
    id: "under-review",
    name: "Under Review",
    filters: { status: "UNDER_REVIEW" },
  },
  { id: "approved", name: "Approved", filters: { status: "APPROVED" } },
];

export default function EducationSupport() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [data, setData] = useState<EducationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEducationRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchEducationRecords = async (filters?: Record<string, string>) => {
    try {
      setLoading(true);
      const response = await educationAPI.getAll(filters);
      if (response.success && response.data) {
        setData(response.data as unknown as EducationRecord[]);
      } else {
        // Handle case where response is not successful
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching education records:", error);
      setData([]); // Set empty array to prevent rendering issues
      toast({
        title: "Error",
        description: "Failed to fetch education support records",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (record: Record<string, unknown>) => {
    const id = (record.eduId || record._id) as string;
    if (id) {
      navigate(`/admin/education/${id}`);
    }
  };

  const handleNew = () => {
    navigate("/admin/education/new");
  };

  const handleBatchAction = (action: string, selectedIds: string[]) => {
    console.log(`Batch ${action} for:`, selectedIds);
    // Handle batch actions here
  };

  return (
    <div className="space-y-6 p-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate("/admin/dashboard")}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <RecordList
        title="Education Support"
        data={data}
        columns={columns}
        filters={filters}
        savedViews={savedViews}
        loading={loading}
        onRowClick={handleRowClick}
        onNew={handleNew}
        onBatchAction={handleBatchAction}
        newButtonText="New Education Support"
        searchPlaceholder="Search by ID, student name, institution..."
      />
    </div>
  );
}
