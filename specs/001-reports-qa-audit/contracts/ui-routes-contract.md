# UI & Route Contract: Matriz de Enrutamiento del Centro de Reportes

**Feature**: `specs/001-reports-qa-audit`
**Date**: 2026-09-16
**Status**: Completed

## 1. Contrato de Rutas Estáticas de Subvistas

Toda ruta listada en este contrato DEBE estar debidamente declarada en `App.tsx` y responder con el componente correspondiente sin redirecciones erróneas ni excepciones.

| Categoría | Nombre del Reporte | Ruta Principal | Ruta Alternativa (Alias) | Componente Responsable |
|-----------|--------------------|----------------|--------------------------|------------------------|
| **Gestión** | Inventarios | `/reports/inventories` | `/reportes/inventarios` | `InventariosView` |
| **Gestión** | Movimientos | `/reports/movements` | `/reportes/movimientos` | `MovimientosView` |
| **Gestión** | Distribución normal | `/reports/historics/normaldistribution` | `/reportes/distribucion-normal` | `DistribucionNormalView` |
| **Gestión** | Técnicos | `/reports/technicians` | `/reportes/tecnicos` | `TecnicosView` |
| **Gestión** | Reproductores | `/reports/breeders` | `/reportes/reproductores` | `ReproductoresView` |
| **Bovinos** | Vientres | `/reports/dams` | `/reportes/vientres` | `VientresView` |
| **Bovinos** | Próximas a secar | `/reports/nexttodry` | `/reportes/proximas-secar` | `ProximasSecarView` |
| **Bovinos** | Próximas a parir | `/reports/nexttobirth` | `/reportes/proximas-parir` | `ProximasParirView` |
| **Bovinos** | Próximas a revisar | `/reports/nexttocheck` | `/reportes/proximas-revisar` | `ProximasRevisarView` |
| **Bovinos** | Animales secos | `/reports/drycows` | `/reportes/animales-secos` | `AnimalesSecosView` |
| **Bovinos** | Animales lactando | `/reports/cowsinproduction` | `/reportes/animales-lactando` | `AnimalesLactandoView` |
| **Bovinos** | Animales criando | `/reports/cowsraising` | `/reportes/animales-criando` | `AnimalesCriandoView` |
| **Bovinos** | No Vientres | `/reports/nodams` | `/reportes/no-vientres` | `NoVientresView` |
| **Históricos** | Historia de reproducciones | `/reports/historics/reproductions` | `/reportes/historicos/reproducciones` | `HistoriaReproduccionesView` |
| **Históricos** | Historia de lactancias | `/reports/historics/lactations` | `/reportes/historicos/lactancias` | `HistoriaLactanciasView` |
| **Históricos** | Historia de pesajes de leche | `/reports/historics/milks` | `/reportes/historicos/pesajes-leche` | `HistoriaPesajesLecheView` |
| **Históricos** | Historia de crecimientos | `/reports/historics/weighings` | `/reportes/historicos/crecimientos` | `HistoriaCrecimientosView` |
| **Multirebaños** | Inventario multirebaño | `/reports/multiherds/inventories` | `/reportes/multirebanos/inventarios` | `MultirebanoInventarioView` |
| **Multirebaños** | Situación reproductiva actual | `/reports/multiherds/reproduction` | `/reportes/multirebanos/reproduccion` | `MultirebanoReproduccionView` |
| **Multirebaños** | Distribución por preñez | `/reports/multiherds/pregnancy-distribution` | `/reportes/multirebanos/distribucion-prenez` | `MultirebanoDistribucionPrenezView` |
| **Multirebaños** | Situación productiva actual | `/reports/multiherds/production-status` | `/reportes/multirebanos/situacion-productiva` | `MultirebanoProduccionView` |
| **Multirebaños** | Transacciones | `/reports/multiherds/transactions` | `/reportes/multirebanos/transacciones` | `MultirebanoTransaccionesView` |
| **Multirebaños** | Producciones diarias | `/reports/multiherds/daily-production` | `/reportes/multirebanos/produccion-diaria` | `MultirebanoProduccionDiariaView` |

---

## 2. Contrato de Slugs Dinámicos (`DynamicReportViewer`)

Toda ruta dinámica bajo `/reports/view/:reportSlug` debe resolver a un registro válido en `PRESET_SLUGS` con su entidad de datos correspondiente.

| Especie | Nombre de Plantilla | Slug de Ruta | Entidad de Datos |
|---------|---------------------|--------------|------------------|
| **Aves** | Control Diario de Postura y Huevos | `aves-postura-galpon` | `postura_avicola` |
| **Aves** | Curva de Postura vs Guía Genética | `aves-curva-postura` | `postura_avicola` |
| **Aves** | Conversión Alimenticia e ICA Broilers | `aves-conversion-alimenticia` | `postura_avicola` |
| **Aves** | Mortalidad Semanal en Galpón | `aves-mortalidad-seleccion` | `postura_avicola` |
| **Aves** | Incubación y Eclosión por Lote | `aves-clasificacion-huevo` | `postura_avicola` |
| **Aves** | Acondicionamiento y Registro Gallos Finos | `aves-tratamientos-vacunaciones` | `postura_avicola` |
| **Porcinos** | Eficiencia Reproductiva de Cerdas | `porcinos-eficiencia-reproductoras` | `camadas_porcinas` |
| **Porcinos** | Balance de Camadas (LNV / LNM / Momias) | `porcinos-camadas-prolificidad` | `camadas_porcinas` |
| **Porcinos** | Curva de Crecimiento y Ceba Porcina | `porcinos-cebo-engorde` | `camadas_porcinas` |
| **Porcinos** | Espesor Grasa Dorsal P2 y Magro | `porcinos-conversion-lote` | `camadas_porcinas` |
| **Porcinos** | Monitoreo Sanitario de Piara (PPC / Circovirus) | `porcinos-destetes-gdp` | `camadas_porcinas` |
| **Búfalos** | Control Lechero Bufalino y Sólidos Totales | `bufalos-produccion-grasa` | `controles_lecheros` |
| **Búfalos** | Eficiencia en Sabanas Inundables | `bufalos-sanidad-endoparasitos` | `eventos_veterinarios` |
| **Búfalos** | Crecimiento y Destete de Bucerros | `bufalos-crecimiento-destete` | `semovientes` |
| **Búfalos** | Lactancias Búfalas Normalizadas 270d | `bufalos-lactancia-270d` | `lactancias` |
| **Caprinos** | Control Lechero Caprino en Tarima | `caprinos-calidad-leche` | `controles_lecheros` |
| **Caprinos** | Evaluación FAMACHA de Anemia Parasitaria | `caprinos-famacha` | `eventos_veterinarios` |
| **Caprinos** | Monitoreo Podológico de Pezuñas | `caprinos-podologia` | `eventos_veterinarios` |
| **Caprinos** | Lactancias Caprinas 210d | `caprinos-curva-lactancia` | `controles_lecheros` |
| **Caprinos** | Crecimiento y Rendimiento Cabritos Boer | `caprinos-crecimiento-boer` | `semovientes` |
| **Equinos** | Libro de Registro y Pasaporte Equino | `equinos-pasaporte-genealogia` | `semovientes` |
| **Equinos** | Cronograma de Herraje y Desvasado | `equinos-herraje-desvasado` | `eventos_veterinarios` |
| **Equinos** | Certificación Oficial AIE (Test Coggins) | `equinos-coggins` | `eventos_veterinarios` |
| **Equinos** | Foliculometría y Fertilidad de Yeguas | `equinos-foliculometria` | `semovientes` |
| **Equinos** | Bitácora de Vaquería y Entrenamiento Deportivo | `equinos-vaqueria-faena` | `faena_y_trabajo` |
| **Bovinos** | Curvas de Lactancia Wood 305d | `bovinos-curvas-lactancia-wood` | `lactancias` |
| **Bovinos** | Mastitis CMT por Cuartos Mamarios | `bovinos-mastitis-sanidad` | `eventos_veterinarios` |

---

## 3. Contrato de Fallback para Slugs No Identificados

Si un usuario solicita una URL de la forma `/reports/view/:reportSlug` donde `reportSlug` no coincida con ningún elemento de la tabla anterior:
1. El visor DEBE evitar el colapso del renderizado (no lanzar error en blanco).
2. DEBE mostrar un mensaje descriptivo: `"Plantilla de reporte no encontrada para el identificador solicitante"`.
3. DEBE incluir un botón visible `"Volver al Centro de Reportes"` que redirija a `/reports`.
