/**
 * Parche 16: Motor de Modulación Estacional Forrajera e Infraestructura Hidráulica
 * AgroGan NextGen — Pastoreo Racional Voisin (PRV) y Zootecnia de Precisión
 * 
 * Basado en las directrices de la Auditoría Maestro Técnico-Científica AgroGan v2.0.
 * Resuelve:
 * - AGR-11: Modulación estacional de la oferta forrajera (Invierno/Lluvioso vs Sequía/Estiaje).
 * - AGR-12: Validación de requerimientos hídricos (80-120 L/UGG/d), caudal de recarga y distancia al abrevadero.
 */

export type EstacionClimatica = 'lluviosa' | 'transicion' | 'seca';

export interface SeasonalForageModulation {
  factorAforoBiomasa: number;
  factorPorcentajeMS: number;
  factorDiasReposo: number;
  pcEstimadaPorc: number;
}

/**
 * Factores de modulación climática para el trópico estacional
 * - Lluviosa (Invierno): Tasa de crecimiento 45-85 kg MS/ha/día, 80% de oferta anual, MS 18-22%, PC 11.5%
 * - Transición: Tasa intermedia, PC 8.5%
 * - Seca (Estiaje/Verano): Caída de biomasa (-70%), MS sube a 35-40%, PC cae a 5.0%
 */
export const MODULACION_ESTACIONAL: Record<EstacionClimatica, SeasonalForageModulation> = {
  'lluviosa': { factorAforoBiomasa: 1.0, factorPorcentajeMS: 1.0, factorDiasReposo: 1.0, pcEstimadaPorc: 11.5 },
  'transicion': { factorAforoBiomasa: 0.65, factorPorcentajeMS: 1.15, factorDiasReposo: 1.4, pcEstimadaPorc: 8.5 },
  'seca': { factorAforoBiomasa: 0.30, factorPorcentajeMS: 1.45, factorDiasReposo: 2.2, pcEstimadaPorc: 5.0 }
};

export interface InfraestructuraHidricaValidation {
  demandaAguaTotalLitros: number;
  capacidadReservaLitros: number;
  caudalLpmRequerido: number;
  caudalLpmActual: number;
  distanciaMetros: number;
  alertaHidrica: 'Optima' | 'Capacidad Insuficiente' | 'Caudal Deficiente' | 'Caminata Excesiva';
  detalles: string;
}

/**
 * Validador Zootécnico e Hidráulico de Abrevaderos y Red de Agua en PRV
 * 
 * @param uggPresentes Cantidad de Unidades Gran Ganado (UGG) en el potrero
 * @param esLecheria Indica si el lote está en producción láctea
 * @param litrosLechePromedio Producción diaria promedio por vaca (L/vaca/día)
 * @param volumenBebederoLitros Capacidad de almacenamiento del bebedero en potrero
 * @param caudalRecargaLpm Caudal de recarga de la tubería/red en Litros por minuto (L/min)
 * @param distanciaMaximaAguaM Distancia máxima de caminata desde el punto más lejano al agua (metros)
 */
export function validarInfraestructuraHidricaPotrero(
  uggPresentes: number,
  esLecheria: boolean,
  litrosLechePromedio: number,
  volumenBebederoLitros: number,
  caudalRecargaLpm: number,
  distanciaMaximaAguaM: number
): InfraestructuraHidricaValidation {
  // 1. Demanda hídrica
  // Mantenimiento en trópico cálido (T > 28°C): 65 L/UGG/d
  const lpmMantenimiento = uggPresentes * 65.0;
  // Demanda de producción láctea: ~2.8 L agua por cada litro de leche producido
  const lpmProduccion = esLecheria ? (uggPresentes * litrosLechePromedio * 2.8) : 0;
  const demandaTotal = Math.round(lpmMantenimiento + lpmProduccion);

  // 2. Caudal pico en PRV (45% del agua diaria consumida en 90 min post-ordeño y cenit)
  const litrosPico = demandaTotal * 0.45;
  const caudalRequerido = Math.round((litrosPico / 90) * 10) / 10;

  // 3. Verificaciones de infraestructura
  let alerta: InfraestructuraHidricaValidation['alertaHidrica'] = 'Optima';
  let detalles = 'Infraestructura hidráulica adecuada para confort animal y máxima producción.';

  if (distanciaMaximaAguaM > 350) {
    alerta = 'Caminata Excesiva';
    detalles = `Distancia de ${distanciaMaximaAguaM}m supera el límite PRV de 300m. Induce gasto energético del 15-20% y desfertilización del potrero por deyecciones en callejones.`;
  } else if (volumenBebederoLitros < demandaTotal * 0.20) {
    alerta = 'Capacidad Insuficiente';
    detalles = `Reserva en bebedero (${volumenBebederoLitros} L) menor al 20% de la demanda diaria (${Math.round(demandaTotal * 0.2)} L). Riesgo de desabasto en horas cenitales de alta demanda.`;
  } else if (caudalRecargaLpm < caudalRequerido) {
    alerta = 'Caudal Deficiente';
    detalles = `Caudal de red (${caudalRecargaLpm} L/min) inferior al caudal pico requerido (${caudalRequerido} L/min). Provoca deshidratación y caída de 2-3 L/d en vacas subordinadas.`;
  }

  return {
    demandaAguaTotalLitros: demandaTotal,
    capacidadReservaLitros: volumenBebederoLitros,
    caudalLpmRequerido: caudalRequerido,
    caudalLpmActual: caudalRecargaLpm,
    distanciaMetros: distanciaMaximaAguaM,
    alertaHidrica: alerta,
    detalles
  };
}

/**
 * Aplica los coeficientes de modulación estacional a un aforo base
 */
export function aplicarModulacionEstacional(
  aforoBaseKgM2: number,
  porcentajeMSBase: number,
  diasReposoBase: number,
  estacion: EstacionClimatica
): {
  aforoModuladoKgM2: number;
  porcentajeMSModulado: number;
  diasReposoModulados: number;
  pcEstimadaPorc: number;
} {
  const mod = MODULACION_ESTACIONAL[estacion];
  return {
    aforoModuladoKgM2: Number((aforoBaseKgM2 * mod.factorAforoBiomasa).toFixed(2)),
    porcentajeMSModulado: Math.round(porcentajeMSBase * mod.factorPorcentajeMS),
    diasReposoModulados: Math.round(diasReposoBase * mod.factorDiasReposo),
    pcEstimadaPorc: mod.pcEstimadaPorc
  };
}
