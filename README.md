Sistema de Administración
📋 Requisitos Previos

Node.js (versión 16 o superior)
npm (incluido con Node.js)
pnpm (se instalará en el proceso)

🚀 Instalación y Configuración
Frontend (Admin)

Navegar al directorio del frontend

bash   cd admin

Instalar pnpm globalmente

bash   npm install -g pnpm

Instalar dependencias

bash   pnpm install

Generar Prisma Client

bash   pnpm prisma generate

Ejecutar el sistema

bash   pnpm run dev
Backend

Navegar al directorio del backend

bash   cd backend

Instalar dependencias

bash   npm install

Generar Prisma Client

bash   npm run prisma generate

Ejecutar el servidor

bash   npm run dev
🛠️ Comandos Útiles
Frontend (Admin)
ComandoDescripciónpnpm installInstala todas las dependenciaspnpm run devInicia el servidor de desarrollopnpm prisma generateGenera el cliente de Prismapnpm run buildCompila el proyecto para producción
Backend
ComandoDescripciónnpm installInstala todas las dependenciasnpm run devInicia el servidor de desarrollonpm run prisma generateGenera el cliente de Prismanpm run buildCompila el proyecto para producción
📝 Notas

Asegúrate de tener configuradas las variables de entorno necesarias en ambos proyectos
El frontend y backend deben ejecutarse simultáneamente en terminales separadas
Verifica que los puertos requeridos estén disponibles antes de ejecutar

⚠️ Solución de Problemas
Si encuentras errores durante la instalación:

Limpia el caché de npm/pnpm:

bash   npm cache clean --force
   pnpm store prune

Elimina las carpetas node_modules y archivos de bloqueo:

bash   rm -rf node_modules pnpm-lock.yaml

Reinstala las dependencias desde cero

