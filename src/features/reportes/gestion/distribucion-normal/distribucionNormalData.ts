export interface AnimalZootecnico {
  id: string;
  arete: string;
  nombre: string;
  raza: string;
  categoria: string;
  lote: string;
  sexo: 'Hembra' | 'Macho';
  edadAnos: number;
  valor: number;
  zScore?: number;
  percentil?: number;
  recomendacionGenetica?: 'Descarte Sugerido' | 'Promedio Poblacional' | 'Donadora Élite';
}

export interface ZootechVariableConfig {
  id: string;
  nombre: string;
  subtitulo: string;
  unidad: string;
  esMenorMejor?: boolean; // true para IEP
  descripcion: string;
  valorIdealMin: number;
  valorIdealMax: number;
  paso: number;
}

export const ZOOTECH_VARIABLES: ZootechVariableConfig[] = [
  {
    id: 'peso_destete',
    nombre: 'Peso al Destete (205d)',
    subtitulo: 'Ajuste estandarizado zootécnico a 205 días',
    unidad: 'kg',
    descripcion: 'Evalúa la habilidad materna de la vaca y el potencial de crecimiento pre-destete de los terneros.',
    valorIdealMin: 195,
    valorIdealMax: 260,
    paso: 1
  },
  {
    id: 'produccion_305',
    nombre: 'Producción 305 Días (kg)',
    subtitulo: 'Lactancia proyectada normalizada a 305 días',
    unidad: 'kg',
    descripcion: 'Estima la producción total equivalente por campaña según el modelo biométrico de Wood.',
    valorIdealMin: 3200,
    valorIdealMax: 5000,
    paso: 10
  },
  {
    id: 'gdp',
    nombre: 'Ganancia Diaria de Peso (GDP)',
    subtitulo: 'Velocidad de desarrollo ponderal en g/d',
    unidad: 'g/día',
    descripcion: 'Velocidad de incremento ponderal diario entre pesajes sucesivos en corrales o pastoreo.',
    valorIdealMin: 650,
    valorIdealMax: 1050,
    paso: 5
  },
  {
    id: 'iep',
    nombre: 'Intervalo Entre Partos (IEP)',
    subtitulo: 'Días transcurridos entre partos consecutivos',
    unidad: 'días',
    esMenorMejor: true,
    descripcion: 'Indicador ginecológico maestro de fertilidad y eficiencia reproductiva del hato.',
    valorIdealMin: 360,
    valorIdealMax: 410,
    paso: 1
  }
];

// Muestra poblacional enriquecida de 45 animales por variable
export const MOCK_POBLACION_ZOOTECNICA: Record<string, AnimalZootecnico[]> = {
  peso_destete: [
    { id: '1', arete: '0001', nombre: 'Mariposa', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 5.4, valor: 218 },
    { id: '2', arete: '0002', nombre: 'Esperanza', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.8, valor: 224 },
    { id: '3', arete: 'CW002', nombre: 'Baronesa', raza: 'Gyr Lechero', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 6.1, valor: 205 },
    { id: '4', arete: 'CW003', nombre: 'Reina', raza: 'Gyr Lechero', categoria: 'Vaca', lote: '03 - Secas', sexo: 'Hembra', edadAnos: 5.9, valor: 232 },
    { id: '5', arete: 'CW004', nombre: 'Princesa', raza: 'Gyr Lechero', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 3.8, valor: 210 },
    { id: '6', arete: 'CW005', nombre: 'Gitana', raza: 'Girolando', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.2, valor: 245 },
    { id: '7', arete: 'CW006', nombre: 'Lucero', raza: 'Brahman', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 4.5, valor: 238 },
    { id: '8', arete: 'CW007', nombre: 'Estrella', raza: 'Carora', categoria: 'Vaca', lote: '03 - Secas', sexo: 'Hembra', edadAnos: 5.1, valor: 198 },
    { id: '9', arete: 'CW008', nombre: 'Milenaria', raza: 'Holstein', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 6.3, valor: 252 },
    { id: '10', arete: 'CW009', nombre: 'Bandida', raza: 'Holstein', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 3.9, valor: 185 },
    { id: '11', arete: 'CW010', nombre: 'Paloma', raza: 'Carora', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 4.7, valor: 215 },
    { id: '12', arete: 'CW013', nombre: 'Triunfadora', raza: 'Carora', categoria: 'Novilla', lote: '04 - Novillas', sexo: 'Hembra', edadAnos: 2.3, valor: 228 },
    { id: '13', arete: 'VC-88', nombre: 'Sombra', raza: 'Gyr Lechero', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 5.0, valor: 172 },
    { id: '14', arete: 'VC-104', nombre: 'Coronela', raza: 'Brahman', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 4.1, valor: 240 },
    { id: '15', arete: 'VC-115', nombre: 'Muñeca', raza: 'Girolando', categoria: 'Novilla', lote: '04 - Novillas', sexo: 'Hembra', edadAnos: 2.1, valor: 220 },
    { id: '16', arete: 'VC-120', nombre: 'Zafiro', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.9, valor: 260 },
    { id: '17', arete: 'VC-122', nombre: 'Esmeralda', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 5.2, valor: 255 },
    { id: '18', arete: 'VC-130', nombre: 'Flor de Loto', raza: 'Holstein', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 3.7, valor: 178 },
    { id: '19', arete: 'VC-135', nombre: 'Centella', raza: 'Gyr Lechero', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 4.6, valor: 192 },
    { id: '20', arete: 'VC-140', nombre: 'Cariñosa', raza: 'Brahman', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 5.5, valor: 202 },
    { id: '21', arete: 'T-01', nombre: 'Titan 01', raza: 'Carora', categoria: 'Mauta', lote: '05 - Levante', sexo: 'Hembra', edadAnos: 1.2, valor: 195 },
    { id: '22', arete: 'T-02', nombre: 'Titan 02', raza: 'Carora', categoria: 'Mauta', lote: '05 - Levante', sexo: 'Hembra', edadAnos: 1.1, valor: 212 },
    { id: '23', arete: 'T-03', nombre: 'Titan 03', raza: 'Girolando', categoria: 'Mauta', lote: '05 - Levante', sexo: 'Hembra', edadAnos: 1.3, valor: 235 },
    { id: '24', arete: 'T-04', nombre: 'Titan 04', raza: 'Gyr Lechero', categoria: 'Mauta', lote: '05 - Levante', sexo: 'Hembra', edadAnos: 1.2, valor: 188 },
    { id: '25', arete: 'T-05', nombre: 'Titan 05', raza: 'Brahman', categoria: 'Mauta', lote: '05 - Levante', sexo: 'Hembra', edadAnos: 1.4, valor: 248 },
    { id: '26', arete: 'B-101', nombre: 'Becerro 101', raza: 'Carora', categoria: 'Becerro', lote: '06 - Crías', sexo: 'Macho', edadAnos: 0.7, valor: 226 },
    { id: '27', arete: 'B-102', nombre: 'Becerro 102', raza: 'Carora', categoria: 'Becerro', lote: '06 - Crías', sexo: 'Macho', edadAnos: 0.7, valor: 165 },
    { id: '28', arete: 'B-103', nombre: 'Becerro 103', raza: 'Holstein', categoria: 'Becerro', lote: '06 - Crías', sexo: 'Macho', edadAnos: 0.8, valor: 268 },
    { id: '29', arete: 'B-104', nombre: 'Becerro 104', raza: 'Gyr Lechero', categoria: 'Becerro', lote: '06 - Crías', sexo: 'Macho', edadAnos: 0.6, valor: 182 },
    { id: '30', arete: 'B-105', nombre: 'Becerro 105', raza: 'Brahman', categoria: 'Becerro', lote: '06 - Crías', sexo: 'Macho', edadAnos: 0.7, valor: 250 },
    { id: '31', arete: 'BL001', nombre: 'Sultán del Valle', raza: 'Carora', categoria: 'Toro', lote: '07 - Reproductores', sexo: 'Macho', edadAnos: 6.8, valor: 262 },
    { id: '32', arete: 'BL002', nombre: 'Rey Criollo', raza: 'Carora', categoria: 'Toro', lote: '07 - Reproductores', sexo: 'Macho', edadAnos: 5.2, valor: 258 },
    { id: '33', arete: 'SM01', nombre: 'Gyr Master', raza: 'Gyr Lechero', categoria: 'Toro', lote: '07 - Reproductores', sexo: 'Macho', edadAnos: 4.8, valor: 242 },
    { id: '34', arete: 'SM02', nombre: 'Brahman Real', raza: 'Brahman', categoria: 'Toro', lote: '07 - Reproductores', sexo: 'Macho', edadAnos: 5.9, valor: 270 },
    { id: '35', arete: 'H-301', nombre: 'Holandesa 301', raza: 'Holstein', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.4, valor: 214 },
    { id: '36', arete: 'H-302', nombre: 'Holandesa 302', raza: 'Holstein', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 3.5, valor: 190 },
    { id: '37', arete: 'H-303', nombre: 'Holandesa 303', raza: 'Girolando', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 4.0, valor: 230 },
    { id: '38', arete: 'G-401', nombre: 'Gloriosa', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 5.6, valor: 222 },
    { id: '39', arete: 'G-402', nombre: 'Granadina', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.7, valor: 208 },
    { id: '40', arete: 'G-403', nombre: 'Galana', raza: 'Gyr Lechero', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 3.9, valor: 216 },
    { id: '41', arete: 'G-404', nombre: 'Gaviota', raza: 'Carora', categoria: 'Novilla', lote: '04 - Novillas', sexo: 'Hembra', edadAnos: 2.2, valor: 175 },
    { id: '42', arete: 'G-405', nombre: 'Genovesa', raza: 'Brahman', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 6.0, valor: 236 },
    { id: '43', arete: 'M-501', nombre: 'Mantecosa', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.3, valor: 246 },
    { id: '44', arete: 'M-502', nombre: 'Morenita', raza: 'Girolando', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 5.3, valor: 200 },
    { id: '45', arete: 'M-503', nombre: 'Majestuosa', raza: 'Holstein', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.1, valor: 265 }
  ],
  produccion_305: [
    { id: '1', arete: '0001', nombre: 'Mariposa', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 5.4, valor: 4890 },
    { id: '2', arete: '0002', nombre: 'Esperanza', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.8, valor: 5420 },
    { id: '3', arete: 'CW002', nombre: 'Baronesa', raza: 'Gyr Lechero', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 6.1, valor: 4520 },
    { id: '4', arete: 'CW003', nombre: 'Reina', raza: 'Gyr Lechero', categoria: 'Vaca', lote: '03 - Secas', sexo: 'Hembra', edadAnos: 5.9, valor: 4760 },
    { id: '5', arete: 'CW004', nombre: 'Princesa', raza: 'Gyr Lechero', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 3.8, valor: 3950 },
    { id: '6', arete: 'CW005', nombre: 'Gitana', raza: 'Girolando', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.2, valor: 4680 },
    { id: '7', arete: 'CW006', nombre: 'Lucero', raza: 'Brahman', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 4.5, valor: 2850 },
    { id: '8', arete: 'CW007', nombre: 'Estrella', raza: 'Carora', categoria: 'Vaca', lote: '03 - Secas', sexo: 'Hembra', edadAnos: 5.1, valor: 3720 },
    { id: '9', arete: 'CW008', nombre: 'Milenaria', raza: 'Holstein', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 6.3, valor: 5850 },
    { id: '10', arete: 'CW009', nombre: 'Bandida', raza: 'Holstein', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 3.9, valor: 3120 },
    { id: '11', arete: 'CW010', nombre: 'Paloma', raza: 'Carora', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 4.7, valor: 4050 },
    { id: '12', arete: 'CW013', nombre: 'Triunfadora', raza: 'Carora', categoria: 'Novilla', lote: '04 - Novillas', sexo: 'Hembra', edadAnos: 2.3, valor: 3600 },
    { id: '13', arete: 'VC-88', nombre: 'Sombra', raza: 'Gyr Lechero', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 5.0, valor: 5020 },
    { id: '14', arete: 'VC-104', nombre: 'Coronela', raza: 'Brahman', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 4.1, valor: 2650 },
    { id: '15', arete: 'VC-115', nombre: 'Muñeca', raza: 'Girolando', categoria: 'Novilla', lote: '04 - Novillas', sexo: 'Hembra', edadAnos: 2.1, valor: 3850 },
    { id: '16', arete: 'VC-120', nombre: 'Zafiro', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.9, valor: 5310 },
    { id: '17', arete: 'VC-122', nombre: 'Esmeralda', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 5.2, valor: 5120 },
    { id: '18', arete: 'VC-130', nombre: 'Flor de Loto', raza: 'Holstein', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 3.7, valor: 3340 },
    { id: '19', arete: 'VC-135', nombre: 'Centella', raza: 'Gyr Lechero', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 4.6, valor: 4180 },
    { id: '20', arete: 'VC-140', nombre: 'Cariñosa', raza: 'Brahman', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 5.5, valor: 2950 },
    { id: '21', arete: 'H-301', nombre: 'Holandesa 301', raza: 'Holstein', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.4, valor: 5600 },
    { id: '22', arete: 'H-302', nombre: 'Holandesa 302', raza: 'Holstein', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 3.5, valor: 3480 },
    { id: '23', arete: 'H-303', nombre: 'Holandesa 303', raza: 'Girolando', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 4.0, valor: 4420 },
    { id: '24', arete: 'G-401', nombre: 'Gloriosa', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 5.6, valor: 4950 },
    { id: '25', arete: 'G-402', nombre: 'Granadina', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.7, valor: 4320 },
    { id: '26', arete: 'G-403', nombre: 'Galana', raza: 'Gyr Lechero', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 3.9, valor: 4210 },
    { id: '27', arete: 'G-404', nombre: 'Gaviota', raza: 'Carora', categoria: 'Novilla', lote: '04 - Novillas', sexo: 'Hembra', edadAnos: 2.2, valor: 3550 },
    { id: '28', arete: 'G-405', nombre: 'Genovesa', raza: 'Brahman', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 6.0, valor: 2780 },
    { id: '29', arete: 'M-501', nombre: 'Mantecosa', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.3, valor: 5240 },
    { id: '30', arete: 'M-502', nombre: 'Morenita', raza: 'Girolando', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 5.3, valor: 4620 },
    { id: '31', arete: 'M-503', nombre: 'Majestuosa', raza: 'Holstein', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.1, valor: 6100 },
    { id: '32', arete: 'CW015', nombre: 'Dulcinea', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.8, valor: 4780 },
    { id: '33', arete: 'CW016', nombre: 'Campesina', raza: 'Gyr Lechero', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 5.0, valor: 4100 },
    { id: '34', arete: 'CW017', nombre: 'Sirena', raza: 'Holstein', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 3.6, valor: 5350 },
    { id: '35', arete: 'CW018', nombre: 'Preciosa', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 5.8, valor: 5050 },
    { id: '36', arete: 'CW019', nombre: 'Perla Negra', raza: 'Girolando', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 4.5, valor: 4380 },
    { id: '37', arete: 'CW020', nombre: 'Alondra', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 6.2, valor: 4690 },
    { id: '38', arete: 'CW021', nombre: 'Aurora', raza: 'Brahman', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 5.1, valor: 2580 },
    { id: '39', arete: 'CW022', nombre: 'Bambina', raza: 'Gyr Lechero', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 4.7, valor: 3880 },
    { id: '40', arete: 'CW023', nombre: 'Cantinera', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 3.9, valor: 4820 },
    { id: '41', arete: 'CW024', nombre: 'Diosa', raza: 'Holstein', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.2, valor: 5720 },
    { id: '42', arete: 'CW025', nombre: 'Hechicera', raza: 'Girolando', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 5.7, valor: 4150 },
    { id: '43', arete: 'CW026', nombre: 'Milenaria II', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 3.4, valor: 4400 },
    { id: '44', arete: 'CW027', nombre: 'Primavera', raza: 'Gyr Lechero', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 4.9, valor: 4290 },
    { id: '45', arete: 'CW028', nombre: 'Soberana', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 5.1, valor: 5180 }
  ],
  gdp: [
    { id: '1', arete: 'T-01', nombre: 'Titan 01', raza: 'Carora', categoria: 'Mauta', lote: '05 - Levante', sexo: 'Hembra', edadAnos: 1.2, valor: 680 },
    { id: '2', arete: 'T-02', nombre: 'Titan 02', raza: 'Carora', categoria: 'Mauta', lote: '05 - Levante', sexo: 'Hembra', edadAnos: 1.1, valor: 740 },
    { id: '3', arete: 'T-03', nombre: 'Titan 03', raza: 'Girolando', categoria: 'Mauta', lote: '05 - Levante', sexo: 'Hembra', edadAnos: 1.3, valor: 810 },
    { id: '4', arete: 'T-04', nombre: 'Titan 04', raza: 'Gyr Lechero', categoria: 'Mauta', lote: '05 - Levante', sexo: 'Hembra', edadAnos: 1.2, valor: 610 },
    { id: '5', arete: 'T-05', nombre: 'Titan 05', raza: 'Brahman', categoria: 'Mauta', lote: '05 - Levante', sexo: 'Hembra', edadAnos: 1.4, valor: 890 },
    { id: '6', arete: 'B-101', nombre: 'Becerro 101', raza: 'Carora', categoria: 'Becerro', lote: '06 - Crías', sexo: 'Macho', edadAnos: 0.7, valor: 760 },
    { id: '7', arete: 'B-102', nombre: 'Becerro 102', raza: 'Carora', categoria: 'Becerro', lote: '06 - Crías', sexo: 'Macho', edadAnos: 0.7, valor: 520 },
    { id: '8', arete: 'B-103', nombre: 'Becerro 103', raza: 'Holstein', categoria: 'Becerro', lote: '06 - Crías', sexo: 'Macho', edadAnos: 0.8, valor: 940 },
    { id: '9', arete: 'B-104', nombre: 'Becerro 104', raza: 'Gyr Lechero', categoria: 'Becerro', lote: '06 - Crías', sexo: 'Macho', edadAnos: 0.6, valor: 580 },
    { id: '10', arete: 'B-105', nombre: 'Becerro 105', raza: 'Brahman', categoria: 'Becerro', lote: '06 - Crías', sexo: 'Macho', edadAnos: 0.7, valor: 870 },
    { id: '11', arete: 'NV-201', nombre: 'Novillo 201', raza: 'Brahman', categoria: 'Novillo', lote: '04 - Ceba', sexo: 'Macho', edadAnos: 2.1, valor: 980 },
    { id: '12', arete: 'NV-202', nombre: 'Novillo 202', raza: 'Carora', categoria: 'Novillo', lote: '04 - Ceba', sexo: 'Macho', edadAnos: 2.0, valor: 750 },
    { id: '13', arete: 'NV-203', nombre: 'Novillo 203', raza: 'Girolando', categoria: 'Novillo', lote: '04 - Ceba', sexo: 'Macho', edadAnos: 2.2, valor: 830 },
    { id: '14', arete: 'NV-204', nombre: 'Novillo 204', raza: 'Gyr Lechero', categoria: 'Novillo', lote: '04 - Ceba', sexo: 'Macho', edadAnos: 1.9, valor: 640 },
    { id: '15', arete: 'NV-205', nombre: 'Novillo 205', raza: 'Brahman', categoria: 'Novillo', lote: '04 - Ceba', sexo: 'Macho', edadAnos: 2.3, valor: 1040 },
    { id: '16', arete: 'NV-206', nombre: 'Novillo 206', raza: 'Holstein', categoria: 'Novillo', lote: '04 - Ceba', sexo: 'Macho', edadAnos: 2.0, valor: 860 },
    { id: '17', arete: 'NV-207', nombre: 'Novillo 207', raza: 'Carora', categoria: 'Novillo', lote: '04 - Ceba', sexo: 'Macho', edadAnos: 2.1, valor: 710 },
    { id: '18', arete: 'NV-208', nombre: 'Novillo 208', raza: 'Brahman', categoria: 'Novillo', lote: '04 - Ceba', sexo: 'Macho', edadAnos: 2.2, valor: 920 },
    { id: '19', arete: 'NV-209', nombre: 'Novillo 209', raza: 'Girolando', categoria: 'Novillo', lote: '04 - Ceba', sexo: 'Macho', edadAnos: 1.8, valor: 790 },
    { id: '20', arete: 'NV-210', nombre: 'Novillo 210', raza: 'Gyr Lechero', categoria: 'Novillo', lote: '04 - Ceba', sexo: 'Macho', edadAnos: 2.0, valor: 590 },
    { id: '21', arete: 'CW013', nombre: 'Triunfadora', raza: 'Carora', categoria: 'Novilla', lote: '05 - Levante', sexo: 'Hembra', edadAnos: 2.3, valor: 730 },
    { id: '22', arete: 'VC-115', nombre: 'Muñeca', raza: 'Girolando', categoria: 'Novilla', lote: '05 - Levante', sexo: 'Hembra', edadAnos: 2.1, valor: 780 },
    { id: '23', arete: 'G-404', nombre: 'Gaviota', raza: 'Carora', categoria: 'Novilla', lote: '05 - Levante', sexo: 'Hembra', edadAnos: 2.2, valor: 560 },
    { id: '24', arete: 'MT-11', nombre: 'Maute 11', raza: 'Brahman', categoria: 'Maute', lote: '04 - Ceba', sexo: 'Macho', edadAnos: 1.5, valor: 910 },
    { id: '25', arete: 'MT-12', nombre: 'Maute 12', raza: 'Carora', categoria: 'Maute', lote: '04 - Ceba', sexo: 'Macho', edadAnos: 1.6, valor: 690 },
    { id: '26', arete: 'MT-13', nombre: 'Maute 13', raza: 'Girolando', categoria: 'Maute', lote: '04 - Ceba', sexo: 'Macho', edadAnos: 1.4, valor: 820 },
    { id: '27', arete: 'MT-14', nombre: 'Maute 14', raza: 'Holstein', categoria: 'Maute', lote: '04 - Ceba', sexo: 'Macho', edadAnos: 1.5, valor: 850 },
    { id: '28', arete: 'MT-15', nombre: 'Maute 15', raza: 'Gyr Lechero', categoria: 'Maute', lote: '04 - Ceba', sexo: 'Macho', edadAnos: 1.6, valor: 620 },
    { id: '29', arete: 'MT-16', nombre: 'Maute 16', raza: 'Brahman', categoria: 'Maute', lote: '04 - Ceba', sexo: 'Macho', edadAnos: 1.7, valor: 1010 },
    { id: '30', arete: 'MT-17', nombre: 'Maute 17', raza: 'Carora', categoria: 'Maute', lote: '04 - Ceba', sexo: 'Macho', edadAnos: 1.5, valor: 720 },
    { id: '31', arete: 'MT-18', nombre: 'Maute 18', raza: 'Girolando', categoria: 'Maute', lote: '04 - Ceba', sexo: 'Macho', edadAnos: 1.6, valor: 840 },
    { id: '32', arete: 'MT-19', nombre: 'Maute 19', raza: 'Brahman', categoria: 'Maute', lote: '04 - Ceba', sexo: 'Macho', edadAnos: 1.4, valor: 880 },
    { id: '33', arete: 'MT-20', nombre: 'Maute 20', raza: 'Carora', categoria: 'Maute', lote: '04 - Ceba', sexo: 'Macho', edadAnos: 1.5, valor: 670 },
    { id: '34', arete: 'T-06', nombre: 'Titan 06', raza: 'Holstein', categoria: 'Mauta', lote: '05 - Levante', sexo: 'Hembra', edadAnos: 1.3, valor: 800 },
    { id: '35', arete: 'T-07', nombre: 'Titan 07', raza: 'Carora', categoria: 'Mauta', lote: '05 - Levante', sexo: 'Hembra', edadAnos: 1.2, valor: 710 },
    { id: '36', arete: 'T-08', nombre: 'Titan 08', raza: 'Gyr Lechero', categoria: 'Mauta', lote: '05 - Levante', sexo: 'Hembra', edadAnos: 1.1, valor: 630 },
    { id: '37', arete: 'T-09', nombre: 'Titan 09', raza: 'Brahman', categoria: 'Mauta', lote: '05 - Levante', sexo: 'Hembra', edadAnos: 1.4, valor: 860 },
    { id: '38', arete: 'T-10', nombre: 'Titan 10', raza: 'Girolando', categoria: 'Mauta', lote: '05 - Levante', sexo: 'Hembra', edadAnos: 1.2, valor: 770 },
    { id: '39', arete: 'B-106', nombre: 'Becerro 106', raza: 'Carora', categoria: 'Becerro', lote: '06 - Crías', sexo: 'Macho', edadAnos: 0.8, valor: 740 },
    { id: '40', arete: 'B-107', nombre: 'Becerro 107', raza: 'Holstein', categoria: 'Becerro', lote: '06 - Crías', sexo: 'Macho', edadAnos: 0.7, valor: 900 },
    { id: '41', arete: 'B-108', nombre: 'Becerro 108', raza: 'Brahman', categoria: 'Becerro', lote: '06 - Crías', sexo: 'Macho', edadAnos: 0.9, valor: 930 },
    { id: '42', arete: 'B-109', nombre: 'Becerro 109', raza: 'Gyr Lechero', categoria: 'Becerro', lote: '06 - Crías', sexo: 'Macho', edadAnos: 0.6, valor: 540 },
    { id: '43', arete: 'B-110', nombre: 'Becerro 110', raza: 'Carora', categoria: 'Becerro', lote: '06 - Crías', sexo: 'Macho', edadAnos: 0.7, valor: 690 },
    { id: '44', arete: 'B-111', nombre: 'Becerro 111', raza: 'Girolando', categoria: 'Becerro', lote: '06 - Crías', sexo: 'Macho', edadAnos: 0.8, valor: 810 },
    { id: '45', arete: 'B-112', nombre: 'Becerro 112', raza: 'Brahman', categoria: 'Becerro', lote: '06 - Crías', sexo: 'Macho', edadAnos: 0.8, valor: 1080 }
  ],
  iep: [
    { id: '1', arete: '0001', nombre: 'Mariposa', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 5.4, valor: 382 },
    { id: '2', arete: '0002', nombre: 'Esperanza', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.8, valor: 368 },
    { id: '3', arete: 'CW002', nombre: 'Baronesa', raza: 'Gyr Lechero', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 6.1, valor: 412 },
    { id: '4', arete: 'CW003', nombre: 'Reina', raza: 'Gyr Lechero', categoria: 'Vaca', lote: '03 - Secas', sexo: 'Hembra', edadAnos: 5.9, valor: 395 },
    { id: '5', arete: 'CW004', nombre: 'Princesa', raza: 'Gyr Lechero', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 3.8, valor: 374 },
    { id: '6', arete: 'CW005', nombre: 'Gitana', raza: 'Girolando', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.2, valor: 425 },
    { id: '7', arete: 'CW006', nombre: 'Lucero', raza: 'Brahman', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 4.5, valor: 448 },
    { id: '8', arete: 'CW007', nombre: 'Estrella', raza: 'Carora', categoria: 'Vaca', lote: '03 - Secas', sexo: 'Hembra', edadAnos: 5.1, valor: 388 },
    { id: '9', arete: 'CW008', nombre: 'Milenaria', raza: 'Holstein', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 6.3, valor: 462 },
    { id: '10', arete: 'CW009', nombre: 'Bandida', raza: 'Holstein', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 3.9, valor: 478 },
    { id: '11', arete: 'CW010', nombre: 'Paloma', raza: 'Carora', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 4.7, valor: 404 },
    { id: '12', arete: 'VC-88', nombre: 'Sombra', raza: 'Gyr Lechero', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 5.0, valor: 362 },
    { id: '13', arete: 'VC-104', nombre: 'Coronela', raza: 'Brahman', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 4.1, valor: 456 },
    { id: '14', arete: 'VC-120', nombre: 'Zafiro', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.9, valor: 370 },
    { id: '15', arete: 'VC-122', nombre: 'Esmeralda', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 5.2, valor: 376 },
    { id: '16', arete: 'VC-130', nombre: 'Flor de Loto', raza: 'Holstein', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 3.7, valor: 485 },
    { id: '17', arete: 'VC-135', nombre: 'Centella', raza: 'Gyr Lechero', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 4.6, valor: 418 },
    { id: '18', arete: 'VC-140', nombre: 'Cariñosa', raza: 'Brahman', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 5.5, valor: 434 },
    { id: '19', arete: 'H-301', nombre: 'Holandesa 301', raza: 'Holstein', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.4, valor: 430 },
    { id: '20', arete: 'H-302', nombre: 'Holandesa 302', raza: 'Holstein', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 3.5, valor: 492 },
    { id: '21', arete: 'H-303', nombre: 'Holandesa 303', raza: 'Girolando', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 4.0, valor: 415 },
    { id: '22', arete: 'G-401', nombre: 'Gloriosa', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 5.6, valor: 366 },
    { id: '23', arete: 'G-402', nombre: 'Granadina', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.7, valor: 390 },
    { id: '24', arete: 'G-403', nombre: 'Galana', raza: 'Gyr Lechero', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 3.9, valor: 422 },
    { id: '25', arete: 'G-405', nombre: 'Genovesa', raza: 'Brahman', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 6.0, valor: 442 },
    { id: '26', arete: 'M-501', nombre: 'Mantecosa', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.3, valor: 378 },
    { id: '27', arete: 'M-502', nombre: 'Morenita', raza: 'Girolando', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 5.3, valor: 428 },
    { id: '28', arete: 'M-503', nombre: 'Majestuosa', raza: 'Holstein', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.1, valor: 450 },
    { id: '29', arete: 'CW015', nombre: 'Dulcinea', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.8, valor: 384 },
    { id: '30', arete: 'CW016', nombre: 'Campesina', raza: 'Gyr Lechero', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 5.0, valor: 408 },
    { id: '31', arete: 'CW017', nombre: 'Sirena', raza: 'Holstein', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 3.6, valor: 468 },
    { id: '32', arete: 'CW018', nombre: 'Preciosa', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 5.8, valor: 372 },
    { id: '33', arete: 'CW019', nombre: 'Perla Negra', raza: 'Girolando', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 4.5, valor: 414 },
    { id: '34', arete: 'CW020', nombre: 'Alondra', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 6.2, valor: 392 },
    { id: '35', arete: 'CW021', nombre: 'Aurora', raza: 'Brahman', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 5.1, valor: 472 },
    { id: '36', arete: 'CW022', nombre: 'Bambina', raza: 'Gyr Lechero', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 4.7, valor: 400 },
    { id: '37', arete: 'CW023', nombre: 'Cantinera', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 3.9, valor: 380 },
    { id: '38', arete: 'CW024', nombre: 'Diosa', raza: 'Holstein', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.2, valor: 436 },
    { id: '39', arete: 'CW025', nombre: 'Hechicera', raza: 'Girolando', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 5.7, valor: 410 },
    { id: '40', arete: 'CW026', nombre: 'Milenaria II', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 3.4, valor: 386 },
    { id: '41', arete: 'CW027', nombre: 'Primavera', raza: 'Gyr Lechero', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 4.9, valor: 398 },
    { id: '42', arete: 'CW028', nombre: 'Soberana', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 5.1, valor: 364 },
    { id: '43', arete: 'CW029', nombre: 'Amapola', raza: 'Carora', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.4, valor: 389 },
    { id: '44', arete: 'CW030', nombre: 'Candelaria', raza: 'Gyr Lechero', categoria: 'Vaca', lote: '02 - Ordeño', sexo: 'Hembra', edadAnos: 5.3, valor: 420 },
    { id: '45', arete: 'CW031', nombre: 'Camelia', raza: 'Holstein', categoria: 'Vaca', lote: '01 - Ordeño', sexo: 'Hembra', edadAnos: 4.6, valor: 460 }
  ]
};

export interface ZootechDistributionStats {
  n: number;
  media: number;
  desviacionEstandar: number;
  varianza: number;
  mediana: number;
  coeficienteVariacion: number;
  minimo: number;
  maximo: number;
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  curvaGauss: { x: number; y: number }[];
  intervalosFrecuencia: {
    rango: string;
    frecuenciaObservada: number;
    porcentajeObservado: number;
    frecuenciaEsperada: number;
    porcentajeAcumulado: number;
    zScore: number;
  }[];
}

// Cálculo de percentil de un arreglo ordenado
export const getPercentile = (sorted: number[], p: number): number => {
  if (sorted.length === 0) return 0;
  if (p <= 0) return sorted[0];
  if (p >= 100) return sorted[sorted.length - 1];

  const index = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;

  if (lower === upper) return sorted[lower];
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
};

// Función de densidad normal gaussiana
export const gaussianDensity = (x: number, mean: number, stdDev: number): number => {
  if (stdDev === 0) return 0;
  const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2));
  return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
};

// Función de distribución acumulada normal aproximada (CDF)
export const normalCdf = (x: number, mean: number, stdDev: number): number => {
  if (stdDev === 0) return x < mean ? 0 : 1;
  const z = (x - mean) / stdDev;
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - prob : prob;
};

// Cálculo exhaustivo de estadísticas zootécnicas
export const calculateZootechStats = (animals: AnimalZootecnico[]): ZootechDistributionStats => {
  const values = animals.map(a => a.valor).sort((a, b) => a - b);
  const n = values.length;

  if (n === 0) {
    return {
      n: 0,
      media: 0,
      desviacionEstandar: 0,
      varianza: 0,
      mediana: 0,
      coeficienteVariacion: 0,
      minimo: 0,
      maximo: 0,
      p10: 0,
      p25: 0,
      p50: 0,
      p75: 0,
      p90: 0,
      curvaGauss: [],
      intervalosFrecuencia: []
    };
  }

  const sum = values.reduce((acc, val) => acc + val, 0);
  const media = parseFloat((sum / n).toFixed(2));

  // Varianza muestral
  const varianceSum = values.reduce((acc, val) => acc + Math.pow(val - media, 2), 0);
  const varianza = parseFloat((n > 1 ? varianceSum / (n - 1) : 0).toFixed(2));
  const desviacionEstandar = parseFloat(Math.sqrt(varianza).toFixed(2));

  const mediana = parseFloat(getPercentile(values, 50).toFixed(2));
  const cv = media > 0 ? parseFloat(((desviacionEstandar / media) * 100).toFixed(2)) : 0;
  const minimo = values[0];
  const maximo = values[values.length - 1];

  const p10 = parseFloat(getPercentile(values, 10).toFixed(2));
  const p25 = parseFloat(getPercentile(values, 25).toFixed(2));
  const p50 = mediana;
  const p75 = parseFloat(getPercentile(values, 75).toFixed(2));
  const p90 = parseFloat(getPercentile(values, 90).toFixed(2));

  // Puntos de la campana de Gauss
  const startX = Math.floor(media - 3.2 * desviacionEstandar);
  const endX = Math.ceil(media + 3.2 * desviacionEstandar);
  const step = Math.max(1, (endX - startX) / 36);

  const curvaGauss: { x: number; y: number }[] = [];
  for (let x = startX; x <= endX; x += step) {
    const roundedX = Math.round(x * 10) / 10;
    const y = gaussianDensity(roundedX, media, desviacionEstandar);
    curvaGauss.push({ x: roundedX, y: parseFloat(y.toFixed(5)) });
  }

  // Intervalos de frecuencia
  const numIntervalos = 6;
  const intervalWidth = (maximo - minimo) / numIntervalos;
  const intervalosFrecuencia = [];
  let acum = 0;

  for (let i = 0; i < numIntervalos; i++) {
    const rStart = minimo + i * intervalWidth;
    const rEnd = i === numIntervalos - 1 ? maximo : rStart + intervalWidth;
    const count = values.filter(v => (i === numIntervalos - 1 ? v >= rStart && v <= rEnd : v >= rStart && v < rEnd)).length;
    const pct = parseFloat(((count / n) * 100).toFixed(1));
    acum += pct;

    const mid = (rStart + rEnd) / 2;
    const zScore = desviacionEstandar > 0 ? parseFloat(((mid - media) / desviacionEstandar).toFixed(2)) : 0;

    // Frecuencia esperada bajo la normal teórica
    const cdf1 = normalCdf(rStart, media, desviacionEstandar);
    const cdf2 = normalCdf(rEnd, media, desviacionEstandar);
    const fe = parseFloat(((cdf2 - cdf1) * n).toFixed(1));

    intervalosFrecuencia.push({
      rango: `${Math.round(rStart)} - ${Math.round(rEnd)}`,
      frecuenciaObservada: count,
      porcentajeObservado: pct,
      frecuenciaEsperada: fe,
      porcentajeAcumulado: Math.min(100, parseFloat(acum.toFixed(1))),
      zScore
    });
  }

  return {
    n,
    media,
    desviacionEstandar,
    varianza,
    mediana,
    coeficienteVariacion: cv,
    minimo,
    maximo,
    p10,
    p25,
    p50,
    p75,
    p90,
    curvaGauss,
    intervalosFrecuencia
  };
};

export interface GeneticSimulationResult {
  lowerThresholdPercent: number;
  upperThresholdPercent: number;
  lowerCutoffValue: number;
  upperCutoffValue: number;
  cullingAnimals: AnimalZootecnico[];
  eliteAnimals: AnimalZootecnico[];
  remainingAnimalsCount: number;
  remainingMean: number;
  potentialHerdGain: number;
  eliteMean: number;
  selectionDifferential: number;
  isLowerBetter: boolean;
}

// Simulación de selección y culling
export const calculateGeneticSimulation = (
  animals: AnimalZootecnico[],
  stats: ZootechDistributionStats,
  lowerPct: number, // 0 - 30%
  upperPct: number, // 0 - 30%
  isLowerBetter = false
): GeneticSimulationResult => {
  const values = animals.map(a => a.valor).sort((a, b) => a - b);

  let lowerCutoffValue: number;
  let upperCutoffValue: number;
  let cullingAnimals: AnimalZootecnico[];
  let eliteAnimals: AnimalZootecnico[];
  let remainingAnimals: AnimalZootecnico[];

  if (!isLowerBetter) {
    // Para producción, peso y GDP: los más bajos se descartan, los más altos son élite
    lowerCutoffValue = parseFloat(getPercentile(values, lowerPct).toFixed(1));
    upperCutoffValue = parseFloat(getPercentile(values, 100 - upperPct).toFixed(1));

    cullingAnimals = animals
      .filter(a => a.valor <= lowerCutoffValue)
      .sort((a, b) => a.valor - b.valor)
      .map(a => ({
        ...a,
        zScore: stats.desviacionEstandar > 0 ? parseFloat(((a.valor - stats.media) / stats.desviacionEstandar).toFixed(2)) : 0,
        recomendacionGenetica: 'Descarte Sugerido' as const
      }));

    eliteAnimals = animals
      .filter(a => a.valor >= upperCutoffValue)
      .sort((a, b) => b.valor - a.valor)
      .map(a => ({
        ...a,
        zScore: stats.desviacionEstandar > 0 ? parseFloat(((a.valor - stats.media) / stats.desviacionEstandar).toFixed(2)) : 0,
        recomendacionGenetica: 'Donadora Élite' as const
      }));

    remainingAnimals = animals.filter(a => a.valor > lowerCutoffValue);
  } else {
    // Para IEP (días entre partos): los valores altos son lentos/peores (descarte), valores bajos son élite
    lowerCutoffValue = parseFloat(getPercentile(values, 100 - lowerPct).toFixed(1));
    upperCutoffValue = parseFloat(getPercentile(values, upperPct).toFixed(1));

    cullingAnimals = animals
      .filter(a => a.valor >= lowerCutoffValue)
      .sort((a, b) => b.valor - a.valor)
      .map(a => ({
        ...a,
        zScore: stats.desviacionEstandar > 0 ? parseFloat(((a.valor - stats.media) / stats.desviacionEstandar).toFixed(2)) : 0,
        recomendacionGenetica: 'Descarte Sugerido' as const
      }));

    eliteAnimals = animals
      .filter(a => a.valor <= upperCutoffValue)
      .sort((a, b) => a.valor - b.valor)
      .map(a => ({
        ...a,
        zScore: stats.desviacionEstandar > 0 ? parseFloat(((a.valor - stats.media) / stats.desviacionEstandar).toFixed(2)) : 0,
        recomendacionGenetica: 'Donadora Élite' as const
      }));

    remainingAnimals = animals.filter(a => a.valor < lowerCutoffValue);
  }

  const remainingMean = remainingAnimals.length > 0
    ? parseFloat((remainingAnimals.reduce((acc, a) => acc + a.valor, 0) / remainingAnimals.length).toFixed(2))
    : stats.media;

  // Ganancia potencial de promedio poblacional
  let potentialHerdGain = 0;
  if (!isLowerBetter) {
    potentialHerdGain = parseFloat((remainingMean - stats.media).toFixed(2));
  } else {
    // En IEP, una reducción en días es una mejora positiva
    potentialHerdGain = parseFloat((stats.media - remainingMean).toFixed(2));
  }

  const eliteMean = eliteAnimals.length > 0
    ? parseFloat((eliteAnimals.reduce((acc, a) => acc + a.valor, 0) / eliteAnimals.length).toFixed(2))
    : stats.media;

  let selectionDifferential = 0;
  if (!isLowerBetter) {
    selectionDifferential = parseFloat((eliteMean - stats.media).toFixed(2));
  } else {
    selectionDifferential = parseFloat((stats.media - eliteMean).toFixed(2));
  }

  return {
    lowerThresholdPercent: lowerPct,
    upperThresholdPercent: upperPct,
    lowerCutoffValue,
    upperCutoffValue,
    cullingAnimals,
    eliteAnimals,
    remainingAnimalsCount: remainingAnimals.length,
    remainingMean,
    potentialHerdGain,
    eliteMean,
    selectionDifferential,
    isLowerBetter
  };
};
