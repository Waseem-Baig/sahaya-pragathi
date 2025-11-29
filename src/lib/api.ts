import axios, { type AxiosInstance, type AxiosError } from "axios";
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  AuthError,
  User,
} from "@/types/auth";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}

interface CaseData {
  _id?: string;
  caseId?: string;
  caseType: string;
  citizenName: string;
  subject: string;
  description: string;
  priority?: string;
  status?: string;
  department: string;
  district?: string;
  [key: string]: unknown;
}

interface DisputeData {
  _id?: string;
  disputeId?: string;
  partyA: {
    name: string;
    contact: string;
    email?: string;
    address: string;
  };
  partyB: {
    name: string;
    contact: string;
    email?: string;
    address: string;
  };
  category: string;
  description: string;
  incidentDate?: Date | string;
  incidentPlace?: string;
  district?: string;
  mandal?: string;
  ward?: string;
  pincode?: string;
  status?: string;
  assignedTo?: string;
  mediator?: string;
  hearingDate?: Date | string;
  hearingTime?: string;
  hearingPlace?: string;
  priority?: string;
  attachments?: Array<{ filename: string; url: string; uploadedAt: Date }>;
  [key: string]: unknown;
}

interface TempleData {
  _id?: string;
  templeId?: string;
  applicantName: string;
  mobile: string;
  email?: string;
  address?: string;
  aadhaarNumber?: string;
  templeName: string;
  darshanType: string; // VIP, GENERAL, SPECIAL, DIVYA_DARSHAN, SARVA_DARSHAN
  preferredDate: Date | string;
  numberOfPeople?: number;
  district?: string;
  mandal?: string;
  ward?: string;
  pincode?: string;
  status?: string;
  assignedTo?: string;
  quotaAvailable?: boolean;
  quotaAllocated?: number;
  letterNumber?: string;
  letterIssuedDate?: Date | string;
  letterValidUntil?: Date | string;
  purpose?: string;
  remarks?: string;
  rejectReason?: string;
  attachments?: Array<{ filename: string; url: string; uploadedAt: Date }>;
  [key: string]: unknown;
}

interface CMReliefData {
  _id?: string;
  cmrfId?: string;
  applicantName: string;
  fatherOrHusbandName?: string;
  age?: number;
  gender?: string;
  mobile: string;
  email?: string;
  aadhaar?: string;
  address?: string;
  district?: string;
  mandal?: string;
  ward?: string;
  pincode?: string;
  reliefType: string; // MEDICAL, EDUCATION, ACCIDENT, NATURAL_DISASTER, FINANCIAL_ASSISTANCE, FUNERAL, OTHER
  requestedAmount: number;
  approvedAmount?: number;
  purpose?: string;
  urgency?: string; // LOW, MEDIUM, HIGH, CRITICAL
  medicalDetails?: {
    hospitalName?: string;
    disease?: string;
    treatmentCost?: number;
    doctorName?: string;
    admissionDate?: Date | string;
  };
  incomeDetails?: {
    monthlyIncome?: number;
    occupation?: string;
    familyMembers?: number;
    dependents?: number;
  };
  bankDetails?: {
    accountNumber?: string;
    ifscCode?: string;
    bankName?: string;
    branchName?: string;
    accountHolderName?: string;
  };
  status?: string;
  verificationStatus?: string;
  verifiedBy?: string;
  verificationDate?: Date | string;
  verificationNotes?: string;
  disbursementDetails?: {
    amount?: number;
    transactionId?: string;
    disbursementDate?: Date | string;
    disbursementMode?: string;
  };
  approvalDetails?: {
    approvedBy?: string;
    approvalDate?: Date | string;
    approvalNotes?: string;
  };
  assignedTo?: string;
  priority?: string;
  rejectReason?: string;
  attachments?: Array<{ filename: string; url: string; uploadedAt: Date }>;
  [key: string]: unknown;
}

interface EducationData {
  _id?: string;
  educationId?: string;
  // Student Information
  studentName: string;
  fatherOrGuardianName?: string;
  motherName?: string;
  dateOfBirth?: Date | string;
  age?: number;
  gender?: string;
  mobile: string;
  email?: string;
  aadhaarNumber?: string;
  address?: string;
  district?: string;
  mandal?: string;
  ward?: string;
  pincode?: string;
  // Education Details
  educationType: string;
  currentClass?: string;
  institutionName: string;
  institutionType?: string;
  courseOrStream?: string;
  academicYear?: string;
  rollNumber?: string;
  boardOrUniversity?: string;
  // Support Details
  supportType: string;
  requestedAmount: number;
  approvedAmount?: number;
  purpose?: string;
  urgency?: string;
  // Academic Performance
  academicPerformance?: {
    lastExamPercentage?: number;
    gpa?: number;
    rank?: number;
    achievements?: string;
    attendance?: number;
    grade?: string;
    totalMarks?: number;
  };
  // Financial Details
  familyIncome?: {
    monthlyIncome?: number;
    occupation?: string;
    familyMembers?: number;
    siblings?: number;
    siblingsInEducation?: number;
    annualIncome?: number;
    numberOfDependents?: number;
  };
  // Bank Details
  bankDetails?: {
    accountNumber?: string;
    ifscCode?: string;
    bankName?: string;
    branchName?: string;
    accountHolderName?: string;
  };
  // Scholarship Details (if any)
  scholarshipDetails?: {
    scholarshipName?: string;
    scholarshipAmount?: number;
    scholarshipStatus?: string;
    scholarshipProvider?: string;
  };
  // Status & Assignment
  status?: string;
  assignedTo?: string | { _id: string; firstName: string; lastName: string };
  priority?: string;
  verificationStatus?: string;
  verifiedBy?: string | { _id: string; firstName: string; lastName: string };
  verificationDate?: Date | string;
  verificationNotes?: string;
  // Disbursement
  disbursementDetails?: {
    amount?: number;
    transactionId?: string;
    disbursementDate?: Date | string;
    disbursementMode?: string;
    remarks?: string;
  };
  // Approval
  approvalDetails?: {
    approvedBy?: string | { _id: string; firstName: string; lastName: string };
    approvalDate?: Date | string;
    approvalNotes?: string;
  };
  rejectReason?: string;
  attachments?: Array<{ filename: string; url: string; uploadedAt: Date }>;
  createdBy?: string | { _id: string; firstName: string; lastName: string };
  createdAt?: Date | string;
  updatedAt?: Date | string;
  [key: string]: unknown;
}

interface AppointmentData {
  _id?: string;
  appointmentId?: string;
  // Applicant Information
  applicantName: string;
  mobile: string;
  email?: string;
  aadhaar?: string;
  address?: string;
  district?: string;
  mandal?: string;
  village?: string;
  constituency?: string;
  // Appointment Details
  purpose: string;
  category?:
    | "PERSONAL_GRIEVANCE"
    | "PROJECT_DISCUSSION"
    | "COMMUNITY_ISSUE"
    | "BUSINESS_PROPOSAL"
    | "GENERAL_MEETING"
    | "VIP_MEETING"
    | "OTHER";
  description?: string;
  urgencyLevel?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  // Scheduling Details
  preferredDate?: Date | string;
  preferredTime?: string;
  alternativeDate?: Date | string;
  alternativeTime?: string;
  estimatedDuration?: number;
  // Confirmed Scheduling
  confirmedDate?: Date | string;
  confirmedTime?: string;
  confirmedSlot?: Date | string;
  meetingPlace?:
    | "CHIEF_MINISTER_OFFICE"
    | "SECRETARIAT"
    | "DISTRICT_COLLECTORATE"
    | "FIELD_VISIT"
    | "VIRTUAL_MEETING"
    | "OTHER";
  specificLocation?: string;
  // Assignment & Coordination
  assignedTo?: string | { _id: string; firstName: string; lastName: string };
  assignedDate?: Date | string;
  coordinator?: string | { _id: string; firstName: string; lastName: string };
  // Status Management
  status?:
    | "REQUESTED"
    | "UNDER_REVIEW"
    | "CONFIRMED"
    | "RESCHEDULED"
    | "CHECKED_IN"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED"
    | "NO_SHOW"
    | "REJECTED";
  // Meeting Details
  attendees?: string[];
  agenda?: string;
  meetingNotes?: string;
  actionItems?: Array<{
    description: string;
    assignedTo?: string;
    dueDate?: Date | string;
    status?: "PENDING" | "IN_PROGRESS" | "COMPLETED";
    completedDate?: Date | string;
  }>;
  // Check-in/out
  checkInTime?: Date | string;
  checkOutTime?: Date | string;
  actualDuration?: number;
  // Follow-up
  followUpRequired?: boolean;
  followUpDate?: Date | string;
  followUpNotes?: string;
  // Verification & Approval
  verifiedBy?: string | { _id: string; firstName: string; lastName: string };
  verifiedDate?: Date | string;
  verificationNotes?: string;
  approvedBy?: string | { _id: string; firstName: string; lastName: string };
  approvedDate?: Date | string;
  approvalNotes?: string;
  rejectionReason?: string;
  cancellationReason?: string;
  // Communication
  confirmationSent?: boolean;
  confirmationSentDate?: Date | string;
  reminderSent?: boolean;
  reminderSentDate?: Date | string;
  // Collaboration
  comments?: Array<{
    _id?: string;
    user: string | { _id: string; firstName: string; lastName: string };
    text: string;
    createdAt: Date | string;
  }>;
  // Documents
  attachments?: Array<{
    filename: string;
    originalName?: string;
    url: string;
    fileType: string;
    fileSize?: number;
    uploadedBy?: string;
    uploadedAt: Date | string;
  }>;
  // History
  statusHistory?: Array<{
    status: string;
    changedBy: string | { _id: string; firstName: string; lastName: string };
    changedAt: Date | string;
    notes?: string;
  }>;
  // Metadata
  priority?: "LOW" | "MEDIUM" | "HIGH" | "VIP";
  isVIP?: boolean;
  tags?: string[];
  internalNotes?: string;
  createdBy?: string | { _id: string; firstName: string; lastName: string };
  createdAt?: Date | string;
  updatedAt?: Date | string;
  [key: string]: unknown;
}

interface EmergencyData {
  _id?: string;
  emergencyId?: string;
  // Applicant Information
  applicantName: string;
  mobile: string;
  email?: string;
  aadhaarNumber?: string;
  // Emergency Details
  emergencyType:
    | "MEDICAL"
    | "POLICE"
    | "FIRE"
    | "NATURAL_DISASTER"
    | "ACCIDENT"
    | "OTHER";
  location: string;
  gpsCoordinates?: {
    latitude?: number;
    longitude?: number;
  };
  description: string;
  urgency?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  // Location Details
  district?: string;
  mandal?: string;
  ward?: string;
  landmark?: string;
  pincode?: string;
  // Response Details
  officerContact?: string;
  responderName?: string;
  responderContact?: string;
  actionTaken?: string;
  responseTime?: Date | string;
  resolutionTime?: Date | string;
  // Status & Assignment
  status?:
    | "LOGGED"
    | "DISPATCHED"
    | "IN_PROGRESS"
    | "RESOLVED"
    | "CANCELLED"
    | "CLOSED";
  assignedTo?: string | { _id: string; firstName: string; lastName: string };
  priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  // Additional Information
  numberOfPeopleAffected?: number;
  estimatedDamage?: string;
  immediateNeedsProvided?: string;
  followUpRequired?: boolean;
  followUpDetails?: string;
  // Documentation
  attachments?: Array<{
    filename: string;
    url: string;
    uploadedAt: Date | string;
  }>;
  notes?: string;
  internalNotes?: string;
  // Escalation
  escalated?: boolean;
  escalatedTo?: string | { _id: string; firstName: string; lastName: string };
  escalationReason?: string;
  escalationDate?: Date | string;
  // Closure
  closureNotes?: string;
  closedBy?: string | { _id: string; firstName: string; lastName: string };
  closedAt?: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  [key: string]: unknown;
}

interface ProgramData {
  _id?: string;
  programId?: string;
  // Basic Information
  eventName: string;
  type?: "JOB_MELA" | "PROGRAM" | "TRAINING" | "WORKSHOP" | "SEMINAR" | "OTHER";
  description?: string;
  // Date & Time
  startDate: Date | string;
  endDate: Date | string;
  registrationStartDate?: Date | string;
  registrationEndDate?: Date | string;
  // Venue Information
  venue: string;
  venueAddress?: string;
  venueCity?: string;
  district?: string;
  state?: string;
  venueCapacity?: number;
  // Partners & Organizers
  partners?: string[];
  organizingDepartment?: string;
  coordinator?: {
    name?: string;
    designation?: string;
    contact?: string;
    email?: string;
  };
  // Registration & Participation
  registrations?: number;
  targetParticipants?: number;
  actualParticipants?: number;
  registrationFee?: number;
  isRegistrationRequired?: boolean;
  registrationLink?: string;
  // Job Mela Specific Fields
  jobMelaDetails?: {
    participatingCompanies?: Array<{
      companyName?: string;
      industry?: string;
      jobPositions?: number;
      expectedSalary?: string;
      qualificationRequired?: string;
      contactPerson?: string;
      contactNumber?: string;
      email?: string;
    }>;
    totalJobPositions?: number;
    sectors?: string[];
    eligibilityCriteria?: string;
    documentsRequired?: string[];
  };
  // Program Details
  programDetails?: {
    objectives?: string;
    targetAudience?: string;
    topics?: string[];
    speakers?: Array<{
      name?: string;
      designation?: string;
      organization?: string;
      expertise?: string;
      photoUrl?: string;
    }>;
    agenda?: Array<{
      time?: string;
      session?: string;
      speaker?: string;
      duration?: string;
    }>;
    certificateProvided?: boolean;
  };
  // Status Management
  status?:
    | "PLANNED"
    | "REGISTRATION"
    | "REGISTRATION_CLOSED"
    | "SCREENING"
    | "SELECTION"
    | "OFFER"
    | "JOINED"
    | "ONGOING"
    | "COMPLETED"
    | "CANCELLED"
    | "POSTPONED";
  // Statistics & Results
  statistics?: {
    applicationsReceived?: number;
    applicationsScreened?: number;
    candidatesShortlisted?: number;
    offersExtended?: number;
    offersAccepted?: number;
    candidatesJoined?: number;
    feedbackRating?: number;
    feedbackCount?: number;
  };
  // Budget & Finance
  budget?: {
    estimatedBudget?: number;
    actualExpense?: number;
    fundingSource?: string;
    sponsorships?: Array<{
      sponsor?: string;
      amount?: number;
      type?: string;
    }>;
  };
  // Assignment & Management
  assignedTo?: string | { _id: string; firstName: string; lastName: string };
  assignedDate?: Date | string;
  teamMembers?: Array<{
    user?: string | { _id: string; firstName: string; lastName: string };
    role?: string;
    responsibilities?: string;
  }>;
  // Verification & Approval
  verifiedBy?: string | { _id: string; firstName: string; lastName: string };
  verifiedDate?: Date | string;
  verificationNotes?: string;
  approvedBy?: string | { _id: string; firstName: string; lastName: string };
  approvedDate?: Date | string;
  approvalNotes?: string;
  cancellationReason?: string;
  postponementReason?: string;
  newScheduledDate?: Date | string;
  // Communication & Marketing
  publicity?: {
    posterUrl?: string;
    brochureUrl?: string;
    websiteUrl?: string;
    socialMediaLinks?: string[];
    mediaPartners?: string[];
    pressReleaseIssued?: boolean;
  };
  // Attachments
  attachments?: Array<{
    filename: string;
    originalName?: string;
    url: string;
    fileType: string;
    documentType?:
      | "PROPOSAL"
      | "APPROVAL_LETTER"
      | "BUDGET"
      | "AGENDA"
      | "BROCHURE"
      | "POSTER"
      | "REPORT"
      | "PHOTOS"
      | "ATTENDANCE"
      | "FEEDBACK"
      | "OTHER";
    fileSize?: number;
    uploadedBy?: string;
    uploadedAt: Date | string;
  }>;
  // Feedback & Follow-up
  feedback?: Array<{
    participantName?: string;
    participantEmail?: string;
    rating?: number;
    comments?: string;
    suggestions?: string;
    submittedAt?: Date | string;
  }>;
  followUpRequired?: boolean;
  followUpDate?: Date | string;
  followUpNotes?: string;
  // Collaboration
  comments?: Array<{
    _id?: string;
    user: string | { _id: string; firstName: string; lastName: string };
    text: string;
    createdAt: Date | string;
  }>;
  // History
  statusHistory?: Array<{
    status: string;
    changedBy: string | { _id: string; firstName: string; lastName: string };
    changedAt: Date | string;
    notes?: string;
  }>;
  // Metadata
  priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  isPublic?: boolean;
  isFeatured?: boolean;
  tags?: string[];
  internalNotes?: string;
  referenceNumber?: string;
  createdBy?: string | { _id: string; firstName: string; lastName: string };
  createdAt?: Date | string;
  updatedAt?: Date | string;
  [key: string]: unknown;
}

interface CSRIndustrialData {
  _id?: string;
  csrId?: string;
  // Company Information
  companyName: string;
  companyType?: string;
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
  projectCategory?: string;
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
  approvedBudget?: number;
  fundingModel?: string;
  budgetBreakdown?: Array<{
    category: string;
    amount: number;
    description: string;
  }>;
  // Timeline
  proposedStartDate?: Date | string;
  proposedEndDate?: Date | string;
  actualStartDate?: Date | string;
  actualEndDate?: Date | string;
  duration?: number;
  // MoU Details
  mouSignedDate?: Date | string;
  mouValidUpto?: Date | string;
  mouDocumentUrl?: string;
  agreementTerms?: string;
  // Milestones
  milestones?: Array<{
    _id?: string;
    milestoneName: string;
    description?: string;
    targetDate?: Date | string;
    completionDate?: Date | string;
    status?: string;
    deliverables?: string;
    amountDisbursed?: number;
    verificationNotes?: string;
  }>;
  // Progress Tracking
  progressPercentage?: number;
  progressNotes?: string;
  lastReviewDate?: Date | string;
  nextReviewDate?: Date | string;
  // Impact Assessment
  beneficiariesReached?: number;
  impactMetrics?: Array<{
    metric: string;
    target: string;
    achieved: string;
    unit: string;
  }>;
  testimonials?: string;
  mediaCoverage?: string;
  // Due Diligence
  dueDiligenceStatus?: string;
  dueDiligenceNotes?: string;
  dueDiligenceCompletedBy?:
    | string
    | { _id: string; firstName: string; lastName: string };
  dueDiligenceCompletedDate?: Date | string;
  riskAssessment?: string;
  // Status & Assignment
  status?: string;
  assignedTo?: string | { _id: string; firstName: string; lastName: string };
  assignedDate?: Date | string;
  reviewedBy?: string | { _id: string; firstName: string; lastName: string };
  approvedBy?: string | { _id: string; firstName: string; lastName: string };
  approvedDate?: Date | string;
  // Comments
  comments?: Array<{
    user: string | { _id: string; firstName: string; lastName: string };
    text: string;
    createdAt: Date | string;
  }>;
  // Documents
  attachments?: Array<{
    filename: string;
    url: string;
    uploadedAt: Date | string;
    documentType?: string;
  }>;
  // Metadata
  priority?: string;
  tags?: string[];
  notes?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  [key: string]: unknown;
}

interface TaskData {
  module: string;
  details: Record<
    string,
    string | number | Date | File[] | string[] | null | undefined
  >;
  assignment: {
    assignedTo?: string;
    department?: string;
    sla?: string;
    priority?: string;
    notes?: string;
  };
}

interface QueryParams {
  [key: string]: string | number | boolean | undefined;
}

interface UpdateData {
  [key: string]: unknown;
}

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<AuthError>) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/users/login", credentials);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const { confirmPassword, ...registerData } = data;
    const response = await api.post<AuthResponse>(
      "/users/register",
      registerData
    );
    return response.data;
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const response = await api.get<ApiResponse<User>>("/users/me");
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  },
};

// Cases API calls
export const casesAPI = {
  getAll: async (params?: QueryParams) => {
    const response = await api.get<ApiResponse<CaseData[]>>("/cases", {
      params,
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<ApiResponse<CaseData>>(`/cases/${id}`);
    return response.data;
  },

  create: async (data: Partial<CaseData>) => {
    const response = await api.post<ApiResponse<CaseData>>("/cases", data);
    return response.data;
  },

  createTask: async (taskData: TaskData) => {
    const response = await api.post<ApiResponse<CaseData>>("/cases", taskData);
    return response.data;
  },

  update: async (id: string, data: Partial<CaseData>) => {
    const response = await api.put<ApiResponse<CaseData>>(`/cases/${id}`, data);
    return response.data;
  },

  updateStatus: async (
    id: string,
    status: string,
    userId: string,
    comments?: string
  ) => {
    const response = await api.patch(`/cases/${id}/status`, {
      status,
      userId,
      comments,
    });
    return response.data;
  },

  addComment: async (id: string, userId: string, text: string) => {
    const response = await api.post(`/cases/${id}/comments`, { userId, text });
    return response.data;
  },

  getStats: async (params?: QueryParams) => {
    const response = await api.get<ApiResponse>("/cases/stats/dashboard", {
      params,
    });
    return response.data;
  },
};

// Disputes API calls
export const disputesAPI = {
  getAll: async (params?: QueryParams) => {
    const response = await api.get<ApiResponse<DisputeData[]>>("/disputes", {
      params,
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<ApiResponse<DisputeData>>(`/disputes/${id}`);
    return response.data;
  },

  create: async (data: Partial<DisputeData>) => {
    const response = await api.post<ApiResponse<DisputeData>>(
      "/disputes",
      data
    );
    return response.data;
  },

  update: async (id: string, data: Partial<DisputeData>) => {
    const response = await api.put<ApiResponse<DisputeData>>(
      `/disputes/${id}`,
      data
    );
    return response.data;
  },

  addComment: async (id: string, text: string) => {
    const response = await api.post(`/disputes/${id}/comments`, { text });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/disputes/${id}`);
    return response.data;
  },
};

// Temples API calls
export const templesAPI = {
  getAll: async (params?: QueryParams) => {
    const response = await api.get<ApiResponse<TempleData[]>>("/temples", {
      params,
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<ApiResponse<TempleData>>(`/temples/${id}`);
    return response.data;
  },

  create: async (data: Partial<TempleData>) => {
    const response = await api.post<ApiResponse<TempleData>>("/temples", data);
    return response.data;
  },

  update: async (id: string, data: Partial<TempleData>) => {
    const response = await api.put<ApiResponse<TempleData>>(
      `/temples/${id}`,
      data
    );
    return response.data;
  },

  addComment: async (id: string, text: string) => {
    const response = await api.post(`/temples/${id}/comments`, { text });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/temples/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get<ApiResponse>("/temples/stats/summary");
    return response.data;
  },
};

// CM Relief API calls
export const cmReliefAPI = {
  getAll: async (params?: QueryParams) => {
    const response = await api.get<ApiResponse<CMReliefData[]>>("/cmrelief", {
      params,
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<ApiResponse<CMReliefData>>(
      `/cmrelief/${id}`
    );
    return response.data;
  },

  create: async (data: CMReliefData) => {
    const response = await api.post<ApiResponse<CMReliefData>>(
      "/cmrelief",
      data
    );
    return response.data;
  },

  update: async (id: string, data: Partial<CMReliefData>) => {
    const response = await api.put<ApiResponse<CMReliefData>>(
      `/cmrelief/${id}`,
      data
    );
    return response.data;
  },

  addComment: async (id: string, text: string) => {
    const response = await api.post(`/cmrelief/${id}/comments`, { text });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/cmrelief/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get<ApiResponse>("/cmrelief/stats/summary");
    return response.data;
  },
};

// Education API calls
export const educationAPI = {
  getAll: async (params?: QueryParams) => {
    const response = await api.get<ApiResponse<EducationData[]>>("/education", {
      params,
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<ApiResponse<EducationData>>(
      `/education/${id}`
    );
    return response.data;
  },

  create: async (data: EducationData) => {
    const response = await api.post<ApiResponse<EducationData>>(
      "/education",
      data
    );
    return response.data;
  },

  update: async (id: string, data: Partial<EducationData>) => {
    const response = await api.put<ApiResponse<EducationData>>(
      `/education/${id}`,
      data
    );
    return response.data;
  },

  addComment: async (id: string, text: string) => {
    const response = await api.post(`/education/${id}/comments`, { text });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/education/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get<ApiResponse>("/education/stats/summary");
    return response.data;
  },
};

// Appointment API calls
export const appointmentAPI = {
  getAll: async (params?: QueryParams) => {
    const response = await api.get<ApiResponse<AppointmentData[]>>(
      "/appointments",
      {
        params,
      }
    );
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<ApiResponse<AppointmentData>>(
      `/appointments/${id}`
    );
    return response.data;
  },

  create: async (data: AppointmentData) => {
    const response = await api.post<ApiResponse<AppointmentData>>(
      "/appointments",
      data
    );
    return response.data;
  },

  update: async (id: string, data: Partial<AppointmentData>) => {
    const response = await api.put<ApiResponse<AppointmentData>>(
      `/appointments/${id}`,
      data
    );
    return response.data;
  },

  updateStatus: async (
    id: string,
    status: string,
    notes?: string,
    changedBy?: string
  ) => {
    const response = await api.patch(`/appointments/${id}/status`, {
      status,
      notes,
      changedBy,
    });
    return response.data;
  },

  assign: async (id: string, assignedTo: string, coordinator?: string) => {
    const response = await api.patch(`/appointments/${id}/assign`, {
      assignedTo,
      coordinator,
    });
    return response.data;
  },

  confirmAppointment: async (
    id: string,
    confirmedDate: string,
    confirmedTime: string,
    meetingPlace: string,
    specificLocation?: string
  ) => {
    const response = await api.patch(`/appointments/${id}/confirm`, {
      confirmedDate,
      confirmedTime,
      meetingPlace,
      specificLocation,
    });
    return response.data;
  },

  checkIn: async (id: string) => {
    const response = await api.patch(`/appointments/${id}/checkin`);
    return response.data;
  },

  addComment: async (id: string, user: string, text: string) => {
    const response = await api.post(`/appointments/${id}/comments`, {
      user,
      text,
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get<ApiResponse>("/appointments/stats/overview");
    return response.data;
  },
};

// Emergency API calls
export const emergencyAPI = {
  getAll: async (params?: QueryParams) => {
    const response = await api.get<ApiResponse<EmergencyData[]>>(
      "/emergencies",
      {
        params,
      }
    );
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<ApiResponse<EmergencyData>>(
      `/emergencies/${id}`
    );
    return response.data;
  },

  create: async (data: EmergencyData) => {
    const response = await api.post<ApiResponse<EmergencyData>>(
      "/emergencies",
      data
    );
    return response.data;
  },

  update: async (id: string, data: Partial<EmergencyData>) => {
    const response = await api.put<ApiResponse<EmergencyData>>(
      `/emergencies/${id}`,
      data
    );
    return response.data;
  },

  updateStatus: async (
    id: string,
    status: string,
    actionTaken?: string,
    closureNotes?: string,
    closedBy?: string
  ) => {
    const response = await api.patch(`/emergencies/${id}/status`, {
      status,
      actionTaken,
      closureNotes,
      closedBy,
    });
    return response.data;
  },

  assign: async (id: string, assignedTo: string, priority?: string) => {
    const response = await api.patch(`/emergencies/${id}/assign`, {
      assignedTo,
      priority,
    });
    return response.data;
  },

  escalate: async (
    id: string,
    escalatedTo: string,
    escalationReason: string
  ) => {
    const response = await api.patch(`/emergencies/${id}/escalate`, {
      escalatedTo,
      escalationReason,
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/emergencies/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get<ApiResponse>("/emergencies/stats/overview");
    return response.data;
  },
};

// Programs API calls
export const programAPI = {
  getAll: async (params?: QueryParams) => {
    const response = await api.get<ApiResponse<ProgramData[]>>("/programs", {
      params,
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<ApiResponse<ProgramData>>(`/programs/${id}`);
    return response.data;
  },

  create: async (data: ProgramData) => {
    const response = await api.post<ApiResponse<ProgramData>>(
      "/programs",
      data
    );
    return response.data;
  },

  update: async (id: string, data: Partial<ProgramData>) => {
    const response = await api.put<ApiResponse<ProgramData>>(
      `/programs/${id}`,
      data
    );
    return response.data;
  },

  updateStatus: async (
    id: string,
    status: string,
    notes?: string,
    changedBy?: string
  ) => {
    const response = await api.patch(`/programs/${id}/status`, {
      status,
      notes,
      changedBy,
    });
    return response.data;
  },

  assign: async (id: string, assignedTo: string) => {
    const response = await api.patch(`/programs/${id}/assign`, {
      assignedTo,
    });
    return response.data;
  },

  addComment: async (id: string, user: string, text: string) => {
    const response = await api.post(`/programs/${id}/comments`, {
      user,
      text,
    });
    return response.data;
  },

  addTeamMember: async (
    id: string,
    user: string,
    role: string,
    responsibilities?: string
  ) => {
    const response = await api.post(`/programs/${id}/team-members`, {
      user,
      role,
      responsibilities,
    });
    return response.data;
  },

  addFeedback: async (
    id: string,
    feedback: {
      participantName?: string;
      participantEmail?: string;
      rating?: number;
      comments?: string;
      suggestions?: string;
    }
  ) => {
    const response = await api.post(`/programs/${id}/feedback`, feedback);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/programs/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get<ApiResponse>("/programs/stats/overview");
    return response.data;
  },
};

// CSR Industrial API calls
export const csrIndustrialAPI = {
  getAll: async (params?: QueryParams) => {
    const response = await api.get<ApiResponse<CSRIndustrialData[]>>("/csr", {
      params,
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<ApiResponse<CSRIndustrialData>>(
      `/csr/${id}`
    );
    return response.data;
  },

  create: async (data: CSRIndustrialData) => {
    const response = await api.post<ApiResponse<CSRIndustrialData>>(
      "/csr",
      data
    );
    return response.data;
  },

  update: async (id: string, data: Partial<CSRIndustrialData>) => {
    const response = await api.put<ApiResponse<CSRIndustrialData>>(
      `/csr/${id}`,
      data
    );
    return response.data;
  },

  updateStatus: async (id: string, status: string, notes?: string) => {
    const response = await api.patch(`/csr/${id}/status`, { status, notes });
    return response.data;
  },

  assign: async (id: string, assignedTo: string) => {
    const response = await api.patch(`/csr/${id}/assign`, { assignedTo });
    return response.data;
  },

  addComment: async (id: string, user: string, text: string) => {
    const response = await api.post(`/csr/${id}/comments`, { user, text });
    return response.data;
  },

  addMilestone: async (
    id: string,
    milestone: Partial<CSRIndustrialData["milestones"]>[0]
  ) => {
    const response = await api.post(`/csr/${id}/milestones`, milestone);
    return response.data;
  },

  updateMilestone: async (
    id: string,
    milestoneId: string,
    updates: Partial<CSRIndustrialData["milestones"]>[0]
  ) => {
    const response = await api.patch(
      `/csr/${id}/milestones/${milestoneId}`,
      updates
    );
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/csr/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get<ApiResponse>("/csr/stats/overview");
    return response.data;
  },
};

// Users API calls
export const usersAPI = {
  getAll: async (params?: QueryParams) => {
    const response = await api.get<ApiResponse<User[]>>("/users", { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<ApiResponse<User>>(`/users/${id}`);
    return response.data;
  },

  update: async (id: string, data: UpdateData) => {
    const response = await api.put<ApiResponse<User>>(`/users/${id}`, data);
    return response.data;
  },

  changePassword: async (
    id: string,
    currentPassword: string,
    newPassword: string
  ) => {
    const response = await api.post(`/users/${id}/change-password`, {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  getAllUsers: async (params?: QueryParams) => {
    const response = await api.get<ApiResponse<User[]>>("/users", { params });
    return response.data;
  },
};

// Executive API - For assigned tasks and verification
export const executiveAPI = {
  // Get all tasks assigned to the current executive
  getAssignedTasks: async (userId: string) => {
    try {
      const [
        grievances,
        disputes,
        templeLetters,
        cmRelief,
        education,
        csrIndustrial,
        appointments,
        programs,
      ] = await Promise.all([
        casesAPI.getAll({ assignedTo: userId }),
        disputesAPI.getAll({ assignedTo: userId }),
        templesAPI.getAll({ assignedTo: userId }),
        cmReliefAPI.getAll({ assignedTo: userId }),
        educationAPI.getAll({ assignedTo: userId }),
        csrIndustrialAPI.getAll({ assignedTo: userId }),
        appointmentAPI.getAll({ assignedTo: userId }),
        programAPI.getAll({ assignedTo: userId }),
      ]);

      const tasks = [];

      // Process grievances
      const grievanceData = Array.isArray(grievances.data)
        ? grievances.data
        : [];
      tasks.push(
        ...grievanceData.map((item: unknown) => {
          const g = item as {
            _id?: string;
            caseId?: string;
            subject?: string;
            status?: string;
            priority?: string;
            createdAt?: string;
            assignedAt?: string;
            assignedBy?: string | { firstName?: string; lastName?: string };
          };
          return {
            id: g._id || "",
            module: "Grievances",
            caseId: g.caseId || "",
            title: g.subject || "Untitled",
            status: g.status || "ASSIGNED",
            priority: g.priority || "P3",
            assignedAt: g.assignedAt || g.createdAt || new Date().toISOString(),
            dueDate: new Date(
              Date.now() + 3 * 24 * 60 * 60 * 1000
            ).toISOString(),
            assignedBy:
              typeof g.assignedBy === "object"
                ? `${g.assignedBy.firstName || ""} ${
                    g.assignedBy.lastName || ""
                  }`.trim()
                : "Master Admin",
          };
        })
      );

      // Process disputes
      const disputeData = Array.isArray(disputes.data) ? disputes.data : [];
      tasks.push(
        ...disputeData.map((item: unknown) => {
          const d = item as {
            _id?: string;
            disputeId?: string;
            description?: string;
            status?: string;
            priority?: string;
            createdAt?: string;
            assignedAt?: string;
            assignedBy?: string | { firstName?: string; lastName?: string };
          };
          return {
            id: d._id || "",
            module: "Disputes",
            caseId: d.disputeId || "",
            title: d.description?.substring(0, 50) || "Untitled",
            status: d.status || "ASSIGNED",
            priority: d.priority || "P3",
            assignedAt: d.assignedAt || d.createdAt || new Date().toISOString(),
            dueDate: new Date(
              Date.now() + 3 * 24 * 60 * 60 * 1000
            ).toISOString(),
            assignedBy:
              typeof d.assignedBy === "object"
                ? `${d.assignedBy.firstName || ""} ${
                    d.assignedBy.lastName || ""
                  }`.trim()
                : "Master Admin",
          };
        })
      );

      // Process temple letters
      const templeData = Array.isArray(templeLetters.data)
        ? templeLetters.data
        : [];
      tasks.push(
        ...templeData.map((item: unknown) => {
          const t = item as {
            _id?: string;
            templeId?: string;
            templeName?: string;
            applicantName?: string;
            status?: string;
            priority?: string;
            createdAt?: string;
            assignedAt?: string;
            assignedBy?: string | { firstName?: string; lastName?: string };
          };
          return {
            id: t._id || "",
            module: "Temple Letters",
            caseId: t.templeId || "",
            title: `${t.templeName || "Temple"} - ${
              t.applicantName || "Unknown"
            }`,
            status: t.status || "ASSIGNED",
            priority: t.priority || "P3",
            assignedAt: t.assignedAt || t.createdAt || new Date().toISOString(),
            dueDate: new Date(
              Date.now() + 3 * 24 * 60 * 60 * 1000
            ).toISOString(),
            assignedBy:
              typeof t.assignedBy === "object"
                ? `${t.assignedBy.firstName || ""} ${
                    t.assignedBy.lastName || ""
                  }`.trim()
                : "Master Admin",
          };
        })
      );

      // Process CM Relief
      const cmReliefData = Array.isArray(cmRelief.data) ? cmRelief.data : [];
      tasks.push(
        ...cmReliefData.map((item: unknown) => {
          const c = item as {
            _id?: string;
            cmrfId?: string;
            reliefType?: string;
            applicantName?: string;
            status?: string;
            priority?: string;
            createdAt?: string;
            assignedAt?: string;
            assignedBy?: string | { firstName?: string; lastName?: string };
          };
          return {
            id: c._id || "",
            module: "CM Relief",
            caseId: c.cmrfId || "",
            title: `${c.reliefType || "Relief"} - ${
              c.applicantName || "Unknown"
            }`,
            status: c.status || "ASSIGNED",
            priority: c.priority || "P3",
            assignedAt: c.assignedAt || c.createdAt || new Date().toISOString(),
            dueDate: new Date(
              Date.now() + 3 * 24 * 60 * 60 * 1000
            ).toISOString(),
            assignedBy:
              typeof c.assignedBy === "object"
                ? `${c.assignedBy.firstName || ""} ${
                    c.assignedBy.lastName || ""
                  }`.trim()
                : "Master Admin",
          };
        })
      );

      // Process Education
      const educationData = Array.isArray(education.data) ? education.data : [];
      tasks.push(
        ...educationData.map((item: unknown) => {
          const e = item as {
            _id?: string;
            educationId?: string;
            supportType?: string;
            studentName?: string;
            status?: string;
            priority?: string;
            createdAt?: string;
            assignedAt?: string;
            assignedBy?: string | { firstName?: string; lastName?: string };
          };
          return {
            id: e._id || "",
            module: "Education",
            caseId: e.educationId || "",
            title: `${e.supportType || "Support"} - ${
              e.studentName || "Unknown"
            }`,
            status: e.status || "ASSIGNED",
            priority: e.priority || "P3",
            assignedAt: e.assignedAt || e.createdAt || new Date().toISOString(),
            dueDate: new Date(
              Date.now() + 3 * 24 * 60 * 60 * 1000
            ).toISOString(),
            assignedBy:
              typeof e.assignedBy === "object"
                ? `${e.assignedBy.firstName || ""} ${
                    e.assignedBy.lastName || ""
                  }`.trim()
                : "Master Admin",
          };
        })
      );

      // Process CSR/Industrial
      const csrData = Array.isArray(csrIndustrial.data)
        ? csrIndustrial.data
        : [];
      tasks.push(
        ...csrData.map((item: unknown) => {
          const c = item as {
            _id?: string;
            csrId?: string;
            projectName?: string;
            status?: string;
            priority?: string;
            createdAt?: string;
            assignedAt?: string;
            assignedBy?: string | { firstName?: string; lastName?: string };
          };
          return {
            id: c._id || "",
            module: "CSR/Industrial",
            caseId: c.csrId || "",
            title: c.projectName || "Untitled Project",
            status: c.status || "ASSIGNED",
            priority: c.priority || "P3",
            assignedAt: c.assignedAt || c.createdAt || new Date().toISOString(),
            dueDate: new Date(
              Date.now() + 3 * 24 * 60 * 60 * 1000
            ).toISOString(),
            assignedBy:
              typeof c.assignedBy === "object"
                ? `${c.assignedBy.firstName || ""} ${
                    c.assignedBy.lastName || ""
                  }`.trim()
                : "Master Admin",
          };
        })
      );

      // Process Appointments
      const appointmentData = Array.isArray(appointments.data)
        ? appointments.data
        : [];
      tasks.push(
        ...appointmentData.map((item: unknown) => {
          const a = item as {
            _id?: string;
            appointmentId?: string;
            purpose?: string;
            applicantName?: string;
            status?: string;
            priority?: string;
            createdAt?: string;
            assignedAt?: string;
            assignedBy?: string | { firstName?: string; lastName?: string };
          };
          return {
            id: a._id || "",
            module: "Appointments",
            caseId: a.appointmentId || "",
            title: `${a.purpose || "Meeting"} - ${
              a.applicantName || "Unknown"
            }`,
            status: a.status || "ASSIGNED",
            priority: a.priority || "P3",
            assignedAt: a.assignedAt || a.createdAt || new Date().toISOString(),
            dueDate: new Date(
              Date.now() + 3 * 24 * 60 * 60 * 1000
            ).toISOString(),
            assignedBy:
              typeof a.assignedBy === "object"
                ? `${a.assignedBy.firstName || ""} ${
                    a.assignedBy.lastName || ""
                  }`.trim()
                : "Master Admin",
          };
        })
      );

      // Process Programs
      const programData = Array.isArray(programs.data) ? programs.data : [];
      tasks.push(
        ...programData.map((item: unknown) => {
          const p = item as {
            _id?: string;
            programId?: string;
            eventName?: string;
            status?: string;
            priority?: string;
            createdAt?: string;
            assignedAt?: string;
            assignedBy?: string | { firstName?: string; lastName?: string };
          };
          return {
            id: p._id || "",
            module: "Programs",
            caseId: p.programId || "",
            title: p.eventName || "Untitled Program",
            status: p.status || "ASSIGNED",
            priority: p.priority || "P3",
            assignedAt: p.assignedAt || p.createdAt || new Date().toISOString(),
            dueDate: new Date(
              Date.now() + 3 * 24 * 60 * 60 * 1000
            ).toISOString(),
            assignedBy:
              typeof p.assignedBy === "object"
                ? `${p.assignedBy.firstName || ""} ${
                    p.assignedBy.lastName || ""
                  }`.trim()
                : "Master Admin",
          };
        })
      );

      // Sort by assigned date (most recent first)
      tasks.sort(
        (a, b) =>
          new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime()
      );

      return {
        success: true,
        data: tasks,
      };
    } catch (error) {
      console.error("Error fetching assigned tasks:", error);
      return {
        success: false,
        data: [],
      };
    }
  },
};

// Health check
export const healthAPI = {
  check: async () => {
    const response = await api.get("/health");
    return response.data;
  },
};

export default api;
