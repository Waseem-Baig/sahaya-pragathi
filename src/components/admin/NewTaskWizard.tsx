import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { ModuleSelector } from "./NewTaskWizard/ModuleSelector";
import { TaskDetailsStep } from "./NewTaskWizard/TaskDetailsStep";
import { AssignmentStep } from "./NewTaskWizard/AssignmentStep";
import { PreviewStep } from "./NewTaskWizard/PreviewStep";
import { casesAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface NewTaskWizardProps {
  open: boolean;
  onClose: () => void;
}

interface TaskData {
  module: string;
  details: Record<string, string | number | Date | File[] | null | undefined>;
  assignment: {
    assignedTo?: string;
    department?: string;
    sla?: string;
    priority?: string;
    notes?: string;
  };
}

export const NewTaskWizard = ({ open, onClose }: NewTaskWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [taskData, setTaskData] = useState<TaskData>({
    module: "",
    details: {},
    assignment: {},
  });

  const steps = [
    {
      id: 1,
      title: "Select Module",
      description: "Choose the type of task to create",
    },
    {
      id: 2,
      title: "Core Details",
      description: "Provide essential information",
    },
    { id: 3, title: "Assignment", description: "Assign to executive admin" },
    {
      id: 4,
      title: "Preview & Create",
      description: "Review and confirm details",
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreate = async () => {
    try {
      setIsSubmitting(true);

      // Validate required fields
      if (!taskData.module) {
        toast({
          title: "Error",
          description: "Please select a module",
          variant: "destructive",
        });
        return;
      }

      if (
        !taskData.assignment.assignedTo ||
        !taskData.assignment.priority ||
        !taskData.assignment.sla
      ) {
        toast({
          title: "Error",
          description: "Please fill in all assignment fields",
          variant: "destructive",
        });
        return;
      }

      // Submit to backend
      const response = await casesAPI.createTask(taskData);

      if (response.success) {
        toast({
          title: "Success",
          description: `Task created successfully with ID: ${response.data.caseId}`,
        });

        // Reset form and close
        setTaskData({
          module: "",
          details: {},
          assignment: {},
        });
        setCurrentStep(1);
        onClose();
      }
    } catch (error) {
      console.error("Failed to create task:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateTaskData = (stepData: Partial<TaskData>) => {
    setTaskData((prev) => ({ ...prev, ...stepData }));
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="space-y-4">
          <Progress value={progress} className="w-full" />
          <div className="flex justify-between">
            {steps.map((step) => (
              <div
                key={step.id}
                className="flex flex-col items-center space-y-1"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step.id === currentStep
                      ? "bg-primary text-primary-foreground"
                      : step.id < currentStep
                      ? "bg-green-500 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step.id < currentStep ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    step.id
                  )}
                </div>
                <div className="text-center">
                  <div className="text-xs font-medium">{step.title}</div>
                  <div className="text-xs text-muted-foreground hidden sm:block">
                    {step.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-auto py-4">
          {currentStep === 1 && (
            <ModuleSelector
              selectedModule={taskData.module}
              onSelect={(module) => updateTaskData({ module })}
            />
          )}

          {currentStep === 2 && (
            <TaskDetailsStep
              module={taskData.module}
              details={taskData.details}
              onChange={(details) => updateTaskData({ details })}
            />
          )}

          {currentStep === 3 && (
            <AssignmentStep
              assignment={taskData.assignment}
              onChange={(assignment) => updateTaskData({ assignment })}
            />
          )}

          {currentStep === 4 && <PreviewStep taskData={taskData} />}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={currentStep === 1 ? onClose : handlePrevious}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {currentStep === 1 ? "Cancel" : "Previous"}
          </Button>

          <div className="flex gap-2">
            {currentStep < steps.length ? (
              <Button
                onClick={handleNext}
                disabled={currentStep === 1 && !taskData.module}
                className="flex items-center gap-2"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleCreate}
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                {isSubmitting ? "Creating..." : "Create Task"}
                <Check className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
