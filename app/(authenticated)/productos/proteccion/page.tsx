'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Breadcrumbs } from '@/src/molecules';
import {
  ProteccionCarousel,
  TransactionHistoryCard,
  DownloadReportsCard,
} from '@/src/organisms';
import { useWelcomeBar, useUserContext } from '@/src/contexts';
import { ProteccionProduct, Transaction } from '@/src/types';
import { mockProteccionAvailableMonths } from '@/src/mocks';
import { mapProtectionProducts, mapMovements, getDateMonthsAgo, formatApiDate } from '@/src/utils';
import { getProductsProtection, getMovements } from '@/services/products.service';
import type { ProtectionAccountResponse } from '@/types/api/products';
import { isAuthError } from '@/lib/api/errors';

interface ProductMeta {
  idCuenta: string;
  codigoProductoCobis: string;
}

function maskProteccionNumber(number: string): string {
  return `No******${number}`;
}

export default function ProteccionPage() {
  const { user } = useUserContext();
  const router = useRouter();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const [products, setProducts] = useState<ProteccionProduct[]>([]);
  const [productMetaMap, setProductMetaMap] = useState<Record<string, ProductMeta>>({});
  const [selectedProduct, setSelectedProduct] = useState<ProteccionProduct | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(mockProteccionAvailableMonths[0]?.value || '');
  const fetchVersionRef = useRef(0);

  useEffect(() => {
    setWelcomeBar({ title: 'Protección', backHref: '/home' });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  const fetchMovements = useCallback(async (meta: ProductMeta) => {
    if (!user) return;

    const version = ++fetchVersionRef.current;
    try {
      setTransactionsLoading(true);
      const movements = await getMovements({
        documentType: user.documentType,
        documentNumber: user.documentNumber,
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
  }, [user, router]);

  const fetchData = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const params = {
        documentType: user.documentType,
        documentNumber: user.documentNumber,
      };

      const apiProducts = await getProductsProtection(params);
      const mapped = mapProtectionProducts(apiProducts);
      setProducts(mapped);

      const metaMap: Record<string, ProductMeta> = {};
      apiProducts.forEach((p: ProtectionAccountResponse) => {
        metaMap[p.idCuenta] = {
          idCuenta: p.idCuenta,
          codigoProductoCobis: p.codigoProductoCobis,
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
  }, [user, router, fetchMovements]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const transactionTitle = useMemo(() => {
    if (!selectedProduct) return 'Consulta de Movimientos';
    const maskedNumber = maskProteccionNumber(selectedProduct.productNumber);
    return `Consulta de Movimientos - ${selectedProduct.title} (${maskedNumber})`;
  }, [selectedProduct]);

  const handleProductSelect = useCallback((product: ProteccionProduct) => {
    setSelectedProduct(product);
    const meta = productMetaMap[product.id];
    if (meta) {
      fetchMovements(meta);
    }
  }, [productMetaMap, fetchMovements]);

  const handleFilter = useCallback(async (startDate: string, endDate: string) => {
    if (!user || !selectedProduct) return;
    const meta = productMetaMap[selectedProduct.id];
    if (!meta) return;

    const version = ++fetchVersionRef.current;
    try {
      setTransactionsLoading(true);
      const movements = await getMovements({
        documentType: user.documentType,
        documentNumber: user.documentNumber,
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
  }, [user, selectedProduct, productMetaMap, router]);

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
  };

  const handleDownload = () => {
    console.log('Downloading:', { month: selectedMonth, productId: selectedProduct?.id });
  };

  if (error) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={['Inicio', 'Productos', 'Protección']} />
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
        <Breadcrumbs items={['Inicio', 'Productos', 'Protección']} />
        <div className="bg-white rounded-2xl p-6 animate-pulse space-y-4">
          <div className="h-6 w-48 bg-gray-200 rounded" />
          <div className="h-32 w-full bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={['Inicio', 'Productos', 'Protección']} />

      <ProteccionCarousel
        title="Resumen de Pólizas y Seguros"
        products={products}
        selectedProductId={selectedProduct?.id || ''}
        onProductSelect={handleProductSelect}
      />

      <TransactionHistoryCard
        title={transactionTitle}
        subtitle="Últimos movimientos registrados."
        transactions={transactions}
        onFilter={handleFilter}
        loading={transactionsLoading}
      />

      <DownloadReportsCard
        availableMonths={mockProteccionAvailableMonths}
        selectedMonth={selectedMonth}
        onMonthChange={handleMonthChange}
        onDownload={handleDownload}
      />
    </div>
  );
}
