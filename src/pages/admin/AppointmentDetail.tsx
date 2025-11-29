import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Edit,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  FileText,
  Users,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { appointmentAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDistanceToNow } from "date-fns";

interface AppointmentDetail {
  _id?: string;
  appointmentId?: string;
  applicantName: string;
  mobile: string;
  email?: string;
  aadhaar?: string;
  address?: string;
  district?: string;
  mandal?: string;
  village?: string;
  constituency?: string;
  purpose: string;
  category?: string;
  description?: string;
  urgencyLevel?: string;
  preferredDate?: string;
  preferredTime?: string;
  alternativeDate?: string;
  alternativeTime?: string;
  estimatedDuration?: number;
  confirmedDate?: string;
  confirmedTime?: string;
  confirmedSlot?: string;
  meetingPlace?: string;
  specificLocation?: string;
  assignedTo?: { _id: string; firstName: string; lastName: string };
  coordinator?: { _id: string; firstName: string; lastName: string };
  status?: string;
  attendees?: string[];
  agenda?: string;
  meetingNotes?: string;
  checkInTime?: string;
  checkOutTime?: string;
  actualDuration?: number;
  followUpRequired?: boolean;
  followUpDate?: string;
  followUpNotes?: string;
  verifiedBy?: { _id: string; firstName: string; lastName: string };
  verifiedDate?: string;
  verificationNotes?: string;
  approvedBy?: { _id: string; firstName: string; lastName: string };
  approvedDate?: string;
  approvalNotes?: string;
  rejectionReason?: string;
  cancellationReason?: string;
  priority?: string;
  isVIP?: boolean;
  tags?: string[];
  internalNotes?: string;
  comments?: Array<{
    user: string | { firstName: string; lastName: string };
    text: string;
    createdAt: string;
  }>;
  attachments?: Array<{
    filename: string;
    url: string;
    uploadedAt: string;
  }>;
  statusHistory?: Array<{
    status: string;
    changedBy: string | { firstName: string; lastName: string };
    changedAt: string;
    notes?: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export default function AppointmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [appointment, setAppointment] = useState<AppointmentDetail | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const fetchAppointment = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await appointmentAPI.getById(id);

      if (response.success && response.data) {
        setAppointment(response.data as AppointmentDetail);
      } else {
        toast({
          title: "Error",
          description: "Failed to load appointment details",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching appointment:", error);
      toast({
        title: "Error",
        description: "Failed to load appointment details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    if (id) {
      fetchAppointment();
    }
  }, [id, fetchAppointment]);

  const getCategoryLabel = (category?: string) => {
    const labels: Record<string, string> = {
      PERSONAL_GRIEVANCE: "Personal Grievance",
      PROJECT_DISCUSSION: "Project Discussion",
      COMMUNITY_ISSUE: "Community Issue",
      BUSINESS_PROPOSAL: "Business Proposal",
      GENERAL_MEETING: "General Meeting",
      VIP_MEETING: "VIP Meeting",
      OTHER: "Other",
    };
    return category ? labels[category] || category : "N/A";
  };

  const getMeetingPlaceLabel = (place?: string) => {
    const labels: Record<string, string> = {
      CHIEF_MINISTER_OFFICE: "Chief Minister Office",
      SECRETARIAT: "Secretariat",
      DISTRICT_COLLECTORATE: "District Collectorate",
      FIELD_VISIT: "Field Visit",
      VIRTUAL_MEETING: "Virtual Meeting",
      OTHER: "Other",
    };
    return place ? labels[place] || place : "TBD";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="container max-w-6xl mx-auto p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Appointment Not Found</h2>
          <Button onClick={() => navigate("/admin/appointments")}>
            Back to List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/admin/appointments")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Appointment Details</h1>
            <p className="text-sm text-muted-foreground">
              ID: {appointment.appointmentId}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {appointment.isVIP && (
            <Badge variant="destructive" className="text-xs">
              VIP
            </Badge>
          )}
          {appointment.status && <StatusBadge status={appointment.status} />}
          <Button
            onClick={() =>
              navigate(
                `/admin/appointments/${
                  appointment.appointmentId || appointment._id
                }/edit`
              )
            }
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applicant Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Applicant Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="text-base">{appointment.applicantName}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  Mobile
                </p>
                <p className="text-base">{appointment.mobile}</p>
              </div>
              {appointment.email && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    Email
                  </p>
                  <p className="text-base">{appointment.email}</p>
                </div>
              )}
            </div>
            {appointment.aadhaar && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Aadhaar
                </p>
                <p className="text-base">{appointment.aadhaar}</p>
              </div>
            )}
            {appointment.address && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Address
                </p>
                <p className="text-base">{appointment.address}</p>
              </div>
            )}
            <div className="grid grid-cols-3 gap-4">
              {appointment.district && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    District
                  </p>
                  <p className="text-base">{appointment.district}</p>
                </div>
              )}
              {appointment.mandal && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Mandal
                  </p>
                  <p className="text-base">{appointment.mandal}</p>
                </div>
              )}
              {appointment.village && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Village
                  </p>
                  <p className="text-base">{appointment.village}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Appointment Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Appointment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Purpose
              </p>
              <p className="text-base">{appointment.purpose}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {appointment.category && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Category
                  </p>
                  <Badge variant="outline">
                    {getCategoryLabel(appointment.category)}
                  </Badge>
                </div>
              )}
              {appointment.urgencyLevel && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Urgency
                  </p>
                  <Badge
                    variant={
                      appointment.urgencyLevel === "URGENT" ||
                      appointment.urgencyLevel === "HIGH"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {appointment.urgencyLevel}
                  </Badge>
                </div>
              )}
            </div>
            {appointment.description && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Description
                </p>
                <p className="text-base">{appointment.description}</p>
              </div>
            )}
            {appointment.priority && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Priority
                </p>
                <Badge>{appointment.priority}</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Schedule Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Schedule Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-semibold mb-2">Preferred Slot</p>
              <div className="grid grid-cols-2 gap-4">
                {appointment.preferredDate && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Date
                    </p>
                    <p className="text-base">
                      {new Date(appointment.preferredDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {appointment.preferredTime && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Time
                    </p>
                    <p className="text-base">{appointment.preferredTime}</p>
                  </div>
                )}
              </div>
            </div>

            {(appointment.alternativeDate || appointment.alternativeTime) && (
              <>
                <Separator />
                <div>
                  <p className="text-sm font-semibold mb-2">Alternative Slot</p>
                  <div className="grid grid-cols-2 gap-4">
                    {appointment.alternativeDate && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Date
                        </p>
                        <p className="text-base">
                          {new Date(
                            appointment.alternativeDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {appointment.alternativeTime && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Time
                        </p>
                        <p className="text-base">
                          {appointment.alternativeTime}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {(appointment.confirmedDate || appointment.confirmedSlot) && (
              <>
                <Separator />
                <div className="bg-primary/5 p-3 rounded-lg">
                  <p className="text-sm font-semibold mb-2">Confirmed Slot</p>
                  <div className="grid grid-cols-2 gap-4">
                    {appointment.confirmedDate && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Date
                        </p>
                        <p className="text-base">
                          {new Date(
                            appointment.confirmedDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {appointment.confirmedTime && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Time
                        </p>
                        <p className="text-base">{appointment.confirmedTime}</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {appointment.estimatedDuration && (
              <div>
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Estimated Duration
                </p>
                <p className="text-base">
                  {appointment.estimatedDuration} minutes
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Meeting Place & Assignment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Meeting Place & Assignment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {appointment.meetingPlace && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Venue
                </p>
                <p className="text-base">
                  {getMeetingPlaceLabel(appointment.meetingPlace)}
                </p>
              </div>
            )}
            {appointment.specificLocation && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Specific Location
                </p>
                <p className="text-base">{appointment.specificLocation}</p>
              </div>
            )}
            <Separator />
            {appointment.assignedTo && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Assigned To
                </p>
                <p className="text-base">
                  {typeof appointment.assignedTo === "object"
                    ? `${appointment.assignedTo.firstName} ${appointment.assignedTo.lastName}`
                    : appointment.assignedTo}
                </p>
              </div>
            )}
            {appointment.coordinator && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Coordinator
                </p>
                <p className="text-base">
                  {typeof appointment.coordinator === "object"
                    ? `${appointment.coordinator.firstName} ${appointment.coordinator.lastName}`
                    : appointment.coordinator}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Meeting Details */}
      {(appointment.attendees?.length || appointment.agenda) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Meeting Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {appointment.attendees && appointment.attendees.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Attendees
                </p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {appointment.attendees.map((attendee, index) => (
                    <Badge key={index} variant="secondary">
                      {attendee}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {appointment.agenda && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Agenda
                </p>
                <p className="text-base whitespace-pre-wrap">
                  {appointment.agenda}
                </p>
              </div>
            )}
            {appointment.meetingNotes && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Meeting Notes
                </p>
                <p className="text-base whitespace-pre-wrap">
                  {appointment.meetingNotes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Check-in/out & Follow-up */}
      {(appointment.checkInTime ||
        appointment.followUpRequired ||
        appointment.followUpNotes) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Check-in & Follow-up
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {appointment.checkInTime && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Check-in Time
                  </p>
                  <p className="text-base">
                    {new Date(appointment.checkInTime).toLocaleString()}
                  </p>
                </div>
                {appointment.checkOutTime && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Check-out Time
                    </p>
                    <p className="text-base">
                      {new Date(appointment.checkOutTime).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            )}
            {appointment.actualDuration && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Actual Duration
                </p>
                <p className="text-base">
                  {appointment.actualDuration} minutes
                </p>
              </div>
            )}
            {appointment.followUpRequired && (
              <>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Follow-up Required
                  </p>
                  {appointment.followUpDate && (
                    <p className="text-base">
                      Due:{" "}
                      {new Date(appointment.followUpDate).toLocaleDateString()}
                    </p>
                  )}
                  {appointment.followUpNotes && (
                    <p className="text-base mt-1">
                      {appointment.followUpNotes}
                    </p>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Attachments */}
      {appointment.attachments && appointment.attachments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Attachments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {appointment.attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <div>
                      <p className="text-sm font-medium">
                        {attachment.filename}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(attachment.uploadedAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(attachment.url, "_blank")}
                  >
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Internal Notes */}
      {appointment.internalNotes && (
        <Card>
          <CardHeader>
            <CardTitle>Internal Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base whitespace-pre-wrap">
              {appointment.internalNotes}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Metadata */}
      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
        {appointment.createdAt && (
          <div>
            Created:{" "}
            {formatDistanceToNow(new Date(appointment.createdAt), {
              addSuffix: true,
            })}
          </div>
        )}
        {appointment.updatedAt && (
          <div>
            Last Updated:{" "}
            {formatDistanceToNow(new Date(appointment.updatedAt), {
              addSuffix: true,
            })}
          </div>
        )}
      </div>
    </div>
  );
}
