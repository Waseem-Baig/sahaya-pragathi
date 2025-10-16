// Type definitions for Government Citizen Services System

export type UserRole = 'L1_MASTER_ADMIN' | 'L2_EXEC_ADMIN' | 'L3_CITIZEN';

export type Priority = 'P1' | 'P2' | 'P3' | 'P4';

export type GrievanceStatus = 
  | 'NEW' 
  | 'TRIAGED' 
  | 'ASSIGNED' 
  | 'IN_PROGRESS' 
  | 'DEPT_ESCALATED' 
  | 'RESOLVED' 
  | 'CLOSED';

export type DisputeStatus = 
  | 'NEW' 
  | 'INTAKE_COMPLETE' 
  | 'MEDIATION_SCHEDULED' 
  | 'HEARING_1' 
  | 'HEARING_2' 
  | 'SETTLED' 
  | 'REFERRED_TO_DEPT' 
  | 'REFERRED_TO_COURT' 
  | 'CLOSED';

export type TempleLetterStatus = 
  | 'REQUESTED' 
  | 'IN_REVIEW' 
  | 'APPROVED' 
  | 'LETTER_ISSUED' 
  | 'UTILIZED' 
  | 'EXPIRED';

export type AppointmentStatus = 
  | 'REQUESTED' 
  | 'CONFIRMED' 
  | 'CHECKED_IN' 
  | 'COMPLETED' 
  | 'NO_SHOW';

export interface Citizen {
  id: string;
  name: string;
  phone: string;
  aadhaarHash?: string;
  address: string;
  district: string;
  mandal: string;
  ward: string;
  consentFlags: string[];
  createdAt: Date;
}

export interface Grievance {
  id: string;
  citizenId: string;
  citizen?: Citizen;
  category: string;
  subcategory: string;
  description: string;
  priority: Priority;
  status: GrievanceStatus;
  assignedTo?: string;
  slaDueAt: Date;
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
  attachments: string[];
  location: {
    district: string;
    mandal: string;
    ward: string;
  };
}

export interface Dispute {
  id: string;
  partyA: Citizen;
  partyB: Citizen;
  category: string;
  description: string;
  status: DisputeStatus;
  mediatorId?: string;
  nextHearingAt?: Date;
  outcome?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TempleLetter {
  id: string;
  citizenId: string;
  citizen?: Citizen;
  templeId: string;
  templeName: string;
  month: string;
  quotaType: 'VIP' | 'General';
  requestedDate?: Date;
  status: TempleLetterStatus;
  approvedBy?: string;
  letterPdfUrl?: string;
  utilizedAt?: Date;
  createdAt: Date;
}

export interface Appointment {
  id: string;
  requesterId: string;
  requester?: Citizen;
  category: 'CITIZEN' | 'MEDIA' | 'VENDOR' | 'PARTY_CADRE';
  slotStart: Date;
  slotEnd: Date;
  purpose: string;
  status: AppointmentStatus;
  attendees: string[];
  documents: string[];
  createdAt: Date;
}

export interface KPIMetric {
  id: string;
  date: Date;
  district: string;
  metric: string;
  value: number;
  target?: number;
}

export interface User {
  id: string;
  role: UserRole;
  name: string;
  phone: string;
  email?: string;
  districtScope?: string[];
  departmentId?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export const PRIORITY_CONFIG: Record<Priority, { label: string; slaHours: number; color: string }> = {
  P1: { label: 'Critical', slaHours: 48, color: 'destructive' },
  P2: { label: 'High', slaHours: 120, color: 'warning' },
  P3: { label: 'Medium', slaHours: 240, color: 'info' },
  P4: { label: 'Low', slaHours: 480, color: 'muted' }
};

export const GRIEVANCE_CATEGORIES = [
  'Infrastructure',
  'Healthcare', 
  'Education',
  'Water Supply',
  'Electricity',
  'Roads & Transport',
  'Welfare Schemes',
  'Revenue Services',
  'Police & Law',
  'Other'
];

// Form Data Interfaces
export interface GrievanceFormData {
  id: string;
  citizenName: string;
  phone: string;
  email?: string;
  category: string;
  subcategory: string;
  description: string;
  priority: Priority;
  district: string;
  mandal: string;
  ward: string;
  address: string;
  pincode?: string;
  aadhaarNumber?: string;
  status: GrievanceStatus;
  assignedTo?: string;
  createdAt: string;
  updatedAt?: string;
  closedAt?: string;
}

export interface TempleLetterFormData {
  id: string;
  templeCode: string;
  letterType: 'VIP' | 'GENERAL';
  primaryApplicantName: string;
  primaryApplicantAge: number;
  phone: string;
  aadhaarNumber?: string;
  address: string;
  district: string;
  applicantCount: number;
  additionalApplicants?: string;
  requestedDate: string;
  purpose?: string;
  status: TempleLetterStatus;
  assignedTo?: string;
  createdAt: string;
  updatedAt?: string;
  approvedAt?: string;
}

export interface CMRFFormData {
  id: string;
  patientName: string;
  patientAge: number;
  patientGender: 'MALE' | 'FEMALE' | 'OTHER';
  applicantName: string;
  relationshipToApplicant: string;
  phone: string;
  aadhaarNumber?: string;
  address: string;
  district: string;
  medicalCondition: string;
  detailedDiagnosis: string;
  hospitalCode: string;
  doctorName: string;
  treatmentUrgency: 'EMERGENCY' | 'URGENT' | 'ROUTINE';
  treatmentCostEstimate: number;
  incomeCategory: string;
  annualFamilyIncome: number;
  previousGovernmentSupport?: string;
  status: CMRFStatus;
  assignedTo?: string;
  createdAt: string;
  updatedAt?: string;
  sanctionedAmount?: number;
  sanctionedAt?: string;
}

export type CMRFStatus = 'INTAKE' | 'DOCS_VERIFIED' | 'SANCTION_REQUESTED' | 'SANCTIONED' | 'DISBURSED' | 'UTILIZATION_SUBMITTED' | 'CLOSED';

// New service types
export type EducationSupportStatus = 'APPLIED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'CLOSED';
export type CSRIndustrialStatus = 'APPLIED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'CLOSED';
export type EmergencySupportStatus = 'LOGGED' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'ESCALATED';
export type EmergencyType = 'MEDICAL' | 'POLICE' | 'FIRE' | 'OTHER';

// Enhanced form interfaces
export interface DisputeFormData {
  id: string;
  partyAName: string;
  partyAContact: string;
  partyAAddress: string;
  partyBName: string;
  partyBContact: string;
  partyBAddress: string;
  category: string;
  description: string;
  incidentPlace: string;
  incidentDate: string;
  status: DisputeStatus;
  mediatorId?: string;
  hearingDate?: string;
  hearingPlace?: string;
  outcome?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface EducationSupportFormData {
  id: string;
  studentName: string;
  studentAge: number;
  contact: string;
  institutionName: string;
  programApplied: string;
  feeConcessionPercentage: number;
  status: EducationSupportStatus;
  assignedTo?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CSRIndustrialFormData {
  id: string;
  companyName: string;
  contactPerson: string;
  cinPan?: string;
  projectName: string;
  budget: number;
  district?: string;
  mandal?: string;
  tenderReference?: string;
  progressNotes?: string;
  status: CSRIndustrialStatus;
  assignedTo?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AppointmentFormData {
  id: string;
  applicantName: string;
  contact: string;
  purpose: 'CITIZEN' | 'MEDIA' | 'VENDOR' | 'PARTY_CADRE';
  preferredDate: string;
  preferredTime?: string;
  notes?: string;
  confirmedSlot?: string;
  meetingPlace?: string;
  status: AppointmentStatus;
  assignedTo?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface EmergencySupportFormData {
  id: string;
  applicantName: string;
  mobile: string;
  emergencyType: EmergencyType;
  location: string;
  description: string;
  officerContact?: string;
  actionTaken?: string;
  status: EmergencySupportStatus;
  assignedTo?: string;
  createdAt: string;
  updatedAt?: string;
}

// Common categories
export const DISPUTE_CATEGORIES = [
  'Land Disputes',
  'Welfare Schemes',
  'Society Issues',
  'Tenancy',
  'Property',
  'Water Rights',
  'Business',
  'Other'
];

export const EMERGENCY_TYPES = [
  { value: 'MEDICAL', label: 'Medical Emergency' },
  { value: 'POLICE', label: 'Police Assistance' },
  { value: 'FIRE', label: 'Fire Emergency' },
  { value: 'OTHER', label: 'Other Emergency' }
];

export const PURPOSE_TYPES = [
  { value: 'CITIZEN', label: 'Citizen Meeting' },
  { value: 'MEDIA', label: 'Media Interview' },
  { value: 'VENDOR', label: 'Vendor/Business' },
  { value: 'PARTY_CADRE', label: 'Party Member' }
];