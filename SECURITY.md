# 🔒 Guía de Seguridad

## Variables de Entorno

### ⚠️ NUNCA subas credenciales a Git

Este proyecto usa variables de entorno para proteger información sensible.

### Configuración Local

1. **Copia el archivo de ejemplo:**
   ```bash
   cd backend
   cp .env.example .env
   ```

2. **Edita `.env` con tus credenciales reales:**
   ```bash
   # NO compartas este archivo
   MYSQLHOST=tu-host-real.com
   MYSQLPASSWORD=tu-password-real
   JWT_SECRET=genera-un-secreto-aleatorio
   ```

3. **Verifica que `.env` esté en `.gitignore`:**
   ```bash
   git check-ignore backend/.env
   # Debe mostrar: backend/.env
   ```

### Configuración en Producción (Railway)

Las variables se configuran en el panel de Railway, NO en el código.

## Contraseñas

### ❌ Actual (Inseguro)
Las contraseñas están en texto plano en la base de datos.

### ✅ Recomendado (Próxima versión)
Implementar bcrypt para hash de contraseñas:

```javascript
const bcrypt = require('bcryptjs');

// Al crear usuario
const hashedPassword = await bcrypt.hash(password, 10);

// Al validar login
const isValid = await bcrypt.compare(password, user.password);
```

## JWT

- Usa un secreto fuerte y aleatorio
- Cambia `JWT_SECRET` en producción
- Considera tokens de corta duración (1-2 horas) con refresh tokens

## CORS

En producción, especifica los orígenes permitidos:

```javascript
CORS_ORIGIN=https://tu-dominio.com
```

## Checklist de Seguridad

- [ ] `.env` está en `.gitignore`
- [ ] No hay credenciales hardcodeadas en el código
- [ ] JWT_SECRET es único y aleatorio
- [ ] CORS configurado para producción
- [ ] Contraseñas hasheadas con bcrypt (pendiente)
- [ ] Validación de inputs en el backend (pendiente)
- [ ] Rate limiting en endpoints (pendiente)
- [ ] HTTPS en producción

## Reportar Vulnerabilidades

Si encuentras un problema de seguridad, por favor NO lo publiques en issues.
Contacta directamente al equipo de desarrollo.
