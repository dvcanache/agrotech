/**
 * Motor de Alertas Zootécnicas y Reproductivas Multiespecie
 * AgroGan / AgroTech v2.0 - Parche 17 de AUDITORIA_Y_CORRECCIONES_EXPERTOS_AGROGAN.md
 */

export interface ParametrosAlertasEspecie {
  diasAvisoPreparto: number;
  diasPostServicioDiagnosticoMin: number;
  diasPostServicioDiagnosticoMax: number;
  metodoDiagnosticoRecomendado: string;
  aplicaSecadoMamario: boolean;
  diasAvisoPresecado?: number;
  umbralCelosRepetidos: number;
  viasControlInocuidad: ('leche' | 'carne' | 'huevo')[];
}

export const MATRIZ_ALERTAS_POR_ESPECIE: Record<string, ParametrosAlertasEspecie> = {
  'Bovinos': {
    diasAvisoPreparto: 15,
    diasPostServicioDiagnosticoMin: 28,
    diasPostServicioDiagnosticoMax: 45,
    metodoDiagnosticoRecomendado: 'Ecografía B-mode (28-35d) o Palpación transrectal (35-45d)',
    aplicaSecadoMamario: true,
    diasAvisoPresecado: 15,
    umbralCelosRepetidos: 3,
    viasControlInocuidad: ['leche', 'carne']
  },
  'Búfalos': {
    diasAvisoPreparto: 20,
    diasPostServicioDiagnosticoMin: 30,
    diasPostServicioDiagnosticoMax: 45,
    metodoDiagnosticoRecomendado: 'Ecografía transrectal (30-40d) o Palpación (40-50d)',
    aplicaSecadoMamario: true,
    diasAvisoPresecado: 15,
    umbralCelosRepetidos: 3,
    viasControlInocuidad: ['leche', 'carne']
  },
  'Equinos': {
    diasAvisoPreparto: 30, // Habitualización a paridero y refuerzo vacunal tétanos/influenza
    diasPostServicioDiagnosticoMin: 14, // OBLIGATORIO: diagnóstico precoz y reducción de gemelos
    diasPostServicioDiagnosticoMax: 16, // Antes de la fijación embrionaria
    metodoDiagnosticoRecomendado: 'Ecografía transrectal día 14-16 (crítico: descarte/reducción gemelar)',
    aplicaSecadoMamario: false, // Las yeguas no tienen terapia de secado intramamaria
    umbralCelosRepetidos: 3,
    viasControlInocuidad: ['carne']
  },
  'Porcinos': {
    diasAvisoPreparto: 5, // Cerdas entran a maternidad a los 107-109 días (4-7d preparto)
    diasPostServicioDiagnosticoMin: 21,
    diasPostServicioDiagnosticoMax: 28,
    metodoDiagnosticoRecomendado: 'Ultrasonido sectorial en tiempo real a 21-28 días',
    aplicaSecadoMamario: false, // Destete de camada a los 21-28 días
    umbralCelosRepetidos: 2, // En porcinocultura 2 fallos ya es descarte o revisión profunda
    viasControlInocuidad: ['carne']
  },
  'Caprinos': {
    diasAvisoPreparto: 10,
    diasPostServicioDiagnosticoMin: 35,
    diasPostServicioDiagnosticoMax: 50,
    metodoDiagnosticoRecomendado: 'Ultrasonografía transabdominal o transrectal (35-45d)',
    aplicaSecadoMamario: true, // Cabras lecheras comerciales se secan 60d preparto
    diasAvisoPresecado: 10,
    umbralCelosRepetidos: 3,
    viasControlInocuidad: ['leche', 'carne']
  },
  'Ovinos': {
    diasAvisoPreparto: 10,
    diasPostServicioDiagnosticoMin: 35,
    diasPostServicioDiagnosticoMax: 50,
    metodoDiagnosticoRecomendado: 'Ultrasonografía transabdominal (35-50d)',
    aplicaSecadoMamario: false,
    umbralCelosRepetidos: 3,
    viasControlInocuidad: ['carne']
  },
  'Aves de corral': {
    diasAvisoPreparto: 0,
    diasPostServicioDiagnosticoMin: 7, // Ovoscopía día 7
    diasPostServicioDiagnosticoMax: 14, // Ovoscopía día 14
    metodoDiagnosticoRecomendado: 'Ovoscopía con ovoscopio translúcido a días 7 y 14 de incubación',
    aplicaSecadoMamario: false,
    umbralCelosRepetidos: 0,
    viasControlInocuidad: ['huevo', 'carne']
  }
};

export function getParametrosAlertasPorEspecie(especie: string): ParametrosAlertasEspecie {
  return MATRIZ_ALERTAS_POR_ESPECIE[especie] || MATRIZ_ALERTAS_POR_ESPECIE['Bovinos'];
}
