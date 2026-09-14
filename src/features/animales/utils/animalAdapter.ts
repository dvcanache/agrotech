import { Animal, Animal360, EspecieAnimal, DesgloseRacialItem } from '../../../types/animal';
import { getAnimal360ByPractico } from '../animalesData';

export interface AnimalModalData {
  practico: string;
  unico: string;
  categoria: string;
  estatus: string;
  lote: string;
  especie?: string;
  raza?: string;
  estatusReproductivo?: string;
  estatusProductivo?: string;
  edadAnos?: number;
  partos?: number;
  ultimoParto?: string;
  ultimoServicio?: string;
  reproductor?: string;
  fechaProximoParto?: string;
  fechaProximoSecado?: string;
  diasParida?: number;
  diasSeca?: number;
  pesoKg?: number;
}

/**
 * Deduce la especie zootécnica a partir de categoría, lote o código práctico.
 */
export function inferEspecie(categoria?: string, lote?: string, practico?: string): EspecieAnimal {
  const cat = (categoria || '').toLowerCase();
  const lot = (lote || '').toLowerCase();
  const prk = (practico || '').toLowerCase();

  if (
    cat.includes('cerd') || cat.includes('verraco') || cat.includes('lechón') || cat.includes('lechon') ||
    lot.includes('piara') || lot.includes('coch') || prk.startsWith('por')
  ) {
    return 'Porcinos';
  }
  if (
    cat.includes('cabra') || cat.includes('cabrit') || cat.includes('chivo') ||
    lot.includes('apr') || lot.includes('cab-') || prk.startsWith('cap')
  ) {
    return 'Caprinos';
  }
  if (
    cat.includes('búfal') || cat.includes('bufal') || cat.includes('bubill') || cat.includes('bucerr') ||
    lot.includes('buf') || prk.startsWith('buf')
  ) {
    return 'Búfalos';
  }
  if (
    cat.includes('yegua') || cat.includes('potr') || cat.includes('caballo') || cat.includes('padrillo') ||
    lot.includes('cab-01') || prk.startsWith('equ')
  ) {
    return 'Equinos';
  }
  if (
    cat.includes('gallin') || cat.includes('pollo') || cat.includes('gallo') || cat.includes('pava') ||
    cat.includes('pavo') || cat.includes('pata') || cat.includes('pato') || cat.includes('ave') ||
    lot.includes('galp') || prk.startsWith('ave')
  ) {
    return 'Aves de corral';
  }
  return 'Bovinos';
}

/**
 * Deduce la raza real para evitar la asignación por defecto a Pardo Suizo x Brahman.
 */
export function inferRaza(especie: EspecieAnimal, categoria?: string, reproductor?: string, composicion?: string): string {
  if (composicion && composicion !== 'Pardo Suizo 50% x Brahman 50%' && composicion !== 'Raza Seleccionada') {
    return composicion;
  }

  const rep = (reproductor || '').toLowerCase();
  const cat = (categoria || '').toLowerCase();

  if (especie === 'Porcinos') {
    if (rep.includes('landrace')) return 'Landrace Puro';
    if (rep.includes('pietrain')) return 'Pietrain Sintético';
    if (rep.includes('duroc')) return 'Duroc Jersey';
    if (rep.includes('large white')) return 'Large White F1';
    return 'Landrace 50% x Large White 50%';
  }
  if (especie === 'Caprinos') {
    if (rep.includes('saanen')) return 'Saanen Lechera';
    if (rep.includes('alpino')) return 'Alpino Francés';
    if (rep.includes('nubia') || rep.includes('anglonubiana')) return 'Anglo Nubiana';
    if (rep.includes('toggenburg')) return 'Toggenburg';
    return 'Saanen 100% Lechera';
  }
  if (especie === 'Búfalos') {
    if (rep.includes('mediterr')) return 'Mediterráneo Puro';
    if (rep.includes('murrah')) return 'Búfalo Murrah';
    if (rep.includes('jafrabadi')) return 'Jafarabadi';
    return 'Mediterráneo 75% x Murrah 25%';
  }
  if (especie === 'Equinos') {
    if (rep.includes('cuarto de milla')) return 'Cuarto de Milla';
    if (rep.includes('criollo')) return 'Criollo Venezolano';
    if (rep.includes('pura sangre') || rep.includes('psi')) return 'Pura Sangre de Carrera';
    if (rep.includes('arabe') || rep.includes('árabe')) return 'Árabe';
    if (rep.includes('paso fino')) return 'Paso Fino';
    return 'Cuarto de Milla de Trabajo';
  }
  if (especie === 'Aves de corral') {
    if (cat.includes('fina') || cat.includes('gallo')) return 'Combatiente Español / Shamo';
    return 'Lohmann Brown Classic';
  }

  // Bovinos
  if (rep.includes('gyr')) return 'Gyr Lechero';
  if (rep.includes('brahman')) return 'Brahman Rojo / Blanco';
  if (rep.includes('carora')) return 'Carora Pura';
  if (rep.includes('holstein')) return 'Holstein Friesian';
  if (rep.includes('pardo')) return 'Pardo Suizo';
  if (rep.includes('criollo')) return 'Criollo Limonero';
  return 'Mestizo Doble Propósito';
}

function getDesgloseRacialForSpecies(especie: EspecieAnimal, raza: string): DesgloseRacialItem[] {
  if (especie === 'Porcinos') {
    return [
      { raza: 'Landrace', porcentaje: 60, colorHex: '#ec4899' },
      { raza: 'Large White', porcentaje: 40, colorHex: '#f472b6' }
    ];
  }
  if (especie === 'Caprinos') {
    return [
      { raza: 'Saanen', porcentaje: 85, colorHex: '#10b981' },
      { raza: 'Alpino Francés', porcentaje: 15, colorHex: '#34d399' }
    ];
  }
  if (especie === 'Búfalos') {
    return [
      { raza: 'Mediterráneo', porcentaje: 70, colorHex: '#475569' },
      { raza: 'Murrah', porcentaje: 30, colorHex: '#1e293b' }
    ];
  }
  if (especie === 'Equinos') {
    return [
      { raza: 'Cuarto de Milla', porcentaje: 100, colorHex: '#b45309' }
    ];
  }
  if (especie === 'Aves de corral') {
    return [
      { raza: 'Lohmann Brown', porcentaje: 100, colorHex: '#ea580c' }
    ];
  }
  // Bovinos
  if (raza.includes('Gyr')) {
    return [{ raza: 'Gyr Lechero', porcentaje: 100, colorHex: '#2563eb' }];
  }
  if (raza.includes('Brahman')) {
    return [{ raza: 'Brahman', porcentaje: 100, colorHex: '#dc2626' }];
  }
  return [
    { raza: 'Pardo Suizo', porcentaje: 50, colorHex: '#854d0e' },
    { raza: 'Brahman', porcentaje: 50, colorHex: '#dc2626' }
  ];
}

function getDefaultWeight(especie: EspecieAnimal): number {
  switch (especie) {
    case 'Aves de corral': return 2.1;
    case 'Porcinos': return 215;
    case 'Caprinos': return 62;
    case 'Equinos': return 465;
    case 'Búfalos': return 585;
    case 'Bovinos': default: return 490;
  }
}

function getDefaultPurpose(especie: EspecieAnimal): string {
  switch (especie) {
    case 'Aves de corral': return 'Postura de Huevos Comerciales (Avícola)';
    case 'Porcinos': return 'Cría y Multiplicación de Lechones (Porcicultura)';
    case 'Caprinos': return 'Producción de Leche y Quesos Caprinos';
    case 'Equinos': return 'Trabajo de Campo, Faena y Genética Equina';
    case 'Búfalos': return 'Doble Propósito Bufalino (Leche A2 / Carne)';
    case 'Bovinos': default: return 'Doble Propósito (Leche y Carne)';
  }
}

/**
 * Adaptador zootécnico integral que construye la Ficha 360 respetando
 * la especie, raza, categoría, estatus y fenotipo biológico real del semoviente.
 */
export function adaptAnimalTo360(
  input: Animal360 | Animal | AnimalModalData | string
): Animal360 {
  if (typeof input === 'string') {
    return getAnimal360ByPractico(input);
  }
  if ('pedigri' in input && (input as Animal360).consanguinidad) {
    return input as Animal360;
  }

  // Base estructural (procedente de getAnimal360ByPractico)
  const base = getAnimal360ByPractico(input.practico);

  const rawEspecie = (input as any).especie;
  const especie: EspecieAnimal = rawEspecie && ['Bovinos', 'Aves de corral', 'Porcinos', 'Búfalos', 'Caprinos', 'Equinos'].includes(rawEspecie)
    ? (rawEspecie as EspecieAnimal)
    : inferEspecie(input.categoria, input.lote, input.practico);

  const categoria = input.categoria || base.categoria;
  const subcategoria = (input as any).subcategoria || categoria;
  const estatus = ((input.estatus as any) || base.estatus);

  const rawRaza = (input as any).raza || (input as any).composicion || (input as any).racial;
  const raza = rawRaza && rawRaza !== 'Pardo Suizo 50% x Brahman 50%' && rawRaza !== 'Raza Seleccionada'
    ? rawRaza
    : inferRaza(especie, categoria, (input as any).reproductor, rawRaza);

  const estatusReproductivo = (input as any).estatusReproductivo || 
    (input as any).situacionReproductivaActual || 
    base.estatusReproductivo;

  const estatusProductivo = (input as any).estatusProductivo || 
    (input as any).situacionProductivaActual || 
    base.estatusProductivo;

  const pesoKg = (input as any).pesoKg || (input as any).ultimoPesoKg || getDefaultWeight(especie);

  const edadAnos = (input as any).edadAnos || base.edadAnos;
  const edadTexto = (input as any).edadAnos ? `${(input as any).edadAnos} Años` : base.edadTexto;

  const ultimoParto = (input as any).ultimoParto || (input as any).ultimoPartoAborto;
  const ultimoServicio = (input as any).ultimoServicio;
  const fechaProximoParto = (input as any).fechaProximoParto || (input as any).proximoParto;

  const desgloseRacial = getDesgloseRacialForSpecies(especie, raza);

  // Alias acorde a especie
  const alias = input.practico === '0001' ? base.alias :
    especie === 'Porcinos' ? `CERDA REPRODUCTORA ${input.practico}` :
    especie === 'Caprinos' ? `CABRA LECHERA ${input.practico}` :
    especie === 'Equinos' ? `YEGUA ${input.practico}` :
    especie === 'Búfalos' ? `BÚFALA ${input.practico}` :
    especie === 'Aves de corral' ? `LOTE DE POSTURA ${input.practico}` :
    `SEMOVIENTE ${input.practico}`;

  const isBipapilar = especie === 'Caprinos' || especie === 'Equinos';

  return {
    ...base,
    practico: input.practico,
    unico: input.unico || base.unico,
    rfid: (input as any).rfid || `982.000123${input.practico.replace(/\D/g, '').padStart(6, '0')}`,
    categoria,
    subcategoria,
    especie,
    estatus,
    estatusReproductivo,
    estatusProductivo,
    raza,
    lote: input.lote || base.lote,
    alias,
    edadAnos,
    edadTexto,
    finalidad: getDefaultPurpose(especie),
    alertaSanitaria: input.practico === '0001' ? base.alertaSanitaria : undefined,
    pesajesAjustados: {
      ...base.pesajesAjustados,
      pesoActualKg: pesoKg
    },
    desgloseRacial,
    pedigri: {
      ...base.pedigri,
      arete: input.practico,
      nombre: alias,
      raza
    },
    kpisReproductivos: {
      ...base.kpisReproductivos,
      totalPartos: (input as any).partos ?? (input as any).numeroParto ?? base.kpisReproductivos.totalPartos,
      fechaUltimoParto: ultimoParto || base.kpisReproductivos.fechaUltimoParto,
      fechaUltimoServicio: ultimoServicio || base.kpisReproductivos.fechaUltimoServicio,
      fechaProximoParto: fechaProximoParto || base.kpisReproductivos.fechaProximoParto,
      diasAbiertos: (input as any).diasParida ?? base.kpisReproductivos.diasAbiertos
    },
    cuartosMamarios: isBipapilar ? {
      AD: { codigo: 'AD', nombre: 'Anterior Derecho', cmt: 'Negativo', estadoClinico: 'Sano' },
      AI: { codigo: 'AI', nombre: 'Anterior Izquierdo', cmt: 'Negativo', estadoClinico: 'Sano' },
      PD: { codigo: 'PD', nombre: 'Posterior Derecho', cmt: 'Negativo', estadoClinico: 'Sano' },
      PI: { codigo: 'PI', nombre: 'Posterior Izquierdo', cmt: 'Negativo', estadoClinico: 'Sano' }
    } : base.cuartosMamarios
  };
}
