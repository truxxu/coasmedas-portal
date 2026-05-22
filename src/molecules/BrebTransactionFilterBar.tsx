"use client";

import { useState } from "react";
import { Button } from "@/src/atoms";
import { SelectField } from "./SelectField";
import {
  BREB_TRANSACTION_DATE_OPTIONS,
  BREB_TRANSACTION_STATUS_OPTIONS,
  BREB_TRANSACTION_TYPE_OPTIONS,
} from "@/src/mocks/mockBrebTransactionHistoryData";
import type {
  BrebTransactionFilter,
  BrebTransactionDateRange,
  BrebTransactionStatus,
  BrebTransactionType,
} from "@/src/types/brebTransactionHistory";

interface BrebTransactionFilterBarProps {
  initialFilter: BrebTransactionFilter;
  onFilter: (filter: BrebTransactionFilter) => void;
}

export function BrebTransactionFilterBar({
  initialFilter,
  onFilter,
}: BrebTransactionFilterBarProps) {
  const [dateRange, setDateRange] = useState<BrebTransactionDateRange>(
    initialFilter.dateRange,
  );
  const [type, setType] = useState<BrebTransactionType | "todos">(
    initialFilter.type,
  );
  const [status, setStatus] = useState<BrebTransactionStatus | "todos">(
    initialFilter.status,
  );

  const handleApply = () => {
    onFilter({ dateRange, type, status });
  };

  return (
    <div className="bg-brand-background/60 rounded-lg p-4 grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-4 md:items-end">
      <SelectField
        label="Fecha"
        name="breb-historial-fecha"
        options={BREB_TRANSACTION_DATE_OPTIONS}
        value={dateRange}
        onChange={(e) =>
          setDateRange(e.target.value as BrebTransactionDateRange)
        }
      />
      <SelectField
        label="Tipo"
        name="breb-historial-tipo"
        options={BREB_TRANSACTION_TYPE_OPTIONS}
        value={type}
        onChange={(e) =>
          setType(e.target.value as BrebTransactionType | "todos")
        }
      />
      <SelectField
        label="Estado"
        name="breb-historial-estado"
        options={BREB_TRANSACTION_STATUS_OPTIONS}
        value={status}
        onChange={(e) =>
          setStatus(e.target.value as BrebTransactionStatus | "todos")
        }
      />
      <Button
        type="button"
        variant="primary"
        onClick={handleApply}
        className="h-11 px-7"
      >
        Filtrar
      </Button>
    </div>
  );
}
