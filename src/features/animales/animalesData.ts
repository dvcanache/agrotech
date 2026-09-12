import { Animal, Animal360, PedigreeNode, CurvaLactanciaPoint, ControlLecheroPesaje, RegistroPesaje, TrasladoEspacialItem, TratamientoSanitarioItem, VacunaPlanItem } from '../../types/animal';

export const BASE_ANIMALS: Animal[] = [
  { practico: "0001", unico: "VE-01-0001-92", categoria: "Vaca", estatus: "Activo", fechaNacimiento: "15/04/2021", edad: "5,4 Años", lote: "Lote 01", descripcion: "Lote 01 - Alta Producción", composicion: "Carora 75% x Holstein 25%", racial: "Carora/Holstein", etiquetas: "Élite, Ordeño", activos: "Chip RFID, Arete", padre: "CAR-092", madre: "0045", rfid: "982.000123849102", estatusReproductivo: "Preñada", diasGestacion: 142, estatusProductivo: "Ordeño", pesoKg: 560, alertaSanitaria: "Retiro Activo (Mastitis PD)" },
  { practico: "0002", unico: "VE-01-0002-88", categoria: "Vaca", estatus: "Activo", fechaNacimiento: "16/10/2020", edad: "5,9 Años", lote: "Lote 01", descripcion: "Lote 01 - Alta Producción", composicion: "Pardo Suizo 50% x Brahman 50%", racial: "F1 Doble Propósito", etiquetas: "Ordeño", activos: "Chip RFID, Arete", padre: "PS-104", madre: "BR-032", rfid: "982.000123849103", estatusReproductivo: "Vacía", estatusProductivo: "Ordeño", pesoKg: 520 },
  { practico: "EM01", unico: "EM01", categoria: "Embrión", estatus: "Activo", fechaNacimiento: "", edad: "", lote: "TERM1", descripcion: "Termo 1 Nitrógeno", composicion: "Carora Puro", racial: "Carora", etiquetas: "Crioconservado", activos: "Pajuela Criogénica", padre: "CAR-092", madre: "0001" },
  { practico: "SM01", unico: "SM01-CARORA", categoria: "Semen", estatus: "Activo", fechaNacimiento: "", edad: "", lote: "TERM1", descripcion: "Termo 1 Nitrógeno", composicion: "Carora Puro 100%", racial: "Carora", etiquetas: "Semen Congelado", activos: "Pajuela Criogénica", padre: "CAR-014", madre: "CAR-065" },
  { practico: "SM02", unico: "SM02-HOLSTEIN", categoria: "Semen", estatus: "Activo", fechaNacimiento: "", edad: "", lote: "TERM1", descripcion: "Termo 1 Nitrógeno", composicion: "Holstein Rojo Puro", racial: "Holstein", etiquetas: "Semen Congelado", activos: "Pajuela Criogénica", padre: "HOL-310", madre: "HOL-189" },
  { practico: "BCA01", unico: "VE-01-BCA01-26", categoria: "Becerra", estatus: "Activo", fechaNacimiento: "29/10/2025", edad: "10,5 Meses", lote: "POT1", descripcion: "Potrero 1 - Terneraje", composicion: "Carora 87.5% x Holstein 12.5%", racial: "Carora", etiquetas: "Cría 0001", activos: "Arete Visual", padre: "CAR-092", madre: "0001", rfid: "982.000123849105", pesoKg: 198 },
  { practico: "BCA02", unico: "VE-01-BCA02-26", categoria: "Becerra", estatus: "Activo", fechaNacimiento: "15/11/2025", edad: "9,9 Meses", lote: "POT1", descripcion: "Potrero 1 - Terneraje", composicion: "Girolando 5/8", racial: "Girolando", etiquetas: "Cría 0002", activos: "Arete Visual", padre: "GIR-04", madre: "0002", rfid: "982.000123849106", pesoKg: 185 },
  { practico: "BCA03", unico: "VE-01-BCA03-25", categoria: "Novilla", estatus: "Activo", fechaNacimiento: "15/09/2024", edad: "24,0 Meses", lote: "POT2", descripcion: "Potrero 2 - Novillas de Reemplazo", composicion: "Carora x Brahman", racial: "Mestizo", etiquetas: "Servida", activos: "Arete Visual, RFID", padre: "CAR-092", madre: "BR-032", rfid: "982.000123849107", pesoKg: 385, estatusReproductivo: "En espera" },
  { practico: "BCA04", unico: "VE-01-BCA04-25", categoria: "Novilla", estatus: "Activo", fechaNacimiento: "15/09/2024", edad: "24,0 Meses", lote: "POT2", descripcion: "Potrero 2 - Novillas de Reemplazo", composicion: "Pardo Suizo 75%", racial: "Pardo Suizo", etiquetas: "Vientre", activos: "Arete Visual", padre: "PS-104", madre: "CW013", rfid: "982.000123849108", pesoKg: 395, estatusReproductivo: "Vacía" },
  { practico: "BCA05", unico: "VE-01-BCA05-23", categoria: "Vaca", estatus: "Activo", fechaNacimiento: "13/02/2022", edad: "4,5 Años", lote: "Lote 01", descripcion: "Lote 01 - Alta Producción", composicion: "Carora 100%", racial: "Carora Puro", etiquetas: "Seca", activos: "Arete Visual, RFID", padre: "CAR-014", madre: "CAR-019", rfid: "982.000123849109", pesoKg: 510, estatusReproductivo: "Preñada", diasGestacion: 210, estatusProductivo: "Seca" }
];

export const generateAnimals = (count = 49): Animal[] => {
  const generated: Animal[] = [];
  const padZero = (num: number) => (num < 10 ? `000${num}` : num < 100 ? `00${num}` : `0${num}`);

  for (let i = 1; i <= count; i++) {
    if (i <= 10) {
      generated.push({ ...BASE_ANIMALS[i - 1] });
    } else {
      const base = BASE_ANIMALS[(i - 1) % 10];
      const indexStr = i < 10 ? `0${i}` : `${i}`;
      let practico = "";
      let unico = "";

      if (base.categoria === "Vaca") {
        practico = padZero(i);
        unico = `VE-01-${padZero(i)}-26`;
      } else if (base.categoria === "Embrión") {
        practico = `EM${indexStr}`;
        unico = `EM${indexStr}`;
      } else if (base.categoria === "Semen") {
        practico = `SM${indexStr}`;
        unico = `SM${indexStr}`;
      } else {
        practico = `BCA${indexStr}`;
        unico = `VE-01-BCA${indexStr}-26`;
      }

      generated.push({
        ...base,
        practico,
        unico,
        composicion: `${base.composicion}`
      });
    }
  }

  return generated;
};

/* =========================================================================
 * MOCK EXPEDIENTES 360 COMPLETOS
 * ========================================================================= */

// Curva de Wood para animal 0001: yt = a * t^b * e^(-c*t)
// a = 16.8, b = 0.26, c = 0.0052
const WOOD_POINTS_0001: CurvaLactanciaPoint[] = [
  { dim: 15, produccionReal: 20.2, produccionWood: 20.4, promedioFinca: 17.5 },
  { dim: 30, produccionReal: 25.4, produccionWood: 25.1, promedioFinca: 20.8 },
  { dim: 45, produccionReal: 28.6, produccionWood: 28.2, promedioFinca: 22.4 },
  { dim: 60, produccionReal: 27.8, produccionWood: 27.5, promedioFinca: 21.9 },
  { dim: 90, produccionReal: 25.2, produccionWood: 25.3, promedioFinca: 20.1 },
  { dim: 120, produccionReal: 23.4, produccionWood: 23.2, promedioFinca: 18.6 },
  { dim: 145, produccionReal: 22.2, produccionWood: 21.8, promedioFinca: 17.4 },
  { dim: 180, produccionWood: 19.8, promedioFinca: 15.9 },
  { dim: 210, produccionWood: 18.2, promedioFinca: 14.8 },
  { dim: 240, produccionWood: 16.7, promedioFinca: 13.6 },
  { dim: 270, produccionWood: 15.1, promedioFinca: 12.5 },
  { dim: 305, produccionWood: 13.4, promedioFinca: 11.2 }
];

export const ANIMAL_360_0001: Animal360 = {
  practico: "0001",
  unico: "VE-01-0001-92",
  rfid: "982.000123849102",
  categoria: "Vaca",
  estatus: "Activo",
  estatusReproductivo: "Preñada",
  diasGestacion: 142,
  estatusProductivo: "Ordeño",
  fechaNacimiento: "15/04/2021",
  edadAnos: 5,
  edadMeses: 5,
  edadTexto: "5 años, 5 meses",
  raza: "Carora (75%) x Holstein (25%)",
  lote: "Lote 01 (Alta Producción)",
  potrero: "Potrero 4 (Pasto Estrella)",
  alias: "MARIPOSA",
  alertaSanitaria: {
    activo: true,
    tipo: 'antibiotico',
    diagnostico: 'Mastitis Clínica Aguda en cuarto Posterior Derecho (PD)',
    farmaco: 'Cefalexina Intramamaria 200mg + Flunixin Meglumine 50mg/ml',
    principioActivo: 'Cefalexina monohidrato + Flunixin meglumina',
    dosis: '1 jeringa intramamaria c/12h x 3 aplicaciones + 10ml IM',
    via: 'Intramamaria',
    cuartosAfectados: ['PD'],
    fechaInicio: '09/09/2026',
    fechaFinRetiroLeche: '15/09/2026',
    diasRestantesLeche: 3,
    fechaFinRetiroCarne: '24/09/2026',
    diasRestantesCarne: 12,
    ordenBloqueoTanque: true,
    veterinario: 'Dr. Ramón Ramírez (MPPS-4821)'
  },
  fotoUrl: '',
  colorPelaje: 'Bayo encerado con mucosas oscuras',
  hierroMarca: {
    codigo: 'H-24',
    posicion: 'Pierna Izquierda',
    tipo: 'Hierro caliente tradicional'
  },
  propietario: 'Agropecuaria El Porvenir, C.A.',
  porcentajeTenencia: 100,
  origen: 'Nacida en Finca (Hato San José)',
  tatuaje: 'Oreja Izq: 0001 | Oreja Der: TAT-092',
  especie: 'Bovino (Bos taurus x Bos indicus)',
  sexo: 'Hembra',
  finalidad: 'Doble Propósito (Lechero Especializado Tropical)',
  notasZootecnicas: 'Vaca élite con 3 lactancias cerradas sobresalientes. Gran adaptabilidad térmica, ubre de inserción fuerte con ligamento medio marcado. En tratamiento resolutivo por mastitis en cuarto PD con bloqueo estricto de tanque.',

  // Genealogía 3 generaciones & Consanguinidad Wright
  pedigri: {
    id: '0001',
    arete: '0001',
    nombre: 'Mariposa',
    raza: 'Carora 75% x Holstein 25%',
    rol: 'Madre',
    padre: {
      id: 'CAR-092',
      arete: 'CAR-092',
      nombre: 'Faraón de Carora',
      raza: 'Carora Puro 100%',
      hba: 'HBA-CA-4402',
      rol: 'Padre',
      padre: {
        id: 'CAR-014',
        arete: 'CAR-014',
        nombre: 'Sultán Negro',
        raza: 'Carora Puro 100%',
        hba: 'HBA-CA-2190',
        rol: 'Abuelo Paterno',
        padre: { id: 'CAR-002', arete: 'CAR-002', nombre: 'Conquistador', raza: 'Carora', rol: 'Bisabuelo' },
        madre: { id: 'CAR-008', arete: 'CAR-008', nombre: 'Reina de Oro', raza: 'Carora', rol: 'Bisabuela' }
      },
      madre: {
        id: 'CAR-065',
        arete: 'CAR-065',
        nombre: 'Princesa 65',
        raza: 'Carora Puro 100%',
        hba: 'HBA-CA-3104',
        rol: 'Abuela Paterna',
        padre: { id: 'CAR-005', arete: 'CAR-005', nombre: 'Centauro', raza: 'Carora', rol: 'Bisabuelo' },
        madre: { id: 'CAR-019', arete: 'CAR-019', nombre: 'Lucero', raza: 'Carora', rol: 'Bisabuela' }
      }
    },
    madre: {
      id: '0045',
      arete: '0045',
      nombre: 'Paloma',
      raza: 'Holstein 50% x Carora 50%',
      hba: 'CR-8831',
      rol: 'Madre',
      padre: {
        id: 'HOL-310',
        arete: 'HOL-310',
        nombre: 'Superstar de Wisconsin',
        raza: 'Holstein 100%',
        hba: 'US-1192834',
        rol: 'Abuelo Materno',
        padre: { id: 'HOL-102', arete: 'HOL-102', nombre: 'Elevation', raza: 'Holstein', rol: 'Bisabuelo' },
        madre: { id: 'HOL-189', arete: 'HOL-189', nombre: 'Bell Linda', raza: 'Holstein', rol: 'Bisabuela' }
      },
      madre: {
        id: '0012',
        arete: '0012',
        nombre: 'Canaria',
        raza: 'Carora Puro 100%',
        hba: 'HBA-CA-1823',
        rol: 'Abuela Materna',
        padre: { id: 'CAR-014', arete: 'CAR-014', nombre: 'Sultán Negro', raza: 'Carora', rol: 'Bisabuelo' },
        madre: { id: '0003', arete: '0003', nombre: 'Margarita', raza: 'Carora', rol: 'Bisabuela' }
      }
    }
  },
  consanguinidad: {
    coeficienteWrightFx: 0.0781, // 7.81%
    alertaEndogamia: true,
    ancestroComun: 'Semental Sultán Negro (CAR-014) presente en línea paterna y materna',
    analisis: 'El coeficiente de consanguinidad de Wright Fx calculado es de 7.81%, superando el umbral zootécnico del 6.25%. Existe riesgo de depresión endogámica (menor vigor híbrido, ligera merma de fertilidad y mayor susceptibilidad a infecciones mamarias).',
    recomendacionCruzamiento: 'Evitar apareamientos con toros emparentados con la línea "Sultán Negro" (CAR-014). Se sugiere utilizar sementales no emparentados de razas divergentes como Girolando F1 o Pardo Suizo importado para maximizar heterosis.'
  },
  desgloseRacial: [
    { raza: 'Carora Tropical', porcentaje: 75, colorHex: '#2d6a4f' },
    { raza: 'Holstein Americano', porcentaje: 25, colorHex: '#52b788' }
  ],

  // Reproductivo
  kpisReproductivos: {
    iepPromedioDias: 382,
    diasAbiertos: 85,
    serviciosPorConcepcion: 1.3,
    devDias: 50,
    totalPartos: 3,
    totalAbortos: 0,
    fechaUltimoParto: '29/10/2025',
    fechaUltimoServicio: '09/03/2026',
    fechaProximoParto: '24/11/2026',
    diasPrenez: 142
  },
  timelineGinecologico: [
    {
      id: 'gyn-1',
      fecha: '23/04/2026',
      campana: 3,
      tipo: 'Palpacion',
      titulo: 'Diagnóstico de Gestación por Ecografía (45 días)',
      descripcion: 'Preñez confirmada. Cuerno grávido derecho con presencia de feto viable con latido cardíaco. Cuerpo lúteo funcional de 22mm en ovario derecho.',
      tecnico: 'Dr. Ramón Ramírez (Veterinario)',
      detalles: {
        diagnosticoEco: 'Preñada Positiva (45d)',
        cuernoUterino: 'Derecho Grávido',
        cuerpoLuteo: 'Ovario Derecho (22mm)'
      }
    },
    {
      id: 'gyn-2',
      fecha: '09/03/2026',
      campana: 3,
      tipo: 'Servicio',
      titulo: 'Inseminación Artificial (IA)',
      descripcion: 'Servicio realizado con semen congelado de CAR-092 (Faraón). Condición cervical grado 3, moco estral cristalino transparente.',
      tecnico: 'Téc. Pedro Mendoza',
      detalles: {
        hora: '07:30 AM',
        toro: 'CAR-092 - Faraón de Carora',
        pajuelaLote: 'LOTE-2025-A',
        metodoServicio: 'IA'
      }
    },
    {
      id: 'gyn-3',
      fecha: '08/03/2026',
      campana: 3,
      tipo: 'Celo',
      titulo: 'Detección de Celo Natural',
      descripcion: 'Celo franco manifestado a las 06:15 AM. Reflejo de inmovilidad positivo ante monta de compañeras. Programada inseminación según regla AM-PM.',
      tecnico: 'Javier Colmenares (Capataz)',
      detalles: { hora: '06:15 AM' }
    },
    {
      id: 'gyn-4',
      fecha: '18/12/2025',
      campana: 3,
      tipo: 'Palpacion',
      titulo: 'Fin de Días de Espera Voluntaria (DEV 50d)',
      descripcion: 'Examen ginecológico post-parto. Involución uterina completa normal. Ovarios en ciclicidad activa sin adherencias.',
      tecnico: 'Dr. Ramón Ramírez',
      detalles: { diagnosticoEco: 'Vientre Apto para Reproducción' }
    },
    {
      id: 'gyn-5',
      fecha: '29/10/2025',
      campana: 2,
      tipo: 'Parto',
      titulo: 'Parto 3 (Eutócico Normal)',
      descripcion: 'Nacimiento de cría hembra viva (38.5 kg, arete BCA-042). Expulsión placentaria a las 2.5 horas sin retención. Inicio de Campaña 3.',
      tecnico: 'Téc. Pedro Mendoza',
      detalles: {
        sexoCria: 'Hembra',
        pesoCriaKg: 38.5,
        areteCria: 'BCA-042',
        tipoParto: 'Eutócico Normal'
      }
    },
    {
      id: 'gyn-6',
      fecha: '28/08/2025',
      campana: 2,
      tipo: 'Secado',
      titulo: 'Secado de Lactancia 2 (305 días)',
      descripcion: 'Cierre formal de la segunda lactancia a los 305 días con 5,680 kg producidos. Aplicación de sellador antimicrobiano intramamario en los 4 pezones.',
      tecnico: 'Dr. Ramón Ramírez',
      detalles: {
        diasLactanciaAcumulados: 305,
        productoSecado: 'Cepravin Secado (Cefalonio)'
      }
    }
  ],

  // Curvas de Lactancia Wood
  lactanciaStats: {
    numeroLactanciaActual: 3,
    diasEnLeche: 145,
    produccionAcumuladaKg: 3280,
    proyeccion305DiasKg: 5840,
    promedioFinca305DiasKg: 4890,
    picoLactanciaKg: 28.6,
    diaPico: 48,
    persistenciaPorc: 92.4,
    grasaMediaPorc: 3.76,
    proteinaMediaPorc: 3.19
  },
  curvaWoodData: WOOD_POINTS_0001,
  controlesLecheros: [
    {
      id: 'cl-1',
      fecha: '10/09/2026',
      dim: 145,
      amKg: 12.8,
      pmKg: 9.4,
      totalKg: 22.2,
      grasaPorc: 3.85,
      proteinaPorc: 3.20,
      ratioGP: 1.20,
      alertaGP: 'Optimo',
      rcs: 320000,
      estatusRCS: 'Alerta Subclínica'
    },
    {
      id: 'cl-2',
      fecha: '25/08/2026',
      dim: 130,
      amKg: 13.5,
      pmKg: 10.1,
      totalKg: 23.6,
      grasaPorc: 3.80,
      proteinaPorc: 3.15,
      ratioGP: 1.21,
      alertaGP: 'Optimo',
      rcs: 145000,
      estatusRCS: 'Normal'
    },
    {
      id: 'cl-3',
      fecha: '10/08/2026',
      dim: 115,
      amKg: 14.1,
      pmKg: 10.6,
      totalKg: 24.7,
      grasaPorc: 3.75,
      proteinaPorc: 3.18,
      ratioGP: 1.18,
      alertaGP: 'Optimo',
      rcs: 130000,
      estatusRCS: 'Normal'
    },
    {
      id: 'cl-4',
      fecha: '25/07/2026',
      dim: 100,
      amKg: 14.8,
      pmKg: 11.2,
      totalKg: 26.0,
      grasaPorc: 3.70,
      proteinaPorc: 3.22,
      ratioGP: 1.15,
      alertaGP: 'Optimo',
      rcs: 125000,
      estatusRCS: 'Normal'
    },
    {
      id: 'cl-5',
      fecha: '10/07/2026',
      dim: 85,
      amKg: 15.6,
      pmKg: 11.8,
      totalKg: 27.4,
      grasaPorc: 3.65,
      proteinaPorc: 3.20,
      ratioGP: 1.14,
      alertaGP: 'Optimo',
      rcs: 110000,
      estatusRCS: 'Normal'
    }
  ],

  // Desarrollo Ponderal
  pesajesAjustados: {
    pesoNacimientoKg: 35,
    pesoAjustado205dKg: 198,
    pesoAjustado365dKg: 320,
    pesoAjustado540dKg: 435,
    pesoActualKg: 560,
    gdpGlobalGramosDia: 742
  },
  historialPesajes: [
    {
      id: 'pes-1',
      fecha: '15/08/2026',
      edadMeses: 64,
      diasVida: 1948,
      pesoKg: 560,
      pesoEsperadoRazaKg: 540,
      gdpPeriodoGramosDia: 380,
      condicionCorporal: 3.25,
      metodo: 'Báscula Electrónica Tru-Test',
      observaciones: 'Buena conformación de costillar y cobertura grasa homogénea.'
    },
    {
      id: 'pes-2',
      fecha: '15/05/2026',
      edadMeses: 61,
      diasVida: 1856,
      pesoKg: 545,
      pesoEsperadoRazaKg: 535,
      gdpPeriodoGramosDia: 420,
      condicionCorporal: 3.00,
      metodo: 'Báscula Electrónica Tru-Test',
      observaciones: 'Tercio inicial de gestación en ordeño.'
    },
    {
      id: 'pes-3',
      fecha: '15/10/2022',
      edadMeses: 18,
      diasVida: 548,
      pesoKg: 435,
      pesoEsperadoRazaKg: 410,
      gdpPeriodoGramosDia: 650,
      condicionCorporal: 3.50,
      metodo: 'Báscula Electrónica Tru-Test',
      observaciones: 'Ajuste estandarizado a los 540 días.'
    },
    {
      id: 'pes-4',
      fecha: '15/04/2022',
      edadMeses: 12,
      diasVida: 365,
      pesoKg: 320,
      pesoEsperadoRazaKg: 300,
      gdpPeriodoGramosDia: 760,
      condicionCorporal: 3.25,
      metodo: 'Báscula Electrónica Tru-Test',
      observaciones: 'Ajuste al año (365 días) superando media racial.'
    },
    {
      id: 'pes-5',
      fecha: '05/11/2021',
      edadMeses: 7,
      diasVida: 205,
      pesoKg: 198,
      pesoEsperadoRazaKg: 180,
      gdpPeriodoGramosDia: 795,
      condicionCorporal: 3.50,
      metodo: 'Báscula Electrónica Tru-Test',
      observaciones: 'Pesaje estandarizado al destete (205 días).'
    }
  ],
  condicionCorporalActual: 3.25,

  // Sanidad y Ubre 4 Cuartos
  cuartosMamarios: {
    AD: {
      codigo: 'AD',
      nombre: 'Anterior Derecho',
      cmt: 'Negativo',
      estadoClinico: 'Sano',
      conductividadMs: 4.6,
      ultimoTratamiento: 'Ninguno'
    },
    AI: {
      codigo: 'AI',
      nombre: 'Anterior Izquierdo',
      cmt: 'Negativo',
      estadoClinico: 'Sano',
      conductividadMs: 4.5,
      ultimoTratamiento: 'Ninguno'
    },
    PD: {
      codigo: 'PD',
      nombre: 'Posterior Derecho',
      cmt: 'Grado 3',
      estadoClinico: 'Mastitis Clínica',
      conductividadMs: 7.8,
      ultimoTratamiento: 'Cefalexina intramamaria 200mg (Día 2/3)'
    },
    PI: {
      codigo: 'PI',
      nombre: 'Posterior Izquierdo',
      cmt: 'Trazas',
      estadoClinico: 'Mastitis Subclínica',
      conductividadMs: 5.2,
      ultimoTratamiento: 'En observación preventiva'
    }
  },
  tratamientosSanitarios: [
    {
      id: 'trat-1',
      fecha: '09/09/2026',
      diagnostico: 'Mastitis Clínica Aguda en cuarto PD',
      farmaco: 'Cefalexina Intramamaria 200mg',
      principioActivo: 'Cefalexina monohidrato',
      dosis: '1 jeringa intramamaria c/12h por 3 aplicaciones',
      via: 'Intramamaria',
      cuartosAfectados: ['PD'],
      retiroLecheHoras: 72,
      retiroCarneDias: 15,
      fechaFinRetiroLeche: '15/09/2026',
      fechaFinRetiroCarne: '24/09/2026',
      diasRestantesRetiro: 3,
      activo: true,
      veterinario: 'Dr. Ramón Ramírez'
    },
    {
      id: 'trat-2',
      fecha: '14/05/2026',
      diagnostico: 'Control Parasitismo Gastrointestinal y Fasciola',
      farmaco: 'Albendazol 10% Oral',
      principioActivo: 'Albendazol sulfóxido',
      dosis: '40 ml vía oral',
      via: 'Oral',
      retiroLecheHoras: 48,
      retiroCarneDias: 14,
      fechaFinRetiroLeche: '16/05/2026',
      fechaFinRetiroCarne: '28/05/2026',
      diasRestantesRetiro: 0,
      activo: false,
      veterinario: 'Dr. Ramón Ramírez'
    }
  ],
  planVacunacion: [
    {
      id: 'vac-1',
      enfermedad: 'Fiebre Aftosa (Bivalente O1/A24)',
      producto: 'Aftogan',
      laboratorio: 'Vecol',
      lote: 'AF-2026-08',
      fechaAplicacion: '15/05/2026',
      fechaProximaDosis: '15/11/2026',
      estado: 'Vigente',
      veterinario: 'Dr. Ramón Ramírez'
    },
    {
      id: 'vac-2',
      enfermedad: 'Brucelosis Bovina (Cepa RB51)',
      producto: 'RB51 Vaccine',
      laboratorio: 'CZ Vaccines',
      lote: 'RB-9812',
      fechaAplicacion: '15/11/2021',
      fechaProximaDosis: 'Permanente (Dosis única)',
      estado: 'Vigente',
      veterinario: 'Dr. Ramón Ramírez'
    },
    {
      id: 'vac-3',
      enfermedad: 'Rabia Paresiante',
      producto: 'Derriengue Vac',
      laboratorio: 'Pronabive',
      lote: 'RP-4410',
      fechaAplicacion: '10/06/2026',
      fechaProximaDosis: '10/06/2027',
      estado: 'Vigente',
      veterinario: 'Dr. Ramón Ramírez'
    },
    {
      id: 'vac-4',
      enfermedad: 'Complejo Reproductivo (IBR, BVD, Lepto 5)',
      producto: 'CattleMaster 4+L5',
      laboratorio: 'Zoetis',
      lote: 'CM-2201',
      fechaAplicacion: '20/01/2026',
      fechaProximaDosis: '20/01/2027',
      estado: 'Vigente',
      veterinario: 'Dr. Ramón Ramírez'
    }
  ],

  // Trazabilidad Espacial
  historialTraslados: [
    {
      id: 'tras-1',
      fechaEntrada: '05/09/2026',
      diasPermanencia: 7,
      potreroId: 'POT-04',
      potreroNombre: 'Potrero 4 - Pasto Estrella',
      hectareas: 4.2,
      tipoPastura: 'Cynodon nlemfuensis (Pasto Estrella Santo Domingo)',
      loteNombre: 'Lote 01 (Alta Producción)',
      cargaAnimalUggHa: 2.8,
      motivo: 'Rotación PRV',
      responsable: 'Javier Colmenares (Capataz)',
      actual: true
    },
    {
      id: 'tras-2',
      fechaEntrada: '28/08/2026',
      fechaSalida: '05/09/2026',
      diasPermanencia: 8,
      potreroId: 'POT-03',
      potreroNombre: 'Potrero 3 - Brachiaria Brizantha',
      hectareas: 5.0,
      tipoPastura: 'Brachiaria brizantha cv. Marandú',
      loteNombre: 'Lote 01 (Alta Producción)',
      cargaAnimalUggHa: 2.4,
      motivo: 'Rotación PRV',
      responsable: 'Javier Colmenares (Capataz)',
      actual: false
    },
    {
      id: 'tras-3',
      fechaEntrada: '20/08/2026',
      fechaSalida: '28/08/2026',
      diasPermanencia: 8,
      potreroId: 'POT-02',
      potreroNombre: 'Potrero 2 - Guinea Mombasa',
      hectareas: 4.8,
      tipoPastura: 'Megathyrsus maximus cv. Mombasa',
      loteNombre: 'Lote 01 (Alta Producción)',
      cargaAnimalUggHa: 2.6,
      motivo: 'Rotación PRV',
      responsable: 'Javier Colmenares (Capataz)',
      actual: false
    },
    {
      id: 'tras-4',
      fechaEntrada: '10/08/2026',
      fechaSalida: '20/08/2026',
      diasPermanencia: 10,
      potreroId: 'POT-01',
      potreroNombre: 'Potrero 1 - Pasto Estrella',
      hectareas: 4.0,
      tipoPastura: 'Cynodon nlemfuensis',
      loteNombre: 'Lote 01 (Alta Producción)',
      cargaAnimalUggHa: 2.7,
      motivo: 'Rotación PRV',
      responsable: 'Javier Colmenares (Capataz)',
      actual: false
    }
  ]
};

// Generador inteligente 360 para cualquier animal del rebaño
export const getAnimal360ByPractico = (practico: string): Animal360 => {
  if (practico === '0001') {
    return ANIMAL_360_0001;
  }

  // Buscar en animales base o generar
  const found = BASE_ANIMALS.find(a => a.practico === practico) || {
    practico,
    unico: `VE-01-${practico}-26`,
    categoria: 'Vaca',
    estatus: 'Activo',
    fechaNacimiento: '16/10/2020',
    edad: '5,9 Años',
    lote: 'Lote 01',
    descripcion: 'Lote 01 - Alta Producción',
    composicion: 'Pardo Suizo 50% x Brahman 50%',
    racial: 'Doble Propósito',
    etiquetas: '',
    activos: 'Arete, RFID',
    padre: 'PS-104',
    madre: 'BR-032'
  };

  const isVaca = found.categoria === 'Vaca';
  const isNovilla = found.categoria === 'Novilla';
  const isBecerra = ['Becerra', 'Becerro'].includes(found.categoria);
  const isToro = found.categoria === 'Toro';

  return {
    ...ANIMAL_360_0001,
    practico: found.practico,
    unico: found.unico || `VE-01-${found.practico}-26`,
    rfid: found.rfid || `982.000123${found.practico.padStart(6, '0')}`,
    categoria: found.categoria,
    estatus: found.estatus as any,
    estatusReproductivo: isVaca ? 'Preñada' : isNovilla ? 'En espera' : 'Vacía',
    diasGestacion: isVaca ? 98 : undefined,
    estatusProductivo: isVaca ? 'Ordeño' : isBecerra ? 'Criando' : 'Seca',
    raza: found.composicion || 'Carora 75% x Holstein 25%',
    lote: found.descripcion || found.lote,
    alias: `SEMOVIENTE ${found.practico}`,
    alertaSanitaria: found.practico === '0001' ? ANIMAL_360_0001.alertaSanitaria : undefined,
    cuartosMamarios: {
      AD: { codigo: 'AD', nombre: 'Anterior Derecho', cmt: 'Negativo', estadoClinico: 'Sano' },
      AI: { codigo: 'AI', nombre: 'Anterior Izquierdo', cmt: 'Negativo', estadoClinico: 'Sano' },
      PD: { codigo: 'PD', nombre: 'Posterior Derecho', cmt: 'Negativo', estadoClinico: 'Sano' },
      PI: { codigo: 'PI', nombre: 'Posterior Izquierdo', cmt: 'Negativo', estadoClinico: 'Sano' }
    },
    consanguinidad: {
      coeficienteWrightFx: 0.0312,
      alertaEndogamia: false,
      analisis: 'El coeficiente de consanguinidad de Wright Fx calculado es de 3.12%, encontrándose dentro de los límites zootécnicos seguros (< 6.25%).',
      recomendacionCruzamiento: 'Animal con excelente vigor híbrido y variabilidad alélica. Apto para programas de inseminación artificial con reproductores probados.'
    }
  };
};
