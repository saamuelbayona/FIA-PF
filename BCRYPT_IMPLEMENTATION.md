# 🔐 Guía: Implementar bcrypt para Contraseñas

## ⚠️ Estado Actual

Las contraseñas están en **texto plano** en la base de datos. Esto es inseguro.

## ✅ Implementación de bcrypt

### Paso 1: Instalar bcryptjs

```bash
cd backend
npm install bcryptjs
```

### Paso 2: Actualizar LoginUseCase.js

**Archivo:** `backend/src/application/use-cases/auth/LoginUseCase.js`

```javascript
/**
 * Caso de Uso: Login
 * Application Layer
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const serverConfig = require('../../../config/server.config');

class LoginUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Ejecutar login
   */
  async execute(username, password) {
    // Buscar usuario
    const user = await this.userRepository.findByUsername(username);
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Verificar si está activo
    if (!user.isUserActive()) {
      throw new Error('Usuario inactivo');
    }

    // ✅ NUEVO: Verificar contraseña con bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new Error('Contraseña incorrecta');
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role
      },
      serverConfig.jwtSecret,
      { expiresIn: serverConfig.jwtExpiration }
    );

    return {
      success: true,
      token,
      user: user.toJSON()
    };
  }
}

module.exports = LoginUseCase;
```

### Paso 3: Actualizar UserRepository.js

**Archivo:** `backend/src/infrastructure/repositories/UserRepository.js`

```javascript
const bcrypt = require('bcryptjs');

class UserRepository extends IUserRepository {
  // ... código existente ...

  /**
   * Crear nuevo usuario
   */
  async create(userData) {
    // ✅ NUEVO: Hash de la contraseña antes de guardar
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const sql = 'INSERT INTO users (username, password, full_name, role) VALUES (?, ?, ?, ?)';
    const result = await this.db.query(sql, [
      userData.username,
      hashedPassword,  // ← Usar password hasheado
      userData.fullName,
      userData.role
    ]);
    return result.insertId;
  }

  /**
   * Actualizar contraseña
   */
  async updatePassword(id, newPassword) {
    // ✅ NUEVO: Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const sql = 'UPDATE users SET password = ? WHERE id = ?';
    await this.db.query(sql, [hashedPassword, id]);
    return true;
  }
}
```

### Paso 4: Script para Migrar Contraseñas Existentes

**Crear archivo:** `backend/src/scripts/hashPasswords.js`

```javascript
/**
 * Script para hashear contraseñas existentes
 * Ejecutar UNA SOLA VEZ después de implementar bcrypt
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { getInstance } = require('../infrastructure/database/connection');

async function hashExistingPasswords() {
  console.log('🔐 Hasheando contraseñas existentes...\n');
  
  const db = getInstance();
  await db.connect();

  try {
    // Obtener todos los usuarios
    const users = await db.query('SELECT id, username, password FROM users');
    
    console.log(`📊 Usuarios encontrados: ${users.length}\n`);

    for (const user of users) {
      // Verificar si ya está hasheada (bcrypt hashes empiezan con $2a$ o $2b$)
      if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
        console.log(`✅ ${user.username} - Ya tiene hash`);
        continue;
      }

      // Hashear la contraseña en texto plano
      const hashedPassword = await bcrypt.hash(user.password, 10);
      
      // Actualizar en la base de datos
      await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, user.id]);
      
      console.log(`🔒 ${user.username} - Contraseña hasheada`);
    }

    console.log('\n✅ Proceso completado!\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await db.close();
  }
}

hashExistingPasswords();
```

### Paso 5: Actualizar package.json

**Archivo:** `backend/package.json`

```json
{
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "export-db": "node src/scripts/exportDatabase.js",
    "test-connection": "node test-connection.js",
    "hash-passwords": "node src/scripts/hashPasswords.js"
  }
}
```

### Paso 6: Actualizar schema SQL

**Archivo:** `backend/src/infrastructure/database/schema_cpanel.sql`

Cambiar el comentario:

```sql
`password` varchar(255) NOT NULL COMMENT 'Contraseña hasheada con bcrypt',
```

## 🚀 Proceso de Migración

### 1. Instalar bcryptjs
```bash
cd backend
npm install bcryptjs
```

### 2. Actualizar el código
- Actualizar `LoginUseCase.js`
- Actualizar `UserRepository.js`
- Crear `hashPasswords.js`

### 3. Hashear contraseñas existentes
```bash
npm run hash-passwords
```

**Salida esperada:**
```
🔐 Hasheando contraseñas existentes...

📊 Usuarios encontrados: 3

🔒 admin - Contraseña hasheada
🔒 analista - Contraseña hasheada
🔒 viewer - Contraseña hasheada

✅ Proceso completado!
```

### 4. Probar el login
```bash
npm run dev
```

Intenta hacer login con:
- Usuario: `admin`
- Contraseña: `admin123`

Debería funcionar normalmente.

## 🔍 Verificación

### Antes (texto plano):
```sql
SELECT username, password FROM users;

-- Resultado:
-- admin     | admin123
-- analista  | analista123
-- viewer    | viewer123
```

### Después (hasheado):
```sql
SELECT username, password FROM users;

-- Resultado:
-- admin     | $2b$10$xK7L8J9.../hash-largo-aleatorio
-- analista  | $2b$10$yM8N9K0.../hash-largo-aleatorio
-- viewer    | $2b$10$zP9O0L1.../hash-largo-aleatorio
```

## 📊 Comparación

| Aspecto | Texto Plano | bcrypt |
|---------|-------------|--------|
| Seguridad | ❌ Muy baja | ✅ Alta |
| Si hackean la BD | ❌ Ven todas las contraseñas | ✅ Solo ven hashes inútiles |
| Reversible | ❌ Sí | ✅ No (one-way hash) |
| Tiempo de hash | - | ~100ms (intencional) |
| Protección contra brute force | ❌ No | ✅ Sí (slow hashing) |

## ⚠️ Importante

1. **Ejecuta `hash-passwords` solo UNA VEZ** después de implementar bcrypt
2. **No ejecutes el script dos veces** o hasheará los hashes (doble hash)
3. **Haz backup de la BD** antes de ejecutar el script
4. **Prueba en local** antes de aplicar en producción

## 🎯 Checklist

- [ ] Instalar bcryptjs
- [ ] Actualizar LoginUseCase.js
- [ ] Actualizar UserRepository.js
- [ ] Crear script hashPasswords.js
- [ ] Actualizar package.json
- [ ] Hacer backup de la base de datos
- [ ] Ejecutar `npm run hash-passwords`
- [ ] Probar login con usuarios existentes
- [ ] Verificar que los hashes están en la BD
- [ ] Actualizar documentación

## 📝 Notas

- bcrypt genera un hash diferente cada vez (incluye salt aleatorio)
- Esto es normal y esperado
- La misma contraseña tendrá hashes diferentes
- bcrypt.compare() maneja esto automáticamente

## 🔗 Referencias

- [bcryptjs en npm](https://www.npmjs.com/package/bcryptjs)
- [OWASP Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
