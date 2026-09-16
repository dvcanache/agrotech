# Research & Technical Decisions: Auditoría de QA y Verificación Visual del Centro de Reportes

**Feature**: `specs/001-reports-qa-audit`
**Date**: 2026-09-16
**Status**: Completed

## 1. Arquitectura de Pruebas y Estrategia de QA Multicapa

### Decisión
Implementar una estrategia de aseguramiento de calidad de tres niveles complementarios:
1. **Nivel 1: Verificación Estática y de Tipos**: Validación estricta con TypeScript (`tsc --noEmit`) y empaquetador de producción Vite para asegurar integridad sintáctica, de importaciones y tipos en los 168+ módulos del proyecto.
2. **Nivel 2: Matriz Automatizada de Cobertura de Rutas y Slugs**: Auditoría programática de correspondencia biyectiva entre los elementos de `REPORT_CATEGORIES`, `REPORT_ROUTES_MAP`, `REPORT_METADATA_MAP`, las rutas de `App.tsx` y los `PRESET_SLUGS` de `DynamicReportViewer.tsx`.
3. **Nivel 3: Auditoría de Interfaz Gráfica y Casos de Borde (GUI & Edge Cases)**: Verificación interactiva de componentes (modales, cajones de filtros, botones split, barras de desplazamiento horizontal de especies, estados vacíos y manejo de teclas `Escape`).

### Racional
- El Centro de Reportes es el núcleo de inteligencia pecuaria de AGROGAN. La reciente expansión multiespecie (6 especies zootécnicas) incrementó la cantidad de rutas dinámicas a más de 30 destinos.
- Los errores más comunes en dashboards zootécnicos ocurren por:
  - Enlaces de reportes en tarjetas que apuntan a rutas inexistentes o no contempladas en el enrutador.
  - Modales que no limpian capas de fondo (backdrops) al cancelarse.
  - Falta de coincidencia entre el nombre del reporte en la tarjeta y la clave en los diccionarios de metadatos.
  - Comportamiento ante búsquedas con caracteres no estándar o estados vacíos sin feedback.

### Alternativas Consideradas
- *Pruebas puramente manuales*: Descartadas por riesgo de omitir rutas en las 9 categorías con más de 40 opciones de reportes.
- *Instalación de suites pesadas de E2E completas (Cypress/Playwright) sin preparar el arnés de componentes*: Descartada para esta fase por sobrecarga innecesaria en el repositorio; el arnés de scripts TypeScript y verificación reactiva de Vite permite una ejecución ultrarrápida y determinista.

---

## 2. Resolución de Enrutamiento y Slugs Dinámicos (`DynamicReportViewer`)

### Decisión
Estandarizar y auditar la resolución de enlaces mediante el patrón de doble resolución:
```typescript
const route = REPORT_ROUTES_MAP[rep] || REPORT_METADATA_MAP[rep]?.ruta;
```
Para cualquier reporte seleccionado en el catálogo estándar:
1. Si existe en `REPORT_ROUTES_MAP`, navega a la subvista especializada estática (ej. `/reports/inventories`, `/reports/dams`, etc.).
2. Si existe en `REPORT_METADATA_MAP[rep]?.ruta`, navega a la ruta dinámica `/reports/view/:reportSlug`.
3. En `DynamicReportViewer.tsx`, el `reportSlug` debe estar registrado en `PRESET_SLUGS` o resolver una entidad por defecto con aviso al usuario si el slug no coincide.
4. Si no existe ruta, invocar `onSelectReport` abriendo el modal `DetalleReporteModal` con la ficha técnica estructurada en lugar de alertar con un popup bloqueante nativo.

### Racional
Garantiza que ningún clic en un reporte genere una pantalla blanca (`Uncaught Error`), una ruta `404` no controlada o una alerta nativa `alert()`. Todos los caminos conducen a una interfaz interactiva consistente.

### Alternativas Consideradas
- *Crear una vista estática `.tsx` independiente para cada uno de los 40 reportes*: Inviable por duplicación de código y mantenimiento. El enfoque de `DynamicReportViewer` centraliza la lógica tabular, paginación y exportación de forma DRY.

---

## 3. Ciclo de Vida de Modales y Manejo de Capas de Fondo

### Decisión
Verificar y estandarizar que todos los modales (`NuevoReporteModal`, `DetalleReporteModal`, `AdHocReportDesignerModal`, `GuiaMovilizacionModal`):
1. Cuenten con listener global de teclado para `Escape` que limpie el estado.
2. Bloqueen el scroll de fondo (`document.body.style.overflow = 'hidden'`) al abrirse y lo restauren (`'unset'`) al desmontarse.
3. Permitan cierre por clic en el backdrop exterior (`onClick={onClose}` con `e.stopPropagation()` en el contenedor del modal).
4. No dejen elementos huérfanos en el DOM al cancelarse.

### Racional
En aplicaciones SPA pecuarias donde los operadores ingresan datos de aforos, traslados o fichas zootécnicas, las fallas de modales que bloquean la interacción de la pantalla principal representan severidad P1/P2.

---

## 4. Normalización de Búsqueda y Filtrado Multiespecie

### Decisión
La búsqueda de reportes debe implementar normalización Unicode:
```typescript
const normalize = (str: string) =>
  str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
```
Esto permite que términos como "distribucion", "producción", "búfalos" o "tecnicos" coincidan indistintamente de la presencia o ausencia de tildes y mayúsculas.

### Racional
Los operadores de campo y usuarios administrativos suelen tipear rápidamente sin tildes ("gestión" vs "gestion", "búfalos" vs "bufalos"). La normalización previene falsos negativos en la búsqueda.

---

## 5. Persistencia y Recuperación de Datos en `localStorage`

### Decisión
Validar que la clave `agrogan_saved_reports_v2`:
1. Valide el esquema JSON recuperado antes de asignarlo al estado.
2. Si el contenido almacenado está corrupto o tiene menos de los reportes base indispensables, active un fallback transparente a `INITIAL_REPORTS`.
3. Ofrezca un mecanismo de restablecimiento ("Configurar Primer Reporte" o "Restablecer Valores Predeterminados") cuando la tabla quede vacía tras eliminaciones masivas.

### Racional
Evita que un estado dañado en la memoria del navegador deje al usuario en un bucle de error irrecuperable.
