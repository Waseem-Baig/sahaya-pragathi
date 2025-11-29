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
import { ArrowLeft, Heart, Loader2 } from "lucide-react";
import { cmReliefAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface CMRFFormProps {
  onBack: () => void;
}

interface CMRFFormState {
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
  // Relief Details
  reliefType:
    | "MEDICAL"
    | "EDUCATION"
    | "ACCIDENT"
    | "NATURAL_DISASTER"
    | "FINANCIAL_ASSISTANCE"
    | "FUNERAL"
    | "OTHER";
  requestedAmount: number;
  purpose?: string;
  urgency?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  // Medical Details
  medicalDetails?: {
    hospitalName?: string;
    disease?: string;
    treatmentCost?: number;
    doctorName?: string;
    admissionDate?: string;
  };
  // Income Details
  incomeDetails?: {
    monthlyIncome?: number;
    occupation?: string;
    familyMembers?: number;
    dependents?: number;
  };
  // Bank Details
  bankDetails?: {
    accountNumber?: string;
    ifscCode?: string;
    bankName?: string;
    branchName?: string;
    accountHolderName?: string;
  };
}

export function CMRFForm({ onBack }: CMRFFormProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<CMRFFormState>({
    applicantName: "",
    mobile: "",
    reliefType: "MEDICAL",
    requestedAmount: 0,
    urgency: "MEDIUM",
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Validation
      if (!formData.applicantName || !formData.mobile) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (!/^\d{10}$/.test(formData.mobile)) {
        toast({
          title: "Invalid Mobile Number",
          description: "Please enter a valid 10-digit mobile number",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const cmReliefData = {
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
        reliefType: formData.reliefType,
        requestedAmount: formData.requestedAmount,
        purpose: formData.purpose,
        urgency: formData.urgency,
        medicalDetails: formData.medicalDetails,
        incomeDetails: formData.incomeDetails,
        bankDetails: formData.bankDetails,
        status: "REQUESTED" as const,
      };

      const response = await cmReliefAPI.create(cmReliefData);

      toast({
        title: "Success!",
        description: `CM Relief application submitted successfully. Application ID: ${
          response.data.cmrfId || "Pending"
        }`,
      });

      // Reset form
      setFormData({
        applicantName: "",
        mobile: "",
        reliefType: "MEDICAL",
        requestedAmount: 0,
        urgency: "MEDIUM",
      });
      setStep(1);
      onBack();
    } catch (error) {
      console.error("CM Relief submission error:", error);
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

  const updateFormData = (field: keyof CMRFFormState, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateNestedFormData = (
    parent: "medicalDetails" | "incomeDetails" | "bankDetails",
    field: string,
    value: unknown
  ) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
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
              CM Relief Fund Application
            </h1>
            <p className="text-muted-foreground">Step {step} of 4</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Personal Info</span>
            <span>Relief Details</span>
            <span>Additional Info</span>
            <span>Review</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-smooth"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              {step === 1 && "Personal Information"}
              {step === 2 && "Relief Details"}
              {step === 3 && "Additional Information"}
              {step === 4 && "Review & Submit"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Enter applicant's personal details"}
              {step === 2 && "Relief type and amount details"}
              {step === 3 && "Medical, income, and bank details"}
              {step === 4 && "Review all details before submitting"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="applicantName">Applicant Name *</Label>
                    <Input
                      id="applicantName"
                      value={formData.applicantName}
                      onChange={(e) =>
                        updateFormData("applicantName", e.target.value)
                      }
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="fatherOrHusbandName">
                      Father/Husband Name
                    </Label>
                    <Input
                      id="fatherOrHusbandName"
                      value={formData.fatherOrHusbandName || ""}
                      onChange={(e) =>
                        updateFormData("fatherOrHusbandName", e.target.value)
                      }
                      placeholder="Enter father or husband name"
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
                          parseInt(e.target.value) || undefined
                        )
                      }
                      placeholder="Enter age"
                      min="1"
                      max="120"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => updateFormData("gender", value)}
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
                  <div>
                    <Label htmlFor="mobile">Mobile Number *</Label>
                    <Input
                      id="mobile"
                      value={formData.mobile}
                      onChange={(e) => updateFormData("mobile", e.target.value)}
                      placeholder="10-digit mobile"
                      maxLength={10}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email || ""}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      placeholder="Enter email address"
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

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address || ""}
                    onChange={(e) => updateFormData("address", e.target.value)}
                    placeholder="Enter full address"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                      onChange={(e) => updateFormData("mandal", e.target.value)}
                      placeholder="Mandal"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ward">Ward/Village</Label>
                    <Input
                      id="ward"
                      value={formData.ward || ""}
                      onChange={(e) => updateFormData("ward", e.target.value)}
                      placeholder="Ward/Village"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      value={formData.pincode || ""}
                      onChange={(e) =>
                        updateFormData("pincode", e.target.value)
                      }
                      placeholder="Pincode"
                      maxLength={6}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Relief Details */}
            {step === 2 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="reliefType">Relief Type *</Label>
                    <Select
                      value={formData.reliefType}
                      onValueChange={(value) =>
                        updateFormData("reliefType", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select relief type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MEDICAL">Medical</SelectItem>
                        <SelectItem value="EDUCATION">Education</SelectItem>
                        <SelectItem value="ACCIDENT">Accident</SelectItem>
                        <SelectItem value="NATURAL_DISASTER">
                          Natural Disaster
                        </SelectItem>
                        <SelectItem value="FINANCIAL_ASSISTANCE">
                          Financial Assistance
                        </SelectItem>
                        <SelectItem value="FUNERAL">Funeral</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="urgency">Urgency</Label>
                    <Select
                      value={formData.urgency}
                      onValueChange={(value) =>
                        updateFormData("urgency", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="CRITICAL">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="requestedAmount">
                    Requested Amount (₹) *
                  </Label>
                  <Input
                    id="requestedAmount"
                    type="number"
                    value={formData.requestedAmount || ""}
                    onChange={(e) =>
                      updateFormData(
                        "requestedAmount",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    placeholder="Enter amount in rupees"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="purpose">Purpose of Relief</Label>
                  <Textarea
                    id="purpose"
                    value={formData.purpose || ""}
                    onChange={(e) => updateFormData("purpose", e.target.value)}
                    placeholder="Explain the reason for requesting relief"
                    rows={4}
                  />
                </div>
              </>
            )}

            {/* Step 3: Additional Information */}
            {step === 3 && (
              <>
                {/* Medical Details (if relief type is MEDICAL) */}
                {formData.reliefType === "MEDICAL" && (
                  <div className="space-y-4 p-4 border rounded-lg">
                    <h3 className="font-semibold">Medical Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="hospitalName">Hospital Name</Label>
                        <Input
                          id="hospitalName"
                          value={formData.medicalDetails?.hospitalName || ""}
                          onChange={(e) =>
                            updateNestedFormData(
                              "medicalDetails",
                              "hospitalName",
                              e.target.value
                            )
                          }
                          placeholder="Enter hospital name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="disease">Disease/Condition</Label>
                        <Input
                          id="disease"
                          value={formData.medicalDetails?.disease || ""}
                          onChange={(e) =>
                            updateNestedFormData(
                              "medicalDetails",
                              "disease",
                              e.target.value
                            )
                          }
                          placeholder="Enter disease or condition"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="doctorName">Doctor Name</Label>
                        <Input
                          id="doctorName"
                          value={formData.medicalDetails?.doctorName || ""}
                          onChange={(e) =>
                            updateNestedFormData(
                              "medicalDetails",
                              "doctorName",
                              e.target.value
                            )
                          }
                          placeholder="Enter doctor name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="treatmentCost">
                          Treatment Cost (₹)
                        </Label>
                        <Input
                          id="treatmentCost"
                          type="number"
                          value={formData.medicalDetails?.treatmentCost || ""}
                          onChange={(e) =>
                            updateNestedFormData(
                              "medicalDetails",
                              "treatmentCost",
                              parseFloat(e.target.value)
                            )
                          }
                          placeholder="Enter treatment cost"
                          min="0"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="admissionDate">Admission Date</Label>
                      <Input
                        id="admissionDate"
                        type="date"
                        value={formData.medicalDetails?.admissionDate || ""}
                        onChange={(e) =>
                          updateNestedFormData(
                            "medicalDetails",
                            "admissionDate",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                )}

                {/* Income Details */}
                <div className="space-y-4 p-4 border rounded-lg">
                  <h3 className="font-semibold">Income Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="monthlyIncome">Monthly Income (₹)</Label>
                      <Input
                        id="monthlyIncome"
                        type="number"
                        value={formData.incomeDetails?.monthlyIncome || ""}
                        onChange={(e) =>
                          updateNestedFormData(
                            "incomeDetails",
                            "monthlyIncome",
                            parseFloat(e.target.value)
                          )
                        }
                        placeholder="Enter monthly income"
                        min="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="occupation">Occupation</Label>
                      <Input
                        id="occupation"
                        value={formData.incomeDetails?.occupation || ""}
                        onChange={(e) =>
                          updateNestedFormData(
                            "incomeDetails",
                            "occupation",
                            e.target.value
                          )
                        }
                        placeholder="Enter occupation"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="familyMembers">Family Members</Label>
                      <Input
                        id="familyMembers"
                        type="number"
                        value={formData.incomeDetails?.familyMembers || ""}
                        onChange={(e) =>
                          updateNestedFormData(
                            "incomeDetails",
                            "familyMembers",
                            parseInt(e.target.value)
                          )
                        }
                        placeholder="Number of family members"
                        min="1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dependents">Dependents</Label>
                      <Input
                        id="dependents"
                        type="number"
                        value={formData.incomeDetails?.dependents || ""}
                        onChange={(e) =>
                          updateNestedFormData(
                            "incomeDetails",
                            "dependents",
                            parseInt(e.target.value)
                          )
                        }
                        placeholder="Number of dependents"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Bank Details */}
                <div className="space-y-4 p-4 border rounded-lg">
                  <h3 className="font-semibold">Bank Details</h3>
                  <div>
                    <Label htmlFor="accountHolderName">
                      Account Holder Name
                    </Label>
                    <Input
                      id="accountHolderName"
                      value={formData.bankDetails?.accountHolderName || ""}
                      onChange={(e) =>
                        updateNestedFormData(
                          "bankDetails",
                          "accountHolderName",
                          e.target.value
                        )
                      }
                      placeholder="Enter account holder name"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        value={formData.bankDetails?.accountNumber || ""}
                        onChange={(e) =>
                          updateNestedFormData(
                            "bankDetails",
                            "accountNumber",
                            e.target.value
                          )
                        }
                        placeholder="Enter account number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ifscCode">IFSC Code</Label>
                      <Input
                        id="ifscCode"
                        value={formData.bankDetails?.ifscCode || ""}
                        onChange={(e) =>
                          updateNestedFormData(
                            "bankDetails",
                            "ifscCode",
                            e.target.value
                          )
                        }
                        placeholder="Enter IFSC code"
                        maxLength={11}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input
                        id="bankName"
                        value={formData.bankDetails?.bankName || ""}
                        onChange={(e) =>
                          updateNestedFormData(
                            "bankDetails",
                            "bankName",
                            e.target.value
                          )
                        }
                        placeholder="Enter bank name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="branchName">Branch Name</Label>
                      <Input
                        id="branchName"
                        value={formData.bankDetails?.branchName || ""}
                        onChange={(e) =>
                          updateNestedFormData(
                            "bankDetails",
                            "branchName",
                            e.target.value
                          )
                        }
                        placeholder="Enter branch name"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-4">Application Summary</h3>

                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">
                        Applicant Name:
                      </span>
                      <span className="font-medium">
                        {formData.applicantName}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Mobile:</span>
                      <span className="font-medium">{formData.mobile}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">
                        Relief Type:
                      </span>
                      <span className="font-medium">{formData.reliefType}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">
                        Requested Amount:
                      </span>
                      <span className="font-medium">
                        ₹{formData.requestedAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Urgency:</span>
                      <span className="font-medium">{formData.urgency}</span>
                    </div>
                    {formData.purpose && (
                      <div className="grid grid-cols-2 gap-2">
                        <span className="text-muted-foreground">Purpose:</span>
                        <span className="font-medium">{formData.purpose}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-info-light border border-info/20 rounded-lg">
                  <p className="text-sm">
                    Please review all details carefully before submitting. Once
                    submitted, your application will be reviewed by our team.
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

              {step < 4 ? (
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
