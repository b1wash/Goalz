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

- **React 19** - Herramienta para crear la interfaz
- **TypeScript** - Sistema para evitar errores de código
- **Vite** - Herramienta de desarrollo rápida
- **Tailwind CSS** - Sistema de diseño para los estilos
- **React Router DOM** - Sistema de navegación entre páginas
- **JSON Server** - Base de datos sencilla para pruebas
- **API-Football** - Datos reales de La Liga
- **Context API** - Gestión de la información del usuario
- **LocalStorage** - Guardado de datos en el navegador

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
│   │   ├── footballApiService.ts  # Conexión con API real
│   │   ├── matchService.ts
│   │   ├── predictionService.ts
│   │   └── userService.ts
│   ├── context/               # Estado global (Sesión, Usuario)
│   │   └── AppContext.tsx
│   ├── hooks/                 # Custom Hooks
│   │   ├── useDarkMode.ts
│   │   └── usePredicciones.ts
│   ├── types/                 # Definiciones TypeScript
│   │   └── index.ts
│   ├── utils/                 # Funciones auxiliares
│   │   ├── pointsCalculator.ts
│   │   └── validators.ts
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

- Podio visual de los primeros puestos
- Tabla completa ordenada por puntos
- Estadísticas de cada jugador
- **Los admins NO aparecen** (solo gestionan)

## 🔧 Panel de Administración

> 🔐 **Acceso exclusivo para rol `admin`**

### 📊 Panel de Control y Estadísticas

- **Resumen del sistema**: Total de partidos, jugadores, predicciones y tasa de acierto global.
- **Mejores jugadores**: Clasificación actualizada al instante.
- **Próximos encuentros**: Vista rápida de los 5 partidos más cercanos.

### ⚽ Gestión de Datos y Mantenimiento

- **Partidos y Usuarios**: Control total sobre los encuentros y los jugadores.
- **Integridad**: Evita hacer dos veces la misma apuesta y errores en los puntos.
- **Herramientas**: Botones para **limpiar la lista de puntos**, **borrar solo los partidos** o **reiniciar todo** el sistema.

### 🔄 Sincronización con API Real

- **Automático**: Conexión con los partidos reales buscando el equipo y la jornada.
- **Limitación**: Debido a que usamos una cuenta gratuita, la conexión solo funciona para las temporadas **2022 a 2024**.

## ✨ Diseño UI/UX

- **Tema claro y oscuro**: Cambia el aspecto de la aplicación y lo recuerda para la próxima vez.
- **Estilo visual**: Escudos de equipos circulares y detalles de la temporada en las tarjetas.
- **Adaptable**: Se ve bien en móviles, tablets y ordenadores (el nombre del usuario siempre está a la vista).
- **Rapidez**: División por páginas en las listas largas para que la aplicación vaya fluida.

## 🔌 API Endpoints (Simulados con JSON Server)

### Partidos (`/matches`)

- `GET /matches`: Lista todos los encuentros.
- `POST /matches`: Crea un nuevo partido (Admin).
- `PATCH /matches/:id`: Actualiza resultado y estado.
- `DELETE /matches/:id`: Elimina un partido.

### Predicciones (`/predictions`)

- `GET /predictions?userId=:id`: Filtra apuestas por usuario.
- `POST /predictions`: Registra una nueva apuesta.
- `PATCH /predictions/:id`: Asigna puntos tras el resultado.

### Usuarios (`/users`)

- `POST /users`: Registro de nuevos jugadores.
- `PATCH /users/:id`: Actualiza estadísticas de puntos y aciertos.

## 🌟 Características Técnicas

- ✅ **Seguridad**: Protección de rutas por roles y persistencia de sesión.
- ✅ **Adaptabilidad**: Diseño responsivo optimizado para todo tipo de dispositivos.
- ✅ **Diseño**: Temas claro/oscuro, micro-animaciones y feedback para el usuario.
- ✅ **Rendimiento**: Paginación de datos para garantizar una navegación fluida.

## ⚠️ Limitación de Datos Reales

Debido al plan gratuito de la **API-Football**, la sincronización de datos reales de La Liga está disponible únicamente para las temporadas comprendidas entre **2022 y 2024**.

## 👤 Autor

**Biwash Shrestha**  
📧 Email: biwash@gmail.com  
🔗 GitHub: [@b1wash](https://github.com/b1wash)

---

## 🎓 Proyecto Académico

Desarrollado para la asignatura **Desarrollo Web en Entorno Cliente (DWEC)**. Cumple con todos los requisitos técnicos y funcionales, incluyendo múltiples ampliaciones de lógica compleja y diseño premium.

### Mejoras de Desarrollo

- [x] **Integración de API Real**: Sincronización con temporadas 22/23 y 23/24.
- [x] **Integridad de Puntos**: Sistema para evitar duplicados y función de recálculo masivo.
- [x] **Validación de Predicciones**: Restricción de una única apuesta por partido y usuario.
- [x] **Paginación Global**: Implementada en Inicio, Clasificación y Mis Predicciones.
- [x] **Herramientas de Administración**: Reset de sistema, borrado selectivo y matching de partidos.
- [x] **Evolución Visual**: Logos de equipos, contexto de temporada y optimización para monitores grandes.
- [x] **Persistencia de Preferencias**: El tema (oscuro/claro) se mantiene tras recargar la página.

---

⚽ **¡Hecho con pasión por el fútbol y el código!** ⚽
