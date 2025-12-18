'use client';

import { useState } from 'react';
import { ProductPageHeader } from '@/src/molecules';
import {
  AportesInfoCard,
  TransactionHistoryCard,
  DownloadReportsCard,
} from '@/src/organisms';
import { mockAportesData, mockTransactions, mockAvailableMonths } from '@/src/mocks';
import { maskNumber } from '@/src/utils';

export default function AportesPage() {
  const [transactions] = useState(mockTransactions);
  const [selectedMonth, setSelectedMonth] = useState(mockAvailableMonths[0]?.value || '');

  const handleFilter = (startDate: string, endDate: string) => {
    // TODO: Call API to filter transactions
    console.log('Filtering transactions:', { startDate, endDate });
  };

  const handleDownload = () => {
    // TODO: Trigger PDF download
    console.log('Downloading report for:', selectedMonth);
  };

  // Handle month change and trigger download
  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    // Auto-download when month is selected (or could use a separate button)
    console.log('Selected month:', month);
  };

  return (
    <div className="space-y-6">
      <ProductPageHeader
        title="Aportes"
        backHref="/home"
        breadcrumbs={['Inicio', 'Productos', 'Aportes']}
      />

      <AportesInfoCard
        planName={mockAportesData.planName}
        productNumber={mockAportesData.productNumber}
        totalBalance={mockAportesData.totalBalance}
        paymentDeadline={mockAportesData.paymentDeadline}
        detalleAportes={mockAportesData.detalleAportes}
        detalleFondos={mockAportesData.detalleFondos}
      />

      <TransactionHistoryCard
        title={`Consulta de Movimientos - Cuenta de Ahorros (${maskNumber(mockAportesData.productNumber)})`}
        subtitle="Últimos movimientos registrados."
        transactions={transactions}
        onFilter={handleFilter}
      />

      <DownloadReportsCard
        availableMonths={mockAvailableMonths}
        selectedMonth={selectedMonth}
        onMonthChange={handleMonthChange}
        onDownload={handleDownload}
      />
    </div>
  );
}
