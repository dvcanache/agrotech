import { KpiCardData, ChartConfig } from '../../types/chart';

export const KPI_CARDS: KpiCardData[] = [
  {
    value: "2,899 kg",
    subtitle: "Promedio diario Última Lactancia",
    iconType: 'milk-bucket'
  },
  {
    value: "0,503 kg",
    subtitle: "Ganancia global de peso Hembras",
    iconType: 'scale-female'
  },
  {
    value: "0,335 kg",
    subtitle: "Ganancia global de peso Machos",
    iconType: 'scale-male'
  },
  {
    value: "0,211 kg",
    subtitle: "Ganancia global de peso Maute",
    iconType: 'weight-maute'
  }
];

export const CHART_1_INVENTARIO: ChartConfig = {
  title: "Inventario Actual",
  centerLabel: "Semovientes",
  centerValue: 45,
  labels: ["Becerra", "Mauta", "Novilla", "Vaca", "Becerro", "Maute", "Toro"],
  data: [17, 7, 3, 2, 8, 5, 3],
  colors: [
    "#74c69d", // Becerra (37.8%) - Mint Green
    "#b7e4c7", // Mauta (15.6%) - Light Mint
    "#d8f3dc", // Novilla (6.7%) - Pale Teal/Green
    "#5c3d2e", // Vaca (4.4%) - Dark Brown
    "#1b4332", // Becerro (17.8%) - Dark Forest Green
    "#2d6a4f", // Maute (11.1%) - Medium Forest Green
    "#40916c"  // Toro (6.7%) - Medium Green
  ]
};

export const CHART_2_REPRODUCTIVA: ChartConfig = {
  title: "Situación reproductiva actual",
  centerLabel: "Vientres",
  centerValue: 20,
  labels: ["Vacía", "Preñada", "En espera"],
  data: [2, 15, 3],
  colors: [
    "#40916c", // Vacía (10.0%) - Medium Green
    "#1b4332", // Preñada (75.0%) - Dark Forest Green
    "#74c69d"  // En espera (15.0%) - Mint Green
  ]
};

export const CHART_3_PRODUCTIVA: ChartConfig = {
  title: "Situación productiva actual",
  centerLabel: "Vacas",
  centerValue: 17,
  labels: ["Seca", "Ordeño", "Criando"],
  data: [6, 7, 4],
  colors: [
    "#52b788", // Seca (35.3%) - Light Medium Green
    "#2d6a4f", // Ordeño (41.2%) - Medium Forest Green
    "#1b4332"  // Criando (23.5%) - Dark Forest Green
  ]
};
