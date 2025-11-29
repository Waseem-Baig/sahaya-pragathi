import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Progress } from "@/components/ui/progress";
import { Calendar, ArrowLeft, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { appointmentAPI } from "@/lib/api";

interface AppointmentBookingFormProps {
  onBack: () => void;
}

interface AppointmentFormState {
  // Applicant Information
  applicantName: string;
  fatherOrHusbandName?: string;
  age?: number;
  gender?: "Male" | "Female" | "Other";
  mobile: string;
  email?: string;
  aadhaarNumber?: string;
  address?: string;
  district?: string;
  mandal?: string;
  ward?: string;
  pincode?: string;
  // Appointment Details
  purpose: string;
  category?:
    | "PERSONAL_GRIEVANCE"
    | "PROJECT_DISCUSSION"
    | "COMMUNITY_ISSUE"
    | "BUSINESS_PROPOSAL"
    | "GENERAL_MEETING"
    | "VIP_MEETING"
    | "OTHER";
  detailedDescription?: string;
  urgency?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  // Scheduling
  preferredDate?: string;
  preferredTime?: string;
  alternativeDate?: string;
  alternativeTime?: string;
  duration?: number;
  // Attendees
  attendees?: string;
}

export const AppointmentBookingForm = ({
  onBack,
}: AppointmentBookingFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AppointmentFormState>({
    applicantName: "",
    mobile: "",
    purpose: "",
    category: "GENERAL_MEETING",
    urgency: "MEDIUM" as "LOW" | "MEDIUM" | "HIGH" | "URGENT",
  });

  const handleSubmit = async () => {
    // Validation
    if (!formData.applicantName || !formData.mobile || !formData.purpose) {
      toast({
        title: "Validation Error",
        description:
          "Please fill in all required fields (Name, Mobile, Purpose)",
        variant: "destructive",
      });
      return;
    }

    // Validate mobile number
    if (!/^[0-9]{10}$/.test(formData.mobile)) {
      toast({
        title: "Invalid Mobile",
        description: "Please enter a valid 10-digit mobile number",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // Process attendees string to array
      const attendeesArray = formData.attendees
        ? formData.attendees
            .split(",")
            .map((a) => a.trim())
            .filter(Boolean)
        : [];

      const appointmentData = {
        applicantName: formData.applicantName,
        fatherOrHusbandName: formData.fatherOrHusbandName,
        age: formData.age,
        gender: formData.gender,
        mobile: formData.mobile,
        email: formData.email,
        aadhaar: formData.aadhaarNumber,
        address: formData.address,
        district: formData.district,
        mandal: formData.mandal,
        ward: formData.ward,
        pincode: formData.pincode,
        purpose: formData.purpose,
        category: formData.category,
        description: formData.detailedDescription,
        urgencyLevel: formData.urgency,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        alternativeDate: formData.alternativeDate,
        alternativeTime: formData.alternativeTime,
        estimatedDuration: formData.duration,
        attendees: attendeesArray,
        status: "REQUESTED" as const,
      };

      const response = await appointmentAPI.create(appointmentData);

      if (response.success) {
        toast({
          title: "Success",
          description: `Appointment booked successfully! ID: ${
            response.data?.appointmentId || "N/A"
          }`,
        });
        onBack();
      } else {
        throw new Error(response.message || "Failed to book appointment");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to book appointment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (
    field: keyof AppointmentFormState,
    value: string | number | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Appointment Booking
          </CardTitle>
          <Progress value={100} className="w-full" />
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Personal Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="applicantName">Full Name *</Label>
                <Input
                  id="applicantName"
                  value={formData.applicantName}
                  onChange={(e) =>
                    updateFormData("applicantName", e.target.value)
                  }
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="fatherOrHusbandName">Father/Husband Name</Label>
                <Input
                  id="fatherOrHusbandName"
                  value={formData.fatherOrHusbandName || ""}
                  onChange={(e) =>
                    updateFormData("fatherOrHusbandName", e.target.value)
                  }
                  placeholder="Father's or husband's name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="mobile">Mobile Number *</Label>
                <Input
                  id="mobile"
                  value={formData.mobile}
                  onChange={(e) => updateFormData("mobile", e.target.value)}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <Label htmlFor="aadhaarNumber">Aadhaar Number</Label>
                <Input
                  id="aadhaarNumber"
                  value={formData.aadhaarNumber || ""}
                  onChange={(e) =>
                    updateFormData("aadhaarNumber", e.target.value)
                  }
                  placeholder="12-digit Aadhaar"
                  maxLength={12}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age || ""}
                  onChange={(e) =>
                    updateFormData(
                      "age",
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                  placeholder="Age"
                  min="1"
                  max="120"
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select
                  onValueChange={(value) =>
                    updateFormData(
                      "gender",
                      value as "Male" | "Female" | "Other"
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              Address Details
            </h3>

            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address || ""}
                onChange={(e) => updateFormData("address", e.target.value)}
                placeholder="House/Flat No, Street, Area..."
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="district">District</Label>
                <Input
                  id="district"
                  value={formData.district || ""}
                  onChange={(e) => updateFormData("district", e.target.value)}
                  placeholder="District"
                />
              </div>
              <div>
                <Label htmlFor="mandal">Mandal</Label>
                <Input
                  id="mandal"
                  value={formData.mandal || ""}
                  onChange={(e) => updateFormData("mandal", e.target.value)}
                  placeholder="Mandal"
                />
              </div>
              <div>
                <Label htmlFor="ward">Ward</Label>
                <Input
                  id="ward"
                  value={formData.ward || ""}
                  onChange={(e) => updateFormData("ward", e.target.value)}
                  placeholder="Ward"
                />
              </div>
              <div>
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  value={formData.pincode || ""}
                  onChange={(e) => updateFormData("pincode", e.target.value)}
                  placeholder="6-digit pincode"
                  maxLength={6}
                />
              </div>
            </div>
          </div>

          {/* Appointment Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              Appointment Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    updateFormData(
                      "category",
                      value as AppointmentFormState["category"]
                    )
                  }
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
                <Label htmlFor="urgency">Urgency Level</Label>
                <Select
                  value={formData.urgency}
                  onValueChange={(value) =>
                    updateFormData(
                      "urgency",
                      value as AppointmentFormState["urgency"]
                    )
                  }
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
              <Label htmlFor="purpose">Purpose of Meeting *</Label>
              <Input
                id="purpose"
                value={formData.purpose}
                onChange={(e) => updateFormData("purpose", e.target.value)}
                placeholder="Brief purpose (e.g., Discuss welfare scheme, Submit petition)"
                required
              />
            </div>

            <div>
              <Label htmlFor="detailedDescription">Detailed Description</Label>
              <Textarea
                id="detailedDescription"
                value={formData.detailedDescription || ""}
                onChange={(e) =>
                  updateFormData("detailedDescription", e.target.value)
                }
                placeholder="Provide detailed description of the matter you want to discuss..."
                rows={4}
              />
            </div>
          </div>

          {/* Scheduling Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              Preferred Schedule
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="preferredDate">Preferred Date</Label>
                <Input
                  id="preferredDate"
                  type="date"
                  value={formData.preferredDate || ""}
                  onChange={(e) =>
                    updateFormData("preferredDate", e.target.value)
                  }
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div>
                <Label htmlFor="preferredTime">Preferred Time</Label>
                <Input
                  id="preferredTime"
                  type="time"
                  value={formData.preferredTime || ""}
                  onChange={(e) =>
                    updateFormData("preferredTime", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="alternativeDate">Alternative Date</Label>
                <Input
                  id="alternativeDate"
                  type="date"
                  value={formData.alternativeDate || ""}
                  onChange={(e) =>
                    updateFormData("alternativeDate", e.target.value)
                  }
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div>
                <Label htmlFor="alternativeTime">Alternative Time</Label>
                <Input
                  id="alternativeTime"
                  type="time"
                  value={formData.alternativeTime || ""}
                  onChange={(e) =>
                    updateFormData("alternativeTime", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Expected Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration || ""}
                  onChange={(e) =>
                    updateFormData(
                      "duration",
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                  placeholder="e.g., 30"
                  min="15"
                  max="180"
                />
              </div>
              <div>
                <Label htmlFor="attendees">
                  Other Attendees (comma-separated)
                </Label>
                <Input
                  id="attendees"
                  value={formData.attendees || ""}
                  onChange={(e) => updateFormData("attendees", e.target.value)}
                  placeholder="e.g., John Doe, Jane Smith"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t">
            <Button
              onClick={onBack}
              variant="outline"
              className="flex items-center gap-2"
              disabled={loading}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>

            <Button
              onClick={handleSubmit}
              className="flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Booking...
                </>
              ) : (
                <>
                  Book Appointment
                  <Send className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
