# ⚽ GOALZ - Quiniela de Fútbol

Aplicación web para realizar predicciones de resultados de partidos de fútbol y competir con amigos mediante un sistema de puntos.

![Goalz Banner](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.18-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## � Tabla de Contenidos

- [Requisitos del Sistema](#-requisitos-del-sistema)
- [Tecnologías](#️-tecnologías)
- [Instalación](#-instalación)
- [Uso de la Aplicación](#-uso-de-la-aplicación)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Funcionalidades](#-funcionalidades)
- [API Endpoints](#-api-endpoints)
- [Características Técnicas](#-características-técnicas)
- [Troubleshooting](#-troubleshooting)
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

## �🛠️ Tecnologías

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
├── public/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx              # Barra de navegación responsive
│   │   │   ├── Footer.tsx              # Pie de página
│   │   │   ├── ContenedorPagina.tsx    # Wrapper para páginas (nuevos)
│   │   │   └── index.ts                # Exports centralizados
│   │   ├── ui/
│   │   │   ├── Button.tsx              # Botón reutilizable
│   │   │   ├── Card.tsx                # Tarjeta con estilos
│   │   │   ├── Input.tsx               # Input de formulario
│   │   │   ├── Select.tsx              # Select desplegable
│   │   │   ├── Badge.tsx               # Etiqueta de estado
│   │   │   ├── Cargando.tsx            # Spinner de carga (nuevo)
│   │   │   ├── EstadoVacio.tsx         # Componente de estado vacío (nuevo)
│   │   │   └── index.ts                # Exports centralizados
│   │   ├── matches/
│   │   │   ├── MatchCard.tsx           # Tarjeta de partido
│   │   │   ├── MatchList.tsx           # Lista de partidos
│   │   │   └── index.ts                # Exports centralizados
│   │   └── predictions/
│   │       ├── PredictionCard.tsx      # Tarjeta de predicción
│   │       ├── PredictionList.tsx      # Lista de predicciones
│   │       └── index.ts                # Exports centralizados
│   ├── pages/
│   │   ├── Inicio.tsx                  # Dashboard principal
│   │   ├── Clasificacion.tsx           # Ranking de usuarios
│   │   ├── MisPredicciones.tsx         # Historial de predicciones
│   │   ├── HacerPrediccion.tsx         # Formulario de predicción
│   │   └── AdminMatches.tsx            # Panel de administración
│   ├── services/
│   │   ├── api.ts                      # Cliente HTTP base
│   │   ├── matchService.ts             # API de partidos
│   │   ├── predictionService.ts        # API de predicciones
│   │   └── userService.ts              # API de usuarios
│   ├── types/
│   │   └── index.ts                    # Interfaces TypeScript
│   ├── hooks/
│   │   ├── usePredicciones.ts          # Hook para predicciones
│   │   └── useDarkMode.ts              # Hook para modo oscuro
│   ├── context/
│   │   └── AppContext.tsx              # Context API global
│   ├── utils/
│   │   ├── pointsCalculator.ts         # Cálculo de puntos
│   │   ├── validators.ts               # Validaciones de formularios
│   │   └── mockData.ts                 # Datos de prueba
│   ├── assets/                         # Imágenes y recursos
│   ├── App.tsx                         # Componente raíz
│   ├── main.tsx                        # Entry point
│   └── index.css                       # Estilos globales + Tailwind
├── db.json                             # Base de datos JSON Server
├── .env                                # Variables de entorno
├── .gitignore                          # Archivos ignorados por Git
├── package.json                        # Dependencias del proyecto
├── tailwind.config.js                  # Configuración de Tailwind
├── tsconfig.json                       # Configuración de TypeScript
├── vite.config.ts                      # Configuración de Vite
└── README.md                           # Documentación del proyecto
```

## 📖 Uso de la Aplicación

### Primera vez usando GOALZ

1. **Inicio de sesión simulado**: La aplicación usa un usuario de prueba (`user1`) automáticamente
2. **Navega por las secciones** usando la barra superior
3. **Explora tus estadísticas** en la página de Inicio

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

### Panel de Administración

> 🔐 Solo para administradores

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
- ✅ **Context API** para estado global
- ✅ **Custom Hooks** para lógica reutilizable
- ✅ **Componentes reutilizables** (15+)
- ✅ **Validación de formularios**
- ✅ **Manejo de errores**
- ✅ **LocalStorage** para persistencia
- ✅ **API REST** con JSON Server
- ✅ **Responsive Design**
- ✅ **Variables de entorno**

## �👤 Autor

**Biwash Shrestha**  
📧 Email: biwash@goalz.com  
🔗 GitHub: [@b1wash](https://github.com/b1wash)

## 📄 Licencia

MIT License - Siéntete libre de usar este proyecto para aprender y practicar.

## 🙏 Agradecimientos

- Proyecto desarrollado como práctica de **Desarrollo Web en Entorno Cliente (DWEC)**
- Tecnologías modernas del ecosistema JavaScript
- Diseño inspirado en aplicaciones deportivas modernas

---

⚽ **¡Hecho con pasión por el fútbol y el código!** ⚽
