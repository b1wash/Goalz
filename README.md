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
- **Context API** - Gestión de estado global
- **LocalStorage** - Persistencia de datos del cliente

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

**URLs de acceso:**

- Aplicación: http://localhost:5173
- API REST: http://localhost:3001

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
- ✅ Acceso al panel de 4 secciones
- ✅ Gestión completa de partidos
- ✅ Gestión completa de usuarios
- ✅ Vista de métricas globales

## ⚙️ Arquitectura del Backend

Para este proyecto, he implementado un **Backend basado en JSON-Server**. Este sistema permite simular una API REST profesional con las siguientes características:

- **Persistencia Local**: Los datos se almacenan de forma permanente en el archivo `db.json`, el cual actúa como la base de datos del sistema.
- **Protocolo RESTful**: El servidor recibe peticiones estándar (GET, POST, PATCH, DELETE) en el puerto **3001**.
- **Interacción Real**: Permite que el Frontend de React interactúe con los datos (crear usuarios, guardar predicciones, actualizar resultados) exactamente igual que si se tratara de una API de producción.

## ✨ Funcionalidades

### 🏠 Inicio (Personalizado por Rol)

**Para Jugadores:**

- Tus puntos totales
- Próximos partidos con botón de predicción
- Acceso rápido a "Mis Predicciones"

**Para Admins:**

- Total de jugadores activos
- Próximos partidos (sin botón de predicción)
- Acceso rápido al "Panel de Gestión"

### 🏆 Clasificación Compacta

- Podio visual premium (Top 3)
- Tabla optimizada con menos espacio
- Solo muestra jugadores (admins filtrados)
- Posición, nombre, puntos, aciertos

### 📊 Mis Predicciones (con Paginación)

- **9 predicciones por página**
- Navegación con botones numéricos
- Filtros que resetean la paginación
- Diseño optimizado y compacto

### ⚡ Hacer Predicción (Formulario Compacto)

- Formulario reducido en tamaño
- Validación de coherencia
- Feedback visual de errores
- **Bloqueado para admins**

## 🔌 API Endpoints

### Partidos

```
GET    /matches              # Todos los partidos
GET    /matches/:id          # Partido específico
POST   /matches              # Crear partido (admin)
PATCH  /matches/:id          # Actualizar resultado (admin)
DELETE /matches/:id          # Eliminar partido (admin)
```

### Predicciones

```
GET    /predictions                    # Todas las predicciones
GET    /predictions?userId=:id         # Por usuario
GET    /predictions?matchId=:id        # Por partido
POST   /predictions                    # Crear predicción
PATCH  /predictions/:id                # Actualizar puntos
DELETE /predictions/:id                # Eliminar predicción
```

### Usuarios

```
GET    /users                          # Todos los usuarios
GET    /users/:id                      # Usuario específico
POST   /users                          # Crear usuario (registro)
PATCH  /users/:id                      # Actualizar stats
DELETE /users/:id                      # Eliminar usuario (admin)
```

## 📦 Scripts Disponibles

```bash
npm run dev         # Desarrollo (puerto 5173)
npm run api         # JSON Server (puerto 3001)
npm run build       # Build de producción
npm run preview     # Preview de producción
```

## 🌟 Características Técnicas

### Arquitectura

- ✅ **SPA** con React Router
- ✅ **TypeScript** con tipado estricto (100%)
- ✅ **Context API** para estado global
- ✅ **Custom Hooks** para lógica reutilizable
- ✅ **Componentes atómicos** (15+ reutilizables)
- ✅ **Servicios modulares** para API

### Autenticación y Seguridad

- ✅ **Sistema completo**: Login, Register, Logout
- ✅ **Roles de usuario**: Admin y Jugador
- ✅ **ProtectedRoute**: Rutas para usuarios autenticados
- ✅ **AdminRoute**: Rutas exclusivas para administradores
- ✅ **Persistencia**: LocalStorage para sesiones
- ✅ **Separación de roles**: Admin solo gestiona

### UX/UI

- ✅ **Diseño responsive**: Mobile, Tablet, Desktop, Ultrawide
- ✅ **Modo Dual**: Light/Dark con persistencia
- ✅ **Micro-animaciones**: Transiciones suaves
- ✅ **Glassmorphism**: Efectos visuales premium
- ✅ **Feedback visual**: Loading, éxito, errores
- ✅ **Paginación**: En listas largas
- ✅ **Diseños compactos**: Mejor uso del espacio

### Validaciones

- ✅ **Formularios validados**: Inputs con feedback
- ✅ **Coherencia 1X2**: Marcador vs Resultado
- ✅ **Rangos de goles**: 0-20 válidos
- ✅ **Emails únicos**: En registro
- ✅ **Contraseñas seguras**: Mínimo 6 caracteres

### Optimizaciones

- ✅ **Recarga automática**: Puntos actualizados en navbar
- ✅ **Filtros dinámicos**: Sin recargar página
- ✅ **Cálculo automático**: Distribución de puntos
- ✅ **Bundle optimizado**: Vite + Tree-shaking

## 👤 Autor

**Biwash Shrestha**  
📧 Email: biwash@gmail.com  
🔗 GitHub: [@b1wash](https://github.com/b1wash)

---

## 🎓 Proyecto Académico

Desarrollado para la asignatura **Desarrollo Web en Entorno Cliente (DWEC)**  
Cumple con todos los requisitos técnicos y funcionales del curso.

### Ampliaciones Implementadas

- [x] Context API para estado global
- [x] Autenticación y Autorización completas
- [x] Roles de usuario con permisos diferenciados
- [x] Custom Hooks para lógica reutilizable
- [x] Modo Oscuro/Claro con persistencia
- [x] Filtros avanzados en tiempo real
- [x] Paginación de contenidos
- [x] UX Premium con micro-animaciones
- [x] Panel de Admin con 4 secciones
- [x] Gestión de usuarios por Admin
- [x] Diseños compactos y optimizados

---

⚽ **¡Hecho con pasión por el fútbol y el código!** ⚽
