# ⚽ GOALZ - Quiniela de Fútbol

Aplicación web para realizar predicciones de resultados de partidos de fútbol y competir con amigos mediante un sistema de puntos.

![Goalz Banner](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.18-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

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
├── public/
├── src/
│   ├── componentes/
│   │   ├── layout/          # Navbar, Footer
│   │   ├── ui/              # Button, Card, Input, Select, Badge
│   │   ├── matches/         # MatchCard, MatchList
│   │   └── predictions/     # PredictionCard, PredictionList
│   ├── paginas/
│   │   ├── Inicio.tsx
│   │   ├── Clasificacion.tsx
│   │   ├── MisPredicciones.tsx
│   │   ├── HacerPrediccion.tsx
│   │   └── AdminMatches.tsx
│   ├── servicios/
│   │   ├── api.ts
│   │   ├── matchService.ts
│   │   ├── predictionService.ts
│   │   └── userService.ts
│   ├── tipos/
│   │   └── index.ts
│   ├── hooks/
│   │   └── usePredicciones.ts
│   ├── contexto/
│   │   └── AppContext.tsx
│   ├── utils/
│   │   └── mockData.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── db.json
├── .env
├── .gitignore
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## ✨ Funcionalidades

### 🏠 Página de Inicio

- Resumen de estadísticas del usuario
- Próximos partidos de la jornada
- Últimos resultados

### 🏆 Clasificación

- Tabla de usuarios ordenada por puntos
- Podio con los 3 primeros lugares
- Muestra: posición, nombre, puntos totales, aciertos

### 📊 Mis Predicciones

- Historial completo de predicciones del usuario
- Filtros: Todas / Acertadas / Falladas / Pendientes
- Muestra: partido, predicción, resultado real, puntos ganados

### ⚡ Hacer Predicción

- Formulario completo para hacer predicciones
- Lista de partidos disponibles
- Validaciones en tiempo real
- Sistema de puntos:
  - **5 puntos** por acertar el marcador exacto
  - **3 puntos** por acertar el resultado (1, X, 2)

### 🔧 Panel Admin

- Crear nuevos partidos
- Actualizar resultados de partidos finalizados
- Cálculo automático de puntos para todas las predicciones
- Actualización de estadísticas de usuarios

## 🎨 Diseño

- **Responsive**: Diseño adaptable a móvil, tablet y desktop
- **Dark Mode**: Tema oscuro deportivo
- **Animaciones**: Transiciones suaves y efectos hover
- **Glassmorphism**: Efectos de cristal esmerilado
- **Gradientes**: Colores vibrantes y modernos

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

## 👤 Autor

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
