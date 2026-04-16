"use client";

export interface TabItem {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeId, onChange, className = "" }: TabsProps) {
  return (
    <div
      role="tablist"
      className={`flex items-center gap-8 border-b border-brand-border ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`
              relative pb-3 text-[15px] transition-colors
              ${
                isActive
                  ? "text-black font-medium after:absolute after:left-0 after:right-0 after:-bottom-[1px] after:h-[2px] after:bg-brand-navy"
                  : "text-black font-normal hover:text-brand-navy"
              }
            `}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
