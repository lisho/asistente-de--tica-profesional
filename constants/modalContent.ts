import { GEMINI_MODEL_NAME } from './appConfig';

export const ABOUT_EULOGIO_CONTENT = {
  title: "Acerca de Eulogio",
  sections: [
    {
      heading: "Versión",
      text: `Asistente de Ética Profesional - Versión 2.1.1-beta. Esta versión incluye mejoras en el análisis ético con metodologías de Sarah Banks, Ballestero y Reamer.\n\nModelo de IA en uso: ${GEMINI_MODEL_NAME}`
    },
    {
      heading: "Propósito",
      text: "Eulogio es un asistente virtual de IA diseñado para apoyar a profesionales y estudiantes de Trabajo Social en España. Su objetivo principal es ofrecer orientación y respuestas basadas en el Código Deontológico de la profesión y documentos relevantes sobre ética profesional."
    },
    {
      heading: "Base de Conocimiento",
      text: "Eulogio se basa fundamentalmente en el 'Código Deontológico del Trabajo Social' (Consejo General del Trabajo Social, 2012) y el 'Documento de Información: Ética y Deontología en el Trabajo Social en España'. Como buen profesional, procurará citar las fuentes cuando es pertinente."
    },
    {
      heading: "Limitaciones Importantes",
      text: "Soy un asistente de IA y mi conocimiento se limita a la información con la que fui entrenado. Mis respuestas no constituyen asesoramiento legal ni reemplazan el juicio profesional de un trabajador social humano cualificado, ni la consulta directa de las fuentes originales o la supervisión profesional. Siempre debes contrastar la información crítica y tomar decisiones basadas en un análisis completo de la situación."
    },
    {
      heading: "Privacidad y Confidencialidad",
      text: "Por favor, no compartas información personal identificable o sensible sobre casos reales en esta conversación. Aunque la conversación es procesada de forma segura, es una buena práctica mantener la confidencialidad de los datos de las personas usuarias. Las interacciones pueden ser revisadas de forma anónima para mejorar el servicio."
    }
  ]
};

export const ABOUT_PEPI_CONTENT = {
  title: "Acerca de Pepi",
  sections: [
    {
      heading: "Versión",
      text: `Asistente de Ética Profesional - Versión 2.1.1-beta. Esta versión incluye mejoras en el análisis ético con metodologías de Sarah Banks, Ballestero y Reamer.\n\nModelo de IA en uso: ${GEMINI_MODEL_NAME}`
    },
    {
      heading: "Misión",
      text: "Pepi es una asistente virtual IA enfocada en apoyar a profesionales y estudiantes de Trabajo Social en España. Busca proporcionar apoyo claro y empático, basándose en el Código Deontológico y documentación ética relevante."
    },
    {
      heading: "Conocimiento",
      text: "Pepi utiliza el 'Código Deontológico del Trabajo Social' y el 'Documento de Información: Ética y Deontología en el Trabajo Social en España' como sus principales fuentes. Se esfuerza por ofrecer respuestas informadas y contextualizadas."
    },
    {
      heading: "Consideraciones",
      text: "Como IA, las respuestas de Pepi no sustituyen el consejo legal ni el juicio de un profesional cualificado. Es una herramienta de apoyo y consulta. Siempre verifica la información crucial y considera el contexto completo."
    },
    {
      heading: "Confidencialidad",
      text: "Evita compartir datos personales o sensibles. Las conversaciones se procesan de forma segura, pero la protección de la privacidad es esencial. Las interacciones pueden usarse anónimamente para mejorar el sistema."
    }
  ]
};

export const HOW_TO_USE_SECTIONS = [
  {
    heading: "👋 Bienvenida y Selección de Asistente",
    points: [
      "Al iniciar, verás la página de bienvenida.",
      "**Elige tu Asistente:** Haz clic en la tarjeta del asistente (Eulogio o Pepi) que prefieras. Cada uno tiene un estilo y enfoque particular.",
      "**Identifícate:** Escribe tu nombre en el campo de texto.",
      "**Comenzar:** Pulsa el botón 'Entrar al chat con [Nombre del Asistente]' para acceder a la sala de chat."
    ]
  },
  {
    heading: "💬 Interfaz Principal del Chat",
    text: "Una vez dentro, aunque puede variar ligeramente del ordenador a un dispositivo móvil, la interfaz se divide en tres partes principales:"
  },
  {
    heading: "Menú Lateral (Izquierda)",
    points: [
      "Información del asistente activo y botón para nueva conversación.",
      "Historial de conversaciones anteriores con opción de eliminar.",
      "Acceso a recomendaciones de uso."
    ]
  },
  {
    heading: "Barra Superior",
    points: [
      "Botones de navegación: menú, cambio de asistente y feedback.",
      "Herramientas: zoom de texto, descarga PDF, favoritos, limpiar chat e información."
    ]
  },
  {
    heading: "Área de Conversación (Centro)",
    points: [
      "Zona de mensajes entre el usuario y el asistente.",
      "Campo de entrada de texto con opciones de dictado por voz y envío."
    ]
  },
  {
    heading: "⚙️ Funcionalidades Adicionales",
    points: [
      "**Guardado Local y Privacidad:** Las conversaciones solo se guardan en tu dispositivo para proteger tu privacidad y no compartir información externamente. La ventaja es la confidencialidad total; el inconveniente es que para acceder a tus mensajes anteriores es necesario entrar con el **mismo nombre**, con el **mismo asistente** y desde el **mismo dispositivo**.",
      "**Instalación (PWA):** Si tu navegador lo permite, verás un botón 'Instalar App' en la esquina inferior derecha. Esto añade la aplicación a tu dispositivo para un acceso más rápido y una experiencia similar a una app nativa.",
      "**Indicador de Desconexión:** Si pierdes la conexión a internet, aparecerá un banner amarillo en la parte superior advirtiéndote. Las funciones de IA no estarán disponibles hasta que recuperes la conexión.",
      "**Favoritos:** Puedes marcar mensajes importantes del asistente para revisarlos y descargarlos fácilmente más tarde a través de espacio de favoritos."
    ]
  }
];

export const BUTTON_LEGEND_ITEMS = [
  {
    icon: "⬅️",
    name: "Cambiar de Asistente",
    description: "Vuelve a la página de bienvenida para seleccionar otro asistente o cambiar tu nombre. El chat actual con el asistente previo se guardará automámicamente en tu dispositivo por si quieres volver a él.",
    location: "Cabecera"
  },
  {
    icon: "🔍➖",
    name: "Disminuir Tamaño de Fuente",
    description: "Reduce el tamaño del texto de los mensajes en el chat para una mejor lectura si lo prefieres más pequeño.",
    location: "Cabecera"
  },
  {
    icon: "🔍➕",
    name: "Aumentar Tamaño de Fuente",
    description: "Aumenta el tamaño del texto de los mensajes en el chat si necesitas una vista más grande.",
    location: "Cabecera"
  },
  {
    icon: "📄⬇️",
    name: "Descargar Chat (PDF)",
    description: "Guarda la conversación actual como un archivo PDF en tu dispositivo.",
    location: "Cabecera"
  },
  {
    icon: "⭐",
    name: "Ver Favoritos",
    description: "Abre un modal donde puedes ver todas las interacciones (tu pregunta y la respuesta de la IA) que hayas marcado como favoritas. También puedes descargar tus favoritos en PDF desde aquí.",
    location: "Cabecera"
  },
  {
    icon: "🗑️",
    name: "Limpiar Chat",
    description: "Elimina todos los mensajes de la conversación actual con el asistente. Se pedirá confirmación.",
    location: "Cabecera"
  },
  {
    icon: "ℹ️",
    name: "Acerca de [Asistente]",
    description: "Muestra información detallada sobre el asistente actual, su propósito, base de conocimiento y limitaciones.",
    location: "Cabecera"
  },
  {
    icon: "🎤",
    name: "Dictar Mensaje / Detener Dictado",
    description: "Permite dictar tu pregunta usando la voz. Púlsalo una vez para empezar a dictar, y de nuevo para detener. Si el navegador no es compatible o no tiene permisos, estará desactivado.",
    location: "Entrada de Mensajes"
  },
  {
    icon: "➤",
    name: "Enviar Mensaje",
    description: "Envía el texto que has escrito (o dictado) al asistente.",
    location: "Entrada de Mensajes"
  },
  {
    icon: "⭐",
    name: "Marcar/Desmarcar Favorito",
    description: "Aparece al pasar el ratón o tocar la pantalla sobre un mensaje del asistente. Permite guardar la interacción (tu pregunta previa y esta respuesta) como favorita, o quitarla si ya lo estaba.",
    location: "Mensajes del Asistente"
  },
  {
    icon: "📋",
    name: "Copiar Mensaje",
    description: "Aparece al pasar el ratón o tocar la pantalla sobre un mensaje del asistente. Copia el texto completo de ese mensaje al portapapeles.",
    location: "Mensajes del Asistente"
  },
  {
    icon: "⬇️",
    name: "Instalar Aplicación",
    description: "Botón flotante que aparece si la aplicación aún no está instalada y el navegador lo soporta. Te permite instalar la app en tu dispositivo.",
    location: "Esquina inferior derecha (si aplica)"
  }
];