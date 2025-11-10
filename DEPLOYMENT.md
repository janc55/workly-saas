# Guía de Despliegue en Vercel

Esta guía detalla los pasos para desplegar la aplicación Workly SaaS en Vercel.

## 1. Conectar el Repositorio GitHub con Vercel

1.  **Crea una cuenta en Vercel:** Si aún no tienes una, regístrate en [Vercel](https://vercel.com/). Puedes usar tu cuenta de GitHub para un registro rápido.
2.  **Importa tu Proyecto:**
    *   Una vez logueado, ve al Dashboard de Vercel.
    *   Haz clic en "Add New..." y selecciona "Project".
    *   Selecciona "Import Git Repository" y elige tu repositorio de GitHub donde se encuentra este proyecto. Si no lo ves, es posible que necesites configurar la integración de Vercel con GitHub para darle permisos al repositorio.
3.  **Configuración del Proyecto:** Vercel detectará automáticamente que es un proyecto Next.js y configurará la mayoría de los ajustes por defecto.
    *   **Root Directory:** Asegúrate de que el "Root Directory" sea la raíz de tu proyecto (donde se encuentra `package.json`).
    *   **Build and Output Settings:** Vercel debería detectar `next build` y `next start` automáticamente. No deberías necesitar cambiar esto.

## 2. Configuración de Variables de Entorno

Este proyecto ahora utiliza PostgreSQL con Supabase para el almacenamiento de datos. Es necesario configurar la variable de entorno `DATABASE_URL` en Vercel.

**Pasos para configurar la variable de entorno:**

1.  En la configuración de tu proyecto en Vercel, ve a la pestaña "Settings".
2.  Haz clic en "Environment Variables".
3.  Añade la variable `DATABASE_URL` con la cadena de conexión a tu base de datos de Supabase (por ejemplo: `postgresql://postgres:tu_contraseña@db.tu-proyecto.supabase.co:5432/postgres`).
4.  Asegúrate de que esté disponible para los entornos de "Production", "Preview" y "Development".
5.  La variable ya debe estar configurada en tu archivo `.env` local para desarrollo.

## 3. Activar Despliegues Automáticos

Vercel está diseñado para la integración continua. Una vez que tu repositorio de GitHub esté conectado:

*   Cada `push` a la rama principal (generalmente `main` o `master`) activará un nuevo despliegue de producción.
*   Cada `pull request` creará un despliegue de "Preview" para que puedas revisar los cambios antes de fusionarlos.

No necesitas ninguna configuración adicional para esto; Vercel lo maneja por defecto.

## 4. Cómo Probar el Despliegue y Validar

Después de un despliegue exitoso:

1.  **Accede a la URL del Despliegue:** Vercel te proporcionará una URL única para tu despliegue (por ejemplo, `your-project-name.vercel.app`).
2.  **Valida el Frontend:**
    *   Navega a la página principal.
    *   Intenta crear una nueva tarea.
    *   Intenta actualizar el estado de una tarea existente.
    *   Intenta eliminar una tarea.
    *   Verifica que los mensajes de éxito/error (toasts) aparezcan correctamente.
    *   Comprueba la responsividad de la interfaz en diferentes tamaños de pantalla.
3.  **Valida el Backend (API):**
    *   Puedes usar herramientas como Postman, Insomnia o `curl` para probar directamente los endpoints de la API.
    *   Por ejemplo, para obtener todas las tareas: `GET https://your-project-name.vercel.app/api/tasks`
    *   Para crear una tarea: `POST https://your-project-name.vercel.app/api/tasks` con un cuerpo JSON `{ "title": "Test Task", "description": "Deployed task" }`.
    *   Asegúrate de que las operaciones CRUD funcionen como se espera.

**Notas sobre PostgreSQL y Supabase:**

Este proyecto ahora utiliza PostgreSQL con Supabase, lo que proporciona:
- Persistencia completa de datos en producción
- Escalabilidad y rendimiento optimizado
- Backup automático de datos
- Acceso desde múltiples instancias sin problemas de concurrencia

La migración de SQLite a PostgreSQL ha sido completada y la aplicación está lista para producción.
