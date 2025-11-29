import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { ArrowLeft, Building2, Loader2 } from "lucide-react";
import { csrIndustrialAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface CSRIndustrialFormProps {
  onBack: () => void;
}

interface CSRFormState {
  // Company Information
  companyName: string;
  companyType?: "PUBLIC" | "PRIVATE" | "MNC" | "PSU" | "STARTUP" | "NGO";
  cinNumber?: string;
  panNumber?: string;
  gstNumber?: string;
  companyAddress?: string;
  companyWebsite?: string;
  industry?: string;
  // Contact Information
  contactPersonName: string;
  contactDesignation?: string;
  contactMobile: string;
  contactEmail?: string;
  alternateContactName?: string;
  alternateContactMobile?: string;
  alternateContactEmail?: string;
  // Project Information
  projectName: string;
  projectCategory?:
    | "EDUCATION"
    | "HEALTHCARE"
    | "RURAL_DEVELOPMENT"
    | "SKILL_DEVELOPMENT"
    | "INFRASTRUCTURE"
    | "ENVIRONMENT"
    | "SPORTS"
    | "CULTURE"
    | "DISASTER_RELIEF"
    | "OTHER";
  projectDescription?: string;
  projectObjectives?: string;
  targetBeneficiaries?: string;
  expectedOutcomes?: string;
  // Location Details
  district?: string;
  mandal?: string;
  village?: string;
  implementationArea?: string;
  // Financial Information
  proposedBudget: number;
  fundingModel?:
    | "FULL_FUNDING"
    | "PARTIAL_FUNDING"
    | "MATCHING_GRANT"
    | "IN_KIND";
  // Timeline
  proposedStartDate?: string;
  proposedEndDate?: string;
  duration?: number;
}

export function CSRIndustrialForm({ onBack }: CSRIndustrialFormProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<CSRFormState>({
    companyName: "",
    contactPersonName: "",
    contactMobile: "",
    projectName: "",
    proposedBudget: 0,
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Validation
      if (
        !formData.companyName ||
        !formData.contactPersonName ||
        !formData.contactMobile ||
        !formData.projectName
      ) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (!/^\d{10}$/.test(formData.contactMobile)) {
        toast({
          title: "Invalid Mobile Number",
          description: "Please enter a valid 10-digit mobile number",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const csrData = {
        companyName: formData.companyName,
        companyType: formData.companyType,
        cinNumber: formData.cinNumber,
        panNumber: formData.panNumber,
        gstNumber: formData.gstNumber,
        companyAddress: formData.companyAddress,
        companyWebsite: formData.companyWebsite,
        industry: formData.industry,
        contactPersonName: formData.contactPersonName,
        contactDesignation: formData.contactDesignation,
        contactMobile: formData.contactMobile,
        contactEmail: formData.contactEmail,
        alternateContactName: formData.alternateContactName,
        alternateContactMobile: formData.alternateContactMobile,
        alternateContactEmail: formData.alternateContactEmail,
        projectName: formData.projectName,
        projectCategory: formData.projectCategory,
        projectDescription: formData.projectDescription,
        projectObjectives: formData.projectObjectives,
        targetBeneficiaries: formData.targetBeneficiaries,
        expectedOutcomes: formData.expectedOutcomes,
        district: formData.district,
        mandal: formData.mandal,
        village: formData.village,
        implementationArea: formData.implementationArea,
        proposedBudget: formData.proposedBudget,
        fundingModel: formData.fundingModel,
        proposedStartDate: formData.proposedStartDate,
        proposedEndDate: formData.proposedEndDate,
        duration: formData.duration,
        status: "LEAD" as const,
      };

      const response = await csrIndustrialAPI.create(csrData);

      toast({
        title: "Success!",
        description: `CSR project application submitted successfully. Project ID: ${
          response.data.csrId || "Pending"
        }`,
      });

      // Reset form
      setFormData({
        companyName: "",
        contactPersonName: "",
        contactMobile: "",
        projectName: "",
        proposedBudget: 0,
      });
      setStep(1);
      onBack();
    } catch (error) {
      console.error("CSR submission error:", error);
      toast({
        title: "Submission Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: keyof CSRFormState, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-card p-6">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              CSR & Industrial Partnership Application
            </h1>
            <p className="text-muted-foreground">Step {step} of 5</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Company Info</span>
            <span>Contact Details</span>
            <span>Project Info</span>
            <span>Location & Budget</span>
            <span>Review</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-smooth"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {step === 1 && "Company Information"}
              {step === 2 && "Contact Details"}
              {step === 3 && "Project Information"}
              {step === 4 && "Location & Budget Details"}
              {step === 5 && "Review & Submit"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Enter company registration and business details"}
              {step === 2 && "Primary and alternate contact information"}
              {step === 3 && "Project details and objectives"}
              {step === 4 && "Implementation location and financial details"}
              {step === 5 && "Review all details before submitting"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Company Information */}
            {step === 1 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) =>
                        updateFormData("companyName", e.target.value)
                      }
                      placeholder="Enter company name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyType">Company Type</Label>
                    <Select
                      value={formData.companyType}
                      onValueChange={(value) =>
                        updateFormData("companyType", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select company type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PUBLIC">Public Limited</SelectItem>
                        <SelectItem value="PRIVATE">Private Limited</SelectItem>
                        <SelectItem value="MNC">
                          Multinational Corporation
                        </SelectItem>
                        <SelectItem value="PSU">
                          Public Sector Undertaking
                        </SelectItem>
                        <SelectItem value="STARTUP">Startup</SelectItem>
                        <SelectItem value="NGO">NGO/Non-Profit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="cinNumber">CIN Number</Label>
                    <Input
                      id="cinNumber"
                      value={formData.cinNumber || ""}
                      onChange={(e) =>
                        updateFormData("cinNumber", e.target.value)
                      }
                      placeholder="Corporate Identification Number"
                      maxLength={21}
                    />
                  </div>
                  <div>
                    <Label htmlFor="panNumber">PAN Number</Label>
                    <Input
                      id="panNumber"
                      value={formData.panNumber || ""}
                      onChange={(e) =>
                        updateFormData("panNumber", e.target.value)
                      }
                      placeholder="Permanent Account Number"
                      maxLength={10}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gstNumber">GST Number</Label>
                    <Input
                      id="gstNumber"
                      value={formData.gstNumber || ""}
                      onChange={(e) =>
                        updateFormData("gstNumber", e.target.value)
                      }
                      placeholder="GST Registration Number"
                      maxLength={15}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="companyAddress">Company Address</Label>
                  <Textarea
                    id="companyAddress"
                    value={formData.companyAddress || ""}
                    onChange={(e) =>
                      updateFormData("companyAddress", e.target.value)
                    }
                    placeholder="Enter complete company address"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyWebsite">Company Website</Label>
                    <Input
                      id="companyWebsite"
                      type="url"
                      value={formData.companyWebsite || ""}
                      onChange={(e) =>
                        updateFormData("companyWebsite", e.target.value)
                      }
                      placeholder="https://www.company.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="industry">Industry Sector</Label>
                    <Input
                      id="industry"
                      value={formData.industry || ""}
                      onChange={(e) =>
                        updateFormData("industry", e.target.value)
                      }
                      placeholder="e.g., IT, Manufacturing, Healthcare"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Contact Information */}
            {step === 2 && (
              <>
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Primary Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contactPersonName">
                        Contact Person Name *
                      </Label>
                      <Input
                        id="contactPersonName"
                        value={formData.contactPersonName}
                        onChange={(e) =>
                          updateFormData("contactPersonName", e.target.value)
                        }
                        placeholder="Enter full name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactDesignation">Designation</Label>
                      <Input
                        id="contactDesignation"
                        value={formData.contactDesignation || ""}
                        onChange={(e) =>
                          updateFormData("contactDesignation", e.target.value)
                        }
                        placeholder="e.g., CSR Manager"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contactMobile">Mobile Number *</Label>
                      <Input
                        id="contactMobile"
                        value={formData.contactMobile}
                        onChange={(e) =>
                          updateFormData("contactMobile", e.target.value)
                        }
                        placeholder="10-digit mobile number"
                        maxLength={10}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactEmail">Email Address</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={formData.contactEmail || ""}
                        onChange={(e) =>
                          updateFormData("contactEmail", e.target.value)
                        }
                        placeholder="contact@company.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-semibold text-lg">
                    Alternate Contact (Optional)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="alternateContactName">
                        Alternate Contact Name
                      </Label>
                      <Input
                        id="alternateContactName"
                        value={formData.alternateContactName || ""}
                        onChange={(e) =>
                          updateFormData("alternateContactName", e.target.value)
                        }
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="alternateContactMobile">
                        Mobile Number
                      </Label>
                      <Input
                        id="alternateContactMobile"
                        value={formData.alternateContactMobile || ""}
                        onChange={(e) =>
                          updateFormData(
                            "alternateContactMobile",
                            e.target.value
                          )
                        }
                        placeholder="10-digit mobile number"
                        maxLength={10}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="alternateContactEmail">Email Address</Label>
                    <Input
                      id="alternateContactEmail"
                      type="email"
                      value={formData.alternateContactEmail || ""}
                      onChange={(e) =>
                        updateFormData("alternateContactEmail", e.target.value)
                      }
                      placeholder="alternate@company.com"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Step 3: Project Information */}
            {step === 3 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="projectName">Project Name *</Label>
                    <Input
                      id="projectName"
                      value={formData.projectName}
                      onChange={(e) =>
                        updateFormData("projectName", e.target.value)
                      }
                      placeholder="Enter project name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="projectCategory">Project Category</Label>
                    <Select
                      value={formData.projectCategory}
                      onValueChange={(value) =>
                        updateFormData("projectCategory", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EDUCATION">Education</SelectItem>
                        <SelectItem value="HEALTHCARE">Healthcare</SelectItem>
                        <SelectItem value="RURAL_DEVELOPMENT">
                          Rural Development
                        </SelectItem>
                        <SelectItem value="SKILL_DEVELOPMENT">
                          Skill Development
                        </SelectItem>
                        <SelectItem value="INFRASTRUCTURE">
                          Infrastructure
                        </SelectItem>
                        <SelectItem value="ENVIRONMENT">Environment</SelectItem>
                        <SelectItem value="SPORTS">Sports</SelectItem>
                        <SelectItem value="CULTURE">
                          Culture & Heritage
                        </SelectItem>
                        <SelectItem value="DISASTER_RELIEF">
                          Disaster Relief
                        </SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="projectDescription">
                    Project Description
                  </Label>
                  <Textarea
                    id="projectDescription"
                    value={formData.projectDescription || ""}
                    onChange={(e) =>
                      updateFormData("projectDescription", e.target.value)
                    }
                    placeholder="Provide a detailed description of the project"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="projectObjectives">Project Objectives</Label>
                  <Textarea
                    id="projectObjectives"
                    value={formData.projectObjectives || ""}
                    onChange={(e) =>
                      updateFormData("projectObjectives", e.target.value)
                    }
                    placeholder="List the main objectives of this project"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="targetBeneficiaries">
                    Target Beneficiaries
                  </Label>
                  <Textarea
                    id="targetBeneficiaries"
                    value={formData.targetBeneficiaries || ""}
                    onChange={(e) =>
                      updateFormData("targetBeneficiaries", e.target.value)
                    }
                    placeholder="Describe the target beneficiaries and expected reach"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="expectedOutcomes">Expected Outcomes</Label>
                  <Textarea
                    id="expectedOutcomes"
                    value={formData.expectedOutcomes || ""}
                    onChange={(e) =>
                      updateFormData("expectedOutcomes", e.target.value)
                    }
                    placeholder="Describe the expected outcomes and impact"
                    rows={3}
                  />
                </div>
              </>
            )}

            {/* Step 4: Location & Budget */}
            {step === 4 && (
              <>
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">
                    Implementation Location
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="district">District</Label>
                      <Input
                        id="district"
                        value={formData.district || ""}
                        onChange={(e) =>
                          updateFormData("district", e.target.value)
                        }
                        placeholder="District"
                      />
                    </div>
                    <div>
                      <Label htmlFor="mandal">Mandal</Label>
                      <Input
                        id="mandal"
                        value={formData.mandal || ""}
                        onChange={(e) =>
                          updateFormData("mandal", e.target.value)
                        }
                        placeholder="Mandal"
                      />
                    </div>
                    <div>
                      <Label htmlFor="village">Village/Area</Label>
                      <Input
                        id="village"
                        value={formData.village || ""}
                        onChange={(e) =>
                          updateFormData("village", e.target.value)
                        }
                        placeholder="Village or Area"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="implementationArea">
                      Implementation Area Details
                    </Label>
                    <Textarea
                      id="implementationArea"
                      value={formData.implementationArea || ""}
                      onChange={(e) =>
                        updateFormData("implementationArea", e.target.value)
                      }
                      placeholder="Provide detailed information about the implementation area"
                      rows={2}
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-semibold text-lg">Financial Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="proposedBudget">
                        Proposed Budget (₹) *
                      </Label>
                      <Input
                        id="proposedBudget"
                        type="number"
                        value={formData.proposedBudget || ""}
                        onChange={(e) =>
                          updateFormData(
                            "proposedBudget",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        placeholder="Enter proposed budget"
                        min="0"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="fundingModel">Funding Model</Label>
                      <Select
                        value={formData.fundingModel}
                        onValueChange={(value) =>
                          updateFormData("fundingModel", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select funding model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FULL_FUNDING">
                            Full Funding
                          </SelectItem>
                          <SelectItem value="PARTIAL_FUNDING">
                            Partial Funding
                          </SelectItem>
                          <SelectItem value="MATCHING_GRANT">
                            Matching Grant
                          </SelectItem>
                          <SelectItem value="IN_KIND">
                            In-Kind Contribution
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-semibold text-lg">Timeline</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="proposedStartDate">
                        Proposed Start Date
                      </Label>
                      <Input
                        id="proposedStartDate"
                        type="date"
                        value={formData.proposedStartDate || ""}
                        onChange={(e) =>
                          updateFormData("proposedStartDate", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="proposedEndDate">Proposed End Date</Label>
                      <Input
                        id="proposedEndDate"
                        type="date"
                        value={formData.proposedEndDate || ""}
                        onChange={(e) =>
                          updateFormData("proposedEndDate", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="duration">Duration (Months)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={formData.duration || ""}
                        onChange={(e) =>
                          updateFormData(
                            "duration",
                            parseInt(e.target.value) || undefined
                          )
                        }
                        placeholder="Enter duration"
                        min="1"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Step 5: Review */}
            {step === 5 && (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-4">Application Summary</h3>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">
                        Company Information
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            Company:
                          </span>
                          <span className="font-medium ml-2">
                            {formData.companyName}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Type:</span>
                          <span className="font-medium ml-2">
                            {formData.companyType || "N/A"}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Industry:
                          </span>
                          <span className="font-medium ml-2">
                            {formData.industry || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">
                        Contact Person
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Name:</span>
                          <span className="font-medium ml-2">
                            {formData.contactPersonName}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Mobile:</span>
                          <span className="font-medium ml-2">
                            {formData.contactMobile}
                          </span>
                        </div>
                        {formData.contactEmail && (
                          <div className="col-span-2">
                            <span className="text-muted-foreground">
                              Email:
                            </span>
                            <span className="font-medium ml-2">
                              {formData.contactEmail}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">
                        Project Details
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            Project:
                          </span>
                          <span className="font-medium ml-2">
                            {formData.projectName}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Category:
                          </span>
                          <span className="font-medium ml-2">
                            {formData.projectCategory || "N/A"}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-muted-foreground">Budget:</span>
                          <span className="font-medium ml-2">
                            ₹{formData.proposedBudget.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {(formData.district ||
                      formData.mandal ||
                      formData.village) && (
                      <div className="border-t pt-4">
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">
                          Location
                        </h4>
                        <div className="text-sm">
                          <span className="font-medium">
                            {[
                              formData.village,
                              formData.mandal,
                              formData.district,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-info-light border border-info/20 rounded-lg">
                  <p className="text-sm">
                    Please review all details carefully before submitting. Once
                    submitted, your CSR partnership proposal will be reviewed by
                    our team.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={step === 1 || loading}
              >
                Previous
              </Button>

              {step < 5 ? (
                <Button onClick={handleNext}>Next</Button>
              ) : (
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
