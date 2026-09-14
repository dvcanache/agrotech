export type MetodoDiagnosticoPrenez = 'PalpacionTransrectal' | 'EcografiaModoB' | 'Doppler' | 'LaboratorioPAGs';

export function validatePregnancyExamTiming(
  diasPostServicio: number,
  metodo: MetodoDiagnosticoPrenez | string
): { isSafe: boolean; warning?: string; blocker?: boolean } {
  const isPalpacion = metodo === 'PalpacionTransrectal' || metodo.toLowerCase().includes('palpaci');
  const isEcografia = metodo === 'EcografiaModoB' || metodo.toLowerCase().includes('ecograf') || metodo.toLowerCase().includes('ultrason');

  if (isPalpacion && diasPostServicio < 35) {
    return {
      isSafe: false,
      blocker: true,
      warning: `⛔ CONTRAINDICACIÓN MÉDICA: La palpación transrectal manual antes de los 35 días (actual: ${diasPostServicio}d) está estrictamente desaconsejada por riesgo de rotura de la vesícula amniótica y mortalidad embrionaria iatrogénica.`
    };
  }

  if (isEcografia && diasPostServicio < 26) {
    return {
      isSafe: false,
      blocker: false,
      warning: `⚠️ ALERTA DE PRECOCIDAD: Ecografía a los ${diasPostServicio} días puede generar falsos negativos. La confirmación de viabilidad fetal por latido cardíaco se alcanza en el día 28-30.`
    };
  }

  return { isSafe: true };
}
