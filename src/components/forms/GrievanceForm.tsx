import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { FileText, ArrowLeft, ArrowRight, Send, Loader2 } from "lucide-react";
import { casesAPI } from "@/lib/api";

interface GrievanceFormState {
  // Citizen Information
  citizenName: string;
  phone: string;
  email: string;
  address: string;

  // Case Details
  subject: string;
  description: string;
  category: string;
  mobile: string;

  // Location Details
  department: string;
  district: string;
  mandal: string;
  ward: string;
  pincode: string;
  place: string;

  // Priority
  priority: string;
}

interface GrievanceFormProps {
  onBack: () => void;
  onSubmit?: () => void;
}

export const GrievanceForm = ({ onBack, onSubmit }: GrievanceFormProps) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<GrievanceFormState>({
    citizenName: "",
    phone: "",
    email: "",
    address: "",
    subject: "",
    description: "",
    category: "",
    mobile: "",
    department: "",
    district: "",
    mandal: "",
    ward: "",
    pincode: "",
    place: "",
    priority: "P3",
  });

  const categories = [
    "Water Supply",
    "Roads & Transport",
    "Electricity",
    "Healthcare",
    "Education",
    "Revenue",
    "Police",
    "Agriculture",
    "Sanitation",
    "Public Services",
    "Social Welfare",
    "Other",
  ];

  const departments = [
    "Revenue",
    "Municipal Administration",
    "Panchayat Raj",
    "Rural Development",
    "Health & Family Welfare",
    "Education",
    "Police",
    "Electricity",
    "Water Resources",
    "Agriculture",
    "Social Welfare",
    "Transport",
    "Other",
  ];

  const handleNext = () => {
    // Validation for step 1
    if (step === 1) {
      if (!formData.citizenName || !formData.phone) {
        toast({
          title: "Missing Information",
          description: "Please fill in your name and phone number",
          variant: "destructive",
        });
        return;
      }
      if (!/^\d{10}$/.test(formData.phone)) {
        toast({
          title: "Invalid Phone",
          description: "Phone number must be 10 digits",
          variant: "destructive",
        });
        return;
      }
    }

    // Validation for step 2
    if (step === 2) {
      if (!formData.subject || !formData.description || !formData.category) {
        toast({
          title: "Missing Information",
          description: "Please fill in subject, description, and category",
          variant: "destructive",
        });
        return;
      }
    }

    // Validation for step 3
    if (step === 3) {
      if (!formData.department || !formData.district) {
        toast({
          title: "Missing Information",
          description: "Please select department and district",
          variant: "destructive",
        });
        return;
      }
    }

    setStep(step + 1);
  };

  const handlePrevious = () => setStep(step - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const caseData = {
        caseType: "grievance",
        citizenName: formData.citizenName,
        citizenContact: {
          phone: formData.phone,
          email: formData.email || undefined,
          address: formData.address || undefined,
        },
        subject: formData.subject,
        description: formData.description,
        category: formData.category,
        mobile: formData.mobile || formData.phone,
        department: formData.department,
        district: formData.district || undefined,
        mandal: formData.mandal || undefined,
        ward: formData.ward || undefined,
        pincode: formData.pincode || undefined,
        place: formData.place || undefined,
        priority: formData.priority,
        status: "pending",
      };

      const response = await casesAPI.create(caseData);

      toast({
        title: "Success",
        description: "Your grievance has been submitted successfully!",
      });

      // Call onSubmit callback if provided
      if (onSubmit) {
        onSubmit();
      }

      // Reset form
      setFormData({
        citizenName: "",
        phone: "",
        email: "",
        address: "",
        subject: "",
        description: "",
        category: "",
        mobile: "",
        department: "",
        district: "",
        mandal: "",
        ward: "",
        pincode: "",
        place: "",
        priority: "P3",
      });
      setStep(1);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Failed to submit grievance";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: keyof GrievanceFormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Submit Grievance
          </CardTitle>
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground">
            Step {step} of {totalSteps}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="citizenName">Full Name *</Label>
                  <Input
                    id="citizenName"
                    value={formData.citizenName}
                    onChange={(e) =>
                      updateFormData("citizenName", e.target.value)
                    }
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => updateFormData("phone", e.target.value)}
                    placeholder="10-digit phone number"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <Label htmlFor="mobile">Alternate Mobile</Label>
                  <Input
                    id="mobile"
                    value={formData.mobile}
                    onChange={(e) => updateFormData("mobile", e.target.value)}
                    placeholder="Alternate contact number"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => updateFormData("address", e.target.value)}
                  placeholder="Your complete address"
                  rows={2}
                />
              </div>
            </div>
          )}

          {/* Step 2: Grievance Details */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Grievance Details</h3>
              <div>
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => updateFormData("subject", e.target.value)}
                  placeholder="Brief subject of your grievance"
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => updateFormData("category", e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="description">Detailed Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    updateFormData("description", e.target.value)
                  }
                  placeholder="Provide detailed description of your grievance..."
                  rows={6}
                  required
                />
              </div>
            </div>
          )}

          {/* Step 3: Location & Department */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Location & Department Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="department">Department *</Label>
                  <select
                    id="department"
                    value={formData.department}
                    onChange={(e) =>
                      updateFormData("department", e.target.value)
                    }
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    id="priority"
                    value={formData.priority}
                    onChange={(e) => updateFormData("priority", e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  >
                    <option value="P1">P1 - Critical</option>
                    <option value="P2">P2 - High</option>
                    <option value="P3">P3 - Medium</option>
                    <option value="P4">P4 - Low</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="district">District *</Label>
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) => updateFormData("district", e.target.value)}
                    placeholder="District"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="mandal">Mandal</Label>
                  <Input
                    id="mandal"
                    value={formData.mandal}
                    onChange={(e) => updateFormData("mandal", e.target.value)}
                    placeholder="Mandal"
                  />
                </div>
                <div>
                  <Label htmlFor="ward">Ward</Label>
                  <Input
                    id="ward"
                    value={formData.ward}
                    onChange={(e) => updateFormData("ward", e.target.value)}
                    placeholder="Ward"
                  />
                </div>
                <div>
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) => updateFormData("pincode", e.target.value)}
                    placeholder="Pincode"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="place">Specific Place/Location</Label>
                <Input
                  id="place"
                  value={formData.place}
                  onChange={(e) => updateFormData("place", e.target.value)}
                  placeholder="Specific place or location of grievance"
                />
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Review Your Grievance</h3>

              <div className="space-y-4">
                <div className="border-b pb-3">
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Name:</span>{" "}
                      {formData.citizenName}
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span>{" "}
                      {formData.phone}
                    </div>
                    {formData.email && (
                      <div>
                        <span className="font-medium">Email:</span>{" "}
                        {formData.email}
                      </div>
                    )}
                    {formData.mobile && (
                      <div>
                        <span className="font-medium">Alternate:</span>{" "}
                        {formData.mobile}
                      </div>
                    )}
                  </div>
                  {formData.address && (
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Address:</span>{" "}
                      {formData.address}
                    </div>
                  )}
                </div>

                <div className="border-b pb-3">
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                    Grievance Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Subject:</span>{" "}
                      {formData.subject}
                    </div>
                    <div>
                      <span className="font-medium">Category:</span>{" "}
                      {formData.category}
                    </div>
                    <div>
                      <span className="font-medium">Description:</span>
                      <p className="mt-1 text-muted-foreground">
                        {formData.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-b pb-3">
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                    Department & Location
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Department:</span>{" "}
                      {formData.department}
                    </div>
                    <div>
                      <span className="font-medium">Priority:</span>{" "}
                      {formData.priority}
                    </div>
                    <div>
                      <span className="font-medium">District:</span>{" "}
                      {formData.district}
                    </div>
                    {formData.mandal && (
                      <div>
                        <span className="font-medium">Mandal:</span>{" "}
                        {formData.mandal}
                      </div>
                    )}
                    {formData.ward && (
                      <div>
                        <span className="font-medium">Ward:</span>{" "}
                        {formData.ward}
                      </div>
                    )}
                    {formData.pincode && (
                      <div>
                        <span className="font-medium">Pincode:</span>{" "}
                        {formData.pincode}
                      </div>
                    )}
                  </div>
                  {formData.place && (
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Location:</span>{" "}
                      {formData.place}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={step === 1 ? onBack : handlePrevious}
              disabled={loading}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {step === 1 ? "Back to Portal" : "Previous"}
            </Button>

            {step < totalSteps ? (
              <Button onClick={handleNext} disabled={loading}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Grievance
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
