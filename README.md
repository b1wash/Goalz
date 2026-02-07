# ⚽ GOALZ - Quiniela de Fútbol

Aplicación web moderna para realizar predicciones de resultados de partidos de fútbol y competir con amigos mediante un sistema de puntos.

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
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
- [Panel de Administración](#-panel-de-administración)
- [Arquitectura del Backend](#️-arquitectura-del-backend)
- [API Endpoints](#-api-endpoints)
- [Características Técnicas](#-características-técnicas)
- [Autor](#-autor)

## 💻 Requisitos del Sistema

- **Node.js**: v18.0.0 o superior
- **npm**: v9.0.0 o superior
- **Navegador moderno**: Chrome, Firefox, Safari o Edge

Para verificar tus versiones:

```bash
node --version
npm --version
```

## 🛠️ Tecnologías

- **React 19** - Biblioteca UI con componentes funcionales
- **TypeScript** - Tipado estático para mayor seguridad
- **Vite** - Entorno de desarrollo ultrarrápido
- **Tailwind CSS** - Framework CSS utility-first
- **React Router DOM** - Navegación SPA
- **JSON Server** - API REST simulada
- **API-Football** - Integración con datos reales de La Liga
- **Context API** - Gestión de estado global
- **LocalStorage** - Persistencia de datos del cliente

## 🚀 Instalación

```bash
# Clonar repositorio
git clone https://github.com/b1wash/Goalz.git
cd goalz-app

# Instalar dependencias
npm install

# Configurar API Key (para sincronización con datos reales)
# 1. Copia el archivo .env.example a .env
cp .env.example .env

# 2. Edita .env y añade tu API Key de API-Football
# VITE_FOOTBALL_API_KEY=tu_clave_aqui
# Obtén tu clave gratis en: https://dashboard.api-football.com/

# Iniciar JSON Server (terminal 1)
npm run api

# Iniciar aplicación (terminal 2)
npm run dev
```

**URLs de acceso:**

- **Aplicación (Local)**: http://localhost:5173
- **Aplicación (Deploy)**: https://goalz-predictor.netlify.app/
- **API REST**: http://localhost:3001

## 📂 Estructura del Proyecto

```
goalz-app/
├── src/
│   ├── components/
│   │   ├── auth/              # Protección de rutas
│   │   │   ├── AdminRoute.tsx        # Solo administradores
│   │   │   └── ProtectedRoute.tsx    # Usuarios autenticados
│   │   ├── layout/            # Estructura general
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── matches/           # Componentes de partidos
│   │   ├── predictions/       # Componentes de predicciones
│   │   └── ui/                # Componentes atómicos reutilizables
│   ├── pages/                 # Vistas principales
│   │   ├── Inicio.tsx         # Dashboard personalizado
│   │   ├── Clasificacion.tsx  # Ranking de jugadores
│   │   ├── MisPredicciones.tsx # Historial con paginación
│   │   ├── HacerPrediccion.tsx # Formulario de predicción
│   │   ├── AdminMatches.tsx    # Panel de gestión con tabs
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── services/              # Comunicación con API
│   │   ├── api.ts
│   │   ├── matchService.ts
│   │   ├── predictionService.ts
│   │   └── userService.ts
│   ├── context/               # Estado global (Sesión, Usuario)
│   │   └── AppContext.tsx
│   ├── hooks/                 # Custom Hooks
│   │   ├── useDarkMode.ts
│   │   └── usePredicciones.ts
│   ├── types/                 # Definiciones TypeScript
│   ├── utils/                 # Funciones auxiliares
│   ├── App.tsx
│   └── main.tsx
├── db.json                     # Base de datos simulada
├── tailwind.config.js
└── package.json
```

## 📖 Uso de la Aplicación

### 🔐 Sistema de Autenticación

#### Login

- Accede con email y contraseña
- Sesión persistente con LocalStorage
- Redirección automática según rol

**Usuarios de prueba:**

- **Admin**: `user1@ejemplo.com` / `password123`
- **Usuario**: `user2@ejemplo.com` / `password123`

#### Registro

- Crea tu propia cuenta
- Validación de email único
- Contraseña segura obligatoria

### ⚽ Hacer Predicciones

1. Click en **"⚡ Predecir Ahora"**
2. Selecciona un partido pendiente
3. Elige el resultado (1=Local, X=Empate, 2=Visitante)
4. Ingresa el marcador exacto
5. Envía tu predicción

**Sistema de puntos:**

- 🎯 **5 puntos** → Marcador exacto
- ✅ **3 puntos** → Resultado correcto (1X2)
- ❌ **0 puntos** → Predicción incorrecta

### 📊 Ver Predicciones

- **Paginación:** 9 predicciones por página
- **Filtros dinámicos:**
  - Todas
  - Pendientes
  - Acertadas
  - Falladas

### 🏆 Clasificación

- Podio visual del Top 3
- Tabla completa ordenada por puntos
- Estadísticas de cada jugador
- **Los admins NO aparecen** (solo gestionan)

## 🔧 Panel de Administración

> 🔐 **Acceso exclusivo para rol `admin`**

### 📊 Dashboard

- Resumen de métricas del sistema
- Total de partidos, jugadores y predicciones
- Tasa de acierto global
- Próximos 5 partidos pendientes
- Top 5 clasificación en tiempo real

### ⚽ Gestión de Partidos

- **Lista completa** con filtros (Todos/Pendientes/Finalizados)
- **Crear partidos** nuevos
- **Actualizar resultados** con distribución automática de puntos
- **Eliminar partidos** (incluyendo predicciones asociadas)

### 👥 Gestión de Usuarios

- Lista de todos los usuarios registrados
- Identificación de roles (Admin/Jugador)
- Visualización de puntos por jugador
- **Eliminar usuarios** (con sus predicciones)

### 📈 Estadísticas Generales

- Total de predicciones realizadas
- Predicciones acertadas
- Tasa de acierto global
- Estado del sistema completo

### ⚙️ Características del Admin

**El administrador es un GESTOR puro:**

- ❌ NO aparece en clasificación
- ❌ NO puede hacer predicciones
- ❌ NO se le muestran puntos
- ✅ Acceso al panel de 3 secciones principales (Dashboard, Partidos, Usuarios)
- ✅ Gestión completa de partidos y resultados
- ✅ Gestión completa de usuarios
- ✅ Vista de métricas globales
- ✅ **Sincronización automática con resultados reales**
- ✅ **Herramientas de Mantenimiento Avanzadas**

### 🔄 Sincronización con API Real

**GOALZ se conecta con datos reales de La Liga EA Sports** mediante la integración con API-Football.

**Características:**

- **Matching inteligente**: Vincula partidos locales con reales por equipos, jornada y temporada.
- **Detección anti-duplicados**: Evita sumar puntos dos veces si un partido ya ha sido procesado.
- **Distribución masiva de puntos**: Actualiza marcadores y premia a los usuarios en un solo clic.
- **Feedback visual**: Resultados detallados de la sincronización (éxitos/errores).

### 🛠️ Herramientas de Mantenimiento (NUEVO)

He implementado herramientas críticas para garantizar la integridad de los datos:

1.  **🔄 Recalcular Clasificación**: Escanea todas las predicciones reales de la base de datos y reconstruye la puntuación de cada usuario desde cero. Ideal para corregir cualquier discrepancia o "puntos fantasma".
2.  **🗑️ Borrar Solo Partidos**: Limpia la lista de encuentros pero **respeta** las apuestas y puntos ya ganados por los usuarios.
3.  **☢️ Resetear Sistema**: Borra absolutamente todo (partidos y predicciones) y pone los contadores de los usuarios a cero. Perfecto para el inicio de una nueva temporada.

## ✨ Funcionalidades Destacadas

### 🔒 Integridad y Reglas de Juego

- **Anti-Duplicados**: El sistema bloquea automáticamente que un usuario realice más de una predicción para el mismo partido.
- **Protección de Puntos**: Lógica mejorada que impide la suma doble de puntos incluso si el administrador actualiza el resultado varias veces.

### 🎨 UI/UX Premium

- **Logos de Equipos**: Visualización de escudos de equipos reales con contenedores circulares elegantes y fallbacks inteligentes (emojis) si no hay logo disponible.
- **Contexto Temporal**: Las tarjetas de predicción ahora muestran la temporada/año (ej: 2023/24) para dar contexto histórico a las apuestas.
- **Responsividad Total**: Navbar optimizado que mantiene la información del usuario visible en todos los tamaños de desktop (desde 1024px) y colapsa correctamente en móvil.

## 🔌 API Endpoints

... (rest of the endpoints) ...

## 🌟 Características Técnicas

... (rest of the characteristics) ...

## 👤 Autor

... (author info) ...

---

## 🎓 Proyecto Académico

... (academic info) ...

### Ampliaciones Implementadas (Última Versión)

- [x] **Prevención de Predicciones Duplicadas**
- [x] **Sistema de Integridad de Puntos** (Sin doble conteo)
- [x] **Herramienta de Recalculo de Clasificación**
- [x] **Eliminación Selectiva vs Reset Total**
- [x] **Diseño de Logos Circulares de Equipos**
- [x] **Contexto de Temporada en Tarjetas**
- [x] **Fix Responsivo en Navbar (lg/xl)**
- [x] **Matching de API por Temporada y Jornada**
- [x] UX Premium con micro-animaciones
- [x] Filtros avanzados en tiempo real
- [x] Paginación completa en todas las vistas críticas

---

⚽ **¡Hecho con pasión por el fútbol y el código!** ⚽
