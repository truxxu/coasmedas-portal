'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Breadcrumbs } from '@/src/molecules';
import {
  AportesInfoCard,
  TransactionHistoryCard,
  DownloadReportsCard,
} from '@/src/organisms';
import { useWelcomeBar, useUserContext } from '@/src/contexts';
import { mockAvailableMonths } from '@/src/mocks';
import { maskNumber, mapContributionsResponse, mapMovements, getDateMonthsAgo, formatApiDate } from '@/src/utils';
import { AportesProduct, Transaction } from '@/src/types';
import { getProductsContributions, getMovements } from '@/services/products.service';
import { isAuthError } from '@/lib/api/errors';

interface AportesMeta {
  idCuenta: string;
  codigoProductoCobis: string;
}

export default function AportesPage() {
  const { user } = useUserContext();
  const { documentType, documentNumber } = user ?? {};
  const router = useRouter();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();
  const [aportesData, setAportesData] = useState<AportesProduct | null>(null);
  const [aportesMeta, setAportesMeta] = useState<AportesMeta | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(mockAvailableMonths[0]?.value || '');
  const fetchVersionRef = useRef(0);

  useEffect(() => {
    setWelcomeBar({ title: 'Aportes', backHref: '/home' });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  const fetchData = useCallback(async () => {
    if (!documentType || !documentNumber) return;

    try {
      setLoading(true);
      setError(null);

      const params = { documentType, documentNumber };

      const contributions = await getProductsContributions(params);
      const mapped = mapContributionsResponse(contributions);
      setAportesData(mapped);

      const meta: AportesMeta = {
        idCuenta: String(contributions.aportes.idCuentaAportes),
        codigoProductoCobis: String(contributions.aportes.codigoProductoCobisAportes),
      };
      setAportesMeta(meta);

      // Fetch initial movements
      const version = ++fetchVersionRef.current;
      setTransactionsLoading(true);
      const movements = await getMovements({
        ...params,
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
      setError('No fue posible cargar la información. Intente nuevamente.');
    } finally {
      setLoading(false);
      setTransactionsLoading(false);
    }
  }, [documentType, documentNumber, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilter = useCallback(async (startDate: string, endDate: string) => {
    if (!documentType || !documentNumber || !aportesMeta) return;

    const version = ++fetchVersionRef.current;
    try {
      setTransactionsLoading(true);
      const movements = await getMovements({
        documentType,
        documentNumber,
        codigoProductoCobis: aportesMeta.codigoProductoCobis,
        idCuenta: aportesMeta.idCuenta,
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
  }, [documentType, documentNumber, aportesMeta, router]);

  const handleDownload = () => {
    console.log('Downloading report for:', selectedMonth);
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    console.log('Selected month:', month);
  };

  if (error) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={['Inicio', 'Productos', 'Aportes']} />
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

  if (loading || !aportesData) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={['Inicio', 'Productos', 'Aportes']} />
        <div className="bg-white rounded-2xl p-6 animate-pulse space-y-4">
          <div className="h-6 w-48 bg-gray-200 rounded" />
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="h-20 w-full bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={['Inicio', 'Productos', 'Aportes']} />

      <AportesInfoCard
        planName={aportesData.planName}
        productNumber={aportesData.productNumber}
        totalBalance={aportesData.totalBalance}
        paymentDeadline={aportesData.paymentDeadline}
        detalleAportes={aportesData.detalleAportes}
        detalleFondos={aportesData.detalleFondos}
      />

      <TransactionHistoryCard
        title={`Consulta de Movimientos - Cuenta de Ahorros (${maskNumber(aportesData.productNumber)})`}
        subtitle="Últimos movimientos registrados."
        transactions={transactions}
        onFilter={handleFilter}
        loading={transactionsLoading}
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
