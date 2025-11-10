# Consideraciones para Despliegue en Vercel

## Variables de Entorno Requeridas

Asegúrate de que la siguiente variable de entorno esté configurada en Vercel:

1. **POSTGRES_PRISMA_URL** - URL de conexión con connection pooling (requerida)

**Nota:** Solo necesitas `POSTGRES_PRISMA_URL`. No uses `directUrl` en el schema cuando trabajas con Vercel Postgres directamente, ya que Prisma interpretará que estás usando Prisma Data Proxy y esperará URLs con formato `prisma://`.

### Configuración en Vercel

1. Ve a tu proyecto en Vercel Dashboard
2. Settings → Environment Variables
3. Agrega ambas variables para los entornos: Production, Preview, y Development

## Configuración de Prisma

### Scripts de Build

El proyecto está configurado con:
- `postinstall: "prisma generate --no-engine"` - Genera el cliente de Prisma después de instalar dependencias

### Migraciones

Las migraciones se ejecutan manualmente o se pueden automatizar en el build. Para producción:

```bash
npx prisma migrate deploy
```

**Nota:** Vercel ejecutará `prisma generate` automáticamente durante el build gracias al script `postinstall`.

## Problemas Comunes y Soluciones

### 1. Error: "Failed to fetch tasks" o errores de conexión

**Causas posibles:**
- Variables de entorno no configuradas correctamente en Vercel
- URLs de conexión incorrectas o expiradas
- Problemas de conexión con la base de datos de Vercel Postgres

**Solución:**
1. Verifica que las variables de entorno estén configuradas en Vercel Dashboard
2. Verifica que las URLs sean correctas (deben incluir `?pgbouncer=true` para POSTGRES_PRISMA_URL)
3. Revisa los logs de Vercel para ver el error específico
4. Usa el endpoint `/api/health` para diagnosticar problemas de conexión

### 2. Error: "Can't reach database server"

**Causas posibles:**
- La base de datos no está activa
- Las credenciales son incorrectas
- Problemas de red/firewall

**Solución:**
1. Verifica que la base de datos esté activa en Vercel
2. Regenera las credenciales si es necesario
3. Verifica que las URLs de conexión estén actualizadas

### 3. Múltiples instancias de PrismaClient

**Solución:** Ya implementada en `lib/db.ts` usando el patrón singleton.

### 4. Error: "the URL must start with the protocol `prisma://`"

**Causa:** Se está usando `directUrl` en el schema.prisma, lo que hace que Prisma espere URLs de Prisma Data Proxy.

**Solución:** Elimina `directUrl` del datasource en `schema.prisma` y usa solo `url = env("POSTGRES_PRISMA_URL")`. Vercel Postgres proporciona URLs estándar de PostgreSQL que funcionan directamente sin necesidad de `directUrl`.

## Endpoint de Diagnóstico

Se ha agregado un endpoint `/api/health` que puedes usar para verificar:

- Estado de la conexión a la base de datos
- Variables de entorno configuradas
- Conteo de tareas en la base de datos

Accede a: `https://tu-dominio.vercel.app/api/health`

## Checklist de Despliegue

- [ ] Variables de entorno configuradas en Vercel
- [ ] Migraciones aplicadas a la base de datos de producción
- [ ] Cliente de Prisma generado correctamente (automático en build)
- [ ] Endpoint `/api/health` responde correctamente
- [ ] Logs de Vercel no muestran errores de conexión

## Verificación Post-Despliegue

1. Visita `/api/health` para verificar la conexión
2. Revisa los logs de Vercel para errores
3. Prueba crear, leer, actualizar y eliminar tareas
4. Verifica que los errores se registren correctamente en los logs

## Logs en Vercel

Para ver los logs de tu aplicación en Vercel:

1. Ve a tu proyecto en Vercel Dashboard
2. Haz clic en la pestaña "Logs"
3. Filtra por "Function Logs" para ver los logs de las API routes
4. Los errores de Prisma aparecerán aquí con detalles completos

## Notas Importantes

- **No uses `$disconnect()`** en funciones serverless - las conexiones se reutilizan automáticamente
- **Usa connection pooling** - siempre usa `POSTGRES_PRISMA_URL` para operaciones normales
- **Manejo de errores** - Los errores ahora incluyen detalles en desarrollo y mensajes seguros en producción
- **Logging** - Los errores se registran en los logs de Vercel para diagnóstico

