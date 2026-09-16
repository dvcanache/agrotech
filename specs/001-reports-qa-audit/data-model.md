# Data Model: Entidades del Centro de Reportes y Módulos Multiespecie

**Feature**: `specs/001-reports-qa-audit`
**Date**: 2026-09-16
**Status**: Completed

## 1. Diagrama de Entidades y Relaciones

```
+-------------------------------------------------------+
|                 ReporteItem                           |
+-------------------------------------------------------+
| id: string (PK)                                       |
| codigo: string (ej. RPT-001)                          |
| nombre: string                                        |
| descripcion: string                                   |
| categoria: string                                     |
| especie?: ReportSpecies ('bovinos'|'aves'|...|'todos')|
| plantillaBase?: string                                |
| formato: string                                       |
| frecuencia: string                                    |
| rutaAsociada?: string                                 |
| fechaCreacion: string (YYYY-MM-DD)                    |
+-------------------------------------------------------+
                           |
                           | Hace referencia a
                           v
+-------------------------------------------------------+
|                 ReportTemplateMeta                    |
+-------------------------------------------------------+
| nombre: string (PK)                                   |
| especie: ReportSpecies                                |
| categoria: string                                     |
| descripcion: string                                   |
| formato: string                                       |
| frecuencia: string                                    |
| ruta?: string                                         |
+-------------------------------------------------------+
                           ^
                           | Agrupado en
+-------------------------------------------------------+
|                 ReportCategory                        |
+-------------------------------------------------------+
| titulo: string (PK)                                   |
| subtitulo?: string                                    |
| iconoType: 'bovinos'|'aves'|'porcinos'|'bufalos'|...  |
| especie?: ReportSpecies                               |
| reportes: string[]                                    |
+-------------------------------------------------------+
```

---

## 2. Definición Detallada de Entidades

### 2.1 `ReporteItem` (Reporte Guardado / Personalizado)
Representa un informe configurado, guardado o predeterminado que aparece en la tabla principal de reportes del usuario.

| Campo | Tipo | Requerido | Descripción / Reglas de Validación |
|-------|------|:---------:|------------------------------------|
| `id` | `string` | Sí | Identificador único (ej. `rep-1`, `custom-1726470000000`). |
| `codigo` | `string` | Sí | Código correlativo con prefijo `RPT-` seguido de 3 dígitos (ej. `RPT-001`). |
| `nombre` | `string` | Sí | Nombre representativo del informe. Longitud mínima 3, máxima 120 caracteres. |
| `descripcion` | `string` | Sí | Explicación funcional del objetivo del reporte y sus métricas. |
| `categoria` | `string` | Sí | Categoría zootécnica o administrativa (Gestión, Bovinos, Aves, etc.). |
| `especie` | `ReportSpecies` | No | Especie objetivo: `'todos'`, `'bovinos'`, `'aves'`, `'porcinos'`, `'bufalos'`, `'caprinos'`, `'equinos'`. |
| `plantillaBase` | `string` | No | Nombre de la plantilla de origen si deriva del catálogo estándar. |
| `formato` | `string` | Sí | Formato de entrega (ej. `Tabla interactiva (XLSX / PDF)`, `Resumen ejecutivo con KPIs`). |
| `frecuencia` | `string` | Sí | Periodicidad recomendada o programada (Diario, Semanal, Mensual, Bajo demanda). |
| `rutaAsociada` | `string` | No | Ruta URL interna si posee visualización directa (ej. `/reports/inventories`). |
| `fechaCreacion` | `string` | Sí | Fecha de registro en formato ISO `YYYY-MM-DD`. |

---

### 2.2 `ReportCategory` (Catálogo Estándar por Especie)
Define cada una de las tarjetas del directorio general de reportes estándar.

| Campo | Tipo | Requerido | Descripción |
|-------|------|:---------:|-------------|
| `titulo` | `string` | Sí | Título visible de la tarjeta (ej. `Aves de corral (Ponedoras & Pollos)`). |
| `subtitulo` | `string` | No | Resumen técnico de los indicadores contenidos en la categoría. |
| `iconoType` | `string` | Sí | Identificador de icono gráfico temático. |
| `especie` | `ReportSpecies` | No | Especie con la que se asocia la categoría para filtros dinámicos. |
| `reportes` | `string[]` | Sí | Lista ordenada de nombres de reportes estándar contenidos. |

---

### 2.3 `ReportTemplateMeta` (Metadatos de Plantilla)
Diccionario de configuración que asocia un nombre de reporte estándar con su ruta de navegación y parámetros zootécnicos.

| Campo | Tipo | Requerido | Descripción |
|-------|------|:---------:|-------------|
| `nombre` | `string` | Sí | Nombre unívoco de la plantilla estándar. |
| `especie` | `ReportSpecies` | Sí | Especie biológica a la que pertenece la plantilla. |
| `categoria` | `string` | Sí | Clasificación funcional (Producción, Reproducción, Sanidad, etc.). |
| `descripcion` | `string` | Sí | Descripción técnica zootécnica de la plantilla. |
| `formato` | `string` | Sí | Formato gráfico o documental entregable. |
| `frecuencia` | `string` | Sí | Cadencia recomendada de actualización. |
| `ruta` | `string` | No | Enlace de destino (ej. `/reports/view/aves-postura-galpon`). |

---

### 2.4 `SlugConfig` (Configuración de Visor Dinámico)
Define el comportamiento de visualización para una plantilla dentro de `DynamicReportViewer`.

| Campo | Tipo | Requerido | Descripción |
|-------|------|:---------:|-------------|
| `entityId` | `BaseEntityType` | Sí | Entidad de origen de datos (`postura_avicola`, `camadas_porcinas`, `semovientes`, `controles_lecheros`, etc.). |
| `title` | `string` | Sí | Título del encabezado del reporte dinámico. |
| `subtitle` | `string` | Sí | Subtítulo explicativo con indicadores clave. |
| `species` | `ReportSpecies` | Sí | Especie objetivo para badges y temas visuales. |
| `speciesLabel` | `string` | Sí | Etiqueta amigable de la especie (ej. `Porcinos Piara`). |
| `speciesBadgeColor` | `string` | Sí | Código de color HEX para la insignia de especie. |
| `speciesIcon` | `string` | Sí | Emoji o icono temático de la especie. |
| `category` | `string` | Sí | Categoría zootécnica del informe. |
| `filterSpecies` | `string` | No | Filtro predeterminado aplicado a la entidad subyacente. |
| `savedColumns` | `string[]` | No | Lista de identificadores de columna visibles por defecto. |

---

### 2.5 `GuiaMovilizacionData` (Guía Oficial de Movilización)
Estructura de datos para la emisión legal de traslados animales.

| Campo | Tipo | Requerido | Descripción |
|-------|------|:---------:|-------------|
| `numeroGuia` | `string` | Sí | Identificador legal correlativo (ej. `GM-2026-00452`). |
| `fechaEmision` | `string` | Sí | Fecha de expedición del documento. |
| `predioOrigen` | `string` | Sí | Nombre y código del predio ganadero emisor. |
| `predioDestino` | `string` | Sí | Nombre y código del predio o frigorífico receptor. |
| `chofer` | `string` | Sí | Nombre y documento de identidad del conductor. |
| `vehiculoPlaca`| `string` | Sí | Matrícula del camión de transporte ganadero. |
| `precintos` | `string` | No | Números de precintos zoosanitarios oficiales. |
| `detalleAnimales` | `Array<{especie, categoria, cantidad, identificadores}>` | Sí | Desglose cuantitativo de los semovientes trasladados. |
| `totalAnimales`| `number` | Sí | Sumatoria total de animales amparados en la guía. |

---

## 3. Máquina de Estados del Centro de Reportes

```
+--------------------+
|   Estado Inicial   | ---> Cargar INITIAL_REPORTS o localStorage
+--------------------+
          |
          v
+--------------------+
|  Vista Principal   | <-------------------------+
+--------------------+                           |
   |         |         |                         |
   | (Filtro)| (Buscar)|                         |
   v         v         v                         |
+----------+ +-------+ +---------------------+   |
| Especie  | | Texto | | Catálogo Categorías |   |
| Filtrada | | Filtro| | Selección Reporte   |   |
+----------+ +-------+ +---------------------+   |
                            |                    |
        +-------------------+----------------+   |
        |                                    |   |
        v                                    v   |
+---------------------+            +-----------+ |
| Subvista Dedicada   |            | Visor     | |
| (/reports/...)      |            | Dinámico  | |
+---------------------+            | (/view/..)| |
                                   +-----------+ |
                                         |       |
                                         +-------+ (Volver / Breadcrumb)
```
