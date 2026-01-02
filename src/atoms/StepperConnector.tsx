import React from 'react';

interface StepperConnectorProps {
  isActive: boolean;
}

export const StepperConnector: React.FC<StepperConnectorProps> = ({
  isActive,
}) => {
  return (
    <div
      className={`h-1 w-full rounded-full ${isActive ? 'bg-[#007FFF]' : 'bg-[#E4E6EA]'}`}
      role="presentation"
    />
  );
};
