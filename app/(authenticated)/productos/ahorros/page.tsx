'use client';

import { useState, useEffect, useMemo } from 'react';
import { Breadcrumbs } from '@/src/molecules';
import {
  ProductCarousel,
  TransactionHistoryCard,
  DownloadReportsCard,
} from '@/src/organisms';
import { useWelcomeBar } from '@/src/contexts';
import { SavingsProduct } from '@/src/types';
import {
  mockSavingsProducts,
  mockAhorrosTransactions,
  mockAhorrosAvailableMonths,
} from '@/src/mocks';
import { maskNumber } from '@/src/utils';

export default function AhorrosPage() {
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  // First product selected by default
  const [selectedProduct, setSelectedProduct] = useState<SavingsProduct>(
    mockSavingsProducts[0]
  );
  const [transactions] = useState(mockAhorrosTransactions);
  const [selectedMonth, setSelectedMonth] = useState(
    mockAhorrosAvailableMonths[0]?.value || ''
  );

  // Configure WelcomeBar on mount, clear on unmount
  useEffect(() => {
    setWelcomeBar({
      title: 'Ahorros',
      backHref: '/home',
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  // Dynamic transaction title based on selected product
  const transactionTitle = useMemo(() => {
    return `Consulta de Movimientos - Cuenta de Ahorros (${maskNumber(selectedProduct.productNumber)})`;
  }, [selectedProduct.productNumber]);

  const handleProductSelect = (product: SavingsProduct) => {
    setSelectedProduct(product);
    // TODO: Fetch transactions for selected product
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
    // TODO: Trigger PDF download
    console.log('Downloading:', { month: selectedMonth, productId: selectedProduct.id });
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={['Inicio', 'Productos', 'Ahorros']} />

      {/* Section 1: Product Carousel */}
      <ProductCarousel
        title="Resumen de Cuentas de Ahorro"
        products={mockSavingsProducts}
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
        availableMonths={mockAhorrosAvailableMonths}
        selectedMonth={selectedMonth}
        onMonthChange={handleMonthChange}
        onDownload={handleDownload}
      />
    </div>
  );
}
