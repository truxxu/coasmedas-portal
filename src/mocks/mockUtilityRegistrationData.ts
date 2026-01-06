import type {
  CityOption,
  ConvenioOption,
  UtilityRegistrationResult,
} from '@/src/types';

/**
 * Mock cities for utility registration
 */
export const mockCities: CityOption[] = [
  { id: '1', name: 'Cali' },
  { id: '2', name: 'Bogota' },
  { id: '3', name: 'Medellin' },
  { id: '4', name: 'Barranquilla' },
  { id: '5', name: 'Cartagena' },
];

/**
 * Mock utility providers (convenios) filtered by city
 */
export const mockConvenios: ConvenioOption[] = [
  // Cali (cityId: 1)
  { id: '1', name: 'ENEL - Energia', category: 'Energia', cityId: '1' },
  { id: '2', name: 'EMCALI - Agua', category: 'Agua', cityId: '1' },
  { id: '3', name: 'Gases de Occidente', category: 'Gas', cityId: '1' },
  { id: '4', name: 'Claro Telefonia', category: 'Telefonia', cityId: '1' },

  // Bogota (cityId: 2)
  { id: '5', name: 'Codensa - Energia', category: 'Energia', cityId: '2' },
  { id: '6', name: 'Vanti Gas', category: 'Gas', cityId: '2' },
  { id: '7', name: 'Acueducto de Bogota', category: 'Agua', cityId: '2' },
  { id: '8', name: 'ETB Telefonia', category: 'Telefonia', cityId: '2' },

  // Medellin (cityId: 3)
  { id: '9', name: 'EPM Energia', category: 'Energia', cityId: '3' },
  { id: '10', name: 'EPM Agua', category: 'Agua', cityId: '3' },
  { id: '11', name: 'EPM Gas', category: 'Gas', cityId: '3' },
  { id: '12', name: 'UNE Telefonia', category: 'Telefonia', cityId: '3' },

  // Barranquilla (cityId: 4)
  { id: '13', name: 'Electricaribe', category: 'Energia', cityId: '4' },
  { id: '14', name: 'Triple A - Agua', category: 'Agua', cityId: '4' },
  { id: '15', name: 'Gases del Caribe', category: 'Gas', cityId: '4' },

  // Cartagena (cityId: 5)
  { id: '16', name: 'Afinia - Energia', category: 'Energia', cityId: '5' },
  { id: '17', name: 'Acuacar - Agua', category: 'Agua', cityId: '5' },
  { id: '18', name: 'Surtigas', category: 'Gas', cityId: '5' },
];

/**
 * Mock successful registration result
 */
export const mockRegistrationResultSuccess: UtilityRegistrationResult = {
  success: true,
  status: 'Aceptada',
  registrationId: 'REG-2024-001234',
  alias: 'Luz casa',
  convenio: 'ENEL - Energia',
  city: 'Cali',
  billNumber: '555',
};

/**
 * Mock failed registration result
 */
export const mockRegistrationResultError: UtilityRegistrationResult = {
  success: false,
  status: 'Rechazada',
  alias: 'Luz casa',
  convenio: 'ENEL - Energia',
  city: 'Cali',
  billNumber: '555',
  errorMessage: 'El numero de factura ya se encuentra registrado.',
};
