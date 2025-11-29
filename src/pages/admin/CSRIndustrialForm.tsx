import { useState, useEffect } from "react";
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
  Eye,
} from "lucide-react";
import { FileUpload } from "@/components/shared/FileUpload";
import { csrIndustrialAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface StepProps {
  data: Record<string, unknown>;
  updateField: (field: string, value: unknown) => void;
}

const asString = (value: unknown): string => {
  return value?.toString() || "";
};

const asNumber = (value: unknown): number => {
  return typeof value === "number" ? value : parseInt(asString(value)) || 0;
};

const COMPANY_TYPES = [
  { value: "PUBLIC", label: "Public Limited" },
  { value: "PRIVATE", label: "Private Limited" },
  { value: "MNC", label: "Multi-National Corporation" },
  { value: "PSU", label: "Public Sector Unit" },
  { value: "STARTUP", label: "Startup" },
  { value: "NGO", label: "NGO" },
];

const PROJECT_CATEGORIES = [
  { value: "EDUCATION", label: "Education" },
  { value: "HEALTHCARE", label: "Healthcare" },
  { value: "RURAL_DEVELOPMENT", label: "Rural Development" },
  { value: "SKILL_DEVELOPMENT", label: "Skill Development" },
  { value: "INFRASTRUCTURE", label: "Infrastructure" },
  { value: "ENVIRONMENT", label: "Environment" },
  { value: "SPORTS", label: "Sports" },
  { value: "CULTURE", label: "Culture" },
  { value: "DISASTER_RELIEF", label: "Disaster Relief" },
  { value: "OTHER", label: "Other" },
];

const FUNDING_MODELS = [
  { value: "FULL_FUNDING", label: "Full Funding" },
  { value: "PARTIAL_FUNDING", label: "Partial Funding" },
  { value: "MATCHING_GRANT", label: "Matching Grant" },
  { value: "IN_KIND", label: "In-Kind" },
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

// Step 1: Company Information
const CompanyInfoStep = ({ data, updateField }: StepProps) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Company Information</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <Label htmlFor="companyName">Company Name *</Label>
        <Input
          id="companyName"
          value={asString(data.companyName)}
          onChange={(e) => updateField("companyName", e.target.value)}
          placeholder="Enter company name"
          required
        />
      </div>
      <div>
        <Label htmlFor="companyType">Company Type</Label>
        <Select
          value={asString(data.companyType)}
          onValueChange={(value) => updateField("companyType", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {COMPANY_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="industry">Industry</Label>
        <Input
          id="industry"
          value={asString(data.industry)}
          onChange={(e) => updateField("industry", e.target.value)}
          placeholder="e.g., IT, Manufacturing"
        />
      </div>
      <div>
        <Label htmlFor="cinNumber">CIN Number</Label>
        <Input
          id="cinNumber"
          value={asString(data.cinNumber)}
          onChange={(e) => updateField("cinNumber", e.target.value)}
          placeholder="Enter CIN"
        />
      </div>
      <div>
        <Label htmlFor="panNumber">PAN Number</Label>
        <Input
          id="panNumber"
          value={asString(data.panNumber)}
          onChange={(e) => updateField("panNumber", e.target.value)}
          placeholder="Enter PAN"
        />
      </div>
      <div>
        <Label htmlFor="gstNumber">GST Number</Label>
        <Input
          id="gstNumber"
          value={asString(data.gstNumber)}
          onChange={(e) => updateField("gstNumber", e.target.value)}
          placeholder="Enter GST"
        />
      </div>
      <div>
        <Label htmlFor="companyWebsite">Company Website</Label>
        <Input
          id="companyWebsite"
          type="url"
          value={asString(data.companyWebsite)}
          onChange={(e) => updateField("companyWebsite", e.target.value)}
          placeholder="https://example.com"
        />
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="companyAddress">Company Address</Label>
        <Textarea
          id="companyAddress"
          value={asString(data.companyAddress)}
          onChange={(e) => updateField("companyAddress", e.target.value)}
          placeholder="Enter complete address"
          rows={3}
        />
      </div>
    </div>
  </div>
);

// Step 2: Contact Information
const ContactInfoStep = ({ data, updateField }: StepProps) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Contact Information</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="contactPersonName">Contact Person Name *</Label>
        <Input
          id="contactPersonName"
          value={asString(data.contactPersonName)}
          onChange={(e) => updateField("contactPersonName", e.target.value)}
          placeholder="Enter contact person name"
          required
        />
      </div>
      <div>
        <Label htmlFor="contactDesignation">Designation</Label>
        <Input
          id="contactDesignation"
          value={asString(data.contactDesignation)}
          onChange={(e) => updateField("contactDesignation", e.target.value)}
          placeholder="e.g., CSR Manager"
        />
      </div>
      <div>
        <Label htmlFor="contactMobile">Mobile Number *</Label>
        <Input
          id="contactMobile"
          value={asString(data.contactMobile)}
          onChange={(e) => updateField("contactMobile", e.target.value)}
          placeholder="Enter 10-digit mobile number"
          required
        />
      </div>
      <div>
        <Label htmlFor="contactEmail">Email</Label>
        <Input
          id="contactEmail"
          type="email"
          value={asString(data.contactEmail)}
          onChange={(e) => updateField("contactEmail", e.target.value)}
          placeholder="contact@example.com"
        />
      </div>
      <div className="md:col-span-2">
        <h4 className="font-medium text-sm mb-3">
          Alternate Contact (Optional)
        </h4>
      </div>
      <div>
        <Label htmlFor="alternateContactName">Alternate Contact Name</Label>
        <Input
          id="alternateContactName"
          value={asString(data.alternateContactName)}
          onChange={(e) => updateField("alternateContactName", e.target.value)}
          placeholder="Enter alternate contact name"
        />
      </div>
      <div>
        <Label htmlFor="alternateContactMobile">Alternate Mobile</Label>
        <Input
          id="alternateContactMobile"
          value={asString(data.alternateContactMobile)}
          onChange={(e) =>
            updateField("alternateContactMobile", e.target.value)
          }
          placeholder="Enter mobile number"
        />
      </div>
      <div>
        <Label htmlFor="alternateContactEmail">Alternate Email</Label>
        <Input
          id="alternateContactEmail"
          type="email"
          value={asString(data.alternateContactEmail)}
          onChange={(e) => updateField("alternateContactEmail", e.target.value)}
          placeholder="alternate@example.com"
        />
      </div>
    </div>
  </div>
);

// Step 3: Project Details
const ProjectDetailsStep = ({ data, updateField }: StepProps) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Project Details</h3>
    <div className="grid grid-cols-1 gap-4">
      <div>
        <Label htmlFor="projectName">Project Name *</Label>
        <Input
          id="projectName"
          value={asString(data.projectName)}
          onChange={(e) => updateField("projectName", e.target.value)}
          placeholder="Enter project name"
          required
        />
      </div>
      <div>
        <Label htmlFor="projectCategory">Project Category</Label>
        <Select
          value={asString(data.projectCategory)}
          onValueChange={(value) => updateField("projectCategory", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {PROJECT_CATEGORIES.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="projectDescription">Project Description</Label>
        <Textarea
          id="projectDescription"
          value={asString(data.projectDescription)}
          onChange={(e) => updateField("projectDescription", e.target.value)}
          placeholder="Describe the project"
          rows={4}
        />
      </div>
      <div>
        <Label htmlFor="projectObjectives">Project Objectives</Label>
        <Textarea
          id="projectObjectives"
          value={asString(data.projectObjectives)}
          onChange={(e) => updateField("projectObjectives", e.target.value)}
          placeholder="List key objectives"
          rows={3}
        />
      </div>
      <div>
        <Label htmlFor="targetBeneficiaries">Target Beneficiaries</Label>
        <Textarea
          id="targetBeneficiaries"
          value={asString(data.targetBeneficiaries)}
          onChange={(e) => updateField("targetBeneficiaries", e.target.value)}
          placeholder="Describe target beneficiaries"
          rows={3}
        />
      </div>
      <div>
        <Label htmlFor="expectedOutcomes">Expected Outcomes</Label>
        <Textarea
          id="expectedOutcomes"
          value={asString(data.expectedOutcomes)}
          onChange={(e) => updateField("expectedOutcomes", e.target.value)}
          placeholder="Describe expected outcomes"
          rows={3}
        />
      </div>
    </div>
  </div>
);

// Step 4: Location & Financial Details
const LocationFinanceStep = ({ data, updateField }: StepProps) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Location & Financial Details</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="district">District</Label>
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
          placeholder="Enter mandal"
        />
      </div>
      <div>
        <Label htmlFor="village">Village/Area</Label>
        <Input
          id="village"
          value={asString(data.village)}
          onChange={(e) => updateField("village", e.target.value)}
          placeholder="Enter village or area"
        />
      </div>
      <div>
        <Label htmlFor="implementationArea">Implementation Area</Label>
        <Input
          id="implementationArea"
          value={asString(data.implementationArea)}
          onChange={(e) => updateField("implementationArea", e.target.value)}
          placeholder="Specific implementation area"
        />
      </div>
      <div className="md:col-span-2">
        <hr className="my-4" />
        <h4 className="font-medium text-sm mb-3">Financial Information</h4>
      </div>
      <div>
        <Label htmlFor="proposedBudget">Proposed Budget (₹) *</Label>
        <Input
          id="proposedBudget"
          type="number"
          value={asNumber(data.proposedBudget)}
          onChange={(e) =>
            updateField("proposedBudget", parseFloat(e.target.value))
          }
          placeholder="Enter amount in rupees"
          required
        />
      </div>
      <div>
        <Label htmlFor="fundingModel">Funding Model</Label>
        <Select
          value={asString(data.fundingModel)}
          onValueChange={(value) => updateField("fundingModel", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select funding model" />
          </SelectTrigger>
          <SelectContent>
            {FUNDING_MODELS.map((model) => (
              <SelectItem key={model.value} value={model.value}>
                {model.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="duration">Project Duration (months)</Label>
        <Input
          id="duration"
          type="number"
          value={asNumber(data.duration)}
          onChange={(e) => updateField("duration", parseInt(e.target.value))}
          placeholder="Duration in months"
        />
      </div>
    </div>
  </div>
);

// Step 5: Timeline
const TimelineStep = ({ data, updateField }: StepProps) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Project Timeline</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label>Proposed Start Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !data.proposedStartDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {data.proposedStartDate
                ? format(new Date(data.proposedStartDate as string), "PPP")
                : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={
                data.proposedStartDate
                  ? new Date(data.proposedStartDate as string)
                  : undefined
              }
              onSelect={(date) => updateField("proposedStartDate", date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <Label>Proposed End Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !data.proposedEndDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {data.proposedEndDate
                ? format(new Date(data.proposedEndDate as string), "PPP")
                : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={
                data.proposedEndDate
                  ? new Date(data.proposedEndDate as string)
                  : undefined
              }
              onSelect={(date) => updateField("proposedEndDate", date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  </div>
);

// Step 6: Documents & Notes
const DocumentsStep = ({ data, updateField }: StepProps) => {
  const [existingAttachments, setExistingAttachments] = useState<
    Array<{ filename: string; url: string }>
  >([]);

  useEffect(() => {
    if (data.attachments && Array.isArray(data.attachments)) {
      setExistingAttachments(
        data.attachments as Array<{ filename: string; url: string }>
      );
    }
  }, [data.attachments]);

  const handleFilesChange = (files: File[]) => {
    updateField("newAttachments", files);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Documents & Additional Notes</h3>

      {existingAttachments.length > 0 && (
        <div className="space-y-2">
          <Label>Existing Attachments</Label>
          <div className="border rounded-md p-4 space-y-2">
            {existingAttachments.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-secondary/20 rounded"
              >
                <span className="text-sm">{file.filename}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => window.open(file.url, "_blank")}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <Label>Upload Documents</Label>
        <FileUpload
          onFilesChange={handleFilesChange}
          maxSizePerFile={10 * 1024 * 1024}
          maxFiles={10}
        />
        <p className="text-sm text-muted-foreground mt-1">
          Upload project proposal, company profile, or supporting documents
          (PDF, DOC, Images, max 10MB each)
        </p>
      </div>

      <div>
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          value={asString(data.notes)}
          onChange={(e) => updateField("notes", e.target.value)}
          placeholder="Any additional information"
          rows={4}
        />
      </div>
    </div>
  );
};

export default function CSRIndustrialForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Record<string, unknown>>({
    status: "LEAD",
  });

  const isEditMode = !!id;

  const fetchCSRData = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await csrIndustrialAPI.getById(id);

      if (response.success && response.data) {
        setFormData(response.data);
      }
    } catch (error) {
      console.error("Error fetching CSR project:", error);
      toast({
        title: "Error",
        description: "Failed to load CSR project data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEditMode) {
      fetchCSRData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditMode]);

  const updateField = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const steps = [
    { title: "Company Info", component: CompanyInfoStep },
    { title: "Contact Info", component: ContactInfoStep },
    { title: "Project Details", component: ProjectDetailsStep },
    { title: "Location & Finance", component: LocationFinanceStep },
    { title: "Timeline", component: TimelineStep },
    { title: "Documents", component: DocumentsStep },
  ];

  const CurrentStepComponent = steps[currentStep].component;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Prepare payload
      const payload = {
        companyName: formData.companyName as string,
        companyType: formData.companyType as string,
        cinNumber: formData.cinNumber as string,
        panNumber: formData.panNumber as string,
        gstNumber: formData.gstNumber as string,
        companyAddress: formData.companyAddress as string,
        companyWebsite: formData.companyWebsite as string,
        industry: formData.industry as string,
        contactPersonName: formData.contactPersonName as string,
        contactDesignation: formData.contactDesignation as string,
        contactMobile: formData.contactMobile as string,
        contactEmail: formData.contactEmail as string,
        alternateContactName: formData.alternateContactName as string,
        alternateContactMobile: formData.alternateContactMobile as string,
        alternateContactEmail: formData.alternateContactEmail as string,
        projectName: formData.projectName as string,
        projectCategory: formData.projectCategory as string,
        projectDescription: formData.projectDescription as string,
        projectObjectives: formData.projectObjectives as string,
        targetBeneficiaries: formData.targetBeneficiaries as string,
        expectedOutcomes: formData.expectedOutcomes as string,
        district: formData.district as string,
        mandal: formData.mandal as string,
        village: formData.village as string,
        implementationArea: formData.implementationArea as string,
        proposedBudget: formData.proposedBudget as number,
        fundingModel: formData.fundingModel as string,
        duration: formData.duration as number,
        proposedStartDate: formData.proposedStartDate as Date | string,
        proposedEndDate: formData.proposedEndDate as Date | string,
        notes: formData.notes as string,
        status: (formData.status as string) || "LEAD",
      };

      let response;
      if (isEditMode) {
        response = await csrIndustrialAPI.update(id!, payload);
      } else {
        response = await csrIndustrialAPI.create(payload);
      }

      if (response.success) {
        toast({
          title: "Success",
          description: `CSR project ${
            isEditMode ? "updated" : "created"
          } successfully`,
        });
        navigate("/admin/csr-industrial");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: `Failed to ${
          isEditMode ? "update" : "create"
        } CSR project`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/admin/csr-industrial")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to List
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {isEditMode ? "Edit CSR Project" : "New CSR Project"}
          </CardTitle>
          <div className="mt-4">
            <Progress value={(currentStep / (steps.length - 1)) * 100} />
            <div className="flex justify-between mt-2">
              {steps.map((step, index) => (
                <span
                  key={index}
                  className={cn(
                    "text-xs",
                    index === currentStep
                      ? "text-primary font-medium"
                      : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </span>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="min-h-[400px]">
            <CurrentStepComponent data={formData} updateField={updateField} />
          </div>

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            {currentStep === steps.length - 1 ? (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit
                  </>
                )}
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
