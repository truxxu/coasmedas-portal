import { AccountSummaryCard, QuickAccessGrid, RecentTransactions } from '@/src/organisms';

export default function HomePage() {
  return (
    <>
      <AccountSummaryCard />
      <QuickAccessGrid />
      <RecentTransactions />
    </>
  );
}
