import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { RecordList } from "@/components/shared/RecordList";
import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cmReliefAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface CMReliefRecord {
  id: string;
  patient_name: string;
  mobile: string;
  hospital_name: string;
  illness_diagnosis: string;
  estimated_cost: number;
  sanctioned_amount: number | null;
  status: string;
  district: string;
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
    key: "patient_name",
    label: "Patient",
    sortable: true,
  },
  {
    key: "hospital_name",
    label: "Hospital",
    sortable: true,
  },
  {
    key: "illness_diagnosis",
    label: "Diagnosis",
    sortable: true,
    render: (value: string) => <Badge variant="outline">{value}</Badge>,
  },
  {
    key: "estimated_cost",
    label: "Estimated Cost",
    render: (value: number) => `₹${value?.toLocaleString() || 0}`,
  },
  {
    key: "sanctioned_amount",
    label: "Sanctioned",
    render: (value: number) =>
      value ? `₹${value.toLocaleString()}` : "Pending",
  },
  {
    key: "status",
    label: "Status",
    render: (value: string) => <StatusBadge status={value} />,
  },
  {
    key: "district",
    label: "District",
    sortable: true,
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
    key: "hospital_name",
    label: "Hospital",
    type: "select" as const,
    options: [
      { value: "SVIMS Tirupati", label: "SVIMS Tirupati" },
      { value: "KIMS Nellore", label: "KIMS Nellore" },
      { value: "AIIMS Mangalagiri", label: "AIIMS Mangalagiri" },
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
];

const savedViews = [
  { id: "pending-sanction", name: "Pending Sanction", filters: {} },
  { id: "high-amount", name: "High Amount (>5L)", filters: {} },
  { id: "disbursement-due", name: "Disbursement Due", filters: {} },
];

export default function CMRelief() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [data, setData] = useState<CMReliefRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCMReliefRequests = useCallback(async () => {
    try {
      setLoading(true);
      const response = await cmReliefAPI.getAll();

      if (response.success && response.data) {
        // Transform backend data to frontend format
        const transformedData = response.data.map(
          (item: Record<string, unknown>) => ({
            id: (item.cmrfId as string) || (item._id as string),
            patient_name: (item.applicantName as string) || "N/A",
            mobile: (item.mobile as string) || "N/A",
            hospital_name:
              ((item.medicalDetails as Record<string, unknown>)
                ?.hospitalName as string) || "N/A",
            illness_diagnosis:
              ((item.medicalDetails as Record<string, unknown>)
                ?.disease as string) ||
              (item.purpose as string) ||
              "N/A",
            estimated_cost: (item.requestedAmount as number) || 0,
            sanctioned_amount: (item.approvedAmount as number) || null,
            status: (item.status as string) || "REQUESTED",
            district: (item.district as string) || "N/A",
            created_at: (item.createdAt as string) || new Date().toISOString(),
          })
        );

        setData(transformedData);
      }
    } catch (error) {
      console.error("Error fetching CM Relief requests:", error);
      toast({
        title: "Error",
        description: "Failed to load CM Relief requests. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCMReliefRequests();
  }, [fetchCMReliefRequests]);

  const handleRowClick = useCallback(
    (record: Record<string, unknown>) => {
      navigate(`/admin/cm-relief/${record.id}`);
    },
    [navigate]
  );

  const handleNew = useCallback(() => {
    navigate("/admin/cm-relief/new");
  }, [navigate]);

  const handleBatchAction = useCallback(
    (action: string, selectedIds: string[]) => {
      console.log(`Batch ${action} for:`, selectedIds);
      // Handle batch actions here
    },
    []
  );

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
        title="CM Relief Fund"
        data={data}
        columns={columns}
        filters={filters}
        savedViews={savedViews}
        loading={loading}
        onRowClick={handleRowClick}
        onNew={handleNew}
        onBatchAction={handleBatchAction}
        newButtonText="New CM Relief Request"
        searchPlaceholder="Search by ID, patient name..."
      />
    </div>
  );
}
