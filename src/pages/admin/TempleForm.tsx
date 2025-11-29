import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ArrowLeft,
  ArrowRight,
  Send,
  Loader2,
  Calendar as CalendarIcon,
} from "lucide-react";
import { FileUpload } from "@/components/shared/FileUpload";
import { templesAPI, usersAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types/auth";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface StepProps {
  data: Record<string, unknown>;
  updateField: (field: string, value: unknown) => void;
}

const asString = (value: unknown): string => {
  return value?.toString() || "";
};

const DARSHAN_TYPES = [
  { value: "VIP", label: "VIP Darshan" },
  { value: "GENERAL", label: "General Darshan" },
  { value: "SPECIAL", label: "Special Darshan" },
  { value: "DIVYA_DARSHAN", label: "Divya Darshan" },
  { value: "SARVA_DARSHAN", label: "Sarva Darshan" },
];

const TEMPLE_NAMES = [
  "Tirumala Venkateswara Temple",
  "Srikalahasti Temple",
  "Simhachalam Temple",
  "Kanaka Durga Temple",
  "Annavaram Temple",
  "Bhadrachalam Temple",
  "Other",
];

const DISTRICTS = [
  "Anantapur",
  "Chittoor",
  "East Godavari",
  "Guntur",
  "Krishna",
  "Kurnool",
  "Prakasam",
  "Nellore",
  "Srikakulam",
  "Visakhapatnam",
  "Vizianagaram",
  "West Godavari",
  "YSR Kadapa",
];

// Step 1: Applicant Information
const ApplicantStep = ({ data, updateField }: StepProps) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Applicant Information</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="applicant_name">Full Name *</Label>
        <Input
          id="applicant_name"
          value={asString(data.applicant_name)}
          onChange={(e) => updateField("applicant_name", e.target.value)}
          placeholder="Enter full name"
        />
      </div>
      <div>
        <Label htmlFor="mobile">Mobile Number *</Label>
        <Input
          id="mobile"
          value={asString(data.mobile)}
          onChange={(e) => updateField("mobile", e.target.value)}
          placeholder="10-digit mobile number"
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={asString(data.email)}
          onChange={(e) => updateField("email", e.target.value)}
          placeholder="Email address"
        />
      </div>
      <div>
        <Label htmlFor="aadhaar_number">Aadhaar Number</Label>
        <Input
          id="aadhaar_number"
          value={asString(data.aadhaar_number)}
          onChange={(e) => updateField("aadhaar_number", e.target.value)}
          placeholder="12-digit Aadhaar"
        />
      </div>
    </div>
    <div>
      <Label htmlFor="address">Address</Label>
      <Textarea
        id="address"
        value={asString(data.address)}
        onChange={(e) => updateField("address", e.target.value)}
        placeholder="Complete address"
        rows={3}
      />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <Label htmlFor="district">District *</Label>
        <Select
          value={asString(data.district)}
          onValueChange={(value) => updateField("district", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select district" />
          </SelectTrigger>
          <SelectContent>
            {DISTRICTS.map((district) => (
              <SelectItem key={district} value={district}>
                {district}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="mandal">Mandal</Label>
        <Input
          id="mandal"
          value={asString(data.mandal)}
          onChange={(e) => updateField("mandal", e.target.value)}
          placeholder="Mandal"
        />
      </div>
      <div>
        <Label htmlFor="pincode">Pincode</Label>
        <Input
          id="pincode"
          value={asString(data.pincode)}
          onChange={(e) => updateField("pincode", e.target.value)}
          placeholder="6-digit pincode"
        />
      </div>
    </div>
  </div>
);

// Step 2: Temple & Darshan Details
const TempleDetailsStep = ({ data, updateField }: StepProps) => {
  const preferredDate = data.preferred_date
    ? new Date(asString(data.preferred_date))
    : undefined;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Temple & Darshan Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="temple_name">Temple Name *</Label>
          <Select
            value={asString(data.temple_name)}
            onValueChange={(value) => updateField("temple_name", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select temple" />
            </SelectTrigger>
            <SelectContent>
              {TEMPLE_NAMES.map((temple) => (
                <SelectItem key={temple} value={temple}>
                  {temple}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="darshan_type">Darshan Type *</Label>
          <Select
            value={asString(data.darshan_type)}
            onValueChange={(value) => updateField("darshan_type", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select darshan type" />
            </SelectTrigger>
            <SelectContent>
              {DARSHAN_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Preferred Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !preferredDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {preferredDate ? format(preferredDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={preferredDate}
                onSelect={(date) =>
                  updateField("preferred_date", date?.toISOString())
                }
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Label htmlFor="number_of_people">Number of People</Label>
          <Input
            id="number_of_people"
            type="number"
            value={asString(data.number_of_people)}
            onChange={(e) => updateField("number_of_people", e.target.value)}
            placeholder="Number of people"
            min="1"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="purpose">Purpose of Visit</Label>
        <Textarea
          id="purpose"
          value={asString(data.purpose)}
          onChange={(e) => updateField("purpose", e.target.value)}
          placeholder="Briefly describe the purpose of darshan"
          rows={3}
        />
      </div>
      <div>
        <Label htmlFor="remarks">Additional Remarks</Label>
        <Textarea
          id="remarks"
          value={asString(data.remarks)}
          onChange={(e) => updateField("remarks", e.target.value)}
          placeholder="Any additional information"
          rows={2}
        />
      </div>
    </div>
  );
};

// Step 3: Documents
const DocumentsStep = ({ data, updateField }: StepProps) => {
  const existingFiles = (
    (data.existing_files as Array<{
      filename: string;
      url: string;
      uploadedAt?: Date;
    }>) || []
  ).map((file) => ({
    id: file.url,
    name: file.filename,
    url: file.url,
    type: "application/pdf",
    size: 0,
    uploadedAt: file.uploadedAt
      ? file.uploadedAt.toString()
      : new Date().toISOString(),
  }));

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Supporting Documents</h3>
      <p className="text-sm text-muted-foreground">
        Upload relevant documents like ID proof, address proof, or any
        supporting documents
      </p>
      <FileUpload
        onFilesChange={(files) => updateField("attachments", files)}
        existingFiles={existingFiles}
        maxFiles={5}
        acceptedTypes={["application/pdf", "image/*"]}
      />
    </div>
  );
};

// Step 4: Assignment
const AssignmentStep = ({ data, updateField }: StepProps) => {
  const [officers, setOfficers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOfficers = async () => {
      try {
        const response = await usersAPI.getAllUsers({ role: "L2_EXEC_ADMIN" });
        setOfficers(response.data || []);
      } catch (error) {
        console.error("Error fetching officers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOfficers();
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Assignment</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="assigned_to">Assign To Officer</Label>
          {loading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <Select
              value={asString(data.assigned_to)}
              onValueChange={(value) => updateField("assigned_to", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select officer" />
              </SelectTrigger>
              <SelectContent>
                {officers.map((officer) => (
                  <SelectItem key={officer._id} value={officer._id}>
                    {officer.firstName && officer.lastName
                      ? `${officer.firstName} ${officer.lastName}`
                      : officer.fullName || officer.email}{" "}
                    ({officer.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select
            value={asString(data.priority)}
            onValueChange={(value) => updateField("priority", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
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
    </div>
  );
};

export default function TempleForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Record<string, unknown>>({
    district: "",
    darshan_type: "GENERAL",
    priority: "MEDIUM",
  });

  const isEditMode = !!id;
  const totalSteps = 4;

  // Fetch existing temple data for edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchTempleData = async () => {
        try {
          setLoading(true);
          const response = await templesAPI.getById(id);
          const temple = response.data;

          // Transform backend data to form format
          const assignedToId = temple.assignedTo
            ? typeof temple.assignedTo === "object" &&
              (temple.assignedTo as { _id?: string })._id
              ? (temple.assignedTo as { _id: string })._id
              : (temple.assignedTo as string)
            : "";

          setFormData({
            applicant_name: temple.applicantName,
            mobile: temple.mobile,
            email: temple.email || "",
            aadhaar_number: temple.aadhaarNumber || "",
            address: temple.address || "",
            district: temple.district || "",
            mandal: temple.mandal || "",
            pincode: temple.pincode || "",
            temple_name: temple.templeName,
            darshan_type: temple.darshanType,
            preferred_date: temple.preferredDate,
            number_of_people: temple.numberOfPeople || "",
            purpose: temple.purpose || "",
            remarks: temple.remarks || "",
            assigned_to: assignedToId,
            priority: temple.priority || "MEDIUM",
            existing_files: temple.attachments || [],
          });
        } catch (error: unknown) {
          console.error("Error fetching temple data:", error);
          toast({
            title: "Error",
            description: "Failed to load temple data",
            variant: "destructive",
          });
          navigate("/admin/temple-letters");
        } finally {
          setLoading(false);
        }
      };
      fetchTempleData();
    }
  }, [id, isEditMode, navigate, toast]);

  const updateField = useCallback((field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Transform form data to backend format
      const templeData = {
        applicantName: asString(formData.applicant_name),
        mobile: asString(formData.mobile),
        email: asString(formData.email),
        aadhaarNumber: asString(formData.aadhaar_number),
        address: asString(formData.address),
        district: asString(formData.district),
        mandal: asString(formData.mandal),
        pincode: asString(formData.pincode),
        templeName: asString(formData.temple_name),
        darshanType: asString(formData.darshan_type),
        preferredDate: asString(formData.preferred_date),
        numberOfPeople: formData.number_of_people
          ? Number(formData.number_of_people)
          : undefined,
        purpose: asString(formData.purpose),
        remarks: asString(formData.remarks),
        assignedTo: asString(formData.assigned_to) || undefined,
        priority: asString(formData.priority),
        attachments: Array.isArray(formData.attachments)
          ? formData.attachments
          : [],
      };

      let response;
      if (isEditMode) {
        response = await templesAPI.update(id, templeData);
        toast({
          title: "Success",
          description: "Temple letter updated successfully",
        });
      } else {
        response = await templesAPI.create(templeData);
        toast({
          title: "Success",
          description: `Temple letter created: ${response.data.templeId}`,
        });
      }

      navigate("/admin/temple-letters");
    } catch (error: unknown) {
      console.error("Error submitting temple letter:", error);
      const errorMessage =
        error instanceof Error && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message || "Failed to submit temple letter"
          : "Failed to submit temple letter";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (isEditMode && loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/temple-letters")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Temple Letters
        </Button>
        <h1 className="text-3xl font-bold">
          {isEditMode ? "Edit Temple Letter" : "New Temple Letter Request"}
        </h1>
        <p className="text-muted-foreground mt-2">
          Step {currentStep} of {totalSteps}
        </p>
        <Progress value={(currentStep / totalSteps) * 100} className="mt-4" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {currentStep === 1 && "Applicant Information"}
            {currentStep === 2 && "Temple & Darshan Details"}
            {currentStep === 3 && "Supporting Documents"}
            {currentStep === 4 && "Assignment & Priority"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentStep === 1 && (
            <ApplicantStep data={formData} updateField={updateField} />
          )}
          {currentStep === 2 && (
            <TempleDetailsStep data={formData} updateField={updateField} />
          )}
          {currentStep === 3 && (
            <DocumentsStep data={formData} updateField={updateField} />
          )}
          {currentStep === 4 && (
            <AssignmentStep data={formData} updateField={updateField} />
          )}

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditMode ? "Updating..." : "Submitting..."}
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    {isEditMode ? "Update" : "Submit"}
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
