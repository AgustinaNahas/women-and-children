import { bibliography, databaseHref } from "./bibliography";
import type { Content } from "./types";

/*
  Misma estructura que content/en.ts.
  El inglés es la fuente de verdad.
*/

const es: Content = {
  meta: {
    title: "Mujeres y niños en la 81.ª Asamblea General",
    description:
      "Cómo la 81.ª Asamblea General de la ONU dice «mujeres y niños», y cómo esos discursos enmarcan a las mujeres como agentes, víctimas o ambas.",
  },
  ui: {
    languageLabel: "Idioma",
    skipLabel: "Saltar al contenido",
    notFoundTitle: "Página no encontrada",
    closeLabel: "Cerrar",
    newTabLabel: "se abre en una pestaña nueva",
    languages: { en: "EN", es: "ES" },
    translationLabel: "Traducción",
    sourceLabel: "Fuente",
    groupLabel: "Grupo",
    speechesLabel: "Discursos",
    cellsLabel: "Celdas",
    showing: "Mostrando {label}",
    allCategories: "Todas las categorías",
    provisional:
      "Esquema, no el recuento codificado de esta sesión. Las celdas muestran cómo se disponen juntos los tres marcos.",
  },
  header: {
    script: "¡Mujeres y niños!",
    title: "¿Cómo se retrata a las mujeres en los discursos de las Naciones Unidas?",
  },
  opening: {
    script: "¿Cómo se retrata a las mujeres?",
    title: "¿cómo se retrata a las mujeres?",
    lede: "Cada año, las Naciones Unidas organizan un debate general en el que cada país pronuncia un discurso. Tienen 15 minutos para hablar. Se pueden usar muchas palabras.",
    body: "Pero... nos preguntamos:",
    videoLabel: "Compilación de discursos que mencionan a las mujeres",
    mute: "Silenciar",
    unmute: "Activar sonido",
    pause: "Pausar",
    play: "Reproducir",
  },
  photo: {
    title: "El debate general",
    alt: "Ilustración de un podio y un fondo verde en el salón de la Asamblea General, que ocupa el lugar de una fotografía.",
    caption: "El debate general, período de sesiones {session}.",
    credit: "Ilustración. Una fotografía documental puede reemplazar este marco.",
  },
  waffle: {
    title: "¿Cuánto se menciona a las mujeres?",
    squareLabel: "Cada rectángulo representa un discurso.",
    stitchLabel: "Cada punto de cruz representa un discurso en el que se menciona a las mujeres.",
    stitchLabelChildren:
      "Cada punto de cruz representa un discurso en el que se menciona a las mujeres junto con niños o niñas.",
    showing: "Mostrando {label}",
    steps: [
      {
        id: "pattern",
        title: "",
        body: "",
        figure: null,
        caption: "Las mujeres se mencionan en 105 de un total de 197 discursos.",
      },
      {
        id: "rows",
        title: "",
        body: "",
        figure: "53%",
        caption: "del total de discursos mencionan a las mujeres.",
      },
      {
        id: "asked",
        title: "",
        body: "",
        figure: null,
        caption: "Y cuando preguntamos cómo se menciona a las mujeres, vimos que...",
      },
      {
        id: "outline",
        title: "",
        body: "",
        figure: "43%",
        caption: "de las menciones de mujeres también mencionan a niños o niñas.",
      },
    ],
    summary:
      "{phrase} de {withWomen} discursos que mencionan a las mujeres dicen también «mujeres y niños». Se revisaron {scanned} discursos.",
    scannedLabel: "Discursos revisados",
    mentionLabel: "Mencionan a las mujeres",
    filledLabel: "Mujeres y niños",
    tableCaption:
      "Discursos revisados, discursos que mencionan a las mujeres y discursos que dicen «mujeres y niños»",
    source:
      "Debate general, período de sesiones {session}. {scanned} discursos revisados.",
    speechListCaption:
      "Discursos revisados, por orador, país y si el discurso menciona a las mujeres o a mujeres y niños",
    speakerLabel: "Orador",
    countryLabel: "País",
    speechTitleLabel: "Discurso",
    mentionNone: "Sin mención de mujeres",
    mentionWomen: "Mujeres",
    mentionBoth: "Mujeres y niños",
  },
  quotes: {
    title: "En sus palabras",
    lede: "La frase, tal como se pronunció. La línea es la transcripción, recortada a una oración.",
    items: [
      {
        slug: "trinidad-and-tobago",
        depth: 0.18,
        text: "…we intend to commit to is women and children, as well as peace and security.",
        translation:
          "…aquello a lo que nos proponemos comprometernos es a las mujeres y los niños, así como a la paz y la seguridad.",
      },
      {
        slug: "brazil",
        depth: 0.36,
        text: "Palestinians will carry the pain and trauma left by the genocide of women and children perpetrated.",
        translation:
          "Los palestinos cargarán con el dolor y el trauma que dejó el genocidio de mujeres y niños perpetrado.",
      },
      {
        slug: "iran-islamic-republic",
        depth: 0.24,
        text: "They martyred, assassinated our scientists, our men, women and children.",
        translation:
          "Martirizaron, asesinaron a nuestros científicos, a nuestros hombres, mujeres y niños.",
      },
      {
        slug: "madagascar",
        depth: 0.42,
        text: "This priority commitment serves the entire population, particularly women and children, providing our youth with the means to build their future with confidence.",
        translation:
          "Este compromiso prioritario sirve a toda la población, en particular a las mujeres y a los niños, y da a nuestra juventud los medios para construir su futuro con confianza.",
      },
      {
        slug: "united-republic-tanzania",
        depth: 0.2,
        text: "…advocacy for women, children and those whose voices are too often unheard.",
        translation:
          "…la defensa de las mujeres, de los niños y de aquellos cuyas voces demasiado a menudo no se escuchan.",
      },
      {
        slug: "bosnia-and-herzegovina",
        depth: 0.32,
        text: "…advancing the rights of women and children.",
        translation: "…promoviendo los derechos de las mujeres y los niños.",
      },
      {
        slug: "mongolia",
        depth: 0.28,
        text: "…improving education, health, food security, and advancement of women and children.",
        translation:
          "…mejorando la educación, la salud, la seguridad alimentaria y el avance de las mujeres y los niños.",
      },
    ],
  },
  frame: {
    script: "La evidencia muestra",
    title: "La evidencia muestra",
    body: "Que el paradigma que asocia a las mujeres con los niños impide que se las vea como agentes activas de cambio para la paz, o como actoras de sus propias vidas, y así limita su participación en la reconstrucción o la rehabilitación de las sociedades.",
    emphasis: "mujeres con los niños",
    source:
      "Puechguirbal, N. (2004). Women and children: deconstructing a paradigm. Seton Hall J. Dipl. & Int'l Rel., 5, 5.",
  },
  portrayal: {
    agentsLabel: "Agentes",
    mixedLabel: "Mixto",
    victimsLabel: "Víctimas",
    intro: "En la 81.ª Asamblea General, estas categorías se reflejaron de la siguiente manera:",
    flowerRef:
      "Cada flor representa cada vez que se mencionó «mujeres y niños» en el discurso de un país.",
    grouped: "Así se mencionó «mujeres y niños» en los discursos.",
    card: "Vimos que en el {percent}% de los casos las mujeres y los niños se retratan como víctimas.",
  },
  talk: {
    title: "¿Cómo se percibe a las mujeres?",
    description: "Cuando analizamos los discursos, identificamos tres categorías.",
    steps: [
      {
        id: "agents",
        label: "Agentes",
        emphasis: "agentes",
        body: "Cuando hablamos de agentes hablamos de discursos en los que las mujeres se enmarcan como tomadoras activas de decisiones, como quienes contribuyen a la economía o como titulares de derechos por sí mismas.",
      },
      {
        id: "victims",
        label: "Víctimas",
        emphasis: "víctimas",
        body: "Cuando hablamos de víctimas es porque se las enmarca como víctimas, blancos o integrantes de grupos vulnerables o protegidos que necesitan asistencia.",
      },
      {
        id: "mixed",
        label: "Mixto",
        emphasis: "Mixto",
        body: "Mixto es cuando contiene elementos explícitos tanto del marco de vulnerabilidad como del marco de agencia o de actor, dentro del mismo extracto.",
      },
    ],
  },
  categories: {
    script: "Tres marcos",
    title: "¿Cuál es el sentido que se les quiere dar a estas categorías?",
    lede: "Desplázate por las definiciones. El mosaico mantiene la categoría a la vista y deja que las otras retrocedan.",
    summary:
      "Mosaico de tres marcos: agentes, víctimas y mixto. Mientras se lee una definición, las celdas de los otros marcos se atenúan.",
    tableCaption: "Celdas del esquema, por categoría",
    steps: [
      {
        id: "agents",
        label: "Agentes",
        body: "Cuando hablamos de agentes hablamos de discursos en los que las mujeres se enmarcan como tomadoras activas de decisiones, como quienes contribuyen a la economía o como titulares de derechos por sí mismas.",
      },
      {
        id: "victims",
        label: "Víctimas",
        body: "Cuando hablamos de víctimas hablamos de discursos en los que las mujeres se enmarcan como personas que sufren un daño, necesitan protección o encarnan la inocencia, a menudo en la misma frase que los niños.",
      },
      {
        id: "mixed",
        label: "Mixto",
        body: "Cuando hablamos de mixto hablamos de discursos que usan los dos marcos a la vez: las mujeres son titulares de derechos y, en el mismo pasaje, personas a las que hay que salvar.",
      },
    ],
  },
  note: {
    title: "En la transcripción",
    lede: "Cada aparición conserva quién habla, la fecha y las palabras alrededor de la frase.",
    slug: "bosnia-and-herzegovina",
    excerpt:
      "…advancing the rights of women and children; and strengthening gender equality, better healthcare and education.",
    translation:
      "…promoviendo los derechos de las mujeres y los niños, y fortaleciendo la igualdad de género, una mejor atención de la salud y una mejor educación.",
  },
  flower: {
    script: "La proporción",
    title: "Con qué frecuencia aparece la frase",
    lede: "Cada pétalo es un discurso que menciona a las mujeres. Un sector es la frase «mujeres y niños». El resto nombra a las mujeres de otra manera.",
    summary:
      "Gráfico en flor. {phrase} pétalos para «mujeres y niños», {womenOnly} para otras menciones de mujeres, de un total de {withWomen}.",
    phraseLabel: "Mujeres y niños",
    otherLabel: "Otras menciones de mujeres",
    tableCaption:
      "Menciones de mujeres, según el discurso diga o no «mujeres y niños»",
    source: "La misma revisión que el gráfico de celdas: período de sesiones {session}.",
  },
  orientation: {
    title: "¿Cómo se orientan los discursos?",
    policyLabel: "Reforma de políticas",
    rhetoricalLabel: "Abstracto / retórico",
    policyShare: "6,3%",
    rhetoricalShare: "93,7%",
    body: "La mayoría de los discursos menciona a las mujeres y a los niños en un contexto narrativo general, sin compromisos concretos de política.",
  },
  soWhat: {
    title: "¿y qué?",
    paragraphs: [
      "Empezamos este pequeño proyecto porque, al escuchar los discursos del debate general, notamos que la frase «mujeres y niños» se mencionaba muchas veces. Nos pareció una forma anticuada de enmarcar a dos grupos con derechos, necesidades y experiencias distintas.",
      "Después de revisar la literatura académica sobre el tema, empezamos a pensar en las implicaciones de enmarcar a los niños como una extensión de los cuerpos de las mujeres, y como víctimas con necesidades similares. Al agruparlos, las mujeres pueden ser infantilizadas de forma implícita y situadas al mismo nivel que los niños, en lugar de ser reconocidas como actoras políticas y sociales autónomas.",
      "En los discursos pronunciados en la 81.ª Asamblea General, «mujeres y niños» suelen enmarcarse en términos amplios y abstractos que subrayan la vulnerabilidad, sin traducir esa preocupación en acciones concretas para avanzar en sus derechos.",
      "Este enfoque puede oscurecer las distintas necesidades, los distintos derechos y la distinta agencia de las mujeres y de los niños. En particular, impide que se reconozca a las mujeres como agentes activas de cambio y como actoras de sus propias vidas.",
    ],
  },
  closing: {
    slug: "timor-leste",
    text: "These are not abstracts. They are people, they are women and children, youth in their best years, they are parents, grandparents.",
    translation:
      "No son abstracciones. Son personas, son mujeres y niños, jóvenes en sus mejores años, son madres y padres, abuelas y abuelos.",
  },
  footer: {
    credits: [
      { role: "Diseñado por:", names: "Macarena Zappe" },
      { role: "Investigación:", names: "Macarena Zappe & Agustina Nahas" },
      { role: "Desarrollado por:", names: "Agustina Nahas" },
    ],
    bibliographyLabel: "Bibliografía:",
    bibliography,
    methodLabel: "Método",
    method:
      "Esta lectura cubre el debate general del período de sesiones {session} de la Asamblea General de las Naciones Unidas. Se revisaron {scanned} discursos. Las menciones de mujeres se leyeron en los tres marcos definidos en este sitio: agentes, víctimas y mixto. Las filas codificadas están en la base abierta.",
    citeLabel: "Cómo citar",
    cite: "Zappe, Macarena, y Agustina Nahas. {title}.",
    csvLabel: "Descargar la base (CSV)",
    databaseLabel: "Abrir base de datos",
    databaseHref,
  },
};

export default es;
