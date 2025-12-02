interface GooglePlayButtonProps {
  href?: string;
  className?: string;
}

export function GooglePlayButton({ href = '#', className = '' }: GooglePlayButtonProps) {
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2 bg-white text-black border border-brand-border rounded-lg hover:opacity-90 transition-opacity ${className}`}
    >
      <svg className="w-[26px] h-[26px]" viewBox="0 0 19 21" fill="none">
        <path d="M1.52672 0.12731L13.7818 6.82638L10.3558 10.1526L0.300781 0.304711C0.607796 -0.00124077 1.09541 -0.106404 1.52672 0.12731Z" fill="#0AE577"/>
        <path d="M10.3567 10.1525L0.184845 20.0259C0.0690507 19.8612 0 19.6594 0 19.4341V1.03346C0 0.739193 0.117915 0.486347 0.301699 0.304688L10.3567 10.1525Z" fill="#40C3FF"/>
        <path d="M18.3602 9.32816C19.0772 9.7191 19.0772 10.7474 18.3602 11.1394L13.8697 13.5934L10.3555 10.1525L13.7815 6.82635L18.3602 9.32816Z" fill="#FFC826"/>
        <path d="M13.87 13.5934L1.52679 20.3403C1.03599 20.6091 0.469764 20.4327 0.185059 20.0259L10.3569 10.1525L13.8711 13.5934H13.87Z" fill="#FF3945"/>
      </svg>
      <span className="text-[15.6px] font-medium">Google Play</span>
    </a>
  );
}
