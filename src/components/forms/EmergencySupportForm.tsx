import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, ArrowLeft, Send, Loader2, MapPin } from "lucide-react";
import { emergencyAPI } from "@/lib/api";

interface EmergencyFormState {
  // Applicant Information
  applicantName: string;
  mobile: string;
  email: string;
  aadhaarNumber: string;

  // Emergency Details
  emergencyType: string;
  location: string;
  latitude: string;
  longitude: string;
  description: string;
  urgency: string;

  // Location Details
  district: string;
  mandal: string;
  ward: string;
  landmark: string;
  pincode: string;

  // Additional Information
  numberOfPeopleAffected: string;
  estimatedDamage: string;
  immediateNeedsProvided: string;
}

interface EmergencySupportFormProps {
  onBack: () => void;
  onSubmit?: (data: EmergencyFormData) => void;
}

interface EmergencyFormData {
  emergencyId?: string;
  applicantName: string;
  mobile: string;
  emergencyType: string;
  location: string;
  description: string;
  status?: string;
  [key: string]: unknown;
}

export const EmergencySupportForm = ({
  onBack,
  onSubmit,
}: EmergencySupportFormProps) => {
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<EmergencyFormState>({
    applicantName: "",
    mobile: "",
    email: "",
    aadhaarNumber: "",
    emergencyType: "",
    location: "",
    latitude: "",
    longitude: "",
    description: "",
    urgency: "HIGH",
    district: "",
    mandal: "",
    ward: "",
    landmark: "",
    pincode: "",
    numberOfPeopleAffected: "",
    estimatedDamage: "",
    immediateNeedsProvided: "",
  });

  const handleGetLocation = () => {
    setGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prev) => ({
            ...prev,
            latitude: latitude.toString(),
            longitude: longitude.toString(),
            location:
              prev.location ||
              `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          }));
          toast({
            title: "Location Retrieved",
            description: "GPS coordinates have been captured",
          });
          setGettingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Location Error",
            description:
              "Unable to retrieve GPS location. Please enter manually.",
            variant: "destructive",
          });
          setGettingLocation(false);
        }
      );
    } else {
      toast({
        title: "Not Supported",
        description: "Geolocation is not supported by this browser",
        variant: "destructive",
      });
      setGettingLocation(false);
    }
  };

  const handleSubmit = async () => {
    // Validation
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

    if (!formData.emergencyType) {
      toast({
        title: "Missing Information",
        description: "Please select emergency type",
        variant: "destructive",
      });
      return;
    }

    if (!formData.location || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please provide location and description",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const emergencyData = {
        applicantName: formData.applicantName,
        mobile: formData.mobile,
        email: formData.email || undefined,
        aadhaarNumber: formData.aadhaarNumber || undefined,
        emergencyType: formData.emergencyType as
          | "MEDICAL"
          | "POLICE"
          | "FIRE"
          | "NATURAL_DISASTER"
          | "ACCIDENT"
          | "OTHER",
        location: formData.location,
        gpsCoordinates:
          formData.latitude && formData.longitude
            ? {
                latitude: parseFloat(formData.latitude),
                longitude: parseFloat(formData.longitude),
              }
            : undefined,
        description: formData.description,
        urgency: formData.urgency as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
        district: formData.district || undefined,
        mandal: formData.mandal || undefined,
        ward: formData.ward || undefined,
        landmark: formData.landmark || undefined,
        pincode: formData.pincode || undefined,
        numberOfPeopleAffected: formData.numberOfPeopleAffected
          ? parseInt(formData.numberOfPeopleAffected)
          : undefined,
        estimatedDamage: formData.estimatedDamage || undefined,
        immediateNeedsProvided: formData.immediateNeedsProvided || undefined,
        status: "LOGGED" as const,
        priority: formData.urgency as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
      };

      const response = await emergencyAPI.create(emergencyData);

      toast({
        title: "Emergency Logged",
        description: "Your emergency request has been submitted successfully!",
      });

      // Call onSubmit callback if provided
      if (onSubmit && response?.data) {
        onSubmit(response.data);
      }

      // Reset form
      setFormData({
        applicantName: "",
        mobile: "",
        email: "",
        aadhaarNumber: "",
        emergencyType: "",
        location: "",
        latitude: "",
        longitude: "",
        description: "",
        urgency: "HIGH",
        district: "",
        mandal: "",
        ward: "",
        landmark: "",
        pincode: "",
        numberOfPeopleAffected: "",
        estimatedDamage: "",
        immediateNeedsProvided: "",
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Failed to submit emergency request";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: keyof EmergencyFormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="border-red-200">
        <CardHeader className="bg-red-50">
          <CardTitle className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="h-5 w-5" />
            Emergency Support Request
          </CardTitle>
          <Progress value={100} className="w-full bg-red-100" />
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Emergency Warning */}
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 font-semibold mb-1">
                  🚨 For Immediate Life-Threatening Emergencies
                </p>
                <p className="text-red-700 text-sm">
                  Please call <strong>108 (Ambulance)</strong>,{" "}
                  <strong>100 (Police)</strong>, or <strong>101 (Fire)</strong>{" "}
                  directly
                </p>
              </div>
            </div>
          </div>

          {/* Applicant Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Your Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="applicantName">Your Name *</Label>
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
                <Label htmlFor="mobile">Mobile Number *</Label>
                <Input
                  id="mobile"
                  value={formData.mobile}
                  onChange={(e) => updateFormData("mobile", e.target.value)}
                  placeholder="10-digit mobile number"
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
                <Label htmlFor="aadhaarNumber">Aadhaar Number</Label>
                <Input
                  id="aadhaarNumber"
                  value={formData.aadhaarNumber}
                  onChange={(e) =>
                    updateFormData("aadhaarNumber", e.target.value)
                  }
                  placeholder="12-digit Aadhaar number"
                />
              </div>
            </div>
          </div>

          {/* Emergency Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Emergency Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emergencyType">Emergency Type *</Label>
                <select
                  id="emergencyType"
                  value={formData.emergencyType}
                  onChange={(e) =>
                    updateFormData("emergencyType", e.target.value)
                  }
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  required
                >
                  <option value="">Select Emergency Type</option>
                  <option value="MEDICAL">Medical Emergency</option>
                  <option value="POLICE">Police Assistance</option>
                  <option value="FIRE">Fire Emergency</option>
                  <option value="NATURAL_DISASTER">Natural Disaster</option>
                  <option value="ACCIDENT">Accident</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <Label htmlFor="urgency">Urgency Level</Label>
                <select
                  id="urgency"
                  value={formData.urgency}
                  onChange={(e) => updateFormData("urgency", e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="location">Location *</Label>
              <div className="flex gap-2">
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => updateFormData("location", e.target.value)}
                  placeholder="Describe location or provide address"
                  className="flex-1"
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGetLocation}
                  disabled={gettingLocation}
                  className="whitespace-nowrap"
                >
                  {gettingLocation ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Getting...
                    </>
                  ) : (
                    <>
                      <MapPin className="h-4 w-4 mr-2" />
                      Get GPS
                    </>
                  )}
                </Button>
              </div>
              {formData.latitude && formData.longitude && (
                <p className="text-xs text-muted-foreground mt-1">
                  GPS: {formData.latitude}, {formData.longitude}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Emergency Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateFormData("description", e.target.value)}
                placeholder="Describe the emergency situation in detail..."
                rows={4}
                required
              />
            </div>
          </div>

          {/* Location Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Location Details (Optional)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="district">District</Label>
                <Input
                  id="district"
                  value={formData.district}
                  onChange={(e) => updateFormData("district", e.target.value)}
                  placeholder="District"
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
                <Label htmlFor="landmark">Landmark</Label>
                <Input
                  id="landmark"
                  value={formData.landmark}
                  onChange={(e) => updateFormData("landmark", e.target.value)}
                  placeholder="Nearest landmark"
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
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Additional Information (Optional)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="numberOfPeopleAffected">
                  Number of People Affected
                </Label>
                <Input
                  id="numberOfPeopleAffected"
                  type="number"
                  value={formData.numberOfPeopleAffected}
                  onChange={(e) =>
                    updateFormData("numberOfPeopleAffected", e.target.value)
                  }
                  placeholder="Number of people"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="estimatedDamage">Estimated Damage</Label>
              <Input
                id="estimatedDamage"
                value={formData.estimatedDamage}
                onChange={(e) =>
                  updateFormData("estimatedDamage", e.target.value)
                }
                placeholder="Brief description of damage"
              />
            </div>
            <div>
              <Label htmlFor="immediateNeedsProvided">
                Immediate Needs/Assistance Provided
              </Label>
              <Textarea
                id="immediateNeedsProvided"
                value={formData.immediateNeedsProvided}
                onChange={(e) =>
                  updateFormData("immediateNeedsProvided", e.target.value)
                }
                placeholder="Describe any immediate assistance provided or needed"
                rows={2}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              onClick={onBack}
              variant="outline"
              className="flex items-center gap-2"
              disabled={loading}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit Emergency Request
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
