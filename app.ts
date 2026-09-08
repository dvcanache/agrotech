// Type Declarations for AngularJS and Chart.js global variables
declare var angular: any;
declare var Chart: any;
declare var ChartDataLabels: any;

// Interfaces for our Data Model
interface KpiCard {
  value: string;
  subtitle: string;
  iconType: 'milk-bucket' | 'scale-female' | 'scale-male' | 'weight-maute';
}

interface LegendItem {
  label: string;
  color: string;
}

interface ChartConfig {
  title: string;
  centerLabel: string;
  centerValue: number;
  labels: string[];
  data: number[];
  colors: string[];
  legend?: LegendItem[];
}

interface DashboardScope {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
  searchQuery: string;
  isProfileOpen: boolean;
  toggleProfile: () => void;
  kpiCards: KpiCard[];
  chart1: ChartConfig;
  chart2: ChartConfig;
  chart3: ChartConfig;
}

const app = angular.module('agroTechApp', []);

// Custom Directive for Chart.js Doughnut integration
app.directive('doughnutChart', () => {
  return {
    restrict: 'E',
    scope: {
      labels: '=',
      data: '=',
      colors: '='
    },
    template: '<canvas></canvas>',
    link: (scope: any, element: any) => {
      const ctx = element.find('canvas')[0].getContext('2d');
      
      // Instantiate standard Chart.js Doughnut chart
      const myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: scope.labels,
          datasets: [{
            data: scope.data,
            backgroundColor: scope.colors,
            borderWidth: 2.5,
            borderColor: '#ffffff',
            hoverOffset: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '72%', // Perfect ring thickness to match the image
          plugins: {
            legend: {
              display: false // Using our own custom styled legends
            },
            tooltip: {
              backgroundColor: '#1f2937',
              titleFont: { family: 'Outfit', size: 13, weight: '600' },
              bodyFont: { family: 'Outfit', size: 12 },
              padding: 10,
              cornerRadius: 6,
              displayColors: true,
              callbacks: {
                label: (context: any) => {
                  const label = context.label || '';
                  const value = context.raw || 0;
                  const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                  const percentage = ((value / total) * 100).toFixed(1) + '%';
                  return ' ' + label + ': ' + value + ' (' + percentage + ')';
                }
              }
            },
            datalabels: {
              color: (context: any) => {
                // Return contrast color based on segment color
                const color = context.dataset.backgroundColor[context.dataIndex];
                if (color === '#d8f3dc' || color === '#b7e4c7' || color === '#e0f2f1' || color === '#e8f5e9') {
                  return '#2d6a4f'; // Dark green text on very light background
                }
                return '#ffffff'; // White text on dark/medium background
              },
              font: {
                family: 'Outfit',
                weight: '600',
                size: 10.5
              },
              formatter: (value: number, context: any) => {
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1) + '%';
                return percentage;
              },
              align: 'center',
              anchor: 'center'
            }
          }
        },
        plugins: [ChartDataLabels]
      });

      // Watch for data changes
      scope.$watch('data', (newVal: number[]) => {
        if (newVal) {
          myChart.data.datasets[0].data = newVal;
          myChart.update();
        }
      }, true);
      
      // Cleanup on destroy
      element.on('$destroy', () => {
        myChart.destroy();
      });
    }
  };
});

app.controller('DashboardController', ['$scope', function($scope: DashboardScope) {
  // Navigation State - Set to 'settings' by default to open the Settings page active as requested
  $scope.activeMenu = 'settings';
  $scope.setActiveMenu = (menu: string) => {
    $scope.activeMenu = menu;
  };

  // Search input query
  $scope.searchQuery = '';

  // User Profile Dropdown
  $scope.isProfileOpen = false;
  $scope.toggleProfile = () => {
    $scope.isProfileOpen = !$scope.isProfileOpen;
  };

  // Row 1: KPI Cards Data
  $scope.kpiCards = [
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

  // Chart 1: Inventario Actual
  $scope.chart1 = {
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

  // Chart 2: Situación reproductiva actual
  $scope.chart2 = {
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

  // Chart 3: Situación productiva actual
  $scope.chart3 = {
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

  // Helper function to build custom legends for each chart
  const buildLegend = (chart: ChartConfig): LegendItem[] => {
    return chart.labels.map((label, index) => {
      return {
        label: label,
        color: chart.colors[index]
      };
    });
  };

  // Build the legends
  $scope.chart1.legend = buildLegend($scope.chart1);
  $scope.chart2.legend = buildLegend($scope.chart2);
  $scope.chart3.legend = buildLegend($scope.chart3);
}]);

// Interfaces for Animal Records
interface Animal {
  practico: string;
  unico: string;
  categoria: string;
  estatus: string;
  fechaNacimiento: string;
  edad: string;
  lote: string;
  descripcion: string;
  composicion: string;
  racial: string;
  etiquetas: string;
  activos: string;
  padre: string;
  madre: string;
}

interface AnimalesScope {
  animals: Animal[];
  selectedAnimals: { [key: string]: boolean };
  selectAll: boolean;
  toggleSelectAll: () => void;
  pages: number[];
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  setPage: (pageNumber: number) => void;
  getCurrentPageItems: () => Animal[];
}

// Custom Filter for Pagination starting index
app.filter('startFrom', () => {
  return (input: any[], start: number) => {
    if (!input) return [];
    start = +start;
    return input.slice(start);
  };
});

// Controller for Animals Table View
app.controller('AnimalesController', ['$scope', function($scope: any) {
  // Base mock animals (10 items)
  const baseAnimals = [
    { practico: "0001", unico: "0001", categoria: "Vaca", estatus: "Activo", fechaNacimiento: "15/10/2008", edad: "17,7 Años", lote: "01", descripcion: "Lote 01", composicion: "RN19TI14", racial: "", etiquetas: "", activos: "", padre: "", madre: "" },
    { practico: "0002", unico: "0002", categoria: "Vaca", estatus: "Activo", fechaNacimiento: "16/10/2009", edad: "16,7 Años", lote: "01", descripcion: "Lote 01", composicion: "JR28AB09BG03", racial: "", etiquetas: "", activos: "", padre: "", madre: "" },
    { practico: "EM01", unico: "EM01", categoria: "Embrión", estatus: "Activo", fechaNacimiento: "", edad: "", lote: "TERM1", descripcion: "Termo 1", composicion: "BZ45CN13", racial: "", etiquetas: "", activos: "", padre: "", madre: "" },
    { practico: "SM01", unico: "SM01", categoria: "Semen", estatus: "Activo", fechaNacimiento: "", edad: "", lote: "TERM1", descripcion: "Termo 1", composicion: "AN38RM28", racial: "", etiquetas: "", activos: "", padre: "", madre: "" },
    { practico: "SM02", unico: "SM02", categoria: "Semen", estatus: "Activo", fechaNacimiento: "", edad: "", lote: "TERM1", descripcion: "Termo 1", composicion: "LL20NM19CU16SS14", racial: "", etiquetas: "", activos: "", padre: "", madre: "" },
    { practico: "BCA01", unico: "BCA01", categoria: "Becerra", estatus: "Activo", fechaNacimiento: "18/1/2017", edad: "113,5 Meses", lote: "POT1", descripcion: "Potrero 1", composicion: "PS22GU02GY02CA01", racial: "", etiquetas: "", activos: "", padre: "", madre: "CW012" },
    { practico: "BCA02", unico: "BCA02", categoria: "Becerra", estatus: "Activo", fechaNacimiento: "18/1/2017", edad: "113,5 Meses", lote: "POT1", descripcion: "Potrero 1", composicion: "PM48BD03", racial: "", etiquetas: "", activos: "", padre: "", madre: "CW012" },
    { practico: "BCA03", unico: "BCA03", categoria: "Becerra", estatus: "Activo", fechaNacimiento: "15/9/2017", edad: "105,6 Meses", lote: "POT1", descripcion: "Potrero 1", composicion: "WR20CQ17BX09HR09", racial: "", etiquetas: "", activos: "", padre: "", madre: "CW013" },
    { practico: "BCA04", unico: "BCA04", categoria: "Becerra", estatus: "Activo", fechaNacimiento: "15/9/2017", edad: "105,6 Meses", lote: "POT1", descripcion: "Potrero 1", composicion: "SL12CR1INE09SI03", racial: "", etiquetas: "", activos: "", padre: "", madre: "CW013" },
    { practico: "BCA05", unico: "BCA05", categoria: "Becerra", estatus: "Activo", fechaNacimiento: "13/2/2016", edad: "124,7 Meses", lote: "POT1", descripcion: "Potrero 1", composicion: "TU26", racial: "", etiquetas: "", activos: "", padre: "", madre: "" }
  ];

  // Generate 49 items to match pagination requirements
  const generatedAnimals: Animal[] = [];
  for (let i = 1; i <= 49; i++) {
    if (i <= 10) {
      generatedAnimals.push(angular.copy(baseAnimals[i - 1]));
    } else {
      const base = baseAnimals[(i - 1) % 10];
      const indexStr = i < 10 ? `0${i}` : `${i}`;
      const padZero = (num: number) => num < 10 ? `000${num}` : num < 100 ? `00${num}` : `0${num}`;

      let practico = "";
      let unico = "";
      let categoria = base.categoria;
      let estatus = "Activo";
      let fechaNacimiento = base.fechaNacimiento;
      let edad = base.edad;
      let lote = base.lote;
      let descripcion = base.descripcion;
      let composicion = base.composicion + "_" + i;
      let madre = base.madre;

      if (categoria === "Vaca") {
        practico = padZero(i);
        unico = padZero(i);
      } else if (categoria === "Embrión") {
        practico = `EM${indexStr}`;
        unico = `EM${indexStr}`;
      } else if (categoria === "Semen") {
        practico = `SM${indexStr}`;
        unico = `SM${indexStr}`;
      } else {
        practico = `BCA${indexStr}`;
        unico = `BCA${indexStr}`;
      }

      generatedAnimals.push({
        practico,
        unico,
        categoria,
        estatus,
        fechaNacimiento,
        edad,
        lote,
        descripcion,
        composicion,
        racial: "",
        etiquetas: "",
        activos: "",
        padre: "",
        madre
      });
    }
  }

  $scope.animals = generatedAnimals;
  $scope.selectedAnimals = {};
  $scope.selectAll = false;

  $scope.toggleSelectAll = () => {
    // Only toggle for items currently displayed on the active page
    const pageItems = $scope.getCurrentPageItems();
    pageItems.forEach((animal: any) => {
      $scope.selectedAnimals[animal.practico] = $scope.selectAll;
    });
  };

  // Pagination state variables
  $scope.currentPage = 1;
  $scope.itemsPerPage = 10;
  $scope.totalPages = Math.ceil($scope.animals.length / $scope.itemsPerPage);

  $scope.pages = [];
  for (let i = 1; i <= $scope.totalPages; i++) {
    $scope.pages.push(i);
  }

  $scope.setPage = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > $scope.totalPages) {
      return;
    }
    $scope.currentPage = pageNumber;
    $scope.selectAll = false; // Reset selectAll when page changes
  };

  $scope.getCurrentPageItems = () => {
    const start = ($scope.currentPage - 1) * $scope.itemsPerPage;
    return $scope.animals.slice(start, start + $scope.itemsPerPage);
  };
}]);

// Interfaces for Event Categories
interface EventCategory {
  titulo: string;
  iconoType: 'reproductivos' | 'productivos' | 'inventarios' | 'veterinarios' | 'otros';
  enlaces: string[];
}

// Controller for Event Center View
app.controller('EventosController', ['$scope', function($scope: any) {
  $scope.categories = [
    {
      titulo: "Reproductivos",
      iconoType: "reproductivos",
      enlaces: ["Servicios", "Revisiones", "Partos", "Abortos", "Celos", "Embriones"]
    },
    {
      titulo: "Productivos",
      iconoType: "productivos",
      enlaces: ["Pesajes de leche", "Secados", "Crecimientos"]
    },
    {
      titulo: "Inventarios",
      iconoType: "inventarios",
      enlaces: ["Inventarios", "Cambios de lote"]
    },
    {
      titulo: "Veterinarios",
      iconoType: "veterinarios",
      enlaces: ["Mastitis", "Clínicos", "Planes sanitarios"]
    },
    {
      titulo: "Otros",
      iconoType: "otros",
      enlaces: ["Comentarios", "Otros cambios", "Eliminación Eventos", "Afiliaciones", "Producciones diarias"]
    }
  ];
}]);

// Interfaces for Report Categories
interface ReportCategory {
  titulo: string;
  iconoType: 'gestion' | 'animales' | 'historicos' | 'multirebanos';
  reportes: string[];
}

// Controller for Report Center View
app.controller('ReportesController', ['$scope', function($scope: any) {
  $scope.categories = [
    {
      titulo: "Gestión",
      iconoType: "gestion",
      reportes: ["Inventarios", "Movimientos", "Distribución normal", "Técnicos", "Reproductores"]
    },
    {
      titulo: "Animales",
      iconoType: "animales",
      reportes: ["Vientres", "Próximas a secar", "Próximas a parir", "Próximas a revisar", "Animales secos", "Animales lactando", "Animales criando", "No Vientres"]
    },
    {
      titulo: "Históricos",
      iconoType: "historicos",
      reportes: ["Historia de reproducciones", "Historia de lactancias", "Historia de pesajes de leche", "Historia de crecimientos"]
    },
    {
      titulo: "Multirebaños",
      iconoType: "multirebanos",
      reportes: ["Inventario multirebaño", "Situación reproductiva actual", "Distribución por preñez", "Situación productiva actual", "Transacciones", "Producciones diarias"]
    }
  ];
}]);

// Interfaces for Settings
interface GeneralConfig {
  propietario: string;
  nombre: string;
  pais: string;
  especie: string;
  tipoExplotacion: string;
  tipoManejo: string;
  zonaAgroecologica: string;
}

// Controller for Settings View
app.controller('AjustesController', ['$scope', function($scope: any) {
  $scope.menuActivo = 'configuracion';
  $scope.tabActivo = 'general';

  $scope.configuracionGeneral = {
    propietario: "AgroTech LLC, 2026",
    nombre: "Rebaño de Prueba",
    pais: "Venezuela",
    especie: "Vacunos",
    tipoExplotacion: "Doble propósito",
    tipoManejo: "Estabulado",
    zonaAgroecologica: "Desierto Tropical con Maleza"
  };

  // Lists for dropdown options
  $scope.paises = ["Venezuela", "Colombia", "Ecuador", "Panamá", "Brasil", "Argentina"];
  $scope.especies = ["Vacunos", "Bufalinos", "Caprinos", "Ovinos"];
  $scope.tiposExplotacion = ["Doble propósito", "Carne", "Leche", "Cría"];
  $scope.tiposManejo = ["Estabulado", "Semi-estabulado", "Pastoreo intensivo", "Pastoreo extensivo"];
  $scope.zonasAgroecologicas = [
    "Desierto Tropical con Maleza",
    "Bosque Seco Tropical",
    "Bosque Húmedo Tropical",
    "Sabana Tropical"
  ];

  // Actions
  $scope.guardar = function() {
    alert("Configuración guardada con éxito:\n" + JSON.stringify($scope.configuracionGeneral, null, 2));
  };

  $scope.restablecer = function() {
    $scope.configuracionGeneral = {
      propietario: "AgroTech LLC, 2026",
      nombre: "Rebaño de Prueba",
      pais: "Venezuela",
      especie: "Vacunos",
      tipoExplotacion: "Doble propósito",
      tipoManejo: "Estabulado",
      zonaAgroecologica: "Desierto Tropical con Maleza"
    };
  };
}]);
