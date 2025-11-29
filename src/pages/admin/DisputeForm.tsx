import { useState, useEffect } from "react";
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
import { ArrowLeft, ArrowRight, Send, Loader2 } from "lucide-react";
import { FileUpload } from "@/components/shared/FileUpload";
import { disputesAPI, usersAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types/auth";

interface StepProps {
  data: Record<string, unknown>;
  updateField: (field: string, value: unknown) => void;
}

const asString = (value: unknown): string => {
  return value?.toString() || "";
};

const DISPUTE_CATEGORIES = [
  "Land",
  "Society",
  "Benefits",
  "Tenancy",
  "Family",
  "Property",
  "Other",
];

// Step 1: Party A Details
const PartyAStep = ({ data, updateField }: StepProps) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Party A Details</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="party_a_name">Party A Name *</Label>
        <Input
          id="party_a_name"
          value={asString(data.party_a_name)}
          onChange={(e) => updateField("party_a_name", e.target.value)}
          placeholder="Enter full name"
        />
      </div>
      <div>
        <Label htmlFor="party_a_contact">Party A Contact *</Label>
        <Input
          id="party_a_contact"
          value={asString(data.party_a_contact)}
          onChange={(e) => updateField("party_a_contact", e.target.value)}
          placeholder="Mobile number"
        />
      </div>
      <div>
        <Label htmlFor="party_a_email">Party A Email</Label>
        <Input
          id="party_a_email"
          type="email"
          value={asString(data.party_a_email)}
          onChange={(e) => updateField("party_a_email", e.target.value)}
          placeholder="Email address"
        />
      </div>
    </div>
    <div>
      <Label htmlFor="party_a_address">Party A Address *</Label>
      <Textarea
        id="party_a_address"
        value={asString(data.party_a_address)}
        onChange={(e) => updateField("party_a_address", e.target.value)}
        placeholder="Complete address"
        rows={3}
      />
    </div>
  </div>
);

// Step 2: Party B Details
const PartyBStep = ({ data, updateField }: StepProps) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Party B Details</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="party_b_name">Party B Name *</Label>
        <Input
          id="party_b_name"
          value={asString(data.party_b_name)}
          onChange={(e) => updateField("party_b_name", e.target.value)}
          placeholder="Enter full name"
        />
      </div>
      <div>
        <Label htmlFor="party_b_contact">Party B Contact *</Label>
        <Input
          id="party_b_contact"
          value={asString(data.party_b_contact)}
          onChange={(e) => updateField("party_b_contact", e.target.value)}
          placeholder="Mobile number"
        />
      </div>
      <div>
        <Label htmlFor="party_b_email">Party B Email</Label>
        <Input
          id="party_b_email"
          type="email"
          value={asString(data.party_b_email)}
          onChange={(e) => updateField("party_b_email", e.target.value)}
          placeholder="Email address"
        />
      </div>
    </div>
    <div>
      <Label htmlFor="party_b_address">Party B Address *</Label>
      <Textarea
        id="party_b_address"
        value={asString(data.party_b_address)}
        onChange={(e) => updateField("party_b_address", e.target.value)}
        placeholder="Complete address"
        rows={3}
      />
    </div>
  </div>
);

// Step 3: Dispute Details
const DisputeDetailsStep = ({ data, updateField }: StepProps) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Dispute Details</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="category">Dispute Category *</Label>
        <Select
          value={asString(data.category)}
          onValueChange={(value) => updateField("category", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {DISPUTE_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="incident_date">Incident Date</Label>
        <Input
          id="incident_date"
          type="date"
          value={asString(data.incident_date)}
          onChange={(e) => updateField("incident_date", e.target.value)}
        />
      </div>
    </div>
    <div>
      <Label htmlFor="incident_place">Incident Place</Label>
      <Input
        id="incident_place"
        value={asString(data.incident_place)}
        onChange={(e) => updateField("incident_place", e.target.value)}
        placeholder="Location where dispute occurred"
      />
    </div>
    <div>
      <Label htmlFor="description">Dispute Description *</Label>
      <Textarea
        id="description"
        value={asString(data.description)}
        onChange={(e) => updateField("description", e.target.value)}
        placeholder="Describe the dispute in detail..."
        rows={4}
      />
    </div>
  </div>
);

// Step 4: Supporting Documents
const DocumentsStep = ({ data, updateField }: StepProps) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Supporting Documents</h3>
    <FileUpload
      onFilesChange={(files: File[]) => updateField("attachments", files)}
      acceptedTypes={["application/pdf", "image/jpeg", "image/png"]}
      maxSizePerFile={10 * 1024 * 1024}
      maxFiles={5}
      existingFiles={
        (
          data.attachments as Array<{
            _id?: string;
            filename: string;
            url: string;
            uploadedAt?: string;
          }>
        )?.map((att) => ({
          id: att._id || att.filename,
          name: att.filename,
          type: att.filename?.endsWith(".pdf")
            ? "application/pdf"
            : "image/jpeg",
          size: 0,
          url: att.url,
          uploadedAt: att.uploadedAt,
        })) || []
      }
    />
    <div className="text-sm text-muted-foreground">
      <p>Upload relevant documents:</p>
      <ul className="list-disc list-inside mt-2">
        <li>Property documents (if applicable)</li>
        <li>Previous correspondence</li>
        <li>Photographs of disputed items/property</li>
        <li>Any legal notices</li>
      </ul>
    </div>
  </div>
);

// Step 5: Assignment
const AssignmentStep = ({ data, updateField }: StepProps) => {
  const [mediators, setMediators] = useState<
    Array<{ id: string; name: string; department: string }>
  >([]);
  const [loadingMediators, setLoadingMediators] = useState(false);

  useEffect(() => {
    const fetchMediators = async () => {
      setLoadingMediators(true);
      try {
        const response = await usersAPI.getAllUsers({ role: "L2_EXEC_ADMIN" });
        const mediatorsList = response.data.map((user: User) => ({
          id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          department: user.department || "General",
        }));
        setMediators(mediatorsList);
      } catch (error) {
        console.error("Error fetching mediators:", error);
      } finally {
        setLoadingMediators(false);
      }
    };
    fetchMediators();
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Assignment & Scheduling</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="assigned_to">Assign Mediator</Label>
          <Select
            value={asString(data.assigned_to)}
            onValueChange={(value) => updateField("assigned_to", value)}
            disabled={loadingMediators}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  loadingMediators ? "Loading mediators..." : "Select mediator"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {mediators.length === 0 ? (
                <SelectItem value="_none" disabled>
                  {loadingMediators ? "Loading..." : "No mediators available"}
                </SelectItem>
              ) : (
                mediators.map((mediator) => (
                  <SelectItem key={mediator.id} value={mediator.id}>
                    <div>
                      <div className="font-medium">{mediator.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {mediator.department}
                      </div>
                    </div>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="hearing_date">Schedule Hearing</Label>
          <Input
            id="hearing_date"
            type="date"
            value={asString(data.hearing_date)}
            onChange={(e) => updateField("hearing_date", e.target.value)}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="hearing_place">Hearing Place</Label>
        <Input
          id="hearing_place"
          value={asString(data.hearing_place)}
          onChange={(e) => updateField("hearing_place", e.target.value)}
          placeholder="Venue for hearing"
        />
      </div>
    </div>
  );
};

export default function DisputeForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [formData, setFormData] = useState<Record<string, unknown>>({
    status: "NEW",
  });

  const isEditMode = !!id;
  const totalSteps = 5;

  // Fetch existing dispute data in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const fetchDispute = async () => {
        setLoadingData(true);
        try {
          const response = await disputesAPI.getById(id);
          const dispute = response.data;

          // Transform backend data to form format
          setFormData({
            party_a_name: (dispute.partyA as { name?: string })?.name || "",
            party_a_contact:
              (dispute.partyA as { contact?: string })?.contact || "",
            party_a_email: (dispute.partyA as { email?: string })?.email || "",
            party_a_address:
              (dispute.partyA as { address?: string })?.address || "",
            party_b_name: (dispute.partyB as { name?: string })?.name || "",
            party_b_contact:
              (dispute.partyB as { contact?: string })?.contact || "",
            party_b_email: (dispute.partyB as { email?: string })?.email || "",
            party_b_address:
              (dispute.partyB as { address?: string })?.address || "",
            category: dispute.category || "",
            description: dispute.description || "",
            incident_place: dispute.incidentPlace || "",
            incident_date: dispute.incidentDate
              ? String(dispute.incidentDate).split("T")[0]
              : "",
            assigned_to:
              typeof dispute.assignedTo === "object"
                ? ((dispute.assignedTo as Record<string, unknown>)
                    ?._id as string)
                : dispute.assignedTo || "",
            hearing_date: dispute.hearingDate
              ? String(dispute.hearingDate).split("T")[0]
              : "",
            hearing_place: dispute.hearingPlace || "",
            status: dispute.status || "NEW",
            attachments: dispute.attachments || [],
          });
        } catch (error) {
          console.error("Error fetching dispute:", error);
          toast({
            title: "Error",
            description:
              error instanceof Error
                ? error.message
                : "Failed to load dispute data",
            variant: "destructive",
          });
        } finally {
          setLoadingData(false);
        }
      };
      fetchDispute();
    }
  }, [id, isEditMode, toast]);

  const updateField = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const disputePayload = {
        partyA: {
          name: asString(formData.party_a_name),
          contact: asString(formData.party_a_contact),
          email: asString(formData.party_a_email) || undefined,
          address: asString(formData.party_a_address),
        },
        partyB: {
          name: asString(formData.party_b_name),
          contact: asString(formData.party_b_contact),
          email: asString(formData.party_b_email) || undefined,
          address: asString(formData.party_b_address),
        },
        category: asString(formData.category),
        description: asString(formData.description),
        incidentPlace: asString(formData.incident_place) || undefined,
        incidentDate: asString(formData.incident_date) || undefined,
        assignedTo: asString(formData.assigned_to) || undefined,
        hearingDate: asString(formData.hearing_date) || undefined,
        hearingPlace: asString(formData.hearing_place) || undefined,
        attachments:
          (formData.attachments as Array<{
            filename: string;
            url: string;
            uploadedAt: Date;
          }>) || [],
      };

      let response;
      if (isEditMode && id) {
        response = await disputesAPI.update(id, disputePayload);
        toast({
          title: "Success",
          description: `Dispute ${response.data.dispute_id} updated successfully!`,
        });
      } else {
        response = await disputesAPI.create(disputePayload);
        toast({
          title: "Success",
          description: `Dispute ${response.data.dispute_id} created successfully!`,
        });
      }

      navigate("/admin/disputes");
    } catch (error) {
      console.error("Error submitting dispute:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to submit dispute",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const progress = (step / totalSteps) * 100;

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate("/admin/disputes")}
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Disputes
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>
            {isEditMode ? "Edit Dispute" : "New Dispute Resolution Form"}
          </CardTitle>
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground">
            Step {step} of {totalSteps}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <PartyAStep data={formData} updateField={updateField} />
          )}
          {step === 2 && (
            <PartyBStep data={formData} updateField={updateField} />
          )}
          {step === 3 && (
            <DisputeDetailsStep data={formData} updateField={updateField} />
          )}
          {step === 4 && (
            <DocumentsStep data={formData} updateField={updateField} />
          )}
          {step === 5 && (
            <AssignmentStep data={formData} updateField={updateField} />
          )}

          <div className="flex justify-between pt-4">
            {step > 1 && (
              <Button
                onClick={handlePrevious}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>
            )}

            <div className="ml-auto flex gap-2">
              {step < totalSteps ? (
                <Button
                  onClick={handleNext}
                  className="flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {isEditMode ? "Updating..." : "Submitting..."}
                    </>
                  ) : (
                    <>
                      {isEditMode ? "Update" : "Submit"} Dispute
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
