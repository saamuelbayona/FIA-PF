# Sistema de Rutas Global

Este directorio contiene la configuración centralizada de rutas de la aplicación.

## Estructura

```
routes/
├── index.jsx       # Configuración de rutas y componentes de protección
├── paths.js        # Constantes de rutas
└── README.md       # Documentación
```

## Archivos

### `index.jsx`
Contiene la configuración de todas las rutas de la aplicación y los componentes de protección:

- **ProtectedRoute**: Protege rutas que requieren autenticación
- **PublicRoute**: Redirige a /home si el usuario ya está autenticado
- **AppRoutes**: Componente principal con todas las rutas

### `paths.js`
Define las constantes de rutas para usar en toda la aplicación:

```javascript
import { ROUTES } from '../routes/paths';

// Usar en navegación
navigate(ROUTES.HOME);
navigate(ROUTES.DASHBOARD);
navigate(ROUTES.LOGIN);
```

## Flujo de Navegación

```
Login (/) 
  ↓ [autenticación exitosa]
Home (/home) - Búsqueda IA
  ↓ [selección de acción]
Dashboard (/dashboard) - Análisis detallado
  ↓ [botón volver]
Home (/home)
  ↓ [logout]
Login (/)
```

## Rutas Disponibles

| Ruta | Tipo | Componente | Descripción |
|------|------|------------|-------------|
| `/` | Pública | Login | Página de inicio de sesión |
| `/home` | Protegida | Home | Búsqueda inteligente con IA |
| `/dashboard` | Protegida | Dashboard | Dashboard financiero completo |
| `*` | Catch-all | Navigate | Redirige según autenticación |

## Protección de Rutas

### Rutas Públicas
- Solo accesibles si NO estás autenticado
- Si intentas acceder estando autenticado, redirige a `/home`
- Ejemplo: Login

### Rutas Protegidas
- Solo accesibles si ESTÁS autenticado
- Si intentas acceder sin autenticación, redirige a `/`
- Ejemplos: Home, Dashboard

## Uso en Componentes

### Navegación básica
```javascript
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../routes/paths';

const navigate = useNavigate();
navigate(ROUTES.HOME);
```

### Navegación con estado
```javascript
navigate(ROUTES.DASHBOARD, { 
  state: { 
    compareItems: [item1, item2] 
  } 
});
```

### Recibir estado en destino
```javascript
import { useLocation } from 'react-router-dom';

const location = useLocation();
const compareItems = location.state?.compareItems;
```

## Ventajas del Sistema Centralizado

1. **Mantenibilidad**: Cambiar una ruta solo requiere editar `paths.js`
2. **Consistencia**: Todas las rutas están definidas en un solo lugar
3. **Autocompletado**: Los IDEs pueden sugerir rutas disponibles
4. **Refactorización**: Fácil de renombrar o reorganizar rutas
5. **Documentación**: Las rutas están claramente documentadas

## Agregar Nuevas Rutas

### 1. Agregar constante en `paths.js`
```javascript
export const ROUTES = {
  // ... rutas existentes
  NEW_PAGE: '/new-page',
};
```

### 2. Agregar ruta en `index.jsx`
```javascript
<Route 
  path="/new-page" 
  element={
    <ProtectedRoute>
      <NewPage />
    </ProtectedRoute>
  } 
/>
```

### 3. Importar componente
```javascript
import NewPage from '../pages/NewPage';
```

## Mejores Prácticas

1. Siempre usar `ROUTES` en lugar de strings hardcodeados
2. Usar `replace: true` en Navigate para evitar loops
3. Limpiar el state después de usarlo para evitar comportamientos inesperados
4. Documentar nuevas rutas en este README
