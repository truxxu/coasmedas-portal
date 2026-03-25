'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Breadcrumbs } from '@/src/molecules';
import {
  InversionCarousel,
  TransactionHistoryCard,
  DownloadReportsCard,
} from '@/src/organisms';
import { useWelcomeBar, useUserContext } from '@/src/contexts';
import { InversionProduct, Transaction } from '@/src/types';
import { mockInversionesAvailableMonths } from '@/src/mocks';
import { maskNumber, mapInvestmentProducts, mapMovements, getDateMonthsAgo, formatApiDate } from '@/src/utils';
import { getProductsInvestments, getMovements } from '@/services/products.service';
import type { InvestmentAccountResponse } from '@/types/api/products';
import { isAuthError } from '@/lib/api/errors';

interface ProductMeta {
  idCuenta: string;
  codigoProductoCobis: string;
}

export default function InversionesPage() {
  const { user } = useUserContext();
  const router = useRouter();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const [products, setProducts] = useState<InversionProduct[]>([]);
  const [productMetaMap, setProductMetaMap] = useState<Record<string, ProductMeta>>({});
  const [selectedProduct, setSelectedProduct] = useState<InversionProduct | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(mockInversionesAvailableMonths[0]?.value || '');
  const fetchVersionRef = useRef(0);

  useEffect(() => {
    setWelcomeBar({ title: 'Inversiones', backHref: '/home' });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  const { documentType, documentNumber } = user ?? {};

  const fetchMovements = useCallback(async (meta: ProductMeta) => {
    if (!documentType || !documentNumber) return;

    const version = ++fetchVersionRef.current;
    try {
      setTransactionsLoading(true);
      const movements = await getMovements({
        documentType,
        documentNumber,
        codigoProductoCobis: meta.codigoProductoCobis,
        idCuenta: meta.idCuenta,
        fechaConsulta: formatApiDate(getDateMonthsAgo(3)),
      });
      if (fetchVersionRef.current === version) {
        setTransactions(mapMovements(movements));
      }
    } catch (err) {
      if (isAuthError(err)) {
        router.push('/login');
        return;
      }
    } finally {
      if (fetchVersionRef.current === version) {
        setTransactionsLoading(false);
      }
    }
  }, [documentType, documentNumber, router]);

  const fetchData = useCallback(async () => {
    if (!documentType || !documentNumber) return;

    try {
      setLoading(true);
      setError(null);

      const params = { documentType, documentNumber };

      const apiProducts = await getProductsInvestments(params);
      const mapped = mapInvestmentProducts(apiProducts);
      setProducts(mapped);

      const metaMap: Record<string, ProductMeta> = {};
      apiProducts.forEach((p: InvestmentAccountResponse) => {
        metaMap[p.idCuenta] = {
          idCuenta: p.idCuenta,
          codigoProductoCobis: String(p.codigoProductoCobis),
        };
      });
      setProductMetaMap(metaMap);

      if (mapped.length > 0) {
        setSelectedProduct(mapped[0]);
        await fetchMovements(metaMap[mapped[0].id]);
      }
    } catch (err) {
      if (isAuthError(err)) {
        router.push('/login');
        return;
      }
      setError('No fue posible cargar la información. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  }, [documentType, documentNumber, router, fetchMovements]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const transactionTitle = selectedProduct
    ? `Consulta de Movimientos - ${selectedProduct.title} (${(selectedProduct.productPrefix || 'CDAT-')}${maskNumber(selectedProduct.productNumber)})`
    : 'Consulta de Movimientos';

  const handleProductSelect = useCallback((product: InversionProduct) => {
    setSelectedProduct(product);
    const meta = productMetaMap[product.id];
    if (meta) {
      fetchMovements(meta);
    }
  }, [productMetaMap, fetchMovements]);

  const handleFilter = useCallback(async (startDate: string, endDate: string) => {
    if (!documentType || !documentNumber || !selectedProduct) return;
    const meta = productMetaMap[selectedProduct.id];
    if (!meta) return;

    const version = ++fetchVersionRef.current;
    try {
      setTransactionsLoading(true);
      const movements = await getMovements({
        documentType,
        documentNumber,
        codigoProductoCobis: meta.codigoProductoCobis,
        idCuenta: meta.idCuenta,
        fechaConsulta: formatApiDate(startDate),
      });
      if (fetchVersionRef.current === version) {
        const mapped = mapMovements(movements);
        setTransactions(mapped.filter(t => t.date <= endDate));
      }
    } catch (err) {
      if (isAuthError(err)) {
        router.push('/login');
        return;
      }
    } finally {
      if (fetchVersionRef.current === version) {
        setTransactionsLoading(false);
      }
    }
  }, [documentType, documentNumber, selectedProduct, productMetaMap, router]);

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
  };

  const handleDownload = () => {
    console.log('Downloading:', { month: selectedMonth, productId: selectedProduct?.id });
  };

  if (error) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={['Inicio', 'Productos', 'Inversiones']} />
        <div className="bg-white rounded-2xl p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="text-sm font-medium text-white bg-brand-navy px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={['Inicio', 'Productos', 'Inversiones']} />
        <div className="bg-white rounded-2xl p-6 animate-pulse space-y-4">
          <div className="h-6 w-48 bg-gray-200 rounded" />
          <div className="h-32 w-full bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={['Inicio', 'Productos', 'Inversiones']} />

      <InversionCarousel
        title="Resumen de Inversiones"
        products={products}
        selectedProductId={selectedProduct?.id || ''}
        onProductSelect={handleProductSelect}
      />

      {products.length > 0 && (
        <>
          <TransactionHistoryCard
            title={transactionTitle}
            subtitle="Ultimos movimientos registrados."
            transactions={transactions}
            onFilter={handleFilter}
            loading={transactionsLoading}
          />

          <DownloadReportsCard
            availableMonths={mockInversionesAvailableMonths}
            selectedMonth={selectedMonth}
            onMonthChange={handleMonthChange}
            onDownload={handleDownload}
          />
        </>
      )}
    </div>
  );
}
