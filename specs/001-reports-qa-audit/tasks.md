# Tasks: Auditoría de QA y Verificación Visual del Centro de Reportes

**Branch**: `develop` | **Date**: 2026-09-16 | **Plan**: [plan.md](plan.md) | **Spec**: [spec.md](spec.md)

Este plan de tareas define la secuencia rigurosa para ejecutar la auditoría de Aseguramiento de Calidad (QA), detección de problemas visuales y verificación de casos felices y de borde en el **Centro de Reportes** y sus catálogos estándar por especie.

---

## Phase 1: Setup (Infraestructura y Preparación del Entorno de QA)

**Purpose**: Verificación de herramientas de análisis estático, tipos y scripts de validación

- [x] T001 Verificar la integridad de tipos estáticos y dependencias del Centro de Reportes en `src/App.tsx` y `src/features/reportes/ReportesView.tsx`
- [x] T002 [P] Crear script de validación automatizada de coherencia entre rutas, catálogos y slugs en `src/features/reportes/utils/qaRouteValidator.ts`
- [x] T003 [P] Verificar la configuración de compilación de producción de Vite en `vite.config.ts` y `package.json`

---

## Phase 2: Foundational (Prerrequisitos Bloqueantes)

**Purpose**: Garantizar que los mapeos y contratos base de enrutamiento y búsqueda estén blindados antes de auditar cada historia de usuario

**⚠️ CRITICAL**: Ninguna prueba de usuario puede considerarse concluida sin haber superado esta fase

- [x] T004 Auditar y alinear la correspondencia biyectiva entre `REPORT_CATEGORIES`, `REPORT_ROUTES_MAP` y `REPORT_METADATA_MAP` en `src/features/reportes/reportesData.ts` y `src/features/reportes/components/ReportCategoryCard.tsx`
- [x] T005 [P] Auditar la captura de rutas inválidas y estado de fallback amigable para slugs desconocidos en `src/features/reportes/dynamic/DynamicReportViewer.tsx`
- [x] T006 [P] Auditar la función de normalización Unicode para búsquedas insensibles a tildes y mayúsculas en `src/features/reportes/ReportesView.tsx`

**Checkpoint**: Base técnica blindada. La ejecución de pruebas por historia de usuario puede proceder en paralelo.

---

## Phase 3: User Story 1 - Navegación, Filtrado Multiespecie y Búsqueda (Priority: P1) 🎯 MVP

**Goal**: Validar que el usuario pueda explorar fluidamente el Centro de Reportes filtrando por las 6 especies (Bovinos, Aves, Porcinos, Búfalos, Caprinos, Equinos, Global) y buscando en tiempo real con actualización instantánea del catálogo y la tabla de reportes guardados.

**Independent Test**: Interactuar con la barra de especies en `ReportesView.tsx`, verificar el reordenamiento de tarjetas en el catálogo, ingresar términos en el buscador y confirmar el conteo reactivo y estados vacíos sin navegar a páginas externas.

- [x] T007 [P] [US1] Auditar la barra de herramientas de especies (`SPECIES_TOOLBAR_OPTIONS`), estado activo y contadores reactivos en `src/features/reportes/ReportesView.tsx`
- [x] T008 [P] [US1] Auditar el reordenamiento prioritario de tarjetas y la insignia visual "Especie Activa" al seleccionar una especie en `src/features/reportes/components/ReportCategoryCard.tsx`
- [x] T009 [US1] Auditar el filtrado en tiempo real en la tabla de reportes guardados combinando especie seleccionada y término de búsqueda en `src/features/reportes/ReportesView.tsx`
- [x] T010 [US1] Auditar la presentación del estado vacío informativo cuando no hay coincidencias de búsqueda y el botón para restablecer filtros en `src/features/reportes/ReportesView.tsx`

**Checkpoint**: User Story 1 completamente funcional y validada como incremento de MVP independiente.

---

## Phase 4: User Story 2 - Exploración y Ejecución de Reportes Estándar por Especie (Priority: P1)

**Goal**: Validar que cada uno de los reportes listados en las 9 tarjetas del catálogo estándar por especie navegue a su subvista especializada o a su plantilla en el visor dinámico con todos sus datos e indicadores.

**Independent Test**: Recorrer secuencialmente cada enlace del catálogo estándar por especie y verificar que cargue la vista correspondiente con sus KPIs, tablas y herramientas de exportación sin errores de consola ni pantallas en blanco.

- [x] T011 [P] [US2] Auditar los enlaces y rutas de la categoría Bovinos (`/reports/dams`, `/reports/nexttobirth`, `bovinos-curvas-lactancia-wood`, `bovinos-mastitis-sanidad`) en `src/features/reportes/components/ReportCategoryCard.tsx` y `src/App.tsx`
- [x] T012 [P] [US2] Auditar los enlaces y rutas de la categoría Aves de corral (`aves-postura-galpon`, `aves-curva-postura`, `aves-conversion-alimenticia`, `aves-mortalidad-seleccion`, `aves-clasificacion-huevo`, `aves-tratamientos-vacunaciones`) en `src/features/reportes/dynamic/DynamicReportViewer.tsx`
- [x] T013 [P] [US2] Auditar los enlaces y rutas de la categoría Porcinos (`porcinos-eficiencia-reproductoras`, `porcinos-camadas-prolificidad`, `porcinos-cebo-engorde`, `porcinos-conversion-lote`, `porcinos-destetes-gdp`) en `src/features/reportes/dynamic/DynamicReportViewer.tsx`
- [x] T014 [P] [US2] Auditar los enlaces y rutas de la categoría Búfalos (`bufalos-produccion-grasa`, `bufalos-sanidad-endoparasitos`, `bufalos-crecimiento-destete`, `bufalos-lactancia-270d`) en `src/features/reportes/dynamic/DynamicReportViewer.tsx`
- [x] T015 [P] [US2] Auditar los enlaces y rutas de la categoría Caprinos (`caprinos-calidad-leche`, `caprinos-famacha`, `caprinos-podologia`, `caprinos-curva-lactancia`, `caprinos-crecimiento-boer`) en `src/features/reportes/dynamic/DynamicReportViewer.tsx`
- [x] T016 [P] [US2] Auditar los enlaces y rutas de la categoría Equinos (`equinos-pasaporte-genealogia`, `equinos-herraje-desvasado`, `equinos-coggins`, `equinos-foliculometria`, `equinos-vaqueria-faena`) en `src/features/reportes/dynamic/DynamicReportViewer.tsx`
- [x] T017 [P] [US2] Auditar los enlaces y rutas de las categorías transversales Gestión, Históricos y Multirebaños en `src/features/reportes/components/ReportCategoryCard.tsx` y `src/App.tsx`
- [x] T018 [US2] Auditar la paginación, selector de registros por página, ordenamiento por columnas y selector de campos visibles en `src/features/reportes/dynamic/DynamicReportViewer.tsx`

**Checkpoint**: Las 9 categorías del catálogo estándar y todas sus opciones navegan y renderizan con 100% de fiabilidad.

---

## Phase 5: User Story 3 - Operación de Reportes Guardados (Visualización, Detalle y Eliminación) (Priority: P2)

**Goal**: Validar la gestión integral de la tabla de reportes guardados en el panel principal (ejecución, modal de detalle, borrado con confirmación y persistencia en `localStorage`).

**Independent Test**: Crear, consultar la vista previa en modal y eliminar reportes guardados, verificando la reactividad en el contador y la retención del estado tras recargar la página.

- [x] T019 [P] [US3] Auditar la estructura de columnas de la tabla de reportes guardados, códigos correlativos y renderizado de badges de especie en `src/features/reportes/ReportesView.tsx`
- [x] T020 [P] [US3] Auditar el botón "Ver" para reportes con y sin ruta asociada desplegando `DetalleReporteModal` en `src/features/reportes/components/DetalleReporteModal.tsx`
- [x] T021 [US3] Auditar el flujo de eliminación con diálogo de confirmación, actualización del estado reactivo y sincronización en `localStorage` en `src/features/reportes/ReportesView.tsx`
- [x] T022 [US3] Auditar la presentación del estado vacío cuando se eliminan todos los reportes y la acción para restaurar o configurar el primer reporte en `src/features/reportes/ReportesView.tsx`

**Checkpoint**: User Stories 1, 2 y 3 operan de forma independiente e integrada.

---

## Phase 6: User Story 4 - Emisión de Guías de Movilización y Diseñador BI Ad-Hoc (Priority: P2)

**Goal**: Validar el funcionamiento de las herramientas avanzadas del Centro de Reportes: emisión oficial de Guías de Movilización Pecuaria multiespecie y Diseñador de Informes BI Ad-Hoc.

**Independent Test**: Abrir el modal de Guía de Movilización y el Diseñador BI desde el encabezado, validar captura de datos, cómputos automáticos y exportación sin bloqueos de interfaz.

- [x] T023 [P] [US4] Auditar el modal `GuiaMovilizacionModal` validando formulario legal, cálculo automático de cabezas de ganado y generación de documento imprimible en `src/features/reportes/components/GuiaMovilizacionModal.tsx`
- [x] T024 [P] [US4] Auditar el modal `AdHocReportDesignerModal` validando selección de entidades base, selector de campos, previsualización de datos y guardado en `src/features/reportes/components/AdHocReportDesignerModal.tsx`
- [x] T025 [US4] Auditar el botón split "Agregar" y el modal `NuevoReporteModal` con preselección de categoría por especie en `src/features/reportes/components/NuevoReporteModal.tsx` y `src/features/reportes/ReportesView.tsx`

**Checkpoint**: Herramientas analíticas avanzadas y trámites zoosanitarios validados satisfactoriamente.

---

## Phase 7: User Story 5 - Robustez de Interfaz Gráfica, Modalidades de Cierre y Casos Borde de UI (Priority: P3)

**Goal**: Asegurar una experiencia de usuario sin fricciones, sin desbordamientos en pantallas intermedias, y con cierre confiable de modales mediante múltiples mecanismos (Escape, backdrop y botón X).

**Independent Test**: Probar apertura y cierre masivo de modales por tecla Escape y backdrop, verificar que no queden capas oscuras huérfanas y probar la barra de especies en anchos de pantalla reducidos.

- [x] T026 [P] [US5] Auditar el listener global de la tecla `Escape` y el comportamiento de clic en backdrop en `NuevoReporteModal.tsx`, `DetalleReporteModal.tsx`, `AdHocReportDesignerModal.tsx` y `GuiaMovilizacionModal.tsx`
- [x] T027 [P] [US5] Auditar el bloqueo y desbloqueo del scroll de la página (`body.style.overflow`) al abrir y cerrar modales en `src/features/reportes/components/reportesAdvanced.css`
- [x] T028 [US5] Auditar la responsividad del encabezado, contenedor de búsqueda y desplazamiento horizontal de la barra de especies en pantallas <= 1280px en `src/features/reportes/ReportesView.tsx`

**Checkpoint**: Interfaz robusta, accesible y sin anomalías de renderizado en modales o estilos.

---

## Phase 8: Polish & Cross-Cutting QA Verification

**Purpose**: Verificación final integrada de extremo a extremo, pruebas de exportación y compilación en limpio

- [x] T029 [P] Ejecutar el validador programático de rutas y slugs sobre las 30+ URLs del Centro de Reportes en `src/features/reportes/utils/qaRouteValidator.ts`
- [x] T030 Ejecutar compilación de producción con `npm run build` confirmando 0 advertencias de tipos y rendimiento óptimo de bundle
- [x] T031 Ejecutar la lista completa de verificación de escenarios de prueba descrita en `specs/001-reports-qa-audit/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Inicia inmediatamente sin dependencias externas.
- **Foundational (Phase 2)**: Depende de Phase 1. Bloquea la certificación de todas las historias de usuario.
- **User Stories (Phases 3 a 7)**: Dependen de Phase 2.
  - US1 (P1) y US2 (P1) son prioritarias y constituyen el núcleo zootécnico del catálogo.
  - US3 (P2) y US4 (P2) gestionan operaciones avanzadas y trámites.
  - US5 (P3) afina la resiliencia de la interfaz y casos borde de modales.
- **Polish (Phase 8)**: Depende de completar las fases previas y certifica la entrega.

### Parallel Opportunities

- **Fase 1**: T002 y T003 pueden ejecutarse en paralelo con T001.
- **Fase 2**: T005 y T006 pueden auditarse en paralelo tras validar T004.
- **Fase 3**: T007 y T008 pueden verificarse simultáneamente (barra vs tarjetas).
- **Fase 4**: Las auditorías de enlaces por especie (T011 a T017) son totalmente paralelizables al atacar archivos y rutas independientes.
- **Fase 5 y 6**: T019, T020, T023 y T024 operan sobre modales y componentes aislados.

---

## Implementation Strategy

### MVP First (User Story 1 & Foundational)
1. Completar Setup y Foundational (Phase 1 y 2).
2. Completar User Story 1 (Phase 3).
3. **Validación Independiente**: Probar filtrado por especie y búsqueda en vivo sin errores.

### Entrega Incremental
1. Integrar User Story 2 (Phase 4): Probar la navegación exhaustiva de las 9 categorías y 30+ rutas.
2. Integrar User Story 3 (Phase 5): Probar gestión de reportes guardados y persistencia.
3. Integrar User Story 4 (Phase 6): Probar Guía de Movilización y Diseñador BI Ad-Hoc.
4. Integrar User Story 5 (Phase 7): Validar casos borde de modales y responsividad.
5. Ejecutar Phase 8 (Polish) para cerrar la auditoría con certificación de calidad.
