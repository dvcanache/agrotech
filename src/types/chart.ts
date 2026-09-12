export type KpiIconType =
  | 'milk-bucket'
  | 'scale-female'
  | 'scale-male'
  | 'weight-maute'
  | 'census'
  | 'species'
  | 'egg'
  | 'meat'
  | 'pig'
  | 'baby'
  | 'feather'
  | 'wheat'
  | 'horse'
  | 'activity'
  | 'trending-up'
  | 'check-circle';

export interface KpiCardData {
  value: string;
  subtitle: string;
  iconType: KpiIconType;
  badge?: string;
  alert?: boolean;
}

export interface LegendItem {
  label: string;
  color: string;
}

export interface ChartConfig {
  title: string;
  centerLabel: string;
  centerValue: number | string;
  labels: string[];
  data: number[];
  colors: string[];
  legend?: LegendItem[];
}
