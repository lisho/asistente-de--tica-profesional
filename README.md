# Asistente de Ética Profesional

Esta aplicación es un asistente virtual diseñado para resolver dudas y consultas en el ámbito de la ética profesional y la deontología. Utiliza la potencia de la inteligencia artificial (Google Gemini) integrada en una interfaz rápida y moderna, desarrollada en React.

## 📚 Documentación Técnica

Para asegurar el mantenimiento y promover la escalabilidad de la aplicación, se ha elaborado la siguiente documentación de arquitectura y componentes:

- [**Arquitectura General**](docs/ARCHITECTURE.md): Explicación del stack tecnológico, manejo de estado y PWA.
- [**Guía de Componentes**](docs/COMPONENTS.md): Catálogo de los componentes visuales de React.
- [**Servicios y Datos**](docs/SERVICES_DATA.md): Documentación sobre la integración con Gemini, el listado de asistentes y la inyección de la base de conocimiento estática (Código Deontológico, Prompts).

---

## 🚀 Instalación y Despliegue Local

**Requisitos previos:** Node.js v18+

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configuración de Entorno:**
   Es necesario contar con una clave de API de Google Gemini. Crea un archivo `.env` o `.env.local` en la raíz del proyecto basándote en el archivo de ejemplo (como `.env.example`):
   ```env
   VITE_GEMINI_API_KEY=tu_api_key_aqui
   ```

3. **Ejecutar en modo Desarrollo:**
   ```bash
   npm run dev
   ```
   La aplicación se abrirá, por lo general, en `http://localhost:5173`.

4. **Kits para Producción (Build):**
   Para compilar la aplicación y generar los estáticos listos para desplegar:
   ```bash
   npm run build
   ```

## 🛠️ Tecnologías Empleadas

- **React 19**
- **TypeScript**
- **Vite**
- **@google/genai** (Integración oficial con Gemini)
- Compatibilidad PWA y utilidades de PDF (jsPDF).

## 🧑‍💻 Escalabilidad

La base de código está pensada para ser escalable (múltiples roles de asistente, prompts complejos y estado local PWA persistente). Por favor diríjase a la carpeta `/docs` antes de introducir refactorizaciones mayores.
