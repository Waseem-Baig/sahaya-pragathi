import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
import { ArrowLeft, ArrowRight, Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { appointmentAPI } from "@/lib/api";
import { FileUpload } from "@/components/shared/FileUpload";

interface AppointmentFormData {
  // Applicant Information
  applicantName: string;
  mobile: string;
  email?: string;
  aadhaar?: string;
  address?: string;
  district?: string;
  mandal?: string;
  village?: string;
  constituency?: string;
  // Appointment Details
  purpose: string;
  category?: string;
  description?: string;
  urgencyLevel?: string;
  // Scheduling
  preferredDate?: string;
  preferredTime?: string;
  alternativeDate?: string;
  alternativeTime?: string;
  estimatedDuration?: number;
  // Additional Info
  attendees?: string;
  agenda?: string;
  // Documents
  attachments?: Array<{
    filename: string;
    url: string;
    fileType: string;
    uploadedAt: Date;
  }>;
  internalNotes?: string;
}

export default function AppointmentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [existingAttachments, setExistingAttachments] = useState<
    Array<{ filename: string; url: string }>
  >([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AppointmentFormData>();

  const isEditMode = !!id;

  const handleFilesChange = useCallback((newFiles: File[]) => {
    setFiles(newFiles);
  }, []);

  const fetchAppointmentData = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await appointmentAPI.getById(id);

      if (response.success && response.data) {
        const appointment = response.data;

        // Map backend data to form fields
        setValue("applicantName", appointment.applicantName as string);
        setValue("mobile", appointment.mobile as string);
        setValue("email", appointment.email as string);
        setValue("aadhaar", appointment.aadhaar as string);
        setValue("address", appointment.address as string);
        setValue("district", appointment.district as string);
        setValue("mandal", appointment.mandal as string);
        setValue("village", appointment.village as string);
        setValue("constituency", appointment.constituency as string);
        setValue("purpose", appointment.purpose as string);
        setValue("category", appointment.category as string);
        setValue("description", appointment.description as string);
        setValue("urgencyLevel", appointment.urgencyLevel as string);

        // Format dates for input fields
        if (appointment.preferredDate) {
          const date = new Date(appointment.preferredDate as string);
          setValue("preferredDate", date.toISOString().split("T")[0]);
        }
        if (appointment.alternativeDate) {
          const date = new Date(appointment.alternativeDate as string);
          setValue("alternativeDate", date.toISOString().split("T")[0]);
        }

        setValue("preferredTime", appointment.preferredTime as string);
        setValue("alternativeTime", appointment.alternativeTime as string);
        setValue("estimatedDuration", appointment.estimatedDuration as number);

        // Additional info
        if (appointment.attendees && Array.isArray(appointment.attendees)) {
          setValue("attendees", appointment.attendees.join(", "));
        }
        setValue("agenda", appointment.agenda as string);
        setValue("internalNotes", appointment.internalNotes as string);

        // Set existing attachments
        if (appointment.attachments) {
          setExistingAttachments(
            appointment.attachments as Array<{ filename: string; url: string }>
          );
        }
      }
    } catch (error) {
      console.error("Error fetching appointment:", error);
      toast({
        title: "Error",
        description: "Failed to load appointment data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [id, setValue, toast]);

  useEffect(() => {
    if (isEditMode) {
      fetchAppointmentData();
    }
  }, [isEditMode, fetchAppointmentData]);

  const onSubmit = async (data: AppointmentFormData) => {
    try {
      setLoading(true);

      // Convert attendees string to array
      const attendeesArray = data.attendees
        ? data.attendees.split(",").map((a) => a.trim())
        : [];

      const payload = {
        applicantName: data.applicantName,
        mobile: data.mobile,
        purpose: data.purpose,
        email: data.email,
        aadhaar: data.aadhaar,
        address: data.address,
        district: data.district,
        mandal: data.mandal,
        village: data.village,
        constituency: data.constituency,
        category: data.category,
        description: data.description,
        urgencyLevel: data.urgencyLevel,
        preferredDate: data.preferredDate,
        preferredTime: data.preferredTime,
        alternativeDate: data.alternativeDate,
        alternativeTime: data.alternativeTime,
        estimatedDuration: data.estimatedDuration
          ? Number(data.estimatedDuration)
          : undefined,
        attendees: attendeesArray,
        agenda: data.agenda,
        internalNotes: data.internalNotes,
      };

      let response;
      if (isEditMode) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        response = await appointmentAPI.update(id!, payload as any);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        response = await appointmentAPI.create(payload as any);
      }

      if (response.success) {
        toast({
          title: "Success",
          description: `Appointment ${
            isEditMode ? "updated" : "created"
          } successfully`,
        });
        navigate("/admin/appointments");
      } else {
        throw new Error(response.message || "Failed to save appointment");
      }
    } catch (error) {
      console.error("Error saving appointment:", error);
      toast({
        title: "Error",
        description: `Failed to ${
          isEditMode ? "update" : "create"
        } appointment`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: "Applicant Information",
      description: "Basic details of the applicant",
    },
    {
      title: "Appointment Details",
      description: "Purpose and details of the meeting",
    },
    {
      title: "Scheduling",
      description: "Preferred date and time",
    },
    {
      title: "Additional Information",
      description: "Attendees and agenda",
    },
    {
      title: "Documents & Notes",
      description: "Upload documents and add notes",
    },
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="applicantName">
                  Applicant Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="applicantName"
                  {...register("applicantName", {
                    required: "Applicant name is required",
                  })}
                  placeholder="Enter full name"
                />
                {errors.applicantName && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.applicantName.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="mobile">
                  Mobile Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="mobile"
                  {...register("mobile", {
                    required: "Mobile number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Please enter a valid 10-digit mobile number",
                    },
                  })}
                  placeholder="10-digit mobile number"
                />
                {errors.mobile && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.mobile.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="Email address"
                />
              </div>

              <div>
                <Label htmlFor="aadhaar">Aadhaar Number</Label>
                <Input
                  id="aadhaar"
                  {...register("aadhaar")}
                  placeholder="12-digit Aadhaar number"
                  maxLength={12}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                {...register("address")}
                placeholder="Complete address"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="district">District</Label>
                <Input
                  id="district"
                  {...register("district")}
                  placeholder="District name"
                />
              </div>

              <div>
                <Label htmlFor="mandal">Mandal</Label>
                <Input
                  id="mandal"
                  {...register("mandal")}
                  placeholder="Mandal name"
                />
              </div>

              <div>
                <Label htmlFor="village">Village</Label>
                <Input
                  id="village"
                  {...register("village")}
                  placeholder="Village name"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="constituency">Constituency</Label>
              <Input
                id="constituency"
                {...register("constituency")}
                placeholder="Constituency name"
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="purpose">
                Purpose of Appointment{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="purpose"
                {...register("purpose", {
                  required: "Purpose is required",
                })}
                placeholder="Brief purpose of the meeting"
              />
              {errors.purpose && (
                <p className="text-sm text-destructive mt-1">
                  {errors.purpose.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={watch("category")}
                  onValueChange={(value) => setValue("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERSONAL_GRIEVANCE">
                      Personal Grievance
                    </SelectItem>
                    <SelectItem value="PROJECT_DISCUSSION">
                      Project Discussion
                    </SelectItem>
                    <SelectItem value="COMMUNITY_ISSUE">
                      Community Issue
                    </SelectItem>
                    <SelectItem value="BUSINESS_PROPOSAL">
                      Business Proposal
                    </SelectItem>
                    <SelectItem value="GENERAL_MEETING">
                      General Meeting
                    </SelectItem>
                    <SelectItem value="VIP_MEETING">VIP Meeting</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="urgencyLevel">Urgency Level</Label>
                <Select
                  value={watch("urgencyLevel")}
                  onValueChange={(value) => setValue("urgencyLevel", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Detailed Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Provide detailed description of the purpose"
                rows={5}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="preferredDate">Preferred Date</Label>
                <Input
                  id="preferredDate"
                  type="date"
                  {...register("preferredDate")}
                />
              </div>

              <div>
                <Label htmlFor="preferredTime">Preferred Time</Label>
                <Input
                  id="preferredTime"
                  type="time"
                  {...register("preferredTime")}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="alternativeDate">Alternative Date</Label>
                <Input
                  id="alternativeDate"
                  type="date"
                  {...register("alternativeDate")}
                />
              </div>

              <div>
                <Label htmlFor="alternativeTime">Alternative Time</Label>
                <Input
                  id="alternativeTime"
                  type="time"
                  {...register("alternativeTime")}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="estimatedDuration">
                Estimated Duration (minutes)
              </Label>
              <Input
                id="estimatedDuration"
                type="number"
                {...register("estimatedDuration")}
                placeholder="E.g., 30"
                min="15"
                step="15"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="attendees">Attendees</Label>
              <Input
                id="attendees"
                {...register("attendees")}
                placeholder="Comma-separated names (e.g., John Doe, Jane Smith)"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Enter names separated by commas
              </p>
            </div>

            <div>
              <Label htmlFor="agenda">Meeting Agenda</Label>
              <Textarea
                id="agenda"
                {...register("agenda")}
                placeholder="Outline the meeting agenda or topics to be discussed"
                rows={5}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <Label>Supporting Documents</Label>
              <FileUpload
                onFilesChange={handleFilesChange}
                maxFiles={10}
                maxSizePerFile={10 * 1024 * 1024}
                acceptedTypes={[
                  "application/pdf",
                  "image/jpeg",
                  "image/png",
                  "application/msword",
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                ]}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Upload supporting documents (PDF, JPG, PNG, DOC, DOCX - Max 10MB
                each)
              </p>
            </div>

            {existingAttachments.length > 0 && (
              <div>
                <Label>Existing Attachments</Label>
                <div className="space-y-2 mt-2">
                  {existingAttachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <span className="text-sm">{attachment.filename}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(attachment.url, "_blank")}
                      >
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="internalNotes">Internal Notes</Label>
              <Textarea
                id="internalNotes"
                {...register("internalNotes")}
                placeholder="Internal notes (not visible to applicant)"
                rows={4}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/admin/appointments")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to List
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditMode ? "Edit Appointment" : "New Appointment Request"}
        </h1>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex-1 ${
              index !== steps.length - 1 ? "border-r-2" : ""
            } ${
              index <= currentStep
                ? "border-primary"
                : "border-muted-foreground/20"
            }`}
          >
            <div className="flex flex-col items-center px-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-2 ${
                  index <= currentStep
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {index + 1}
              </div>
              <div className="text-center">
                <p
                  className={`text-xs font-medium ${
                    index <= currentStep
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.title}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep].title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {steps[currentStep].description}
            </p>
          </CardHeader>
          <CardContent>{renderStep()}</CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button
              type="button"
              onClick={() =>
                setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))
              }
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditMode ? "Update" : "Submit"} Appointment
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
