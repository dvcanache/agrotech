export interface PuerperalConditions {
  tipoParto: 'Eutocico' | 'Distocico' | 'Cesarea' | string;
  retencionPlacenta: boolean; // > 12 horas
  horasRetencionPlacenta?: number;
  metritisPuerperal: boolean;
}

export function calculateDynamicDEV(baseDEV: number, conditions: PuerperalConditions): {
  dynamicDEV: number;
  diasAdicionales: number;
  requiereAltaGinecologica: boolean;
  protocoloRecomendado: string;
} {
  let extraDays = 0;
  let altaRequired = false;
  const protocolos: string[] = [];

  if (conditions.retencionPlacenta) {
    extraDays += 20;
    altaRequired = true;
    protocolos.push('Protocolo de evacuación uterina (PGF2alpha) y antimicrobiano sistémico no irritante (Ceftiofur). PROHIBIDO desprendimiento manual traumático de cotiledones.');
  }

  const isDistocico = conditions.tipoParto === 'Distocico' || conditions.tipoParto.toLowerCase().includes('distoc') || conditions.tipoParto.toLowerCase().includes('distóc');
  const isCesarea = conditions.tipoParto === 'Cesarea' || conditions.tipoParto.toLowerCase().includes('cesar') || conditions.tipoParto.toLowerCase().includes('cesár');

  if (isDistocico) {
    extraDays += 15;
    altaRequired = true;
    protocolos.push('Reposo de canal blando de parto y control de laceraciones vaginales.');
  } else if (isCesarea) {
    extraDays += 30;
    altaRequired = true;
    protocolos.push('Cicatrización de laparotomía e histerorrafia.');
  }

  if (conditions.metritisPuerperal) {
    extraDays += 25;
    altaRequired = true;
    protocolos.push('Lavado uterino si hay contenido séptico y evaluación ecográfica de cuernos uterinos.');
  }

  const finalDEV = baseDEV + extraDays;

  return {
    dynamicDEV: finalDEV,
    diasAdicionales: extraDays,
    requiereAltaGinecologica: altaRequired,
    protocoloRecomendado: protocolos.join(' | ') || 'Involución uterina fisiológica normal (DEV estándar).'
  };
}
