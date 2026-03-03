# 🚂 Guía Visual: Configuración en Railway

## 📊 Diagrama de Flujo

```
┌─────────────────────────────────────────────────────────────┐
│                    TU COMPUTADORA (LOCAL)                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  backend/.env  ← Archivo con credenciales (NO se sube a Git) │
│  ├─ MYSQLHOST=localhost                                      │
│  ├─ MYSQLUSER=root                                           │
│  ├─ MYSQLPASSWORD=tu-password-local                          │
│  └─ JWT_SECRET=secret-local                                  │
│                                                               │
│  .gitignore  ← Protege el .env                               │
│  └─ .env  ✅ (ignorado)                                      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ git push
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                         GITHUB                               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ✅ Código fuente                                            │
│  ✅ database.config.js (sin credenciales hardcodeadas)       │
│  ❌ .env (NO se sube, está en .gitignore)                   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Deploy automático
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                         RAILWAY                              │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────┐         ┌──────────────────┐           │
│  │   MySQL Service │◄────────┤   App Service    │           │
│  │                 │ Linked  │                  │           │
│  │  Variables:     │         │  Variables:      │           │
│  │  • MYSQLHOST    │────────►│  • MYSQLHOST     │           │
│  │  • MYSQLUSER    │────────►│  • MYSQLUSER     │           │
│  │  • MYSQLPASSWORD│────────►│  • MYSQLPASSWORD │           │
│  │  • MYSQLDATABASE│────────►│  • MYSQLDATABASE │           │
│  │  • MYSQLPORT    │────────►│  • MYSQLPORT     │           │
│  │  • MYSQL_URL    │────────►│  • MYSQL_URL     │           │
│  └─────────────────┘         │                  │           │
│                               │  Manuales:       │           │
│                               │  • JWT_SECRET    │           │
│                               │  • NODE_ENV      │           │
│                               │  • PORT (auto)   │           │
│                               └──────────────────┘           │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Paso a Paso en Railway

### 1️⃣ Crear Proyecto en Railway

```
Railway Dashboard → New Project → Deploy from GitHub repo
```

Selecciona tu repositorio `fia-pollo-fiesta`

### 2️⃣ Agregar Base de Datos MySQL

```
Tu Proyecto → + New → Database → Add MySQL
```

Railway crea automáticamente:
- Un servicio MySQL
- Genera credenciales seguras
- Crea las variables de entorno

### 3️⃣ Vincular MySQL a tu App

**ESTE ES EL PASO MÁS IMPORTANTE:**

```
1. Click en tu "App Service" (el que tiene tu código)
2. Ve a la pestaña "Variables"
3. Click en "+ New Variable"
4. Selecciona "Add Reference"
5. Elige el servicio "MySQL" que creaste
6. Railway vinculará automáticamente todas las variables
```

**Resultado:** Tu app ahora tiene acceso a:
- `MYSQL_URL` (Railway usa esta primero)
- `MYSQLHOST`
- `MYSQLUSER`
- `MYSQLPASSWORD`
- `MYSQLDATABASE`
- `MYSQLPORT`

### 4️⃣ Agregar Variables Manuales

En la misma sección de Variables, agrega:

```
JWT_SECRET = [genera uno aleatorio con: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"]
NODE_ENV = production
CORS_ORIGIN = * (o tu dominio específico)
```

### 5️⃣ Importar Datos a la Base de Datos

**Opción A: Desde Railway Dashboard**
```
MySQL Service → Data → Connect → Abre en MySQL Workbench
```

**Opción B: Desde tu terminal local**
```bash
# Obtén las credenciales del MySQL Service en Railway
mysql -h [MYSQLHOST] -P [MYSQLPORT] -u [MYSQLUSER] -p[MYSQLPASSWORD] [MYSQLDATABASE] < backend/database_export.sql
```

### 6️⃣ Verificar Deployment

```
App Service → Deployments → Ver logs

Deberías ver:
✅ Servidor iniciado correctamente
📡 Puerto: 3001
🗄️  Base de datos: railway
```

## 🔍 Troubleshooting

### Error: "Cannot connect to database"

**Causa:** Las variables no están vinculadas

**Solución:**
1. Ve a App Service → Variables
2. Verifica que veas las variables `MYSQLHOST`, `MYSQLUSER`, etc.
3. Si no las ves, repite el paso 3️⃣ (Add Reference)

### Error: "JWT_SECRET is not defined"

**Causa:** No agregaste JWT_SECRET manualmente

**Solución:**
1. App Service → Variables → + New Variable
2. Name: `JWT_SECRET`
3. Value: (genera uno aleatorio)

### Error: "Port already in use"

**Causa:** Railway asigna el puerto automáticamente

**Solución:**
- No necesitas configurar `PORT` manualmente
- Railway lo asigna automáticamente
- Tu código ya lo maneja: `process.env.PORT || 3001`

## 📝 Checklist de Deployment

- [ ] Proyecto creado en Railway desde GitHub
- [ ] MySQL Service agregado
- [ ] MySQL vinculado a App Service (Add Reference)
- [ ] JWT_SECRET agregado manualmente
- [ ] Datos importados a la base de datos
- [ ] Deployment exitoso (sin errores en logs)
- [ ] Dominio generado (Settings → Networking → Generate Domain)
- [ ] App funciona correctamente en el dominio

## 🎓 Conceptos Clave

### ¿Por qué NO subir .env a Git?

```
❌ MAL:
Git → GitHub → Railway
└─ .env con credenciales ← PÚBLICO, INSEGURO

✅ BIEN:
Git → GitHub (sin .env) → Railway
                           └─ Variables configuradas en Railway ← PRIVADO, SEGURO
```

### ¿Cómo sabe el código dónde conectarse?

El archivo `database.config.js` detecta automáticamente el entorno:

```javascript
// 1. ¿Está en Railway? (tiene MYSQL_URL)
if (process.env.MYSQL_URL) {
  // Usa la URL completa de Railway
  return { uri: process.env.MYSQL_URL };
}

// 2. ¿Está en local? (tiene variables del .env)
else {
  // Usa las variables individuales
  return {
    host: process.env.MYSQLHOST || 'localhost',
    user: process.env.MYSQLUSER || 'root',
    // ...
  };
}
```

### ¿Qué pasa si cambio las credenciales?

**En Railway:**
- Las credenciales se regeneran automáticamente
- No necesitas cambiar nada en el código
- Railway actualiza las variables automáticamente

**En Local:**
- Edita tu archivo `backend/.env`
- Reinicia el servidor: `npm start`

## 🚀 Próximos Pasos

1. ✅ Deployment exitoso
2. 🔒 Implementar bcrypt para contraseñas
3. 📊 Configurar monitoreo y logs
4. 🔄 Configurar CI/CD automático
5. 🌐 Configurar dominio personalizado
