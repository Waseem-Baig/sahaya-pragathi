import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Clock, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  FileText,
  Upload,
  MessageSquare,
  Send,
  AlertTriangle,
  CheckCircle,
  Calendar
} from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import type { GrievanceFormData, TempleLetterFormData, CMRFFormData } from "@/types/government";

interface CaseDetailsProps {
  case: GrievanceFormData | TempleLetterFormData | CMRFFormData;
  onBack: () => void;
  userRole: 'L1' | 'L2' | 'L3';
  onStatusUpdate?: (id: string, status: string) => void;
  onAssign?: (id: string, assignee: string) => void;
}

export function CaseDetails({ case: caseData, onBack, userRole, onStatusUpdate, onAssign }: CaseDetailsProps) {
  const [newComment, setNewComment] = useState('');
  const [assignee, setAssignee] = useState(caseData.assignedTo || '');
  const [newStatus, setNewStatus] = useState<string>(caseData.status);

  const getCaseTypeLabel = (id: string) => {
    if (id.startsWith('GRV')) return 'Grievance';
    if (id.startsWith('TDL')) return 'Temple Letter';
    if (id.startsWith('CMR')) return 'CMRF';
    return 'Case';
  };

  const getAvailableStatuses = (caseType: string) => {
    if (caseType === 'Grievance') {
      return ['NEW', 'TRIAGED', 'ASSIGNED', 'IN_PROGRESS', 'DEPT_ESCALATED', 'RESOLVED', 'CLOSED'];
    }
    if (caseType === 'Temple Letter') {
      return ['REQUESTED', 'IN_REVIEW', 'APPROVED', 'LETTER_ISSUED', 'UTILIZED', 'EXPIRED'];
    }
    if (caseType === 'CMRF') {
      return ['INTAKE', 'DOCS_VERIFIED', 'SANCTION_REQUESTED', 'SANCTIONED', 'DISBURSED', 'UTILIZATION_SUBMITTED', 'CLOSED'];
    }
    return [];
  };

  const getSLAInfo = (caseData: any) => {
    if (!caseData.priority && !caseData.id.startsWith('GRV')) return null;
    
    const slaHours = {
      'P1': 48,
      'P2': 120,
      'P3': 240,
      'P4': 480,
    }[(caseData as any).priority] || 240;
    
    const createdAt = new Date(caseData.createdAt);
    const now = new Date();
    const hoursElapsed = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60));
    const hoursRemaining = slaHours - hoursElapsed;
    
    return {
      hoursRemaining: Math.abs(hoursRemaining),
      isBreached: hoursRemaining < 0,
      isNearBreach: hoursRemaining < 24 && hoursRemaining > 0,
      slaHours
    };
  };

  const handleStatusUpdate = () => {
    if (newStatus !== caseData.status) {
      onStatusUpdate?.(caseData.id, newStatus);
    }
  };

  const handleAssignment = () => {
    if (assignee !== caseData.assignedTo) {
      onAssign?.(caseData.id, assignee);
    }
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      // Handle comment addition
      console.log('Adding comment:', newComment);
      setNewComment('');
    }
  };

  const caseType = getCaseTypeLabel(caseData.id);
  const slaInfo = getSLAInfo(caseData);
  const availableStatuses = getAvailableStatuses(caseType);

  const renderCaseSpecificInfo = () => {
    if (caseData.id.startsWith('GRV')) {
      const grievance = caseData as GrievanceFormData;
      return (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-muted-foreground">Category</Label>
            <p className="font-medium">{grievance.category}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Subcategory</Label>
            <p className="font-medium">{grievance.subcategory}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Priority</Label>
            <Badge variant={
              grievance.priority === 'P1' ? 'destructive' :
              grievance.priority === 'P2' ? 'warning' :
              grievance.priority === 'P3' ? 'info' : 'secondary'
            }>
              {grievance.priority}
            </Badge>
          </div>
          <div>
            <Label className="text-muted-foreground">Location</Label>
            <p className="font-medium">{grievance.ward}, {grievance.mandal}</p>
          </div>
          <div className="col-span-2">
            <Label className="text-muted-foreground">Description</Label>
            <p className="font-medium">{grievance.description}</p>
          </div>
        </div>
      );
    }

    if (caseData.id.startsWith('TDL')) {
      const temple = caseData as TempleLetterFormData;
      return (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-muted-foreground">Temple Code</Label>
            <p className="font-medium">{temple.templeCode}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Letter Type</Label>
            <Badge variant={temple.letterType === 'VIP' ? 'warning' : 'info'}>
              {temple.letterType}
            </Badge>
          </div>
          <div>
            <Label className="text-muted-foreground">Applicants</Label>
            <p className="font-medium">{temple.applicantCount} People</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Requested Date</Label>
            <p className="font-medium">{new Date(temple.requestedDate).toLocaleDateString()}</p>
          </div>
          <div className="col-span-2">
            <Label className="text-muted-foreground">Primary Applicant</Label>
            <p className="font-medium">{temple.primaryApplicantName}</p>
          </div>
          {temple.additionalApplicants && (
            <div className="col-span-2">
              <Label className="text-muted-foreground">Other Applicants</Label>
              <p className="font-medium">{temple.additionalApplicants}</p>
            </div>
          )}
        </div>
      );
    }

    if (caseData.id.startsWith('CMR')) {
      const cmrf = caseData as CMRFFormData;
      return (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-muted-foreground">Patient</Label>
            <p className="font-medium">{cmrf.patientName}</p>
            <p className="text-sm text-muted-foreground">{cmrf.patientAge} years, {cmrf.patientGender}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Medical Condition</Label>
            <p className="font-medium">{cmrf.medicalCondition}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Hospital</Label>
            <p className="font-medium">{cmrf.hospitalCode}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Treatment Urgency</Label>
            <Badge variant={
              cmrf.treatmentUrgency === 'EMERGENCY' ? 'destructive' :
              cmrf.treatmentUrgency === 'URGENT' ? 'warning' : 'info'
            }>
              {cmrf.treatmentUrgency}
            </Badge>
          </div>
          <div>
            <Label className="text-muted-foreground">Cost Estimate</Label>
            <p className="font-medium">₹{cmrf.treatmentCostEstimate.toLocaleString()}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Annual Income</Label>
            <p className="font-medium">₹{cmrf.annualFamilyIncome.toLocaleString()}</p>
          </div>
          <div className="col-span-2">
            <Label className="text-muted-foreground">Detailed Diagnosis</Label>
            <p className="font-medium">{cmrf.detailedDiagnosis}</p>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-card p-6">
      <div className="container mx-auto max-w-5xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">{caseType} Details</h1>
              <Badge variant="outline">{caseData.id}</Badge>
              <StatusBadge status={caseData.status} />
            </div>
            <p className="text-muted-foreground">Created {new Date(caseData.createdAt).toLocaleDateString()}</p>
          </div>
          
          {slaInfo && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-gradient-card border border-border">
              {slaInfo.isBreached ? (
                <AlertTriangle className="h-4 w-4 text-destructive" />
              ) : (
                <Clock className="h-4 w-4 text-muted-foreground" />
              )}
              <div>
                <p className="text-sm font-medium">
                  {slaInfo.isBreached ? 'SLA Breached' : 'SLA Status'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {slaInfo.isBreached 
                    ? `${slaInfo.hoursRemaining}h overdue` 
                    : `${slaInfo.hoursRemaining}h remaining`
                  }
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Case Information */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Case Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderCaseSpecificInfo()}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    <span>{caseData.phone}</span>
                  </div>
                  {(caseData as any).email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      <span>{(caseData as any).email}</span>
                    </div>
                  )}
                  <div className="col-span-2 flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-primary mt-1" />
                    <span>{(caseData as any).address}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments/Activity */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Activity & Comments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-gradient-card border border-border">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span className="text-sm font-medium">Case Created</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(caseData.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Case submitted and assigned ID: {caseData.id}
                    </p>
                  </div>
                </div>
                
                {userRole !== 'L3' && (
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Add a comment or update..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                    />
                    <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Management */}
            {userRole !== 'L3' && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">Case Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="status">Update Status</Label>
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status.replace(/_/g, ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {newStatus !== caseData.status && (
                      <Button 
                        onClick={handleStatusUpdate} 
                        className="w-full mt-2"
                        variant="government"
                      >
                        Update Status
                      </Button>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <Label htmlFor="assignee">Assign To</Label>
                    <Input
                      id="assignee"
                      value={assignee}
                      onChange={(e) => setAssignee(e.target.value)}
                      placeholder="Enter officer name"
                    />
                    {assignee !== caseData.assignedTo && (
                      <Button 
                        onClick={handleAssignment} 
                        className="w-full mt-2"
                        variant="outline"
                      >
                        Assign Case
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Documents */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center py-4 text-muted-foreground">
                  <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No documents attached</p>
                </div>
                {userRole !== 'L3' && (
                  <Button variant="outline" size="sm" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            {userRole !== 'L3' && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Follow-up
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Citizen
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send SMS Update
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}