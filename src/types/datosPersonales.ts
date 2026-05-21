export type DatosPersonalesTab =
  | "info-basica"
  | "contacto"
  | "laborales"
  | "financieros";

export interface InfoBasicaData {
  documentType: string;
  documentNumber: string;
  birthDate: string;
  fullName: string;
}

export interface ContactoData {
  gender: string;
  mobilePhone: string;
  email: string;
  residenceState: string;
  residenceCity: string;
}

export interface LaboralesData {
  company: string;
  position: string;
  workPhone: string;
  workAddress: string;
  workCity: string;
  workState: string;
  occupation: string;
  economicActivity: string;
}

export interface FinancierosData {
  monthlyIncome: number;
  otherIncome: number;
  monthlyExpenses: number;
  totalAssets: number;
  totalLiabilities: number;
}

export interface DatosPersonalesFormData {
  infoBasica: InfoBasicaData;
  contacto: ContactoData;
  laborales: LaboralesData;
  financieros: FinancierosData;
}
