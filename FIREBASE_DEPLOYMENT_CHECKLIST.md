# Checklist Post-Despliegue para Fitness AI en Firebase

## Funcionalidades que Deben Verificarse

### Autenticación y Acceso
- [ ] Login funciona con credenciales demo/demo123
- [ ] Login funciona con credenciales admin/admin123456
- [ ] Login funciona con código de acceso (formato FIT-XXX-XXXX)
- [ ] Redireccionamiento correcto después del login
- [ ] Logout funciona correctamente

### Navegación y UI
- [ ] Todos los tabs del dashboard se renderizan correctamente
- [ ] La navegación entre páginas se mantiene dentro del app shell
- [ ] No hay redirecciones a la homepage al cambiar de tab
- [ ] Las páginas son scrollables cuando el contenido excede la altura de la ventana
- [ ] Footer con links activos y precisos
- [ ] Diseño responsive en:
  - [ ] Desktop (1920x1080, 1366x768)
  - [ ] Tablet (iPad: 768x1024)
  - [ ] Móvil (iPhone: 375x812, Android: 360x740)

### Funcionalidades Core
- [ ] Chatbot es funcional y responsive
- [ ] Integración con Stripe es testeable
- [ ] Integración con PayPal es testeable
- [ ] Los códigos QR para las rutinas funcionan al escanearlos
- [ ] El proceso de onboarding con 10 preguntas funciona
- [ ] El sistema de membresías muestra opciones correctas

### Funcionalidades de Salud y Fitness
- [ ] Integración con Google Fit está disponible
- [ ] Integración con Apple Health está disponible
- [ ] Integración con Strava está disponible
- [ ] Análisis de voz para contar repeticiones funciona
- [ ] Sistema de Smart Patch accesible

### APIs y Integración
- [ ] Todas las API keys están configuradas
- [ ] No hay errores de CORS
- [ ] Las respuestas de las APIs tienen el formato correcto
- [ ] Los tiempos de respuesta son aceptables (<1s)

## Regresiones o Inconsistencias Detectadas
Listar aquí cualquier regresión o inconsistencia encontrada:

1. ...
2. ...

## Páginas que Requieren Hotfixes Antes de Producción
Listar aquí las páginas que necesitan correcciones urgentes:

1. ...
2. ...

## Notas Adicionales
Cualquier otra observación relevante:

- ...
- ...

---

## Instrucciones para las Pruebas Manuales

### Prueba de Autenticación
1. Acceder a `/login`
2. Intentar login con credenciales demo/demo123
3. Verificar redirección exitosa a dashboard
4. Repetir con otras credenciales
5. Probar el logout

### Prueba de Navegación
1. En el dashboard, navegar a través de todas las pestañas
2. Verificar que no hay recargas completas de página
3. Comprobar que el estado persiste entre cambios de pestaña
4. Verificar que la barra lateral permanece visible

### Prueba de Chatbot
1. Abrir el chatbot desde cualquier página
2. Hacer una pregunta simple como "¿Qué es Fitness AI?"
3. Verificar que responde correctamente
4. Probar el flujo de onboarding de 10 preguntas

### Prueba de Responsive
1. Usar las herramientas de desarrollo para simular diferentes dispositivos
2. Verificar la visualización en cada tamaño de pantalla
3. Comprobar que la navegación móvil aparece en pantallas pequeñas

### Prueba de Códigos QR
1. Acceder a la sección de rutinas
2. Generar un código QR para una rutina
3. Escanear con un dispositivo móvil
4. Verificar que abre la rutina correcta