import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { programAPI } from "@/lib/api";
import {
  ArrowLeft,
  Edit,
  Calendar,
  MapPin,
  Users,
  Building2,
  IndianRupee,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { StatusBadge } from "@/components/StatusBadge";

export default function ProgramDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [program, setProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadProgram = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await programAPI.getById(id);
      setProgram(response.data);
    } catch (error) {
      console.error("Error loading program:", error);
      toast({
        title: "Error",
        description: "Failed to load program details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    loadProgram();
  }, [loadProgram]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Program not found</h2>
          <Button onClick={() => navigate("/admin/programs")}>
            Back to Programs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate("/admin/programs")}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Programs
      </Button>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{program.eventName}</h1>
              {program.isFeatured && (
                <Badge variant="default" className="h-6">
                  Featured
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="font-mono text-sm">{program.programId}</span>
              <span>•</span>
              <Badge
                variant={program.type === "JOB_MELA" ? "default" : "secondary"}
              >
                {program.type?.replace("_", " ")}
              </Badge>
              <span>•</span>
              <StatusBadge status={program.status} />
              {program.priority && (
                <>
                  <span>•</span>
                  <Badge
                    variant={
                      program.priority === "CRITICAL"
                        ? "destructive"
                        : program.priority === "HIGH"
                        ? "default"
                        : "outline"
                    }
                  >
                    {program.priority}
                  </Badge>
                </>
              )}
            </div>
          </div>
          <Button onClick={() => navigate(`/admin/programs/${id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Event Details */}
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {program.description && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {program.description}
                  </p>
                </div>
              )}

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Start Date</p>
                    <p className="text-sm text-muted-foreground">
                      {program.startDate
                        ? format(new Date(program.startDate), "PPP")
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">End Date</p>
                    <p className="text-sm text-muted-foreground">
                      {program.endDate
                        ? format(new Date(program.endDate), "PPP")
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Venue</p>
                  <p className="text-sm text-muted-foreground">
                    {program.venue}
                  </p>
                  {program.venueAddress && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {program.venueAddress}
                    </p>
                  )}
                  <div className="flex gap-2 mt-1">
                    {program.venueCity && (
                      <Badge variant="outline" className="text-xs">
                        {program.venueCity}
                      </Badge>
                    )}
                    {program.district && (
                      <Badge variant="outline" className="text-xs">
                        {program.district}
                      </Badge>
                    )}
                    {program.venueCapacity && (
                      <Badge variant="outline" className="text-xs">
                        Capacity: {program.venueCapacity}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {program.organizingDepartment && (
                <>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">
                        Organizing Department
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {program.organizingDepartment}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Registration Details */}
          {program.isRegistrationRequired !== false && (
            <Card>
              <CardHeader>
                <CardTitle>Registration Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-1">
                      Target Participants
                    </p>
                    <p className="text-2xl font-bold">
                      {program.targetParticipants || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Registrations</p>
                    <p className="text-2xl font-bold text-primary">
                      {program.registrations || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Attended</p>
                    <p className="text-2xl font-bold text-green-600">
                      {program.actualParticipants || 0}
                    </p>
                  </div>
                </div>

                <Separator />

                {program.registrationStartDate && (
                  <div>
                    <p className="text-sm font-medium mb-1">
                      Registration Period
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(program.registrationStartDate), "PPP")}{" "}
                      to{" "}
                      {program.registrationEndDate
                        ? format(new Date(program.registrationEndDate), "PPP")
                        : "Ongoing"}
                    </p>
                  </div>
                )}

                {program.registrationLink && (
                  <div>
                    <p className="text-sm font-medium mb-1">
                      Registration Link
                    </p>
                    <a
                      href={program.registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      {program.registrationLink}
                    </a>
                  </div>
                )}

                {program.registrationFee !== undefined && (
                  <div>
                    <p className="text-sm font-medium mb-1">Registration Fee</p>
                    <p className="text-sm text-muted-foreground">
                      {program.registrationFee === 0
                        ? "Free"
                        : `₹${program.registrationFee.toLocaleString()}`}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Program/Job Mela Specific Details */}
          {program.type === "JOB_MELA" && program.jobMelaDetails && (
            <Card>
              <CardHeader>
                <CardTitle>Job Mela Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {program.jobMelaDetails.totalJobPositions && (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Total Job Positions</p>
                      <p className="text-2xl font-bold text-primary">
                        {program.jobMelaDetails.totalJobPositions.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {program.jobMelaDetails.sectors &&
                  program.jobMelaDetails.sectors.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Sectors</p>
                      <div className="flex flex-wrap gap-2">
                        {program.jobMelaDetails.sectors.map(
                          (sector: string, index: number) => (
                            <Badge key={index} variant="secondary">
                              {sector}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {program.jobMelaDetails.eligibilityCriteria && (
                  <div>
                    <p className="text-sm font-medium mb-2">
                      Eligibility Criteria
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {program.jobMelaDetails.eligibilityCriteria}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {program.programDetails && (
            <Card>
              <CardHeader>
                <CardTitle>Program Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {program.programDetails.objectives && (
                  <div>
                    <p className="text-sm font-medium mb-2">Objectives</p>
                    <p className="text-sm text-muted-foreground">
                      {program.programDetails.objectives}
                    </p>
                  </div>
                )}

                {program.programDetails.targetAudience && (
                  <div>
                    <p className="text-sm font-medium mb-2">Target Audience</p>
                    <p className="text-sm text-muted-foreground">
                      {program.programDetails.targetAudience}
                    </p>
                  </div>
                )}

                {program.programDetails.topics &&
                  program.programDetails.topics.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Topics</p>
                      <div className="flex flex-wrap gap-2">
                        {program.programDetails.topics.map(
                          (topic: string, index: number) => (
                            <Badge key={index} variant="outline">
                              {topic}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {program.programDetails.certificateProvided && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium">
                      Certificate will be provided
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Statistics */}
          {program.statistics && (
            <Card>
              <CardHeader>
                <CardTitle>Statistics & Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {program.statistics.applicationsReceived !== undefined && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Applications
                      </p>
                      <p className="text-2xl font-bold">
                        {program.statistics.applicationsReceived}
                      </p>
                    </div>
                  )}
                  {program.statistics.candidatesShortlisted !== undefined && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Shortlisted
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {program.statistics.candidatesShortlisted}
                      </p>
                    </div>
                  )}
                  {program.statistics.offersExtended !== undefined && (
                    <div>
                      <p className="text-sm text-muted-foreground">Offers</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {program.statistics.offersExtended}
                      </p>
                    </div>
                  )}
                  {program.statistics.candidatesJoined !== undefined && (
                    <div>
                      <p className="text-sm text-muted-foreground">Joined</p>
                      <p className="text-2xl font-bold text-green-600">
                        {program.statistics.candidatesJoined}
                      </p>
                    </div>
                  )}
                </div>

                {program.statistics.feedbackRating && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-medium mb-2">Feedback Rating</p>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold text-yellow-600">
                        {program.statistics.feedbackRating.toFixed(1)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        / 5.0 ({program.statistics.feedbackCount} responses)
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Sidebar (1/3) */}
        <div className="space-y-6">
          {/* Partners */}
          {program.partners && program.partners.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Partners</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {program.partners.map((partner: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {partner}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Budget */}
          {program.budget && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <IndianRupee className="h-4 w-4" />
                  Budget
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {program.budget.estimatedBudget && (
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated</p>
                    <p className="text-lg font-semibold">
                      ₹{program.budget.estimatedBudget.toLocaleString()}
                    </p>
                  </div>
                )}
                {program.budget.actualExpense !== undefined && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Actual Expense
                    </p>
                    <p className="text-lg font-semibold text-red-600">
                      ₹{program.budget.actualExpense.toLocaleString()}
                    </p>
                  </div>
                )}
                {program.budget.fundingSource && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Funding Source
                    </p>
                    <p className="text-sm font-medium">
                      {program.budget.fundingSource}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Coordinator */}
          {program.coordinator && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Coordinator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {program.coordinator.name && (
                  <div>
                    <p className="text-sm font-medium">
                      {program.coordinator.name}
                    </p>
                    {program.coordinator.designation && (
                      <p className="text-sm text-muted-foreground">
                        {program.coordinator.designation}
                      </p>
                    )}
                  </div>
                )}
                {program.coordinator.contact && (
                  <p className="text-sm text-muted-foreground">
                    📞 {program.coordinator.contact}
                  </p>
                )}
                {program.coordinator.email && (
                  <p className="text-sm text-muted-foreground">
                    ✉️ {program.coordinator.email}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {program.createdAt && (
                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p className="font-medium">
                    {format(new Date(program.createdAt), "PPP")}
                  </p>
                </div>
              )}
              {program.updatedAt && (
                <div>
                  <p className="text-muted-foreground">Last Updated</p>
                  <p className="font-medium">
                    {format(new Date(program.updatedAt), "PPP")}
                  </p>
                </div>
              )}
              {program.referenceNumber && (
                <div>
                  <p className="text-muted-foreground">Reference Number</p>
                  <p className="font-medium font-mono">
                    {program.referenceNumber}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          {program.tags && program.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {program.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
