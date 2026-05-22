import type { DatosPersonalesFormData } from "@/src/types";

export const mockDatosPersonalesData: DatosPersonalesFormData = {
  infoBasica: {
    documentType: "Cédula de Ciudadanía",
    documentNumber: "1.***.***.234",
    birthDate: "15/05/1985",
    fullName: "CAMILO ANDRÉS CRUZ RODRIGUEZ",
  },
  contacto: {
    gender: "masculino",
    mobilePhone: "3001234567",
    email: "c.cruz@example.com",
    residenceState: "Cundinamarca",
    residenceCity: "Bogotá D.C.",
  },
  laborales: {
    company: "Coasmedas",
    position: "Analista de Datos",
    workPhone: "3001234567",
    workAddress: "Calle 123",
    workCity: "Bogotá D.C.",
    workState: "Cundinamarca",
    occupation: "Empleado",
    economicActivity: "Servicios Financieros",
  },
  financieros: {
    monthlyIncome: 5000000,
    otherIncome: 5000000,
    monthlyExpenses: 3000000,
    totalAssets: 5000000,
    totalLiabilities: 15000000,
  },
};

export const GENDER_OPTIONS = [
  { value: "masculino", label: "Masculino" },
  { value: "femenino", label: "Femenino" },
  { value: "otro", label: "Otro" },
  { value: "prefiero-no-decir", label: "Prefiero no decir" },
] as const;

export const OCCUPATION_OPTIONS = [
  { value: "Empleado", label: "Empleado" },
  { value: "Independiente", label: "Independiente" },
  { value: "Pensionado", label: "Pensionado" },
  { value: "Estudiante", label: "Estudiante" },
  { value: "Otro", label: "Otro" },
] as const;
