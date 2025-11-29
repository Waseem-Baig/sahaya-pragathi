import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RecordList } from "@/components/shared/RecordList";
import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { appointmentAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface AppointmentRecord {
  _id?: string;
  appointmentId?: string;
  applicantName: string;
  mobile: string;
  purpose: string;
  preferredDate?: string;
  confirmedSlot?: string;
  meetingPlace?: string;
  status?: string;
  createdAt?: string;
  [key: string]: unknown;
}
const columns = [
  {
    key: "appointmentId",
    label: "ID",
    sortable: true,
    render: (value: string) => (
      <span className="font-mono text-sm text-primary">{value}</span>
    ),
  },
  {
    key: "applicantName",
    label: "Applicant",
    sortable: true,
  },
  {
    key: "purpose",
    label: "Purpose",
    sortable: true,
    render: (value: string) => (
      <div className="max-w-xs truncate" title={value}>
        {value}
      </div>
    ),
  },
  {
    key: "preferredDate",
    label: "Preferred Date",
    sortable: true,
    render: (value: string) =>
      value ? new Date(value).toLocaleDateString() : "N/A",
  },
  {
    key: "confirmedSlot",
    label: "Confirmed Slot",
    render: (value: string) =>
      value ? (
        <Badge variant="default">{new Date(value).toLocaleString()}</Badge>
      ) : (
        <Badge variant="outline">Pending</Badge>
      ),
  },
  {
    key: "meetingPlace",
    label: "Venue",
    render: (value: string) => value || "TBD",
  },
  {
    key: "status",
    label: "Status",
    render: (value: string) => <StatusBadge status={value || "REQUESTED"} />,
  },
  {
    key: "createdAt",
    label: "Age",
    render: (value: string) =>
      value ? formatDistanceToNow(new Date(value), { addSuffix: true }) : "N/A",
  },
];

const filters = [
  {
    key: "meetingPlace",
    label: "Venue",
    type: "select" as const,
    options: [
      { value: "CHIEF_MINISTER_OFFICE", label: "Chief Minister Office" },
      { value: "SECRETARIAT", label: "Secretariat" },
      { value: "DISTRICT_COLLECTORATE", label: "District Collectorate" },
      { value: "FIELD_VISIT", label: "Field Visit" },
      { value: "VIRTUAL_MEETING", label: "Virtual Meeting" },
    ],
  },
  {
    key: "status",
    label: "Status",
    type: "select" as const,
    options: [
      { value: "REQUESTED", label: "Requested" },
      { value: "UNDER_REVIEW", label: "Under Review" },
      { value: "CONFIRMED", label: "Confirmed" },
      { value: "CHECKED_IN", label: "Checked In" },
      { value: "COMPLETED", label: "Completed" },
      { value: "CANCELLED", label: "Cancelled" },
      { value: "NO_SHOW", label: "No Show" },
    ],
  },
];

const savedViews = [
  { id: "todays-appointments", name: "Today's Appointments", filters: {} },
  {
    id: "pending-confirmation",
    name: "Pending Confirmation",
    filters: { status: "REQUESTED" },
  },
  { id: "vip-appointments", name: "VIP Appointments", filters: {} },
];

export default function AppointmentsAdmin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [data, setData] = useState<AppointmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await appointmentAPI.getAll();

      if (response.success && response.data) {
        setData(response.data as AppointmentRecord[]);
      } else {
        setError("Failed to fetch appointments");
        toast({
          title: "Error",
          description: "Failed to fetch appointments",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError("Failed to fetch appointments");
      toast({
        title: "Error",
        description: "Failed to fetch appointments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (record: Record<string, unknown>) => {
    const id = record.appointmentId || record._id;
    navigate(`/admin/appointments/${id}`);
  };

  const handleNew = () => {
    navigate("/admin/appointments/new");
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
        title="Appointments"
        data={data}
        columns={columns}
        filters={filters}
        savedViews={savedViews}
        loading={loading}
        onRowClick={handleRowClick}
        onNew={handleNew}
        onBatchAction={handleBatchAction}
        newButtonText="New Appointment"
        searchPlaceholder="Search by ID, applicant name..."
      />

      {error && (
        <div className="text-sm text-destructive text-center">{error}</div>
      )}
    </div>
  );
}
