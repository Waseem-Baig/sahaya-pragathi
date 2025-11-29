import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  GraduationCap,
  ArrowLeft,
  ArrowRight,
  Send,
  Loader2,
} from "lucide-react";
import { educationAPI } from "@/lib/api";

interface EducationFormState {
  // Student Information
  studentName: string;
  fatherOrGuardianName: string;
  dateOfBirth: string;
  age: string;
  gender: string;
  mobile: string;
  email: string;
  aadhaarNumber: string;
  address: string;
  district: string;
  mandal: string;
  ward: string;
  pincode: string;

  // Education Details
  educationType: string;
  currentClass: string;
  institutionName: string;
  institutionType: string;
  courseOrStream: string;
  academicYear: string;
  rollNumber: string;

  // Support Details
  supportType: string;
  requestedAmount: string;
  purpose: string;
  urgency: string;

  // Academic Performance
  lastExamPercentage: string;
  gpa: string;
  rank: string;
  achievements: string;
  attendance: string;

  // Family Income
  monthlyIncome: string;
  occupation: string;
  familyMembers: string;
  siblings: string;
  siblingsInEducation: string;

  // Bank Details
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  branchName: string;
  accountHolderName: string;
}

interface EducationSupportFormProps {
  onBack: () => void;
  onSubmit?: (data: EducationFormData) => void;
}

interface EducationFormData {
  educationId?: string;
  studentName: string;
  mobile: string;
  educationType: string;
  institutionName: string;
  supportType: string;
  requestedAmount: number;
  status?: string;
  [key: string]: unknown;
}

export const EducationSupportForm = ({
  onBack,
  onSubmit,
}: EducationSupportFormProps) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<EducationFormState>({
    studentName: "",
    fatherOrGuardianName: "",
    dateOfBirth: "",
    age: "",
    gender: "",
    mobile: "",
    email: "",
    aadhaarNumber: "",
    address: "",
    district: "",
    mandal: "",
    ward: "",
    pincode: "",
    educationType: "",
    currentClass: "",
    institutionName: "",
    institutionType: "",
    courseOrStream: "",
    academicYear: "",
    rollNumber: "",
    supportType: "",
    requestedAmount: "",
    purpose: "",
    urgency: "MEDIUM",
    lastExamPercentage: "",
    gpa: "",
    rank: "",
    achievements: "",
    attendance: "",
    monthlyIncome: "",
    occupation: "",
    familyMembers: "",
    siblings: "",
    siblingsInEducation: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    branchName: "",
    accountHolderName: "",
  });

  const handleNext = () => {
    // Basic validation for required fields per step
    if (step === 1) {
      if (!formData.studentName || !formData.mobile) {
        toast({
          title: "Missing Information",
          description:
            "Please fill in all required fields (Student Name, Mobile)",
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
    if (step === 2) {
      if (!formData.educationType || !formData.institutionName) {
        toast({
          title: "Missing Information",
          description: "Please fill in Education Type and Institution Name",
          variant: "destructive",
        });
        return;
      }
    }
    if (step === 3) {
      if (!formData.supportType || !formData.requestedAmount) {
        toast({
          title: "Missing Information",
          description: "Please fill in Support Type and Requested Amount",
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
      const educationData = {
        studentName: formData.studentName,
        fatherOrGuardianName: formData.fatherOrGuardianName || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
        age: formData.age ? parseInt(formData.age) : undefined,
        gender: formData.gender || undefined,
        mobile: formData.mobile,
        email: formData.email || undefined,
        aadhaarNumber: formData.aadhaarNumber || undefined,
        address: formData.address || undefined,
        district: formData.district || undefined,
        mandal: formData.mandal || undefined,
        ward: formData.ward || undefined,
        pincode: formData.pincode || undefined,
        educationType: formData.educationType,
        currentClass: formData.currentClass || undefined,
        institutionName: formData.institutionName,
        institutionType: formData.institutionType || undefined,
        courseOrStream: formData.courseOrStream || undefined,
        academicYear: formData.academicYear || undefined,
        rollNumber: formData.rollNumber || undefined,
        supportType: formData.supportType,
        requestedAmount: parseFloat(formData.requestedAmount),
        purpose: formData.purpose || undefined,
        urgency: formData.urgency,
        academicPerformance: {
          lastExamPercentage: formData.lastExamPercentage
            ? parseFloat(formData.lastExamPercentage)
            : undefined,
          gpa: formData.gpa ? parseFloat(formData.gpa) : undefined,
          rank: formData.rank ? parseInt(formData.rank) : undefined,
          achievements: formData.achievements || undefined,
          attendance: formData.attendance
            ? parseFloat(formData.attendance)
            : undefined,
        },
        familyIncome: {
          monthlyIncome: formData.monthlyIncome
            ? parseFloat(formData.monthlyIncome)
            : undefined,
          occupation: formData.occupation || undefined,
          familyMembers: formData.familyMembers
            ? parseInt(formData.familyMembers)
            : undefined,
          siblings: formData.siblings ? parseInt(formData.siblings) : undefined,
          siblingsInEducation: formData.siblingsInEducation
            ? parseInt(formData.siblingsInEducation)
            : undefined,
        },
        bankDetails: {
          accountNumber: formData.accountNumber || undefined,
          ifscCode: formData.ifscCode || undefined,
          bankName: formData.bankName || undefined,
          branchName: formData.branchName || undefined,
          accountHolderName: formData.accountHolderName || undefined,
        },
        status: "REQUESTED",
      };

      const response = await educationAPI.create(educationData);

      toast({
        title: "Success",
        description: "Education support application submitted successfully!",
      });

      // Call onSubmit callback if provided
      if (onSubmit && response?.data) {
        onSubmit(response.data);
      }

      // Reset form
      setFormData({
        studentName: "",
        fatherOrGuardianName: "",
        dateOfBirth: "",
        age: "",
        gender: "",
        mobile: "",
        email: "",
        aadhaarNumber: "",
        address: "",
        district: "",
        mandal: "",
        ward: "",
        pincode: "",
        educationType: "",
        currentClass: "",
        institutionName: "",
        institutionType: "",
        courseOrStream: "",
        academicYear: "",
        rollNumber: "",
        supportType: "",
        requestedAmount: "",
        purpose: "",
        urgency: "MEDIUM",
        lastExamPercentage: "",
        gpa: "",
        rank: "",
        achievements: "",
        attendance: "",
        monthlyIncome: "",
        occupation: "",
        familyMembers: "",
        siblings: "",
        siblingsInEducation: "",
        accountNumber: "",
        ifscCode: "",
        bankName: "",
        branchName: "",
        accountHolderName: "",
      });
      setStep(1);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Failed to submit application";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: keyof EducationFormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const totalSteps = 6;
  const progress = (step / totalSteps) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Education Support Application
          </CardTitle>
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground">
            Step {step} of {totalSteps}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Student Information */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Student Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="studentName">Student Name *</Label>
                  <Input
                    id="studentName"
                    value={formData.studentName}
                    onChange={(e) =>
                      updateFormData("studentName", e.target.value)
                    }
                    placeholder="Enter student's full name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="fatherOrGuardianName">
                    Father/Guardian Name
                  </Label>
                  <Input
                    id="fatherOrGuardianName"
                    value={formData.fatherOrGuardianName}
                    onChange={(e) =>
                      updateFormData("fatherOrGuardianName", e.target.value)
                    }
                    placeholder="Enter father or guardian name"
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      updateFormData("dateOfBirth", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => updateFormData("age", e.target.value)}
                    placeholder="Age in years"
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={(e) => updateFormData("gender", e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
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
              <div className="space-y-4">
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => updateFormData("address", e.target.value)}
                    placeholder="Complete address"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="district">District</Label>
                    <Input
                      id="district"
                      value={formData.district}
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
                      onChange={(e) =>
                        updateFormData("pincode", e.target.value)
                      }
                      placeholder="Pincode"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Education Details */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Education Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="educationType">Education Type *</Label>
                  <select
                    id="educationType"
                    value={formData.educationType}
                    onChange={(e) =>
                      updateFormData("educationType", e.target.value)
                    }
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="SCHOOL">School</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="UNDERGRADUATE">Undergraduate</option>
                    <option value="POSTGRADUATE">Postgraduate</option>
                    <option value="DIPLOMA">Diploma</option>
                    <option value="VOCATIONAL">Vocational</option>
                    <option value="SKILL_TRAINING">Skill Training</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="currentClass">Current Class/Year</Label>
                  <Input
                    id="currentClass"
                    value={formData.currentClass}
                    onChange={(e) =>
                      updateFormData("currentClass", e.target.value)
                    }
                    placeholder="e.g., 10th, 2nd Year"
                  />
                </div>
                <div>
                  <Label htmlFor="institutionName">Institution Name *</Label>
                  <Input
                    id="institutionName"
                    value={formData.institutionName}
                    onChange={(e) =>
                      updateFormData("institutionName", e.target.value)
                    }
                    placeholder="Name of school/college"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="institutionType">Institution Type</Label>
                  <select
                    id="institutionType"
                    value={formData.institutionType}
                    onChange={(e) =>
                      updateFormData("institutionType", e.target.value)
                    }
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  >
                    <option value="">Select Type</option>
                    <option value="GOVERNMENT">Government</option>
                    <option value="PRIVATE">Private</option>
                    <option value="AIDED">Aided</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="courseOrStream">Course/Stream</Label>
                  <Input
                    id="courseOrStream"
                    value={formData.courseOrStream}
                    onChange={(e) =>
                      updateFormData("courseOrStream", e.target.value)
                    }
                    placeholder="e.g., MPC, B.Tech CSE"
                  />
                </div>
                <div>
                  <Label htmlFor="academicYear">Academic Year</Label>
                  <Input
                    id="academicYear"
                    value={formData.academicYear}
                    onChange={(e) =>
                      updateFormData("academicYear", e.target.value)
                    }
                    placeholder="e.g., 2024-2025"
                  />
                </div>
                <div>
                  <Label htmlFor="rollNumber">Roll Number</Label>
                  <Input
                    id="rollNumber"
                    value={formData.rollNumber}
                    onChange={(e) =>
                      updateFormData("rollNumber", e.target.value)
                    }
                    placeholder="Student roll number"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Support Details */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Support Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="supportType">Support Type *</Label>
                  <select
                    id="supportType"
                    value={formData.supportType}
                    onChange={(e) =>
                      updateFormData("supportType", e.target.value)
                    }
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    required
                  >
                    <option value="">Select Support Type</option>
                    <option value="TUITION_FEE">Tuition Fee</option>
                    <option value="BOOKS">Books</option>
                    <option value="UNIFORM">Uniform</option>
                    <option value="TRANSPORT">Transport</option>
                    <option value="HOSTEL_FEE">Hostel Fee</option>
                    <option value="EXAM_FEE">Exam Fee</option>
                    <option value="LAPTOP">Laptop</option>
                    <option value="SCHOLARSHIP">Scholarship</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="requestedAmount">Requested Amount *</Label>
                  <Input
                    id="requestedAmount"
                    type="number"
                    value={formData.requestedAmount}
                    onChange={(e) =>
                      updateFormData("requestedAmount", e.target.value)
                    }
                    placeholder="Amount in ₹"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="urgency">Urgency</Label>
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
                <Label htmlFor="purpose">Purpose</Label>
                <Textarea
                  id="purpose"
                  value={formData.purpose}
                  onChange={(e) => updateFormData("purpose", e.target.value)}
                  placeholder="Explain the purpose of this support request"
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Step 4: Academic Performance */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Academic Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lastExamPercentage">
                    Last Exam Percentage
                  </Label>
                  <Input
                    id="lastExamPercentage"
                    type="number"
                    step="0.01"
                    value={formData.lastExamPercentage}
                    onChange={(e) =>
                      updateFormData("lastExamPercentage", e.target.value)
                    }
                    placeholder="e.g., 85.5"
                  />
                </div>
                <div>
                  <Label htmlFor="gpa">GPA/CGPA</Label>
                  <Input
                    id="gpa"
                    type="number"
                    step="0.01"
                    value={formData.gpa}
                    onChange={(e) => updateFormData("gpa", e.target.value)}
                    placeholder="e.g., 8.5"
                  />
                </div>
                <div>
                  <Label htmlFor="rank">Rank (if any)</Label>
                  <Input
                    id="rank"
                    type="number"
                    value={formData.rank}
                    onChange={(e) => updateFormData("rank", e.target.value)}
                    placeholder="Class/batch rank"
                  />
                </div>
                <div>
                  <Label htmlFor="attendance">Attendance %</Label>
                  <Input
                    id="attendance"
                    type="number"
                    step="0.01"
                    value={formData.attendance}
                    onChange={(e) =>
                      updateFormData("attendance", e.target.value)
                    }
                    placeholder="e.g., 95"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="achievements">Achievements</Label>
                <Textarea
                  id="achievements"
                  value={formData.achievements}
                  onChange={(e) =>
                    updateFormData("achievements", e.target.value)
                  }
                  placeholder="Academic achievements, awards, certifications, etc."
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Step 5: Family Income Details */}
          {step === 5 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Family Income Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="monthlyIncome">Monthly Family Income</Label>
                  <Input
                    id="monthlyIncome"
                    type="number"
                    value={formData.monthlyIncome}
                    onChange={(e) =>
                      updateFormData("monthlyIncome", e.target.value)
                    }
                    placeholder="Amount in ₹"
                  />
                </div>
                <div>
                  <Label htmlFor="occupation">Parent/Guardian Occupation</Label>
                  <Input
                    id="occupation"
                    value={formData.occupation}
                    onChange={(e) =>
                      updateFormData("occupation", e.target.value)
                    }
                    placeholder="Occupation"
                  />
                </div>
                <div>
                  <Label htmlFor="familyMembers">Total Family Members</Label>
                  <Input
                    id="familyMembers"
                    type="number"
                    value={formData.familyMembers}
                    onChange={(e) =>
                      updateFormData("familyMembers", e.target.value)
                    }
                    placeholder="Number of family members"
                  />
                </div>
                <div>
                  <Label htmlFor="siblings">Number of Siblings</Label>
                  <Input
                    id="siblings"
                    type="number"
                    value={formData.siblings}
                    onChange={(e) => updateFormData("siblings", e.target.value)}
                    placeholder="Number of siblings"
                  />
                </div>
                <div>
                  <Label htmlFor="siblingsInEducation">
                    Siblings in Education
                  </Label>
                  <Input
                    id="siblingsInEducation"
                    type="number"
                    value={formData.siblingsInEducation}
                    onChange={(e) =>
                      updateFormData("siblingsInEducation", e.target.value)
                    }
                    placeholder="How many siblings are studying"
                  />
                </div>
              </div>
              <div className="mt-6">
                <h4 className="text-md font-semibold mb-3">
                  Bank Details (Optional)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      value={formData.accountNumber}
                      onChange={(e) =>
                        updateFormData("accountNumber", e.target.value)
                      }
                      placeholder="Bank account number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ifscCode">IFSC Code</Label>
                    <Input
                      id="ifscCode"
                      value={formData.ifscCode}
                      onChange={(e) =>
                        updateFormData("ifscCode", e.target.value)
                      }
                      placeholder="IFSC code"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      value={formData.bankName}
                      onChange={(e) =>
                        updateFormData("bankName", e.target.value)
                      }
                      placeholder="Bank name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="branchName">Branch Name</Label>
                    <Input
                      id="branchName"
                      value={formData.branchName}
                      onChange={(e) =>
                        updateFormData("branchName", e.target.value)
                      }
                      placeholder="Branch name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="accountHolderName">
                      Account Holder Name
                    </Label>
                    <Input
                      id="accountHolderName"
                      value={formData.accountHolderName}
                      onChange={(e) =>
                        updateFormData("accountHolderName", e.target.value)
                      }
                      placeholder="Account holder name"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Review */}
          {step === 6 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Review Your Application</h3>

              <div className="space-y-4">
                <div className="border-b pb-3">
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                    Student Information
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Name:</span>{" "}
                      {formData.studentName}
                    </div>
                    {formData.fatherOrGuardianName && (
                      <div>
                        <span className="font-medium">Father/Guardian:</span>{" "}
                        {formData.fatherOrGuardianName}
                      </div>
                    )}
                    {formData.dateOfBirth && (
                      <div>
                        <span className="font-medium">DOB:</span>{" "}
                        {formData.dateOfBirth}
                      </div>
                    )}
                    {formData.age && (
                      <div>
                        <span className="font-medium">Age:</span> {formData.age}
                      </div>
                    )}
                    {formData.gender && (
                      <div>
                        <span className="font-medium">Gender:</span>{" "}
                        {formData.gender}
                      </div>
                    )}
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
                      {formData.district && `, ${formData.district}`}
                      {formData.mandal && `, ${formData.mandal}`}
                      {formData.ward && `, ${formData.ward}`}
                      {formData.pincode && ` - ${formData.pincode}`}
                    </div>
                  )}
                </div>

                <div className="border-b pb-3">
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                    Education Details
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Type:</span>{" "}
                      {formData.educationType}
                    </div>
                    {formData.currentClass && (
                      <div>
                        <span className="font-medium">Class/Year:</span>{" "}
                        {formData.currentClass}
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Institution:</span>{" "}
                      {formData.institutionName}
                    </div>
                    {formData.institutionType && (
                      <div>
                        <span className="font-medium">Institution Type:</span>{" "}
                        {formData.institutionType}
                      </div>
                    )}
                    {formData.courseOrStream && (
                      <div>
                        <span className="font-medium">Course/Stream:</span>{" "}
                        {formData.courseOrStream}
                      </div>
                    )}
                    {formData.academicYear && (
                      <div>
                        <span className="font-medium">Academic Year:</span>{" "}
                        {formData.academicYear}
                      </div>
                    )}
                    {formData.rollNumber && (
                      <div>
                        <span className="font-medium">Roll Number:</span>{" "}
                        {formData.rollNumber}
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-b pb-3">
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                    Support Details
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Support Type:</span>{" "}
                      {formData.supportType}
                    </div>
                    <div>
                      <span className="font-medium">Requested Amount:</span> ₹
                      {formData.requestedAmount}
                    </div>
                    <div>
                      <span className="font-medium">Urgency:</span>{" "}
                      {formData.urgency}
                    </div>
                  </div>
                  {formData.purpose && (
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Purpose:</span>{" "}
                      {formData.purpose}
                    </div>
                  )}
                </div>

                {(formData.lastExamPercentage ||
                  formData.gpa ||
                  formData.achievements) && (
                  <div className="border-b pb-3">
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                      Academic Performance
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {formData.lastExamPercentage && (
                        <div>
                          <span className="font-medium">Last Exam %:</span>{" "}
                          {formData.lastExamPercentage}%
                        </div>
                      )}
                      {formData.gpa && (
                        <div>
                          <span className="font-medium">GPA:</span>{" "}
                          {formData.gpa}
                        </div>
                      )}
                      {formData.rank && (
                        <div>
                          <span className="font-medium">Rank:</span>{" "}
                          {formData.rank}
                        </div>
                      )}
                      {formData.attendance && (
                        <div>
                          <span className="font-medium">Attendance:</span>{" "}
                          {formData.attendance}%
                        </div>
                      )}
                    </div>
                    {formData.achievements && (
                      <div className="mt-2 text-sm">
                        <span className="font-medium">Achievements:</span>{" "}
                        {formData.achievements}
                      </div>
                    )}
                  </div>
                )}

                {(formData.monthlyIncome || formData.occupation) && (
                  <div className="border-b pb-3">
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                      Family Income
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {formData.monthlyIncome && (
                        <div>
                          <span className="font-medium">Monthly Income:</span> ₹
                          {formData.monthlyIncome}
                        </div>
                      )}
                      {formData.occupation && (
                        <div>
                          <span className="font-medium">Occupation:</span>{" "}
                          {formData.occupation}
                        </div>
                      )}
                      {formData.familyMembers && (
                        <div>
                          <span className="font-medium">Family Members:</span>{" "}
                          {formData.familyMembers}
                        </div>
                      )}
                      {formData.siblings && (
                        <div>
                          <span className="font-medium">Siblings:</span>{" "}
                          {formData.siblings}
                        </div>
                      )}
                      {formData.siblingsInEducation && (
                        <div>
                          <span className="font-medium">
                            Siblings in Education:
                          </span>{" "}
                          {formData.siblingsInEducation}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {formData.accountNumber && (
                  <div className="border-b pb-3">
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                      Bank Details
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium">Account Number:</span>{" "}
                        {formData.accountNumber}
                      </div>
                      {formData.ifscCode && (
                        <div>
                          <span className="font-medium">IFSC:</span>{" "}
                          {formData.ifscCode}
                        </div>
                      )}
                      {formData.bankName && (
                        <div>
                          <span className="font-medium">Bank:</span>{" "}
                          {formData.bankName}
                        </div>
                      )}
                      {formData.branchName && (
                        <div>
                          <span className="font-medium">Branch:</span>{" "}
                          {formData.branchName}
                        </div>
                      )}
                      {formData.accountHolderName && (
                        <div>
                          <span className="font-medium">Account Holder:</span>{" "}
                          {formData.accountHolderName}
                        </div>
                      )}
                    </div>
                  </div>
                )}
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
              {step === 1 ? "Back to Form Selection" : "Previous"}
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
                    Submit Application
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
