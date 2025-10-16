import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowLeft, Calendar as CalendarIcon, Church, Info } from "lucide-react";
import { generateID } from "@/utils/idGenerator";
import { format } from "date-fns";
import type { TempleLetterFormData } from "@/types/government";

interface TempleLetterFormProps {
  onBack: () => void;
  onSubmit: (data: TempleLetterFormData) => void;
}

export function TempleLetterForm({ onBack, onSubmit }: TempleLetterFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<TempleLetterFormData>>({
    district: 'NLR',
    letterType: 'GENERAL',
  });
  const [selectedDate, setSelectedDate] = useState<Date>();

  const temples = [
    { code: 'TIR', name: 'Sri Venkateswara Swamy - Tirumala', quota: { vip: 5, general: 20 } },
    { code: 'SRI', name: 'Sri Durga Malleswara Swamy - Vijayawada', quota: { vip: 3, general: 15 } },
    { code: 'KAN', name: 'Sri Kanaka Durga - Vijayawada', quota: { vip: 2, general: 10 } },
    { code: 'SIM', name: 'Sri Simhachalam - Visakhapatnam', quota: { vip: 3, general: 12 } },
  ];

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    const letterId = generateID('TDL', formData.district || 'NLR');
    const completeData: TempleLetterFormData = {
      id: letterId,
      ...formData as TempleLetterFormData,
      requestedDate: selectedDate?.toISOString() || new Date().toISOString(),
      status: 'REQUESTED',
      createdAt: new Date().toISOString(),
    };
    onSubmit(completeData);
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const selectedTemple = temples.find(t => t.code === formData.templeCode);
  const currentQuota = selectedTemple?.quota[formData.letterType === 'VIP' ? 'vip' : 'general'] || 0;

  return (
    <div className="min-h-screen bg-gradient-card p-6">
      <div className="container mx-auto max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Temple Darshan Letter</h1>
            <p className="text-muted-foreground">Step {step} of 3</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Temple & Date</span>
            <span>Applicant Details</span>
            <span>Review</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-smooth" 
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Church className="h-5 w-5" />
              {step === 1 && "Select Temple & Date"}
              {step === 2 && "Applicant Information"}
              {step === 3 && "Review & Submit"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Choose temple, darshan type, and preferred date"}
              {step === 2 && "Provide details for all applicants"}
              {step === 3 && "Review all details before submitting"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {step === 1 && (
              <>
                <div>
                  <Label htmlFor="temple">Temple Selection *</Label>
                  <Select value={formData.templeCode} onValueChange={(value) => updateFormData('templeCode', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select temple" />
                    </SelectTrigger>
                    <SelectContent>
                      {temples.map((temple) => (
                        <SelectItem key={temple.code} value={temple.code}>
                          <div>
                            <p className="font-medium">{temple.name}</p>
                            <p className="text-xs text-muted-foreground">
                              VIP: {temple.quota.vip}/month | General: {temple.quota.general}/month
                            </p>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="letterType">Darshan Type *</Label>
                  <Select value={formData.letterType} onValueChange={(value) => updateFormData('letterType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select darshan type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VIP">
                        <div className="flex items-center justify-between w-full">
                          <span>VIP Darshan</span>
                          <Badge variant="warning" className="ml-2">Limited</Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value="GENERAL">
                        <div className="flex items-center justify-between w-full">
                          <span>General Darshan</span>
                          <Badge variant="info" className="ml-2">Regular</Badge>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {selectedTemple && (
                  <div className="p-4 bg-info-light border border-info/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Info className="h-5 w-5 text-info mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Monthly Quota Information</p>
                        <p className="text-xs text-muted-foreground mb-2">
                          {selectedTemple.name}
                        </p>
                        <div className="flex gap-4 text-xs">
                          <span>VIP: {selectedTemple.quota.vip} letters/month</span>
                          <span>General: {selectedTemple.quota.general} letters/month</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Current availability: {currentQuota} slots remaining this month
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <Label>Preferred Darshan Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="applicantCount">Number of Applicants *</Label>
                  <Select 
                    value={formData.applicantCount?.toString()} 
                    onValueChange={(value) => updateFormData('applicantCount', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select number of people" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? 'Person' : 'People'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="space-y-4">
                  <h3 className="font-semibold">Primary Applicant (Main Contact)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="primaryName">Full Name *</Label>
                      <Input
                        id="primaryName"
                        value={formData.primaryApplicantName || ''}
                        onChange={(e) => updateFormData('primaryApplicantName', e.target.value)}
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="primaryPhone">Phone Number *</Label>
                      <Input
                        id="primaryPhone"
                        value={formData.phone || ''}
                        onChange={(e) => updateFormData('phone', e.target.value)}
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="primaryAge">Age *</Label>
                      <Input
                        id="primaryAge"
                        type="number"
                        value={formData.primaryApplicantAge || ''}
                        onChange={(e) => updateFormData('primaryApplicantAge', parseInt(e.target.value))}
                        placeholder="Enter age"
                        min="1"
                        max="120"
                      />
                    </div>
                    <div>
                      <Label htmlFor="primaryAadhaar">Aadhaar Number (Optional)</Label>
                      <Input
                        id="primaryAadhaar"
                        value={formData.aadhaarNumber || ''}
                        onChange={(e) => updateFormData('aadhaarNumber', e.target.value)}
                        placeholder="Enter Aadhaar number"
                        maxLength={12}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      value={formData.address || ''}
                      onChange={(e) => updateFormData('address', e.target.value)}
                      placeholder="Enter full address"
                    />
                  </div>
                </div>

                {formData.applicantCount && formData.applicantCount > 1 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold">Additional Applicants</h3>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">
                        Names of other {formData.applicantCount - 1} applicants (comma-separated)
                      </p>
                      <Input
                        value={formData.additionalApplicants || ''}
                        onChange={(e) => updateFormData('additionalApplicants', e.target.value)}
                        placeholder="Enter names separated by commas"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="purpose">Purpose of Visit (Optional)</Label>
                  <Input
                    id="purpose"
                    value={formData.purpose || ''}
                    onChange={(e) => updateFormData('purpose', e.target.value)}
                    placeholder="e.g., Festival, Special Occasion, Regular Darshan"
                  />
                </div>
              </>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="p-4 bg-gradient-card border border-border rounded-lg">
                  <h3 className="font-semibold mb-4">Temple Letter Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Temple:</span>
                      <p className="font-medium">{selectedTemple?.name}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Darshan Type:</span>
                      <Badge variant={formData.letterType === 'VIP' ? 'warning' : 'info'}>
                        {formData.letterType}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Preferred Date:</span>
                      <p className="font-medium">{selectedDate ? format(selectedDate, "PPP") : 'Not selected'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Applicants:</span>
                      <p className="font-medium">{formData.applicantCount} People</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Primary Applicant:</span>
                      <p className="font-medium">{formData.primaryApplicantName}</p>
                      <p className="text-sm text-muted-foreground">{formData.phone}</p>
                    </div>
                    {formData.additionalApplicants && (
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Other Applicants:</span>
                        <p className="font-medium">{formData.additionalApplicants}</p>
                      </div>
                    )}
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Address:</span>
                      <p className="font-medium">{formData.address}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-4 bg-warning-light border border-warning/20 rounded-lg">
                  <Church className="h-5 w-5 text-warning" />
                  <div>
                    <p className="text-sm font-medium">Letter Processing</p>
                    <p className="text-xs text-muted-foreground">
                      Letter will go through L2 review and L1 approval. SMS updates will be sent.
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
              
              {step < 3 ? (
                <Button onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button variant="government" onClick={handleSubmit}>
                  Submit Request
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}