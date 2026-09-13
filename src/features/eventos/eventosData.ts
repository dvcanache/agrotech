import { EventCategory, EventoItem } from '../../types/events';

export const EVENT_CATEGORIES: EventCategory[] = [
  {
    titulo: "Reproductivos",
    iconoType: "reproductivos",
    enlaces: [
      "Servicios IA / Monta",
      "Revisiones Ováricas / Ecografías",
      "Partos",
      "Abortos",
      "Celos",
      "Embriones",
      "Camadas Porcinas",
      "Incubación & Eclosión Avícola",
      "Foliculometría Equina"
    ]
  },
  {
    titulo: "Productivos",
    iconoType: "productivos",
    enlaces: [
      "Pesajes de leche",
      "Secados",
      "Crecimientos",
      "Control de Postura Avícola",
      "Ceba & Grasa Dorsal Porcina",
      "Eficiencia Alimenticia"
    ]
  },
  {
    titulo: "Sanitarios & Veterinarios",
    iconoType: "veterinarios",
    enlaces: [
      "Mastitis (CMT 4 cuartos)",
      "Clínicos & Tiempos de Retiro",
      "Planes Sanitarios",
      "Vacunación por Vía (Avícola/Porcina/Equina)",
      "Evaluación FAMACHA Caprina",
      "Podología & Herraje Equino"
    ]
  },
  {
    titulo: "Manejo & Rutina",
    iconoType: "manejo",
    enlaces: [
      "Descorne / Topizado",
      "Marcaje / Tatuaje / Chip",
      "Despique & Sexado Avícola",
      "Manejo Neonatal Porcino (Descolmillado/Caudectomía/Hierro)",
      "Doma Racional Equina",
      "Acondicionamiento Gallos Finos"
    ]
  },
  {
    titulo: "Inventarios & Movimientos",
    iconoType: "inventarios",
    enlaces: [
      "Inventarios Físicos RFID",
      "Cambios de Lote / Galpón / Aprisco / Caballeriza",
      "Bajas & Mortalidad de Galpón / Piara",
      "Despacho a Matadero / Ventas"
    ]
  },
  {
    titulo: "Potreros & Instalaciones",
    iconoType: "potreros",
    enlaces: [
      "Labores y Mantenimiento",
      "Rotaciones de Pastoreo",
      "Planificación Forrajera",
      "Bioseguridad de Galpones y Apriscos"
    ]
  },
  {
    titulo: "Otros",
    iconoType: "otros",
    enlaces: [
      "Comentarios y Notas",
      "Registro de Afiliaciones",
      "Producciones Diarias",
      "Auditoría de Eventos"
    ]
  }
];

/**
 * Obtiene las categorías y submódulos de eventos filtrados zootécnicamente por especie.
 * Garantiza estrictamente que las especies no mamíferas / aviares NO posean eventos de glándula mamaria (Mastitis, Ordeño, Secados),
 * ni partos de mamífero ni descorne.
 */
export function getEventCategoriesForSpecies(species?: string): EventCategory[] {
  if (!species || species === 'Todas' || species === 'TODAS') {
    return EVENT_CATEGORIES;
  }

  // 🐔 AVES DE CORRAL (Ovíparos sin glándulas mamarias ni cuernos ni herraduras)
  if (species === 'Aves de corral' || species === 'Aves' || species.includes('Ave')) {
    return [
      {
        titulo: "Reproductivos",
        iconoType: "reproductivos",
        enlaces: [
          "Incubación & Eclosión Avícola",
          "Ovoscopía & Fertilidad (7d/14d)",
          "Carga de Huevos Fértiles",
          "Control de Lotes Reproductores"
        ]
      },
      {
        titulo: "Productivos",
        iconoType: "productivos",
        enlaces: [
          "Control de Postura Avícola",
          "Pesaje de Lote & Crecimiento",
          "Eficiencia Alimenticia & Conversión (ICA)",
          "Clasificación de Huevos (AAA/AA/A)"
        ]
      },
      {
        titulo: "Sanitarios & Veterinarios",
        iconoType: "veterinarios",
        enlaces: [
          "Vacunación por Vía (Avícola/Porcina/Equina)",
          "Control de Coccidiosis & Parásitos",
          "Planes Sanitarios de Galpón",
          "Bioseguridad & Desinfección Aviar",
          "Clínicos & Tiempos de Retiro"
        ]
      },
      {
        titulo: "Manejo & Rutina",
        iconoType: "manejo",
        enlaces: [
          "Despique & Sexado Avícola",
          "Acondicionamiento Gallos Finos",
          "Pesajes de Muestreo de Aves",
          "Mantenimiento & Sanidad de Galpón"
        ]
      },
      {
        titulo: "Inventarios & Movimientos",
        iconoType: "inventarios",
        enlaces: [
          "Inventarios Físicos RFID",
          "Cambios de Lote / Galpón / Aprisco / Caballeriza",
          "Bajas & Mortalidad de Galpón / Piara",
          "Despacho a Matadero / Ventas"
        ]
      },
      {
        titulo: "Potreros & Instalaciones",
        iconoType: "potreros",
        enlaces: [
          "Bioseguridad de Galpones y Apriscos",
          "Labores y Mantenimiento",
          "Rotaciones de Pastoreo"
        ]
      },
      {
        titulo: "Otros",
        iconoType: "otros",
        enlaces: [
          "Comentarios y Notas",
          "Registro de Afiliaciones",
          "Producciones Diarias",
          "Auditoría de Eventos"
        ]
      }
    ];
  }

  // 🐷 PORCINOS
  if (species === 'Porcinos' || species === 'Cerdos') {
    return [
      {
        titulo: "Reproductivos",
        iconoType: "reproductivos",
        enlaces: [
          "Camadas Porcinas",
          "Servicios IA / Monta",
          "Revisiones Ováricas / Ecografías",
          "Abortos",
          "Celos"
        ]
      },
      {
        titulo: "Productivos",
        iconoType: "productivos",
        enlaces: [
          "Ceba & Grasa Dorsal Porcina",
          "Crecimientos",
          "Eficiencia Alimenticia"
        ]
      },
      {
        titulo: "Sanitarios & Veterinarios",
        iconoType: "veterinarios",
        enlaces: [
          "Planes Sanitarios",
          "Vacunación por Vía (Avícola/Porcina/Equina)",
          "Clínicos & Tiempos de Retiro"
        ]
      },
      {
        titulo: "Manejo & Rutina",
        iconoType: "manejo",
        enlaces: [
          "Manejo Neonatal Porcino (Descolmillado/Caudectomía/Hierro)",
          "Marcaje / Tatuaje / Chip"
        ]
      },
      {
        titulo: "Inventarios & Movimientos",
        iconoType: "inventarios",
        enlaces: [
          "Inventarios Físicos RFID",
          "Cambios de Lote / Galpón / Aprisco / Caballeriza",
          "Bajas & Mortalidad de Galpón / Piara",
          "Despacho a Matadero / Ventas"
        ]
      },
      {
        titulo: "Potreros & Instalaciones",
        iconoType: "potreros",
        enlaces: [
          "Bioseguridad de Galpones y Apriscos",
          "Labores y Mantenimiento"
        ]
      },
      {
        titulo: "Otros",
        iconoType: "otros",
        enlaces: [
          "Comentarios y Notas",
          "Registro de Afiliaciones",
          "Producciones Diarias",
          "Auditoría de Eventos"
        ]
      }
    ];
  }

  // 🐴 EQUINOS
  if (species === 'Equinos' || species === 'Caballos') {
    return [
      {
        titulo: "Reproductivos",
        iconoType: "reproductivos",
        enlaces: [
          "Foliculometría Equina",
          "Servicios IA / Monta",
          "Partos",
          "Abortos",
          "Celos"
        ]
      },
      {
        titulo: "Productivos",
        iconoType: "productivos",
        enlaces: [
          "Crecimientos",
          "Eficiencia Alimenticia"
        ]
      },
      {
        titulo: "Sanitarios & Veterinarios",
        iconoType: "veterinarios",
        enlaces: [
          "Podología & Herraje Equino",
          "Planes Sanitarios",
          "Clínicos & Tiempos de Retiro",
          "Vacunación por Vía (Avícola/Porcina/Equina)"
        ]
      },
      {
        titulo: "Manejo & Rutina",
        iconoType: "manejo",
        enlaces: [
          "Doma Racional Equina",
          "Marcaje / Tatuaje / Chip"
        ]
      },
      {
        titulo: "Inventarios & Movimientos",
        iconoType: "inventarios",
        enlaces: [
          "Inventarios Físicos RFID",
          "Cambios de Lote / Galpón / Aprisco / Caballeriza",
          "Despacho a Matadero / Ventas"
        ]
      },
      {
        titulo: "Potreros & Instalaciones",
        iconoType: "potreros",
        enlaces: [
          "Labores y Mantenimiento",
          "Rotaciones de Pastoreo",
          "Planificación Forrajera"
        ]
      },
      {
        titulo: "Otros",
        iconoType: "otros",
        enlaces: [
          "Comentarios y Notas",
          "Registro de Afiliaciones",
          "Auditoría de Eventos"
        ]
      }
    ];
  }

  // 🐐 CAPRINOS
  if (species === 'Caprinos' || species === 'Cabras') {
    return [
      {
        titulo: "Reproductivos",
        iconoType: "reproductivos",
        enlaces: [
          "Servicios IA / Monta",
          "Partos",
          "Abortos",
          "Celos",
          "Revisiones Ováricas / Ecografías"
        ]
      },
      {
        titulo: "Productivos",
        iconoType: "productivos",
        enlaces: [
          "Pesajes de leche",
          "Secados",
          "Crecimientos",
          "Eficiencia Alimenticia"
        ]
      },
      {
        titulo: "Sanitarios & Veterinarios",
        iconoType: "veterinarios",
        enlaces: [
          "Evaluación FAMACHA Caprina",
          "Planes Sanitarios",
          "Clínicos & Tiempos de Retiro"
        ]
      },
      {
        titulo: "Manejo & Rutina",
        iconoType: "manejo",
        enlaces: [
          "Descorne / Topizado",
          "Marcaje / Tatuaje / Chip"
        ]
      },
      {
        titulo: "Inventarios & Movimientos",
        iconoType: "inventarios",
        enlaces: [
          "Inventarios Físicos RFID",
          "Cambios de Lote / Galpón / Aprisco / Caballeriza",
          "Despacho a Matadero / Ventas"
        ]
      },
      {
        titulo: "Potreros & Instalaciones",
        iconoType: "potreros",
        enlaces: [
          "Labores y Mantenimiento",
          "Rotaciones de Pastoreo",
          "Bioseguridad de Galpones y Apriscos"
        ]
      },
      {
        titulo: "Otros",
        iconoType: "otros",
        enlaces: [
          "Comentarios y Notas",
          "Registro de Afiliaciones",
          "Producciones Diarias",
          "Auditoría de Eventos"
        ]
      }
    ];
  }

  // 🐮 BOVINOS / 🐃 BÚFALOS (Especies lecheras de 4 cuartos tradicionales)
  return [
    {
      titulo: "Reproductivos",
      iconoType: "reproductivos",
      enlaces: [
        "Servicios IA / Monta",
        "Revisiones Ováricas / Ecografías",
        "Partos",
        "Abortos",
        "Celos",
        "Embriones"
      ]
    },
    {
      titulo: "Productivos",
      iconoType: "productivos",
      enlaces: [
        "Pesajes de leche",
        "Secados",
        "Crecimientos",
        "Eficiencia Alimenticia"
      ]
    },
    {
      titulo: "Sanitarios & Veterinarios",
      iconoType: "veterinarios",
      enlaces: [
        "Mastitis (CMT 4 cuartos)",
        "Clínicos & Tiempos de Retiro",
        "Planes Sanitarios",
        "Vacunación por Vía (Avícola/Porcina/Equina)"
      ]
    },
    {
      titulo: "Manejo & Rutina",
      iconoType: "manejo",
      enlaces: [
        "Descorne / Topizado",
        "Marcaje / Tatuaje / Chip"
      ]
    },
    {
      titulo: "Inventarios & Movimientos",
      iconoType: "inventarios",
      enlaces: [
        "Inventarios Físicos RFID",
        "Cambios de Lote / Galpón / Aprisco / Caballeriza",
        "Bajas & Mortalidad de Galpón / Piara",
        "Despacho a Matadero / Ventas"
      ]
    },
    {
      titulo: "Potreros & Instalaciones",
      iconoType: "potreros",
      enlaces: [
        "Labores y Mantenimiento",
        "Rotaciones de Pastoreo",
        "Planificación Forrajera"
      ]
    },
    {
      titulo: "Otros",
      iconoType: "otros",
      enlaces: [
        "Comentarios y Notas",
        "Registro de Afiliaciones",
        "Producciones Diarias",
        "Auditoría de Eventos"
      ]
    }
  ];
}

export const INITIAL_EVENTS: EventoItem[] = [
  // ==========================================
  // 1. BOVINOS
  // ==========================================
  {
    id: 'ev-bov-1',
    fecha: '11/09/2026',
    codigoAnimal: '0001',
    especie: 'Bovinos',
    categoria: 'Productivos',
    tipoEvento: 'Pesajes de leche',
    vencimiento: 'Próximo control lechero en 15 días (14.2 kg)',
    tecnico: 'Dr. Carlos Mendoza',
    observaciones: 'AM: 7.8 kg | PM: 6.4 kg | Grasa: 3.8% | RCS: 145k | Lote 01 Alta Producción'
  },
  {
    id: 'ev-bov-2',
    fecha: '10/09/2026',
    codigoAnimal: '0002',
    especie: 'Bovinos',
    categoria: 'Reproductivos',
    tipoEvento: 'Servicios IA / Monta',
    vencimiento: 'Diagnóstico ecográfico gestacional a 45 días',
    tecnico: 'Juan Pérez',
    observaciones: 'IATF protocolo J-Synch | Pajuela: SM02 Gigante Pardo (Pardo Suizo) | Consanguinidad Wright: 0.78% (Seguro)'
  },
  {
    id: 'ev-bov-3',
    fecha: '08/09/2026',
    codigoAnimal: '0001',
    especie: 'Bovinos',
    categoria: 'Sanitarios & Veterinarios',
    tipoEvento: 'Mastitis (CMT 4 cuartos)',
    vencimiento: 'Bloqueo de Tanque activo hasta 13/09/2026',
    tecnico: 'Dr. Carlos Mendoza',
    observaciones: 'CMT: AD Neg, AI Neg, PD Grado 2, PI Neg | Tratamiento Cefa-Lak intramamario | Retiro leche: 5 días'
  },
  {
    id: 'ev-bov-4',
    fecha: '04/09/2026',
    codigoAnimal: '0004',
    especie: 'Bovinos',
    categoria: 'Reproductivos',
    tipoEvento: 'Partos',
    vencimiento: 'Fin período de espera voluntario (PEV) a 50 días',
    tecnico: 'Luis Martínez',
    observaciones: 'Parto Eutócico | Cría viva: BCA-842 (Hembra, 36.5 kg, Pardo x Carora) | Pasa a Lote Ordeño 1'
  },

  // ==========================================
  // 2. AVES DE CORRAL
  // ==========================================
  {
    id: 'ev-ave-1',
    fecha: '12/09/2026',
    codigoAnimal: 'GALP-01',
    especie: 'Aves de corral',
    categoria: 'Productivos',
    tipoEvento: 'Control de Postura Avícola',
    vencimiento: 'Recolección diaria programada (% postura: 95.2%)',
    tecnico: 'Control Avícola Masivo',
    observaciones: 'Galpón 01 (Lohmann Brown): 2,500 aves alojadas | 2,380 huevos comerciales (AAA: 1,820, AA: 560) | 35 rotos | Peso Prom: 62.5 g'
  },
  {
    id: 'ev-ave-2',
    fecha: '09/09/2026',
    codigoAnimal: 'INC-01',
    especie: 'Aves de corral',
    categoria: 'Reproductivos',
    tipoEvento: 'Incubación & Eclosión Avícola',
    vencimiento: 'Traslado a Galpón de Cría y Sexaje (Día 21)',
    tecnico: 'Ing. Agr. Marcos Solís',
    observaciones: 'Carga Incubadora: 150 huevos fértiles | 138 pollitos vivos eclosionados (% Eclosión: 92.0%) | 8 claros | Pasgar Score: 9.2 (Élite)'
  },
  {
    id: 'ev-ave-3',
    fecha: '07/09/2026',
    codigoAnimal: 'GALP-02',
    especie: 'Aves de corral',
    categoria: 'Sanitarios & Veterinarios',
    tipoEvento: 'Vacunación por Vía (Avícola/Porcina/Equina)',
    vencimiento: 'Refuerzo Newcastle en 4 semanas',
    tecnico: 'Ing. Agr. Marcos Solís',
    observaciones: 'Vacunación Newcastle (Cepa LaSota) vía aspersión gota gruesa en Galpón 02 | Biológico Lote: B-NEW-2026'
  },
  {
    id: 'ev-ave-4',
    fecha: '05/09/2026',
    codigoAnimal: 'GF-001',
    especie: 'Aves de corral',
    categoria: 'Manejo & Rutina',
    tipoEvento: 'Acondicionamiento Gallos Finos',
    vencimiento: 'Próxima sesión de tope y entrenamiento en 5 días',
    tecnico: 'Marcos Finol (Galleril)',
    observaciones: 'Gallo Giro Marañón | Peso combate: 2,140 g | Careo: 15 min fondo y velocidad | Limpieza y arreglo de espuelas'
  },

  // ==========================================
  // 3. PORCINOS
  // ==========================================
  {
    id: 'ev-por-1',
    fecha: '11/09/2026',
    codigoAnimal: 'POR-CR01',
    especie: 'Porcinos',
    categoria: 'Reproductivos',
    tipoEvento: 'Camadas Porcinas',
    vencimiento: 'Destete de camada en 21 días (13 lechones)',
    tecnico: 'Ing. Agr. Marcos Solís',
    observaciones: 'Parto Porcino (Camada): 13 LNV vivos, 1 LNM mortinato, 0 momias (Total: 14 | Peso camada: 18.2 kg | Prom: 1.40 kg) | Sala Maternidad A'
  },
  {
    id: 'ev-por-2',
    fecha: '10/09/2026',
    codigoAnimal: 'POR-CR01',
    especie: 'Porcinos',
    categoria: 'Manejo & Rutina',
    tipoEvento: 'Manejo Neonatal Porcino (Descolmillado/Caudectomía/Hierro)',
    vencimiento: 'Castración quirúrgica de machos a los 7 días',
    tecnico: 'Ing. Agr. Marcos Solís',
    observaciones: 'Manejo de camada: Descolmillado profiláctico, corte y cauterización de cola, muescado orejas y 2 ml Hierro Dextrano 200mg/lechón'
  },
  {
    id: 'ev-por-3',
    fecha: '06/09/2026',
    codigoAnimal: 'POR-CEB01',
    especie: 'Porcinos',
    categoria: 'Productivos',
    tipoEvento: 'Ceba & Grasa Dorsal Porcina',
    vencimiento: 'Despacho a matadero proyectado en 14 días (110 kg)',
    tecnico: 'Luis Martínez',
    observaciones: 'Pesaje ceba lote: Peso medio 96.5 kg | Medición Grasa Dorsal P2 ultrasonido: 13.8 mm | % Magro estimado: 58.4%'
  },
  {
    id: 'ev-por-4',
    fecha: '02/09/2026',
    codigoAnimal: 'POR-CR02',
    especie: 'Porcinos',
    categoria: 'Sanitarios & Veterinarios',
    tipoEvento: 'Planes Sanitarios',
    vencimiento: 'Revacunación Parvo-Lepto antes de la siguiente monta',
    tecnico: 'Dr. Carlos Mendoza',
    observaciones: 'Vacunación oficial Peste Porcina Clásica (PPC) + Parvovirus y Leptospira | Cerda reproductora en pre-servicio'
  },

  // ==========================================
  // 4. BÚFALOS
  // ==========================================
  {
    id: 'ev-buf-1',
    fecha: '11/09/2026',
    codigoAnimal: 'BUF-01',
    especie: 'Búfalos',
    categoria: 'Productivos',
    tipoEvento: 'Pesajes de leche',
    vencimiento: 'Próximo control lechero bufalino en 15 días (8.8 kg)',
    tecnico: 'Roberto Gómez',
    observaciones: 'Ordeño Búfala Murrah: 8.8 kg/día (AM: 5.2 kg, PM: 3.6 kg) | Grasa butirométrica: 7.9% | Proteína: 4.3% | Rendimiento Mozzarella'
  },
  {
    id: 'ev-buf-2',
    fecha: '08/09/2026',
    codigoAnimal: 'BUF-02',
    especie: 'Búfalos',
    categoria: 'Reproductivos',
    tipoEvento: 'Servicios IA / Monta',
    vencimiento: 'Diagnóstico ecográfico de gestación a 35 días',
    tecnico: 'Dra. Elena Rivas',
    observaciones: 'Monta natural dirigida con Padrote Pad-Buf01 Sultán del Pantano (Murrah 100%) | Sabana baja inundable'
  },
  {
    id: 'ev-buf-3',
    fecha: '04/09/2026',
    codigoAnimal: 'BUF-03',
    especie: 'Búfalos',
    categoria: 'Sanitarios & Veterinarios',
    tipoEvento: 'Planes Sanitarios',
    vencimiento: 'Control de parásitos hepáticos en 90 días',
    tecnico: 'Dr. Carlos Mendoza',
    observaciones: 'Desparasitación estratégica con Closantel 10% (Fasciola hepatica y parásitos de ciénaga) | Retiro carne: 30 días'
  },
  {
    id: 'ev-buf-4',
    fecha: '30/08/2026',
    codigoAnimal: 'BUF-04',
    especie: 'Búfalos',
    categoria: 'Reproductivos',
    tipoEvento: 'Partos',
    vencimiento: 'Destete de bucerro a los 210 días',
    tecnico: 'Roberto Gómez',
    observaciones: 'Parto Bucérrico normal | Bucerra hembra BUC-108 viva (38.5 kg, Murrah) | Apoyo de amamantamiento restringido'
  },

  // ==========================================
  // 5. CAPRINOS
  // ==========================================
  {
    id: 'ev-cap-1',
    fecha: '11/09/2026',
    codigoAnimal: 'CAP-CL01',
    especie: 'Caprinos',
    categoria: 'Productivos',
    tipoEvento: 'Pesajes de leche',
    vencimiento: 'Control lechero caprino mensual (3.9 kg)',
    tecnico: 'Luis Martínez',
    observaciones: 'Ordeño en tarima elevada: 3.9 kg/día (AM: 2.2 kg, PM: 1.7 kg) | Grasa: 4.2% | Cabra Saanen pura'
  },
  {
    id: 'ev-cap-2',
    fecha: '09/09/2026',
    codigoAnimal: 'CAP-CL02',
    especie: 'Caprinos',
    categoria: 'Sanitarios & Veterinarios',
    tipoEvento: 'Evaluación FAMACHA Caprina',
    vencimiento: 'Alerta: Grado 3 requiere desparasitación selectiva hoy',
    tecnico: 'Dra. Elena Rivas',
    observaciones: 'Score FAMACHA: Grado 3 (Rosado Pálido - Alerta Haemonchus contortus) | Aplicación inmediata de Ivermectina 1% vía subcutánea'
  },
  {
    id: 'ev-cap-3',
    fecha: '07/09/2026',
    codigoAnimal: 'CAP-CAB01',
    especie: 'Caprinos',
    categoria: 'Reproductivos',
    tipoEvento: 'Partos',
    vencimiento: 'Desbotonado térmico de cabritos en 7 días',
    tecnico: 'Luis Martínez',
    observaciones: 'Parto Múltiple Caprino: Mellizos vivos (Macho 3.8 kg + Hembra 3.5 kg) | Cabra Alpino Francés | Encalostrado asistido inmediato'
  },
  {
    id: 'ev-cap-4',
    fecha: '03/09/2026',
    codigoAnimal: 'CAP-CL01',
    especie: 'Caprinos',
    categoria: 'Sanitarios & Veterinarios',
    tipoEvento: 'Podología & Herraje Equino',
    vencimiento: 'Revisión podológica de aprisco en 45 días',
    tecnico: 'Luis Martínez',
    observaciones: 'Recorte podológico preventivo de pezuñas en tarima | Desinfección con sulfato de cobre al 10% contra pietín'
  },

  // ==========================================
  // 6. EQUINOS
  // ==========================================
  {
    id: 'ev-equ-1',
    fecha: '10/09/2026',
    codigoAnimal: 'EQU-YG01',
    especie: 'Equinos',
    categoria: 'Sanitarios & Veterinarios',
    tipoEvento: 'Podología & Herraje Equino',
    vencimiento: 'Próximo herraje profesional programado en 40 días (20/10/2026)',
    tecnico: 'Manuel Pantoja (Maestro Herrador)',
    observaciones: 'Plan de Herraje Completo: Herraduras de acero con pestaña en 4 miembros | Desvasado anatómico y balance de aplomos'
  },
  {
    id: 'ev-equ-2',
    fecha: '08/09/2026',
    codigoAnimal: 'EQU-CAB01',
    especie: 'Equinos',
    categoria: 'Sanitarios & Veterinarios',
    tipoEvento: 'Planes Sanitarios',
    vencimiento: 'Vigencia oficial Test Coggins hasta 08/03/2027 (6 meses)',
    tecnico: 'Dr. Carlos Mendoza',
    observaciones: 'Certificación Oficial Test de Coggins (Anemia Infecciosa Equina AIE) Negativo • Laboratorio INSAI Oficial #C-8924'
  },
  {
    id: 'ev-equ-3',
    fecha: '06/09/2026',
    codigoAnimal: 'EQU-YG02',
    especie: 'Equinos',
    categoria: 'Reproductivos',
    tipoEvento: 'Foliculometría Equina',
    vencimiento: 'Servicio IA programado para mañana AM con semen refrigerado',
    tecnico: 'Dra. Elena Rivas',
    observaciones: 'Ecografía Ovárica: Folículo preovulatorio dominante de 42 mm en ovario izquierdo | Edema uterino Grado 3 (Rueda de carreta)'
  },
  {
    id: 'ev-equ-4',
    fecha: '01/09/2026',
    codigoAnimal: 'EQU-POT01',
    especie: 'Equinos',
    categoria: 'Manejo & Rutina',
    tipoEvento: 'Doma Racional Equina',
    vencimiento: 'Siguiente sesión: Trabajo a la cuerda y colocación de montura',
    tecnico: 'Roberto Gómez (Domador)',
    observaciones: 'Potro Cuarto de Milla (28 meses): Etapa 2 Doma India/Racional | Respuesta excelente a desensibilización de manta y filete'
  }
];
