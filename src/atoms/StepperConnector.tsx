import React from 'react';

interface StepperConnectorProps {
  isActive: boolean;
}

export const StepperConnector: React.FC<StepperConnectorProps> = ({
  isActive,
}) => {
  return (
    <div
      className={`h-0.5 flex-1 ${isActive ? 'bg-[#007FFF]' : 'bg-[#E4E6EA]'}`}
      role="presentation"
    />
  );
};
