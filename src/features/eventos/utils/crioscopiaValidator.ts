import { EspecieAnimal } from '../../../types/animal';

export interface CrioscopiaResult {
  puntoCrioscopico: number;
  estado: 'Conforme' | 'Aguado Sospechoso' | 'Aguado Confirmado';
  porcentajeAguaAnadida: number;
  alertaBloqueoTanque: boolean;
  mensaje: string;
}

export function evaluarPuntoCrioscopico(
  puntoCrioscopico: number,
  especie: EspecieAnimal
): CrioscopiaResult {
  const PC_BASE: Record<string, number> = {
    'Bovinos': -0.540,
    'Búfalos': -0.550,
    'Caprinos': -0.565
  };

  const UMBRAL_AGUADO: Record<string, number> = {
    'Bovinos': -0.530,
    'Búfalos': -0.538,
    'Caprinos': -0.550
  };

  const base = PC_BASE[especie] || -0.540;
  const umbral = UMBRAL_AGUADO[especie] || -0.530;

  if (puntoCrioscopico > umbral) {
    const porcAgua = Math.max(0, Math.round((((base - puntoCrioscopico) / base) * 100) * 10) / 10);
    const isSevere = porcAgua >= 5.0;
    return {
      puntoCrioscopico,
      estado: isSevere ? 'Aguado Confirmado' : 'Aguado Sospechoso',
      porcentajeAguaAnadida: porcAgua,
      alertaBloqueoTanque: isSevere,
      mensaje: `ALERTA DE INOCUIDAD: Punto crioscópico de ${puntoCrioscopico}°C excede el límite normativo de ${umbral}°C. Estimado ~${porcAgua}% de agua añadida.`
    };
  }

  return {
    puntoCrioscopico,
    estado: 'Conforme',
    porcentajeAguaAnadida: 0,
    alertaBloqueoTanque: false,
    mensaje: 'Punto crioscópico conforme a estándares fisicoquímicos oficiales.'
  };
}
