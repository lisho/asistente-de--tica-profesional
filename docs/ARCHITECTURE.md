# Arquitectura del Asistente de Ética Profesional

Esta aplicación es una Single Page Application (SPA) construida con **React**, **TypeScript** y **Vite**, diseñada para funcionar como un asistente conversacional avanzado utilizando la API de Google Gemini (`@google/genai`).

## 1. Stack Tecnológico

- **Frontend Framework**: React 19.x
- **Lenguaje**: TypeScript
- **Bundler / Build Tool**: Vite (rápido y optimizado para desarrollo frontend moderno)
- **Estilos**: Vanilla CSS / Tailwind (u otro framework CSS integrado, gestionado a través de utilidades de React)
- **PWA (Progressive Web App)**: La aplicación contiene lógica para instalarse localmente, funcionar offline (o al menos notificarlo mediante un `OfflineBanner`), y persistir el estado de la aplicación.
- **Servicios Externos**: Google Gemini API, utilizada a través del SDK oficial para node/browser `@google/genai`.
- **Generación de PDFs**: Utiliza la librería `jspdf` para exportar las conversaciones del chat a PDF.

## 2. Flujo de Datos y Estado Global

La mayor parte del estado global de la aplicación está gestionado en el componente principal (`App.tsx`). 
Este estado incluye:
- **Conversaciones Temporales/Estáticas**: Historial de mensajes de chat.
- **Asistente Activo**: El asistente virtual seleccionado en el momento actual, guiado por la variable de sistema `AssistantKey`.
- **Preferencias de Usuario**: Tamaño de fuente (`fontSizeLevel`), tema activo (`AssistantTheme`), favoritos, etc.
- **Persistencia**: La aplicación lee y escribe constantemente en `localStorage` o mecanismos de almacenamiento del navegador para mantener el histórico de conversaciones entre sesiones, basándose en la lista de conversaciones cargadas.

## 3. Estructura de Directorios

La estructura organizativa del proyecto está diseñada para ser escalable:

- `/public`: Archivos estáticos como el `manifest.json` de la PWA, el `metadata.json` y otros recursos fijos.
- `/components`: Componentes visuales y lógicos de React. Totalmente separados en unidades de única responsabilidad (Botones, Modales, Encabezado, Mensajes).
- `/services`: Lógica de comunicación externa pura. Aisla la lógica de las APIs de los componentes visuales.
- `/constants`: Contiene todo lo referido a configuración "dura" y base de datos local (Prompts del sistema, configuración, textos largos como el Código Deontológico y ayudas de Ética).
- `/src` o raíz: Configuraciones base (Vite, TypeScript, Tailwind) y componentes de entrada (como `App.tsx` y `index.tsx`).

## 4. Patrones de Diseño Utilizados

- **Container/Presenter**: Aunque simplificado, `App.tsx` actúa como contenedor principal que maneja los estados complejos, pasando funciones callback y datos como props a los componentes presentacionales puros (ej. `ChatInput`, `Sidebar`).
- **Registry Pattern**: En `/assistants.ts`, los asistentes están definidos y pueden ser extendidos fácilmente añadiendo nuevos elementos al `ASSISTANT_REGISTRY` sin tener que reestructurar todo el código.
- **Manejo de Errores y Caídas (Graceful Degradation)**: Cuando no hay acceso a internet, la app avisa mediante `OfflineBanner` e impide llamadas que fallarán.

## 5. Escalabilidad y Mantenimiento

Para mantener esta arquitectura limpia:
1. **Evitar sobrecargar `App.tsx`**: Si el estado crece demasiado, se recomienda reemplazarlo con `Context API` o una librería de estado externa.
2. **Nuevas Funcionalidades**: Si se requiere agregar nuevas fuentes de datos o IAs, se deben crear nuevos servicios en la carpeta `/services` y mantener la misma firma e interfaz para poder intercambiarlas o combinarlas.
