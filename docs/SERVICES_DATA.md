# Lógica de Negocio y Datos (/constants y /services)

La aplicación depende en gran medida de información estática inyectada en prompts dinámicos para guiar al comportamiento de la IA utilizando llamadas a la API de Gemini.

## Servicios Externos (`/services`)

La carpeta `services` es el puente entre el Frontend de la aplicación y la arquitectura en la nube de IA (Google Gemini).
- **`geminiService.ts`**: Utiliza `@google/genai` e implementa funciones asíncronas para las peticiones (`sendMessage`, `streamMessage`, etc.).
  - Centraliza el acceso al modelo a través de variables de entorno (como `import.meta.env.VITE_GEMINI_API_KEY`).
  - Formatea los historiales de forma natural para que el LLM del modelo de base comprenda el contexto (Roles: `"user"`, `"model"` o `"system"`).
  - Maneja los posibles fallos (errores de red, cuotas, limit rank). Es el **único lugar del código** interactuando directamente con el proveedor ajeno.

## Base de Conocimiento y Textos (`/constants`)

Para que el modelo actúe estrictamente como un "Asistente de Ética Profesional", este necesita contexto. Gran parte del contexto se encuentra aquí almacenado:

1. **`codigoDeontologico.ts` / `infoEticaDeontologia.ts`**: Archivos grandes de texto o estructuras de datos que almacenan los documentos base, las reglas, las leyes o marcos de referencia oficiales sobre ética y deontología. Proveen contexto de lectura "cero o pocas llamadas" (Zero-shot / Few-shot) a través del primer prompt.
2. **`systemInstructions.ts` / `prompts.ts`**: Directrices estrictas mandadas a Gemini para limitar sus funciones (por ejemplo: "tú eres un asistente profesional de la salud mental / legal, y te riges por este marco"). Regulan tono, concisión, y el uso correcto del contexto importado.
3. **`modalContent.ts` / `appConfig.ts`**: Configuraciones generales de UI y de la aplicación, como arrays de FAQs, contenido general para modales informativos de bienvenida y los límites o versiones de la aplicación.
4. **`knowledgeBase.ts`**: Punto unificador o pequeñas partes de base de conocimiento (FAQ extendidos o referencias rápidas recomendadas al modelo).

## Registro de Asistentes (`/assistants.ts` en raíz)

La aplicación cuenta con un concepto de múltiples personalidades o enfoques para la asistencia:
- La enumeración `AssistantKey` y el `ASSISTANT_REGISTRY` definen perfiles como "analítico", "empático", o "revisor de código ético". Esto permite escalar a más especialidades con un simple cambio en este archivo en lugar de generar rutas nuevas.

## Recomendaciones y Escalabilidad
Si la base de conocimiento se vuelve demasiado pesada (por ejemplo, sumando miles de páginas a `codigoDeontologico.ts`), considere integrar una **Vector Database (Base de Datos Vectorial)** junto con una estrategia RAG (Retrieval-Augmented Generation), de manera que el servicio consulte dinámicamente el fragmento relevante previo al envío a la API de Google Gemini en lugar de enviar iterativamente un context-window tan grande.
