export type ReportIconType = 'gestion' | 'animales' | 'historicos' | 'multirebanos';

export interface ReportCategory {
  titulo: string;
  iconoType: ReportIconType;
  reportes: string[];
}
