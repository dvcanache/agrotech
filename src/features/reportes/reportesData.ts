import { ReportCategory } from '../../types/reports';

export const REPORT_CATEGORIES: ReportCategory[] = [
  {
    titulo: "Gestión",
    iconoType: "gestion",
    reportes: ["Inventarios", "Movimientos", "Distribución normal", "Técnicos", "Reproductores"]
  },
  {
    titulo: "Animales",
    iconoType: "animales",
    reportes: [
      "Vientres",
      "Próximas a secar",
      "Próximas a parir",
      "Próximas a revisar",
      "Animales secos",
      "Animales lactando",
      "Animales criando",
      "No Vientres"
    ]
  },
  {
    titulo: "Históricos",
    iconoType: "historicos",
    reportes: [
      "Historia de reproducciones",
      "Historia de lactancias",
      "Historia de pesajes de leche",
      "Historia de crecimientos"
    ]
  },
  {
    titulo: "Multirebaños",
    iconoType: "multirebanos",
    reportes: [
      "Inventario multirebaño",
      "Situación reproductiva actual",
      "Distribución por preñez",
      "Situación productiva actual",
      "Transacciones",
      "Producciones diarias"
    ]
  }
];
