# Dashboard Financiero - Nuevas Características

## 🔍 Búsqueda Inteligente con IA

### Características principales:
- **Búsqueda en tiempo real**: Escribe cualquier término y obtén resultados instantáneos
- **Sugerencias inteligentes**: El sistema sugiere cuentas relacionadas mientras escribes
- **Búsqueda por múltiples criterios**: 
  - Nombre de cuenta
  - Categoría (ACTIVOS, PASIVOS, PATRIMONIO)
  - Subcategoría

### Acciones rápidas predefinidas:
1. **Comparar Activos vs Pasivos**: Visualiza la relación entre totales
2. **Análisis de Liquidez**: Compara disponible con obligaciones financieras
3. **Evolución Patrimonio**: Analiza todos los componentes del patrimonio

### Cómo usar:
1. Haz clic en el campo de búsqueda en el dashboard
2. Escribe cualquier término (ej: "disponible", "obligaciones", "capital")
3. Selecciona una sugerencia o usa una acción rápida
4. Se abrirá automáticamente la vista de comparación

## 📊 Vista de Comparación en Tiempo Real

### Características:
- **Modal interactivo**: Visualización en pantalla completa con fondo difuminado
- **Gráfica de barras comparativa**: Visualiza 2024 vs 2025 en miles de millones
- **Tarjetas detalladas**: Cada elemento muestra:
  - Valor 2025 (destacado)
  - Valor 2024 (referencia)
  - Variación absoluta y porcentual
  - Indicador visual de tendencia (↑ positivo, ↓ negativo, - neutral)

### Indicadores visuales:
- 🟢 Verde: Variación positiva
- 🔴 Rojo: Variación negativa
- ⚪ Gris: Sin cambios

### Cómo usar:
1. Usa la búsqueda inteligente para seleccionar elementos
2. O haz clic en una acción rápida
3. Revisa la comparación visual y los detalles
4. Cierra con el botón X o haciendo clic fuera del modal

## 🎨 Diseño y Experiencia

### Paleta de colores:
- Fondo principal: #020617 (slate-950)
- Tarjetas: rgba(15, 23, 42, 0.9) con efecto glassmorphism
- Acentos: #38bdf8 (sky-400) y #1d4ed8 (blue-700)
- Bordes: rgba(148, 163, 184, 0.3)

### Animaciones:
- Entrada suave de sugerencias (fade + slide)
- Transiciones fluidas en modales
- Efectos hover en botones y tarjetas
- Indicadores de carga animados

## 🚀 Tecnologías utilizadas

- **React 18**: Framework principal
- **Framer Motion**: Animaciones fluidas
- **Recharts**: Gráficas interactivas
- **Lucide React**: Iconos modernos
- **Tailwind CSS**: Estilos utilitarios

## 📝 Próximas mejoras sugeridas

1. **Procesamiento de lenguaje natural**: 
   - "compara disponible con obligaciones"
   - "muéstrame la evolución del patrimonio"
   - "cuál es mi liquidez actual"

2. **Historial de búsquedas**: Guarda las últimas consultas

3. **Exportación de datos**: Descarga comparativas en PDF/Excel

4. **Alertas inteligentes**: Notificaciones sobre cambios significativos

5. **Predicciones**: Proyecciones basadas en tendencias históricas

## 🎯 Usuarios de prueba

- **admin** / admin123 (Administrador)
- **analista** / analista123 (Analista)
- **viewer** / viewer123 (Visualizador)

## 🌐 URLs

- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- API Base: http://localhost:3001/api
