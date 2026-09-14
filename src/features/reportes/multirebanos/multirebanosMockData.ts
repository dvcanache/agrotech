import {
  MultirebanoInventarioEntity,
  MultirebanoSituacionReproductivaEntity,
  MultirebanoDistribucionPrenezEntity,
  MultirebanoSituacionProductivaEntity,
  MultirebanoTransaccionEntity,
  MultirebanoProduccionDiariaEntity
} from '../../../types2/entities';

/* =========================================================================
 * 0. REBAÑOS DEL SISTEMA (Catálogo Multi-Rebaño)
 * Coincide exactamente con la modal "Seleccionar rebaños" de GanSoft
 * ========================================================================= */

export interface RebanoItem {
  id: string;
  nombre: string;
  propietario: string;
  especie: string;
  activo: boolean;
}

export const MOCK_REBANOS_CATALOGO: RebanoItem[] = [
  {
    id: 'HERD-01',
    nombre: 'Rebaño de Prueba',
    propietario: 'GanSoft LLC, 2026',
    especie: 'Vacunos',
    activo: true
  },
  {
    id: 'HERD-02',
    nombre: 'Finca La Esperanza',
    propietario: 'GanSoft LLC, 2026',
    especie: 'Vacunos',
    activo: true
  },
  {
    id: 'HERD-03',
    nombre: 'Hacienda Santa Elena',
    propietario: 'AgroGan Corp',
    especie: 'Vacunos',
    activo: true
  },
  {
    id: 'HERD-04',
    nombre: 'Hato El Roble',
    propietario: 'GanSoft LLC, 2026',
    especie: 'Vacunos',
    activo: true
  },
  {
    id: 'HERD-05',
    nombre: 'Finca El Porvenir',
    propietario: 'AgroGan Corp',
    especie: 'Vacunos',
    activo: true
  }
];

/* =========================================================================
 * 1. INVENTARIO MULTIREBAÑO (/reports/multiherds/inventories)
 * ========================================================================= */

export const MOCK_MULTIREBANO_INVENTARIOS: MultirebanoInventarioEntity[] = [
  {
    rebanoId: 'HERD-01',
    rebanoNombre: 'Rebaño de Prueba',
    totalAnimales: 154,
    vacas: 68,
    novillas: 24,
    mautas: 18,
    becerras: 16,
    toros: 4,
    novillos: 8,
    mautes: 7,
    becerros: 9,
    unidadesAnimalesTotales: 122.4
  },
  {
    rebanoId: 'HERD-02',
    rebanoNombre: 'Finca La Esperanza',
    totalAnimales: 230,
    vacas: 110,
    novillas: 38,
    mautas: 26,
    becerras: 24,
    toros: 6,
    novillos: 10,
    mautes: 9,
    becerros: 7,
    unidadesAnimalesTotales: 186.2
  },
  {
    rebanoId: 'HERD-03',
    rebanoNombre: 'Hacienda Santa Elena',
    totalAnimales: 310,
    vacas: 145,
    novillas: 52,
    mautas: 35,
    becerras: 30,
    toros: 8,
    novillos: 15,
    mautes: 13,
    becerros: 12,
    unidadesAnimalesTotales: 248.5
  },
  {
    rebanoId: 'HERD-04',
    rebanoNombre: 'Hato El Roble',
    totalAnimales: 185,
    vacas: 82,
    novillas: 30,
    mautas: 22,
    becerras: 19,
    toros: 5,
    novillos: 11,
    mautes: 8,
    becerros: 8,
    unidadesAnimalesTotales: 147.0
  },
  {
    rebanoId: 'HERD-05',
    rebanoNombre: 'Finca El Porvenir',
    totalAnimales: 98,
    vacas: 44,
    novillas: 16,
    mautas: 12,
    becerras: 11,
    toros: 3,
    novillos: 5,
    mautes: 4,
    becerros: 3,
    unidadesAnimalesTotales: 78.6
  }
];

/* =========================================================================
 * 2. SITUACIÓN REPRODUCTIVA ACTUAL MULTIREBAÑO (/reports/multiherds/reproduction)
 * ========================================================================= */

export const MOCK_MULTIREBANO_REPRODUCCION: MultirebanoSituacionReproductivaEntity[] = [
  {
    rebanoId: 'HERD-01',
    rebanoNombre: 'Rebaño de Prueba',
    vientresTotales: 92,
    prenadas: 56,
    vacias: 26,
    enEspera: 10,
    porcentajePrenez: 60.87,
    diasAbiertosPromedio: 118
  },
  {
    rebanoId: 'HERD-02',
    rebanoNombre: 'Finca La Esperanza',
    vientresTotales: 148,
    prenadas: 98,
    vacias: 36,
    enEspera: 14,
    porcentajePrenez: 66.22,
    diasAbiertosPromedio: 105
  },
  {
    rebanoId: 'HERD-03',
    rebanoNombre: 'Hacienda Santa Elena',
    vientresTotales: 197,
    prenadas: 134,
    vacias: 45,
    enEspera: 18,
    porcentajePrenez: 68.02,
    diasAbiertosPromedio: 98
  },
  {
    rebanoId: 'HERD-04',
    rebanoNombre: 'Hato El Roble',
    vientresTotales: 112,
    prenadas: 68,
    vacias: 32,
    enEspera: 12,
    porcentajePrenez: 60.71,
    diasAbiertosPromedio: 122
  },
  {
    rebanoId: 'HERD-05',
    rebanoNombre: 'Finca El Porvenir',
    vientresTotales: 60,
    prenadas: 34,
    vacias: 19,
    enEspera: 7,
    porcentajePrenez: 56.67,
    diasAbiertosPromedio: 134
  }
];

/* =========================================================================
 * 3. DISTRIBUCIÓN POR PREÑEZ MULTIREBAÑO (/reports/multiherds/pregnancy-distribution)
 * ========================================================================= */

export const MOCK_MULTIREBANO_DISTRIBUCION_PRENEZ: MultirebanoDistribucionPrenezEntity[] = [
  {
    rebanoId: 'HERD-01',
    rebanoNombre: 'Rebaño de Prueba',
    primerTercio: 18,
    segundoTercio: 22,
    tercerTercio: 16,
    proximasParir: 6
  },
  {
    rebanoId: 'HERD-02',
    rebanoNombre: 'Finca La Esperanza',
    primerTercio: 32,
    segundoTercio: 41,
    tercerTercio: 25,
    proximasParir: 11
  },
  {
    rebanoId: 'HERD-03',
    rebanoNombre: 'Hacienda Santa Elena',
    primerTercio: 44,
    segundoTercio: 55,
    tercerTercio: 35,
    proximasParir: 15
  },
  {
    rebanoId: 'HERD-04',
    rebanoNombre: 'Hato El Roble',
    primerTercio: 20,
    segundoTercio: 28,
    tercerTercio: 20,
    proximasParir: 8
  },
  {
    rebanoId: 'HERD-05',
    rebanoNombre: 'Finca El Porvenir',
    primerTercio: 11,
    segundoTercio: 14,
    tercerTercio: 9,
    proximasParir: 4
  }
];

/* =========================================================================
 * 4. SITUACIÓN PRODUCTIVA ACTUAL MULTIREBAÑO (/reports/multiherds/production-status)
 * ========================================================================= */

export const MOCK_MULTIREBANO_PRODUCCION: MultirebanoSituacionProductivaEntity[] = [
  {
    rebanoId: 'HERD-01',
    rebanoNombre: 'Rebaño de Prueba',
    enOrdeno: 48,
    secas: 20,
    criando: 24,
    porcentajeOrdeno: 70.59,
    litrosPromedioVacaDia: 14.8
  },
  {
    rebanoId: 'HERD-02',
    rebanoNombre: 'Finca La Esperanza',
    enOrdeno: 82,
    secas: 28,
    criando: 38,
    porcentajeOrdeno: 74.55,
    litrosPromedioVacaDia: 16.2
  },
  {
    rebanoId: 'HERD-03',
    rebanoNombre: 'Hacienda Santa Elena',
    enOrdeno: 112,
    secas: 33,
    criando: 52,
    porcentajeOrdeno: 77.24,
    litrosPromedioVacaDia: 17.5
  },
  {
    rebanoId: 'HERD-04',
    rebanoNombre: 'Hato El Roble',
    enOrdeno: 58,
    secas: 24,
    criando: 30,
    porcentajeOrdeno: 70.73,
    litrosPromedioVacaDia: 13.9
  },
  {
    rebanoId: 'HERD-05',
    rebanoNombre: 'Finca El Porvenir',
    enOrdeno: 29,
    secas: 15,
    criando: 16,
    porcentajeOrdeno: 65.91,
    litrosPromedioVacaDia: 12.4
  }
];

/* =========================================================================
 * 5. TRANSACCIONES MULTIREBAÑO (/reports/multiherds/transactions)
 * ========================================================================= */

export const MOCK_MULTIREBANO_TRANSACCIONES: MultirebanoTransaccionEntity[] = [
  {
    id: 'TX-2026-001',
    fecha: '2026-08-15',
    tipoTransaccion: 'Traslado',
    rebanoOrigenId: 'HERD-01',
    rebanoOrigen: 'Rebaño de Prueba',
    rebanoDestinoId: 'HERD-02',
    rebanoDestino: 'Finca La Esperanza',
    cantidadAnimales: 12,
    responsable: 'Ing. Roberto Silva'
  },
  {
    id: 'TX-2026-002',
    fecha: '2026-08-20',
    tipoTransaccion: 'Venta',
    rebanoOrigenId: 'HERD-03',
    rebanoOrigen: 'Hacienda Santa Elena',
    rebanoDestino: 'Matadero Industrial del Centro',
    cantidadAnimales: 15,
    montoTotal: 18500,
    responsable: 'Dr. Carlos Mendoza'
  },
  {
    id: 'TX-2026-003',
    fecha: '2026-08-25',
    tipoTransaccion: 'Compra',
    rebanoOrigen: 'Cabaña San José (Proveedor)',
    rebanoDestinoId: 'HERD-01',
    rebanoDestino: 'Rebaño de Prueba',
    cantidadAnimales: 4,
    montoTotal: 7200,
    responsable: 'Dr. Carlos Mendoza'
  },
  {
    id: 'TX-2026-004',
    fecha: '2026-09-02',
    tipoTransaccion: 'Traslado',
    rebanoOrigenId: 'HERD-04',
    rebanoOrigen: 'Hato El Roble',
    rebanoDestinoId: 'HERD-03',
    rebanoDestino: 'Hacienda Santa Elena',
    cantidadAnimales: 8,
    responsable: 'Ing. Roberto Silva'
  },
  {
    id: 'TX-2026-005',
    fecha: '2026-09-05',
    tipoTransaccion: 'Descarte',
    rebanoOrigenId: 'HERD-05',
    rebanoOrigen: 'Finca El Porvenir',
    rebanoDestino: 'Subasta Ganadera Regional',
    cantidadAnimales: 5,
    montoTotal: 4600,
    responsable: 'Dra. María Elena Gómez'
  }
];

/* =========================================================================
 * 6. PRODUCCIONES DIARIAS MULTIREBAÑO (/reports/multiherds/daily-production)
 * ========================================================================= */

export const MOCK_MULTIREBANO_PRODUCCION_DIARIA: MultirebanoProduccionDiariaEntity[] = [
  {
    fecha: '2026-09-01',
    rebanoId: 'HERD-01',
    rebanoNombre: 'Rebaño de Prueba',
    vacasOrdenadas: 48,
    lecheTotalLitros: 710.4,
    promedioLitrosVaca: 14.8
  },
  {
    fecha: '2026-09-01',
    rebanoId: 'HERD-02',
    rebanoNombre: 'Finca La Esperanza',
    vacasOrdenadas: 82,
    lecheTotalLitros: 1328.4,
    promedioLitrosVaca: 16.2
  },
  {
    fecha: '2026-09-01',
    rebanoId: 'HERD-03',
    rebanoNombre: 'Hacienda Santa Elena',
    vacasOrdenadas: 112,
    lecheTotalLitros: 1960.0,
    promedioLitrosVaca: 17.5
  },
  {
    fecha: '2026-09-01',
    rebanoId: 'HERD-04',
    rebanoNombre: 'Hato El Roble',
    vacasOrdenadas: 58,
    lecheTotalLitros: 806.2,
    promedioLitrosVaca: 13.9
  },
  {
    fecha: '2026-09-01',
    rebanoId: 'HERD-05',
    rebanoNombre: 'Finca El Porvenir',
    vacasOrdenadas: 29,
    lecheTotalLitros: 359.6,
    promedioLitrosVaca: 12.4
  },
  {
    fecha: '2026-09-02',
    rebanoId: 'HERD-01',
    rebanoNombre: 'Rebaño de Prueba',
    vacasOrdenadas: 48,
    lecheTotalLitros: 722.0,
    promedioLitrosVaca: 15.0
  },
  {
    fecha: '2026-09-02',
    rebanoId: 'HERD-02',
    rebanoNombre: 'Finca La Esperanza',
    vacasOrdenadas: 82,
    lecheTotalLitros: 1345.0,
    promedioLitrosVaca: 16.4
  },
  {
    fecha: '2026-09-02',
    rebanoId: 'HERD-03',
    rebanoNombre: 'Hacienda Santa Elena',
    vacasOrdenadas: 112,
    lecheTotalLitros: 1980.0,
    promedioLitrosVaca: 17.6
  }
];
