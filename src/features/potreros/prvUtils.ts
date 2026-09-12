/**
 * AgroGan NextGen — Utilidades Zootécnicas y Agronómicas para Pastoreo Racional Voisin (PRV)
 * Basado en las 4 Leyes Fundamentales de André Voisin:
 * 1. Ley del Reposo (Punto Óptimo de Reposo).
 * 2. Ley de la Ocupación (1 a 2 días de permanencia máxima para evitar consumo del rebrote).
 * 3. Ley del Rendimiento Máximo (Ayuda a animales de máxima exigencia: lote despunte).
 * 4. Ley del Rendimiento Regular (Tiempos de permanencia uniformes).
 */

export type PrvStatus = 'optimo' | 'pastoreo' | 'sobrepastoreo' | 'descanso';

export interface PrvStatusInfo {
  status: PrvStatus;
  label: string;
  shortLabel: string;
  badgeClass: string;
  color: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  dotEmoji: string;
  tagline: string;
  description: string;
  recomendacion: string;
}

export interface ForageSpeciesPreset {
  nombre: string;
  porcentajeMS: number; // Materia Seca % (típicamente 18 - 25%)
  diasDescansoOptimo: number; // Días de reposo requeridos
  proteinaCrudaPorc: number; // PC %
  aforoTipicoKgM2: number; // kg MV/m²
}

export const FORAGE_SPECIES_PRESETS: Record<string, ForageSpeciesPreset> = {
  'Brachiaria decumbens': {
    nombre: 'Brachiaria decumbens',
    porcentajeMS: 22,
    diasDescansoOptimo: 28,
    proteinaCrudaPorc: 8.5,
    aforoTipicoKgM2: 2.8
  },
  'Panicum maximum (Mombaza)': {
    nombre: 'Panicum maximum (Mombaza)',
    porcentajeMS: 20,
    diasDescansoOptimo: 32,
    proteinaCrudaPorc: 12.0,
    aforoTipicoKgM2: 3.4
  },
  'Brachiaria brizantha (Marandú)': {
    nombre: 'Brachiaria brizantha (Marandú)',
    porcentajeMS: 22,
    diasDescansoOptimo: 35,
    proteinaCrudaPorc: 9.5,
    aforoTipicoKgM2: 3.1
  },
  'Brachiaria humidicola': {
    nombre: 'Brachiaria humidicola',
    porcentajeMS: 22,
    diasDescansoOptimo: 32,
    proteinaCrudaPorc: 7.0,
    aforoTipicoKgM2: 2.5
  },
  'Cynodon nlemfuensis (Estrella)': {
    nombre: 'Cynodon nlemfuensis (Estrella)',
    porcentajeMS: 24,
    diasDescansoOptimo: 25,
    proteinaCrudaPorc: 11.0,
    aforoTipicoKgM2: 3.0
  },
  'Panicum maximum (Tanzania)': {
    nombre: 'Panicum maximum (Tanzania)',
    porcentajeMS: 20,
    diasDescansoOptimo: 30,
    proteinaCrudaPorc: 11.5,
    aforoTipicoKgM2: 3.6
  },
  'Echinochloa polystachya (Alemán)': {
    nombre: 'Echinochloa polystachya (Alemán)',
    porcentajeMS: 18,
    diasDescansoOptimo: 40,
    proteinaCrudaPorc: 10.0,
    aforoTipicoKgM2: 4.2
  },
  'Pennisetum purpureum (Elefante / Cuba 22)': {
    nombre: 'Pennisetum purpureum (Elefante / Cuba 22)',
    porcentajeMS: 19,
    diasDescansoOptimo: 45,
    proteinaCrudaPorc: 13.0,
    aforoTipicoKgM2: 5.5
  }
};

/**
 * Determina el estado del Semáforo PRV Voisin
 * - 🟢 Verde: Punto Óptimo de Reposo (listo para pastoreo, ej. 36 días de descanso).
 * - 🟡 Amarillo: En pastoreo activo (días de permanencia 1 o 2).
 * - 🔴 Rojo: Alerta de sobrepastoreo (más de 3 días de ocupación).
 * - 🔵 Azul: En descanso y recuperación forrajera.
 */
export function getPrvStatusInfo(
  animales: number,
  diasOcupacion: number,
  diasDescanso: number,
  diasDescansoRequeridos: number
): PrvStatusInfo {
  // Potrero ocupado por animales
  if (animales > 0) {
    if (diasOcupacion > 2) {
      return {
        status: 'sobrepastoreo',
        label: 'Alerta de Sobrepastoreo',
        shortLabel: 'Sobrepastoreo',
        badgeClass: 'prv-badge-sobrepastoreo',
        color: '#ef4444',
        textColor: '#991b1b',
        bgColor: '#fee2e2',
        borderColor: '#fca5a5',
        dotEmoji: '🔴',
        tagline: `${diasOcupacion} días en potrero (>2d límite)`,
        description: 'Alerta crítica de sobrepastoreo. El ganado ha superado los 2 días de ocupación máxima recomendada.',
        recomendacion: '¡Rotar el lote urgentemente! El consumo del rebrote tierno ("diente de fuego") agota las reservas de carbohidratos en las raíces y degrada la pastura.'
      };
    }

    return {
      status: 'pastoreo',
      label: 'En Pastoreo Activo',
      shortLabel: 'En Pastoreo',
      badgeClass: 'prv-badge-pastoreo',
      color: '#eab308',
      textColor: '#854d0e',
      bgColor: '#fef9c3',
      borderColor: '#fde047',
      dotEmoji: '🟡',
      tagline: `Día ${diasOcupacion} de ocupación`,
      description: 'El lote se encuentra pastoreando activamente dentro de la ventana biológica permitida (1-2 días).',
      recomendacion: 'Ocupación correcta. Cosecha de despunte. Programar la salida del lote antes del tercer día para evitar consumo de rebrotes.'
    };
  }

  // Potrero sin animales (en reposo)
  if (diasDescanso >= diasDescansoRequeridos) {
    return {
      status: 'optimo',
      label: 'Punto Óptimo de Reposo',
      shortLabel: 'Punto Óptimo',
      badgeClass: 'prv-badge-optimo',
      color: '#22c55e',
      textColor: '#166534',
      bgColor: '#dcfce7',
      borderColor: '#86efac',
      dotEmoji: '🟢',
      tagline: `${diasDescanso} días de reposo (Listo)`,
      description: 'La pastura ha alcanzado su Punto Óptimo de Reposo (llamarada de crecimiento). Las raíces están repletas de reservas.',
      recomendacion: '¡Potrero prioritario para entrada de ganado! Ofrece el equilibrio ideal entre volumen de biomasa, palatabilidad y porcentaje proteico antes de lignificarse.'
    };
  }

  return {
    status: 'descanso',
    label: 'En Descanso y Recuperación',
    shortLabel: 'En Descanso',
    badgeClass: 'prv-badge-descanso',
    color: '#3b82f6',
    textColor: '#1e40af',
    bgColor: '#dbeafe',
    borderColor: '#93c5fd',
    dotEmoji: '🔵',
    tagline: `${diasDescanso} / ${diasDescansoRequeridos} días acumulados`,
    description: 'La pradera está en proceso de fotosíntesis y restauración forrajera. Las hojas absorben radiación para recuperar las reservas radiculares.',
    recomendacion: `Mantener cerrado el potrero. Faltan aproximadamente ${Math.max(0, diasDescansoRequeridos - diasDescanso)} días para alcanzar el Punto Óptimo de Reposo.`
  };
}

export interface ForageBalanceResult {
  aforoKgMsHa: number;
  ofertaNetaKgMsHa: number;
  ofertaTotalKgMs: number;
  demandaDiariaLoteKgMs: number;
  consumoPorUggKgMs: number;
  diasAutonomia: number;
  diasRestantesAutonomia: number;
  fechaSugeridaRotacion: string;
  fechaSugeridaObj: Date;
  capacidadCargaSugeridaUggHa: number;
  estadoBalance: 'excedente' | 'equilibrado' | 'deficitario';
  alertaMensaje: string;
}

/**
 * Calculador de Balance Forrajero Dinámico
 * Demanda diaria del lote: UGG * 450 kg * 2.8% PV = UGG * 12.6 kg MS/día
 * Oferta forrajera: aforo (kg MS/ha) * área (ha) * eficiencia (ej. 75%)
 */
export function calculateForageBalance(params: {
  areaHa: number;
  aforoKgM2: number;
  porcentajeMS?: number;
  eficienciaAprovechamiento?: number; // % (default 75%)
  uggPresentes: number;
  consumoPvPorc?: number; // % PV (default 2.8%)
  diasOcupacionActual?: number;
  diasDescansoRequeridos?: number;
}): ForageBalanceResult {
  const {
    areaHa,
    aforoKgM2,
    porcentajeMS = 22,
    eficienciaAprovechamiento = 75,
    uggPresentes,
    consumoPvPorc = 2.8,
    diasOcupacionActual = 0,
    diasDescansoRequeridos = 30
  } = params;

  // 1 UGG = 450 kg Peso Vivo bovino
  const consumoPorUggKgMs = 450 * (consumoPvPorc / 100); // 12.6 kg MS/UGG/día
  const aforoKgMsHa = aforoKgM2 * 10000 * (porcentajeMS / 100);
  const ofertaNetaKgMsHa = aforoKgMsHa * (eficienciaAprovechamiento / 100);
  const ofertaTotalKgMs = ofertaNetaKgMsHa * Math.max(0.1, areaHa);

  const demandaDiariaLoteKgMs = Math.max(1, uggPresentes * consumoPorUggKgMs);
  const diasAutonomia = demandaDiariaLoteKgMs > 0 ? (ofertaTotalKgMs / demandaDiariaLoteKgMs) : 0;
  const diasRestantesAutonomia = Math.max(0, diasAutonomia - diasOcupacionActual);

  // Capacidad de carga sustentable en UGG/ha para el ciclo de rotación completo
  const diasCicloTotal = diasDescansoRequeridos + 2; // Reposo + 2 días de ocupación
  const capacidadCargaSugeridaUggHa = (ofertaNetaKgMsHa) / (diasCicloTotal * consumoPorUggKgMs);

  // Proyección de fecha y hora sugerida de cambio de potrero
  const ahora = new Date('2026-09-12T10:30:00'); // Fecha contextual del sistema
  const horasRestantes = Math.round(diasRestantesAutonomia * 24);
  const fechaSugeridaObj = new Date(ahora.getTime() + horasRestantes * 60 * 60 * 1000);

  // Formato legible en español
  const opcionesFecha: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  const fechaSugeridaRotacion = fechaSugeridaObj.toLocaleDateString('es-VE', opcionesFecha);

  let estadoBalance: 'excedente' | 'equilibrado' | 'deficitario' = 'equilibrado';
  let alertaMensaje = '';

  if (diasAutonomia < 1.0 && uggPresentes > 0) {
    estadoBalance = 'deficitario';
    alertaMensaje = '¡Déficit Forrajero Crítico! La oferta forrajera no cubre ni un día de demanda del lote presente.';
  } else if (diasOcupacionActual > 2) {
    estadoBalance = 'deficitario';
    alertaMensaje = '¡Alerta Voisin! Aunque quede biomasa, el lote superó los 2 días de permanencia recomendados.';
  } else if (diasAutonomia > 4.0) {
    estadoBalance = 'excedente';
    alertaMensaje = 'Excedente de biomasa forrajera. Se aconseja subdividir con cerca eléctrica móvil para evitar pisoteo.';
  } else {
    estadoBalance = 'equilibrado';
    alertaMensaje = 'Balance forrajero óptimo. Autonomía adecuada para pastoreo sin riesgo de sobrepastoreo.';
  }

  return {
    aforoKgMsHa: Math.round(aforoKgMsHa),
    ofertaNetaKgMsHa: Math.round(ofertaNetaKgMsHa),
    ofertaTotalKgMs: Math.round(ofertaTotalKgMs),
    demandaDiariaLoteKgMs: Number(demandaDiariaLoteKgMs.toFixed(1)),
    consumoPorUggKgMs: Number(consumoPorUggKgMs.toFixed(2)),
    diasAutonomia: Number(diasAutonomia.toFixed(1)),
    diasRestantesAutonomia: Number(diasRestantesAutonomia.toFixed(1)),
    fechaSugeridaRotacion,
    fechaSugeridaObj,
    capacidadCargaSugeridaUggHa: Number(capacidadCargaSugeridaUggHa.toFixed(2)),
    estadoBalance,
    alertaMensaje
  };
}

export interface AforoCuttingFrameResult {
  promedioGramos: number;
  pesoFrescoKgM2: number;
  kgMsHa: number;
  kgMsAprovechableHa: number;
  toneladasTotalesMs: number;
  cargaRecomendadaUggHa: number;
  calidadForraje: 'Excelente' | 'Buena' | 'Regular' | 'Baja';
}

/**
 * Calculador de Aforo con Marco de Corte (1m x 1m o 0.5m x 0.5m)
 */
export function calculateCuttingFrameAforo(params: {
  frameAreaM2: number; // 1.0 o 0.25 (marco de 0.5x0.5m)
  samplesGrams: number[]; // Pesos de los cortes en gramos
  porcentajeMS: number; // % Materia Seca (15 - 35)
  eficienciaPastoreo?: number; // % (default 75%)
  areaHa: number;
  diasDescansoRequeridos?: number;
}): AforoCuttingFrameResult {
  const {
    frameAreaM2,
    samplesGrams,
    porcentajeMS,
    eficienciaPastoreo = 75,
    areaHa,
    diasDescansoRequeridos = 30
  } = params;

  const validSamples = samplesGrams.filter(s => s > 0);
  const sumaGramos = validSamples.reduce((acc, val) => acc + val, 0);
  const promedioGramos = validSamples.length > 0 ? (sumaGramos / validSamples.length) : 0;

  // Si el marco es de 0.5x0.5m (0.25 m²), multiplicar por 4 para obtener g/m²
  const factorMultiplicador = 1 / Math.max(0.01, frameAreaM2);
  const pesoFrescoGramosM2 = promedioGramos * factorMultiplicador;
  const pesoFrescoKgM2 = pesoFrescoGramosM2 / 1000;

  // kg MS / ha = kg MV/m² * 10,000 * (% MS / 100)
  const kgMsHa = pesoFrescoKgM2 * 10000 * (porcentajeMS / 100);
  const kgMsAprovechableHa = kgMsHa * (eficienciaPastoreo / 100);
  const toneladasTotalesMs = (kgMsAprovechableHa * areaHa) / 1000;

  // Capacidad de carga en UGG/ha para el ciclo PRV
  const diasCiclo = diasDescansoRequeridos + 2;
  const consumoUggDia = 450 * 0.028; // 12.6 kg MS/día
  const cargaRecomendadaUggHa = kgMsAprovechableHa / (diasCiclo * consumoUggDia);

  let calidadForraje: 'Excelente' | 'Buena' | 'Regular' | 'Baja' = 'Buena';
  if (pesoFrescoKgM2 >= 3.5) calidadForraje = 'Excelente';
  else if (pesoFrescoKgM2 >= 2.5) calidadForraje = 'Buena';
  else if (pesoFrescoKgM2 >= 1.6) calidadForraje = 'Regular';
  else calidadForraje = 'Baja';

  return {
    promedioGramos: Math.round(promedioGramos),
    pesoFrescoKgM2: Number(pesoFrescoKgM2.toFixed(2)),
    kgMsHa: Math.round(kgMsHa),
    kgMsAprovechableHa: Math.round(kgMsAprovechableHa),
    toneladasTotalesMs: Number(toneladasTotalesMs.toFixed(1)),
    cargaRecomendadaUggHa: Number(cargaRecomendadaUggHa.toFixed(2)),
    calidadForraje
  };
}
