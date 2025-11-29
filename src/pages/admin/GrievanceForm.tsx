import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RecordForm } from "@/components/shared/RecordForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { FileUpload } from "@/components/shared/FileUpload";
import { casesAPI, usersAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import type { User } from "@/types/auth";

// Type definitions
interface StepProps {
  data: Record<string, unknown>;
  onChange: (updates: Record<string, unknown>) => void;
}

// Helper function to safely convert unknown to string
const asString = (value: unknown): string => {
  return value ? String(value) : "";
};

// Step 1: Citizen Information
const CitizenInfoStep = ({ data, onChange }: StepProps) => {
  const updateField = (
    field: string,
    value: string | Date | File[] | string[]
  ) => {
    onChange({ [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Citizen Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="citizen_name">Full Name *</Label>
            <Input
              id="citizen_name"
              value={asString(data.citizen_name)}
              onChange={(e) => updateField("citizen_name", e.target.value)}
              placeholder="Enter full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile Number *</Label>
            <Input
              id="mobile"
              value={asString(data.mobile)}
              onChange={(e) => updateField("mobile", e.target.value)}
              placeholder="10-digit mobile number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={asString(data.email)}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="Enter email address"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="aadhaar_number">Aadhaar Number</Label>
            <Input
              id="aadhaar_number"
              value={asString(data.aadhaar_number)}
              onChange={(e) => updateField("aadhaar_number", e.target.value)}
              placeholder="12-digit Aadhaar number"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address *</Label>
          <Textarea
            id="address"
            value={asString(data.address)}
            onChange={(e) => updateField("address", e.target.value)}
            placeholder="Complete address"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="district">District *</Label>
            <Select
              value={asString(data.district)}
              onValueChange={(value) => updateField("district", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select District" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Nellore">Nellore</SelectItem>
                <SelectItem value="Tirupati">Tirupati</SelectItem>
                <SelectItem value="Vijayawada">Vijayawada</SelectItem>
                <SelectItem value="Visakhapatnam">Visakhapatnam</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mandal">Mandal *</Label>
            <Select
              value={asString(data.mandal)}
              onValueChange={(value) => updateField("mandal", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Mandal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Nellore Rural">Nellore Rural</SelectItem>
                <SelectItem value="Gudur">Gudur</SelectItem>
                <SelectItem value="Kavali">Kavali</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ward">Ward *</Label>
            <Select
              value={asString(data.ward)}
              onValueChange={(value) => updateField("ward", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Ward" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ward 1">Ward 1</SelectItem>
                <SelectItem value="Ward 2">Ward 2</SelectItem>
                <SelectItem value="Ward 15">Ward 15</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pincode">Pincode</Label>
            <Input
              id="pincode"
              value={asString(data.pincode)}
              onChange={(e) => updateField("pincode", e.target.value)}
              placeholder="6-digit pincode"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Step 2: Grievance Details
const GrievanceDetailsStep = ({ data, onChange }: StepProps) => {
  const [incidentDate, setIncidentDate] = useState<Date | undefined>(
    data.incident_date ? new Date(data.incident_date as string) : undefined
  );

  const updateField = (
    field: string,
    value: string | Date | File[] | string[]
  ) => {
    onChange({ [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grievance Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={asString(data.category)}
              onValueChange={(value) => updateField("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Water Supply">Water Supply</SelectItem>
                <SelectItem value="Electricity">Electricity</SelectItem>
                <SelectItem value="Roads">Roads</SelectItem>
                <SelectItem value="Sanitation">Sanitation</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subcategory">Subcategory *</Label>
            <Select
              value={asString(data.subcategory)}
              onValueChange={(value) => updateField("subcategory", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Subcategory" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New Connection">New Connection</SelectItem>
                <SelectItem value="Repair">Repair</SelectItem>
                <SelectItem value="Billing Issue">Billing Issue</SelectItem>
                <SelectItem value="Quality Issue">Quality Issue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={asString(data.description)}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Describe your grievance in detail (500-2000 characters)"
            rows={6}
            minLength={500}
            maxLength={2000}
          />
          <div className="text-xs text-muted-foreground text-right">
            {asString(data.description).length} / 2000 characters
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Incident Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !incidentDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {incidentDate ? format(incidentDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={incidentDate}
                  onSelect={(date) => {
                    setIncidentDate(date);
                    updateField(
                      "incident_date",
                      date?.toISOString().split("T")[0]
                    );
                  }}
                  disabled={(date) => date > new Date()}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="incident_place">Incident Place</Label>
            <Input
              id="incident_place"
              value={asString(data.incident_place)}
              onChange={(e) => updateField("incident_place", e.target.value)}
              placeholder="Where did the incident occur?"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority *</Label>
          <Select
            value={asString(data.priority) || "P3"}
            onValueChange={(value) => updateField("priority", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="P1">P1 - Critical (Emergency)</SelectItem>
              <SelectItem value="P2">P2 - High (Urgent)</SelectItem>
              <SelectItem value="P3">P3 - Medium (Normal)</SelectItem>
              <SelectItem value="P4">P4 - Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Attachments</Label>
          <FileUpload
            onFilesChange={(files) =>
              updateField(
                "attachments",
                files.map((f) => f.name)
              )
            }
            existingFiles={
              Array.isArray(data.attachments)
                ? (data.attachments as Array<{
                    id: string;
                    name: string;
                    type: string;
                    size: number;
                    url?: string;
                    uploadedAt?: string;
                  }>)
                : []
            }
            acceptedTypes={["image/jpeg", "image/png", "application/pdf"]}
            maxSizePerFile={10 * 1024 * 1024} // 10MB
            maxFiles={10}
          />
        </div>
      </CardContent>
    </Card>
  );
};

// Step 3: Assignment (Admin Only)
const AssignmentStep = ({ data, onChange }: StepProps) => {
  const [slaDate, setSlaDate] = useState<Date | undefined>(
    data.sla_due_at ? new Date(data.sla_due_at as string) : undefined
  );
  const [officers, setOfficers] = useState<
    Array<{
      id: string;
      name: string;
      department: string;
    }>
  >([]);
  const [loadingOfficers, setLoadingOfficers] = useState(false);
  const { toast } = useToast();

  // Fetch executive admins from backend
  useEffect(() => {
    const fetchOfficers = async () => {
      try {
        setLoadingOfficers(true);
        const response = await usersAPI.getAllUsers({ role: "L2_EXEC_ADMIN" });

        if (response.success && response.data) {
          const officersList = response.data.map((user: User) => ({
            id: user._id,
            name: `${user.firstName} ${user.lastName}`,
            department: user.department || "General",
          }));
          setOfficers(officersList);
        }
      } catch (error) {
        console.error("Error fetching officers:", error);
        // Don't show error toast, just use empty list
      } finally {
        setLoadingOfficers(false);
      }
    };

    fetchOfficers();
  }, []);

  const updateField = (
    field: string,
    value: string | Date | File[] | string[]
  ) => {
    onChange({ [field]: value });
  };

  const departments = [
    "Water Supply Department",
    "Electricity Department",
    "Roads & Buildings Department",
    "Municipal Corporation",
    "Health Department",
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assignment & Routing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="assigned_to">Assign To Executive Admin</Label>
            <Select
              value={asString(data.assigned_to)}
              onValueChange={(value) => updateField("assigned_to", value)}
              disabled={loadingOfficers}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    loadingOfficers ? "Loading officers..." : "Select Officer"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {officers.length === 0 ? (
                  <SelectItem value="_none" disabled>
                    {loadingOfficers ? "Loading..." : "No officers available"}
                  </SelectItem>
                ) : (
                  officers.map((officer) => (
                    <SelectItem key={officer.id} value={officer.id}>
                      <div>
                        <div className="font-medium">{officer.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {officer.department}
                        </div>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assigned_dept">Department</Label>
            <Select
              value={asString(data.assigned_dept)}
              onValueChange={(value) => updateField("assigned_dept", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>SLA Due Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !slaDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {slaDate ? format(slaDate, "PPP") : "Select SLA due date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={slaDate}
                onSelect={(date) => {
                  setSlaDate(date);
                  updateField("sla_due_at", date?.toISOString());
                }}
                disabled={(date) => date < new Date()}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="progress_notes">Initial Notes</Label>
          <Textarea
            id="progress_notes"
            value={asString(data.progress_notes)}
            onChange={(e) => updateField("progress_notes", e.target.value)}
            placeholder="Add initial assessment or routing instructions"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Initial Status</Label>
          <Select
            value={asString(data.status) || "NEW"}
            onValueChange={(value) => updateField("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NEW">New</SelectItem>
              <SelectItem value="TRIAGED">Triaged</SelectItem>
              <SelectItem value="ASSIGNED">Assigned</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default function GrievanceForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<Record<
    string,
    unknown
  > | null>(null);

  // Fetch existing grievance data for edit mode
  useEffect(() => {
    const fetchGrievance = async () => {
      if (!isEdit || !id) return;

      try {
        setLoading(true);
        const response = await casesAPI.getById(id);

        if (response.success && response.data) {
          const case_ = response.data;

          // Transform attachments from backend format to FileUpload format
          const transformedAttachments = Array.isArray(case_.attachments)
            ? (
                case_.attachments as Array<{
                  filename?: string;
                  url?: string;
                  uploadedAt?: string;
                }>
              ).map((att, index) => ({
                id: `existing-${index}`,
                name: att.filename || "file",
                type: att.filename?.endsWith(".pdf")
                  ? "application/pdf"
                  : att.filename?.endsWith(".jpg") ||
                    att.filename?.endsWith(".jpeg")
                  ? "image/jpeg"
                  : att.filename?.endsWith(".png")
                  ? "image/png"
                  : "application/octet-stream",
                size: 0, // Size not available from backend
                url: att.url,
                uploadedAt: att.uploadedAt,
              }))
            : [];

          // Transform backend data to form format
          const formData: Record<string, unknown> = {
            // Citizen Info
            citizen_name: case_.citizenName,
            mobile:
              (case_.citizenContact as Record<string, unknown>)?.phone ||
              case_.mobile,
            email: (case_.citizenContact as Record<string, unknown>)?.email,
            address: (case_.citizenContact as Record<string, unknown>)?.address,
            district: case_.district,
            mandal: case_.mandal || "",
            ward: case_.ward || "",
            pincode: case_.pincode || "",
            aadhaar_number: case_.aadhaarNumber || "",

            // Grievance Details
            category: case_.category,
            subcategory: case_.subcategory || case_.reason || "",
            description: case_.description,
            incident_date: case_.time ? new Date(String(case_.time)) : null,
            incident_place: case_.place,

            // Assignment
            assigned_to: (case_.assignedTo as Record<string, unknown>)?._id,
            assigned_dept: case_.department,
            priority: case_.priority,
            sla: (case_.sla as Record<string, unknown>)?.duration,
            assignment_notes: case_.assignmentNotes,

            // Attachments - in FileUpload component format
            attachments: transformedAttachments,
          };

          setInitialData(formData);
        }
      } catch (error) {
        console.error("Error fetching grievance:", error);
        toast({
          title: "Error",
          description: "Failed to load grievance data",
          variant: "destructive",
        });
        navigate("/admin/grievances");
      } finally {
        setLoading(false);
      }
    };

    fetchGrievance();
  }, [id, isEdit, navigate, toast]);

  const steps = [
    {
      id: "citizen-info",
      title: "Citizen Information",
      description: "Basic details of the person filing the grievance",
      component: CitizenInfoStep,
      required: true,
      validation: (data: Record<string, unknown>) => {
        const errors = [];
        if (!data.citizen_name) errors.push("Citizen name is required");
        if (!data.mobile) errors.push("Mobile number is required");
        if (!data.address) errors.push("Address is required");
        if (!data.district) errors.push("District is required");
        if (!data.mandal) errors.push("Mandal is required");
        if (!data.ward) errors.push("Ward is required");
        return errors.length > 0 ? errors : null;
      },
    },
    {
      id: "grievance-details",
      title: "Grievance Details",
      description: "Specific information about the grievance",
      component: GrievanceDetailsStep,
      required: true,
      validation: (data: Record<string, unknown>) => {
        const errors = [];
        if (!data.category) errors.push("Category is required");
        if (!data.subcategory) errors.push("Subcategory is required");
        if (!data.description) errors.push("Description is required");
        const description = data.description as string;
        if (description && description.length < 500) {
          errors.push("Description must be at least 500 characters");
        }
        return errors.length > 0 ? errors : null;
      },
    },
    {
      id: "assignment",
      title: "Assignment & Routing",
      description: "Assign to officers and set priorities",
      component: AssignmentStep,
      required: false,
    },
  ];

  const handleSubmit = async (
    data: Record<string, unknown>,
    isDraft = false
  ) => {
    try {
      if (isEdit && id) {
        // Update existing grievance
        const updateData: Record<string, unknown> = {
          citizenName: String(data.citizen_name || ""),
          citizenContact: {
            phone: String(data.mobile || ""),
            email: String(data.email || ""),
            address: String(data.address || ""),
          },
          mobile: String(data.mobile || ""),
          category: String(data.category || ""),
          description: String(data.description || ""),
          place: String(
            data.incident_place || data.location || data.address || ""
          ),
          time: data.incident_date
            ? new Date(String(data.incident_date)).toISOString()
            : null,
          department: String(
            data.assigned_dept || data.department || "General"
          ),
          priority: String(data.priority || "P3"),
          assignmentNotes: String(
            data.assignment_notes || data.progress_notes || ""
          ),
          district: String(data.district || ""),
          mandal: String(data.mandal || ""),
          ward: String(data.ward || ""),
          pincode: String(data.pincode || ""),
        };

        // Add assignedTo if available
        if (data.assigned_to) {
          updateData.assignedTo = String(data.assigned_to);
        }

        // Add SLA if available
        if (data.sla) {
          updateData.sla = {
            duration: String(data.sla),
          };
        }

        const response = await casesAPI.update(id, updateData);

        if (response.success) {
          toast({
            title: "Success",
            description: "Grievance updated successfully",
          });
          navigate(`/admin/grievances/${id}`);
        }
      } else {
        // Create new grievance
        // Prepare assignment object with only defined values
        const assignment: Record<string, string> = {
          department: String(
            data.assigned_dept || data.department || "General"
          ),
          priority: String(data.priority || "P3"),
          sla: String(data.sla || "48h"),
          notes: String(data.assignment_notes || data.progress_notes || ""),
        };

        // Prepare attachments array (should be array of file URLs, not File objects)
        const attachments = Array.isArray(data.attachments)
          ? (data.attachments as Array<{ url?: string; name?: string }>)
              .filter((f) => f.url)
              .map((f) => f.url)
          : [];

        // Prepare case data for backend
        const caseData = {
          module: "grievance",
          details: {
            citizenName: String(data.citizen_name || ""),
            mobile: String(data.mobile || ""),
            email: String(data.email || ""),
            address: String(data.address || ""),
            district: String(data.district || ""),
            mandal: String(data.mandal || ""),
            ward: String(data.ward || ""),
            pincode: String(data.pincode || ""),
            category: String(data.category || ""),
            subcategory: String(data.subcategory || ""),
            description: String(data.description || ""),
            place: String(
              data.incident_place || data.location || data.address || ""
            ),
            time: String(data.incident_date || new Date().toISOString()),
            reason: String(data.category || ""),
            attachments,
          },
          assignment,
        };

        if (isDraft) {
          // TODO: Implement draft saving
          toast({
            title: "Draft Saved",
            description: "Your grievance has been saved as draft",
          });
        } else {
          const response = await casesAPI.createTask(caseData);

          if (response.success) {
            toast({
              title: "Success",
              description: `Grievance created successfully with ID: ${response.data.caseId}`,
            });
            navigate("/admin/grievances");
          }
        }
      }
    } catch (error) {
      console.error("Error submitting grievance:", error);
      const axiosError = error as {
        response?: { data?: { error?: string } };
        message?: string;
      };
      const errorMessage =
        axiosError?.response?.data?.error ||
        axiosError?.message ||
        "Failed to submit grievance";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    navigate("/admin/grievances");
  };

  // Show loading state while fetching data in edit mode
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading grievance data...</p>
        </div>
      </div>
    );
  }

  // In edit mode, wait for initial data to load
  if (isEdit && !initialData) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">
          {isEdit ? "Edit Grievance" : "New Grievance"}
        </h1>
      </div>

      <RecordForm
        steps={steps}
        initialData={initialData || {}}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        title={isEdit ? "Edit Grievance" : "Create New Grievance"}
        allowDraft={!isEdit}
      />
    </div>
  );
}
