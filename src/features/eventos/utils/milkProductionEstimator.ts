export interface OrdeñoDiarioInput {
  pesajeAmKg?: number;
  pesajePmKg?: number;
  intervaloHorasNoche?: number; // Default: 14h
  conApoyoTernero?: boolean;
  edadTerneroMeses?: number;
}

export function estimarProduccionDiariaTotal(input: OrdeñoDiarioInput): {
  lecheBaldeTotalKg: number;
  lecheResidualTerneroKg: number;
  produccionBiologicaTotalKg: number;
  metodoEstimacion: 'Bidiario Medido' | 'ICAR AT4 Mañana (58%)' | 'ICAR AT4 Tarde (42%)';
} {
  const { pesajeAmKg = 0, pesajePmKg = 0, intervaloHorasNoche = 14, conApoyoTernero = false, edadTerneroMeses = 2 } = input;

  let lecheBalde = 0;
  let metodo: 'Bidiario Medido' | 'ICAR AT4 Mañana (58%)' | 'ICAR AT4 Tarde (42%)' = 'Bidiario Medido';

  if (pesajeAmKg > 0 && pesajePmKg > 0) {
    lecheBalde = pesajeAmKg + pesajePmKg;
  } else if (pesajeAmKg > 0) {
    const factorAm = intervaloHorasNoche === 14 ? 0.58 : (intervaloHorasNoche / 24);
    lecheBalde = pesajeAmKg / factorAm;
    metodo = 'ICAR AT4 Mañana (58%)';
  } else if (pesajePmKg > 0) {
    const factorPm = intervaloHorasNoche === 14 ? 0.42 : ((24 - intervaloHorasNoche) / 24);
    lecheBalde = pesajePmKg / factorPm;
    metodo = 'ICAR AT4 Tarde (42%)';
  }

  // Estimación de Leche Residual para el Ternero
  let lecheTernero = 0;
  if (conApoyoTernero) {
    if (edadTerneroMeses <= 1) lecheTernero = 3.0;
    else if (edadTerneroMeses <= 3) lecheTernero = 2.5;
    else if (edadTerneroMeses <= 6) lecheTernero = 2.0;
    else lecheTernero = 1.2;
  }

  const lecheTerneroKg = Math.round((lecheTernero * 1.032) * 10) / 10;
  const lecheBaldeKg = Math.round(lecheBalde * 10) / 10;

  return {
    lecheBaldeTotalKg: lecheBaldeKg,
    lecheResidualTerneroKg: lecheTerneroKg,
    produccionBiologicaTotalKg: Math.round((lecheBaldeKg + lecheTerneroKg) * 10) / 10,
    metodoEstimacion: metodo
  };
}
