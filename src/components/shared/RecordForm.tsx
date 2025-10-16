import { useState } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface FormStep {
  id: string;
  title: string;
  description?: string;
  component: React.ComponentType<any>;
  validation?: (data: any) => string[] | null;
  required?: boolean;
  props?: any;
}

interface RecordFormProps {
  steps: FormStep[];
  initialData?: any;
  onSubmit: (data: any, isDraft?: boolean) => Promise<void>;
  onCancel?: () => void;
  title?: string;
  allowDraft?: boolean;
  loading?: boolean;
}

export function RecordForm({
  steps,
  initialData = {},
  onSubmit,
  onCancel,
  title,
  allowDraft = true,
  loading = false,
}: RecordFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const isLastStep = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const validateCurrentStep = () => {
    const step = steps[currentStep];
    if (step.validation) {
      const stepErrors = step.validation(formData);
      if (stepErrors && stepErrors.length > 0) {
        setErrors(prev => ({ ...prev, [step.id]: stepErrors }));
        return false;
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[step.id];
          return newErrors;
        });
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      setCurrentStep(prev => Math.min(steps.length - 1, prev + 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const handleStepClick = (stepIndex: number) => {
    // Allow going to previous completed steps or next step if current is valid
    if (stepIndex <= currentStep || completedSteps.has(stepIndex - 1)) {
      setCurrentStep(stepIndex);
    }
  };

  const handleSubmit = async (isDraft = false) => {
    if (!isDraft && !validateCurrentStep()) return;
    
    try {
      await onSubmit(formData, isDraft);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleFormDataChange = (stepData: any) => {
    setFormData(prev => ({ ...prev, ...stepData }));
  };

  const currentStepConfig = steps[currentStep];
  const StepComponent = currentStepConfig.component;
  const stepErrors = errors[currentStepConfig.id] || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      {title && (
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <Progress value={progress} className="w-full max-w-md mx-auto" />
        </div>
      )}

      {/* Step Navigation */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center cursor-pointer ${
                  index <= currentStep ? '' : 'opacity-50'
                }`}
                onClick={() => handleStepClick(index)}
              >
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 ${
                      completedSteps.has(index)
                        ? 'bg-success text-success-foreground border-success'
                        : index === currentStep
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background text-muted-foreground border-border'
                    }`}
                  >
                    {completedSteps.has(index) ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <div className="text-sm font-medium">{step.title}</div>
                    {step.description && (
                      <div className="text-xs text-muted-foreground">{step.description}</div>
                    )}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden sm:block w-8 h-px bg-border ml-4" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Step */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {currentStepConfig.title}
            {currentStepConfig.required && (
              <Badge variant="destructive" className="text-xs">Required</Badge>
            )}
          </CardTitle>
          {currentStepConfig.description && (
            <p className="text-muted-foreground">{currentStepConfig.description}</p>
          )}
        </CardHeader>
        <CardContent>
          {/* Step Errors */}
          {stepErrors.length > 0 && (
            <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="text-sm font-medium text-destructive mb-2">
                Please fix the following errors:
              </div>
              <ul className="text-sm text-destructive space-y-1">
                {stepErrors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Step Component */}
          <StepComponent
            data={formData}
            onChange={handleFormDataChange}
            errors={stepErrors}
            {...(currentStepConfig.props || {})}
          />
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {currentStep > 0 && (
            <Button variant="outline" onClick={handlePrevious}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
          )}
          {onCancel && (
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          {allowDraft && (
            <Button
              variant="outline"
              onClick={() => handleSubmit(true)}
              disabled={loading}
            >
              Save Draft
            </Button>
          )}
          
          {isLastStep ? (
            <Button
              onClick={() => handleSubmit(false)}
              disabled={loading}
            >
              Submit
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}