#!/bin/bash

# Script de despliegue automatizado para Fitness AI en Firebase
# Este script automatiza los pasos de despliegue para la plataforma Fitness AI

# Colores para las salidas
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar mensajes con formato
print_message() {
  echo -e "${BLUE}[Fitness AI Deploy]${NC} $1"
}

print_success() {
  echo -e "${GREEN}[✓] $1${NC}"
}

print_warning() {
  echo -e "${YELLOW}[!] $1${NC}"
}

print_error() {
  echo -e "${RED}[✗] $1${NC}"
}

# Verificar si Firebase CLI está instalado
if ! command -v firebase &> /dev/null
then
  print_error "Firebase CLI no está instalado. Por favor, instálalo con 'npm install -g firebase-tools'"
  exit 1
fi

# Verificar login en Firebase
print_message "Verificando autenticación en Firebase..."
firebase login:ci --no-localhost

# Seleccionar el proyecto correcto
print_message "Seleccionando proyecto Firebase..."
firebase use erudite-creek-431302-q3
if [ $? -ne 0 ]; then
  print_warning "No se pudo seleccionar el proyecto automáticamente. Intentando añadirlo..."
  firebase use --add
  if [ $? -ne 0 ]; then
    print_error "Error al configurar el proyecto Firebase. Por favor, ejecuta 'firebase use --add' manualmente."
    exit 1
  fi
fi
print_success "Proyecto Firebase seleccionado: erudite-creek-431302-q3"

# Construir la aplicación
print_message "Construyendo la aplicación..."
npm run build
if [ $? -ne 0 ]; then
  print_error "Error al construir la aplicación. Verifica los errores e intenta nuevamente."
  exit 1
fi
print_success "Aplicación construida correctamente"

# Verificar que el directorio dist existe
if [ ! -d "dist" ]; then
  print_error "El directorio 'dist' no existe. Verifica que la compilación se realizó correctamente."
  exit 1
fi

# Desplegar a Firebase Hosting
print_message "Desplegando a Firebase Hosting (sitio: fitnessai)..."
firebase deploy --only hosting:fitnessai
if [ $? -ne 0 ]; then
  print_error "Error durante el despliegue a Firebase Hosting."
  exit 1
fi
print_success "Aplicación desplegada correctamente en Firebase Hosting"

# Desplegar funciones (opcional)
read -p "¿Deseas desplegar también las funciones de Firebase? (s/n): " deploy_functions
if [[ $deploy_functions == "s" || $deploy_functions == "S" ]]; then
  print_message "Desplegando Firebase Functions..."
  firebase deploy --only functions
  if [ $? -ne 0 ]; then
    print_error "Error durante el despliegue de Firebase Functions."
    exit 1
  fi
  print_success "Firebase Functions desplegadas correctamente"
fi

# Mensaje final
print_message "=================================================="
print_success "¡Despliegue completado con éxito!"
print_message "Tu aplicación está disponible en: https://fitnessai.web.app"
print_message "=================================================="
print_message "Ejecuta las pruebas post-despliegue según FIREBASE_DEPLOYMENT_CHECKLIST.md"
print_message "Para cualquier problema, consulta FIREBASE_DEPLOYMENT_INSTRUCTIONS.md"