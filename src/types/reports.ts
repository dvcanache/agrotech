export type ReportIconType =
  | 'gestion'
  | 'animales'
  | 'historicos'
  | 'multirebanos'
  | 'bovinos'
  | 'aves'
  | 'porcinos'
  | 'bufalos'
  | 'caprinos'
  | 'equinos';

export type ReportSpecies = 'todos' | 'bovinos' | 'aves' | 'porcinos' | 'bufalos' | 'caprinos' | 'equinos';

export interface ReportCategory {
  titulo: string;
  iconoType: ReportIconType;
  especie?: ReportSpecies;
  subtitulo?: string;
  badge?: string;
  reportes: string[];
}

