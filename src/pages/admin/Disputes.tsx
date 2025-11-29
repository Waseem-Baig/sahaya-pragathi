import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { RecordList } from "@/components/shared/RecordList";
import { StatusBadge } from "@/components/StatusBadge";
import { SLAClock } from "@/components/shared/SLAClock";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { disputesAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

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
    key: "party_a_name",
    label: "Party A",
    sortable: true,
  },
  {
    key: "party_b_name",
    label: "Party B",
    sortable: true,
  },
  {
    key: "category",
    label: "Category",
    sortable: true,
    render: (value: string) => <Badge variant="outline">{value}</Badge>,
  },
  {
    key: "district",
    label: "District",
    sortable: true,
  },
  {
    key: "assigned_to",
    label: "Mediator",
    render: (value: string) => value || "Unassigned",
  },
  {
    key: "status",
    label: "Status",
    render: (value: string) => <StatusBadge status={value} />,
  },
  {
    key: "hearing_date",
    label: "Next Hearing",
    render: (value: string) => (value ? <SLAClock dueDate={value} /> : "-"),
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
    key: "district",
    label: "District",
    type: "select" as const,
    options: [
      { value: "Nellore", label: "Nellore" },
      { value: "Tirupati", label: "Tirupati" },
      { value: "Vijayawada", label: "Vijayawada" },
    ],
  },
  {
    key: "category",
    label: "Category",
    type: "select" as const,
    options: [
      { value: "Land", label: "Land" },
      { value: "Society", label: "Society" },
      { value: "Benefits", label: "Benefits" },
      { value: "Tenancy", label: "Tenancy" },
      { value: "Other", label: "Other" },
    ],
  },
  {
    key: "status",
    label: "Status",
    type: "select" as const,
    options: [
      { value: "NEW", label: "New" },
      { value: "MEDIATION_SCHEDULED", label: "Mediation Scheduled" },
      { value: "SETTLED", label: "Settled" },
      { value: "REFERRED_TO_COURT", label: "Referred to Court" },
    ],
  },
];

const savedViews = [
  { id: "hearings-due", name: "Hearings Due", filters: {} },
  { id: "unassigned", name: "Unassigned", filters: {} },
  { id: "pending-settlement", name: "Pending Settlement", filters: {} },
];

export default function Disputes() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDisputes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await disputesAPI.getAll();

      // Transform backend data to frontend format
      const transformedData = response.data.map(
        (dispute: Record<string, unknown>) => ({
          id: dispute.disputeId || dispute._id,
          _id: dispute._id,
          party_a_name: (dispute.partyA as { name?: string })?.name || "N/A",
          party_b_name: (dispute.partyB as { name?: string })?.name || "N/A",
          category: dispute.category,
          district: dispute.district || "N/A",
          assigned_to: dispute.assignedTo
            ? `${
                (
                  dispute.assignedTo as {
                    firstName?: string;
                    lastName?: string;
                  }
                ).firstName
              } ${
                (
                  dispute.assignedTo as {
                    firstName?: string;
                    lastName?: string;
                  }
                ).lastName
              }`
            : null,
          mediator: dispute.mediator
            ? `${
                (dispute.mediator as { firstName?: string; lastName?: string })
                  .firstName
              } ${
                (dispute.mediator as { firstName?: string; lastName?: string })
                  .lastName
              }`
            : null,
          status: dispute.status,
          hearing_date: dispute.hearingDate,
          created_at: dispute.createdAt,
        })
      );

      setData(transformedData);
    } catch (error) {
      console.error("Error fetching disputes:", error);
      toast({
        title: "Error",
        description:
          (error as { response?: { data?: { message?: string } } }).response
            ?.data?.message || "Failed to fetch disputes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchDisputes();
  }, [fetchDisputes]);

  const handleRowClick = (record: Record<string, unknown>) => {
    navigate(`/admin/disputes/${record._id || record.id}`);
  };

  const handleNew = () => {
    navigate("/admin/disputes/new");
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
        title="Disputes"
        data={data}
        columns={columns}
        filters={filters}
        savedViews={savedViews}
        loading={loading}
        onRowClick={handleRowClick}
        onNew={handleNew}
        onBatchAction={handleBatchAction}
        newButtonText="New Dispute"
        searchPlaceholder="Search by ID, party names..."
      />
    </div>
  );
}
