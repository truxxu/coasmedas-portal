import { NavBar } from '@/src/molecules';

export function PrehomeHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-brand-border">
      <div className="max-w-7xl mx-auto">
        <NavBar />
      </div>
    </header>
  );
}
