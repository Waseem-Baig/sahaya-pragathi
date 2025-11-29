import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  casesAPI,
  disputesAPI,
  templesAPI,
  cmReliefAPI,
  educationAPI,
  csrIndustrialAPI,
  appointmentAPI,
  programAPI,
} from "@/lib/api";
import {
  ArrowLeft,
  Calendar,
  User,
  MapPin,
  Phone,
  Mail,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface AssignmentDetailData {
  _id: string;
  module: string;
  caseId: string;
  title: string;
  status: string;
  priority: string;
  assignedAt: string;
  dueDate?: string;
  assignedBy: string;
  [key: string]: unknown;
}

export default function AssignmentDetail() {
  const { module, id } = useParams<{ module: string; id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [data, setData] = useState<AssignmentDetailData | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [notes, setNotes] = useState("");

  const getModuleAPI = (moduleName: string) => {
    // Normalize module name to handle variations
    const normalizedModule = moduleName.toLowerCase().replace(/\s+/g, "");

    const apis = {
      cases: casesAPI,
      grievances: casesAPI,
      disputes: disputesAPI,
      temples: templesAPI,
      templeletters: templesAPI,
      cmrelief: cmReliefAPI,
      education: educationAPI,
      educationsupport: educationAPI,
      csrindustrial: csrIndustrialAPI,
      csr: csrIndustrialAPI,
      appointments: appointmentAPI,
      programs: programAPI,
    };
    return apis[normalizedModule as keyof typeof apis];
  };

  const fetchAssignmentDetail = useCallback(async () => {
    if (!module || !id) return;

    try {
      setLoading(true);
      const api = getModuleAPI(module);

      if (!api) {
        console.error("No API found for module:", module);
        throw new Error(`Invalid module: ${module}`);
      }

      console.log("Fetching assignment from module:", module, "with ID:", id);
      const response = await api.getById(id);
      console.log("Fetched response:", response);

      if (response.success && response.data) {
        setData({
          ...response.data,
          module,
          _id: response.data._id,
          title:
            ((response.data as Record<string, unknown>).title as string) ||
            "N/A",
          assignedAt:
            ((response.data as Record<string, unknown>).assignedAt as string) ||
            new Date().toISOString(),
          assignedBy:
            ((response.data as Record<string, unknown>).assignedBy as string) ||
            "System",
        } as AssignmentDetailData);
        setNewStatus(response.data.status || "");
      } else {
        throw new Error("Failed to load assignment details");
      }
    } catch (error) {
      console.error("Error fetching assignment:", error);
      toast({
        title: "Error",
        description: `Failed to load assignment details for ${module}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [module, id, toast]);

  useEffect(() => {
    fetchAssignmentDetail();
  }, [fetchAssignmentDetail]);

  const handleUpdateStatus = async () => {
    if (!module || !id || !newStatus) {
      console.error("Missing required fields:", {
        module,
        id,
        newStatus,
        hasUser: !!user?._id,
      });
      toast({
        title: "Error",
        description: "Missing required fields for status update",
        variant: "destructive",
      });
      return;
    }

    if (!user?._id) {
      console.error("User ID not found");
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return;
    }

    try {
      setUpdating(true);
      const api = getModuleAPI(module);

      console.log("Updating status:", {
        module,
        normalizedModule: module.toLowerCase().replace(/\s+/g, ""),
        id,
        newStatus,
        userId: user._id,
        notes,
        hasUpdateStatus: api && "updateStatus" in api,
        hasUpdate: api && "update" in api,
      });

      // Check if API has updateStatus method, otherwise use update
      let response;
      if ("updateStatus" in api && typeof api.updateStatus === "function") {
        console.log("Using updateStatus method");
        response = await (api as typeof casesAPI).updateStatus(
          id,
          newStatus,
          user._id,
          notes
        );
      } else if ("update" in api && typeof api.update === "function") {
        console.log("Using update method with status");
        const updateData = {
          status: newStatus,
          ...(notes && { statusComment: notes }),
        };
        console.log("Update data:", updateData);
        response = await (api as typeof casesAPI).update(
          id,
          updateData as Partial<Record<string, unknown>>
        );
      } else {
        throw new Error("Update method not available for this module");
      }

      console.log("Update response:", response);

      if (response.success) {
        toast({
          title: "Success",
          description: "Status updated successfully",
        });
        setNotes("");
        fetchAssignmentDetail();
      } else {
        throw new Error(response.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);

      // Extract detailed error information
      let errorMessage = "Failed to update status";
      if (error instanceof Error) {
        errorMessage = error.message;
        console.error("Error message:", error.message);
      }

      // Check if it's an axios error with response data
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string; error?: string } };
        };
        if (axiosError.response?.data) {
          console.error("Server response:", axiosError.response.data);
          errorMessage =
            axiosError.response.data.message ||
            axiosError.response.data.error ||
            errorMessage;
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const getStatusOptions = () => {
    const currentStatus = data?.status || "";

    // Normalize module name
    const normalizedModule = module?.toLowerCase().replace(/\s+/g, "") || "";

    // Define status progression based on module type
    const moduleStatusOptions: Record<
      string,
      Array<{ value: string; label: string; disabled: boolean }>
    > = {
      cases: [
        { value: "pending", label: "Pending", disabled: false },
        { value: "in-progress", label: "In Progress", disabled: false },
        { value: "under-review", label: "Under Review", disabled: false },
        { value: "approved", label: "Approved", disabled: false },
        { value: "rejected", label: "Rejected", disabled: false },
        { value: "completed", label: "Completed", disabled: false },
        { value: "closed", label: "Closed", disabled: false },
      ],
      grievances: [
        { value: "pending", label: "Pending", disabled: false },
        { value: "in-progress", label: "In Progress", disabled: false },
        { value: "under-review", label: "Under Review", disabled: false },
        { value: "approved", label: "Approved", disabled: false },
        { value: "rejected", label: "Rejected", disabled: false },
        { value: "completed", label: "Completed", disabled: false },
        { value: "closed", label: "Closed", disabled: false },
      ],
      disputes: [
        { value: "NEW", label: "New", disabled: false },
        { value: "UNDER_REVIEW", label: "Under Review", disabled: false },
        {
          value: "MEDIATION_SCHEDULED",
          label: "Mediation Scheduled",
          disabled: false,
        },
        { value: "IN_MEDIATION", label: "In Mediation", disabled: false },
        { value: "SETTLED", label: "Settled", disabled: false },
        {
          value: "REFERRED_TO_COURT",
          label: "Referred to Court",
          disabled: false,
        },
        { value: "CLOSED", label: "Closed", disabled: false },
      ],
      temples: [
        { value: "REQUESTED", label: "Requested", disabled: false },
        { value: "UNDER_REVIEW", label: "Under Review", disabled: false },
        { value: "APPROVED", label: "Approved", disabled: false },
        { value: "REJECTED", label: "Rejected", disabled: false },
        { value: "LETTER_ISSUED", label: "Letter Issued", disabled: false },
        { value: "COMPLETED", label: "Completed", disabled: false },
        { value: "CANCELLED", label: "Cancelled", disabled: false },
      ],
      templeletters: [
        { value: "REQUESTED", label: "Requested", disabled: false },
        { value: "UNDER_REVIEW", label: "Under Review", disabled: false },
        { value: "APPROVED", label: "Approved", disabled: false },
        { value: "REJECTED", label: "Rejected", disabled: false },
        { value: "LETTER_ISSUED", label: "Letter Issued", disabled: false },
        { value: "COMPLETED", label: "Completed", disabled: false },
        { value: "CANCELLED", label: "Cancelled", disabled: false },
      ],
      cmrelief: [
        { value: "REQUESTED", label: "Requested", disabled: false },
        { value: "UNDER_REVIEW", label: "Under Review", disabled: false },
        {
          value: "VERIFICATION_PENDING",
          label: "Verification Pending",
          disabled: false,
        },
        { value: "APPROVED", label: "Approved", disabled: false },
        { value: "REJECTED", label: "Rejected", disabled: false },
        {
          value: "AMOUNT_DISBURSED",
          label: "Amount Disbursed",
          disabled: false,
        },
        { value: "COMPLETED", label: "Completed", disabled: false },
        { value: "CANCELLED", label: "Cancelled", disabled: false },
      ],
      education: [
        { value: "REQUESTED", label: "Requested", disabled: false },
        { value: "UNDER_REVIEW", label: "Under Review", disabled: false },
        {
          value: "VERIFICATION_PENDING",
          label: "Verification Pending",
          disabled: false,
        },
        { value: "APPROVED", label: "Approved", disabled: false },
        { value: "REJECTED", label: "Rejected", disabled: false },
        {
          value: "AMOUNT_DISBURSED",
          label: "Amount Disbursed",
          disabled: false,
        },
        { value: "COMPLETED", label: "Completed", disabled: false },
        { value: "CANCELLED", label: "Cancelled", disabled: false },
      ],
      educationsupport: [
        { value: "REQUESTED", label: "Requested", disabled: false },
        { value: "UNDER_REVIEW", label: "Under Review", disabled: false },
        {
          value: "VERIFICATION_PENDING",
          label: "Verification Pending",
          disabled: false,
        },
        { value: "APPROVED", label: "Approved", disabled: false },
        { value: "REJECTED", label: "Rejected", disabled: false },
        {
          value: "AMOUNT_DISBURSED",
          label: "Amount Disbursed",
          disabled: false,
        },
        { value: "COMPLETED", label: "Completed", disabled: false },
        { value: "CANCELLED", label: "Cancelled", disabled: false },
      ],
      csrindustrial: [
        { value: "REQUESTED", label: "Requested", disabled: false },
        { value: "UNDER_REVIEW", label: "Under Review", disabled: false },
        {
          value: "FEASIBILITY_CHECK",
          label: "Feasibility Check",
          disabled: false,
        },
        { value: "APPROVED", label: "Approved", disabled: false },
        { value: "REJECTED", label: "Rejected", disabled: false },
        { value: "IN_PROGRESS", label: "In Progress", disabled: false },
        { value: "COMPLETED", label: "Completed", disabled: false },
        { value: "CANCELLED", label: "Cancelled", disabled: false },
      ],
      csr: [
        { value: "REQUESTED", label: "Requested", disabled: false },
        { value: "UNDER_REVIEW", label: "Under Review", disabled: false },
        {
          value: "FEASIBILITY_CHECK",
          label: "Feasibility Check",
          disabled: false,
        },
        { value: "APPROVED", label: "Approved", disabled: false },
        { value: "REJECTED", label: "Rejected", disabled: false },
        { value: "IN_PROGRESS", label: "In Progress", disabled: false },
        { value: "COMPLETED", label: "Completed", disabled: false },
        { value: "CANCELLED", label: "Cancelled", disabled: false },
      ],
      appointments: [
        { value: "REQUESTED", label: "Requested", disabled: false },
        { value: "UNDER_REVIEW", label: "Under Review", disabled: false },
        { value: "CONFIRMED", label: "Confirmed", disabled: false },
        { value: "RESCHEDULED", label: "Rescheduled", disabled: false },
        { value: "CHECKED_IN", label: "Checked In", disabled: false },
        { value: "IN_PROGRESS", label: "In Progress", disabled: false },
        { value: "COMPLETED", label: "Completed", disabled: false },
        { value: "CANCELLED", label: "Cancelled", disabled: false },
        { value: "NO_SHOW", label: "No Show", disabled: false },
        { value: "REJECTED", label: "Rejected", disabled: false },
      ],
      programs: [
        { value: "PLANNED", label: "Planned", disabled: false },
        { value: "REGISTRATION", label: "Registration", disabled: false },
        {
          value: "REGISTRATION_CLOSED",
          label: "Registration Closed",
          disabled: false,
        },
        { value: "SCREENING", label: "Screening", disabled: false },
        { value: "SELECTION", label: "Selection", disabled: false },
        { value: "OFFER", label: "Offer", disabled: false },
        { value: "JOINED", label: "Joined", disabled: false },
        { value: "ONGOING", label: "Ongoing", disabled: false },
        { value: "COMPLETED", label: "Completed", disabled: false },
        { value: "CANCELLED", label: "Cancelled", disabled: false },
        { value: "POSTPONED", label: "Postponed", disabled: false },
      ],
    };

    // Get status options for current module, or default options
    const statusOptions = moduleStatusOptions[normalizedModule] || [
      { value: "ASSIGNED", label: "Assigned", disabled: false },
      { value: "IN_PROGRESS", label: "In Progress", disabled: false },
      { value: "COMPLETED", label: "Completed", disabled: false },
    ];

    return statusOptions;
  };

  const getStatusBadge = (status: string) => {
    // Normalize status for matching (handle both uppercase and lowercase, with underscores or hyphens)
    const normalizedStatus = status.toUpperCase().replace(/-/g, "_");

    const variants: Record<
      string,
      | "default"
      | "secondary"
      | "destructive"
      | "outline"
      | "success"
      | "warning"
    > = {
      // Common statuses
      PENDING: "secondary",
      ASSIGNED: "secondary",
      REQUESTED: "secondary",
      NEW: "secondary",
      PLANNED: "secondary",

      // In progress statuses
      IN_PROGRESS: "default",
      UNDER_REVIEW: "default",
      ONGOING: "default",
      SCREENING: "default",
      SELECTION: "default",
      MEDIATION_SCHEDULED: "default",
      IN_MEDIATION: "default",
      CHECKED_IN: "default",
      REGISTRATION: "default",

      // Warning statuses
      PENDING_APPROVAL: "warning",
      VERIFICATION_PENDING: "warning",
      FEASIBILITY_CHECK: "warning",
      RESCHEDULED: "warning",
      NO_SHOW: "warning",

      // Success statuses
      STAGE_1_COMPLETE: "success",
      STAGE_2_COMPLETE: "success",
      APPROVED: "success",
      COMPLETED: "success",
      VERIFIED: "success",
      CLOSED: "success",
      CONFIRMED: "success",
      SETTLED: "success",
      LETTER_ISSUED: "success",
      AMOUNT_DISBURSED: "success",
      OFFER: "success",
      JOINED: "success",

      // Destructive statuses
      REJECTED: "destructive",
      CANCELLED: "destructive",
      REFERRED_TO_COURT: "destructive",
      POSTPONED: "destructive",
    };

    return (
      <Badge variant={variants[normalizedStatus] || "secondary"}>
        {status
          .replace(/_/g, " ")
          .replace(/-/g, " ")
          .split(" ")
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(" ")}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<
      string,
      | "default"
      | "secondary"
      | "destructive"
      | "outline"
      | "success"
      | "warning"
    > = {
      P1: "destructive",
      P2: "warning",
      P3: "default",
      P4: "secondary",
    };

    return (
      <Badge variant={variants[priority] || "secondary"}>{priority}</Badge>
    );
  };

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderModuleSpecificDetails = () => {
    if (!data) return null;

    // Normalize module name to match the same logic as getModuleAPI
    const normalizedModule = module?.toLowerCase().replace(/\s+/g, "");

    // Helper to safely get string value
    const getString = (key: string): string => {
      const value = data[key];
      return typeof value === "string" ? value : "N/A";
    };

    // Helper to safely get nested value
    const getNested = (key: string, nestedKey: string): string => {
      const parent = data[key];
      if (parent && typeof parent === "object" && nestedKey in parent) {
        const value = (parent as Record<string, unknown>)[nestedKey];
        return typeof value === "string" ? value : "N/A";
      }
      return "N/A";
    };

    // Helper to safely get number value
    const getNumber = (key: string): number | undefined => {
      const value = data[key];
      return typeof value === "number" ? value : undefined;
    };

    switch (normalizedModule) {
      case "cases":
      case "grievances":
        return (
          <>
            <div>
              <h3 className="font-semibold text-lg mb-4">
                Grievance Information
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Case Type</p>
                  <p className="font-medium">{getString("caseType")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{getString("category")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium">{getString("department")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Priority</p>
                  {data.priority && getPriorityBadge(getString("priority"))}
                </div>
              </div>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">Subject</p>
                <p className="font-medium">{getString("subject")}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Description
                </p>
                <p className="text-sm">{getString("description")}</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-4">Citizen Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{getString("citizenName")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mobile</p>
                  <p className="font-medium">
                    {getString("mobile") ||
                      getNested("citizenContact", "phone")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">
                    {getNested("citizenContact", "email")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">District</p>
                  <p className="font-medium">{getString("district")}</p>
                </div>
              </div>
              {getNested("citizenContact", "address") !== "N/A" && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Address</p>
                  <p className="text-sm">
                    {getNested("citizenContact", "address")}
                  </p>
                </div>
              )}
            </div>

            {(data.place || data.time) && (
              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-4">Incident Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  {data.place && (
                    <div>
                      <p className="text-sm text-muted-foreground">Place</p>
                      <p className="font-medium">{getString("place")}</p>
                    </div>
                  )}
                  {data.time && (
                    <div>
                      <p className="text-sm text-muted-foreground">Time</p>
                      <p className="font-medium">
                        {formatDate(data.time as string | Date)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        );

      case "disputes":
        return (
          <>
            <div>
              <h3 className="font-semibold text-lg mb-4">
                Dispute Information
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{getString("category")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Incident Date</p>
                  <p className="font-medium">
                    {formatDate(data.incidentDate as string | Date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Incident Place
                  </p>
                  <p className="font-medium">{getString("incidentPlace")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">District</p>
                  <p className="font-medium">{getString("district")}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Description
                </p>
                <p className="text-sm">{getString("description")}</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-4">Party A Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{getNested("partyA", "name")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contact</p>
                  <p className="font-medium">
                    {getNested("partyA", "contact")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{getNested("partyA", "email")}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="text-sm">{getNested("partyA", "address")}</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-4">Party B Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{getNested("partyB", "name")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contact</p>
                  <p className="font-medium">
                    {getNested("partyB", "contact")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{getNested("partyB", "email")}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="text-sm">{getNested("partyB", "address")}</p>
                </div>
              </div>
            </div>

            {data.mediator && (
              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-4">
                  Mediation Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Mediator</p>
                    <p className="font-medium">{getString("mediator")}</p>
                  </div>
                  {data.mediationDate && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Mediation Date
                      </p>
                      <p className="font-medium">
                        {formatDate(data.mediationDate as string | Date)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        );

      case "temples":
      case "templeletters":
        return (
          <>
            <div>
              <h3 className="font-semibold text-lg mb-4">
                Temple Visit Request
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Temple Name</p>
                  <p className="font-medium">{getString("templeName")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Darshan Type</p>
                  <p className="font-medium">{getString("darshanType")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Preferred Date
                  </p>
                  <p className="font-medium">
                    {formatDate(data.preferredDate as string | Date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Number of People
                  </p>
                  <p className="font-medium">
                    {getNumber("numberOfPeople") || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">District</p>
                  <p className="font-medium">{getString("district")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mandal</p>
                  <p className="font-medium">{getString("mandal")}</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-4">Applicant Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Applicant Name
                  </p>
                  <p className="font-medium">{getString("applicantName")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mobile</p>
                  <p className="font-medium">{getString("mobile")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{getString("email")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Aadhaar Number
                  </p>
                  <p className="font-medium">{getString("aadhaarNumber")}</p>
                </div>
              </div>
              {getString("address") !== "N/A" && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Address</p>
                  <p className="text-sm">{getString("address")}</p>
                </div>
              )}
            </div>

            {(data.letterNumber || data.letterIssuedDate) && (
              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-4">Letter Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  {data.letterNumber && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Letter Number
                      </p>
                      <p className="font-medium">{getString("letterNumber")}</p>
                    </div>
                  )}
                  {data.letterIssuedDate && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Letter Issued Date
                      </p>
                      <p className="font-medium">
                        {formatDate(data.letterIssuedDate as string | Date)}
                      </p>
                    </div>
                  )}
                  {data.letterValidUntil && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Valid Until
                      </p>
                      <p className="font-medium">
                        {formatDate(data.letterValidUntil as string | Date)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {getString("purpose") !== "N/A" && (
              <div className="mt-6">
                <p className="text-sm text-muted-foreground mb-2">
                  Purpose of Visit
                </p>
                <p className="text-sm">{getString("purpose")}</p>
              </div>
            )}
          </>
        );

      case "cmrelief":
        return (
          <>
            <div>
              <h3 className="font-semibold text-lg mb-4">
                Applicant Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Applicant Name
                  </p>
                  <p className="font-medium">{getString("applicantName")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Father/Husband Name
                  </p>
                  <p className="font-medium">
                    {getString("fatherOrHusbandName")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gender</p>
                  <p className="font-medium">{getString("gender")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Age</p>
                  <p className="font-medium">{getNumber("age") || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mobile</p>
                  <p className="font-medium">{getString("mobile")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{getString("email")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">District</p>
                  <p className="font-medium">{getString("district")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mandal</p>
                  <p className="font-medium">{getString("mandal")}</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-4">Relief Request</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Relief Type</p>
                  <p className="font-medium">{getString("reliefType")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Urgency</p>
                  <Badge
                    variant={
                      getString("urgency") === "CRITICAL"
                        ? "destructive"
                        : getString("urgency") === "HIGH"
                        ? "warning"
                        : "default"
                    }
                  >
                    {getString("urgency")}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Requested Amount
                  </p>
                  <p className="font-medium">
                    {getNumber("requestedAmount")
                      ? `₹${getNumber("requestedAmount")?.toLocaleString(
                          "en-IN"
                        )}`
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Approved Amount
                  </p>
                  <p className="font-medium">
                    {getNumber("approvedAmount")
                      ? `₹${getNumber("approvedAmount")?.toLocaleString(
                          "en-IN"
                        )}`
                      : "Not yet approved"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Purpose</p>
                <p className="text-sm">{getString("purpose")}</p>
              </div>
            </div>

            {data.medicalDetails && (
              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-4">Medical Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Hospital Name
                    </p>
                    <p className="font-medium">
                      {getNested("medicalDetails", "hospitalName")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Disease</p>
                    <p className="font-medium">
                      {getNested("medicalDetails", "disease")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Doctor Name</p>
                    <p className="font-medium">
                      {getNested("medicalDetails", "doctorName")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Treatment Cost
                    </p>
                    <p className="font-medium">
                      {(() => {
                        const medicalDetails = data.medicalDetails as Record<
                          string,
                          unknown
                        >;
                        const cost = medicalDetails?.treatmentCost;
                        return typeof cost === "number"
                          ? `₹${cost.toLocaleString("en-IN")}`
                          : "N/A";
                      })()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {data.incomeDetails && (
              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-4">Income Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Monthly Income
                    </p>
                    <p className="font-medium">
                      {(() => {
                        const incomeDetails = data.incomeDetails as Record<
                          string,
                          unknown
                        >;
                        const income = incomeDetails?.monthlyIncome;
                        return typeof income === "number"
                          ? `₹${income.toLocaleString("en-IN")}`
                          : "N/A";
                      })()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Occupation</p>
                    <p className="font-medium">
                      {getNested("incomeDetails", "occupation")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Family Members
                    </p>
                    <p className="font-medium">
                      {(() => {
                        const incomeDetails = data.incomeDetails as Record<
                          string,
                          unknown
                        >;
                        const members = incomeDetails?.familyMembers;
                        return typeof members === "number" ? members : "N/A";
                      })()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Dependents</p>
                    <p className="font-medium">
                      {(() => {
                        const incomeDetails = data.incomeDetails as Record<
                          string,
                          unknown
                        >;
                        const deps = incomeDetails?.dependents;
                        return typeof deps === "number" ? deps : "N/A";
                      })()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        );

      case "education":
      case "educationsupport":
        return (
          <>
            <div>
              <h3 className="font-semibold text-lg mb-4">
                Student Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Student Name</p>
                  <p className="font-medium">{getString("studentName")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Father/Guardian Name
                  </p>
                  <p className="font-medium">
                    {getString("fatherOrGuardianName")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gender</p>
                  <p className="font-medium">{getString("gender")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Age</p>
                  <p className="font-medium">{getNumber("age") || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mobile</p>
                  <p className="font-medium">{getString("mobile")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{getString("email")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">District</p>
                  <p className="font-medium">{getString("district")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mandal</p>
                  <p className="font-medium">{getString("mandal")}</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-4">Education Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Education Type
                  </p>
                  <p className="font-medium">{getString("educationType")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Institution Name
                  </p>
                  <p className="font-medium">{getString("institutionName")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Institution Type
                  </p>
                  <p className="font-medium">{getString("institutionType")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Course/Stream</p>
                  <p className="font-medium">{getString("courseOrStream")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Academic Year</p>
                  <p className="font-medium">{getString("academicYear")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Class</p>
                  <p className="font-medium">{getString("currentClass")}</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-4">Support Request</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Support Type</p>
                  <p className="font-medium">{getString("supportType")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Urgency</p>
                  <Badge
                    variant={
                      getString("urgency") === "CRITICAL"
                        ? "destructive"
                        : getString("urgency") === "HIGH"
                        ? "warning"
                        : "default"
                    }
                  >
                    {getString("urgency")}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Requested Amount
                  </p>
                  <p className="font-medium">
                    {getNumber("requestedAmount")
                      ? `₹${getNumber("requestedAmount")?.toLocaleString(
                          "en-IN"
                        )}`
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Approved Amount
                  </p>
                  <p className="font-medium">
                    {getNumber("approvedAmount")
                      ? `₹${getNumber("approvedAmount")?.toLocaleString(
                          "en-IN"
                        )}`
                      : "Not yet approved"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Purpose</p>
                <p className="text-sm">{getString("purpose")}</p>
              </div>
            </div>
          </>
        );

      case "csrindustrial":
      case "csr":
        return (
          <>
            <div>
              <h3 className="font-semibold text-lg mb-4">
                Company Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Company Name</p>
                  <p className="font-medium">{getString("companyName")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Company Type</p>
                  <p className="font-medium">{getString("companyType")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Industry</p>
                  <p className="font-medium">{getString("industry")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">CIN Number</p>
                  <p className="font-medium">{getString("cinNumber")}</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-4">Project Details</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Project Name</p>
                  <p className="font-medium">{getString("projectName")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Project Category
                  </p>
                  <p className="font-medium">{getString("projectCategory")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">District</p>
                  <p className="font-medium">{getString("district")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mandal</p>
                  <p className="font-medium">{getString("mandal")}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Project Description
                </p>
                <p className="text-sm">{getString("projectDescription")}</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-4">
                Financial Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Proposed Budget
                  </p>
                  <p className="font-medium">
                    {getNumber("proposedBudget")
                      ? `₹${getNumber("proposedBudget")?.toLocaleString(
                          "en-IN"
                        )}`
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Approved Budget
                  </p>
                  <p className="font-medium">
                    {getNumber("approvedBudget")
                      ? `₹${getNumber("approvedBudget")?.toLocaleString(
                          "en-IN"
                        )}`
                      : "Not yet approved"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Funding Model</p>
                  <p className="font-medium">{getString("fundingModel")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">
                    {getNumber("duration")
                      ? `${getNumber("duration")} months`
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-4">Contact Person</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">
                    {getString("contactPersonName")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Designation</p>
                  <p className="font-medium">
                    {getString("contactDesignation")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mobile</p>
                  <p className="font-medium">{getString("contactMobile")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{getString("contactEmail")}</p>
                </div>
              </div>
            </div>
          </>
        );

      case "appointments":
        return (
          <>
            <div>
              <h3 className="font-semibold text-lg mb-4">
                Appointment Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Appointment Type
                  </p>
                  <p className="font-medium">{getString("appointmentType")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Urgency</p>
                  <Badge
                    variant={
                      getString("urgency") === "CRITICAL"
                        ? "destructive"
                        : getString("urgency") === "HIGH"
                        ? "warning"
                        : "default"
                    }
                  >
                    {getString("urgency")}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Meeting Date</p>
                  <p className="font-medium">
                    {formatDate(data.preferredDate as string | Date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time Slot</p>
                  <p className="font-medium">{getString("timeSlot")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Venue</p>
                  <p className="font-medium">{getString("venue")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">
                    {getNumber("duration")
                      ? `${getNumber("duration")} mins`
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-4">Applicant Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{getString("applicantName")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mobile</p>
                  <p className="font-medium">{getString("mobile")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{getString("email")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">District</p>
                  <p className="font-medium">{getString("district")}</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm text-muted-foreground mb-2">
                Purpose of Meeting
              </p>
              <p className="text-sm">{getString("purpose")}</p>
            </div>

            {data.attendees &&
              Array.isArray(data.attendees) &&
              data.attendees.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-lg mb-4">
                    Attendees ({data.attendees.length})
                  </h3>
                  <div className="space-y-2">
                    {data.attendees
                      .slice(0, 5)
                      .map((attendee: unknown, index: number) => {
                        const att = attendee as Record<string, unknown>;
                        return (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-sm"
                          >
                            <span className="font-medium">
                              {typeof att?.name === "string" ? att.name : "N/A"}
                            </span>
                            {typeof att?.mobile === "string" && (
                              <span className="text-muted-foreground">
                                - {att.mobile}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    {data.attendees.length > 5 && (
                      <p className="text-sm text-muted-foreground">
                        + {data.attendees.length - 5} more attendees
                      </p>
                    )}
                  </div>
                </div>
              )}

            {data.assignedOfficer && (
              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-4">Assigned Officer</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Officer Name
                    </p>
                    <p className="font-medium">
                      {getNested("assignedOfficer", "name")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Designation</p>
                    <p className="font-medium">
                      {getNested("assignedOfficer", "designation")}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        );

      case "programs":
        return (
          <>
            <div>
              <h3 className="font-semibold text-lg mb-4">
                Program Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Event Name</p>
                  <p className="font-medium">{getString("eventName")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Program Type</p>
                  <p className="font-medium">{getString("type")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Venue</p>
                  <p className="font-medium">{getString("venue")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">District</p>
                  <p className="font-medium">{getString("district")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="font-medium">
                    {formatDate(data.startDate as string | Date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">End Date</p>
                  <p className="font-medium">
                    {formatDate(data.endDate as string | Date)}
                  </p>
                </div>
              </div>
            </div>

            {(data.expectedAttendees || data.registeredCount) && (
              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-4">
                  Registration Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {data.expectedAttendees && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Expected Attendees
                      </p>
                      <p className="font-medium">
                        {getNumber("expectedAttendees")?.toLocaleString(
                          "en-IN"
                        )}
                      </p>
                    </div>
                  )}
                  {data.registeredCount && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Registered Count
                      </p>
                      <p className="font-medium">
                        {getNumber("registeredCount")?.toLocaleString("en-IN")}
                      </p>
                    </div>
                  )}
                  {data.registrationDeadline && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Registration Deadline
                      </p>
                      <p className="font-medium">
                        {formatDate(data.registrationDeadline as string | Date)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {getString("description") !== "N/A" && (
              <div className="mt-6">
                <p className="text-sm text-muted-foreground mb-2">
                  Description
                </p>
                <p className="text-sm">{getString("description")}</p>
              </div>
            )}

            {getString("objectives") !== "N/A" && (
              <div className="mt-6">
                <p className="text-sm text-muted-foreground mb-2">Objectives</p>
                <p className="text-sm">{getString("objectives")}</p>
              </div>
            )}

            {data.partners &&
              Array.isArray(data.partners) &&
              data.partners.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-lg mb-4">
                    Partners ({data.partners.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {data.partners.map((partner: unknown, index: number) => {
                      const p = partner as Record<string, unknown>;
                      return (
                        <Badge key={index} variant="outline">
                          {typeof p?.name === "string" ? p.name : "N/A"}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}

            {(data.totalBudget || data.allocatedBudget) && (
              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-4">Budget</h3>
                <div className="grid grid-cols-2 gap-4">
                  {data.totalBudget && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Budget
                      </p>
                      <p className="font-medium">
                        {getNumber("totalBudget")
                          ? `₹${getNumber("totalBudget")?.toLocaleString(
                              "en-IN"
                            )}`
                          : "N/A"}
                      </p>
                    </div>
                  )}
                  {data.allocatedBudget && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Allocated Budget
                      </p>
                      <p className="font-medium">
                        {getNumber("allocatedBudget")
                          ? `₹${getNumber("allocatedBudget")?.toLocaleString(
                              "en-IN"
                            )}`
                          : "N/A"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {data.coordinator && (
              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-4">Coordinator</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">
                      {getNested("coordinator", "name")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Contact</p>
                    <p className="font-medium">
                      {getNested("coordinator", "contact")}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        );

      default:
        return (
          <div>
            <p className="text-sm text-muted-foreground">
              No additional details available
            </p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">
            Loading assignment details...
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <p className="mt-4 text-muted-foreground">Assignment not found</p>
          <Button
            onClick={() => navigate("/executive/assignments")}
            className="mt-4"
          >
            Back to Assignments
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/executive/assignments")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{data.caseId || data._id}</h1>
            <p className="text-sm text-muted-foreground">
              {module?.toUpperCase()} Assignment
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getPriorityBadge(data.priority)}
          {getStatusBadge(data.status)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Assignment Details */}
          <Card>
            <CardHeader>
              <CardTitle>Assignment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderModuleSpecificDetails()}
            </CardContent>
          </Card>

          {/* Status Update */}
          <Card>
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  New Status
                </label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {getStatusOptions().map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Notes (Optional)
                </label>
                <Textarea
                  placeholder="Add notes about this status update..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </div>

              <Button
                onClick={handleUpdateStatus}
                disabled={
                  updating ||
                  !newStatus ||
                  newStatus === data.status ||
                  !user?._id
                }
                className="w-full"
                title={!user?._id ? "User not authenticated" : undefined}
              >
                {updating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Update Status
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Assignment Info */}
          <Card>
            <CardHeader>
              <CardTitle>Assignment Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Assigned By
                </p>
                <p className="font-medium">{data.assignedBy || "System"}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Assigned Date
                </p>
                <p className="font-medium">{formatDate(data.assignedAt)}</p>
              </div>

              {data.dueDate && (
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Due Date
                  </p>
                  <p className="font-medium">{formatDate(data.dueDate)}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Module
                </p>
                <p className="font-medium capitalize">{module}</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  // Open full module detail page
                  navigate(`/admin/${module}/${id}`);
                }}
              >
                <FileText className="h-4 w-4 mr-2" />
                View Full Details
              </Button>

              {data.attachments &&
                Array.isArray(data.attachments) &&
                data.attachments.length > 0 && (
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    View Attachments ({data.attachments.length})
                  </Button>
                )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
