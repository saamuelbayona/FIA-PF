# FIA Dashboard - Frontend React

Frontend desarrollado con React + Vite + Tailwind CSS

## 🚀 Inicio Rápido

```bash
npm install
npm run dev
```

El frontend estará disponible en: http://localhost:5173

## 📦 Tecnologías

- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Recharts (gráficos)

## 📁 Estructura

```
src/
├── components/       # Componentes reutilizables
├── pages/           # Páginas (Login, Dashboard)
├── services/        # Servicios API
├── config/          # Configuración
└── App.jsx          # Componente principal
```

## 🔧 Configuración

El frontend se conecta al backend en `http://localhost:3001/api`

Para cambiar la URL, edita `src/config/api.js`

## 🏗️ Build para Producción

```bash
npm run build
```

Los archivos se generarán en la carpeta `dist/`
