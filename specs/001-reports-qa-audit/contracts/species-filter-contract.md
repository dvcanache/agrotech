# Species Filter Contract: Taxonomía y Comportamiento de Filtrado Multiespecie

**Feature**: `specs/001-reports-qa-audit`
**Date**: 2026-09-16
**Status**: Completed

## 1. Taxonomía de Especies

El sistema opera bajo una taxonomía canónica estricta para las 6 especies pecuarias soportadas, más la categoría global:

| ID Canónico (`ReportSpecies`) | Etiqueta Visible | Icono Temático | Color de Distintivo (Badge HEX) | Color de Fondo Suave |
|-------------------------------|------------------|:--------------:|:-------------------------------:|:--------------------:|
| `'todos'` | Todos los Reportes | 🐾 | `#475569` | `#f1f5f9` |
| `'bovinos'` | Bovinos | 🐮 | `#166534` | `#e8f5e9` |
| `'aves'` | Aves de corral | 🐔 | `#92400e` | `#fef3c7` |
| `'porcinos'` | Porcinos | 🐷 | `#9d174d` | `#fce7f3` |
| `'bufalos'` | Búfalos | 🐃 | `#334155` | `#f1f5f9` |
| `'caprinos'` | Caprinos | 🐐 | `#065f46` | `#ecfdf5` |
| `'equinos'` | Equinos | 🐴 | `#9a3412` | `#fff7ed` |

---

## 2. Comportamiento de Reordenamiento y Visibilidad en Catálogo

Al cambiar el valor de `selectedSpecies`:
1. **Si `selectedSpecies === 'todos'`**:
   - Se muestran todas las 9 tarjetas de categorías en su orden natural: Bovinos, Aves, Porcinos, Búfalos, Caprinos, Equinos, Gestión, Históricos, Multirebaños.
   - Ninguna tarjeta se muestra como forzosamente priorizada sobre otra salvo su orden de catálogo.
2. **Si `selectedSpecies !== 'todos'` (por ejemplo, `'porcinos'`)**:
   - La categoría coincidente con la especie (`cat.especie === selectedSpecies`) se reordena para aparecer en la **primera posición** de la cuadrícula.
   - Dicha tarjeta recibe el estilo destacado (`category-card-highlighted`) con borde verde institucional (`var(--primary-color)`), sombra acentuada y la insignia `"Especie Activa"`.
   - Las categorías transversales (`'gestion'`, `'historicos'`, `'multirebanos'`) se mantienen visibles a continuación.
   - Se habilita un botón `"Ver Todas las Especies"` en la cabecera del catálogo para permitir retorno rápido a vista general.

---

## 3. Comportamiento de Filtrado en Tabla de Reportes Guardados

La lista de reportes guardados evalúa conjuntamente `selectedSpecies` y `searchTerm`:
```typescript
const isSpeciesMatch =
  selectedSpecies === 'todos' ||
  rep.especie === selectedSpecies ||
  rep.especie === 'todos' ||
  !rep.especie;

const isTextMatch =
  !searchTerm.trim() ||
  [rep.codigo, rep.nombre, rep.descripcion, rep.categoria, rep.especie]
    .some(val => val && normalize(val).includes(normalize(searchTerm)));

return isSpeciesMatch && isTextMatch;
```
