import React from 'react';
import { ChevronIcon } from '@/src/atoms';

interface BeneficiaryListItemProps {
  name: string;
  alias: string;
  maskedDocument: string;
  onClick: () => void;
}

export const BeneficiaryListItem: React.FC<BeneficiaryListItemProps> = ({
  name,
  alias,
  maskedDocument,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        w-full flex items-center justify-between p-4
        border border-[#E4E6EA] rounded-lg bg-white
        hover:border-[#007FFF] hover:bg-[#F0F9FF]
        transition-colors cursor-pointer text-left
      "
    >
      <div>
        <h3 className="text-lg font-medium text-[#1D4E8F] uppercase">
          {name}
        </h3>
        <p className="text-sm text-black">
          Alias: {alias} - Doc: {maskedDocument}
        </p>
      </div>
      <ChevronIcon direction="right" className="w-5 h-5 text-[#58585B]" />
    </button>
  );
};
