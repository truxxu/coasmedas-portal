import React from 'react';
import { Card } from '@/src/atoms';
import { BeneficiaryListItem } from '@/src/molecules';
import { RegisteredBeneficiary } from '@/src/types/otros-asociados-payment';

interface BeneficiarySelectionCardProps {
  beneficiaries: RegisteredBeneficiary[];
  onSelect: (beneficiary: RegisteredBeneficiary) => void;
}

export const BeneficiarySelectionCard: React.FC<BeneficiarySelectionCardProps> = ({
  beneficiaries,
  onSelect,
}) => {
  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-lg font-bold text-brand-navy">
        Asociados inscritos
      </h2>

      <div className="space-y-3">
        {beneficiaries.map((beneficiary) => (
          <BeneficiaryListItem
            key={beneficiary.id}
            name={beneficiary.fullName}
            alias={beneficiary.alias}
            maskedDocument={beneficiary.documentNumber}
            onClick={() => onSelect(beneficiary)}
          />
        ))}
      </div>

      {beneficiaries.length === 0 && (
        <p className="text-center text-brand-gray-high py-8">
          No tienes asociados inscritos.
        </p>
      )}
    </Card>
  );
};
