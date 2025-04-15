# Instrucciones de Despliegue en Firebase para Fitness AI

## Configuración Inicial

Fitness AI está configurado para ser desplegado como un sitio específico dentro del proyecto Firebase `erudite-creek-431302-q3`. Se han realizado las configuraciones necesarias en los archivos `.firebaserc` y `firebase.json` para garantizar un despliegue correcto.

## Requisitos Previos

1. **Firebase CLI**: Asegúrate de tener instalado Firebase CLI en tu sistema.
   ```bash
   npm install -g firebase-tools
   ```

2. **Credenciales Firebase**: Debes tener acceso al proyecto Firebase `erudite-creek-431302-q3`.

3. **Configuración de Secretos**: Para configurar las variables de entorno en Firebase, sigue estos pasos:

   a. Para Firebase Functions:
   ```bash
   firebase functions:config:set google.api_key=TU_API_KEY_DE_GOOGLE
   firebase functions:config:set stripe.secret_key=TU_STRIPE_SECRET_KEY
   # Continúa con todas las API keys y secretos necesarios
   ```

   b. Para variables de entorno en el cliente (frontend), utiliza la consola de Firebase:
   - Ve a Project Settings > Service accounts > Environment Variables
   - Agrega las variables con el prefijo VITE_ que necesita el frontend, como VITE_FIREBASE_API_KEY, VITE_STRIPE_PUBLIC_KEY, etc.
   
   c. Alternativamente, puedes configurar las variables de entorno mediante la CLI de Firebase:
   ```bash
   firebase functions:config:get > .runtimeconfig.json
   ```
   
   d. La aplicación ya contiene un archivo `.env.firebase` con la estructura necesaria. Las variables se reemplazarán con los valores reales del entorno de Firebase durante el despliegue.

## Configuración de Firebase

La aplicación Fitness AI está configurada con los siguientes parámetros:

- **Proyecto**: `erudite-creek-431302-q3`
- **Sitio**: `fitnessai`
- **Dominio de autenticación**: `erudite-creek-431302-q3.firebaseapp.com`

## Pasos para el Despliegue

### Método Automatizado (Recomendado)

Se ha incluido un script automatizado que simplifica el proceso de despliegue:

1. **Ejecutar el script de despliegue**:
   ```bash
   ./deploy-to-firebase.sh
   ```
   
   Este script realizará automáticamente los siguientes pasos:
   - Verificará que Firebase CLI esté instalado
   - Te ayudará a autenticarte en Firebase
   - Seleccionará el proyecto correcto
   - Construirá la aplicación
   - Desplegará a Firebase Hosting
   - Te dará la opción de desplegar también las funciones

### Método Manual

Si prefieres realizar los pasos manualmente, sigue estas instrucciones:

1. **Autenticación en Firebase**:
   ```bash
   firebase login
   ```

2. **Seleccionar el Proyecto**:
   ```bash
   firebase use erudite-creek-431302-q3
   ```
   o
   ```bash
   firebase use --add
   ```
   Y seleccionar el proyecto `erudite-creek-431302-q3`.

3. **Construir la Aplicación**:
   ```bash
   npm run build
   ```
   Esto generará los archivos en la carpeta `dist` que serán desplegados.

4. **Desplegar la Aplicación**:
   ```bash
   firebase deploy --only hosting:fitnessai
   ```
   Este comando desplegará específicamente el sitio "fitnessai" en el proyecto.

5. **Desplegar Funciones** (si es necesario):
   ```bash
   firebase deploy --only functions
   ```

6. **Despliegue Completo** (hosting y funciones):
   ```bash
   firebase deploy
   ```

## Verificación Post-Despliegue

Después de completar el despliegue, debes verificar que la aplicación funcione correctamente:

1. Accede a la URL de tu aplicación (normalmente será `fitnessai.web.app` o `fitnessai.firebaseapp.com`).
2. Verifica que puedas acceder a las siguientes rutas:
   - `/` (Homepage)
   - `/login`
   - `/signup`
   - `/dashboard`
   - `/admin`
   - `/superadmin`
   - `/pricing`
   - `/features`
   - `/workout`
   - `/chat`

3. Asegúrate de que no hay problemas de redirección o páginas en blanco.
4. Prueba la autenticación con credenciales de prueba.
5. Verifica que las funcionalidades principales estén operativas.

## Configuración de Dominio Personalizado (si es necesario)

Si deseas configurar un dominio personalizado para tu aplicación:

1. En la consola de Firebase, ve a Hosting > Dominios personalizados.
2. Sigue las instrucciones para verificar tu dominio y configurar los registros DNS.

## Resolución de Problemas Comunes

### Problemas de Autenticación
- Verifica que las claves de Firebase en `.env` estén correctamente configuradas.
- Asegúrate de que el dominio de despliegue esté en la lista de dominios autorizados en la consola de Firebase Authentication.

### Problemas de Redirección
- Verifica las reglas de redirección en `firebase.json`.
- Asegúrate de que todas las rutas importantes estén incluidas en la configuración de `rewrites`.

### Problemas de API
- Verifica que las claves de API estén correctamente configuradas como secretos de Firebase Functions.
- Comprueba los logs de Firebase Functions para detectar errores.

## Notas Importantes

- La aplicación está configurada para usar el ID del proyecto `erudite-creek-431302-q3`.
- El sitio Firebase está configurado como `fitnessai`.
- Se han configurado reglas específicas de caché y redirección para optimizar el rendimiento.
- Asegúrate de utilizar la versión correcta de Node.js para las funciones (actualmente configurada como `nodejs16`).

---

Para cualquier problema durante el despliegue, consulta la documentación oficial de Firebase Hosting o ponte en contacto con el equipo de desarrollo.