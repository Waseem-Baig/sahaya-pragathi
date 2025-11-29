import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RecordList } from "@/components/shared/RecordList";
import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import {
  educationAPI,
  csrIndustrialAPI,
  appointmentAPI,
  programAPI,
} from "@/lib/api";

interface WorkItem {
  id: string;
  type: string;
  title: string;
  applicant: string;
  status: string;
  priority?: string;
  created_at: string;
  needs_approval: boolean;
}

const allColumns = [
  {
    key: "id",
    label: "ID",
    sortable: true,
    render: (value: string, record: Record<string, unknown>) => (
      <div className="space-y-1">
        <span className="font-mono text-sm text-primary">{value}</span>
        <Badge variant="outline" className="text-xs">
          {record.type as string}
        </Badge>
      </div>
    ),
  },
  {
    key: "title",
    label: "Title",
    sortable: true,
  },
  {
    key: "applicant",
    label: "Citizen/Party",
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
    label: "Assigned To",
    render: (value: string) => value || "Unassigned",
  },
  {
    key: "status",
    label: "Status",
    render: (value: string) => <StatusBadge status={value} />,
  },
  {
    key: "created_at",
    label: "Created",
    render: (value: string) =>
      value ? formatDistanceToNow(new Date(value), { addSuffix: true }) : "-",
  },
];

const filters = [
  {
    key: "type",
    label: "Type",
    type: "select" as const,
    options: [
      { value: "Education Support", label: "Education Support" },
      { value: "CSR Industrial", label: "CSR Industrial" },
      { value: "Appointment", label: "Appointment" },
      { value: "Program", label: "Program/Job Mela" },
    ],
  },
  {
    key: "status",
    label: "Status",
    type: "select" as const,
    options: [
      { value: "PENDING", label: "Pending" },
      { value: "IN_PROGRESS", label: "In Progress" },
      { value: "APPROVED", label: "Approved" },
      { value: "COMPLETED", label: "Completed" },
      { value: "CONFIRMED", label: "Confirmed" },
    ],
  },
];

const savedViews = [
  {
    id: "pending",
    name: "Pending Items",
    filters: { status: "PENDING" },
  },
  {
    id: "in-progress",
    name: "In Progress",
    filters: { status: "IN_PROGRESS" },
  },
];

export default function WorkQueues() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [data, setData] = useState<WorkItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllWorkItems = async () => {
      try {
        setLoading(true);
        const allItems: WorkItem[] = [];

        // Fetch Education Support
        const educationResponse = await educationAPI.getAll({ limit: 1000 });
        const educationData = Array.isArray(educationResponse.data)
          ? educationResponse.data
          : (educationResponse.data as { data?: unknown[] })?.data || [];
        educationData.forEach((item: unknown) => {
          const edu = item as {
            educationId?: string;
            _id?: string;
            studentName?: string;
            status?: string;
            createdAt?: string;
          };
          allItems.push({
            id: edu.educationId || edu._id || "",
            type: "Education Support",
            title: `Education Support - ${edu.studentName || "N/A"}`,
            applicant: edu.studentName || "N/A",
            status: edu.status || "PENDING",
            created_at: edu.createdAt || new Date().toISOString(),
            needs_approval: edu.status === "PENDING",
          });
        });

        // Fetch CSR Industrial
        const csrResponse = await csrIndustrialAPI.getAll({ limit: 1000 });
        const csrData = Array.isArray(csrResponse.data)
          ? csrResponse.data
          : (csrResponse.data as { data?: unknown[] })?.data || [];
        csrData.forEach((item: unknown) => {
          const csr = item as {
            csrId?: string;
            _id?: string;
            projectName?: string;
            status?: string;
            createdAt?: string;
          };
          allItems.push({
            id: csr.csrId || csr._id || "",
            type: "CSR Industrial",
            title: csr.projectName || "CSR Project",
            applicant: csr.projectName || "N/A",
            status: csr.status || "PENDING",
            created_at: csr.createdAt || new Date().toISOString(),
            needs_approval: csr.status === "PENDING",
          });
        });

        // Fetch Appointments
        const appointmentResponse = await appointmentAPI.getAll({
          limit: 1000,
        });
        const appointmentData = Array.isArray(appointmentResponse.data)
          ? appointmentResponse.data
          : (appointmentResponse.data as { data?: unknown[] })?.data || [];
        appointmentData.forEach((item: unknown) => {
          const apt = item as {
            appointmentId?: string;
            _id?: string;
            applicantName?: string;
            purpose?: string;
            status?: string;
            createdAt?: string;
          };
          allItems.push({
            id: apt.appointmentId || apt._id || "",
            type: "Appointment",
            title: apt.purpose || "Appointment",
            applicant: apt.applicantName || "N/A",
            status: apt.status || "PENDING",
            created_at: apt.createdAt || new Date().toISOString(),
            needs_approval: apt.status === "PENDING",
          });
        });

        // Fetch Programs
        const programResponse = await programAPI.getAll({ limit: 1000 });
        const programData = Array.isArray(programResponse.data)
          ? programResponse.data
          : (programResponse.data as { data?: unknown[] })?.data || [];
        programData.forEach((item: unknown) => {
          const prog = item as {
            programId?: string;
            _id?: string;
            eventName?: string;
            type?: string;
            status?: string;
            createdAt?: string;
          };
          allItems.push({
            id: prog.programId || prog._id || "",
            type: "Program",
            title: prog.eventName || "Program",
            applicant: prog.type || "N/A",
            status: prog.status || "PLANNED",
            created_at: prog.createdAt || new Date().toISOString(),
            needs_approval: prog.status === "PLANNED",
          });
        });

        setData(allItems);
      } catch (error) {
        console.error("Error fetching work items:", error);
        toast({
          title: "Error",
          description: "Failed to load work items",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAllWorkItems();
  }, [toast]);

  const handleRowClick = (record: Record<string, unknown>) => {
    const type = String(record.type).toLowerCase().replace(/\s+/g, "-");
    navigate(`/admin/${type}/${record.id}`);
  };

  const handleBatchAction = (action: string, selectedIds: string[]) => {
    console.log(`Batch ${action} for:`, selectedIds);
    toast({
      title: "Batch Action",
      description: `${action} action for ${selectedIds.length} items`,
    });
  };

  const allItems = data;
  const myApprovals = data.filter((item) => item.needs_approval);

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

      <h1 className="text-2xl font-semibold">Work Queues</h1>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Items ({allItems.length})</TabsTrigger>
          <TabsTrigger value="my-approvals">
            My Approvals ({myApprovals.length})
            {myApprovals.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {myApprovals.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <RecordList
            title=""
            data={allItems}
            columns={allColumns}
            filters={filters}
            savedViews={savedViews}
            loading={loading}
            onRowClick={handleRowClick}
            onBatchAction={handleBatchAction}
            searchPlaceholder="Search across all work items..."
          />
        </TabsContent>

        <TabsContent value="my-approvals">
          <RecordList
            title=""
            data={myApprovals}
            columns={allColumns}
            filters={filters}
            loading={loading}
            onRowClick={handleRowClick}
            onBatchAction={handleBatchAction}
            searchPlaceholder="Search approval items..."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
