import React from 'react';
import { StepperCircle, StepperConnector } from '@/src/atoms';

interface Step {
  number: number;
  label: string;
}

interface StepperProps {
  currentStep: number;
  steps: Step[];
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  currentStep,
  steps,
  className = '',
}) => {
  const getStepStatus = (
    stepNumber: number
  ): 'pending' | 'active' | 'completed' => {
    if (stepNumber < currentStep) return 'completed';
    if (stepNumber === currentStep) return 'active';
    return 'pending';
  };

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      role="navigation"
      aria-label="Progreso del pago"
    >
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <StepperCircle
            stepNumber={step.number}
            label={step.label}
            status={getStepStatus(step.number)}
          />
          {index < steps.length - 1 && (
            <StepperConnector isActive={step.number < currentStep} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
