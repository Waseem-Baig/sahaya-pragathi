import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { programAPI } from "@/lib/api";
import { ArrowLeft, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const STEPS = [
  { id: 1, name: "Basic Info", description: "Event details" },
  { id: 2, name: "Venue & Dates", description: "Location and timing" },
  { id: 3, name: "Registration", description: "Participant details" },
  { id: 4, name: "Program Details", description: "Agenda and specifics" },
  { id: 5, name: "Partners & Budget", description: "Collaboration details" },
];

export default function ProgramForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [partners, setPartners] = useState<string[]>([]);
  const [newPartner, setNewPartner] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [newTopic, setNewTopic] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm();

  const isEditMode = !!id;
  const programType = watch("type");

  const loadProgramData = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await programAPI.getById(id);
      const program = response.data;

      // Set form values
      Object.keys(program).forEach((key) => {
        setValue(key, program[key]);
      });

      // Set partners
      if (program.partners) {
        setPartners(program.partners);
      }

      // Set topics
      if (program.programDetails?.topics) {
        setTopics(program.programDetails.topics);
      }
    } catch (error) {
      console.error("Error loading program:", error);
      toast({
        title: "Error",
        description: "Failed to load program data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [id, setValue, toast]);

  useEffect(() => {
    if (isEditMode) {
      loadProgramData();
    }
  }, [isEditMode, loadProgramData]);

  const addPartner = () => {
    if (newPartner.trim()) {
      setPartners([...partners, newPartner.trim()]);
      setNewPartner("");
    }
  };

  const removePartner = (index: number) => {
    setPartners(partners.filter((_, i) => i !== index));
  };

  const addTopic = () => {
    if (newTopic.trim()) {
      setTopics([...topics, newTopic.trim()]);
      setNewTopic("");
    }
  };

  const removeTopic = (index: number) => {
    setTopics(topics.filter((_, i) => i !== index));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    try {
      setLoading(true);

      const payload = {
        ...data,
        partners,
        programDetails: {
          ...data.programDetails,
          topics,
        },
      };

      if (isEditMode) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await programAPI.update(id!, payload as any);
        toast({
          title: "Success",
          description: "Program updated successfully",
        });
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await programAPI.create(payload as any);
        toast({
          title: "Success",
          description: "Program created successfully",
        });
      }

      navigate("/admin/programs");
    } catch (error) {
      console.error("Error saving program:", error);
      toast({
        title: "Error",
        description: "Failed to save program",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate("/admin/programs")}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Programs
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {isEditMode ? "Edit Program/Event" : "Create New Program/Event"}
        </h1>
        <p className="text-muted-foreground">
          {isEditMode
            ? "Update program/event details"
            : "Fill in the details to create a new program or job mela"}
        </p>
      </div>

      {/* Steps Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center ${
                index < STEPS.length - 1 ? "flex-1" : ""
              }`}
            >
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep > step.id
                      ? "bg-primary text-primary-foreground"
                      : currentStep === step.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    step.id
                  )}
                </div>
                <div className="mt-2 text-center">
                  <div className="text-sm font-medium">{step.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {step.description}
                  </div>
                </div>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 ${
                    currentStep > step.id ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={(e) => {
          // Prevent form submission on Enter key press
          if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
            e.preventDefault();
          }
        }}
      >
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Enter the basic details about the program or event
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="eventName">
                  Event Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="eventName"
                  {...register("eventName", {
                    required: "Event name is required",
                  })}
                  placeholder="e.g., Mega Job Mela - IT Sector"
                />
                {errors.eventName && (
                  <p className="text-sm text-red-500">
                    {errors.eventName.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">
                  Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) => setValue("type", value)}
                  defaultValue={watch("type")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="JOB_MELA">Job Mela</SelectItem>
                    <SelectItem value="PROGRAM">Program</SelectItem>
                    <SelectItem value="TRAINING">Training</SelectItem>
                    <SelectItem value="WORKSHOP">Workshop</SelectItem>
                    <SelectItem value="SEMINAR">Seminar</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Describe the program/event"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organizingDepartment">
                  Organizing Department
                </Label>
                <Input
                  id="organizingDepartment"
                  {...register("organizingDepartment")}
                  placeholder="e.g., Department of Labor"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    onValueChange={(value) => setValue("priority", value)}
                    defaultValue={watch("priority") || "MEDIUM"}
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

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    onValueChange={(value) => setValue("status", value)}
                    defaultValue={watch("status") || "PLANNED"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PLANNED">Planned</SelectItem>
                      <SelectItem value="REGISTRATION">
                        Registration Open
                      </SelectItem>
                      <SelectItem value="REGISTRATION_CLOSED">
                        Registration Closed
                      </SelectItem>
                      <SelectItem value="ONGOING">Ongoing</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      <SelectItem value="POSTPONED">Postponed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Venue & Dates */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Venue & Dates</CardTitle>
              <CardDescription>
                Specify location and timing details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="venue">
                  Venue <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="venue"
                  {...register("venue", { required: "Venue is required" })}
                  placeholder="e.g., Vijayawada Convention Center"
                />
                {errors.venue && (
                  <p className="text-sm text-red-500">
                    {errors.venue.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="venueAddress">Venue Address</Label>
                <Textarea
                  id="venueAddress"
                  {...register("venueAddress")}
                  placeholder="Complete address"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="venueCity">City</Label>
                  <Input
                    id="venueCity"
                    {...register("venueCity")}
                    placeholder="City"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  <Select
                    onValueChange={(value) => setValue("district", value)}
                    defaultValue={watch("district")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nellore">Nellore</SelectItem>
                      <SelectItem value="Tirupati">Tirupati</SelectItem>
                      <SelectItem value="Vijayawada">Vijayawada</SelectItem>
                      <SelectItem value="Visakhapatnam">
                        Visakhapatnam
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="venueCapacity">Venue Capacity</Label>
                  <Input
                    id="venueCapacity"
                    type="number"
                    {...register("venueCapacity")}
                    placeholder="Capacity"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">
                    Start Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    {...register("startDate", {
                      required: "Start date is required",
                    })}
                  />
                  {errors.startDate && (
                    <p className="text-sm text-red-500">
                      {errors.startDate.message as string}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">
                    End Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    {...register("endDate", {
                      required: "End date is required",
                    })}
                  />
                  {errors.endDate && (
                    <p className="text-sm text-red-500">
                      {errors.endDate.message as string}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Registration */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Registration Details</CardTitle>
              <CardDescription>
                Configure registration and participation settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isRegistrationRequired"
                  onCheckedChange={(checked) =>
                    setValue("isRegistrationRequired", checked)
                  }
                  defaultChecked={watch("isRegistrationRequired") !== false}
                />
                <Label htmlFor="isRegistrationRequired">
                  Registration Required
                </Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="registrationStartDate">
                    Registration Start Date
                  </Label>
                  <Input
                    id="registrationStartDate"
                    type="date"
                    {...register("registrationStartDate")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registrationEndDate">
                    Registration End Date
                  </Label>
                  <Input
                    id="registrationEndDate"
                    type="date"
                    {...register("registrationEndDate")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="registrationLink">Registration Link</Label>
                <Input
                  id="registrationLink"
                  {...register("registrationLink")}
                  placeholder="https://example.com/register"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="targetParticipants">
                    Target Participants
                  </Label>
                  <Input
                    id="targetParticipants"
                    type="number"
                    {...register("targetParticipants")}
                    placeholder="Expected number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registrationFee">Registration Fee (₹)</Label>
                  <Input
                    id="registrationFee"
                    type="number"
                    {...register("registrationFee")}
                    placeholder="0"
                    defaultValue={0}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Program Details */}
        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Program/Job Mela Details</CardTitle>
              <CardDescription>
                Add specific information about the event
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {programType === "JOB_MELA" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="jobMelaDetails.totalJobPositions">
                      Total Job Positions
                    </Label>
                    <Input
                      id="jobMelaDetails.totalJobPositions"
                      type="number"
                      {...register("jobMelaDetails.totalJobPositions")}
                      placeholder="Number of positions"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jobMelaDetails.eligibilityCriteria">
                      Eligibility Criteria
                    </Label>
                    <Textarea
                      id="jobMelaDetails.eligibilityCriteria"
                      {...register("jobMelaDetails.eligibilityCriteria")}
                      placeholder="Qualification, experience, etc."
                      rows={3}
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="programDetails.objectives">Objectives</Label>
                <Textarea
                  id="programDetails.objectives"
                  {...register("programDetails.objectives")}
                  placeholder="Main objectives of the program"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="programDetails.targetAudience">
                  Target Audience
                </Label>
                <Input
                  id="programDetails.targetAudience"
                  {...register("programDetails.targetAudience")}
                  placeholder="Who should attend"
                />
              </div>

              <div className="space-y-2">
                <Label>Topics/Sectors</Label>
                <div className="flex gap-2">
                  <Input
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    placeholder="Add topic"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTopic();
                      }
                    }}
                  />
                  <Button type="button" onClick={addTopic}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {topics.map((topic, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => removeTopic(index)}
                    >
                      {topic} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="programDetails.certificateProvided"
                  onCheckedChange={(checked) =>
                    setValue("programDetails.certificateProvided", checked)
                  }
                  defaultChecked={watch("programDetails.certificateProvided")}
                />
                <Label htmlFor="programDetails.certificateProvided">
                  Certificate Provided
                </Label>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Partners & Budget */}
        {currentStep === 5 && (
          <Card>
            <CardHeader>
              <CardTitle>Partners & Budget</CardTitle>
              <CardDescription>
                Add collaboration and financial details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Partners/Collaborators</Label>
                <div className="flex gap-2">
                  <Input
                    value={newPartner}
                    onChange={(e) => setNewPartner(e.target.value)}
                    placeholder="Add partner name"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addPartner();
                      }
                    }}
                  />
                  <Button type="button" onClick={addPartner}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {partners.map((partner, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => removePartner(index)}
                    >
                      {partner} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget.estimatedBudget">
                  Estimated Budget (₹)
                </Label>
                <Input
                  id="budget.estimatedBudget"
                  type="number"
                  {...register("budget.estimatedBudget")}
                  placeholder="Budget amount"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget.fundingSource">Funding Source</Label>
                <Input
                  id="budget.fundingSource"
                  {...register("budget.fundingSource")}
                  placeholder="e.g., State Government, CSR, etc."
                />
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-4">Coordinator Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="coordinator.name">Name</Label>
                    <Input
                      id="coordinator.name"
                      {...register("coordinator.name")}
                      placeholder="Coordinator name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="coordinator.designation">Designation</Label>
                    <Input
                      id="coordinator.designation"
                      {...register("coordinator.designation")}
                      placeholder="Job title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="coordinator.contact">Contact</Label>
                    <Input
                      id="coordinator.contact"
                      {...register("coordinator.contact")}
                      placeholder="Phone number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="coordinator.email">Email</Label>
                    <Input
                      id="coordinator.email"
                      type="email"
                      {...register("coordinator.email")}
                      placeholder="Email address"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2">
            {currentStep < STEPS.length ? (
              <Button type="button" onClick={nextStep}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button type="submit" disabled={loading}>
                {loading
                  ? "Saving..."
                  : isEditMode
                  ? "Update Program"
                  : "Create Program"}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
