import { EspecieAnimal } from '../../../types/animal';

export function getBiologicalGestationDays(especie: EspecieAnimal, razaOComposicion?: string): number {
  if (especie === 'Equinos') return 340;
  if (especie === 'Búfalos') return 312;
  if (especie === 'Caprinos') return 150;
  if (especie === 'Porcinos') return 114;
  if (especie === 'Aves de corral') return 21;

  if (especie === 'Bovinos') {
    const text = (razaOComposicion || '').toLowerCase();
    const isZebu = text.includes('brahman') || text.includes('nelore') || 
                   text.includes('guzer') || text.includes('gyr') || 
                   text.includes('ceb') || text.includes('indicus');
    const isCross = text.includes('girolando') || text.includes('f1') || 
                    text.includes('mestiz') || text.includes('carora x brahman');

    if (isZebu) return 292;   // Bos indicus: 290 a 295 días
    if (isCross) return 287;  // Cruces F1 / Sintéticas
    return 283;               // Bos taurus: 278 a 283 días
  }

  return 283;
}

export function calculateEstimatedCalvingDate(
  serviceDateStr: string,
  especie: EspecieAnimal,
  raza?: string
): { fppDate: Date; fppStr: string; gestationDays: number } {
  const serviceDate = new Date(serviceDateStr);
  const gestationDays = getBiologicalGestationDays(especie, raza);
  
  const fpp = new Date(serviceDate);
  fpp.setDate(fpp.getDate() + gestationDays);

  return {
    fppDate: fpp,
    fppStr: fpp.toLocaleDateString('es-ES'),
    gestationDays
  };
}
