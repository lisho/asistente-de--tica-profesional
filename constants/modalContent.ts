export const ABOUT_EULOGIO_CONTENT = {
  title: "Acerca de Eulogio",
  sections: [
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
      "**Identifícate:** Escribe tu nombre en el campo provisto.",
      "**Comenzar:** Pulsa el botón 'Entrar al chat con [Nombre del Asistente]' para acceder a la sala de chat."
    ]
  },
  {
    heading: "💬 Interfaz Principal del Chat",
    text: "Una vez dentro, la interfaz se divide en tres partes principales:"
  },
  {
    heading: "1. Cabecera (Parte Superior)",
    points: [
      "Muestra el avatar, nombre y lema del asistente seleccionado.",
      "Contiene botones para diversas acciones (ver 'Leyenda de Botones' más abajo)."
    ]
  },
  {
    heading: "2. Área de Mensajes (Centro)",
    points: [
      "Aquí se muestra la conversación entre tú y el asistente.",
      "Tus mensajes aparecen a la derecha; los del asistente, a la izquierda con su avatar.",
      "Puedes desplazarte hacia arriba para ver mensajes anteriores."
    ]
  },
  {
    heading: "3. Entrada de Mensajes (Parte Inferior)",
    points: [
      "**Escribir Mensaje:** Utiliza el campo de texto grande para escribir tus preguntas o comentarios.",
      "**Dictar por Voz:** Pulsa el botón del micrófono para activar el dictado (requiere permiso del navegador). Vuelve a pulsarlo para detener.",
      "**Enviar Mensaje:** Pulsa el botón del avión de papel para enviar tu texto al asistente."
    ]
  },
  {
    heading: "⚙️ Funcionalidades Adicionales",
    points: [
      "**Guardado Automático:** Tu nombre, el asistente elegido, el historial de chat y tus preferencias (como el tamaño de fuente) se guardan en tu navegador. Si cierras y vuelves a abrir la app, deberías poder continuar donde lo dejaste.",
      "**Instalación (PWA):** Si tu navegador lo permite, verás un botón 'Instalar App' en la esquina inferior derecha. Esto añade la aplicación a tu dispositivo para un acceso más rápido y una experiencia similar a una app nativa.",
      "**Indicador de Desconexión:** Si pierdes la conexión a internet, aparecerá un banner amarillo en la parte superior advirtiéndote. Las funciones de IA no estarán disponibles hasta que recuperes la conexión.",
      "**Favoritos:** Puedes marcar mensajes importantes del asistente para revisarlos fácilmente más tarde a través del modal de favoritos."
    ]
  }
];

export const BUTTON_LEGEND_ITEMS = [
  {
    icon: "⬅️",
    name: "Cambiar de Asistente",
    description: "Vuelve a la página de bienvenida para seleccionar otro asistente o cambiar tu nombre. El chat actual con el asistente previo se guardará si vuelves a él.",
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
    description: "Abre un modal donde puedes ver todas las interacciones (tu pregunta y la respuesta del IA) que hayas marcado como favoritas. También puedes descargar tus favoritos en PDF desde aquí.",
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
    description: "Permite dictar tu pregunta usando la voz. Púlsalo una vez para empezar a escuchar, y de nuevo para detener. Si el navegador no es compatible o no tiene permisos, estará desactivado.",
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
    description: "Aparece al pasar el ratón sobre un mensaje del asistente. Permite guardar la interacción (tu pregunta previa y esta respuesta) como favorita, o quitarla si ya lo estaba.",
    location: "Mensajes del Asistente"
  },
  {
    icon: "📋",
    name: "Copiar Mensaje",
    description: "Aparece al pasar el ratón sobre un mensaje del asistente. Copia el texto completo de ese mensaje al portapapeles.",
    location: "Mensajes del Asistente"
  },
  {
    icon: "⬇️",
    name: "Instalar Aplicación",
    description: "Botón flotante que aparece si la aplicación aún no está instalada como PWA y el navegador lo soporta. Te permite instalar la app en tu dispositivo.",
    location: "Esquina inferior derecha (si aplica)"
  }
];