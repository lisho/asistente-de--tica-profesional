# Guía de Componentes

Este documento lista y explica el propósito de cada componente de React en la carpeta `/components`, para facilitar su actualización y mantenimiento.

## Componentes Principales

- **`ChatInput.tsx`**: Componente de entrada de texto donde el usuario escribe su mensaje. Controla sus propios estados menores (como si el área de texto está focuseada) y se comunica con `App.tsx` mediante un evento de envío de mensaje (`onSendMessage`).
- **`ChatMessage.tsx`**: Renderiza un único mensaje (sea del usuario o de la IA), con soporte para animaciones de entrada, markdown, e información temporal o estilos específicos dependiendo del autor.
- **`Sidebar.tsx`**: Barra lateral (drawer) que enumera el historial de conversaciones previas y opciones secundarias (favoritos, instalación de la app). Emite eventos al padre (`App.tsx`) para cambiar o borrar chats.
- **`Header.tsx`**: La barra superior ("Navbar") que muestra el título de la conversación actual, el asistente activo, y provee botones para las configuraciones y herramientas (exportar PDF, ayuda visual, menú de configuración).

## Modales y Vistas Secundarias

- **`AboutModal.tsx`**: Muestra información general y versión de la aplicación.
- **`ConfirmationModal.tsx`**: Modal reutilizable y genérico para requerir acciones sensibles del usuario (por ejemplo, confirmar el borrado del historial de chat, cerrar sesión, vaciar historial).
- **`FavoritesModal.tsx`**: Interfaz donde el usuario puede administrar, ver y recuperar mensajes marcados como favoritos o útiles de sus chats anteriores.
- **`HelpGuideModal.tsx`**: Panel de ayuda específico y tutoriales en pantalla.
- **`WelcomeInstructionsModal.tsx`**: Contenido educativo que se le muestra al usuario en los primeros ingresos, como onboarding general.
- **`WelcomePage.tsx`**: Pantalla inicial o placeholder cuando no hay ninguna conversación activa o recién se inicia la app y aún no se ha mandado ningún mensaje.

## Utilidades y Feedback Visual

- **`LoadingSpinner.tsx`**: Icono de carga sencillo para evitar la sensación de bloqueo en consultas de API largas.
- **`OfflineBanner.tsx`**: Banda de advertencia condicional que aparece sólo si el evento `windows.offline` es atrapado y la app pierde conexión, advirtiendo que la PWA y las respuestas de Gemini podrían fallar.
- **`InstallPWAButton.tsx`**: Botón específico que escucha al evento `beforeinstallprompt` y da al usuario la opción de instalar la app directamente desde el navegador (Android / Chrome Desktop).
- **`SkipLink.tsx`**: Utilidad de accesibilidad para lectores de pantalla que permite saltar directamente al contenido principal para usuarios de tecnología de acceso (A11y).

## Recomendaciones para Agregar Componentes

A la hora de añadir nuevos componentes:
1. Usar siempre `React.FC` y definir **interfaces de Props** claras en TypeScript.
2. Evitar introducir el estado global aquí a menos que sea necesario. Que los modales informen de los eventos o cierres delegando a la función `onClose` o similar en el componente padre.
3. Priorizar el principio de Responsabilidad Única (SRP); si un archivo supera las 300 líneas, probablemente debe subdividirse en sub-componentes.
