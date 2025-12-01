# Sistema de Administración

## 📋 Requisitos Previos

- Node.js (versión 16 o superior)
- npm (incluido con Node.js)
- pnpm (se instalará en el proceso)

## 🚀 Instalación y Configuración

### Frontend (Admin)

1. **Navegar al directorio del frontend**
   ```bash
   cd admin
   ```

2. **Instalar pnpm globalmente**
   ```bash
   npm install -g pnpm
   ```

3. **Instalar dependencias**
   ```bash
   pnpm install
   ```

4. **Ejecutar el sistema**
   ```bash
   pnpm run dev
   ```

### Backend

1. **Navegar al directorio del backend**
   ```bash
   cd backend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Generar Prisma Client**
   ```bash
   npx prisma generate
   ```

4. **Ejecutar el servidor**
   ```bash
   npm run dev
   ```

## 🛠️ Comandos Útiles

### Frontend (Admin)
| Comando | Descripción |
|---------|-------------|
| `pnpm install` | Instala todas las dependencias |
| `pnpm run dev` | Inicia el servidor de desarrollo |
| `pnpm run build` | Compila el proyecto para producción |

### Backend
| Comando | Descripción |
|---------|-------------|
| `npm install` | Instala todas las dependencias |
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run prisma generate` | Genera el cliente de Prisma |
| `npm run build` | Compila el proyecto para producción |

## 📝 Notas

- Asegúrate de tener configuradas las variables de entorno necesarias en ambos proyectos
- El frontend y backend deben ejecutarse simultáneamente en terminales separadas
- Verifica que los puertos requeridos estén disponibles antes de ejecutar

## ⚠️ Solución de Problemas

Si encuentras errores durante la instalación:

1. Limpia el caché de npm/pnpm:
   ```bash
   npm cache clean --force
   pnpm store prune
   ```

2. Elimina las carpetas `node_modules` y archivos de bloqueo:
   ```bash
   rm -rf node_modules pnpm-lock.yaml
   ```

3. Reinstala las dependencias desde cero
