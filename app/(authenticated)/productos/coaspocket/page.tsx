'use client';

import { useState, useEffect, useMemo } from 'react';
import { Breadcrumbs } from '@/src/molecules';
import {
  CoaspocketCarousel,
  TransactionHistoryCard,
  DownloadReportsCard,
} from '@/src/organisms';
import { useWelcomeBar } from '@/src/contexts';
import { CoaspocketProduct } from '@/src/types';
import {
  mockCoaspocketProducts,
  mockCoaspocketTransactions,
  mockCoaspocketAvailableMonths,
} from '@/src/mocks';
import { maskNumber } from '@/src/utils';

export default function CoaspocketPage() {
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  // First product selected by default
  const [selectedProduct, setSelectedProduct] = useState<CoaspocketProduct>(
    mockCoaspocketProducts[0]
  );
  const [transactions] = useState(mockCoaspocketTransactions);
  const [selectedMonth, setSelectedMonth] = useState(
    mockCoaspocketAvailableMonths[0]?.value || ''
  );

  // Configure WelcomeBar on mount, clear on unmount
  useEffect(() => {
    setWelcomeBar({
      title: 'Coaspocket',
      backHref: '/home',
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  // Dynamic transaction title based on selected product
  const transactionTitle = useMemo(() => {
    return `Consulta de Movimientos - Bolsillo ${selectedProduct.title} (No.${maskNumber(selectedProduct.pocketNumber)})`;
  }, [selectedProduct.title, selectedProduct.pocketNumber]);

  const handleProductSelect = (product: CoaspocketProduct) => {
    setSelectedProduct(product);
    // TODO: Fetch transactions for selected product
    console.log('Selected product:', product.id);
  };

  const handleCreatePocket = () => {
    // TODO: Navigate to create pocket flow or open modal
    console.log('Create new pocket');
  };

  const handleFilter = (startDate: string, endDate: string) => {
    // TODO: Call API to filter transactions
    console.log('Filtering:', { startDate, endDate, productId: selectedProduct.id });
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    console.log('Selected month:', month);
  };

  const handleDownload = () => {
    // TODO: Trigger PDF download
    console.log('Downloading:', { month: selectedMonth, productId: selectedProduct.id });
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={['Inicio', 'Productos', 'Coaspocket']} />

      {/* Section 1: Product Carousel with Create Pocket Card */}
      <CoaspocketCarousel
        title="Resumen de Bolsillos"
        products={mockCoaspocketProducts}
        selectedProductId={selectedProduct.id}
        onProductSelect={handleProductSelect}
        onCreatePocket={handleCreatePocket}
      />

      {/* Section 2: Transaction History */}
      <TransactionHistoryCard
        title={transactionTitle}
        subtitle="Últimos movimientos registrados."
        transactions={transactions}
        onFilter={handleFilter}
      />

      {/* Section 3: Download Reports */}
      <DownloadReportsCard
        availableMonths={mockCoaspocketAvailableMonths}
        selectedMonth={selectedMonth}
        onMonthChange={handleMonthChange}
        onDownload={handleDownload}
      />
    </div>
  );
}
