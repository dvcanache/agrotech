export interface KpiCardData {
  value: string;
  subtitle: string;
  iconType: 'milk-bucket' | 'scale-female' | 'scale-male' | 'weight-maute';
}

export interface LegendItem {
  label: string;
  color: string;
}

export interface ChartConfig {
  title: string;
  centerLabel: string;
  centerValue: number;
  labels: string[];
  data: number[];
  colors: string[];
  legend?: LegendItem[];
}
