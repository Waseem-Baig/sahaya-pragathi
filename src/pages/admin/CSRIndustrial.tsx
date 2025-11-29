import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RecordList } from "@/components/shared/RecordList";
import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { csrIndustrialAPI } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

interface CSRRecord {
  _id: string;
  csrId: string;
  companyName: string;
  projectName: string;
  contactPersonName: string;
  district?: string;
  mandal?: string;
  proposedBudget: number;
  status: string;
  progressNotes?: string;
  createdAt: string;
  [key: string]: unknown;
}

const columns = [
  {
    key: "csrId",
    label: "ID",
    sortable: true,
    render: (value: string) => (
      <span className="font-mono text-sm text-primary">{value}</span>
    ),
  },
  {
    key: "companyName",
    label: "Company",
    sortable: true,
  },
  {
    key: "projectName",
    label: "Project",
    sortable: true,
    render: (value: string) => <Badge variant="outline">{value}</Badge>,
  },
  {
    key: "contactPersonName",
    label: "Contact Person",
    sortable: true,
  },
  {
    key: "district",
    label: "District",
    sortable: true,
  },
  {
    key: "proposedBudget",
    label: "Budget",
    render: (value: number) => `₹${(value / 100000).toFixed(1)}L`,
  },
  {
    key: "status",
    label: "Status",
    render: (value: string) => <StatusBadge status={value} />,
  },
  {
    key: "createdAt",
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
    key: "mandal",
    label: "Mandal",
    type: "select" as const,
    options: [
      { value: "Nellore Rural", label: "Nellore Rural" },
      { value: "Gudur", label: "Gudur" },
      { value: "Kavali", label: "Kavali" },
    ],
  },
  {
    key: "status",
    label: "Status",
    type: "select" as const,
    options: [
      { value: "LEAD", label: "Lead" },
      { value: "DUE_DILIGENCE", label: "Due Diligence" },
      { value: "PROPOSAL_SENT", label: "Proposal Sent" },
      { value: "MOU_SIGNED", label: "MoU Signed" },
      { value: "IN_EXECUTION", label: "In Execution" },
      { value: "MILESTONES_APPROVED", label: "Milestones Approved" },
      { value: "CLOSED", label: "Closed" },
    ],
  },
];

const savedViews = [
  { id: "pending-mou", name: "Pending MoU", filters: {} },
  { id: "high-budget", name: "High Budget (>50L)", filters: {} },
  { id: "execution-phase", name: "In Execution", filters: {} },
];

export default function CSRIndustrial() {
  const navigate = useNavigate();
  const [data, setData] = useState<CSRRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCSRProjects();
  }, []);

  const fetchCSRProjects = async () => {
    try {
      setLoading(true);
      const response = await csrIndustrialAPI.getAll();

      if (response.success && response.data) {
        setData(response.data as CSRRecord[]);
      }
    } catch (error) {
      console.error("Error fetching CSR projects:", error);
      toast({
        title: "Error",
        description: "Failed to load CSR projects. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (record: Record<string, unknown>) => {
    const id = (record.csrId || record._id) as string;
    console.log("Navigating to CSR project:", id, record);
    navigate(`/admin/csr-industrial/${id}`);
  };

  const handleNew = () => {
    navigate("/admin/csr-industrial/new");
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
        title="CSR & Industrial"
        data={data}
        columns={columns}
        filters={filters}
        savedViews={savedViews}
        loading={loading}
        onRowClick={handleRowClick}
        onNew={handleNew}
        onBatchAction={handleBatchAction}
        newButtonText="New CSR Project"
        searchPlaceholder="Search by ID, company name..."
      />
    </div>
  );
}
