import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { ArrowLeft, Scale, Loader2 } from "lucide-react";
import { disputesAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface DisputeFormProps {
  onBack: () => void;
}

interface DisputeFormState {
  // Party A Information
  partyA: {
    name: string;
    contact: string;
    email?: string;
    address: string;
  };
  // Party B Information
  partyB: {
    name: string;
    contact: string;
    email?: string;
    address: string;
  };
  // Dispute Details
  category:
    | "Land"
    | "Society"
    | "Benefits"
    | "Tenancy"
    | "Family"
    | "Property"
    | "Other";
  description: string;
  incidentDate?: string;
  incidentPlace?: string;
  // Location Details
  district?: string;
  mandal?: string;
  ward?: string;
  pincode?: string;
}

export function DisputeForm({ onBack }: DisputeFormProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<DisputeFormState>({
    partyA: {
      name: "",
      contact: "",
      address: "",
    },
    partyB: {
      name: "",
      contact: "",
      address: "",
    },
    category: "Land",
    description: "",
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Validation
      if (
        !formData.partyA.name ||
        !formData.partyA.contact ||
        !formData.partyA.address ||
        !formData.partyB.name ||
        !formData.partyB.contact ||
        !formData.partyB.address ||
        !formData.description
      ) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (
        !/^\d{10}$/.test(formData.partyA.contact) ||
        !/^\d{10}$/.test(formData.partyB.contact)
      ) {
        toast({
          title: "Invalid Mobile Number",
          description:
            "Please enter valid 10-digit mobile numbers for both parties",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const disputeData = {
        partyA: {
          name: formData.partyA.name,
          contact: formData.partyA.contact,
          email: formData.partyA.email,
          address: formData.partyA.address,
        },
        partyB: {
          name: formData.partyB.name,
          contact: formData.partyB.contact,
          email: formData.partyB.email,
          address: formData.partyB.address,
        },
        category: formData.category,
        description: formData.description,
        incidentDate: formData.incidentDate,
        incidentPlace: formData.incidentPlace,
        district: formData.district,
        mandal: formData.mandal,
        ward: formData.ward,
        pincode: formData.pincode,
        status: "NEW" as const,
      };

      const response = await disputesAPI.create(disputeData);

      toast({
        title: "Success!",
        description: `Dispute registered successfully. Dispute ID: ${
          response.data.disputeId || "Pending"
        }`,
      });

      // Reset form
      setFormData({
        partyA: {
          name: "",
          contact: "",
          address: "",
        },
        partyB: {
          name: "",
          contact: "",
          address: "",
        },
        category: "Land",
        description: "",
      });
      setStep(1);
      onBack();
    } catch (error) {
      console.error("Dispute submission error:", error);
      toast({
        title: "Submission Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to register dispute. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePartyAData = (
    field: keyof DisputeFormState["partyA"],
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      partyA: {
        ...prev.partyA,
        [field]: value,
      },
    }));
  };

  const updatePartyBData = (
    field: keyof DisputeFormState["partyB"],
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      partyB: {
        ...prev.partyB,
        [field]: value,
      },
    }));
  };

  const updateFormData = (
    field: keyof Omit<DisputeFormState, "partyA" | "partyB">,
    value: unknown
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-card p-6">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Dispute Resolution Application
            </h1>
            <p className="text-muted-foreground">Step {step} of 4</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Party A Details</span>
            <span>Party B Details</span>
            <span>Dispute Details</span>
            <span>Review</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-smooth"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              {step === 1 && "Party A Information"}
              {step === 2 && "Party B Information"}
              {step === 3 && "Dispute Details"}
              {step === 4 && "Review & Submit"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Enter details of the first party in the dispute"}
              {step === 2 && "Enter details of the second party in the dispute"}
              {step === 3 &&
                "Provide dispute category, description, and location"}
              {step === 4 && "Review all details before submitting"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Party A Information */}
            {step === 1 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="partyAName">Party A Name *</Label>
                    <Input
                      id="partyAName"
                      value={formData.partyA.name}
                      onChange={(e) => updatePartyAData("name", e.target.value)}
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="partyAContact">
                      Party A Contact Number *
                    </Label>
                    <Input
                      id="partyAContact"
                      value={formData.partyA.contact}
                      onChange={(e) =>
                        updatePartyAData("contact", e.target.value)
                      }
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="partyAEmail">Party A Email</Label>
                  <Input
                    id="partyAEmail"
                    type="email"
                    value={formData.partyA.email || ""}
                    onChange={(e) => updatePartyAData("email", e.target.value)}
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="partyAAddress">Party A Address *</Label>
                  <Textarea
                    id="partyAAddress"
                    value={formData.partyA.address}
                    onChange={(e) =>
                      updatePartyAData("address", e.target.value)
                    }
                    placeholder="Enter complete address"
                    rows={4}
                    required
                  />
                </div>
              </>
            )}

            {/* Step 2: Party B Information */}
            {step === 2 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="partyBName">Party B Name *</Label>
                    <Input
                      id="partyBName"
                      value={formData.partyB.name}
                      onChange={(e) => updatePartyBData("name", e.target.value)}
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="partyBContact">
                      Party B Contact Number *
                    </Label>
                    <Input
                      id="partyBContact"
                      value={formData.partyB.contact}
                      onChange={(e) =>
                        updatePartyBData("contact", e.target.value)
                      }
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="partyBEmail">Party B Email</Label>
                  <Input
                    id="partyBEmail"
                    type="email"
                    value={formData.partyB.email || ""}
                    onChange={(e) => updatePartyBData("email", e.target.value)}
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="partyBAddress">Party B Address *</Label>
                  <Textarea
                    id="partyBAddress"
                    value={formData.partyB.address}
                    onChange={(e) =>
                      updatePartyBData("address", e.target.value)
                    }
                    placeholder="Enter complete address"
                    rows={4}
                    required
                  />
                </div>
              </>
            )}

            {/* Step 3: Dispute Details */}
            {step === 3 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Dispute Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        updateFormData("category", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Land">Land Dispute</SelectItem>
                        <SelectItem value="Society">
                          Society/Community
                        </SelectItem>
                        <SelectItem value="Benefits">
                          Government Benefits
                        </SelectItem>
                        <SelectItem value="Tenancy">Tenancy/Rental</SelectItem>
                        <SelectItem value="Family">Family Dispute</SelectItem>
                        <SelectItem value="Property">Property</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="incidentDate">Incident Date</Label>
                    <Input
                      id="incidentDate"
                      type="date"
                      value={formData.incidentDate || ""}
                      onChange={(e) =>
                        updateFormData("incidentDate", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Dispute Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      updateFormData("description", e.target.value)
                    }
                    placeholder="Provide a detailed description of the dispute"
                    rows={5}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="incidentPlace">Incident Place</Label>
                  <Input
                    id="incidentPlace"
                    value={formData.incidentPlace || ""}
                    onChange={(e) =>
                      updateFormData("incidentPlace", e.target.value)
                    }
                    placeholder="Where did the incident occur?"
                  />
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-semibold">Location Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="district">District</Label>
                      <Input
                        id="district"
                        value={formData.district || ""}
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
                        value={formData.mandal || ""}
                        onChange={(e) =>
                          updateFormData("mandal", e.target.value)
                        }
                        placeholder="Mandal"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ward">Ward/Village</Label>
                      <Input
                        id="ward"
                        value={formData.ward || ""}
                        onChange={(e) => updateFormData("ward", e.target.value)}
                        placeholder="Ward/Village"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input
                        id="pincode"
                        value={formData.pincode || ""}
                        onChange={(e) =>
                          updateFormData("pincode", e.target.value)
                        }
                        placeholder="Pincode"
                        maxLength={6}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-4">Dispute Summary</h3>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">
                        Party A
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Name:</span>
                          <span className="font-medium ml-2">
                            {formData.partyA.name}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Contact:
                          </span>
                          <span className="font-medium ml-2">
                            {formData.partyA.contact}
                          </span>
                        </div>
                        {formData.partyA.email && (
                          <div className="col-span-2">
                            <span className="text-muted-foreground">
                              Email:
                            </span>
                            <span className="font-medium ml-2">
                              {formData.partyA.email}
                            </span>
                          </div>
                        )}
                        <div className="col-span-2">
                          <span className="text-muted-foreground">
                            Address:
                          </span>
                          <p className="font-medium mt-1">
                            {formData.partyA.address}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">
                        Party B
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Name:</span>
                          <span className="font-medium ml-2">
                            {formData.partyB.name}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Contact:
                          </span>
                          <span className="font-medium ml-2">
                            {formData.partyB.contact}
                          </span>
                        </div>
                        {formData.partyB.email && (
                          <div className="col-span-2">
                            <span className="text-muted-foreground">
                              Email:
                            </span>
                            <span className="font-medium ml-2">
                              {formData.partyB.email}
                            </span>
                          </div>
                        )}
                        <div className="col-span-2">
                          <span className="text-muted-foreground">
                            Address:
                          </span>
                          <p className="font-medium mt-1">
                            {formData.partyB.address}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">
                        Dispute Details
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-muted-foreground">
                              Category:
                            </span>
                            <span className="font-medium ml-2">
                              {formData.category}
                            </span>
                          </div>
                          {formData.incidentDate && (
                            <div>
                              <span className="text-muted-foreground">
                                Incident Date:
                              </span>
                              <span className="font-medium ml-2">
                                {new Date(
                                  formData.incidentDate
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                        {formData.incidentPlace && (
                          <div>
                            <span className="text-muted-foreground">
                              Incident Place:
                            </span>
                            <span className="font-medium ml-2">
                              {formData.incidentPlace}
                            </span>
                          </div>
                        )}
                        <div>
                          <span className="text-muted-foreground">
                            Description:
                          </span>
                          <p className="font-medium mt-1">
                            {formData.description}
                          </p>
                        </div>
                        {(formData.district ||
                          formData.mandal ||
                          formData.ward) && (
                          <div>
                            <span className="text-muted-foreground">
                              Location:
                            </span>
                            <span className="font-medium ml-2">
                              {[
                                formData.ward,
                                formData.mandal,
                                formData.district,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-info-light border border-info/20 rounded-lg">
                  <p className="text-sm">
                    Please review all details carefully before submitting. Once
                    submitted, your dispute will be assigned to a mediator for
                    resolution.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={step === 1 || loading}
              >
                Previous
              </Button>

              {step < 4 ? (
                <Button onClick={handleNext}>Next</Button>
              ) : (
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Dispute"
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
