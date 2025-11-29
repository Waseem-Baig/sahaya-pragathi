import { useState, useEffect, useCallback, useMemo } from "react";
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
import { cmReliefAPI, usersAPI } from "@/lib/api";
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

const RELIEF_TYPES = [
  { value: "MEDICAL", label: "Medical Treatment" },
  { value: "EDUCATION", label: "Education Support" },
  { value: "ACCIDENT", label: "Accident Relief" },
  { value: "NATURAL_DISASTER", label: "Natural Disaster" },
  { value: "FINANCIAL_ASSISTANCE", label: "Financial Assistance" },
  { value: "FUNERAL", label: "Funeral Assistance" },
  { value: "OTHER", label: "Other" },
];

const URGENCY_LEVELS = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "CRITICAL", label: "Critical" },
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
        <Label htmlFor="father_or_husband_name">Father/Husband Name</Label>
        <Input
          id="father_or_husband_name"
          value={asString(data.father_or_husband_name)}
          onChange={(e) =>
            updateField("father_or_husband_name", e.target.value)
          }
          placeholder="Enter father or husband name"
        />
      </div>
      <div>
        <Label htmlFor="age">Age</Label>
        <Input
          id="age"
          type="number"
          value={asString(data.age)}
          onChange={(e) => updateField("age", e.target.value)}
          placeholder="Age"
        />
      </div>
      <div>
        <Label htmlFor="gender">Gender</Label>
        <Select
          value={asString(data.gender)}
          onValueChange={(value) => updateField("gender", value)}
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
        <Label htmlFor="aadhaar">Aadhaar Number</Label>
        <Input
          id="aadhaar"
          value={asString(data.aadhaar)}
          onChange={(e) => updateField("aadhaar", e.target.value)}
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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
        <Label htmlFor="ward">Ward</Label>
        <Input
          id="ward"
          value={asString(data.ward)}
          onChange={(e) => updateField("ward", e.target.value)}
          placeholder="Ward"
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

// Step 2: Relief Details
const ReliefDetailsStep = ({ data, updateField }: StepProps) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Relief Details</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="relief_type">Relief Type *</Label>
        <Select
          value={asString(data.relief_type)}
          onValueChange={(value) => updateField("relief_type", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select relief type" />
          </SelectTrigger>
          <SelectContent>
            {RELIEF_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="urgency">Urgency Level</Label>
        <Select
          value={asString(data.urgency)}
          onValueChange={(value) => updateField("urgency", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select urgency" />
          </SelectTrigger>
          <SelectContent>
            {URGENCY_LEVELS.map((level) => (
              <SelectItem key={level.value} value={level.value}>
                {level.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="requested_amount">Requested Amount (₹) *</Label>
        <Input
          id="requested_amount"
          type="number"
          value={asString(data.requested_amount)}
          onChange={(e) => updateField("requested_amount", e.target.value)}
          placeholder="Enter amount"
        />
      </div>
    </div>
    <div>
      <Label htmlFor="purpose">Purpose *</Label>
      <Textarea
        id="purpose"
        value={asString(data.purpose)}
        onChange={(e) => updateField("purpose", e.target.value)}
        placeholder="Describe the purpose of relief request"
        rows={4}
      />
    </div>
  </div>
);

// Step 3: Medical & Income Details
const MedicalIncomeStep = ({ data, updateField }: StepProps) => {
  const admissionDate = data.admission_date
    ? new Date(asString(data.admission_date))
    : undefined;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Medical Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="hospital_name">Hospital Name</Label>
            <Input
              id="hospital_name"
              value={asString(data.hospital_name)}
              onChange={(e) => updateField("hospital_name", e.target.value)}
              placeholder="Hospital name"
            />
          </div>
          <div>
            <Label htmlFor="disease">Disease/Condition</Label>
            <Input
              id="disease"
              value={asString(data.disease)}
              onChange={(e) => updateField("disease", e.target.value)}
              placeholder="Disease or medical condition"
            />
          </div>
          <div>
            <Label htmlFor="treatment_cost">Treatment Cost (₹)</Label>
            <Input
              id="treatment_cost"
              type="number"
              value={asString(data.treatment_cost)}
              onChange={(e) => updateField("treatment_cost", e.target.value)}
              placeholder="Estimated treatment cost"
            />
          </div>
          <div>
            <Label htmlFor="doctor_name">Doctor Name</Label>
            <Input
              id="doctor_name"
              value={asString(data.doctor_name)}
              onChange={(e) => updateField("doctor_name", e.target.value)}
              placeholder="Attending doctor"
            />
          </div>
          <div>
            <Label>Admission Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !admissionDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {admissionDate ? format(admissionDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={admissionDate}
                  onSelect={(date) =>
                    updateField("admission_date", date?.toISOString())
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Income Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="monthly_income">Monthly Income (₹)</Label>
            <Input
              id="monthly_income"
              type="number"
              value={asString(data.monthly_income)}
              onChange={(e) => updateField("monthly_income", e.target.value)}
              placeholder="Monthly family income"
            />
          </div>
          <div>
            <Label htmlFor="occupation">Occupation</Label>
            <Input
              id="occupation"
              value={asString(data.occupation)}
              onChange={(e) => updateField("occupation", e.target.value)}
              placeholder="Occupation"
            />
          </div>
          <div>
            <Label htmlFor="family_members">Family Members</Label>
            <Input
              id="family_members"
              type="number"
              value={asString(data.family_members)}
              onChange={(e) => updateField("family_members", e.target.value)}
              placeholder="Number of family members"
            />
          </div>
          <div>
            <Label htmlFor="dependents">Dependents</Label>
            <Input
              id="dependents"
              type="number"
              value={asString(data.dependents)}
              onChange={(e) => updateField("dependents", e.target.value)}
              placeholder="Number of dependents"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 4: Bank Details
const BankDetailsStep = ({ data, updateField }: StepProps) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Bank Details</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="account_number">Account Number *</Label>
        <Input
          id="account_number"
          value={asString(data.account_number)}
          onChange={(e) => updateField("account_number", e.target.value)}
          placeholder="Bank account number"
        />
      </div>
      <div>
        <Label htmlFor="ifsc_code">IFSC Code *</Label>
        <Input
          id="ifsc_code"
          value={asString(data.ifsc_code)}
          onChange={(e) => updateField("ifsc_code", e.target.value)}
          placeholder="Bank IFSC code"
        />
      </div>
      <div>
        <Label htmlFor="bank_name">Bank Name *</Label>
        <Input
          id="bank_name"
          value={asString(data.bank_name)}
          onChange={(e) => updateField("bank_name", e.target.value)}
          placeholder="Bank name"
        />
      </div>
      <div>
        <Label htmlFor="branch_name">Branch Name</Label>
        <Input
          id="branch_name"
          value={asString(data.branch_name)}
          onChange={(e) => updateField("branch_name", e.target.value)}
          placeholder="Branch name"
        />
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="account_holder_name">Account Holder Name *</Label>
        <Input
          id="account_holder_name"
          value={asString(data.account_holder_name)}
          onChange={(e) => updateField("account_holder_name", e.target.value)}
          placeholder="Name as per bank account"
        />
      </div>
    </div>
  </div>
);

// Step 5: Documents
const DocumentsStep = ({ data, updateField }: StepProps) => {
  const handleFilesChange = useMemo(
    () => (files: File[]) => updateField("attachments", files),
    [updateField]
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Supporting Documents</h3>
      <p className="text-sm text-muted-foreground">
        Upload required documents (Aadhaar, medical certificates, income proof,
        bank passbook, etc.)
      </p>
      <FileUpload
        onFilesChange={handleFilesChange}
        maxFiles={10}
        maxSizePerFile={10 * 1024 * 1024}
      />
    </div>
  );
};

// Step 6: Assignment
const AssignmentStep = ({ data, updateField }: StepProps) => {
  const [officers, setOfficers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOfficers = async () => {
      try {
        const response = await usersAPI.getAllUsers({ role: "L2_EXEC_ADMIN" });
        if (response.success && response.data) {
          setOfficers(response.data);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load officers",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOfficers();
  }, [toast]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Assignment</h3>
      <div>
        <Label htmlFor="assigned_to">Assign to Officer</Label>
        {loading ? (
          <div className="flex items-center gap-2 p-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">
              Loading officers...
            </span>
          </div>
        ) : (
          <Select
            value={asString(data.assigned_to) || "UNASSIGNED"}
            onValueChange={(value) =>
              updateField("assigned_to", value === "UNASSIGNED" ? "" : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select officer (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UNASSIGNED">Unassigned</SelectItem>
              {officers.map((officer) => (
                <SelectItem key={officer._id} value={officer._id}>
                  {officer.firstName} {officer.lastName} ({officer.email})
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
            <SelectItem value="CRITICAL">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default function CMReliefForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!id);

  const totalSteps = 6;

  useEffect(() => {
    if (id) {
      const fetchCMRelief = async () => {
        try {
          const response = await cmReliefAPI.getById(id);
          if (response.success && response.data) {
            const cmrelief = response.data;
            // Transform backend data to form format
            setFormData({
              applicant_name: cmrelief.applicantName || "",
              father_or_husband_name: cmrelief.fatherOrHusbandName || "",
              age: cmrelief.age || "",
              gender: cmrelief.gender || "",
              mobile: cmrelief.mobile || "",
              email: cmrelief.email || "",
              aadhaar: cmrelief.aadhaar || "",
              address: cmrelief.address || "",
              district: cmrelief.district || "",
              mandal: cmrelief.mandal || "",
              ward: cmrelief.ward || "",
              pincode: cmrelief.pincode || "",
              relief_type: cmrelief.reliefType || "",
              urgency: cmrelief.urgency || "MEDIUM",
              requested_amount: cmrelief.requestedAmount || "",
              purpose: cmrelief.purpose || "",
              hospital_name:
                (cmrelief.medicalDetails as Record<string, unknown>)
                  ?.hospitalName || "",
              disease:
                (cmrelief.medicalDetails as Record<string, unknown>)?.disease ||
                "",
              treatment_cost:
                (cmrelief.medicalDetails as Record<string, unknown>)
                  ?.treatmentCost || "",
              doctor_name:
                (cmrelief.medicalDetails as Record<string, unknown>)
                  ?.doctorName || "",
              admission_date:
                (cmrelief.medicalDetails as Record<string, unknown>)
                  ?.admissionDate || "",
              monthly_income:
                (cmrelief.incomeDetails as Record<string, unknown>)
                  ?.monthlyIncome || "",
              occupation:
                (cmrelief.incomeDetails as Record<string, unknown>)
                  ?.occupation || "",
              family_members:
                (cmrelief.incomeDetails as Record<string, unknown>)
                  ?.familyMembers || "",
              dependents:
                (cmrelief.incomeDetails as Record<string, unknown>)
                  ?.dependents || "",
              account_number:
                (cmrelief.bankDetails as Record<string, unknown>)
                  ?.accountNumber || "",
              ifsc_code:
                (cmrelief.bankDetails as Record<string, unknown>)?.ifscCode ||
                "",
              bank_name:
                (cmrelief.bankDetails as Record<string, unknown>)?.bankName ||
                "",
              branch_name:
                (cmrelief.bankDetails as Record<string, unknown>)?.branchName ||
                "",
              account_holder_name:
                (cmrelief.bankDetails as Record<string, unknown>)
                  ?.accountHolderName || "",
              assigned_to:
                typeof cmrelief.assignedTo === "object" &&
                cmrelief.assignedTo !== null
                  ? ((cmrelief.assignedTo as Record<string, unknown>)
                      ._id as string)
                  : "",
              priority: cmrelief.priority || "MEDIUM",
            });
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to load CM Relief request",
            variant: "destructive",
          });
          navigate("/admin/cm-relief");
        } finally {
          setInitialLoading(false);
        }
      };

      fetchCMRelief();
    }
  }, [id, navigate, toast]);

  const updateField = useCallback((field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleNext = useCallback(() => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, totalSteps]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const handleSubmit = useCallback(async () => {
    try {
      setLoading(true);

      // Transform form data to backend format
      const payload = {
        applicantName: formData.applicant_name as string,
        fatherOrHusbandName: formData.father_or_husband_name as string,
        age: formData.age ? Number(formData.age) : undefined,
        gender: formData.gender as string,
        mobile: formData.mobile as string,
        email: formData.email as string,
        aadhaar: formData.aadhaar as string,
        address: formData.address as string,
        district: formData.district as string,
        mandal: formData.mandal as string,
        ward: formData.ward as string,
        pincode: formData.pincode as string,
        reliefType: formData.relief_type as string,
        urgency: (formData.urgency as string) || "MEDIUM",
        requestedAmount: Number(formData.requested_amount),
        purpose: formData.purpose as string,
        medicalDetails: {
          hospitalName: formData.hospital_name as string,
          disease: formData.disease as string,
          treatmentCost: formData.treatment_cost
            ? Number(formData.treatment_cost)
            : undefined,
          doctorName: formData.doctor_name as string,
          admissionDate: formData.admission_date as string,
        },
        incomeDetails: {
          monthlyIncome: formData.monthly_income
            ? Number(formData.monthly_income)
            : undefined,
          occupation: formData.occupation as string,
          familyMembers: formData.family_members
            ? Number(formData.family_members)
            : undefined,
          dependents: formData.dependents
            ? Number(formData.dependents)
            : undefined,
        },
        bankDetails: {
          accountNumber: formData.account_number as string,
          ifscCode: formData.ifsc_code as string,
          bankName: formData.bank_name as string,
          branchName: formData.branch_name as string,
          accountHolderName: formData.account_holder_name as string,
        },
        assignedTo: (formData.assigned_to as string) || undefined,
        priority: (formData.priority as string) || "MEDIUM",
        attachments: [], // TODO: Handle file uploads
      };

      let response;
      if (id) {
        response = await cmReliefAPI.update(id, payload);
      } else {
        response = await cmReliefAPI.create(payload);
      }

      if (response.success) {
        toast({
          title: "Success",
          description: id
            ? "CM Relief request updated successfully"
            : `CM Relief request created with ID: ${
                response.data?.cmrfId || ""
              }`,
        });
        navigate("/admin/cm-relief");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to submit CM Relief request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [formData, id, navigate, toast]);

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ApplicantStep data={formData} updateField={updateField} />;
      case 2:
        return <ReliefDetailsStep data={formData} updateField={updateField} />;
      case 3:
        return <MedicalIncomeStep data={formData} updateField={updateField} />;
      case 4:
        return <BankDetailsStep data={formData} updateField={updateField} />;
      case 5:
        return <DocumentsStep data={formData} updateField={updateField} />;
      case 6:
        return <AssignmentStep data={formData} updateField={updateField} />;
      default:
        return <ApplicantStep data={formData} updateField={updateField} />;
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Button
        variant="outline"
        onClick={() => navigate("/admin/cm-relief")}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to CM Relief
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>
            {id ? "Edit CM Relief Request" : "New CM Relief Request"}
          </CardTitle>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Applicant</span>
              <span>Relief</span>
              <span>Medical/Income</span>
              <span>Bank</span>
              <span>Documents</span>
              <span>Assignment</span>
            </div>
            <Progress value={(currentStep / totalSteps) * 100} />
            <p className="text-sm text-muted-foreground mt-2">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {renderStep()}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                <Send className="h-4 w-4 mr-2" />
                {id ? "Update" : "Submit"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
