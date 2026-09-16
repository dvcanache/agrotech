# Quickstart & QA Verification Guide: Centro de Reportes AGROGAN

**Feature**: `specs/001-reports-qa-audit`
**Date**: 2026-09-16
**Status**: Ready for Execution

Esta guía contiene los procedimientos reproducibles y escenarios de prueba de QA para auditar la interfaz gráfica del **Centro de Reportes** y sus catálogos multiespecie.

---

## 1. Prerrequisitos y Preparación del Entorno

1. **Clonar / Ubicar el Repositorio**:
   ```bash
   cd /home/ferten/Work/agrotech
   git checkout develop
   ```
2. **Validar Dependencias y Compilación**:
   ```bash
   npm run build
   ```
   *Resultado esperado*: Vite genera el bundle de producción sin errores tipográficos ni excepciones de compilación.
3. **Iniciar el Servidor de Desarrollo Local**:
   ```bash
   npm run dev
   ```
   *Resultado esperado*: Servidor Vite activo en `http://localhost:5173/` (o puerto disponible asignado).

---

## 2. Escenarios de Prueba: Happy Paths

### Suite HP-01: Barra de Especies y Catálogo Dinámico
- **Paso 1**: Navegar a `http://localhost:5173/reports`.
- **Paso 2**: Verificar que el botón "Todos los Reportes" esté activo y muestre el total de reportes guardados en su badge.
- **Paso 3**: Hacer clic sucesivamente en cada píldora de especie:
  - 🐮 **Bovinos**: La tarjeta de Bovinos pasa al primer lugar con badge verde "Especie Activa".
  - 🐔 **Aves de corral**: La tarjeta de Aves pasa al frente con badge "Especie Activa".
  - 🐷 **Porcinos**: La tarjeta de Porcinos se destaca en primera posición.
  - 🐃 **Búfalos**: La tarjeta de Búfalos se resalta.
  - 🐐 **Caprinos**: La tarjeta de Caprinos se resalta.
  - 🐴 **Equinos**: La tarjeta de Equinos se resalta.
- **Paso 4**: Pulsar "Ver Todas las Especies" en la cabecera del catálogo o el botón "Todos los Reportes".
- *Resultado esperado*: Las 9 tarjetas se despliegan en su orden natural sin parpadeos ni solapamientos.

### Suite HP-02: Navegación de Reportes Estándar por Especie
- **Paso 1**: En la tarjeta "Bovinos", hacer clic en "Vientres y Producción Lechera".
  - *Resultado esperado*: La URL cambia a `/reports/dams` y se renderiza la vista de Vientres con KPIs y tabla de hembras.
- **Paso 2**: Volver atrás y hacer clic en "Curvas de Lactancia Wood 305d".
  - *Resultado esperado*: La URL cambia a `/reports/view/bovinos-curvas-lactancia-wood` y carga el visor dinámico con gráfico de curva láctea y tabla de persistencia.
- **Paso 3**: En la tarjeta "Aves", hacer clic en "Control Diario de Postura y Huevos".
  - *Resultado esperado*: La URL cambia a `/reports/view/aves-postura-galpon` y carga la matriz con conteos AAA/AA/A y semáforo productivo.
- **Paso 4**: En la tarjeta "Porcinos", hacer clic en "Eficiencia Reproductiva de Cerdas".
  - *Resultado esperado*: La URL cambia a `/reports/view/porcinos-eficiencia-reproductoras` y presenta indicadores de camadas y LDCA.
- **Paso 5**: En la tarjeta "Búfalos", hacer clic en "Control Lechero Bufalino y Sólidos Totales".
  - *Resultado esperado*: Carga `/reports/view/bufalos-produccion-grasa` con métricas de grasa (7-9%) y aptitud quesera.
- **Paso 6**: En la tarjeta "Caprinos", hacer clic en "Evaluación FAMACHA de Anemia Parasitaria".
  - *Resultado esperado*: Carga `/reports/view/caprinos-famacha` con semáforo conjuntival y prescripción médica.
- **Paso 7**: En la tarjeta "Equinos", hacer clic en "Certificación Oficial AIE (Test Coggins)".
  - *Resultado esperado*: Carga `/reports/view/equinos-coggins` con protocolos de laboratorio y estado de vigencia sanitaria.
- **Paso 8**: En "Gestión", "Históricos" y "Multirebaños", verificar que cada enlace navegue a sus respectivas subvistas funcionales.

### Suite HP-03: Herramientas Avanzadas y Modales
- **Paso 1**: Hacer clic en "+ Diseñar Informe BI".
  - *Resultado esperado*: Abre el modal del Diseñador BI Ad-Hoc. Seleccionar entidad "semovientes", marcar campos y verificar vista previa en vivo.
- **Paso 2**: Hacer clic en "Guía Movilización".
  - *Resultado esperado*: Abre el modal de la Guía Oficial con campos de origen, destino, transportista y cálculo de cabezas por especie.
- **Paso 3**: Probar el botón split "Agregar" y desplegar las opciones para crear reportes por especie.

---

## 3. Escenarios de Prueba: Casos de Borde (Edge Cases)

### Suite EC-01: Búsquedas No Convencionales y Acentuación
- **Prueba 1 (Tildes y mayúsculas)**: Buscar `"gestión"` vs `"GESTION"` vs `"gestion"`. En los tres casos debe retornar los reportes de Gestión coincidentes.
- **Prueba 2 (Caracteres especiales)**: Escribir `$$$###@@@` en el buscador. Debe presentar el estado vacío: `"No se encontraron reportes que coincidan con "$$$###@@@"."` sin errores en la consola del navegador.
- **Prueba 3 (Espacios múltiples)**: Escribir `"   inventario   "`. La búsqueda debe recortar espacios y encontrar el censo general.

### Suite EC-02: Slugs Desconocidos y Rutas Huérfanas
- **Prueba 1**: Navegar manualmente a `http://localhost:5173/reports/view/slug-completamente-inventado`.
- *Resultado esperado*: No debe producirse pantalla blanca (`White Screen of Death`). La interfaz debe manejar el caso nulo mostrando un aviso explicativo y un botón de retorno seguro al Centro de Reportes.

### Suite EC-03: Ciclo de Cancelación de Modales
- **Prueba 1 (Escape)**: Abrir el modal de Guía de Movilización y presionar `Escape`. Debe cerrarse inmediatamente y el scroll de la página debe quedar libre.
- **Prueba 2 (Backdrop Click)**: Abrir "Nuevo Reporte", hacer clic en el área gris semitransparente fuera del diálogo. Debe cerrarse.
- **Prueba 3 (Clic interior)**: Abrir "Nuevo Reporte" y hacer clic dentro de cualquier input de texto. El modal NO debe cerrarse.

### Suite EC-04: Resiliencia de Persistencia (`localStorage`)
- **Prueba 1**: Eliminar un reporte guardado, recargar el navegador (`F5`). El reporte eliminado no debe reaparecer.
- **Prueba 2**: Eliminar todos los reportes hasta tener 0 elementos. La tabla debe desplegar el estado vacío con el botón "Configurar Primer Reporte".

---

## 4. Matriz de Reporte de Hallazgos y Severidad

| Severidad | Criterio | Acción Requerida |
|-----------|----------|------------------|
| **Bloqueante (S1)** | Pantalla en blanco (White Screen), caída de la SPA, ruta rota que no permite volver. | Corrección inmediata obligatoria antes de liberar. |
| **Mayor (S2)** | Enlace que no navega a la subvista esperada, modal que no cierra o traba el scroll, falla de guardado. | Corrección prioritaria requerida. |
| **Menor (S3)** | Inconsistencia tipográfica, texto no normalizado en búsqueda, desajuste menor de espaciado o margen en móvil. | Ajuste cosmético o refinamiento de UX. |
| **Sugerencia (S4)** | Oportunidad de mejora zootécnica o tooltip explicativo adicional. | Documentar para optimizaciones futuras. |
