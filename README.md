# AgroTech — Plataforma de Gestión Ganadera Inteligente

[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/)
[![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)](https://www.chartjs.org/)

**AgroTech** es una solución integral de software administrativo y analítico diseñada para el sector agropecuario (AgTech). Permite a productores, veterinarios y administradores de fincas gestionar eficientemente semovientes (bovinos, bufalinos, caprinos, ovinos), monitorear indicadores clave de rendimiento (KPIs), supervisar eventos reproductivos y sanitarios, y administrar maquinaria e insumos en tiempo real.

---

## 📋 Tabla de Contenidos

1. [Características Principales](#-características-principales)
2. [Módulos del Sistema](#-módulos-del-sistema)
3. [Stack Tecnológico](#-stack-tecnológico)
4. [Estructura del Proyecto](#-estructura-del-proyecto)
5. [Requisitos Previos](#-requisitos-previos)
6. [Instalación y Puesta en Marcha](#-instalación-y-puesta-en-marcha)
7. [Scripts Disponibles](#-scripts-disponibles)
8. [Diseño y Experiencia de Usuario (UI/UX)](#-diseño-y-experiencia-de-usuario-uiux)
9. [Hoja de Ruta (Roadmap)](#-hoja-de-ruta-roadmap)
10. [Licencia](#-licencia)

---

## 🚀 Características Principales

- **Dashboard Ejecutivo en Tiempo Real:** Métricas clave de ganancia de peso diaria, promedios de lactancia y resúmenes reproductivos/productivos.
- **Visualización Interactiva de Datos:** Gráficos de dona (*Doughnut Charts*) dinámicos para distribución del inventario, estado reproductivo y estado productivo.
- **Control Detallado de Semovientes:** Registro con identificación práctica y única, lote/potrero, categoría, estado vital, composición racial y árbol genealógico (padre/madre).
- **Centro de Eventos Unificado:** Registro cronológico de actividades reproductivas (servicios, partos, celos), productivas (pesajes de leche y carne), sanitarias (vacunación, tratamientos) y movimientos de rebaño.
- **Gestión de Maquinaria y Equipos:** Control de inventario de implementos, vehículos y tractores, con seguimiento de mantenimiento preventivo y combustible.
- **Configuración Agronómica y Predial:** Soporte multi-país, categorización por zonas agroecológicas (desierto tropical, bosque seco, sabana) y tipos de explotación (doble propósito, leche, carne, cría).

---

## 📦 Módulos del Sistema

### 1. Dashboard Analítico
- **Tarjetas KPI:**
  - **Promedio diario de última lactancia** (kg/día por animal).
  - **Ganancia global de peso:** Desglosada por hembras, machos y mautes (kg/día).
- **Gráficos Dinámicos:**
  - **Inventario Actual:** Distribución porcentual por categorías (Vacas, Novillas, Mautas, Becerros, etc.).
  - **Situación Reproductiva:** Estado del rebaño (Preñadas, Vacías, En espera de diagnóstico).
  - **Situación Productiva:** Estado de producción (En ordeño, Secas, Criando).

### 2. Gestión de Semovientes / Animales
- Listado tabulado de alta densidad con filtros dinámicos y búsqueda instantánea.
- Identificador práctico visible y código único del animal.
- Cálculo automático de edad en años y meses.
- Control de ubicación por potrero o lote asignado.

### 3. Centro de Eventos
- **Eventos Reproductivos:** Servicios (inseminación/monta natural), palpaciones ginecológicas, confirmación de preñez, partos y celos detectados.
- **Eventos Productivos:** Controles lecheros individuales, pesajes de evolución corporal y secado programado.
- **Eventos Sanitarios:** Protocolos de vacunación, desparasitación, pruebas de mastitis y tratamientos médicos.
- **Eventos Operativos:** Traslado entre lotes, cambios de pastura y pesajes de báscula.

### 4. Inventario de Equipos y Herramientas
- Ficha de maquinaria (marca, modelo, número de serie / VIN, horómetro y kilometraje).
- Historial de mantenimiento preventivo, correctivo y consumo de combustible.
- Asignación de operarios y áreas de trabajo responsables.

### 5. Configuración General (Ajustes)
- Parámetros del predio: nombre de la hacienda/finca, titular o propietario, país de origen.
- Configuración zootécnica: especie predominante, sistema de manejo (estabulado, semi-estabulado, pastoreo intensivo/extensivo).

---

## 🛠 Stack Tecnológico

| Capa | Tecnología | Descripción |
| :--- | :--- | :--- |
| **Bundler & Build Tool** | [Vite 5](https://vitejs.dev/) | Entorno de compilación ultra-rápido con Hot Module Replacement (HMR). |
| **Lenguaje** | [TypeScript 5](https://www.typescriptlang.org/) | Tipado estático y robustez para la lógica del cliente y modelos de datos. |
| **Framework Frontend** | [AngularJS](https://angularjs.org/) | Arquitectura MVC/MVVM para control de vistas, directivas y binding bidireccional. |
| **Visualización** | [Chart.js](https://www.chartjs.org/) | Gráficos vectoriales interactivos integrados mediante directivas personalizadas. |
| **Estilos** | CSS3 Moderno | Diseño responsive con Flexbox, CSS Grid, variables CSS y paleta orgánica moderna. |
| **Tipografía** | Google Fonts | Familia tipográfica *Outfit* (pesos 300, 400, 500, 600, 700). |

---

## 📂 Estructura del Proyecto

```text
agrotech/
├── app.ts               # Lógica principal de controladores, directivas y modelos TypeScript
├── index.html           # Plantilla principal del Dashboard y vistas modulares
├── styles.css           # Estilos globales, paleta de colores AgTech y componentes UI
├── package.json         # Configuración del paquete, dependencias y scripts
├── package-lock.json    # Árbol de dependencias bloqueado
├── tsconfig.json        # Configuración del compilador TypeScript
├── .gitignore           # Archivos y carpetas excluidos del control de versiones
└── README.md            # Documentación técnica completa del proyecto
```

---

## ⚙️ Requisitos Previos

Asegúrate de contar con el siguiente entorno instalado en tu equipo:

- **Node.js:** Versión 18.0.0 o superior (se recomienda LTS).
- **npm:** Versión 9.0.0 o superior (o gestores alternativos como `pnpm` o `yarn`).
- **Navegador Web:** Chrome, Firefox, Safari o Edge moderno.

---

## 💻 Instalación y Puesta en Marcha

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/dvcanache/agrotech.git
   cd agrotech
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar en entorno de desarrollo:**
   ```bash
   npm run dev
   # o alternativamente:
   npm start
   ```

4. **Abrir en el navegador:**
   Ingresa a [http://localhost:5173](http://localhost:5173) en tu navegador web.

---

## 📜 Scripts Disponibles

En el directorio raíz del proyecto puedes ejecutar:

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia el servidor local de desarrollo con Vite y recarga en caliente. |
| `npm start` | Alias para iniciar el servidor de desarrollo (`vite`). |
| `npm run build` | Compila TypeScript y genera el paquete de producción en la carpeta `/dist`. |
| `npm run preview` | Levanta un servidor local para previsualizar la compilación generada en `/dist`. |

---

## 🎨 Diseño y Experiencia de Usuario (UI/UX)

La interfaz de usuario ha sido concebida bajo principios de ergonomía visual para el trabajo agrícola:

- **Paleta de Colores Naturaleza/Agro:**
  - Primario / Esmeralda: `#2d6a4f`
  - Acento Menta: `#52b788`
  - Fondo Menta Neutro: `#f3f5f4`
  - Tarjetas y Contenedores: `#ffffff` con sombras suaves y bordes redondeados (`14px`).
- **Navegación:**
  - Barra superior (*Topbar*) con selector rápido de predio/rebaño, buscador global y avatar de usuario.
  - Barra lateral (*Sidebar*) estilizada con acceso directo a cada módulo operativo.

---

## 🔮 Hoja de Ruta (Roadmap)

- [ ] Integración con lectores RFID Bluetooth para identificación electrónica en manga.
- [ ] Sincronización con básculas electrónicas (protocolos Tru-Test / Gallagher).
- [ ] Módulo de exportación de planillas oficiales sanitarias en formatos PDF y Excel (XLSX).
- [ ] Arquitectura *Offline-First* con base de datos local SQLite para dispositivos móviles en campo.
- [ ] API REST Backend con autenticación multi-tenant y roles de acceso (Administrador, Veterinario, Caporal).

---

## 📄 Licencia

Este proyecto está bajo la Licencia **MIT**. Puedes consultar el archivo de licencia para mayores detalles.

---

**Desarrollado con dedicación para impulsar la tecnología en el campo.**
