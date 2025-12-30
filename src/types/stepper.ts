/**
 * Single step in the stepper
 */
export interface Step {
  number: number;
  label: string;
}

/**
 * Step status
 */
export type StepStatus = 'pending' | 'active' | 'completed';

/**
 * Stepper props
 */
export interface StepperProps {
  currentStep: number;
  steps: Step[];
  className?: string;
}

/**
 * StepperCircle props
 */
export interface StepperCircleProps {
  stepNumber: number;
  label: string;
  status: StepStatus;
}

/**
 * StepperConnector props
 */
export interface StepperConnectorProps {
  isActive: boolean;
}
