'use client';

import { useState, useEffect, useMemo } from 'react';
import { Breadcrumbs } from '@/src/molecules';
import {
  ProteccionCarousel,
  TransactionHistoryCard,
  DownloadReportsCard,
} from '@/src/organisms';
import { useWelcomeBar } from '@/src/contexts';
import { ProteccionProduct } from '@/src/types';
import {
  mockProteccionProducts,
  mockProteccionTransactions,
  mockProteccionAvailableMonths,
} from '@/src/mocks';

/**
 * Mask product number with "No" prefix format
 */
function maskProteccionNumber(number: string): string {
  return `No******${number}`;
}

export default function ProteccionPage() {
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  // First product selected by default
  const [selectedProduct, setSelectedProduct] = useState<ProteccionProduct>(
    mockProteccionProducts[0]
  );
  const [transactions] = useState(mockProteccionTransactions);
  const [selectedMonth, setSelectedMonth] = useState(
    mockProteccionAvailableMonths[0]?.value || ''
  );

  // Configure WelcomeBar on mount, clear on unmount
  useEffect(() => {
    setWelcomeBar({
      title: 'Protección',
      backHref: '/home',
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  // Dynamic transaction title based on selected product
  const transactionTitle = useMemo(() => {
    const maskedNumber = maskProteccionNumber(selectedProduct.productNumber);
    return `Consulta de Movimientos - ${selectedProduct.title} (${maskedNumber})`;
  }, [selectedProduct]);

  const handleProductSelect = (product: ProteccionProduct) => {
    setSelectedProduct(product);
    // TODO: Fetch transactions for selected product from API
    console.log('Selected product:', product.id);
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
    // TODO: Trigger PDF download from API
    console.log('Downloading:', { month: selectedMonth, productId: selectedProduct.id });
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={['Inicio', 'Productos', 'Protección']} />

      {/* Section 1: Product Carousel */}
      <ProteccionCarousel
        title="Resumen de Pólizas y Seguros"
        products={mockProteccionProducts}
        selectedProductId={selectedProduct.id}
        onProductSelect={handleProductSelect}
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
        availableMonths={mockProteccionAvailableMonths}
        selectedMonth={selectedMonth}
        onMonthChange={handleMonthChange}
        onDownload={handleDownload}
      />
    </div>
  );
}
