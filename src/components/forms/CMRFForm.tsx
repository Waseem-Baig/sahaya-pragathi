import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, Heart, AlertTriangle, FileText } from "lucide-react";
import { generateID } from "@/utils/idGenerator";
import type { CMRFFormData } from "@/types/government";

interface CMRFFormProps {
  onBack: () => void;
  onSubmit: (data: CMRFFormData) => void;
}

export function CMRFForm({ onBack, onSubmit }: CMRFFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<CMRFFormData>>({
    district: 'NLR',
  });

  const hospitals = [
    { code: 'AIMS', name: 'AIMS Hospital, Vijayawada', type: 'Government' },
    { code: 'SVIMS', name: 'SVIMS, Tirupati', type: 'Government' },
    { code: 'KGH', name: 'King George Hospital, Visakhapatnam', type: 'Government' },
    { code: 'NIMS', name: 'NIMS, Hyderabad', type: 'Government' },
    { code: 'APOLLO', name: 'Apollo Hospitals', type: 'Private' },
    { code: 'YASHODA', name: 'Yashoda Hospitals', type: 'Private' },
  ];

  const conditions = [
    'Heart Surgery', 'Cancer Treatment', 'Kidney Transplant', 'Brain Surgery',
    'Liver Transplant', 'Spine Surgery', 'Eye Surgery', 'Accident Trauma',
    'Chronic Kidney Disease', 'Diabetes Complications', 'Other'
  ];

  const incomeCategories = [
    { value: 'BPL', label: 'Below Poverty Line (BPL)', limit: '₹1,00,000' },
    { value: 'APL_LOW', label: 'APL - Low Income', limit: '₹2,00,000' },
    { value: 'APL_MID', label: 'APL - Middle Income', limit: '₹5,00,000' },
    { value: 'SPECIAL', label: 'Special Category', limit: 'Case by case' },
  ];

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    const cmrfId = generateID('CMR', formData.district || 'NLR');
    const completeData: CMRFFormData = {
      id: cmrfId,
      ...formData as CMRFFormData,
      status: 'INTAKE',
      createdAt: new Date().toISOString(),
    };
    onSubmit(completeData);
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const selectedHospital = hospitals.find(h => h.code === formData.hospitalCode);
  const selectedIncomeCategory = incomeCategories.find(c => c.value === formData.incomeCategory);

  return (
    <div className="min-h-screen bg-gradient-card p-6">
      <div className="container mx-auto max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">CM Relief Fund Application</h1>
            <p className="text-muted-foreground">Step {step} of 4</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Patient Info</span>
            <span>Medical Details</span>
            <span>Financial Info</span>
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
              <Heart className="h-5 w-5" />
              {step === 1 && "Patient Information"}
              {step === 2 && "Medical Details"}
              {step === 3 && "Financial Information"}
              {step === 4 && "Review & Submit"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Basic details of the patient"}
              {step === 2 && "Medical condition and hospital information"}
              {step === 3 && "Income and financial supporting documents"}
              {step === 4 && "Review all details before submitting"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {step === 1 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="patientName">Patient Name *</Label>
                    <Input
                      id="patientName"
                      value={formData.patientName || ''}
                      onChange={(e) => updateFormData('patientName', e.target.value)}
                      placeholder="Enter patient's full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="patientAge">Age *</Label>
                    <Input
                      id="patientAge"
                      type="number"
                      value={formData.patientAge || ''}
                      onChange={(e) => updateFormData('patientAge', parseInt(e.target.value))}
                      placeholder="Enter age"
                      min="1"
                      max="120"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="patientGender">Gender *</Label>
                    <Select value={formData.patientGender} onValueChange={(value) => updateFormData('patientGender', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="relationship">Relationship to Applicant *</Label>
                    <Select value={formData.relationshipToApplicant} onValueChange={(value) => updateFormData('relationshipToApplicant', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SELF">Self</SelectItem>
                        <SelectItem value="SPOUSE">Spouse</SelectItem>
                        <SelectItem value="CHILD">Child</SelectItem>
                        <SelectItem value="PARENT">Parent</SelectItem>
                        <SelectItem value="SIBLING">Sibling</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="applicantName">Applicant Name *</Label>
                  <Input
                    id="applicantName"
                    value={formData.applicantName || ''}
                    onChange={(e) => updateFormData('applicantName', e.target.value)}
                    placeholder="Name of person submitting application"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone || ''}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="aadhaar">Aadhaar Number (Optional)</Label>
                    <Input
                      id="aadhaar"
                      value={formData.aadhaarNumber || ''}
                      onChange={(e) => updateFormData('aadhaarNumber', e.target.value)}
                      placeholder="Enter Aadhaar number"
                      maxLength={12}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Full Address *</Label>
                  <Textarea
                    id="address"
                    value={formData.address || ''}
                    onChange={(e) => updateFormData('address', e.target.value)}
                    placeholder="Enter complete address with district, mandal, and village"
                    rows={3}
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <Label htmlFor="condition">Medical Condition *</Label>
                  <Select value={formData.medicalCondition} onValueChange={(value) => updateFormData('medicalCondition', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select medical condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((condition) => (
                        <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="diagnosis">Detailed Diagnosis *</Label>
                  <Textarea
                    id="diagnosis"
                    value={formData.detailedDiagnosis || ''}
                    onChange={(e) => updateFormData('detailedDiagnosis', e.target.value)}
                    placeholder="Provide detailed medical diagnosis from doctor"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="hospital">Recommended Hospital *</Label>
                  <Select value={formData.hospitalCode} onValueChange={(value) => updateFormData('hospitalCode', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select hospital" />
                    </SelectTrigger>
                    <SelectContent>
                      {hospitals.map((hospital) => (
                        <SelectItem key={hospital.code} value={hospital.code}>
                          <div>
                            <p className="font-medium">{hospital.name}</p>
                            <p className="text-xs text-muted-foreground">{hospital.type}</p>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="doctorName">Doctor Name *</Label>
                    <Input
                      id="doctorName"
                      value={formData.doctorName || ''}
                      onChange={(e) => updateFormData('doctorName', e.target.value)}
                      placeholder="Treating doctor's name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="urgency">Treatment Urgency *</Label>
                    <Select value={formData.treatmentUrgency} onValueChange={(value) => updateFormData('treatmentUrgency', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EMERGENCY">
                          <div className="flex items-center gap-2">
                            <Badge variant="destructive" className="text-xs">Emergency</Badge>
                            <span>Within 7 days</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="URGENT">
                          <div className="flex items-center gap-2">
                            <Badge variant="warning" className="text-xs">Urgent</Badge>
                            <span>Within 30 days</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="ROUTINE">
                          <div className="flex items-center gap-2">
                            <Badge variant="info" className="text-xs">Routine</Badge>
                            <span>Within 90 days</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="estimate">Treatment Cost Estimate *</Label>
                  <Input
                    id="estimate"
                    type="number"
                    value={formData.treatmentCostEstimate || ''}
                    onChange={(e) => updateFormData('treatmentCostEstimate', parseInt(e.target.value))}
                    placeholder="Enter estimated cost in ₹"
                  />
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div>
                  <Label htmlFor="incomeCategory">Income Category *</Label>
                  <Select value={formData.incomeCategory} onValueChange={(value) => updateFormData('incomeCategory', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select income category" />
                    </SelectTrigger>
                    <SelectContent>
                      {incomeCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          <div>
                            <p className="font-medium">{category.label}</p>
                            <p className="text-xs text-muted-foreground">Annual limit: {category.limit}</p>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="annualIncome">Annual Family Income *</Label>
                  <Input
                    id="annualIncome"
                    type="number"
                    value={formData.annualFamilyIncome || ''}
                    onChange={(e) => updateFormData('annualFamilyIncome', parseInt(e.target.value))}
                    placeholder="Enter annual income in ₹"
                  />
                </div>

                <div>
                  <Label htmlFor="previousSupport">Previous Government Support</Label>
                  <Textarea
                    id="previousSupport"
                    value={formData.previousGovernmentSupport || ''}
                    onChange={(e) => updateFormData('previousGovernmentSupport', e.target.value)}
                    placeholder="Details of any previous government financial support received"
                    rows={2}
                  />
                </div>

                <div>
                  <Label>Supporting Documents *</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-dashed border-border rounded-lg p-4 text-center">
                      <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm font-medium mb-1">Medical Reports</p>
                      <p className="text-xs text-muted-foreground mb-2">Doctor's reports, test results</p>
                      <Button variant="outline" size="sm">
                        <Upload className="h-3 w-3 mr-1" />
                        Upload
                      </Button>
                    </div>
                    <div className="border border-dashed border-border rounded-lg p-4 text-center">
                      <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm font-medium mb-1">Income Proof</p>
                      <p className="text-xs text-muted-foreground mb-2">Income certificate, ration card</p>
                      <Button variant="outline" size="sm">
                        <Upload className="h-3 w-3 mr-1" />
                        Upload
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-4 bg-warning-light border border-warning/20 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  <div>
                    <p className="text-sm font-medium">Required Documents</p>
                    <p className="text-xs text-muted-foreground">
                      Medical reports, income certificate, hospital estimate, and identity proof are mandatory
                    </p>
                  </div>
                </div>
              </>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="p-4 bg-gradient-card border border-border rounded-lg">
                  <h3 className="font-semibold mb-4">CMRF Application Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Patient:</span>
                      <p className="font-medium">{formData.patientName}</p>
                      <p className="text-xs text-muted-foreground">{formData.patientAge} years, {formData.patientGender}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Applicant:</span>
                      <p className="font-medium">{formData.applicantName}</p>
                      <p className="text-xs text-muted-foreground">{formData.relationshipToApplicant}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Condition:</span>
                      <p className="font-medium">{formData.medicalCondition}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Hospital:</span>
                      <p className="font-medium">{selectedHospital?.name}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Cost Estimate:</span>
                      <p className="font-medium">₹{formData.treatmentCostEstimate?.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Urgency:</span>
                      <Badge variant={
                        formData.treatmentUrgency === 'EMERGENCY' ? 'destructive' :
                        formData.treatmentUrgency === 'URGENT' ? 'warning' : 'info'
                      }>
                        {formData.treatmentUrgency}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Income Category:</span>
                      <p className="font-medium">{selectedIncomeCategory?.label}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Annual Income:</span>
                      <p className="font-medium">₹{formData.annualFamilyIncome?.toLocaleString()}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Phone:</span>
                      <p className="font-medium">{formData.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-4 bg-info-light border border-info/20 rounded-lg">
                  <Heart className="h-5 w-5 text-info" />
                  <div>
                    <p className="text-sm font-medium">Application Process</p>
                    <p className="text-xs text-muted-foreground">
                      Your application will undergo document verification, medical review, and approval process. SMS updates will be sent.
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
                  Submit Application
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}