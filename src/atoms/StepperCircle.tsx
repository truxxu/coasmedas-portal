import React from "react";

interface StepperCircleProps {
  stepNumber: number;
  label: string;
  status: "pending" | "active" | "completed";
}

export const StepperCircle: React.FC<StepperCircleProps> = ({
  stepNumber,
  label,
  status,
}) => {
  const circleClasses = {
    pending: "border-2 border-brand-border bg-white",
    active: "border-2 border-brand-primary bg-brand-primary",
    completed: "border-2 border-brand-primary bg-brand-primary",
  };

  const numberClasses = {
    pending: "text-brand-gray-medium",
    active: "text-white",
    completed: "text-white",
  };

  const labelClasses = {
    pending: "text-brand-gray-medium",
    active: "text-brand-primary font-bold",
    completed: "text-brand-primary",
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 ${circleClasses[status]}`}
        role="presentation"
      >
        {status === "completed" ? (
          <svg
            className="w-4 h-4 md:w-5 md:h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : (
          <span className={`text-sm md:text-base ${numberClasses[status]}`}>
            {stepNumber}
          </span>
        )}
      </div>
      <span
        className={`text-xs md:text-sm mt-1 md:mt-2 ${labelClasses[status]}`}
      >
        {label}
      </span>
    </div>
  );
};
