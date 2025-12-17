import Image from "next/image";
import { QuickAccessCard } from "@/src/molecules";

function ProductsIcon() {
  return (
    <svg
      className="w-8 h-8 text-brand-navy"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
      />
    </svg>
  );
}

function PaymentsIcon() {
  return (
    <svg
      className="w-8 h-8 text-brand-navy"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
      />
    </svg>
  );
}

function TransfersIcon() {
  return (
    <svg
      className="w-8 h-8 text-brand-navy"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
      />
    </svg>
  );
}

function ServicesIcon() {
  return (
    <svg
      className="w-8 h-8 text-brand-navy"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

function CreditCardIcon() {
  return (
    <svg
      className="w-8 h-8 text-brand-navy"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
      />
    </svg>
  );
}

const quickAccessItems = [
  {
    id: "productos",
    title: "Productos",
    description:
      "Consulta el detalle, movimientos y extractos de todos tus productos.",
    icon: <ProductsIcon />,
    href: "/productos",
    variant: "default" as const,
  },
  {
    id: "pagos",
    title: "Pagos",
    description:
      "Realiza pagos de tus productos, a otros asociados o servicios públicos.",
    icon: <PaymentsIcon />,
    href: "/pagos",
    variant: "default" as const,
  },
  {
    id: "transferencias",
    title: "Transferencias",
    description:
      "Mueve dinero entre tus cuentas, a otros bancos o prográmalas.",
    icon: <TransfersIcon />,
    href: "/transferencias",
    variant: "default" as const,
  },
  {
    id: "breb",
    title: "Bre-B",
    description: "Pagos inmediatos con Llave o QR, gestión de llaves y más.",
    titleImage: (
      <Image src="/bre-b-logo-color.svg" alt="Bre-B" width={80} height={32} />
    ),
    href: "/bre-b",
    variant: "featured" as const,
  },
  {
    id: "otros",
    title: "Otros Servicios",
    description:
      "Gestiona tus documentos, seguridad, productos y datos personales.",
    icon: <ServicesIcon />,
    href: "/otros-servicios",
    variant: "default" as const,
  },
  {
    id: "tarjeta",
    title: "Tarjeta de Crédito",
    description: "Consulta saldo, paga tu tarjeta, realiza avances y más.",
    icon: <CreditCardIcon />,
    href: "/tarjeta",
    variant: "default" as const,
  },
];

export function QuickAccessGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {quickAccessItems.map((item) => (
        <QuickAccessCard
          key={item.id}
          title={item.title}
          description={item.description}
          icon={item.icon}
          titleImage={'titleImage' in item ? item.titleImage : undefined}
          href={item.href}
          variant={item.variant}
        />
      ))}
    </div>
  );
}
