import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Church, ArrowLeft, ArrowRight, Send, Loader2 } from "lucide-react";
import { templesAPI } from "@/lib/api";

interface TempleFormState {
  // Applicant Information
  applicantName: string;
  mobile: string;
  email: string;
  address: string;
  aadhaarNumber: string;

  // Temple Details
  templeName: string;
  darshanType: string;
  preferredDate: string;
  numberOfPeople: number;

  // Location Details
  district: string;
  mandal: string;
  ward: string;
  pincode: string;

  // Additional Information
  purpose: string;
  remarks: string;
}

interface TempleLetterFormProps {
  onBack: () => void;
  onSubmit?: () => void;
}

export function TempleLetterForm({ onBack, onSubmit }: TempleLetterFormProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<TempleFormState>({
    applicantName: "",
    mobile: "",
    email: "",
    address: "",
    aadhaarNumber: "",
    templeName: "",
    darshanType: "GENERAL",
    preferredDate: "",
    numberOfPeople: 1,
    district: "",
    mandal: "",
    ward: "",
    pincode: "",
    purpose: "",
    remarks: "",
  });

  const temples = [
    "Sri Venkateswara Swamy - Tirumala",
    "Sri Durga Malleswara Swamy - Vijayawada",
    "Sri Kanaka Durga - Vijayawada",
    "Sri Simhachalam - Visakhapatnam",
    "Sri Annavaram Satyanarayana Swamy",
    "Sri Srisailam Mallikarjuna Swamy",
    "Sri Bhadrachalam Sri Rama",
    "Other",
  ];

  const darshanTypes = [
    { value: "VIP", label: "VIP Darshan" },
    { value: "GENERAL", label: "General Darshan" },
    { value: "SPECIAL", label: "Special Darshan" },
    { value: "DIVYA_DARSHAN", label: "Divya Darshan" },
    { value: "SARVA_DARSHAN", label: "Sarva Darshan" },
  ];

  const handleNext = () => {
    // Validation for step 1
    if (step === 1) {
      if (!formData.applicantName || !formData.mobile) {
        toast({
          title: "Missing Information",
          description: "Please fill in your name and mobile number",
          variant: "destructive",
        });
        return;
      }
      if (!/^\d{10}$/.test(formData.mobile)) {
        toast({
          title: "Invalid Mobile",
          description: "Mobile number must be 10 digits",
          variant: "destructive",
        });
        return;
      }
    }

    // Validation for step 2
    if (step === 2) {
      if (
        !formData.templeName ||
        !formData.darshanType ||
        !formData.preferredDate
      ) {
        toast({
          title: "Missing Information",
          description:
            "Please fill in temple name, darshan type, and preferred date",
          variant: "destructive",
        });
        return;
      }
    }

    // Validation for step 3
    if (step === 3) {
      if (!formData.district) {
        toast({
          title: "Missing Information",
          description: "Please provide district information",
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
      const templeData = {
        applicantName: formData.applicantName,
        mobile: formData.mobile,
        email: formData.email || undefined,
        address: formData.address || undefined,
        aadhaarNumber: formData.aadhaarNumber || undefined,
        templeName: formData.templeName,
        darshanType: formData.darshanType as
          | "VIP"
          | "GENERAL"
          | "SPECIAL"
          | "DIVYA_DARSHAN"
          | "SARVA_DARSHAN",
        preferredDate: new Date(formData.preferredDate),
        numberOfPeople: formData.numberOfPeople,
        district: formData.district || undefined,
        mandal: formData.mandal || undefined,
        ward: formData.ward || undefined,
        pincode: formData.pincode || undefined,
        purpose: formData.purpose || undefined,
        remarks: formData.remarks || undefined,
        status: "REQUESTED" as const,
      };

      await templesAPI.create(templeData);

      toast({
        title: "Success",
        description:
          "Your temple darshan letter request has been submitted successfully!",
      });

      // Call onSubmit callback if provided
      if (onSubmit) {
        onSubmit();
      }

      // Reset form
      setFormData({
        applicantName: "",
        mobile: "",
        email: "",
        address: "",
        aadhaarNumber: "",
        templeName: "",
        darshanType: "GENERAL",
        preferredDate: "",
        numberOfPeople: 1,
        district: "",
        mandal: "",
        ward: "",
        pincode: "",
        purpose: "",
        remarks: "",
      });
      setStep(1);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Failed to submit temple letter request";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (
    field: keyof TempleFormState,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Church className="h-5 w-5" />
            Temple Darshan Letter Request
          </CardTitle>
          <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
            <span>
              Step {step} of {totalSteps}
            </span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="mt-2" />
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Applicant Information */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Applicant Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="applicantName">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="applicantName"
                    value={formData.applicantName}
                    onChange={(e) =>
                      updateFormData("applicantName", e.target.value)
                    }
                    placeholder="Enter full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile">
                    Mobile Number <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="mobile"
                    value={formData.mobile}
                    onChange={(e) => updateFormData("mobile", e.target.value)}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    placeholder="Enter email address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aadhaarNumber">Aadhaar Number</Label>
                  <Input
                    id="aadhaarNumber"
                    value={formData.aadhaarNumber}
                    onChange={(e) =>
                      updateFormData("aadhaarNumber", e.target.value)
                    }
                    placeholder="12-digit Aadhaar number"
                    maxLength={12}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => updateFormData("address", e.target.value)}
                  placeholder="Enter full address"
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Step 2: Temple Details */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Temple & Darshan Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="templeName">
                    Temple Name <span className="text-destructive">*</span>
                  </Label>
                  <select
                    id="templeName"
                    value={formData.templeName}
                    onChange={(e) =>
                      updateFormData("templeName", e.target.value)
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Select temple</option>
                    {temples.map((temple) => (
                      <option key={temple} value={temple}>
                        {temple}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="darshanType">
                    Darshan Type <span className="text-destructive">*</span>
                  </Label>
                  <select
                    id="darshanType"
                    value={formData.darshanType}
                    onChange={(e) =>
                      updateFormData("darshanType", e.target.value)
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {darshanTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredDate">
                    Preferred Date <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="preferredDate"
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) =>
                      updateFormData("preferredDate", e.target.value)
                    }
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numberOfPeople">Number of People</Label>
                  <Input
                    id="numberOfPeople"
                    type="number"
                    value={formData.numberOfPeople}
                    onChange={(e) =>
                      updateFormData(
                        "numberOfPeople",
                        parseInt(e.target.value) || 1
                      )
                    }
                    min={1}
                    max={10}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose of Visit</Label>
                <Textarea
                  id="purpose"
                  value={formData.purpose}
                  onChange={(e) => updateFormData("purpose", e.target.value)}
                  placeholder="e.g., Festival, Special Occasion, Regular Darshan"
                  rows={2}
                />
              </div>
            </div>
          )}

          {/* Step 3: Location Details */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Location Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="district">
                    District <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) => updateFormData("district", e.target.value)}
                    placeholder="Enter district"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mandal">Mandal</Label>
                  <Input
                    id="mandal"
                    value={formData.mandal}
                    onChange={(e) => updateFormData("mandal", e.target.value)}
                    placeholder="Enter mandal"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ward">Ward</Label>
                  <Input
                    id="ward"
                    value={formData.ward}
                    onChange={(e) => updateFormData("ward", e.target.value)}
                    placeholder="Enter ward number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) => updateFormData("pincode", e.target.value)}
                    placeholder="Enter pincode"
                    maxLength={6}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="remarks">Additional Remarks</Label>
                <Textarea
                  id="remarks"
                  value={formData.remarks}
                  onChange={(e) => updateFormData("remarks", e.target.value)}
                  placeholder="Any additional information or special requests"
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Review Your Request</h3>

              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <div className="border-b pb-3">
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                    Applicant Information
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Name:</span>{" "}
                      {formData.applicantName}
                    </div>
                    <div>
                      <span className="font-medium">Mobile:</span>{" "}
                      {formData.mobile}
                    </div>
                    {formData.email && (
                      <div>
                        <span className="font-medium">Email:</span>{" "}
                        {formData.email}
                      </div>
                    )}
                    {formData.aadhaarNumber && (
                      <div>
                        <span className="font-medium">Aadhaar:</span>{" "}
                        {formData.aadhaarNumber}
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
                    Temple & Darshan Details
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Temple:</span>{" "}
                      {formData.templeName}
                    </div>
                    <div>
                      <span className="font-medium">Darshan Type:</span>{" "}
                      {
                        darshanTypes.find(
                          (t) => t.value === formData.darshanType
                        )?.label
                      }
                    </div>
                    <div>
                      <span className="font-medium">Preferred Date:</span>{" "}
                      {new Date(formData.preferredDate).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Number of People:</span>{" "}
                      {formData.numberOfPeople}
                    </div>
                  </div>
                  {formData.purpose && (
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Purpose:</span>{" "}
                      {formData.purpose}
                    </div>
                  )}
                </div>

                <div className="border-b pb-3">
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                    Location Details
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
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
                  {formData.remarks && (
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Remarks:</span>{" "}
                      {formData.remarks}
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
                    Submit Request
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
