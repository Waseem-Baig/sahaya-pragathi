import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/StatusBadge";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  User as UserIcon,
  Phone,
  Mail,
  FileText,
  Edit,
  Gavel,
  Users,
  Loader2,
} from "lucide-react";
import { disputesAPI, usersAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { User } from "@/types/auth";

export default function DisputeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dispute, setDispute] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [mediators, setMediators] = useState<User[]>([]);
  const [selectedMediator, setSelectedMediator] = useState("");

  // Transform dispute data for consistent display
  const transformDisputeData = (data: Record<string, unknown>) => {
    const partyA =
      (data.partyA as {
        name?: string;
        contact?: string;
        email?: string;
        address?: string;
      }) || {};
    const partyB =
      (data.partyB as {
        name?: string;
        contact?: string;
        email?: string;
        address?: string;
      }) || {};
    const assignedTo = data.assignedTo as {
      firstName?: string;
      lastName?: string;
      department?: string;
    } | null;
    const mediator = data.mediator as {
      firstName?: string;
      lastName?: string;
      department?: string;
    } | null;

    return {
      ...data,
      party_a_name: partyA.name,
      party_a_contact: partyA.contact,
      party_a_email: partyA.email,
      party_a_address: partyA.address,
      party_b_name: partyB.name,
      party_b_contact: partyB.contact,
      party_b_email: partyB.email,
      party_b_address: partyB.address,
      assigned_to_name: assignedTo
        ? `${assignedTo.firstName} ${assignedTo.lastName}`
        : null,
      assigned_to_department: assignedTo?.department,
      mediator_name: mediator
        ? `${mediator.firstName} ${mediator.lastName}`
        : null,
      mediator_department: mediator?.department,
    };
  };

  useEffect(() => {
    const fetchDispute = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const response = await disputesAPI.getById(id);
        const transformedData = transformDisputeData(response.data);
        setDispute(transformedData);
      } catch (error) {
        console.error("Error fetching dispute:", error);
        toast({
          title: "Error",
          description: "Failed to load dispute details",
          variant: "destructive",
        });
        navigate("/admin/disputes");
      } finally {
        setLoading(false);
      }
    };

    fetchDispute();
  }, [id, navigate, toast]);

  const handleStatusChange = async (newStatus: string) => {
    if (!id || !dispute) return;

    try {
      await disputesAPI.update(id, { status: newStatus });

      toast({
        title: "Success",
        description: "Dispute status updated successfully",
      });

      // Refresh dispute data
      const response = await disputesAPI.getById(id);
      const transformedData = transformDisputeData(response.data);
      setDispute(transformedData);
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update dispute status",
        variant: "destructive",
      });
    }
  };

  const handleAssignMediator = async () => {
    setAssignDialogOpen(true);

    // Fetch mediators
    try {
      const response = await usersAPI.getAllUsers({ role: "L2_EXEC_ADMIN" });
      setMediators(response.data);
    } catch (error) {
      console.error("Error fetching mediators:", error);
      toast({
        title: "Error",
        description: "Failed to load mediators",
        variant: "destructive",
      });
    }
  };

  const handleConfirmAssign = async () => {
    if (!id || !selectedMediator) return;

    try {
      await disputesAPI.update(id, { assignedTo: selectedMediator });

      toast({
        title: "Success",
        description: "Mediator assigned successfully",
      });

      setAssignDialogOpen(false);

      // Refresh dispute data
      const response = await disputesAPI.getById(id);
      const transformedData = transformDisputeData(response.data);
      setDispute(transformedData);
    } catch (error) {
      console.error("Error assigning mediator:", error);
      toast({
        title: "Error",
        description: "Failed to assign mediator",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!dispute) {
    return (
      <div className="container mx-auto p-6">
        <p>Dispute not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/admin/disputes")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {dispute.disputeId as string}
            </h1>
            <p className="text-sm text-muted-foreground">
              Created{" "}
              {formatDistanceToNow(new Date(dispute.createdAt as string), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/admin/disputes/${id}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Party A Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Party A Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Name
                  </p>
                  <p className="text-sm font-semibold">
                    {dispute.party_a_name as string}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Contact
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <Phone className="h-3 w-3" />
                    {dispute.party_a_contact as string}
                  </p>
                </div>
                {dispute.party_a_email && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Email
                    </p>
                    <p className="text-sm flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      {dispute.party_a_email as string}
                    </p>
                  </div>
                )}
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Address
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    {dispute.party_a_address as string}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Party B Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Party B Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Name
                  </p>
                  <p className="text-sm font-semibold">
                    {dispute.party_b_name as string}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Contact
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <Phone className="h-3 w-3" />
                    {dispute.party_b_contact as string}
                  </p>
                </div>
                {dispute.party_b_email && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Email
                    </p>
                    <p className="text-sm flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      {dispute.party_b_email as string}
                    </p>
                  </div>
                )}
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Address
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    {dispute.party_b_address as string}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dispute Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gavel className="h-5 w-5" />
                Dispute Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Category
                  </p>
                  <Badge variant="outline">{dispute.category as string}</Badge>
                </div>
                {dispute.incidentDate && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Incident Date
                    </p>
                    <p className="text-sm flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      {new Date(
                        dispute.incidentDate as string
                      ).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {dispute.incidentPlace && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Incident Place
                    </p>
                    <p className="text-sm flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      {dispute.incidentPlace as string}
                    </p>
                  </div>
                )}
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Description
                </p>
                <p className="text-sm whitespace-pre-wrap">
                  {dispute.description as string}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Attachments */}
          {dispute.attachments &&
            (dispute.attachments as Array<unknown>).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Attachments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {(
                      dispute.attachments as Array<{
                        filename: string;
                        url: string;
                        uploadedAt: string;
                      }>
                    ).map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">
                              {file.filename}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Uploaded{" "}
                              {new Date(file.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(file.url, "_blank")}
                        >
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Current Status
                </p>
                <StatusBadge status={dispute.status as string} />
              </div>
              <div>
                <Label htmlFor="status">Change Status</Label>
                <Select
                  value={dispute.status as string}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEW">New</SelectItem>
                    <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                    <SelectItem value="MEDIATION_SCHEDULED">
                      Mediation Scheduled
                    </SelectItem>
                    <SelectItem value="IN_MEDIATION">In Mediation</SelectItem>
                    <SelectItem value="SETTLED">Settled</SelectItem>
                    <SelectItem value="REFERRED_TO_COURT">
                      Referred to Court
                    </SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Assignment */}
          <Card>
            <CardHeader>
              <CardTitle>Assignment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dispute.assigned_to_name ? (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Assigned To
                  </p>
                  <p className="text-sm font-semibold">
                    {dispute.assigned_to_name as string}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {dispute.assigned_to_department as string}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Not assigned</p>
              )}
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={handleAssignMediator}
              >
                <UserIcon className="h-4 w-4 mr-2" />
                {dispute.assigned_to_name ? "Reassign" : "Assign"} Mediator
              </Button>
            </CardContent>
          </Card>

          {/* Hearing Details */}
          {(dispute.hearingDate || dispute.hearingPlace) && (
            <Card>
              <CardHeader>
                <CardTitle>Hearing Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {dispute.hearingDate && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Date
                    </p>
                    <p className="text-sm flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      {new Date(dispute.hearingDate as string).toLocaleString()}
                    </p>
                  </div>
                )}
                {dispute.hearingPlace && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Place
                    </p>
                    <p className="text-sm flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      {dispute.hearingPlace as string}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Assign Mediator Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Mediator</DialogTitle>
            <DialogDescription>
              Select a mediator to assign to this dispute
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="mediator">Mediator</Label>
              <Select
                value={selectedMediator}
                onValueChange={setSelectedMediator}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a mediator" />
                </SelectTrigger>
                <SelectContent>
                  {mediators.map((mediator) => (
                    <SelectItem key={mediator._id} value={mediator._id}>
                      {mediator.firstName} {mediator.lastName} -{" "}
                      {mediator.department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAssignDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmAssign} disabled={!selectedMediator}>
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
