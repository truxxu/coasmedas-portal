export interface User {
  firstName: string;
  lastName: string;
  documentType: 'CC' | 'CE' | 'TI' | 'PA';
  documentNumber: string;
  email: string;
}

export interface Session {
  lastLogin: Date;
  currentLogin: Date;
  ipAddress: string;
}
