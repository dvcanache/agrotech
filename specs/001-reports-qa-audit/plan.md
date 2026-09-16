# Implementation Plan: Auditoría de QA y Verificación Visual del Centro de Reportes

**Branch**: `develop` | **Date**: 2026-09-16 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-reports-qa-audit/spec.md`

## Summary

Ejecutar una auditoría exhaustiva de Aseguramiento de Calidad (QA) sobre la vista principal del **Centro de Reportes** y todas sus subvistas asociadas en el catálogo estándar por especie (Bovinos, Aves, Porcinos, Búfalos, Caprinos, Equinos, Gestión, Históricos y Multirebaños). El enfoque abarca verificación estática de tipos, correspondencia biyectiva de rutas y slugs, validación del ciclo de vida de modales, pruebas de casos felices (happy path) y exploración de casos de borde (edge cases).

## Technical Context

**Language/Version**: TypeScript 5.2+ / ECMAScript 2020+
**Primary Dependencies**: React 19 (`react`, `react-dom`), React Router v7 (`react-router-dom`), Lucide React (`lucide-react`), Chart.js / `react-chartjs-2`, Vite 5.4+
**Storage**: Navegador Web `localStorage` (`agrogan_saved_reports_v2`) y estado reactivo en memoria (`useState`, `useMemo`, `AppContext`)
**Testing**: Compilación estática estricta con Vite (`npm run build`), verificación programática de contratos de rutas/slugs y pruebas interactivas de GUI
**Target Platform**: Navegadores Web modernos (Google Chrome, Firefox, Safari, Edge) en entornos de escritorio y pantallas intermedias
**Project Type**: Single Page Application (SPA) / Frontend Web Dashboard
**Performance Goals**: Renderizado reactivo de filtros y búsquedas en < 100ms; navegación instantánea entre vistas (< 50ms)
**Constraints**: Operación offline en cliente (cliente puro sin dependencias obligatorias de backend para la visualización mock), cero pantallas en blanco (`White Screen of Death`) ante rutas o parámetros no mapeados
**Scale/Scope**: 1 vista principal de Centro de Reportes, 9 categorías de catálogo estándar, 30+ rutas y slugs dinámicos especializados, 4 modales interactivos

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio Constitucional | Estado | Justificación / Cumplimiento |
|--------------------------|:------:|------------------------------|
| **I. Claridad y Propósito** | Aprobado | El plan define un marco riguroso de pruebas y auditoría de interfaz gráfica sin ambigüedades. |
| **II. Integridad de Tipos y Estabilidad** | Aprobado | Verificado con TypeScript en modo estricto y compilación limpia en producción. |
| **III. Calidad de Requerimientos** | Aprobado | Lista de verificación de calidad completada con 16/16 criterios satisfechos. |
| **IV. Cobertura de Casos Borde** | Aprobado | Contempla búsquedas no estándar, slugs inválidos, cancelación de modales y persistencia en almacenamiento local. |
| **V. Arquitectura DRY y Mantenible** | Aprobado | El enrutamiento dinámico centraliza tablas y exportación en `DynamicReportViewer` y aprovecha subvistas especializadas existentes. |

## Project Structure

### Documentation (this feature)

```text
specs/001-reports-qa-audit/
├── spec.md                  # Especificación funcional de requerimientos
├── plan.md                  # Este archivo (Plan técnico y contexto de arquitectura)
├── research.md              # Investigación de decisiones técnicas (Phase 0)
├── data-model.md            # Modelo de entidades y contratos de datos (Phase 1)
├── quickstart.md            # Guía ejecutable de verificación de QA y casos de prueba (Phase 1)
├── checklists/
│   └── requirements.md      # Lista de calidad de la especificación
└── contracts/
    ├── ui-routes-contract.md      # Matriz de rutas estáticas y dinámicas
    ├── modals-contract.md         # Contrato de ciclo de vida y eventos de modales
    └── species-filter-contract.md # Contrato de filtrado y taxonomía multiespecie
```

### Source Code (repository layout)

```text
src/
├── App.tsx                                 # Enrutador principal y declaración de rutas
├── types/
│   └── reports.ts                          # Tipos canónicos de reportes y especies
├── features/
│   └── reportes/
│       ├── ReportesView.tsx                # Vista principal del Centro de Reportes
│       ├── reportesData.ts                 # Catálogos estándar y metadatos de plantillas
│       ├── components/
│       │   ├── ReportCategoryCard.tsx      # Tarjetas del catálogo estándar por especie
│       │   ├── SpeciesSelectorBar.tsx      # Barra de filtrado multiespecie
│       │   ├── NuevoReporteModal.tsx       # Modal de configuración de nuevo reporte
│       │   ├── DetalleReporteModal.tsx     # Modal de vista previa y ficha técnica
│       │   ├── AdHocReportDesignerModal.tsx# Diseñador interactivo BI Ad-Hoc
│       │   ├── GuiaMovilizacionModal.tsx   # Modal legal de guía de movilización animal
│       │   └── adhocData.ts                # Entidades y campos para reportes personalizados
│       ├── dynamic/
│       │   └── DynamicReportViewer.tsx     # Visor dinámico con slugs parametrizados
│       ├── gestion/                        # Subvistas de la sección Gestión
│       ├── animales/                       # Subvistas de la sección Bovinos/Animales
│       ├── historicos/                     # Subvistas de la sección Históricos
│       └── multirebanos/                   # Subvistas de la sección Multirebaños
```

**Structure Decision**: Se adopta la arquitectura orientada a características (`features/`) existente en el proyecto, centrando la auditoría en `src/features/reportes/` y sus integraciones en `src/App.tsx`.

## Complexity Tracking

> No hay violaciones constitucionales que justifiquen complejidad accidental o patrones no convencionales. La implementación se mantiene limpia, modular y estrictamente apegada a los estándares de React 19 y TypeScript.
