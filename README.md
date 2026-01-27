# ⚽ GOALZ - Quiniela de Fútbol

Aplicación web para realizar predicciones de resultados de partidos de fútbol y competir con amigos mediante un sistema de puntos.

![Goalz Banner](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.18-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 📋 Tabla de Contenidos

- [Requisitos del Sistema](#-requisitos-del-sistema)
- [Tecnologías](#️-tecnologías)
- [Instalación](#-instalación)
- [Uso de la Aplicación](#-uso-de-la-aplicación)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Funcionalidades](#-funcionalidades)
- [API Endpoints](#-api-endpoints)
- [Características Técnicas](#-características-técnicas)
- [Requisitos y Cumplimiento](#-requisitos-y-cumplimiento)
- [Autor](#-autor)

## 💻 Requisitos del Sistema

Antes de instalar, asegúrate de tener:

- **Node.js**: v18.0.0 o superior
- **npm**: v9.0.0 o superior
- **Git**: Para clonar el repositorio
- **Navegador moderno**: Chrome, Firefox, Safari o Edge (última versión)

Para verificar tus versiones:

```bash
node --version
npm --version
```

## 🛠️ Tecnologías

- **Vite** - Entorno de desarrollo ultrarrápido
- **React 18** - Biblioteca UI con componentes funcionales
- **TypeScript** - Tipado estático para mayor seguridad
- **Tailwind CSS** - Framework CSS utility-first
- **React Router DOM** - Navegación SPA
- **JSON Server** - API REST simulada
- **Git/GitHub** - Control de versiones

## 🚀 Instalación

```bash
# Clonar repositorio
git clone https://github.com/b1wash/Goalz.git
cd goalz-app

# Instalar dependencias
npm install

# Iniciar JSON Server (terminal 1)
npm run api

# Iniciar aplicación (terminal 2)
npm run dev
```

La app estará disponible en: **http://localhost:5173**  
La API estará disponible en: **http://localhost:3001**

## 📂 Estructura del Proyecto

```
goalz-app/
├── public/                 # Recursos estáticos (imágenes, logos)
├── src/
│   ├── components/
│   │   ├── auth/           # ✅ NUEVO: Protección de rutas
│   │   │   ├── AdminRoute.tsx      # Protección para administradores
│   │   │   └── ProtectedRoute.tsx  # Protección para usuarios logueados
│   │   ├── layout/         # Estructura general (Navbar, Footer)
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── ContenedorPagina.tsx
│   │   ├── matches/        # Componentes de partidos
│   │   ├── predictions/    # Componentes de predicciones
│   │   └── ui/             # Componentes atómicos (Botones, Cards, Inputs)
│   ├── pages/              # Vistas completas de la aplicación
│   │   ├── Inicio.tsx
│   │   ├── Clasificacion.tsx
│   │   ├── MisPredicciones.tsx
│   │   ├── HacerPrediccion.tsx
│   │   ├── AdminMatches.tsx
│   │   ├── Login.tsx       # ✅ Pantalla de acceso
│   │   └── Register.tsx    # ✅ Pantalla de registro
│   ├── services/           # Comunicación con la API (Fetch)
│   │   ├── api.ts          # Cliente base
│   │   ├── matchService.ts
│   │   ├── predictionService.ts
│   │   └── userService.ts
│   ├── types/              # Definiciones de TypeScript (Interfaces)
│   ├── hooks/              # Lógica reutilizable (Modo oscuro, Predicciones)
│   ├── context/            # Estado global (Sesión, Datos globales)
│   ├── utils/              # Funciones auxiliares (Cálculos, Validaciones)
│   ├── App.tsx             # Enrutador y estructura raíz
│   └── main.tsx            # Punto de entrada de la aplicación
├── db.json                 # Base de datos simulada (JSON Server)
├── tailwind.config.js      # Configuración de diseño
└── package.json            # Dependencias y scripts
```

## 📖 Uso de la Aplicación

### Primera vez usando GOALZ

1. **Inicio de sesión real**: La aplicación cuenta con un sistema de login. Puedes usar los emails de prueba o registrarte.
2. **Registro de usuarios**: Puedes crear tu propia cuenta desde la página de registro.
3. **Navega por las secciones** usando la barra superior.
4. **Explora tus estadísticas** en la página de Inicio.

### Hacer una predicción

1. Ve a **"Hacer Predicción"** (botón verde "⚡ Predecir Ahora")
2. Selecciona un partido de la lista desplegable
3. Elige el resultado (1 = Local, X = Empate, 2 = Visitante)
4. Ingresa el marcador exacto que predices
5. Click en **"🚀 ENVIAR PREDICCIÓN"**

> ⚠️ **Nota**: Asegúrate de que el marcador coincida con tu predicción (ej: si pones 2-0, debes elegir "1 - Local")

### Ver tus predicciones

1. Ve a **"Mis Predicciones"**
2. Usa los filtros para ver:
   - **Todas**: Historial completo
   - **Pendientes**: Partidos aún no jugados
   - **Acertadas**: Predicciones con puntos ✅
   - **Falladas**: Predicciones sin puntos ❌

### Gestión de Cuentas

1. **Login**: Accede con email y contraseña.
2. **Registro**: Crea una cuenta nueva con nombre, email y contraseña.
3. **Logout**: Cierra sesión de forma segura desde el Navbar.

### Panel de Administración

> 🔐 Solo accesible para usuarios con el rol `admin`.

1. Ve a **"Admin"**
2. **Crear partido**: Rellena el formulario y click en "Crear Partido"
3. **Actualizar resultado**: Selecciona partido finalizado, ingresa marcador y click en "Actualizar"
4. Los puntos se calculan automáticamente para todos los usuarios

## ✨ Funcionalidades

### 🏠 Página de Inicio

- Resumen de estadísticas del usuario (Puntos, Partidos)
- Próximos partidos de la jornada
- Últimos resultados con diseño dinámico

### 🏆 Clasificación

- Tabla de usuarios ordenada por puntos
- Podio visual (Top 3) con medallas (🥇, 🥈, 🥉)
- Muestra: posición, nombre, puntos totales, aciertos

### 📊 Mis Predicciones

- Historial completo de predicciones del usuario
- Filtros dinámicos: Todas / Acertadas / Falladas / Pendientes
- Muestra: partido, predicción, resultado real, puntos ganados

### ⚡ Hacer Predicción

- Formulario completo para hacer predicciones
- Validación de coherencia entre marcador y resultado (1X2)
- Sistema de puntos automático:
  - **5 puntos** por acertar el marcador exacto
  - **3 puntos** por acertar el resultado (1, X, 2)

### 🔧 Panel Admin

- Creación y gestión de nuevos partidos
- Actualización de resultados en tiempo real
- Recálculo automático de puntos para toda la base de usuarios

## 🎨 Diseño y UI/UX

- **📱 Responsive Design**: Adaptado a móvil, tablet y desktop ultrawide.
- **🌗 Modo Dual Dinámico**: Sistema de cambio de tema (Light/Dark) con persistencia en localStorage y detección de preferencia de sistema.
- **✨ Micro-interacciones**: Transiciones suaves, efectos glassmorphism y hover premium.
- **🛡️ Tipado Estricto**: 100% desarrollado con TypeScript.
- **🧩 Reutilización**: 15+ componentes UI atómicos y modulares.

## 🔌 API Endpoints

### Partidos

- `GET /matches` - Obtener todos los partidos
- `GET /matches?status=pending` - Obtener partidos pendientes
- `GET /matches/:id` - Obtener un partido por ID
- `POST /matches` - Crear un nuevo partido
- `PATCH /matches/:id` - Actualizar resultado de un partido

### Predicciones

- `GET /predictions` - Obtener todas las predicciones
- `GET /predictions?userId=:userId` - Obtener predicciones de un usuario
- `GET /predictions?matchId=:matchId` - Obtener predicciones de un partido
- `POST /predictions` - Crear una nueva predicción
- `PATCH /predictions/:id` - Actualizar puntos de una predicción

### Usuarios

- `GET /users` - Obtener todos los usuarios
- `GET /users?_sort=totalPoints&_order=desc` - Obtener clasificación
- `GET /users/:id` - Obtener un usuario por ID
- `PATCH /users/:id` - Actualizar estadísticas de un usuario

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo

# API
npm run api          # Inicia JSON Server en puerto 3001

# Build
npm run build        # Compila la aplicación para producción

# Preview
npm run preview      # Previsualiza la build de producción

# Lint
npm run lint         # Ejecuta el linter
```

## 🌟 Características Técnicas

- ✅ **SPA** con React Router
- ✅ **TypeScript** con tipado estricto
- ✅ **Context API** para estado global (Sesión, Puntos)
- ✅ **Autenticación Completa**: Login, Registro y Logout
- ✅ **Autorización por Roles**: Rutas protegidas para usuarios y administradores
- ✅ **Custom Hooks** para lógica reutilizable
- ✅ **Componentes reutilizables** (15+)
- ✅ **Validación de formularios** avanzada
- ✅ **Manejo de errores** visual
- ✅ **LocalStorage** para persistencia de sesión y tema
- ✅ **API REST** con JSON Server
- ✅ **Responsive Design**
- ✅ **Variables de entorno**

## ✅ Requisitos y Cumplimiento

Este proyecto ha sido diseñado para cumplir con los objetivos técnicos de la asignatura **DWEC**:

### 1. Requisitos Funcionales Mínimos

- **Estructura SPA**: Navegación completa mediante `React Router DOM`.
- **Vistas del Sistema**: Implementadas 5 vistas (Inicio, Clasificación, Mis Predicciones, Hacer Predicción, Admin).
- **Componentes**: Uso de componentes funcionales con separación clara entre `/ui` y `/pages`.
- **Estado y Lógica**: Gestión mediante `useState` y `useEffect` con tipado estricto.
- **Formularios**: Validación avanzada y manejo de errores en el envío de predicciones.
- **Consumo de API**: Integración modular con **JSON Server** mediante servicios tipados.

### 2. Especificación Técnica

- **TypeScript**: Tipado estático en todo el código base (Interfaces y Types).
- **Tailwind CSS**: Diseño 100% responsive y usable sin librerías externas.
- **Organización**: Estructura profesional por carpetas (`services`, `hooks`, `context`, `types`).
- **Control de Versiones**: Gestión total mediante Git/GitHub.

### 🌟 Ampliaciones (Subir Nota)

- [x] **Context API**: Estado global para usuario, sesión y puntos en tiempo real.
- [x] **Autenticación y Registro**: Sistema completo con validación y persistencia.
- [x] **Roles de Usuario**: Protección de rutas (`AdminRoute` y `ProtectedRoute`).
- [x] **Custom Hooks**: Abstracción de lógica en `useDarkMode` y `usePredicciones`.
- [x] **Modo Oscuro**: Tema dual con persistencia y detección de preferencia.
- [x] **Filtros Avanzados**: Filtrado dinámico en tiempo real en la vista de predicciones.
- [x] **UX Premium**: Glassmorphism, micro-animaciones y feedback visual de carga.

## 👤 Autor

**Biwash Shrestha**  
📧 Email: biwash@gmail.com  
🔗 GitHub: [@b1wash](https://github.com/b1wash)

## 🙏 Agradecimientos

- Proyecto desarrollado como práctica de **Desarrollo Web en Entorno Cliente (DWEC)**
- Tecnologías modernas del ecosistema JavaScript
- Diseño inspirado en aplicaciones deportivas modernas

---

⚽ **¡Hecho con pasión por el fútbol y el código!** ⚽
