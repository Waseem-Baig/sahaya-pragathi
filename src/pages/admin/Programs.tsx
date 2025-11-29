import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { RecordList } from "@/components/shared/RecordList";
import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { programAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const columns = [
  {
    key: "programId",
    label: "ID",
    sortable: true,
    render: (value: string) => (
      <span className="font-mono text-sm text-primary">{value}</span>
    ),
  },
  {
    key: "eventName",
    label: "Event Name",
    sortable: true,
  },
  {
    key: "type",
    label: "Type",
    sortable: true,
    render: (value: string) => (
      <Badge variant={value === "JOB_MELA" ? "default" : "secondary"}>
        {value.replace("_", " ")}
      </Badge>
    ),
  },
  {
    key: "startDate",
    label: "Start Date",
    sortable: true,
    render: (value: string) =>
      value ? format(new Date(value), "MMM dd, yyyy") : "N/A",
  },
  {
    key: "venue",
    label: "Venue",
    sortable: true,
  },
  {
    key: "partners",
    label: "Partners",
    render: (value: string[]) => (
      <div className="flex flex-wrap gap-1">
        {value && value.length > 0 ? (
          <>
            {value.slice(0, 2).map((partner) => (
              <Badge key={partner} variant="outline" className="text-xs">
                {partner}
              </Badge>
            ))}
            {value.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{value.length - 2} more
              </Badge>
            )}
          </>
        ) : (
          <span className="text-sm text-muted-foreground">N/A</span>
        )}
      </div>
    ),
  },
  {
    key: "registrations",
    label: "Registrations",
    render: (value: number) => <Badge variant="secondary">{value || 0}</Badge>,
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
    key: "type",
    label: "Type",
    type: "select" as const,
    options: [
      { value: "JOB_MELA", label: "Job Mela" },
      { value: "PROGRAM", label: "Program" },
      { value: "TRAINING", label: "Training" },
      { value: "WORKSHOP", label: "Workshop" },
      { value: "SEMINAR", label: "Seminar" },
      { value: "OTHER", label: "Other" },
    ],
  },
  {
    key: "venue",
    label: "Venue",
    type: "select" as const,
    options: [
      {
        value: "Vijayawada Convention Center",
        label: "Vijayawada Convention Center",
      },
      {
        value: "Nellore Technical Institute",
        label: "Nellore Technical Institute",
      },
      { value: "Tirupati Auditorium", label: "Tirupati Auditorium" },
    ],
  },
  {
    key: "status",
    label: "Status",
    type: "select" as const,
    options: [
      { value: "PLANNED", label: "Planned" },
      { value: "REGISTRATION", label: "Registration Open" },
      { value: "REGISTRATION_CLOSED", label: "Registration Closed" },
      { value: "SCREENING", label: "Screening" },
      { value: "SELECTION", label: "Selection" },
      { value: "OFFER", label: "Offer Phase" },
      { value: "JOINED", label: "Joined" },
      { value: "ONGOING", label: "Ongoing" },
      { value: "COMPLETED", label: "Completed" },
      { value: "CANCELLED", label: "Cancelled" },
      { value: "POSTPONED", label: "Postponed" },
    ],
  },
  {
    key: "district",
    label: "District",
    type: "select" as const,
    options: [
      { value: "Nellore", label: "Nellore" },
      { value: "Tirupati", label: "Tirupati" },
      { value: "Vijayawada", label: "Vijayawada" },
      { value: "Visakhapatnam", label: "Visakhapatnam" },
    ],
  },
];

const savedViews = [
  {
    id: "upcoming-events",
    name: "Upcoming Events",
    filters: { status: "PLANNED" },
  },
  {
    id: "high-registrations",
    name: "High Registrations (>1000)",
    filters: {},
  },
  {
    id: "job-melas-only",
    name: "Job Melas Only",
    filters: { type: "JOB_MELA" },
  },
];

export default function Programs() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPrograms = useCallback(
    async (params?: Record<string, string>) => {
      try {
        setLoading(true);
        const response = await programAPI.getAll(params);
        setData(response.data || []);
      } catch (error: unknown) {
        console.error("Error fetching programs:", error);
        toast({
          title: "Error",
          description: "Failed to load programs",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  const handleRowClick = (record: Record<string, unknown>) => {
    navigate(`/admin/programs/${record.programId || record._id}`);
  };

  const handleNew = () => {
    navigate("/admin/programs/new");
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
        title="Programs & Job Melas"
        data={data}
        columns={columns}
        filters={filters}
        savedViews={savedViews}
        loading={loading}
        onRowClick={handleRowClick}
        onNew={handleNew}
        onBatchAction={handleBatchAction}
        newButtonText="New Program/Event"
        searchPlaceholder="Search by ID, event name..."
      />
    </div>
  );
}
