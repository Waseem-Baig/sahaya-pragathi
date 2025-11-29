import { useState, useEffect, useMemo } from "react";
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
import { ArrowLeft, ArrowRight, Save, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { educationAPI, usersAPI } from "@/lib/api";
import { format } from "date-fns";
import type { User } from "@/types/auth";

interface EducationFormData {
  // Applicant Details
  applicantName: string;
  relationToStudent: string;
  mobile: string;
  email: string;
  aadhaar: string;
  district: string;
  mandal: string;
  ward: string;
  pincode: string;

  // Student Details
  studentName: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  gender: string;
  studentClass: string;
  institutionName: string;
  rollNumber: string;
  boardOrUniversity: string;

  // Education Details
  educationType: string;
  applicationType: string;
  educationLevel: string;
  institutionType: string;
  courseOrStream: string;

  // Fee Details
  totalFee: string;
  amountRequested: string;
  feeType: string;
  academicYear: string;
  semester: string;

  // Academic Details
  percentage: string;
  grade: string;
  totalMarks: string;

  // Family Income
  monthlyIncome: string;
  occupation: string;
  annualIncome: string;
  numberOfDependents: string;

  // Scholarship (Optional)
  scholarshipName: string;
  scholarshipAmount: string;
  scholarshipStatus: string;
  scholarshipProvider: string;

  // Assignment
  assignedTo: string;
  priority: string;
  purpose: string;
}

const initialFormData: EducationFormData = {
  applicantName: "",
  relationToStudent: "",
  mobile: "",
  email: "",
  aadhaar: "",
  district: "",
  mandal: "",
  ward: "",
  pincode: "",
  studentName: "",
  fatherName: "",
  motherName: "",
  dateOfBirth: "",
  gender: "",
  studentClass: "",
  institutionName: "",
  rollNumber: "",
  boardOrUniversity: "",
  educationType: "",
  applicationType: "",
  educationLevel: "",
  institutionType: "",
  courseOrStream: "",
  totalFee: "",
  amountRequested: "",
  feeType: "",
  academicYear: "",
  semester: "",
  percentage: "",
  grade: "",
  totalMarks: "",
  monthlyIncome: "",
  occupation: "",
  annualIncome: "",
  numberOfDependents: "",
  scholarshipName: "",
  scholarshipAmount: "",
  scholarshipStatus: "",
  scholarshipProvider: "",
  assignedTo: "UNASSIGNED",
  priority: "MEDIUM",
  purpose: "",
};

export default function EducationForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<EducationFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [existingAttachments, setExistingAttachments] = useState<
    Array<{ filename: string; url: string; uploadedAt: Date }>
  >([]);

  const isEditMode = Boolean(id && id !== "new");

  const steps = [
    "Applicant Details",
    "Student Details",
    "Education Details",
    "Fee Details",
    "Academic Details",
    "Family Income",
    "Scholarship (Optional)",
    "Assignment & Documents",
  ];

  useEffect(() => {
    if (isEditMode) {
      fetchEducationData();
    }
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditMode]);

  const fetchEducationData = async () => {
    try {
      setLoading(true);
      const response = await educationAPI.getById(id!);
      if (response.success && response.data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = response.data as any; // Type assertion for backend data
        setFormData({
          applicantName: "", // Not in backend, keep empty
          relationToStudent: "", // Not in backend, keep empty
          mobile: (data.mobile as string) || "",
          email: (data.email as string) || "",
          aadhaar: (data.aadhaarNumber as string) || "",
          district: (data.district as string) || "",
          mandal: (data.mandal as string) || "",
          ward: (data.ward as string) || "",
          pincode: (data.pincode as string) || "",
          studentName: (data.studentName as string) || "",
          fatherName: (data.fatherOrGuardianName as string) || "",
          motherName: (data.motherName as string) || "",
          dateOfBirth: data.dateOfBirth
            ? format(new Date(data.dateOfBirth), "yyyy-MM-dd")
            : "",
          gender: (data.gender as string) || "",
          studentClass: (data.currentClass as string) || "",
          institutionName: (data.institutionName as string) || "",
          rollNumber: (data.rollNumber as string) || "",
          boardOrUniversity: (data.boardOrUniversity as string) || "",
          educationType: (data.educationType as string) || "",
          applicationType: (data.supportType as string) || "", // Map supportType to applicationType form field
          educationLevel: "", // Not in backend, keep empty
          institutionType: (data.institutionType as string) || "",
          courseOrStream: (data.courseOrStream as string) || "",
          totalFee: "", // Not in backend as flat field
          amountRequested: data.requestedAmount?.toString() || "",
          feeType: (data.supportType as string) || "", // Also map to feeType
          academicYear: (data.academicYear as string) || "",
          semester: "", // Not in backend
          percentage:
            data.academicPerformance?.lastExamPercentage?.toString() || "",
          grade: data.academicPerformance?.grade || "",
          totalMarks: data.academicPerformance?.totalMarks?.toString() || "",
          monthlyIncome: data.familyIncome?.monthlyIncome?.toString() || "",
          occupation: data.familyIncome?.occupation || "",
          annualIncome: data.familyIncome?.annualIncome?.toString() || "",
          numberOfDependents:
            data.familyIncome?.familyMembers?.toString() || "",
          scholarshipName: data.scholarshipDetails?.scholarshipName || "",
          scholarshipAmount:
            data.scholarshipDetails?.scholarshipAmount?.toString() || "",
          scholarshipStatus: data.scholarshipDetails?.scholarshipStatus || "",
          scholarshipProvider:
            data.scholarshipDetails?.scholarshipProvider || "",
          assignedTo:
            typeof data.assignedTo === "object" && data.assignedTo
              ? (data.assignedTo as { _id: string })._id
              : (data.assignedTo as string) || "UNASSIGNED",
          priority:
            (data.urgency as string) || (data.priority as string) || "MEDIUM", // Map urgency to priority
          purpose: (data.purpose as string) || "",
        });

        // Set existing attachments if available
        if (data.attachments && Array.isArray(data.attachments)) {
          setExistingAttachments(data.attachments);
        }
      }
    } catch (error) {
      console.error("Error fetching education data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch education data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await usersAPI.getAll({ role: "L2_EXEC_ADMIN" });
      if (response.success && response.data) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users for assignment",
        variant: "destructive",
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleInputChange = (field: keyof EducationFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = useMemo(
    () => (files: File[]) => {
      setAttachments(files);
    },
    []
  );

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

      // Map form data to backend schema (flat structure)
      // Backend expects flat structure, not the nested EducationData interface
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: any = {
        // Student Information (required fields at root level)
        studentName: formData.studentName,
        fatherOrGuardianName: formData.fatherName || undefined,
        motherName: formData.motherName || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
        gender: formData.gender || undefined,
        mobile: formData.mobile,
        email: formData.email || undefined,
        aadhaarNumber: formData.aadhaar || undefined,
        district: formData.district || undefined,
        mandal: formData.mandal || undefined,
        ward: formData.ward || undefined,
        pincode: formData.pincode || undefined,

        // Education Details (required fields)
        educationType: formData.educationType,
        currentClass: formData.studentClass || undefined,
        institutionName: formData.institutionName,
        institutionType: formData.institutionType || undefined,
        courseOrStream: formData.courseOrStream || undefined,
        academicYear: formData.academicYear || undefined,
        rollNumber: formData.rollNumber || undefined,
        boardOrUniversity: formData.boardOrUniversity || undefined,

        // Support Details (required fields)
        supportType: formData.applicationType || formData.feeType, // Use applicationType or feeType
        requestedAmount: formData.amountRequested
          ? parseFloat(formData.amountRequested)
          : 0,
        purpose: formData.purpose || undefined,
        urgency: formData.priority || "MEDIUM", // Map priority to urgency

        // Academic Performance (nested object)
        academicPerformance: {
          lastExamPercentage: formData.percentage
            ? parseFloat(formData.percentage)
            : undefined,
          grade: formData.grade || undefined,
          totalMarks: formData.totalMarks
            ? parseFloat(formData.totalMarks)
            : undefined,
        },

        // Financial Details (nested object)
        familyIncome: {
          monthlyIncome: formData.monthlyIncome
            ? parseFloat(formData.monthlyIncome)
            : undefined,
          occupation: formData.occupation || undefined,
          annualIncome: formData.annualIncome
            ? parseFloat(formData.annualIncome)
            : undefined,
          familyMembers: formData.numberOfDependents
            ? parseInt(formData.numberOfDependents)
            : undefined,
        },

        // Assignment
        assignedTo:
          formData.assignedTo === "UNASSIGNED"
            ? undefined
            : formData.assignedTo,
        priority: formData.priority || "MEDIUM",
      };

      let response;
      if (isEditMode) {
        response = await educationAPI.update(id!, payload);
      } else {
        response = await educationAPI.create(payload);
      }

      if (response.success) {
        toast({
          title: "Success",
          description: `Education support request ${
            isEditMode ? "updated" : "created"
          } successfully`,
        });
        navigate("/admin/education");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      const err = error as { response?: { data?: { error?: string } } };
      toast({
        title: "Error",
        description:
          err.response?.data?.error ||
          `Failed to ${
            isEditMode ? "update" : "create"
          } education support request`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        // Applicant Details
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="applicantName">Applicant Name *</Label>
                <Input
                  id="applicantName"
                  value={formData.applicantName}
                  onChange={(e) =>
                    handleInputChange("applicantName", e.target.value)
                  }
                  placeholder="Enter applicant name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="relationToStudent">Relation to Student *</Label>
                <Select
                  value={formData.relationToStudent}
                  onValueChange={(value) =>
                    handleInputChange("relationToStudent", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select relation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Father">Father</SelectItem>
                    <SelectItem value="Mother">Mother</SelectItem>
                    <SelectItem value="Guardian">Guardian</SelectItem>
                    <SelectItem value="Self">Self</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mobile">Mobile Number *</Label>
                <Input
                  id="mobile"
                  value={formData.mobile}
                  onChange={(e) => handleInputChange("mobile", e.target.value)}
                  placeholder="Enter mobile number"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter email"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="aadhaar">Aadhaar Number</Label>
              <Input
                id="aadhaar"
                value={formData.aadhaar}
                onChange={(e) => handleInputChange("aadhaar", e.target.value)}
                placeholder="Enter Aadhaar number"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="district">District *</Label>
                <Select
                  value={formData.district}
                  onValueChange={(value) =>
                    handleInputChange("district", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Guntur">Guntur</SelectItem>
                    <SelectItem value="Krishna">Krishna</SelectItem>
                    <SelectItem value="Prakasam">Prakasam</SelectItem>
                    <SelectItem value="Nellore">Nellore</SelectItem>
                    <SelectItem value="Visakhapatnam">Visakhapatnam</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="mandal">Mandal</Label>
                <Input
                  id="mandal"
                  value={formData.mandal}
                  onChange={(e) => handleInputChange("mandal", e.target.value)}
                  placeholder="Enter mandal"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ward">Ward</Label>
                <Input
                  id="ward"
                  value={formData.ward}
                  onChange={(e) => handleInputChange("ward", e.target.value)}
                  placeholder="Enter ward"
                />
              </div>
              <div>
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  value={formData.pincode}
                  onChange={(e) => handleInputChange("pincode", e.target.value)}
                  placeholder="Enter pincode"
                />
              </div>
            </div>
          </div>
        );

      case 1:
        // Student Details
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="studentName">Student Name *</Label>
                <Input
                  id="studentName"
                  value={formData.studentName}
                  onChange={(e) =>
                    handleInputChange("studentName", e.target.value)
                  }
                  placeholder="Enter student name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender *</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleInputChange("gender", value)}
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fatherName">Father's Name *</Label>
                <Input
                  id="fatherName"
                  value={formData.fatherName}
                  onChange={(e) =>
                    handleInputChange("fatherName", e.target.value)
                  }
                  placeholder="Enter father's name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="motherName">Mother's Name</Label>
                <Input
                  id="motherName"
                  value={formData.motherName}
                  onChange={(e) =>
                    handleInputChange("motherName", e.target.value)
                  }
                  placeholder="Enter mother's name"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  handleInputChange("dateOfBirth", e.target.value)
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="studentClass">Class/Year *</Label>
                <Input
                  id="studentClass"
                  value={formData.studentClass}
                  onChange={(e) =>
                    handleInputChange("studentClass", e.target.value)
                  }
                  placeholder="e.g., 10th, 1st Year B.Tech"
                  required
                />
              </div>
              <div>
                <Label htmlFor="rollNumber">Roll Number</Label>
                <Input
                  id="rollNumber"
                  value={formData.rollNumber}
                  onChange={(e) =>
                    handleInputChange("rollNumber", e.target.value)
                  }
                  placeholder="Enter roll number"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="institutionName">Institution Name *</Label>
                <Input
                  id="institutionName"
                  value={formData.institutionName}
                  onChange={(e) =>
                    handleInputChange("institutionName", e.target.value)
                  }
                  placeholder="Enter institution name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="boardOrUniversity">Board/University</Label>
                <Input
                  id="boardOrUniversity"
                  value={formData.boardOrUniversity}
                  onChange={(e) =>
                    handleInputChange("boardOrUniversity", e.target.value)
                  }
                  placeholder="e.g., CBSE, JNTU"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        // Education Details
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="educationType">Education Type *</Label>
              <Select
                value={formData.educationType}
                onValueChange={(value) =>
                  handleInputChange("educationType", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select education type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SCHOOL">School</SelectItem>
                  <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                  <SelectItem value="UNDERGRADUATE">Undergraduate</SelectItem>
                  <SelectItem value="POSTGRADUATE">Postgraduate</SelectItem>
                  <SelectItem value="DIPLOMA">Diploma</SelectItem>
                  <SelectItem value="VOCATIONAL">Vocational</SelectItem>
                  <SelectItem value="SKILL_TRAINING">Skill Training</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="applicationType">Support Type *</Label>
                <Select
                  value={formData.applicationType}
                  onValueChange={(value) =>
                    handleInputChange("applicationType", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select support type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TUITION_FEE">Tuition Fee</SelectItem>
                    <SelectItem value="BOOKS">Books</SelectItem>
                    <SelectItem value="UNIFORM">Uniform</SelectItem>
                    <SelectItem value="TRANSPORT">Transport</SelectItem>
                    <SelectItem value="HOSTEL_FEE">Hostel Fee</SelectItem>
                    <SelectItem value="EXAM_FEE">Exam Fee</SelectItem>
                    <SelectItem value="LAPTOP">Laptop</SelectItem>
                    <SelectItem value="SCHOLARSHIP">Scholarship</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="educationLevel">Education Level *</Label>
                <Select
                  value={formData.educationLevel}
                  onValueChange={(value) =>
                    handleInputChange("educationLevel", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PRIMARY">Primary</SelectItem>
                    <SelectItem value="SECONDARY">Secondary</SelectItem>
                    <SelectItem value="HIGHER_SECONDARY">
                      Higher Secondary
                    </SelectItem>
                    <SelectItem value="UNDERGRADUATE">Undergraduate</SelectItem>
                    <SelectItem value="POSTGRADUATE">Postgraduate</SelectItem>
                    <SelectItem value="PROFESSIONAL">Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="institutionType">Institution Type</Label>
                <Select
                  value={formData.institutionType}
                  onValueChange={(value) =>
                    handleInputChange("institutionType", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select institution type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GOVERNMENT">Government</SelectItem>
                    <SelectItem value="PRIVATE">Private</SelectItem>
                    <SelectItem value="AIDED">Aided</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="courseOrStream">Course/Stream</Label>
                <Input
                  id="courseOrStream"
                  value={formData.courseOrStream}
                  onChange={(e) =>
                    handleInputChange("courseOrStream", e.target.value)
                  }
                  placeholder="e.g., Science, Commerce, B.Tech CSE"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        // Fee Details
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="totalFee">Total Fee Amount *</Label>
                <Input
                  id="totalFee"
                  type="number"
                  value={formData.totalFee}
                  onChange={(e) =>
                    handleInputChange("totalFee", e.target.value)
                  }
                  placeholder="Enter total fee"
                  required
                />
              </div>
              <div>
                <Label htmlFor="amountRequested">Amount Requested *</Label>
                <Input
                  id="amountRequested"
                  type="number"
                  value={formData.amountRequested}
                  onChange={(e) =>
                    handleInputChange("amountRequested", e.target.value)
                  }
                  placeholder="Enter requested amount"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="feeType">Fee Type</Label>
                <Input
                  id="feeType"
                  value={formData.feeType}
                  onChange={(e) => handleInputChange("feeType", e.target.value)}
                  placeholder="e.g., Tuition, Hostel"
                />
              </div>
              <div>
                <Label htmlFor="academicYear">Academic Year *</Label>
                <Input
                  id="academicYear"
                  value={formData.academicYear}
                  onChange={(e) =>
                    handleInputChange("academicYear", e.target.value)
                  }
                  placeholder="e.g., 2024-2025"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="semester">Semester</Label>
              <Input
                id="semester"
                value={formData.semester}
                onChange={(e) => handleInputChange("semester", e.target.value)}
                placeholder="e.g., 1st Semester, 2nd Year"
              />
            </div>
          </div>
        );

      case 4:
        // Academic Details
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="percentage">Percentage</Label>
                <Input
                  id="percentage"
                  type="number"
                  step="0.01"
                  value={formData.percentage}
                  onChange={(e) =>
                    handleInputChange("percentage", e.target.value)
                  }
                  placeholder="Enter percentage"
                />
              </div>
              <div>
                <Label htmlFor="grade">Grade</Label>
                <Input
                  id="grade"
                  value={formData.grade}
                  onChange={(e) => handleInputChange("grade", e.target.value)}
                  placeholder="e.g., A+, 9.5 CGPA"
                />
              </div>
              <div>
                <Label htmlFor="totalMarks">Total Marks</Label>
                <Input
                  id="totalMarks"
                  type="number"
                  value={formData.totalMarks}
                  onChange={(e) =>
                    handleInputChange("totalMarks", e.target.value)
                  }
                  placeholder="Enter total marks"
                />
              </div>
            </div>
          </div>
        );

      case 5:
        // Family Income
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="monthlyIncome">Monthly Income *</Label>
                <Input
                  id="monthlyIncome"
                  type="number"
                  value={formData.monthlyIncome}
                  onChange={(e) =>
                    handleInputChange("monthlyIncome", e.target.value)
                  }
                  placeholder="Enter monthly income"
                  required
                />
              </div>
              <div>
                <Label htmlFor="annualIncome">Annual Income</Label>
                <Input
                  id="annualIncome"
                  type="number"
                  value={formData.annualIncome}
                  onChange={(e) =>
                    handleInputChange("annualIncome", e.target.value)
                  }
                  placeholder="Enter annual income"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="occupation">Occupation *</Label>
                <Input
                  id="occupation"
                  value={formData.occupation}
                  onChange={(e) =>
                    handleInputChange("occupation", e.target.value)
                  }
                  placeholder="Enter occupation"
                  required
                />
              </div>
              <div>
                <Label htmlFor="numberOfDependents">Number of Dependents</Label>
                <Input
                  id="numberOfDependents"
                  type="number"
                  value={formData.numberOfDependents}
                  onChange={(e) =>
                    handleInputChange("numberOfDependents", e.target.value)
                  }
                  placeholder="Enter number of dependents"
                />
              </div>
            </div>
          </div>
        );

      case 6:
        // Scholarship (Optional)
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Fill this section only if the student has received or applied for
              any scholarship
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="scholarshipName">Scholarship Name</Label>
                <Input
                  id="scholarshipName"
                  value={formData.scholarshipName}
                  onChange={(e) =>
                    handleInputChange("scholarshipName", e.target.value)
                  }
                  placeholder="Enter scholarship name"
                />
              </div>
              <div>
                <Label htmlFor="scholarshipAmount">Scholarship Amount</Label>
                <Input
                  id="scholarshipAmount"
                  type="number"
                  value={formData.scholarshipAmount}
                  onChange={(e) =>
                    handleInputChange("scholarshipAmount", e.target.value)
                  }
                  placeholder="Enter scholarship amount"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="scholarshipStatus">Scholarship Status</Label>
                <Select
                  value={formData.scholarshipStatus}
                  onValueChange={(value) =>
                    handleInputChange("scholarshipStatus", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="APPLIED">Applied</SelectItem>
                    <SelectItem value="RECEIVED">Received</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="scholarshipProvider">
                  Scholarship Provider
                </Label>
                <Input
                  id="scholarshipProvider"
                  value={formData.scholarshipProvider}
                  onChange={(e) =>
                    handleInputChange("scholarshipProvider", e.target.value)
                  }
                  placeholder="e.g., Central Govt, State Govt"
                />
              </div>
            </div>
          </div>
        );

      case 7:
        // Assignment & Documents
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="assignedTo">Assign To</Label>
                {loadingUsers ? (
                  <div className="flex items-center gap-2 p-2 border rounded-md">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <span className="text-sm text-muted-foreground">
                      Loading officers...
                    </span>
                  </div>
                ) : (
                  <Select
                    value={formData.assignedTo}
                    onValueChange={(value) =>
                      handleInputChange("assignedTo", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select officer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UNASSIGNED">Unassigned</SelectItem>
                      {users.map((user) => (
                        <SelectItem key={user._id} value={user._id}>
                          {user.firstName} {user.lastName} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    handleInputChange("priority", value)
                  }
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

            <div>
              <Label htmlFor="purpose">Purpose / Additional Notes</Label>
              <Textarea
                id="purpose"
                value={formData.purpose}
                onChange={(e) => handleInputChange("purpose", e.target.value)}
                placeholder="Enter any additional information or purpose"
                rows={4}
              />
            </div>

            <div>
              <Label>Attachments</Label>

              {/* Existing Attachments in Edit Mode */}
              {isEditMode && existingAttachments.length > 0 && (
                <div className="mb-4 space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Existing Documents:
                  </p>
                  <div className="space-y-2">
                    {existingAttachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 border rounded-md bg-muted/50"
                      >
                        <div className="flex items-center gap-2">
                          <Upload className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{file.filename}</span>
                          <span className="text-xs text-muted-foreground">
                            (Uploaded:{" "}
                            {new Date(file.uploadedAt).toLocaleDateString()})
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(file.url, "_blank")}
                        >
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New File Upload */}
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  {isEditMode
                    ? "Upload additional documents"
                    : "Upload supporting documents"}{" "}
                  (Fee receipts, Income certificate, etc.)
                </p>
                <input
                  type="file"
                  multiple
                  onChange={(e) => {
                    if (e.target.files) {
                      handleFileChange(Array.from(e.target.files));
                    }
                  }}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    document.getElementById("file-upload")?.click()
                  }
                >
                  Choose Files
                </Button>
                {attachments.length > 0 && (
                  <div className="mt-3 space-y-1">
                    <p className="text-sm text-primary font-medium">
                      {attachments.length} new file(s) selected:
                    </p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      {attachments.map((file, idx) => (
                        <div key={idx}>{file.name}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            Loading education data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/admin/education")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEditMode ? "Edit" : "New"} Education Support Request
          </h1>
          <p className="text-muted-foreground">
            {isEditMode
              ? "Update education support request details"
              : "Fill in the details to create a new education support request"}
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center flex-1">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                index <= currentStep
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-1 flex-1 ${
                  index < currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep]}</CardTitle>
        </CardHeader>
        <CardContent>{renderStep()}</CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          Previous
        </Button>
        <div className="flex gap-2">
          {currentStep < steps.length - 1 ? (
            <Button onClick={handleNext}>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              {loading
                ? "Saving..."
                : isEditMode
                ? "Update Request"
                : "Submit Request"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
