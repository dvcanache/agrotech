import { EspecieAnimal } from '../../../types/animal';

export interface NeonatalValidation {
  valido: boolean;
  nivelAlerta: 'Normal' | 'Advertencia' | 'Critico';
  mensaje: string;
  esMacrosomia: boolean;
  riesgoDistociaPrimipara: boolean;
}

export function validarPesoNacimiento(
  pesoKg: number,
  especie: EspecieAnimal,
  raza: string,
  esPrimipara: boolean,
  pesoMadreKg?: number
): NeonatalValidation {
  const RANGOS: Record<string, { min: number; max: number; umbralMacrosomia: number }> = {
    'Bovinos-Cebuino': { min: 18, max: 48, umbralMacrosomia: 38 },
    'Bovinos-Europeo': { min: 24, max: 55, umbralMacrosomia: 43 },
    'Bovinos-Carora': { min: 22, max: 50, umbralMacrosomia: 40 },
    'Búfalos': { min: 20, max: 52, umbralMacrosomia: 42 },
    'Caprinos': { min: 1.5, max: 5.5, umbralMacrosomia: 4.8 },
    'Ovinos': { min: 1.5, max: 6.0, umbralMacrosomia: 5.0 },
    'Porcinos': { min: 0.5, max: 2.5, umbralMacrosomia: 2.2 },
    'Equinos': { min: 25, max: 65, umbralMacrosomia: 54 }
  };

  let key = especie as string;
  if (especie === 'Bovinos') {
    if (raza.includes('Brahman') || raza.includes('Gyr') || raza.includes('Nelore') || raza.includes('Cebu') || raza.includes('Cebú')) key = 'Bovinos-Cebuino';
    else if (raza.includes('Carora')) key = 'Bovinos-Carora';
    else key = 'Bovinos-Europeo';
  }

  const config = RANGOS[key] || { min: 15, max: 55, umbralMacrosomia: 42 };

  if (especie === 'Porcinos' && pesoKg < 0.8) {
    return {
      valido: true,
      nivelAlerta: 'Critico',
      mensaje: '⚠️ LECHÓN HIPOTRÓFICO (< 800 g): Alto riesgo de mortalidad neonatal e hipotermia (RCIU). Requiere calostrado asistido inmediato.',
      esMacrosomia: false,
      riesgoDistociaPrimipara: false
    };
  }

  if (pesoKg < config.min || pesoKg > config.max) {
    return {
      valido: false,
      nivelAlerta: 'Critico',
      mensaje: `⛔ PESO FUERA DE RANGO BIOLÓGICO: ${pesoKg} kg no es admisible para ${especie} (${raza}). Rango permitido: ${config.min} a ${config.max} kg.`,
      esMacrosomia: false,
      riesgoDistociaPrimipara: false
    };
  }

  const esMacrosomia = pesoKg >= config.umbralMacrosomia;
  const riesgoDistocia = esPrimipara && (esMacrosomia || (pesoMadreKg ? (pesoKg / pesoMadreKg) > 0.085 : pesoKg >= config.umbralMacrosomia - 2));

  if (riesgoDistocia) {
    return {
      valido: true,
      nivelAlerta: 'Critico',
      mensaje: `⚠️ ALERTA OBSTÉTRICA: Macrosomía fetal detectada (${pesoKg} kg) en Novilla Primípara. Riesgo severo de desproporción feto-pélvica y distocia materna.`,
      esMacrosomia: true,
      riesgoDistociaPrimipara: true
    };
  }

  return {
    valido: true,
    nivelAlerta: 'Normal',
    mensaje: '✓ Peso neonatal dentro de los límites zootécnicos óptimos.',
    esMacrosomia: false,
    riesgoDistociaPrimipara: false
  };
}
