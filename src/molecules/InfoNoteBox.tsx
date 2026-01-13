import React from "react";

interface InfoNoteBoxProps {
  children: React.ReactNode;
  className?: string;
}

export function InfoNoteBox({ children, className = "" }: InfoNoteBoxProps) {
  return (
    <div
      className={`
        bg-brand-light-blue border-l-4 border-brand-primary
        p-4 rounded-r-lg
        ${className}
      `}
      role="note"
    >
      <p className="text-[15px] text-brand-navy">{children}</p>
    </div>
  );
}
