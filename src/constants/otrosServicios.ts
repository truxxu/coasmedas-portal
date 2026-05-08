import type { OtrosServiciosOption } from "@/src/types";

export const OTROS_SERVICIOS_FLOWS: OtrosServiciosOption[] = [
  {
    id: "gestion-documental",
    title: "Gestión Documental",
    description:
      "Consulta y descarga certificados y otros documentos importantes.",
    href: "/otros-servicios/gestion-documental",
    enabled: true,
  },
  {
    id: "seguridad",
    title: "Seguridad",
    description:
      "Cambia tu clave, gestiona tus dispositivos y revisa la actividad de tu cuenta.",
    href: "/otros-servicios/seguridad",
    enabled: true,
  },
  {
    id: "administracion-productos",
    title: "Administración de Productos",
    description: "Activa, bloquea o cancela tus productos financieros.",
    href: "/otros-servicios/administracion-productos",
    enabled: true,
  },
  {
    id: "datos-personales",
    title: "Datos Personales",
    description: "Actualiza tu información de contacto y dirección.",
    href: "/otros-servicios/datos-personales",
    enabled: true,
  },
];

export const SEGURIDAD_FLOWS: OtrosServiciosOption[] = [
  {
    id: "gestion-seguridad-productos",
    title: "Gestión de Seguridad de Productos",
    description: "Activa y desactiva el uso de tus productos financieros.",
    href: "/otros-servicios/seguridad/gestion-seguridad-productos",
    enabled: true,
  },
];

export const GESTION_DOCUMENTAL_FLOWS: OtrosServiciosOption[] = [
  {
    id: "solicitar-extractos",
    title: "Solicitar Extractos",
    description: "Pide los extractos de tus productos por período.",
    href: "/otros-servicios/gestion-documental/solicitar-extractos",
    enabled: true,
  },
  {
    id: "certificados-tributarios",
    title: "Certificados Tributarios",
    description: "Solicita certificados de retención, etc.",
    href: "/otros-servicios/gestion-documental/certificados-tributarios",
    enabled: true,
  },
  {
    id: "certificados-productos",
    title: "Certificados de Productos",
    description: "Obtén certificaciones de tus productos financieros.",
    href: "/otros-servicios/gestion-documental/certificados-productos",
    enabled: true,
  },
  {
    id: "estado-solicitudes",
    title: "Estado de Solicitudes",
    description: "Consulta, descarga y gestiona tus solicitudes.",
    href: "/otros-servicios/gestion-documental/estado-solicitudes",
    enabled: true,
  },
];
