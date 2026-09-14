/**
 * AgroGan NextGen — Utilidades Zootécnicas y Agronómicas para Pastoreo Racional Voisin (PRV)
 * Basado en las 4 Leyes Fundamentales de André Voisin:
 * 1. Ley del Reposo (Punto Óptimo de Reposo).
 * 2. Ley de la Ocupación (1 a 2 días de permanencia máxima para evitar consumo del rebrote).
 * 3. Ley del Rendimiento Máximo (Ayuda a animales de máxima exigencia: lote despunte).
 * 4. Ley del Rendimiento Regular (Tiempos de permanencia uniformes).
 * 
 * Modificaciones aplicadas según Auditoría Científica Fase 1 & 2 (Sección 2.1 y Parches 1, 2 y 16).
 */

import { EspecieAnimal } from '../../types/animal';

export type PrvStatus = 'optimo' | 'pastoreo' | 'sobrepastoreo' | 'descanso' | 'subpastoreo';

/**
 * Factores oficiales de conversión a Unidad Gran Ganado (UGG) multi-especie
 * Equivalencia estándar: 1 UGG = 450 kg de peso vivo bovino adulto.
 */
export const UGG_FACTORS: Record<EspecieAnimal, number> = {
  'Bovinos': 1.0,
  'Búfalos': 1.2,
  'Equinos': 1.2,
  'Porcinos': 0.3,
  'Caprinos': 0.15,
  'Aves de corral': 0.005
};

/**
 * TABLA MAESTRA UGG: Factores de conversión multiespecie por subcategoría zootécnica
 * Basado en Sección 2.1 y Parche 1 (Auditoría Zootécnica y Agronómica AgroGan v2.0).
 * Calibrado según peso vivo representativo (Base: 1 UGG = 450 kg PV).
 */
export const TABLA_MAESTRA_UGG: Record<EspecieAnimal, Record<string, number>> = {
  'Bovinos': {
    'Vacas': 1.00,
    'Vacas Adultas': 1.00,
    'Toros': 1.25,
    'Toros Reproductores': 1.25,
    'Novillas': 0.75,
    'Mautas / Mautes': 0.55,
    'Mautas': 0.55,
    'Mautes': 0.55,
    'Becerros / Becerras': 0.30,
    'Becerros': 0.30,
    'Becerras': 0.30,
    'default': 1.00
  },
  'Búfalos': {
    'Búfalas': 1.20,
    'Padrotes / Búfalos de Ceba': 1.40,
    'Padrotes': 1.40,
    'Búfalos de Ceba': 1.30,
    'Bubillas': 0.80,
    'Bucerros / Bucerras': 0.35,
    'Bucerros': 0.35,
    'Bucerras': 0.35,
    'default': 1.20
  },
  'Equinos': {
    'Caballos': 1.00,
    'Yeguas': 1.10,
    'Padrillos / Sementales': 1.20,
    'Padrillos': 1.20,
    'Sementales': 1.20,
    'Potros / Potrancas': 0.55,
    'Potros': 0.55,
    'Potrancas': 0.55,
    'default': 1.00
  },
  'Porcinos': {
    'Cerdas Reproductoras': 0.35,
    'Verracos': 0.45,
    'Cerdas de Reemplazo': 0.25,
    'Cerdos de Ceba': 0.22,
    'Lechones': 0.05,
    'default': 0.25
  },
  'Caprinos': {
    'Cabras Lecheras': 0.15,
    'Cabras': 0.15,
    'Chivos Reproductores': 0.18,
    'Chivos': 0.18,
    'Cabritonas / Cabritos': 0.08,
    'Cabritonas': 0.08,
    'Cabritos': 0.08,
    'Caprinos de Ceba': 0.10,
    'default': 0.14
  },
  'Aves de corral': {
    'Gallinas Ponedoras': 0.0045,
    'Pollos de Engorde': 0.0055,
    'Pollonas / Pollitos': 0.0015,
    'Pollonas': 0.002,
    'Pollitos': 0.001,
    'Gallos Finos': 0.005,
    'Gallinas Finas': 0.004,
    'Pavos / Pavas': 0.022,
    'Pavos': 0.025,
    'Pavas': 0.018,
    'Patos / Patas': 0.007,
    'Patos': 0.008,
    'Patas': 0.006,
    'Pavitos / Patitos': 0.002,
    'default': 0.005
  }
};

/**
 * Obtiene el factor UGG ajustado por especie y subcategoría zootécnica
 */
export function getUggFactorForSubcategory(
  especie?: EspecieAnimal | string,
  subcategoria?: string
): number {
  if (!especie) return 1.0;
  const espMap = TABLA_MAESTRA_UGG[especie as EspecieAnimal];
  if (!espMap) return UGG_FACTORS[especie as EspecieAnimal] ?? 1.0;
  if (subcategoria && espMap[subcategoria] !== undefined) {
    return espMap[subcategoria];
  }
  return espMap['default'] ?? UGG_FACTORS[especie as EspecieAnimal] ?? 1.0;
}

export const SPECIES_EMOJI: Record<EspecieAnimal, string> = {
  'Bovinos': '🐮',
  'Aves de corral': '🐔',
  'Porcinos': '🐷',
  'Búfalos': '🐃',
  'Caprinos': '🐐',
  'Equinos': '🐴'
};

export function getUggFactor(especie?: EspecieAnimal | string): number {
  if (!especie) return 1.0;
  return UGG_FACTORS[especie as EspecieAnimal] ?? 1.0;
}

export function calculateMultiSpeciesUgg(animales: number, especie?: EspecieAnimal | string, subcategoria?: string): number {
  const factor = subcategoria ? getUggFactorForSubcategory(especie, subcategoria) : getUggFactor(especie);
  return Number((animales * factor).toFixed(2));
}

export function calculateMultiSpeciesCarga(ugg: number, areaHa: number): number {
  if (areaHa <= 0) return 0;
  return Number((ugg / areaHa).toFixed(2));
}

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
  aforoTipicoKgM2: number; // kg MV/m² (calibrado según Sección 2.1 y Parche 1)
}

/**
 * Presets Botánicos Calibrados (Sección 2.1 y Parche 1)
 * Corrección de aforos sobreestimados:
 * - Decumbens: 1.15 kg/m²
 * - Brizantha: 1.55 kg/m²
 * - Humidicola: 0.95 kg/m²
 * - Mombaza: 2.10 kg/m²
 * - Tanzania: 1.75 kg/m²
 * - Estrella: 1.30 kg/m²
 */
export const FORAGE_SPECIES_PRESETS: Record<string, ForageSpeciesPreset> = {
  'Brachiaria decumbens': {
    nombre: 'Brachiaria decumbens',
    porcentajeMS: 22,
    diasDescansoOptimo: 28,
    proteinaCrudaPorc: 8.5,
    aforoTipicoKgM2: 1.15
  },
  'Panicum maximum (Mombaza)': {
    nombre: 'Panicum maximum (Mombaza)',
    porcentajeMS: 20,
    diasDescansoOptimo: 32,
    proteinaCrudaPorc: 12.0,
    aforoTipicoKgM2: 2.10
  },
  'Brachiaria brizantha (Marandú)': {
    nombre: 'Brachiaria brizantha (Marandú)',
    porcentajeMS: 22,
    diasDescansoOptimo: 35,
    proteinaCrudaPorc: 9.5,
    aforoTipicoKgM2: 1.55
  },
  'Brachiaria humidicola': {
    nombre: 'Brachiaria humidicola',
    porcentajeMS: 22,
    diasDescansoOptimo: 32,
    proteinaCrudaPorc: 7.0,
    aforoTipicoKgM2: 0.95
  },
  'Cynodon nlemfuensis (Estrella)': {
    nombre: 'Cynodon nlemfuensis (Estrella)',
    porcentajeMS: 24,
    diasDescansoOptimo: 25,
    proteinaCrudaPorc: 11.0,
    aforoTipicoKgM2: 1.30
  },
  'Panicum maximum (Tanzania)': {
    nombre: 'Panicum maximum (Tanzania)',
    porcentajeMS: 20,
    diasDescansoOptimo: 30,
    proteinaCrudaPorc: 11.5,
    aforoTipicoKgM2: 1.75
  },
  'Echinochloa polystachya (Alemán)': {
    nombre: 'Echinochloa polystachya (Alemán)',
    porcentajeMS: 18,
    diasDescansoOptimo: 40,
    proteinaCrudaPorc: 10.0,
    aforoTipicoKgM2: 1.80
  },
  'Pennisetum purpureum (Elefante / Cuba 22)': {
    nombre: 'Pennisetum purpureum (Elefante / Cuba 22)',
    porcentajeMS: 19,
    diasDescansoOptimo: 45,
    proteinaCrudaPorc: 13.0,
    aforoTipicoKgM2: 3.20
  }
};

export interface PaddockRestStatusResult {
  status: 'descanso' | 'optimo' | 'subpastoreo';
  diasDescanso: number;
  diasOptimos: number;
  excesoPorcentaje: number;
  mensaje: string;
  esSubpastoreo: boolean;
  esOptimo: boolean;
}

/**
 * Evalúa el estado de reposo de un potrero en PRV
 * Añade estado 'subpastoreo' cuando diasDescanso > diasOptimos * 1.35
 */
export function calculatePaddockRestStatus(
  diasDescanso: number,
  diasOptimos: number
): PaddockRestStatusResult {
  if (diasOptimos <= 0) diasOptimos = 30;

  if (diasDescanso > diasOptimos * 1.35) {
    const excesoPorcentaje = Math.round(((diasDescanso - diasOptimos) / diasOptimos) * 100);
    return {
      status: 'subpastoreo',
      diasDescanso,
      diasOptimos,
      excesoPorcentaje,
      esSubpastoreo: true,
      esOptimo: false,
      mensaje: `Alerta de Subpastoreo: reposo excesivo (${diasDescanso}d vs ${diasOptimos}d óptimo, +${excesoPorcentaje}%). Pastura lignificada, pérdida de palatabilidad y caída de PC <7%.`
    };
  }

  if (diasDescanso >= diasOptimos) {
    return {
      status: 'optimo',
      diasDescanso,
      diasOptimos,
      excesoPorcentaje: 0,
      esSubpastoreo: false,
      esOptimo: true,
      mensaje: `Punto Óptimo de Reposo Voisin alcanzado (${diasDescanso} días). Máxima biomasa digestible.`
    };
  }

  return {
    status: 'descanso',
    diasDescanso,
    diasOptimos,
    excesoPorcentaje: 0,
    esSubpastoreo: false,
    esOptimo: false,
    mensaje: `En descanso fotosintético (${diasDescanso} / ${diasOptimos} días). Faltan ${Math.max(0, diasOptimos - diasDescanso)} días.`
  };
}

/**
 * Determina el estado del Semáforo PRV Voisin
 * - 🟢 Verde (optimo): Punto Óptimo de Reposo (listo para pastoreo, ej. 28-35 días de descanso).
 * - 🟡 Amarillo (pastoreo): En pastoreo activo (días de permanencia 1 o 2).
 * - 🔴 Rojo (sobrepastoreo): Alerta de sobrepastoreo (más de 2 días de ocupación).
 * - 🟠 Ámbar (subpastoreo): Pastura pasada / lignificada por reposo excesivo (> 35% del óptimo).
 * - 🔵 Azul (descanso): En descanso y recuperación forrajera.
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
  // 1. Alerta de Subpastoreo (reposo excesivo >35% del óptimo, pasto pasado y lignificado)
  if (diasDescanso > diasDescansoRequeridos * 1.35) {
    return {
      status: 'subpastoreo',
      label: 'Alerta de Subpastoreo (Pastura Lignificada)',
      shortLabel: 'Subpastoreo',
      badgeClass: 'prv-badge-subpastoreo',
      color: '#d97706',
      textColor: '#92400e',
      bgColor: '#fef3c7',
      borderColor: '#fcd34d',
      dotEmoji: '🟠',
      tagline: `${diasDescanso} días de reposo (>35% exceso)`,
      description: 'La pastura ha superado excesivamente su Punto Óptimo de Reposo. Se ha lignificado, con aumento de fibra neutro detergente y caída drástica de proteína cruda (<7%).',
      recomendacion: '¡Pastoreo urgente de limpieza con lote repasador o despunte! Se recomienda desmalezar o segar para reactivar el rebrote fotosintético vigoroso.'
    };
  }

  // 2. Punto Óptimo de Reposo
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

  // 3. En Descanso y Recuperación
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

  // Proyección de fecha y hora sugerida de cambio de potrero (FECHA DINÁMICA REAL)
  const ahora = new Date();
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
  if (pesoFrescoKgM2 >= 2.5) calidadForraje = 'Excelente';
  else if (pesoFrescoKgM2 >= 1.5) calidadForraje = 'Buena';
  else if (pesoFrescoKgM2 >= 1.0) calidadForraje = 'Regular';
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
