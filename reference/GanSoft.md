# AgroTech - Especificación Exhaustiva de Arquitectura, Rutas, Opciones y Campos de la Plataforma

> **Plataforma:** AgroTech (Gestión y Control Pecuario / Ganadería Inteligente en la Nube)  
> **Dominio de Aplicación Web:** `https://pt0a.agrotech.io` (React 19 + TypeScript 5 + Vite 5 SPA)  
> **Sistema Base de Referencia:** GanSoft v1.19.3.0  
> **Fecha de Documentación:** 11 de Septiembre de 2026  

---

## Tabla de Contenidos

1. [Visión General y Pila Tecnológica](#1-visión-general-y-pila-tecnológica)
2. [Estructura Global de Navegación y UI](#2-estructura-global-de-navegación-y-ui)
3. [Catálogo Maestro de Rutas y Componentes](#3-catálogo-maestro-de-rutas-y-componentes)
4. [Módulo de Semovientes: Ficha y Expediente Individual del Animal (`/records/animals/{id}` / `/animales/{id}`)](#4-módulo-de-semovientes-ficha-y-expediente-individual-del-animal)
5. [Módulo de Semovientes: Listado Maestro y Formulario de Alta (`/animales` / `/animals`)](#5-módulo-de-semovientes-listado-maestro-y-formulario-de-alta)
6. [Centro de Eventos al Detalle (`/eventos` / `/events`) - Formularios y Campos](#6-centro-de-eventos-al-detalle-eventos--events)
   - 6.1 Eventos Reproductivos (Servicios, Revisiones, Partos, Abortos, Celos, Embriones)
   - 6.2 Eventos Productivos (Pesajes de Leche, Secados, Crecimientos)
   - 6.3 Eventos de Inventarios (Inventarios Físicos, Cambios de Lote)
   - 6.4 Eventos Veterinarios (Mastitis, Clínicos, Planes Sanitarios)
   - 6.5 Eventos de Potreros (Labores, Rotaciones, Planificaciones)
   - 6.6 Otros Eventos (Comentarios, Otros Cambios, Eliminación Eventos, Afiliaciones, Producciones Diarias)
7. [Centro de Reportes al Detalle (`/reportes` / `/reports`) - 23 Informes Zootécnicos](#7-centro-de-reportes-al-detalle-reportes--reports)
   - 7.1 Reportes de Gestión (Inventarios, Movimientos, Distribución Normal, Técnicos, Reproductores)
   - 7.2 Reportes de Animales (Vientres, Próximas a Secar, Próximas a Parir, Próximas a Revisar, Secos, Lactando, Criando, No Vientres)
   - 7.3 Reportes Históricos (Historia Reproducciones, Historia Lactancias, Historia Pesajes Leche, Historia Crecimientos)
   - 7.4 Reportes Multirebaño (Inventario, Reproducción, Distribución Preñez, Situación Productiva, Transacciones, Producción Diaria)
   - 7.5 Arquitectura de Componentes de Reportes (Drawers, Modales, Gráficos, Exportación)
8. [Mapas GIS y Potreros al Detalle (`/mapas`, `/potreros`)](#8-mapas-gis-y-potreros-al-detalle-mapas-potreros)
   - 8.1 Visualizador Cartográfico GIS (`/mapas` / `/maps`)
   - 8.2 Maestro de Potreros y Pasturas (`/potreros` / `/paddocks`)
9. [Ajustes y Configuración al Detalle (`/ajustes` / `/settings`)](#9-ajustes-y-configuración-al-detalle-ajustes--settings)
   - 9.1 Pestaña General
   - 9.2 Pestaña Parámetros
   - 9.3 Pestaña Alertas
   - 9.4 Pestaña Automatización
   - 9.5 Catálogos Base (Lotes, Colores, Propietarios, Diagnósticos, Tratamientos, Clasificaciones)
10. [Técnicos y Personal (`/technicians` / `/reports/technicians`)](#10-técnicos-y-personal-technicians)
11. [Multi-Rebaño y Selector de Contexto (`AppContext`)](#11-multi-rebaño-y-selector-de-contexto-appcontext)
12. [Matriz Jerárquica del Sistema AgroTech](#12-matriz-jerárquica-del-sistema-agrotech)
13. [Índice de Evidencias Visuales y Referencias](#13-índice-de-evidencias-visuales-y-referencias)

---

## 1. Visión General y Pila Tecnológica

**AgroTech** es una plataforma integral de software zootécnico y agronómico de grado empresarial para la gestión, control y analítica predictiva de explotaciones ganaderas bovinas (leche, carne y doble propósito), bufalinas y de especies menores. Está adaptada de la especificación funcional de referencia GanSoft e implementada sobre una arquitectura web moderna y desacoplada.

### Pila Tecnológica de AgroTech:
- **Frontend / UI:** **React 19** (`react` 19.3.0, `react-dom` 19.3.0) con componentes funcionales, hooks personalizados y tipado estricto en **TypeScript 5**.
- **Entorno de Compilación y Bundler:** **Vite 5** con compilación HMR ultra-rápida y empaquetado optimizado.
- **Enrutamiento:** **React Router 7** (`react-router-dom` 7.18.3) con soporte bilingüe integral (español e inglés) para todas las vistas principales y rutas hijas.
- **Gráficos & Visualización:** **Chart.js 4** (`chart.js` 4.5.1), **React-Chartjs-2** (5.3.1) y **Chartjs-Plugin-Datalabels** (2.2.0) para tableros KPI, gráficos de dona (*Doughnut Charts*) de inventario y estado reproductivo/productivo, y campanas de Gauss de distribución normal.
- **Iconografía:** **Lucide React** (`lucide-react` 1.43.0), garantizando un diseño limpio, accesible y consistente.
- **Cartografía GIS:** Módulo interactivo de visualización satelital y vectorial de potreros (`/mapas`) con delimitación de polígonos, capas satelitales (ArcGIS World Imagery), cálculo de áreas (ha), capacidad de carga (UGG/ha) y tooltips dinámicos.
- **Gestión de Estado y Contexto:** **React Context API** (`AppContext`) con persistencia local de rebaño activo (*"Rebaño de Prueba"*), configuración zootécnica y sincronización de datos entre módulos.
- **Estilos & UI System:** Hojas de estilo CSS3 modulares (`main.css`, `reports.css`) con variables de diseño orgánicas (`--primary-color: #2d6a4f`, `--primary-light: #52b788`, `--primary-ultra-light: #e8f5e9`, `--bg-mint: #f3f5f4`) y tipografía moderna *Outfit*.

---

## 2. Estructura Global de Navegación y UI

### 2.1 Barra Superior (Top Bar)
- **Logo AgroTech:** Isotipo de hoja verde y tipografía oficial; link directo a la raíz/dashboard (`/dashboard`).
- **Selector de Contexto / Rebaño:** 
  - Muestra el nombre del rebaño actual (ej. *Rebaño de Prueba*).
  - Gestionado a través de `AppContext` con selector dropdown de unidades de producción autorizadas (*Rebaño de Prueba*, *Hacienda El Paraíso*, *Finca Santa María*).
- **Barra de Búsqueda Global:**
  - Input reactivo con icono de lupa y placeholder *"Buscar animales..."*.
  - Búsqueda en tiempo real por arete práctico, código único, lote o categoría zootécnica.
- **Menú de Perfil de Usuario (Avatar superior derecho):**
  - Muestra la inicial o foto del usuario autenticado (ej. *Dave Canache*, `davehcanache@gmail.com`).
  - Menú desplegable con accesos a:
    1. `Perfil del Usuario`: Información de la cuenta y preferencias.
    2. `Cerrar Sesión`: Cierre de sesión y restablecimiento de estado.
- **Widget de Soporte en Vivo (Esquina inferior derecha):**
  - Botón flotante circular verde con icono de chat y tooltip *"Favor, Déjanos tu mensaje"*, que despliega el canal de asistencia técnica.

### 2.2 Barra Lateral de Módulos (Sidebar Izquierdo)
Barra vertical fija con iconos estilizados y tooltips flotantes:
1. `LayoutGrid` -> **Dashboard** (`/dashboard`)
2. `Map` -> **Mapas** (`/mapas` / `/maps`)
3. `Tag` -> **Animales** (`/animales` / `/animals`)
4. `Trees` / `Sprout` -> **Potreros** (`/potreros` / `/paddocks`)
5. `Calendar` -> **Centro de Eventos** (`/eventos` / `/events`)
6. `BarChart3` -> **Centro de Reportes** (`/reportes` / `/reports`)
7. `SlidersHorizontal` -> **Ajustes** (`/ajustes` / `/settings`)

---

## 3. Catálogo Maestro de Rutas y Componentes

| Ruta Relativa (ES) | Ruta Alias (EN) | Componente React | Módulo / Pantalla |
| :--- | :--- | :--- | :--- |
| `/` | `/` | `Navigate to="/dashboard"` | Redirección Inicial |
| `/dashboard` | `/dashboard` | `<DashboardView />` | Tablero Analítico con KPIs y Gráficos |
| `/animales` | `/animals` | `<AnimalesView />` | Catálogo Maestro de Semovientes |
| `/animales/:id` | `/records/animals/:id`| `<FichaAnimalModal />` / Vista Detalle | Expediente Técnico Individual del Animal |
| `/eventos` | `/events` | `<EventosView />` | Centro de Eventos y Hub Operativo |
| `/potreros` | `/paddocks` | `<PotrerosView />` | Maestro de Potreros y Carga Animal |
| `/mapas` | `/maps` | `<MapasView />` | Cartografía GIS Satelital de la Finca |
| `/reportes` | `/reports` | `<ReportesView />` | Centro de Reportes (23 Informes) |
| `/reportes/allreports` | `/reports/allreports` | `<ReportesView />` | Hub y Creador de Reportes |
| `/reportes/inventarios` | `/reports/inventories` | `<InventariosView />` | Reporte de Inventarios por Lote y Categoría |
| `/reportes/movimientos` | `/reports/movements` | `<MovimientosView />` | Reporte de Movimientos y Traslados |
| `/reportes/distribucion-normal` | `/reports/historics/normaldistribution` | `<DistribucionNormalView />` | Análisis Biométrico (Campana de Gauss) |
| `/reportes/tecnicos` | `/reports/technicians` | `<TecnicosView />` | Rendimiento y Eficiencia de Técnicos |
| `/reportes/reproductores` | `/reports/breeders` / `sires` | `<ReproductoresView />` | Prueba de Progenie y Sementales |
| `/reportes/vientres` | `/reports/dams` / `females` | `<VientresView />` | Padrón de Hembras y Vientres |
| `/reportes/proximas-secar` | `/reports/nexttodry` | `<ProximasSecarView />` | Alertas de Vacas Próximas a Secar |
| `/reportes/proximas-parir` | `/reports/nexttobirth` | `<ProximasParirView />` | Alertas de Vacas Próximas al Parto |
| `/reportes/proximas-revisar` | `/reports/nexttocheck` | `<ProximasRevisarView />` | Vientres con Diagnóstico Pendiente |
| `/reportes/animales-secos` | `/reports/drycows` | `<AnimalesSecosView />` | Censo de Hembras en Período Seco |
| `/reportes/animales-lactando`| `/reports/cowsinproduction` | `<AnimalesLactandoView />` | Vacas en Ordeño y Producción Activa |
| `/reportes/animales-criando` | `/reports/cowsraising` | `<AnimalesCriandoView />` | Vacas Criando con Cría al Pie |
| `/reportes/no-vientres` | `/reports/nodams` | `<NoVientresView />` | Animales de Levante, Recría y Ceba |
| `/reportes/historicos/reproducciones` | `/reports/historics/reproductions` | `<HistoriaReproduccionesView />` | Historial Vitalicio de Reproducción |
| `/reportes/historicos/lactancias` | `/reports/historics/lactations` | `<HistoriaLactanciasView />` | Curvas y Desempeño Inter-Lactancias |
| `/reportes/historicos/pesajes-leche` | `/reports/historics/milks` | `<HistoriaPesajesLecheView />` | Pesajes de Leche Diarios (AM/PM) |
| `/reportes/historicos/crecimientos` | `/reports/historics/weighings` | `<HistoriaCrecimientosView />` | Curvas de Crecimiento y Ganancia Diaria |
| `/reportes/multirebanos/inventarios` | `/reports/multiherds/inventories` | `<MultirebanoInventarioView />` | Inventario Consolidado Multirebaño |
| `/reportes/multirebanos/reproduccion`| `/reports/multiherds/reproduction`| `<MultirebanoReproduccionView />`| Comparativo Reproductivo Multirebaño |
| `/reportes/multirebanos/distribucion-prenez` | `/reports/multiherds/pregnancy-distribution` | `<MultirebanoDistribucionPrenezView />` | Distribución de Gestaciones Multirebaño |
| `/reportes/multirebanos/situacion-productiva`| `/reports/multiherds/production-status` | `<MultirebanoProduccionView />` | Eficiencia Productiva Multirebaño |
| `/reportes/multirebanos/transacciones` | `/reports/multiherds/transactions` | `<MultirebanoTransaccionesView />` | Guías y Transferencias entre Fincas |
| `/reportes/multirebanos/produccion-diaria` | `/reports/multiherds/daily-production` | `<MultirebanoProduccionDiariaView />` | Acopio Lechero Global Diario |
| `/ajustes` | `/settings/general` | `<AjustesView />` | Configuración General y Catálogos Base |

---

## 4. Módulo de Semovientes: Ficha y Expediente Individual del Animal

Al hacer clic sobre cualquier semoviente en la tabla maestra o ingresar directamente a `/animales/:id`, el sistema abre la ficha técnica del semoviente mediante el componente interactivo `FichaAnimalModal` (o vista de expediente individual).

```
+--------------------------------------------------------------------------------------------------+
|  Ficha del Semoviente: 0001                                                [Badge: ACTIVO]   [X] |
|  Código Único: 0001 | Lote: Lote 01 | Categoría: Vaca | Raza: RN19TI14                           |
|  Edad: 17,8 Años    | Estado Reprod.: Preñada (2)     | Estado Prod.: Ordeño                     |
+--------------------------------------------------------------------------------------------------+
| [1. General & Identificación]   [2. Estado Reproductivo]   [3. Producción & Rendimiento]         |
+--------------------------------------------------------------------------------------------------+
```

### 4.1 Encabezado y Métricas Clave
- **Código Práctico (Arete):** Identificador visible de manejo de campo (ej. `0001`, `BCA01`).
- **Código Único:** Identificador oficial nacional o chip electrónico (ej. `VE-01-0001-92`).
- **Categoría Zootécnica:** Badge dinámico (*Vaca, Becerra, Mauta, Novilla, Becerro, Maute, Toro, Semen, Embrión*).
- **Estatus Vital:** Badge visual (*Activo, Inactivo, Vendido, Descartado, Muerto*).
- **Situación Reproductiva:** *Vacía, Preñada con días de gestación calculados, En espera*.
- **Situación Productiva:** *En Ordeño, Seca, Criando*.
- **Ubicación:** Lote de manejo actual (ej. *Lote 01*) y Potrero asignado (ej. *POT1*).

### 4.2 Pestañas de Detalle Histórico

#### Pestaña 1: General & Identificación
- Código Práctico, Código Único, Nombre o alias del animal.
- Sexo (*Hembra / Macho*), Fecha de nacimiento y cálculo dinámico de edad (años y meses).
- Especie (*Vacunos, Bufalinos*), Color / Pelaje, Hierro o marca de fuego, Número de Chip/RFID.
- Propietario asignado y porcentaje de tenencia.
- Composición racial (código de raza ej. `RN19TI14` y desglose de sangres).
- Origen del animal (*Nacido en finca, Comprado, Transferencia externa*).

#### Pestaña 2: Estado Reproductivo e Historial Ginecológico
- Resumen ginecológico: Situación actual, Días de gestación, Fecha probable de parto (FPP).
- Macho preñador o pajuela de semen asignada.
- Total de partos acumulados, Intervalo Entre Partos (IEP) promedio y Días Abiertos.
- Historial cronológico de servicios (IA/Monta), revisiones (palpación/ecografía), partos y abortos.

#### Pestaña 3: Producción de Leche y Rendimiento
- Días en Leche (DEL) de la lactancia activa.
- Último pesaje de leche registrado (kg), promedio diario de lactancia y producción acumulada.
- Fecha del último secado y duración del descanso mamario.
- Condición corporal actual y curva de lactancia proyectada.

---

## 5. Módulo de Semovientes: Listado Maestro y Formulario de Alta (`/animales` / `/animals`)

### 5.1 Vistas y Filtros del Listado Maestro
- **Filtros Rápidos de Cabecera:**
  - `Todos los animales`: Catálogo completo de semovientes activos en el rebaño.
  - `Vientres`: Hembras en edad reproductiva (Novillas y Vacas).
  - `No Vientres`: Crías, mautes, becerros y animales de ceba.
  - `Reproductores`: Toros padres activos, pajuelas de semen y embriones.
- **Acciones Masivas en Toolbar (`AnimalesToolbar`):**
  - `label` **Asignar etiqueta:** Asignación masiva de tags a los animales seleccionados con checkbox.
  - `delete` **Eliminar Animales:** Baja lógica o descarte de semovientes seleccionados.
  - `move_up` **Mover Animales:** Reubicación de lote o potrero en bloque.
  - `restore_page` **Restaurar Animales:** Recuperación de registros inactivos o archivados.
  - **Exportación:** Descarga instantánea en Excel (`.xlsx`) y Documento Portable (`.pdf`).
- **Paginación Dinámica (`AnimalesPagination`):** Selector de página, conteo total de registros y navegación fluida.

### 5.2 Formulario Modal de Alta de Semoviente (`+ Agregar Animal`)
Wizard o diálogo modal con 4 secciones de captura:
1. **Identificación:** Código práctico obligatorio, código único opcional, nombre, sexo, fecha de nacimiento y especie.
2. **Ubicación & Propiedad:** Lote, potrero, propietario, color y etiquetas.
3. **Genealogía:** Padre (toro o código de semen), Madre (vaca del rebaño) y composición racial.
4. **Desarrollo Ponderal:** Peso al nacer (kg) y peso actual registrado en báscula.

---

## 6. Centro de Eventos al Detalle (`/eventos` / `/events`)

El Centro de Eventos (`EventosView`) centraliza las transacciones operativas diarias del predio mediante una tabla de tareas y vencimientos, y una grilla interactiva con 6 categorías maestras:

```
+--------------------------------------------------------------------------------------------------+
|  Centro de Eventos                                               [Engranaje v]   [Ajustes Tune]  |
|  +--------------------------------------------------------------------------------------------+  |
|  | Fecha        | Código Animal  | Tipo de Evento       | Vencimiento / Próx. Acción | Acciones   |  |
|  +--------------------------------------------------------------------------------------------+  |
|                                                                                                  |
|  [REPRODUCTIVOS]       [PRODUCTIVOS]        [INVENTARIOS]       [VETERINARIOS]      [POTREROS]   |
|  > Servicios           > Pesajes leche      > Inventarios       > Mastitis          > Labores    |
|  > Revisiones          > Secados            > Cambios de lote   > Clínicos          > Rotaciones |
|  > Partos              > Crecimientos                           > Planes sanitarios > Planificac.|
|  > Abortos                                                                                       |
|  > Celos                                    [OTROS EVENTOS]                                      |
|  > Embriones                                > Comentarios | Otros cambios | Eliminación Eventos  |
+--------------------------------------------------------------------------------------------------+
```

### 6.1 Eventos Reproductivos
1. **Servicios (`/events/services`):** Fecha/hora, código de hembra, tipo de servicio (IA, Monta natural, IATF), macho/pajuela, lote de semen, técnico inseminador, condición del celo y horario AM/PM.
2. **Revisiones Ginecológicas (`/events/checks`):** Fecha, diagnóstico de preñez (*Preñada, Vacía, Dudosa*), días de gestación estimados, estructuras ováricas (cuerpo lúteo, folículo) y técnico veterinario.
3. **Partos:** Fecha de alumbramiento, código de la vaca parturienta, tipo de parto (*Normal, Asistido, Distócico, Cesárea*), condición de la cría (*Viva, Muerta*), alta automática de la cría en el inventario con su peso al nacer y sexo.
4. **Abortos (`/events/abortions`):** Fecha de interrupción, días de gestación abortados, causa probable (infecciosa, traumática) y tratamiento post-aborto.
5. **Celos (`/events/heats`):** Fecha/hora de detección, intensidad del celo (*Franco, Moderado, Silencioso*), signos observados y acción derivada.
6. **Embriones (`/events/embryos`):** Donadora/receptora, código de embrión, cuerpo lúteo, cuerno receptor y veterinario especialista.

### 6.2 Eventos Productivos
1. **Pesajes de Leche (`/events/milks`):** Fecha de control lechero, turno mañana (kg), turno tarde (kg), total diario calculado, y parámetros opcionales (% grasa, % proteína, RCS).
2. **Secados y Destetes (`/events/dryweanings`):** Fecha de secado, código de vaca, motivo de secado (programado, baja producción, indicación médica), terapia de vaca seca aplicada y lote de destino de cría destetada con su peso.
3. **Crecimientos (Pesajes Corporales):** Fecha de pesaje, código de animal, peso en báscula (kg), condición corporal (1 a 5), y cálculo automático de la ganancia diaria de peso (GDP).

### 6.3 Eventos de Inventarios
1. **Inventarios Físicos (`/events/inventories`):** Fecha de auditoría, lote/potrero evaluado, verificación de aretes presentes y detección de faltantes o sobrantes.
2. **Cambios de Lote:** Fecha de traslado, modo individual o masivo, lote de origen, lote de destino, potrero receptor y motivo de reubicación.

### 6.4 Eventos Veterinarios
1. **Mastitis (`/events/mastities`):** Fecha de detección, código de vaca, tipo (*Clínica / Subclínica*), cuartos afectados (AD, AI, PD, PI), grado CMT, tratamiento aplicado y días de retiro de leche.
2. **Eventos Clínicos:** Fecha de atención, diagnóstico/patología, signos clínicos, medicamento y dosis, días de retiro en carne/leche y veterinario tratante.
3. **Planes Sanitarios:** Jornadas colectivas de vacunación, desparasitación interna o baños garrapaticidas, lote del fármaco, dosis por animal y fecha de revacunación.

### 6.5 Eventos de Potreros
1. **Labores:** Fertilización, control mecánico/químico de malezas, mantenimiento de cercas, resiembra y aforo forrajero.
2. **Rotaciones:** Entrada y salida de lotes a potreros, registro de días de ocupación y cálculo de presión de pastoreo.
3. **Planificaciones:** Programación del calendario de rotación y descanso de pasturas.

### 6.6 Otros Eventos
- **Comentarios:** Registro de bitácora y observaciones zootécnicas de campo.
- **Otros Cambios:** Reareteo por pérdida, cambio de nombre o reasignación de hierro.
- **Eliminación de Eventos:** Auditoría y corrección de eventos registrados erróneamente.
- **Afiliaciones:** Registro en libros genealógicos de asociaciones de raza.
- **Producciones Diarias:** Cierre global diario de leche despachada a planta receptora o quesería.

---

## 7. Centro de Reportes al Detalle (`/reportes` / `/reports`)

AgroTech incorpora el catálogo completo de **23 reportes zootécnicos estándar**, agrupados en 4 áreas funcionales, implementados en componentes modulares con tablas de alta densidad, paginación reactiva, filtros laterales (*Drawers*), modales de inspección y exportación instantánea a Excel (`.xlsx`) y PDF:

### 7.1 Reportes de Gestión
1. **Inventarios (`/reports/inventories` / `/reportes/inventarios`):** Censo demográfico consolidado por categoría, lote, especie y cálculo de Unidades Gran Ganado (UGG). Modal: `AnalisisInventarioModal`.
2. **Movimientos (`/reports/movements` / `/reportes/movimientos`):** Registro cronológico de entradas, salidas y transferencias internas de animales. Modales: `DetalleMovimientoModal`, `NuevoMovimientoModal`.
3. **Distribución Normal (`/reports/historics/normaldistribution` / `/reportes/distribucion-normal`):** Análisis biométrico de variables clave (pesos, producción) con campana de Gauss renderizada mediante `NormalDistributionChart` (Chart.js), media (µ), desviación estándar (σ) y percentiles.
4. **Técnicos (`/reports/technicians` / `/reportes/tecnicos`):** Auditoría de desempeño del personal técnico, servicios realizados, preñeces confirmadas y tasa de concepción (%). Modal: `FichaTecnicoModal`.
5. **Reproductores (`/reports/breeders` / `/reportes/reproductores`):** Evaluación de toros sementales y pajuelas de semen, servicios y calidad de progenie. Modal: `FichaReproductorModal`.

### 7.2 Reportes de Animales
1. **Vientres (`/reports/dams` / `/reportes/vientres`):** Padrón de hembras reproductoras (vacas y novillas), estado reproductivo, paridad, IEP y días abiertos.
2. **Próximas a Secar (`/reports/nexttodry` / `/reportes/proximas-secar`):** Alertas preventivas de hembras que deben cesar su ordeño según su fecha probable de parto.
3. **Próximas a Parir (`/reports/nexttobirth` / `/reportes/proximas-parir`):** Hembras gestantes con fecha de parto inminente para traslado al lote de maternidad.
4. **Próximas a Revisar (`/reports/nexttocheck` / `/reportes/proximas-revisar`):** Vientres servidos pendientes de confirmación de preñez por palpación o ecografía.
5. **Animales Secos (`/reports/drycows` / `/reportes/animales-secos`):** Padrón de vacas en período seco no lactantes.
6. **Animales Lactando (`/reports/cowsinproduction` / `/reportes/animales-lactando`):** Vacas en ordeño con días en leche (DEL), último pesaje y producción acumulada.
7. **Animales Criando (`/reports/cowsraising` / `/reportes/animales-criando`):** Vacas con ternero al pie en sistemas de cría o doble propósito.
8. **No Vientres (`/reports/nodams` / `/reportes/no-vientres`):** Censo de machos, terneros, mautes y novillos en proceso de levante o ceba.

### 7.3 Reportes Históricos
1. **Historia de Reproducciones (`/reports/historics/reproductions`):** Registro vitalicio de partos, abortos, servicios e intervalos inter-parto por vientre.
2. **Historia de Lactancias (`/reports/historics/lactations`):** Desempeño productivo acumulado por lactancia y proyección estandarizada a 305 días.
3. **Historia de Pesajes Leche (`/reports/historics/milks`):** Controles lecheros individuales periódicos con pesajes AM y PM.
4. **Historia de Crecimientos (`/reports/historics/weighings`):** Evolución del peso corporal a lo largo de la vida del animal y ganancia diaria de peso.

### 7.4 Reportes Multirebaños
1. **Inventario Multirebaño (`/reports/multiherds/inventories`):** Consolidado patrimonial de semovientes entre todas las fincas del grupo ganadero.
2. **Situación Reproductiva (`/reports/multiherds/reproduction`):** Tasa de preñez global y comparativa de fertilidad entre haciendas.
3. **Distribución por Preñez (`/reports/multiherds/pregnancy-distribution`):** Desglose de hembras preñadas por trimestre de gestación y proyección de partos.
4. **Situación Productiva (`/reports/multiherds/production-status`):** Porcentaje de vacas del hato en ordeño vs vacas secas por finca.
5. **Transacciones (`/reports/multiherds/transactions`):** Guías de movilización y transferencias de ganado entre predios.
6. **Producciones Diarias (`/reports/multiherds/daily-production`):** Volumen global de leche entregada diariamente a centros de acopio.

---

## 8. Mapas GIS y Potreros al Detalle (`/mapas`, `/potreros`)

### 8.1 Visualizador Cartográfico GIS (`/mapas` / `/maps`)
Módulo cartográfico interactivo integrado (`MapasView`):
- **Capas de Visualización:** Conmutador entre capa Satelital HD (ArcGIS World Imagery), capa Topográfica de relieve y capa de Índice de Vegetación (NDVI).
- **Representación Vectorial de Potreros:** Polígonos interactivos georreferenciados que delimitan las cercas y divisiones de pastura.
- **Tooltips Flotantes Dinámicos:** Al interactuar con cualquier potrero, se despliega la ficha instantánea:
  - Código y nombre de la parcela (ej. *POT1 - Potrero de la Casa*).
  - Superficie calculada en hectáreas (ha) y perímetro en metros lineales.
  - Especie forrajera dominante (ej. *Brachiaria decumbens*, *Mombaza*).
  - Lote asignado actualmente pastando (ej. *Lote 01 - Vacas de Ordeño*).
  - Conteo de cabezas presentes y carga animal instantánea (UGG/ha).
  - Días de ocupación acumulados y estatus (*Activo, En Descanso, En Mantenimiento*).
- **Métricas GIS Consolidadas:** Barra superior de KPIs con Superficie Total (ha), Potreros Activos, Potreros en Descanso y Carga Promedio Global.

### 8.2 Maestro de Potreros y Pasturas (`/potreros` / `/paddocks`)
Tabla de administración agronómica de potreros (`PotrerosView`):
- **Columnas de Datos:** Código, Descripción, Área (ha), Especie Forrajera, Aforo Forrajero (kg MV/m²), Carga Máxima Recomendada (UGG/ha), Días de Ocupación Máximos, Días de Descanso Requeridos y Estatus.
- **Toolbar Operativo:** Buscador reactivo, disparador de filtro lateral (`PotrerosFilterDrawer`), exportación a Excel y PDF, y botón `+ Nuevo Potrero`.
- **Modal de Alta / Edición (`NuevoPotreroModal`):** Formulario de captura para crear o modificar divisiones de pastura con validación zootécnica.

---

## 9. Ajustes y Configuración al Detalle (`/ajustes` / `/settings`)

El módulo de Ajustes (`AjustesView`) centraliza las directrices zootécnicas y parámetros de cálculo del sistema, con sincronización reactiva en `AppContext` y botones de acción en cabecera:
- `Restablecer`: Revierte los valores a los valores de fábrica por defecto.
- `Guardar`: Persiste los parámetros zootécnicos del rebaño.

### 9.1 Pestaña General
- **Propietario:** Razón social o titular de la explotación ganadera.
- **Nombre del Rebaño:** Nombre de la unidad de producción (ej. *Rebaño de Prueba*).
- **País:** Catálogo internacional completo (con formato numérico y moneda, default *Venezuela*).
- **Especie:** Dropdown zootécnico (*Vacunos, Bufalinos, Equinos, Ovinos, Caprinos, Porcinos, Otros*).
- **Tipo de Explotación:** *Doble propósito, Leche especializado, Carne / Cría, Ceba / Engorde*.
- **Tipo de Manejo:** *Estabulado, Semiestabulado, Pastoreo Intensivo, Pastoreo Extensivo*.
- **Zona Agroecológica:** Clasificación Holdridge (*Desierto Tropical con Maleza, Bosque Seco Tropical, Bosque Húmedo Tropical, Sabana Tropical*).

### 9.2 Pestaña Parámetros
- Duración promedio de la gestación (283 días en vacunos; 310 días en bufalinos).
- Días de Espera Voluntaria (DEV, ej. 50 días post-parto).
- Duración ideal del período seco (60 días).
- Edad mínima al primer servicio en novillas (15 a 18 meses) y peso mínimo (320 kg).
- Edad estándar de destete (205 días / 7 meses).
- Umbral de baja producción para secado sugerido (3.0 kg/día).

### 9.3 Pestaña Alertas
- Aviso previo a la fecha probable de parto (15 días de anticipación).
- Días post-servicio para programar diagnóstico de preñez (45 días).
- Aviso previo a la fecha de secado (15 días).
- Alerta de celos repetidos (más de 3 servicios fallidos).
- Control de tiempo de retiro farmacológico obligatorio.

### 9.4 Pestaña Automatización
- Transición automática de categorías etarias (Becerra -> Mauta a los 8 meses; Mauta -> Novilla a los 18 meses).
- Promoción automática a Vaca tras registrar el primer parto.
- Conmutación automática a estatus Seca tras el registro del secado.
- Cambio automático de situación reproductiva a Preñada tras palpación positiva.

### 9.5 Catálogos Base (Menú Lateral de Ajustes)
1. **Lotes (`/settings/lots`):** Grupos de manejo (*Ordeño, Maternidad, Secas, Horras, Destete, Recría*).
2. **Colores (`/settings/colors`):** Paleta cromática de identificación de aretes (*Blanco, Negro, Hosco, Barroso, Amarillo*).
3. **Propietarios (`/settings/owners`):** Titulares y marcas de hierro con porcentaje de participación.
4. **Diagnósticos (`/settings/diagnostics`):** Nomenclatura médica veterinaria (*Mastitis Grado 2, Anaplasmosis, Pododermatitis*).
5. **Tratamientos (`/settings/treatments`):** Vademécum farmacológico, dosis y tiempos de retiro en leche y carne.
6. **Clasificaciones (`/settings/classifications`):** Escalas de conformación fenotípica y mérito genético.

---

## 10. Técnicos y Personal (`/technicians`)

Módulo de gestión del equipo humano de la finca (`TecnicosView`):
- Directorio de médicos veterinarios, inseminadores artificiales, ecografistas y mayordomos.
- Registro de cédula/licencia profesional, especialidad y teléfono/correo de contacto.
- Auditoría biométrica de desempeño: Tasa de concepción en IA (% de preñeces confirmadas / servicios realizados), precisión en palpaciones y atenciones clínicas registradas.

---

## 11. Multi-Rebaño y Selector de Contexto (`AppContext`)

AgroTech soporta una arquitectura multi-rebaño nativa gestionada mediante `AppContext`:
- El selector superior en el `Topbar` permite alternar dinámicamente entre las fincas autorizadas (*Rebaño de Prueba*, *Hacienda El Paraíso*, *Finca Santa María*).
- Al conmutar de predio, todo el estado reactivo del sistema (KPIs de dashboard, catálogo de semovientes, potreros, tareas del centro de eventos y reportes consolidados) se actualiza de manera instantánea y transparente.

---

## 12. Matriz Jerárquica del Sistema AgroTech

```text
AgroTech Platform (React 19 + TypeScript + Vite)
│
├── [1] BARRA SUPERIOR & NAVEGACIÓN GLOBAL
│   ├── Logo Oficial AgroTech (/dashboard)
│   ├── Selector Dinámico de Rebaño (AppContext)
│   ├── Buscador Global Instantáneo (Filtro por arete/único/lote)
│   ├── Menú de Usuario (Perfil Dave Canache / Cerrar Sesión)
│   └── Widget Flotante de Soporte en Vivo
│
├── [2] DASHBOARD (/dashboard)
│   ├── Tarjetas Métricas KPI:
│   │   ├── Promedio diario Última Lactancia (kg/día)
│   │   ├── Ganancia global de peso Hembras (kg/día)
│   │   ├── Ganancia global de peso Machos (kg/día)
│   │   └── Ganancia global de peso Maute (kg/día)
│   └── Gráficos de Estado (Chart.js / Doughnut):
│       ├── Inventario Actual por Categorías (Becerra, Mauta, Novilla, Vaca, Becerro, Maute, Toro)
│       ├── Situación Reproductiva Actual (Preñada, Vacía, En espera)
│       └── Situación Productiva Actual (Ordeño, Seca, Criando)
│
├── [3] MAPAS GIS (/mapas & /maps)
│   ├── Visualizador Satelital de Alta Resolución (ArcGIS World Imagery)
│   ├── Capas: Satelital HD, Topografía y Relieve, Vegetación (NDVI)
│   ├── Polígonos de Potreros con Georreferenciación y Cálculo de Área (ha)
│   ├── Tooltips Flotantes: Superficie, Forraje, Lote, Cabezas, Carga UGG/ha, Estatus
│   └── KPIs de Superficie y Presión de Pastoreo
│
├── [4] SEMOVIENTES (/animales & /animals)
│   ├── Filtros Rápidos: Todos los animales | Vientres | No Vientres | Reproductores
│   ├── Toolbar: Asignar etiqueta, Eliminar, Mover lote/potrero, Restaurar, Exportar XLSX/PDF
│   ├── Tabla Maestra de Alta Densidad con Checkboxes y Paginación
│   ├── Formulario de Alta (+) [Wizard: Identificación, Ubicación, Genealogía, Pesos]
│   └── Expediente Individual del Animal (/animales/:id & FichaAnimalModal):
│       ├── Cabecera de Ficha: Arete, Único, Lote, Potrero, Edad, Estado Reprod., Estado Prod.
│       ├── Pestaña 1: General & Identificación (Raza, Pelaje, Propietario, RFID, Notas)
│       ├── Pestaña 2: Reproducción e Historial Ginecológico (IEP, FPP, Servicios, Partos)
│       └── Pestaña 3: Producción de Leche y Rendimiento (DEL, Curvas, Pesajes, Secado)
│
├── [5] POTREROS (/potreros & /paddocks)
│   ├── Catálogo Maestro de Parcelas y Divisiones Forrajeras
│   ├── Métricas de Pastura: Área (ha), Especie Forrajera, Aforo (kg MV/m²), UGG/ha
│   ├── Control de Pastoreo: Días de ocupación máximos y días de descanso requeridos
│   ├── Modal de Alta de Potrero (NuevoPotreroModal)
│   └── Drawer de Filtros Avanzados (PotrerosFilterDrawer)
│
├── [6] CENTRO DE EVENTOS (/eventos & /events)
│   ├── Tabla de Tareas Programadas y Próximos Vencimientos
│   ├── Modal de Registro Rápido de Eventos (NuevoEventoModal)
│   ├── 1. Reproductivos: Servicios, Revisiones, Partos, Abortos, Celos, Embriones
│   ├── 2. Productivos: Pesajes de leche, Secados, Crecimientos
│   ├── 3. Inventarios: Inventarios físicos, Cambios de lote
│   ├── 4. Veterinarios: Mastitis (AD/AI/PD/PI, CMT), Clínicos, Planes sanitarios
│   ├── 5. Potreros: Labores agronómicas, Rotaciones, Planificaciones de pastura
│   └── 6. Otros: Comentarios, Otros cambios, Eliminación Eventos, Afiliaciones, Producciones diarias
│
├── [7] CENTRO DE REPORTES (/reportes & /reports)
│   ├── Hub de Informes con Buscador y Filtros Rápidos
│   ├── 1. Gestión (5): Inventarios, Movimientos, Distribución normal Gauss, Técnicos, Reproductores
│   ├── 2. Animales (8): Vientres, Próx. a secar, Próx. a parir, Próx. a revisar, Secos, Lactando, Criando, No Vientres
│   ├── 3. Históricos (4): Historia reproducciones, Historia lactancias, Historia pesajes leche, Historia crecimientos
│   ├── 4. Multirebaños (6): Inventario consolidado, Situación reproductiva, Distribución preñez, Situación productiva, Transacciones, Producciones diarias
│   └── Componentes Transversales: ReportFilterDrawer, ReportPagination, ReportSettingsModal, ExportUtils
│
├── [8] AJUSTES (/ajustes & /settings/general)
│   ├── Pestañas de Reglas de Negocio:
│   │   ├── General (Titular, Nombre predio, País, Especie, Explotación, Manejo, Bioclima)
│   │   ├── Parámetros (Duración gestación, DEV, Secado ideal, Edades y pesos mínimos)
│   │   ├── Alertas (Avisos preparto, secado, diagnóstico post-servicio, celos repetidos, retiros)
│   │   └── Automatización (Transición por edad, por parto, secado y preñez automática)
│   └── Catálogos Base:
│       ├── Lotes (Grupos de manejo zootécnico)
│       ├── Colores (Aretes cromáticos y pelajes)
│       ├── Propietarios (Titulares y marcas de hierro)
│       ├── Diagnósticos (Patologías veterinarias)
│       ├── Tratamientos (Vademécum farmacológico y tiempos de retiro)
│       └── Clasificaciones (Escalas de conformación fenotípica)
│
└── [9] TÉCNICOS & PERSONAL (/technicians & /reports/technicians)
    ├── Directorio de Profesionales de Campo
    └── Auditoría de Rendimiento y Tasa de Concepción
```

---

## 13. Índice de Evidencias Visuales y Referencias

El diseño de interfaz de AgroTech se fundamenta en la arquitectura visual original de 91 capturas de pantalla de referencia (`/home/dvcanache/Workspaces/gansoft/references`), adaptada integralmente al sistema de diseño en React 19 y TypeScript:

- **Dashboard:** `01_Dashboard.png`, `09a_TopBar_SelectorFinca.png`.
- **Catálogo de Animales:** `02_Catalogo_Animales_Todos.png`, `02e_Modal_Registrar_Animal.png`.
- **Ficha del Animal:** `03a_Animal_Resumen.png`, `03b_Animal_Generales.png`, `03c-03f_Genealogia.png`, `03h1-03h10_Historicos.png`.
- **Centro de Eventos:** `04_Centro_Eventos_Principal.png`, `04_Reproductivos_*.png`, `04_Productivos_*.png`, `04_Inventarios_*.png`, `04_Veterinarios_*.png`, `04_Potreros_*.png`, `04_Otros_*.png`.
- **Centro de Reportes:** `05_Centro_Reportes_Principal.png`, `05c-05g_Reportes.png`.
- **Potreros y Mapas GIS:** `06a_Potreros_Principal.png`, `06b_Potreros_Modal_Agregar.png`, `07_Mapas_GIS_Principal.png`.
- **Ajustes:** `08a_Ajustes_General.png`, `08b_Ajustes_Parametros.png`, `08c_Ajustes_Alertas.png`, `08d_Ajustes_Automatizacion.png`, `08e-08j_Catalogos.png`.
