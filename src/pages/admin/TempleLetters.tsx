import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { RecordList } from "@/components/shared/RecordList";
import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { templesAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface TempleLetterRecord {
  id: string;
  applicant_name: string;
  mobile: string;
  temple_name: string;
  darshan_type: string;
  preferred_date: string;
  status: string;
  quota_available: boolean | number;
  created_at: string;
}

const columns = [
  {
    key: "id",
    label: "ID",
    sortable: true,
    render: (value: string) => (
      <span className="font-mono text-sm text-primary">{value}</span>
    ),
  },
  {
    key: "applicant_name",
    label: "Applicant",
    sortable: true,
  },
  {
    key: "temple_name",
    label: "Temple",
    sortable: true,
  },
  {
    key: "darshan_type",
    label: "Type",
    sortable: true,
    render: (value: string) => (
      <Badge variant={value === "VIP" ? "default" : "secondary"}>{value}</Badge>
    ),
  },
  {
    key: "preferred_date",
    label: "Preferred Date",
    sortable: true,
    render: (value: string) => new Date(value).toLocaleDateString(),
  },
  {
    key: "status",
    label: "Status",
    render: (value: string) => <StatusBadge status={value} />,
  },
  {
    key: "quota_available",
    label: "Quota Available",
    render: (value: number | boolean) => {
      const displayValue =
        typeof value === "boolean" ? (value ? "Yes" : "No") : value;
      return (
        <span
          className={
            typeof value === "number" && value < 50
              ? "text-destructive"
              : "text-foreground"
          }
        >
          {displayValue}
        </span>
      );
    },
  },
  {
    key: "created_at",
    label: "Age",
    render: (value: string) =>
      formatDistanceToNow(new Date(value), { addSuffix: true }),
  },
];

const filters = [
  {
    key: "temple_name",
    label: "Temple",
    type: "select" as const,
    options: [
      { value: "Tirumala Venkateswara", label: "Tirumala Venkateswara" },
      { value: "Srikalahasti", label: "Srikalahasti" },
      { value: "Simhachalam", label: "Simhachalam" },
    ],
  },
  {
    key: "darshan_type",
    label: "Darshan Type",
    type: "select" as const,
    options: [
      { value: "VIP", label: "VIP" },
      { value: "GENERAL", label: "General" },
      { value: "SPECIAL", label: "Special" },
      { value: "DIVYA_DARSHAN", label: "Divya Darshan" },
      { value: "SARVA_DARSHAN", label: "Sarva Darshan" },
    ],
  },
  {
    key: "status",
    label: "Status",
    type: "select" as const,
    options: [
      { value: "REQUESTED", label: "Requested" },
      { value: "UNDER_REVIEW", label: "Under Review" },
      { value: "APPROVED", label: "Approved" },
      { value: "REJECTED", label: "Rejected" },
      { value: "LETTER_ISSUED", label: "Letter Issued" },
      { value: "COMPLETED", label: "Completed" },
      { value: "CANCELLED", label: "Cancelled" },
    ],
  },
];

const savedViews = [
  {
    id: "pending-approval",
    name: "Pending Approval",
    filters: { status: "REQUESTED" },
  },
  {
    id: "vip-requests",
    name: "VIP Requests",
    filters: { darshan_type: "VIP" },
  },
  { id: "approved", name: "Approved", filters: { status: "APPROVED" } },
];

export default function TempleLetters() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [data, setData] = useState<TempleLetterRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTempleLetters = useCallback(async () => {
    try {
      setLoading(true);
      const response = await templesAPI.getAll();

      // Transform backend data to display format
      const transformedData = response.data.map(
        (temple: Record<string, unknown>) => ({
          id: (temple.templeId || temple._id) as string,
          applicant_name: temple.applicantName as string,
          mobile: temple.mobile as string,
          temple_name: temple.templeName as string,
          darshan_type: temple.darshanType as string,
          preferred_date: temple.preferredDate as string,
          status: temple.status as string,
          quota_available: temple.quotaAvailable as boolean | number,
          created_at: temple.createdAt as string,
        })
      );

      setData(transformedData);
    } catch (error: unknown) {
      console.error("Error fetching temple letters:", error);
      const errorMessage =
        error instanceof Error && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message || "Failed to fetch temple letters"
          : "Failed to fetch temple letters";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTempleLetters();
  }, [fetchTempleLetters]);

  const handleRowClick = (record: Record<string, unknown>) => {
    navigate(`/admin/temple-letters/${record.id}`);
  };

  const handleNew = () => {
    navigate("/admin/temple-letters/new");
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
        title="Temple Letters"
        data={data}
        columns={columns}
        filters={filters}
        savedViews={savedViews}
        loading={loading}
        onRowClick={handleRowClick}
        onNew={handleNew}
        onBatchAction={handleBatchAction}
        newButtonText="New Temple Letter"
        searchPlaceholder="Search by ID, applicant name..."
      />
    </div>
  );
}
