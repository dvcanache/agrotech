# Modals Contract: Diálogos Interactivos y Ciclo de Vida en Centro de Reportes

**Feature**: `specs/001-reports-qa-audit`
**Date**: 2026-09-16
**Status**: Completed

## 1. Contrato de Componentes Modales

| Modal | Componente | Props Requeridas | Eventos Emitidos | Cierre por Escape | Cierre por Backdrop |
|-------|------------|------------------|------------------|:-----------------:|:-------------------:|
| **Nuevo Reporte** | `NuevoReporteModal` | `isOpen: boolean`, `onClose: () => void`, `onSave: (nuevo: ReporteItem) => void`, `categoriaInicial: string`, `nextCodigo: string` | `onClose`, `onSave` | Sí | Sí |
| **Detalle de Reporte** | `DetalleReporteModal` | `isOpen: boolean`, `onClose: () => void`, `reporte: ReporteItem \| null` | `onClose` | Sí | Sí |
| **Diseñador BI Ad-Hoc** | `AdHocReportDesignerModal` | `isOpen: boolean`, `onClose: () => void`, `onSaveReport: (nuevo: ReporteItem) => void` | `onClose`, `onSaveReport` | Sí | Sí |
| **Guía de Movilización** | `GuiaMovilizacionModal` | `isOpen: boolean`, `onClose: () => void` | `onClose` | Sí | Sí |

---

## 2. Invariantes del Ciclo de Vida y DOM

Para todo modal implementado en el sistema se garantizan las siguientes invariantes:
1. **Limpieza de Bloqueo de Desplazamiento**:
   ```typescript
   useEffect(() => {
     if (isOpen) {
       document.body.style.overflow = 'hidden';
     } else {
       document.body.style.overflow = 'unset';
     }
     return () => {
       document.body.style.overflow = 'unset';
     };
   }, [isOpen]);
   ```
2. **Propagación de Eventos en Backdrop**:
   El contenedor exterior del modal gestiona `onClick={onClose}` y el cuadro interior (`modal-dialog` o tarjeta central) gestiona `onClick={e => e.stopPropagation()}` para impedir que clics en los campos de formulario cierren el diálogo involuntariamente.
3. **Escucha de Teclado**:
   El manejador de evento `keydown` debe escuchar `e.key === 'Escape'` y disparar `onClose()` de forma inmediata.

---

## 3. Contrato de Validación de Formularios en Modales

- **`NuevoReporteModal`**:
  - `nombre`: Obligatorio, longitud >= 3 caracteres. Si está vacío, el botón "Guardar" debe estar deshabilitado o mostrar validación visual.
  - `categoria`: Obligatorio, seleccionable de lista desplegable.
  - `especie`: Obligatorio, seleccionable de lista desplegable de las 6 especies o global.
- **`GuiaMovilizacionModal`**:
  - Requiere validación de predio origen, predio destino y datos de transporte antes de generar el documento oficial imprimible.
  - Conteo total de animales debe actualizarse dinámicamente sumando las cantidades ingresadas por especie y categoría.
