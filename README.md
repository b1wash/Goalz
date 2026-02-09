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

- **Aplicación (Vercel)**: [https://goalz-dllb.vercel.app/](https://goalz-dllb.vercel.app/)
- **Aplicación (Netlify)**: [https://goalz-predictor.netlify.app/](https://goalz-predictor.netlify.app/)
- **Aplicación (Local)**: http://localhost:5173
- **API REST**: http://localhost:3001

## 📂 Estructura del Proyecto

```
goalz-app/
├── public/                 # Iconos y archivos públicos estáticos
├── src/
│   ├── assets/             # Imágenes y recursos locales
│   ├── components/
│   │   ├── auth/           # Protección de rutas (AdminRoute, ProtectedRoute)
│   │   ├── layout/         # Estructura general (Navbar, Footer)
│   │   ├── matches/        # Tarjetas y listas de partidos
│   │   ├── predictions/    # Visualización de apuestas realizadas
│   │   └── ui/             # Componentes base (Botones, Modales, Badges)
│   ├── pages/              # Vistas principales de la aplicación
│   ├── services/           # Lógica de comunicación con la API y servicios
│   ├── context/            # Estado global de la aplicación (Auth, Usuario)
│   ├── hooks/              # Hooks personalizados (Puntos, Modo Oscuro)
│   ├── types/              # Definiciones de interfaces TypeScript
│   ├── utils/              # Calculadora de puntos, validadores y mocks
│   ├── App.tsx             # Enrutador principal y estructura base
│   └── main.tsx            # Punto de entrada del proyecto
├── .env.example            # Plantilla para variables de entorno (API Keys)
├── db.json                 # Base de datos local (JSON Server)
├── index.html              # Archivo HTML principal
├── tailwind.config.js      # Configuración de estilos Tailwind
└── tsconfig.json           # Configuración de TypeScript
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

### 🚀 Mejoras y Ampliaciones (Ampliaciones Voluntarias)

He implementado una serie de mejoras técnicas para elevar la calidad del proyecto más allá de los requisitos mínimos:

#### ⚙️ Lógica y Gestión de Datos

- [x] **Integración de API Real**: Sincronización con resultados y escudos de las temporadas 22/23 y 23/24.
- [x] **Integridad de Puntos**: Sistema para evitar duplicados y función de recálculo masivo automatizado.
- [x] **Validación Estricta**: Restricción de una única apuesta por partido y usuario para garantizar la limpieza de datos.
- [x] **Paginación Global**: Implementada en las secciones de Inicio, Clasificación e Historial para mayor fluidez.

#### 🔧 Herramientas de Administración

- [x] **Control Avanzado**: Prevención de partidos duplicados y sistema de matching inteligente.
- [x] **Mantenimiento Pro**: Herramientas de reset total del sistema y borrado selectivo con advertencias de seguridad.
- [x] **Feedback Contextual**: Mensajes de error y éxito diferenciados según el tipo de acción.

#### 🎨 Experiencia de Usuario (UI/UX)

- [x] **Optimización Multimedia**: Compresión y redimensionamiento automático de logos de equipos.
- [x] **Evolución Visual**: Diseño optimizado para monitores Ultrawide, logos circulares y contexto de temporada.
- [x] **Persistencia**: El tema (oscuro/claro) se mantiene guardado tras recargar la página.
- [x] **Manejo de Errores**: Página "Fuera de Juego" (404) personalizada con temática deportiva.

---

⚽ **¡Hecho con pasión por el fútbol y el código!** ⚽
