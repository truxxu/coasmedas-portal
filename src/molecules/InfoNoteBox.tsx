import React from "react";

interface InfoNoteBoxProps {
  children: React.ReactNode;
  className?: string;
}

export function InfoNoteBox({ children, className = "" }: InfoNoteBoxProps) {
  return (
    <div
      className={`
        bg-[#F0F9FF] border-l-4 border-[#007FFF]
        p-4 rounded-r-lg
        ${className}
      `}
      role="note"
    >
      <p className="text-[15px] text-[#1D4E8F]">{children}</p>
    </div>
  );
}
