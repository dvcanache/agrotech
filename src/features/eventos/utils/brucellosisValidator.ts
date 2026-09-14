import { Animal } from '../../../types/animal';

export interface BrucellosisValidationResult {
  isValid: boolean;
  isBlocker: boolean;
  warningTitle?: string;
  errorMessage?: string;
}

export function validateBrucellosisVaccination(
  animal: Animal,
  biologicalType: string // 'Cepa 19' | 'RB51'
): BrucellosisValidationResult {
  const isBovineOrBuffalo = animal.especie === 'Bovinos' || animal.especie === 'Búfalos';
  if (!isBovineOrBuffalo) return { isValid: true, isBlocker: false };

  // 1. BLOQUEO ABSOLUTO EN MACHOS
  const isMale = animal.sexo === 'Macho' || 
                 ['Toro', 'Becerro', 'Mauto', 'Novillo', 'Padrote', 'Bucerro'].includes(animal.categoria);
  if (isMale) {
    return {
      isValid: false,
      isBlocker: true,
      warningTitle: '⛔ CONTRAINDICACIÓN ZOOSANITARIA ABSOLUTA: MACHO',
      errorMessage: `Prohibida la vacunación contra Brucelosis en machos (${animal.practico}). Causa orquitis necrosante, epididimitis, infertilidad permanente y excreción de Brucella en semen.`
    };
  }

  // 2. CÁLCULO DE EDAD EN MESES
  let edadMeses = 0;
  if (animal.fechaNacimiento) {
    const birth = new Date(animal.fechaNacimiento);
    const now = new Date();
    edadMeses = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  } else if (animal.edad) {
    const match = animal.edad.match(/(\d+)/);
    edadMeses = match ? parseInt(match[1], 10) : 12;
  }

  // 3. BLOQUEO / ADVERTENCIA EN HEMBRAS ADULTAS Y GESTANTES
  const isPregnant = animal.estatusReproductivo?.toLowerCase().includes('preñada') || 
                     animal.estatusReproductivo?.toLowerCase().includes('gestante');

  if (biologicalType.includes('Cepa 19')) {
    if (edadMeses < 3 || edadMeses > 8) {
      return {
        isValid: false,
        isBlocker: true,
        warningTitle: '⛔ BLOQUEO SANITARIO: EDAD NO PERMITIDA (CEPA 19)',
        errorMessage: `La Cepa 19 solo se autoriza en terneras de 3 a 8 meses. La hembra ${animal.practico} tiene ~${edadMeses} meses. En adultas induce títulos falso-positivos persistentes y abortos (sacrificio obligatorio).`
      };
    }
  }

  if (isPregnant) {
    return {
      isValid: false,
      isBlocker: true,
      warningTitle: '⛔ BLOQUEO SANITARIO: HEMBRA GESTANTE',
      errorMessage: `Contraindicado vacunar hembras gestantes contra Brucelosis. Alto riesgo de placentitis necrosante y aborto inducido.`
    };
  }

  return { isValid: true, isBlocker: false };
}
