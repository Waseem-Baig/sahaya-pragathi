import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, MapPin, AlertCircle } from "lucide-react";
import { generateID } from "@/utils/idGenerator";
import type { GrievanceFormData } from "@/types/government";

interface GrievanceFormProps {
  onBack: () => void;
  onSubmit: (data: GrievanceFormData) => void;
}

export function GrievanceForm({ onBack, onSubmit }: GrievanceFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<GrievanceFormData>>({
    priority: 'P3',
    district: 'NLR',
  });

  const categories = [
    'Water Supply', 'Roads & Transport', 'Electricity', 'Healthcare', 
    'Education', 'Revenue', 'Police', 'Agriculture', 'Other'
  ];

  const subcategories = {
    'Water Supply': ['No Water Supply', 'Poor Water Quality', 'Pipeline Issues', 'Tanker Request'],
    'Roads & Transport': ['Road Repair', 'Street Lights', 'Public Transport', 'Traffic Issues'],
    'Electricity': ['Power Cut', 'New Connection', 'Bill Issues', 'Transformer Issues'],
    'Healthcare': ['Hospital Services', 'Medicine Shortage', 'Ambulance', 'Doctor Availability'],
    'Education': ['School Infrastructure', 'Teacher Issues', 'Scholarship', 'Mid-Day Meal'],
    'Revenue': ['Land Records', 'Property Registration', 'Tax Issues', 'Certificate Issues'],
    'Police': ['Law & Order', 'Traffic Police', 'Crime Report', 'Missing Person'],
    'Agriculture': ['Crop Insurance', 'Subsidy Issues', 'Market Price', 'Pest Control'],
    'Other': ['General Issues', 'Multiple Departments', 'Urgent Issues']
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    const grievanceId = generateID('GRV', formData.district || 'NLR');
    const completeData: GrievanceFormData = {
      id: grievanceId,
      ...formData as GrievanceFormData,
      status: 'NEW',
      createdAt: new Date().toISOString(),
    };
    onSubmit(completeData);
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-card p-6">
      <div className="container mx-auto max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Submit Grievance</h1>
            <p className="text-muted-foreground">Step {step} of 4</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Details</span>
            <span>Location</span>
            <span>Evidence</span>
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
            <CardTitle>
              {step === 1 && "Basic Information"}
              {step === 2 && "Location Details"}
              {step === 3 && "Supporting Documents"}
              {step === 4 && "Review & Submit"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Provide basic details about your grievance"}
              {step === 2 && "Specify the location where the issue exists"}
              {step === 3 && "Upload photos or documents as evidence"}
              {step === 4 && "Review all details before submitting"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {step === 1 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.citizenName || ''}
                      onChange={(e) => updateFormData('citizenName', e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone || ''}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    placeholder="Enter email address"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => updateFormData('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="subcategory">Subcategory *</Label>
                    <Select 
                      value={formData.subcategory} 
                      onValueChange={(value) => updateFormData('subcategory', value)}
                      disabled={!formData.category}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.category && subcategories[formData.category as keyof typeof subcategories]?.map((subcat) => (
                          <SelectItem key={subcat} value={subcat}>{subcat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => updateFormData('description', e.target.value)}
                    placeholder="Describe the issue in detail..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="priority">Priority Level</Label>
                  <Select value={formData.priority} onValueChange={(value) => updateFormData('priority', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="P1">
                        <div className="flex items-center gap-2">
                          <Badge variant="destructive" className="text-xs">P1</Badge>
                          <span>Emergency (48 hours)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="P2">
                        <div className="flex items-center gap-2">
                          <Badge variant="warning" className="text-xs">P2</Badge>
                          <span>High (5 days)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="P3">
                        <div className="flex items-center gap-2">
                          <Badge variant="info" className="text-xs">P3</Badge>
                          <span>Medium (10 days)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="P4">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">P4</Badge>
                          <span>Low (20 days)</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="district">District *</Label>
                    <Select value={formData.district} onValueChange={(value) => updateFormData('district', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select district" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NLR">SPSR Nellore</SelectItem>
                        <SelectItem value="GTR">Guntur</SelectItem>
                        <SelectItem value="VJW">Vijayawada</SelectItem>
                        <SelectItem value="VSP">Visakhapatnam</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="mandal">Mandal *</Label>
                    <Input
                      id="mandal"
                      value={formData.mandal || ''}
                      onChange={(e) => updateFormData('mandal', e.target.value)}
                      placeholder="Enter mandal name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ward">Ward/Village *</Label>
                    <Input
                      id="ward"
                      value={formData.ward || ''}
                      onChange={(e) => updateFormData('ward', e.target.value)}
                      placeholder="Enter ward or village"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      value={formData.pincode || ''}
                      onChange={(e) => updateFormData('pincode', e.target.value)}
                      placeholder="Enter pincode"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Detailed Address *</Label>
                  <Textarea
                    id="address"
                    value={formData.address || ''}
                    onChange={(e) => updateFormData('address', e.target.value)}
                    placeholder="Enter the exact location where the issue exists..."
                    rows={3}
                  />
                </div>

                <div className="flex items-center gap-2 p-4 bg-info-light border border-info/20 rounded-lg">
                  <MapPin className="h-5 w-5 text-info" />
                  <div>
                    <p className="text-sm font-medium">Location Tip</p>
                    <p className="text-xs text-muted-foreground">
                      Provide landmarks or nearby shops for faster resolution
                    </p>
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div>
                  <Label>Supporting Documents</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Upload Evidence</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Photos, documents, or videos that support your grievance
                    </p>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Files
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      Max 5 files, 10MB each. JPG, PNG, PDF, MP4 allowed
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-4 bg-warning-light border border-warning/20 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-warning" />
                  <div>
                    <p className="text-sm font-medium">Evidence Guidelines</p>
                    <p className="text-xs text-muted-foreground">
                      Clear photos with timestamps help faster resolution. Avoid personal information in images.
                    </p>
                  </div>
                </div>
              </>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="p-4 bg-gradient-card border border-border rounded-lg">
                  <h3 className="font-semibold mb-4">Grievance Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name:</span>
                      <p className="font-medium">{formData.citizenName}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Phone:</span>
                      <p className="font-medium">{formData.phone}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Category:</span>
                      <p className="font-medium">{formData.category}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Priority:</span>
                      <Badge variant={
                        formData.priority === 'P1' ? 'destructive' :
                        formData.priority === 'P2' ? 'warning' :
                        formData.priority === 'P3' ? 'info' : 'secondary'
                      }>
                        {formData.priority}
                      </Badge>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Location:</span>
                      <p className="font-medium">{formData.ward}, {formData.mandal}, {formData.district}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Description:</span>
                      <p className="font-medium">{formData.description}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-4 bg-success-light border border-success/20 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Ready to Submit</p>
                    <p className="text-xs text-muted-foreground">
                      You'll receive a unique ID and SMS confirmation after submission
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={step === 1}
              >
                Previous
              </Button>
              
              {step < 4 ? (
                <Button onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button variant="government" onClick={handleSubmit}>
                  Submit Grievance
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}