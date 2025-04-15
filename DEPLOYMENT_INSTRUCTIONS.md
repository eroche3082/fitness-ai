# Instrucciones de Despliegue para Fitness AI

## Pre-requisitos

1. Tener una cuenta de Firebase y haber creado un proyecto
2. Tener Firebase CLI instalado: `npm install -g firebase-tools`
3. Tener todas las claves API y credenciales necesarias

## Pasos de Despliegue

### 1. Configuración de Variables de Entorno

Copiar el archivo `.env.firebase` a `.env` y completar todas las variables con los valores correspondientes.

```bash
cp .env.firebase .env
# Editar el archivo .env con los valores correctos
```

Luego, configurar las variables de entorno en Firebase:

```bash
firebase functions:config:set stripe.key="STRIPE_SECRET_KEY_VALUE" openai.key="OPENAI_API_KEY_VALUE" # etc.
```

### 2. Compilación del Frontend

```bash
npm run build
```

### 3. Compilación de las Funciones

```bash
cd functions
npm install
npm run build
cd ..
```

### 4. Despliegue en Firebase

Desplegar todo (hosting y funciones):

```bash
firebase deploy
```

O desplegar solo partes específicas:

```bash
firebase deploy --only hosting
firebase deploy --only functions
```

### 5. Configuración Post-Despliegue

1. Agregar el dominio del sitio desplegado a la lista de dominios autorizados en Firebase Auth
2. Asegurarse de que las APIs de Google Cloud y otros servicios permitan el dominio desplegado
3. Verificar que todas las funciones de Firebase estén correctamente desplegadas

## Verificaciones Post-Despliegue

Una vez desplegada la aplicación, verificar que:

1. La autenticación funciona correctamente
2. Todas las pestañas del panel de control se renderizan correctamente
3. La navegación entre páginas permanece dentro del shell de la aplicación
4. La funcionalidad del chatbot está activa y es responsive
5. Las integraciones de Stripe y PayPal son comprobables
6. Los códigos QR, el onboarding y las membresías funcionan correctamente
7. La aplicación es responsive en escritorio, móvil y tablet
8. Los enlaces del footer están activos y son precisos
9. El panel no redirige a la página de inicio al cambiar de pestaña

## Solución de Problemas Comunes

- **Error 404 en rutas específicas**: Asegurarse de que las reglas de reescritura en `firebase.json` están correctamente configuradas
- **Problemas de CORS**: Verificar que el middleware CORS en las funciones está correctamente configurado
- **Errores de autenticación**: Comprobar que el dominio está en la lista de dominios autorizados en Firebase Auth