export interface User {
  firstName: string;
  lastName: string;
  documentType: 'CC' | 'CE' | 'NIT' | 'TI' | 'PA';
  documentNumber: string;
  email: string;
  fullName?: string;
  mobile?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
}

export interface Session {
  lastLogin: Date;
  currentLogin: Date;
  ipAddress: string;
}
