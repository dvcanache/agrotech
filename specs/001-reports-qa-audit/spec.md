# Feature Specification: Auditoría de QA y Verificación Visual del Centro de Reportes

**Feature Branch**: `develop`

**Created**: 2026-09-16

**Status**: Ready for Review

**Input**: User description: "Vas a hacer de Experto en QA, en busqueda de problemas en la interfaz grafica ya sean bugs menores o mayores. Target: Vista de Recuperación de Centro de Reportes. Probar todas y cada una de las funcionalidades de la vista de reportes y sus sub vistas en Módulos y Catálogos de Reportes Estándar por Especie, verifica el happy path pero tambien verifica casos bordes"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Navegación, Filtrado Multiespecie y Búsqueda en el Centro de Reportes (Priority: P1)

Como responsable de gestión pecuaria o analista zootécnico, deseo explorar el Centro de Reportes filtrando por especie animal y buscando por palabras clave, para localizar de forma inmediata informes relevantes tanto globales como específicos de cada producción (bovina, avícola, porcina, bufalina, caprina o equina).

**Why this priority**: Es la puerta de entrada principal a toda la inteligencia pecuaria del sistema; si el usuario no puede filtrar, buscar o identificar claramente sus reportes por especie, el acceso a la información queda completamente bloqueado.

**Independent Test**: Puede validarse de forma autónoma interactuando con la barra de especies, escribiendo términos en la caja de búsqueda y observando la actualización reactiva del conteo y de las tarjetas visibles sin requerir navegación a páginas externas.

**Acceptance Scenarios**:

1. **Given** que el usuario se encuentra en la vista principal del Centro de Reportes con el filtro "Todos los Reportes" activo, **When** hace clic en la píldora de especie "Aves de corral", **Then** el sistema destaca visualmente la píldora seleccionada, actualiza el contador de reportes guardados coincidentes, y en el catálogo estándar resalta prioritariamente la tarjeta de Aves con su distintivo institucional.
2. **Given** que el usuario tiene seleccionada una especie específica (por ejemplo, "Porcinos"), **When** escribe en el buscador un término como "camada", **Then** la tabla de reportes guardados filtra en tiempo real mostrando únicamente los registros cuyo código, nombre, categoría o descripción contengan dicho texto.
3. **Given** que el usuario escribe un término sin coincidencias en el buscador (por ejemplo, "xyz123"), **When** la búsqueda se aplica, **Then** el sistema muestra un estado vacío amigable con el mensaje correspondiente y un botón para configurar o restablecer la búsqueda.
4. **Given** que el usuario ha filtrado por una especie puntual, **When** hace clic en el botón "Ver Todas las Especies" o selecciona "Todos los Reportes", **Then** la vista restaura el catálogo completo con todas las especies y reportes disponibles.

---

### User Story 2 - Exploración y Ejecución de Reportes Estándar por Especie (Priority: P1)

Como especialista de campo o administrador de finca, deseo hacer clic en cualquier reporte listado dentro de las tarjetas del catálogo por especie, para acceder directamente al visor de datos detallado correspondiente o a la vista analítica especializada con su información operativa.

**Why this priority**: Representa el valor nuclear del Centro de Reportes: consultar la información zootécnica de cada área productiva (ordeño, partos, curvas genéticas avícolas, rendimiento en canal porcina, calidad quesera bufalina, sanidad FAMACHA, etc.).

**Independent Test**: Puede probarse seleccionando individualmente cada uno de los enlaces de las 9 categorías del catálogo estándar y confirmando que cada enlace abre la subvista correcta, sin fallos de pantalla en blanco ni enlaces rotos.

**Acceptance Scenarios**:

1. **Given** que el usuario visualiza la tarjeta "Bovinos (Vacunos & Doble Propósito)", **When** hace clic en "Vientres y Producción Lechera" o en "Vientres", **Then** el sistema navega a la subvista de Vientres mostrando la tabla de hembras productivas, métricas de lactancia y herramientas de exportación.
2. **Given** que el usuario visualiza la tarjeta "Aves de corral", **When** hace clic en "Control Diario de Postura y Huevos", **Then** el sistema abre el visor dinámico de reporte correspondiente con matriz de postura diaria, semáforo de producción y filtros por lote/galpón.
3. **Given** que el usuario hace clic en "Curvas de Lactancia Wood 305d" en Bovinos o en "Lactancias Búfalas Normalizadas 270d" en Búfalos, **When** se procesa la solicitud, **Then** el sistema carga la subvista analítica con el modelado matemático de curva y los registros individuales asociados.
4. **Given** que el usuario navega a las categorías de "Gestión Pecuaria General", "Históricos & Series de Tiempo" o "Multirebaños", **When** pulsa en cualquiera de sus opciones (como Inventarios, Movimientos, Distribución Normal, Historia de Pesajes o Transacciones Multirebaño), **Then** se renderiza la vista correspondiente con sus tablas, gráficos y filtros funcionales.

---

### User Story 3 - Operación de Reportes Guardados (Visualización, Detalle y Eliminación) (Priority: P2)

Como usuario operativo, deseo gestionar la lista de reportes guardados en mi panel, pudiendo consultar su ficha de detalle, ejecutarlos o eliminarlos cuando ya no sean requeridos, con persistencia automática de mis preferencias.

**Why this priority**: Garantiza que los informes recurrentes configurados por el usuario se mantengan accesibles, organizados y actualizables en el día a día.

**Independent Test**: Se valida agregando, consultando la vista previa y eliminando reportes de la tabla principal, verificando que los cambios persistan tras recargar la página.

**Acceptance Scenarios**:

1. **Given** la tabla de reportes guardados con múltiples elementos, **When** el usuario hace clic en el botón "Ver" de un reporte, **Then** si el reporte posee una ruta operativa asociada el sistema navega a ella, y si es una plantilla general abre el modal de detalle con la ficha técnica completa y opciones de exportación.
2. **Given** un reporte guardado en la tabla, **When** el usuario pulsa el icono de papelera (Eliminar), **Then** el sistema solicita confirmación explícita para evitar pérdidas accidentales; tras confirmar, el reporte se remueve de la lista y el contador general se decrementa inmediatamente.
3. **Given** que el usuario elimina todos los reportes de una categoría o especie, **When** la lista queda vacía, **Then** se presenta un mensaje explicativo y una acción clara para crear o restaurar reportes.

---

### User Story 4 - Emisión de Guías de Movilización y Diseñador de Informes BI Ad-Hoc (Priority: P2)

Como médico veterinario o administrador ganadero, deseo emitir guías oficiales de movilización animal multiespecie y diseñar consultas analíticas a la medida, para cumplir con requerimientos legales de traslado y generar reportes personalizados cruzando diferentes variables pecuarias.

**Why this priority**: Aporta valor de cumplimiento legal obligatorio para el traslado de ganado y flexibilidad para generar análisis que no están contemplados en las plantillas fijas.

**Independent Test**: Puede probarse abriendo el modal de Guía de Movilización y el modal del Diseñador BI Ad-Hoc desde el encabezado principal, completando sus formularios y verificando sus salidas y validaciones.

**Acceptance Scenarios**:

1. **Given** la vista del Centro de Reportes, **When** el usuario hace clic en el botón "Guía Movilización", **Then** se abre el modal con la estructura legal requerida: datos del predio de origen y destino, información del transporte/chofer, precintos zoosanitarios y desglose de animales por categoría zootécnica.
2. **Given** la vista del Centro de Reportes, **When** el usuario pulsa en "+ Diseñar Informe BI" o selecciona la opción desde el botón desplegable "Agregar", **Then** se presenta el asistente del diseñador ad-hoc permitiendo elegir entidad base (semovientes, pesajes, sanidad, etc.), seleccionar campos visibles, ordenar y previsualizar la consulta generada.
3. **Given** que el usuario guarda una consulta diseñada desde el diseñador ad-hoc, **When** completa el guardado, **Then** el nuevo informe se incorpora a la tabla principal de reportes guardados con su código correlativo asignado.

---

### User Story 5 - Robustez de Interfaz Gráfica, Modalidades de Cierre y Casos Borde de UI (Priority: P3)

Como usuario en cualquier dispositivo o resolución de pantalla, deseo que la interfaz gráfica sea limpia, coherente con la identidad visual oficial AGROGAN, que no presente desbordamientos ni elementos rotos, y que todos los diálogos y modales respondan de forma predecible ante acciones de cancelación.

**Why this priority**: Una interfaz sin inconsistencias visuales genera confianza en el usuario profesional y evita fricciones operativas durante la jornada de trabajo.

**Independent Test**: Se evalúa inspeccionando los componentes en diferentes anchos de pantalla, abriendo y cerrando modales mediante múltiples vías (tecla Escape, clic en fondo exterior, botón de cierre X), y validando la coherencia visual.

**Acceptance Scenarios**:

1. **Given** cualquier modal activo (Nuevo Reporte, Detalle, Diseñador BI o Guía de Movilización), **When** el usuario presiona la tecla Escape o hace clic en el botón de cierre (X), **Then** el modal se cierra limpiamente sin dejar capas de bloqueo (backdrop) huérfanas en pantalla.
2. **Given** una pantalla con ancho restringido (portátil de 13 pulgadas o tablet en orientación horizontal), **When** se visualiza la barra de filtro de especies, **Then** los botones se organizan con desplazamiento horizontal suave sin deformar los botones de acción del encabezado.
3. **Given** textos largos en nombres o descripciones de reportes, **When** se renderizan en las filas de la tabla o en las tarjetas de categorías, **Then** el diseño conserva su alineación, espaciado y márgenes sin solapamiento de textos ni cortes abruptos no controlados.

---

### Edge Cases

- **Búsqueda con caracteres especiales o espacios extremos**: La búsqueda debe normalizar espacios en blanco iniciales/finales y manejar caracteres como acentos, numerales o símbolos sin disparar excepciones de script.
- **Ruta no encontrada o slug desconocido en visor dinámico**: Si un usuario accede a una URL de reporte dinámico inexistente (ej. `/reports/view/ruta-invalida`), el visor debe mostrar un mensaje amigable indicando que la plantilla no existe y un botón para volver al Centro de Reportes, en lugar de romper el renderizado.
- **Persistencia en almacenamiento local saturado o bloqueado**: Si el almacenamiento del navegador está restringido o deshabilitado, el sistema debe operar en memoria sin generar bloqueos fatales en la aplicación.
- **Disparos múltiples y concurrentes de navegación**: Hacer clic consecutivo muy rápido en un enlace de reporte no debe generar apilamiento inconsistente en el historial de navegación ni llamadas duplicadas no deseadas.
- **Formularios con datos incompletos en Guía de Movilización o Nuevo Reporte**: Intentar guardar o exportar sin los campos obligatorios debe señalar visualmente los campos requeridos con mensajes comprensibles para el usuario.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE presentar un encabezado institucional que identifique claramente el "Centro de Reportes Multiespecie" con su respectivo resumen descriptivo.
- **FR-002**: El sistema DEBE ofrecer una barra de filtrado por especie pecuaria que incluya: Todos los Reportes (Global), Bovinos, Aves de corral, Porcinos, Búfalos, Caprinos y Equinos.
- **FR-003**: Al seleccionar una especie en la barra de filtros, el sistema DEBE actualizar de manera inmediata y reactiva el catálogo de categorías estándar, destacando la tarjeta de la especie seleccionada y filtrando la tabla de reportes guardados.
- **FR-004**: El sistema DEBE incluir un campo de búsqueda en tiempo real que filtre los reportes guardados por código correlativo, nombre, categoría, descripción o especie.
- **FR-005**: El sistema DEBE mostrar dinámicamente un contador de reportes visibles que refleje la cantidad exacta de registros según los filtros y términos de búsqueda activos.
- **FR-006**: La tabla de reportes guardados DEBE mostrar columnas estructuradas para Código, Nombre del Reporte & Especie, Descripción & Formato, y Acciones.
- **FR-007**: Cada reporte guardado DEBE mostrar una insignia (badge) visual distintiva según su especie (color e icono temático) y etiquetas para categoría y frecuencia.
- **FR-008**: Cada fila de reporte guardado DEBE proporcionar una acción de "Ver" que redirija a la subvista especializada si existe ruta mapeada, o abra el diálogo de detalle zootécnico en su defecto.
- **FR-009**: Cada fila de reporte guardado DEBE proporcionar una acción de eliminación con diálogo de confirmación previo antes de aplicar el borrado.
- **FR-010**: Las modificaciones en la lista de reportes guardados (creación, edición, eliminación) DEBEN sincronizarse en el almacenamiento local para mantenerse vigentes tras recargar la sesión.
- **FR-011**: El sistema DEBE desplegar un catálogo estructurado de 9 tarjetas maestras: Bovinos, Aves de corral, Porcinos, Búfalos, Caprinos, Equinos, Gestión Pecuaria General, Históricos & Series de Tiempo, y Multirebaños & Consolidado Global.
- **FR-012**: Cada tarjeta del catálogo estándar DEBE contener su icono representativo, título principal, subtítulo explicativo y la lista completa de enlaces de reportes predefinidos.
- **FR-013**: Cada uno de los enlaces de las tarjetas del catálogo estándar DEBE estar enlazado a su ruta funcional específica (subvista dedicada o visor dinámico con slug parametrizado).
- **FR-014**: El sistema DEBE contar con un botón de acción principal de tipo dividido (split-button) o botón directo que permita desplegar opciones para agregar reportes por categoría o abrir herramientas avanzadas.
- **FR-015**: El sistema DEBE incorporar un botón de acceso directo para el "Diseñador de Informes BI Ad-Hoc".
- **FR-016**: El sistema DEBE incorporar un botón de acceso directo para la emisión de la "Guía de Movilización Pecuaria".
- **FR-017**: El modal de "Nuevo Reporte" DEBE permitir al usuario ingresar código, nombre, categoría, especie, formato de salida y frecuencia de generación, validando que los datos obligatorios no queden en blanco.
- **FR-018**: El modal de "Detalle de Reporte" DEBE presentar la información técnica completa del reporte seleccionado y permitir su exportación o ejecución.
- **FR-019**: El visor dinámico de reportes (`/reports/view/:reportSlug`) DEBE interpretar correctamente los parámetros de URL para las 6 especies, renderizando la tabla analítica con paginación, selector de tamaño de página, búsqueda interna y selector de columnas visibles.
- **FR-020**: El visor dinámico DEBE ofrecer opciones para exportar los datos a formatos estándar como archivo delimitado (CSV) y documento imprimible (PDF).
- **FR-021**: Todas las ventanas modales DEBEN cerrarse de forma confiable mediante el botón de cierre (X), el botón secundario de cancelar y la tecla Escape.
- **FR-022**: La interfaz DEBE apegarse a la paleta de colores institucional AGROGAN (verde principal `#095431`, detalles `#2d6a4f`, neutros suaves) y mantener legibilidad tipográfica y contrastes accesibles.
- **FR-023**: El sistema DEBE manejar estados vacíos informativos tanto en la tabla de reportes guardados como en los resultados de filtrado cuando no haya elementos coincidentes.

### Key Entities *(include if feature involves data)*

- **Reporte Guardado**: Representa un informe configurado o pregrabado en el panel del usuario. Atributos: identificador único, código correlativo, nombre descriptivo, categoría temática, especie asociada, plantilla base, formato de salida, frecuencia programada, ruta de navegación asociada y fecha de registro.
- **Catálogo de Reporte Estándar**: Estructura de clasificación zootécnica que agrupa informes predefinidos por especie o ámbito de gestión. Atributos: título de categoría, subtítulo técnico, tipo de icono representativo, especie objetivo y lista de nombres de reportes estándar disponibles.
- **Plantilla de Informe Dinámico**: Definición paramétrica para la renderización en el visor dinámico. Atributos: slug de ruta, entidad de datos vinculada, título del informe, subtítulo zootécnico, especie pecuaria, color de insignia, icono característico y filtros biológicos preconfigurados.
- **Guía de Movilización Pecuaria**: Documento de control de transporte de animales. Atributos: número de guía, fecha de expedición, predio de origen, predio de destino, datos del conductor y vehículo, precintos zoosanitarios, desglose de cantidades de animales por especie y categoría, y estado de validez sanitaria.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de los enlaces de reportes predefinidos en las 9 tarjetas del catálogo estándar deben navegar a una vista operativa válida o abrir su ficha técnica correspondiente sin producir errores de ruta ni pantallas en blanco.
- **SC-002**: El filtrado por especie y la búsqueda por texto en la vista de reportes deben reflejar los resultados en pantalla en menos de 100 milisegundos tras la interacción del usuario.
- **SC-003**: Cero defectos bloqueantes o mayores en la navegación entre el Centro de Reportes, sus subvistas especializadas y el retorno a la vista principal.
- **SC-004**: El 100% de las ventanas modales (Nuevo Reporte, Detalle, Diseñador BI, Guía de Movilización) deben abrirse, cerrarse y procesar sus datos sin romper el árbol de componentes ni congelar la interfaz.
- **SC-005**: La tasa de éxito en las operaciones de agregar y eliminar reportes guardados con persistencia tras recarga de página debe ser del 100%.
- **SC-006**: La cobertura de pruebas de QA para casos felices (happy path) y casos de borde (edge cases) en el Centro de Reportes debe abarcar la totalidad de las 6 especies soportadas en la plataforma.

## Assumptions

- Se asume que el usuario accede a la plataforma desde navegadores web modernos con soporte estándar para JavaScript, almacenamiento local (localStorage) y renderizado CSS Grid/Flexbox.
- Se asume que los datos de prueba zootécnicos provistos en los módulos locales representan fielmente los flujos operativos de las 6 especies pecuarias contempladas en AGROGAN.
- Se asume que la exportación de documentos (CSV/PDF) se ejecuta en el entorno del cliente aprovechando las capacidades del navegador para descarga e impresión.
- Se asume que no se requieren permisos de autenticación o roles restrictivos durante la fase de auditoría de interfaz gráfica y validación de componentes de usuario.
