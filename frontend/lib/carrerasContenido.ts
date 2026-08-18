// Contenido enriquecido de la página de detalle de carrera.
// Este archivo es INDEPENDIENTE del backend/Prisma: la base de datos solo
// guarda (id, nombre, slug, duracionMeses, imagenUrl, descripcionCorta).
// Todo lo demás (perfil de egreso, plan de estudios, campo laboral, etc.)
// no existe como campo en el modelo Carrera, así que se define aquí como
// contenido estático, ya tipado y reutilizable para las demás carreras.
//
// Para publicar la página completa de otra carrera basta con agregar una
// nueva entrada a CARRERAS_CONTENIDO usando el mismo slug que tiene en la
// base de datos. Si un slug no tiene entrada aquí, la carrera sigue
// mostrando la ficha genérica actual (app/carreras/[slug]/page.tsx).

export interface BloqueDescripcion {
  icono: "cocina" | "cultura" | "innovacion" | "formacion" | "decoracion" | "gestion";
  titulo: string;
  texto: string;
}

export interface ModuloPlanEstudios {
  numero: number;
  nombre: string;
  duracionMeses: number;
  cursos: string[];
}

export interface CategoriaAprendizaje {
  titulo: string;
  items: string[];
}

export interface CampoLaboralItem {
  titulo: string;
  descripcion: string;
}

export interface PreguntaFrecuente {
  pregunta: string;
  respuesta: string;
}

export interface ImagenGaleria {
  src: string;
  alt: string;
}

export interface CarreraContenidoDetallado {
  slug: string;
  metaDescripcion: string;
  heroTituloLinea1: string;
  heroTituloLinea2: string;
  heroSubtitulo: string;
  heroImagen: string;
  statsRapidas: { valor: string; etiqueta: string }[];
  descripcionIntro: string;
  descripcionBloques: BloqueDescripcion[];
  queAprenderas: CategoriaAprendizaje[];
  planEstudios: ModuloPlanEstudios[];
  // Porcentaje practica/teoria: solo si la fuente oficial de la carrera lo
  // especifica (no se debe inventar). Si falta, la seccion "Aprende
  // haciendo" y los badges de porcentaje en Perfil del egresado se omiten.
  practicaPorcentaje?: number;
  teoriaPorcentaje?: number;
  aprendeHaciendoTexto?: string;
  // Especifico de carreras de cocina (ej. Gastronomia Internacional). Si no
  // aplica a la carrera, se omite y la seccion "De nuestra cocina al mundo"
  // simplemente no se renderiza (ver app/carreras/[slug]/page.tsx).
  cocinaPeruana?: string[];
  cocinaInternacional?: string[];
  perfilEgresadoTexto: string;
  perfilEgresadoCompetencias: string[];
  campoLaboral: CampoLaboralItem[];
  // Especifico de carreras cuya fuente oficial menciona explicitamente la
  // posibilidad de emprender. Si no aplica, se omite la seccion.
  emprendimientoTexto?: string;
  emprendimientoEjemplos?: string[];
  galeria: ImagenGaleria[];
  faq: PreguntaFrecuente[];
  // Nota transparente para el usuario cuando el folleto/fuente disponible
  // no cubre el 100% de lo que indica el nombre oficial de la carrera (ej.
  // duracion distinta a la de la base de datos, o un componente que falta).
  // Se muestra como un aviso discreto debajo del hero. Omitir si no aplica.
  notaPendiente?: string;
}

export const CARRERAS_CONTENIDO: Record<string, CarreraContenidoDetallado> = {
  "gastronomia-internacional": {
    slug: "gastronomia-internacional",
    metaDescripcion:
      "Estudia Gastronomía Internacional en INCA EDUCA: 12 meses de formación técnica con 70% de práctica. Conoce el plan de estudios, el perfil de egreso y el campo laboral.",
    heroTituloLinea1: "GASTRONOMÍA",
    heroTituloLinea2: "INTERNACIONAL",
    heroSubtitulo: "Convierte tu pasión por la cocina en una formación profesional.",
    heroImagen: "/carreras/gastronomia-internacional.jpg",
    statsRapidas: [
      { valor: "12", etiqueta: "Meses de duración" },
      { valor: "4", etiqueta: "Módulos" },
      { valor: "70%", etiqueta: "Práctica" },
      { valor: "30%", etiqueta: "Teoría" },
    ],
    descripcionIntro:
      "La gastronomía es un arte que permite preparar alimentos, conocer el manejo de insumos y productos de la cocina peruana e internacional, innovar e investigar las tradiciones culinarias y culturales de nuestro país y de otros.",
    descripcionBloques: [
      {
        icono: "cocina",
        titulo: "Cocina",
        texto: "Preparación de alimentos y desarrollo de técnicas culinarias.",
      },
      {
        icono: "cultura",
        titulo: "Cultura gastronómica",
        texto: "Conocimiento de las tradiciones culinarias del Perú y otros países.",
      },
      {
        icono: "innovacion",
        titulo: "Innovación",
        texto: "Desarrollo e investigación de nuevas propuestas gastronómicas.",
      },
      {
        icono: "formacion",
        titulo: "Formación profesional",
        texto: "Preparación para desenvolverse en diferentes espacios del sector gastronómico.",
      },
    ],
    queAprenderas: [
      {
        titulo: "Técnicas culinarias",
        items: ["Técnicas de corte", "Técnicas de cocción", "Mise en place", "Fondos y salsas", "Conservación de alimentos"],
      },
      {
        titulo: "Cocina peruana",
        items: ["Cocina peruana", "Cocina novoandina", "Pescados y mariscos", "Cocina regional"],
      },
      {
        titulo: "Cocina internacional",
        items: ["Cocina francesa", "Cocina española", "Cocina italiana", "Cocina mediterránea", "Cocina oriental", "Cocina latinoamericana"],
      },
      {
        titulo: "Gestión gastronómica",
        items: ["Administración de cocina", "Costos", "Presupuestos", "Compras", "Almacén", "Gestión de restaurantes"],
      },
      {
        titulo: "Formación complementaria",
        items: ["Inglés", "Computación", "Nutrición", "Marketing gastronómico", "Liderazgo", "Oratoria"],
      },
    ],
    planEstudios: [
      {
        numero: 1,
        nombre: "Cocina básica, técnicas y manipulación de alimentos",
        duracionMeses: 3,
        cursos: [
          "Introducción a la Administración de Cocina",
          "Técnicas de Gastronomía Básica",
          "Conservación de Alimentos",
          "Mise en Place",
          "Historia y Geografía Gastronómica",
          "Investigación de Cultivos",
          "Fondos y Salsas",
          "Inglés I",
          "Formación Integral",
        ],
      },
      {
        numero: 2,
        nombre: "Cocina peruana, pescados y mariscos",
        duracionMeses: 3,
        cursos: [
          "Técnica de Gastronomía Avanzada",
          "Cocina Peruana",
          "Pescados y Mariscos",
          "Costos y Presupuestos",
          "Cocina Novoandina",
          "Mantenimiento",
          "Compras y Almacén",
          "Inglés Técnico Gastronómico",
          "Computación Aplicada",
          "Liderazgo y Oratoria",
        ],
      },
      {
        numero: 3,
        nombre: "Cocina Latinoamericana",
        duracionMeses: 3,
        cursos: [
          "Cocina Turística y Latinoamericana",
          "Higiene y Seguridad Industrial",
          "Laboratorio e Investigación Gastronómica",
          "Servicio y Atención al Cliente",
          "Presentación de Mesa",
          "Decoración / Presentación de Platos",
          "Dietética y Nutrición",
          "Marketing Gastronómico",
          "Mantenimiento en Gastronomía",
          "Formación Integral",
        ],
      },
      {
        numero: 4,
        nombre: "Cocina Internacional",
        duracionMeses: 3,
        cursos: [
          "Cocina Francesa y Española",
          "Cocina Mediterránea e Italiana",
          "Cocina Naturista y Vegetariana",
          "Cocina Oriental",
          "Administración y Gestión de Restaurantes",
          "Gestión Microempresarial",
          "Inglés",
          "Computación",
          "Entorno Laboral o Clima Laboral",
        ],
      },
    ],
    practicaPorcentaje: 70,
    teoriaPorcentaje: 30,
    aprendeHaciendoTexto:
      "Desarrolla tus habilidades mediante una formación que combina conocimientos teóricos con una orientación práctica.",
    cocinaPeruana: ["Cocina Peruana", "Cocina Novoandina", "Pescados y Mariscos", "Cocina Regional"],
    cocinaInternacional: [
      "Cocina Francesa",
      "Cocina Española",
      "Cocina Mediterránea",
      "Cocina Italiana",
      "Cocina Oriental",
      "Cocina Latinoamericana",
    ],
    perfilEgresadoTexto:
      "El egresado es un técnico en la elaboración del mise en place, domina técnicas culinarias de corte, cocción, conservación de alimentos, dietética y nutrición, preparación de platos regionales, nacionales e internacionales; maneja normas de seguridad e higiene en el trabajo.",
    perfilEgresadoCompetencias: [
      "Elaboración de mise en place",
      "Técnicas culinarias de corte",
      "Técnicas de cocción",
      "Conservación de alimentos",
      "Dietética y nutrición",
      "Preparación de platos regionales",
      "Preparación de platos nacionales",
      "Preparación de platos internacionales",
      "Seguridad e higiene en el trabajo",
    ],
    campoLaboral: [
      { titulo: "Hoteles", descripcion: "Desarrollo profesional dentro del sector hotelero." },
      { titulo: "Restaurantes", descripcion: "Participación en diferentes áreas de cocina y gastronomía." },
      { titulo: "Catering", descripcion: "Desarrollo de servicios gastronómicos para eventos." },
      { titulo: "Fast Food", descripcion: "Desempeño en establecimientos de comida rápida." },
      { titulo: "Resorts", descripcion: "Oportunidades dentro de establecimientos turísticos." },
      { titulo: "Cruceros", descripcion: "Desarrollo profesional dentro del sector gastronómico de cruceros." },
      { titulo: "Emprendimiento", descripcion: "Posibilidad de desarrollar un negocio propio." },
    ],
    emprendimientoTexto:
      "La formación incluye conocimientos relacionados con gestión, costos, presupuestos, marketing gastronómico y gestión microempresarial que pueden contribuir al desarrollo de un emprendimiento gastronómico.",
    emprendimientoEjemplos: ["Restaurante", "Catering", "Negocio de comida", "Proyecto gastronómico"],
    galeria: [
      {
        src: "/carreras/gastronomia-internacional.jpg",
        alt: "Estudiantes de Gastronomía Internacional de INCA EDUCA en formación práctica",
      },
      {
        src: "/hero/carrusel-gastronomia.webp",
        alt: "Formación práctica de la carrera de Gastronomía en INCA EDUCA",
      },
    ],
    faq: [
      {
        pregunta: "¿Cuánto dura Gastronomía Internacional?",
        respuesta: "La carrera tiene una duración de 12 meses.",
      },
      {
        pregunta: "¿Cuántos módulos tiene?",
        respuesta: "La formación está organizada en 4 módulos de 3 meses cada uno.",
      },
      {
        pregunta: "¿Qué porcentaje de formación práctica tiene?",
        respuesta: "La información proporcionada indica 70% práctica y 30% teoría.",
      },
      {
        pregunta: "¿Qué aprenderé durante la carrera?",
        respuesta:
          "Aprenderás técnicas culinarias, cocina peruana e internacional, manipulación y conservación de alimentos, gestión gastronómica y competencias complementarias.",
      },
      {
        pregunta: "¿Dónde podré trabajar?",
        respuesta:
          "El campo laboral incluye hoteles, restaurantes, negocios de comida rápida, empresas de catering, resorts y cruceros, además de la posibilidad de emprender.",
      },
      {
        pregunta: "¿Qué tipo de cocina aprenderé?",
        respuesta:
          "La formación contempla cocina peruana, latinoamericana, francesa, española, mediterránea, italiana, naturista, vegetariana y oriental.",
      },
    ],
  },
  "panaderia-y-pasteleria-industrial": {
    slug: "panaderia-y-pasteleria-industrial",
    metaDescripcion:
      "Estudia Panadería y Pastelería Industrial en INCA EDUCA: 12 meses de formación técnica con 80% de práctica. Conoce el plan de estudios, el perfil de egreso y el campo laboral.",
    heroTituloLinea1: "PANADERÍA Y PASTELERÍA",
    heroTituloLinea2: "INDUSTRIAL",
    heroSubtitulo:
      "Conviértete en un experto en panes, pasteles, postres, bocaditos, chocolatería y decoración de tortas.",
    heroImagen: "/carreras/panaderia-y-pasteleria-industrial.jpg",
    statsRapidas: [
      { valor: "12", etiqueta: "Meses de duración" },
      { valor: "4", etiqueta: "Módulos" },
      { valor: "80%", etiqueta: "Práctica" },
      { valor: "20%", etiqueta: "Teoría" },
    ],
    descripcionIntro:
      "El alumno será un experto en la elaboración de las diferentes variedades de panes, pasteles, postres, bocaditos y chocolatería, y en las modernas técnicas de la decoración. La enseñanza es personalizada, aprendiendo a utilizar modernos equipos de alta tecnología en la industria de la panificación.",
    descripcionBloques: [
      {
        icono: "cocina",
        titulo: "Panadería industrial",
        texto: "Elaboración de panes y manejo de maquinaria y equipos de panificación de alta tecnología.",
      },
      {
        icono: "innovacion",
        titulo: "Pastelería y postres",
        texto: "Elaboración de pasteles, postres, bocaditos y chocolatería.",
      },
      {
        icono: "decoracion",
        titulo: "Decoración",
        texto:
          "Técnicas modernas de decoración de tortas con merengue, crema chantilly, glasé, masa elástica, azúcar y pastillaje.",
      },
      {
        icono: "formacion",
        titulo: "Formación para emprender",
        texto: "Preparación para implementar tu propio negocio o micro empresa de panificación.",
      },
    ],
    queAprenderas: [
      {
        titulo: "Técnicas de panificación",
        items: [
          "Panadería industrial",
          "Manejo de maquinaria y equipos de panificación",
          "Procesos de producción de panificación",
          "Seguridad e higiene en la industria panadera",
        ],
      },
      {
        titulo: "Pastelería",
        items: [
          "Fundamentos de pastelería",
          "Tecnología de materiales para pastelería",
          "Procesos de producción de pastelería",
          "Manejo de maquinaria y equipos de pastelería",
        ],
      },
      {
        titulo: "Postres y chocolatería",
        items: ["Bocaditos", "Postres", "Chocolatería", "Presentación de chocolates y bombones"],
      },
      {
        titulo: "Decoración de tortas",
        items: [
          "Tecnología de materiales para decoración",
          "Decoración con merengue",
          "Decoración con crema chantilly",
          "Decoración en glasé",
          "Decoración con masa elástica",
          "Azúcar y pastillaje",
        ],
      },
      {
        titulo: "Gestión y atención al cliente",
        items: [
          "Gestión comercial en panadería",
          "Costos de producción",
          "Administración de almacén",
          "Marketing",
          "Atención al cliente",
          "Gestión microempresarial",
          "Matemática aplicada",
        ],
      },
    ],
    planEstudios: [
      {
        numero: 1,
        nombre: "Panadería industrial",
        duracionMeses: 3,
        cursos: [
          "Gestión Comercial en Panadería",
          "Seguridad e Higiene en la Industria Panadera",
          "Costos de Producción",
          "Manejo de Maquinaria y Equipos de Panificación",
          "Procesos de Producción de Panificación",
          "Formación Integral",
        ],
      },
      {
        numero: 2,
        nombre: "Pastelería",
        duracionMeses: 3,
        cursos: [
          "Fundamentos de Pastelería",
          "Tecnología de Materiales para Pastelería",
          "Matemática Aplicada",
          "Administración de Almacén de Pastelería",
          "Manejo de Maquinaria y Equipos de Pastelería",
          "Procesos de Producción de Pastelería",
          "Atención al Cliente",
          "Formación Integral",
        ],
      },
      {
        numero: 3,
        nombre: "Postres, bocaditos y chocolatería",
        duracionMeses: 3,
        cursos: [
          "Bocaditos",
          "Postres",
          "Chocolatería",
          "Costos de Producción",
          "Presentación de Chocolates y Bombones",
          "Marketing",
          "Atención al Cliente",
        ],
      },
      {
        numero: 4,
        nombre: "Decoración de tortas",
        duracionMeses: 3,
        cursos: [
          "Tecnología de Materiales para Decoración",
          "Decoración con Merengue",
          "Decoración con Crema Chantilly",
          "Decoración en Glasé",
          "Decoración con Masa Elástica",
          "Azúcar y Pastillaje",
          "Gestión Microempresarial",
          "Entorno Laboral o Clima Laboral",
        ],
      },
    ],
    practicaPorcentaje: 80,
    teoriaPorcentaje: 20,
    aprendeHaciendoTexto:
      "Aprende con enseñanza personalizada, utilizando modernos equipos de alta tecnología en la industria de la panificación.",
    perfilEgresadoTexto:
      "El egresado es un experto en la elaboración de las diferentes variedades de panes, pasteles, postres, bocaditos y chocolatería, y en las modernas técnicas de decoración. El curso está diseñado tanto para quienes desean emprender su propio negocio desde casa o implementar una micro empresa, como para estudiantes de gastronomía que deseen complementar sus conocimientos.",
    perfilEgresadoCompetencias: [
      "Elaboración de panes",
      "Elaboración de pasteles",
      "Elaboración de postres y bocaditos",
      "Chocolatería",
      "Técnicas modernas de decoración de tortas",
      "Manejo de maquinaria y equipos de alta tecnología",
    ],
    campoLaboral: [
      { titulo: "Panificadoras", descripcion: "Desarrollo profesional en la producción y gestión de panificadoras." },
      { titulo: "Hoteles", descripcion: "Desarrollo profesional dentro del sector hotelero." },
      { titulo: "Restaurantes", descripcion: "Participación en áreas de panadería y pastelería dentro de restaurantes." },
      { titulo: "Cafeterías", descripcion: "Elaboración y gestión de productos de panadería y pastelería." },
      { titulo: "Catering", descripcion: "Desarrollo de servicios de panadería y pastelería para eventos." },
      { titulo: "Resorts", descripcion: "Oportunidades dentro de establecimientos turísticos." },
      { titulo: "Cruceros", descripcion: "Desarrollo profesional dentro del sector de panadería y pastelería en cruceros." },
      { titulo: "Emprendimiento", descripcion: "Posibilidad de emprender tu propio negocio desde casa o como micro empresa." },
    ],
    emprendimientoTexto:
      "El curso está diseñado para las personas que desean emprender su propio negocio desde casa o implementar una micro empresa, incluyendo conocimientos de costos, marketing y gestión microempresarial.",
    emprendimientoEjemplos: ["Panadería", "Pastelería", "Repostería", "Negocio desde casa"],
    galeria: [
      {
        src: "/carreras/panaderia-y-pasteleria-industrial.jpg",
        alt: "Estudiantes de Panadería y Pastelería Industrial de INCA EDUCA en formación práctica",
      },
      {
        src: "/hero/carrusel-panaderia-pasteleria.webp",
        alt: "Formación práctica de la carrera de Panadería y Pastelería en INCA EDUCA",
      },
    ],
    faq: [
      {
        pregunta: "¿Cuánto dura Panadería y Pastelería Industrial?",
        respuesta: "La carrera tiene una duración de 12 meses.",
      },
      {
        pregunta: "¿Cuántos módulos tiene?",
        respuesta: "La formación está organizada en 4 módulos de 3 meses cada uno.",
      },
      {
        pregunta: "¿Qué porcentaje de formación práctica tiene?",
        respuesta: "La información proporcionada indica 80% práctica y 20% teoría.",
      },
      {
        pregunta: "¿Qué aprenderé durante la carrera?",
        respuesta:
          "Aprenderás panadería industrial, pastelería, elaboración de postres, bocaditos y chocolatería, además de técnicas de decoración de tortas y gestión del negocio.",
      },
      {
        pregunta: "¿Dónde podré trabajar?",
        respuesta:
          "El campo laboral incluye panificadoras, hoteles, restaurantes, cafeterías, empresas de catering, resorts y cruceros, además de la posibilidad de emprender tu propio negocio.",
      },
      {
        pregunta: "¿También sirve como complemento si ya estudio gastronomía?",
        respuesta:
          "Sí, la formación también está pensada para los estudiantes de gastronomía que deseen complementar sus conocimientos.",
      },
    ],
  },
  "hosteleria-y-turismo": {
    slug: "hosteleria-y-turismo",
    metaDescripcion:
      "Estudia Hotelería y Turismo (Administración Hostelera) en INCA EDUCA: 12 meses de formación técnica en Reservas y Counter, Recepción, Housekeeping y Bar y Comedor.",
    heroTituloLinea1: "HOTELERÍA Y",
    heroTituloLinea2: "TURISMO",
    heroSubtitulo:
      "Fórmate en Administración Hostelera: gestiona Reservas, Recepción, Housekeeping y Bar y Comedor.",
    heroImagen: "/carreras/hosteleria-y-turismo.jpg",
    statsRapidas: [
      { valor: "12", etiqueta: "Meses de duración" },
      { valor: "4", etiqueta: "Módulos" },
    ],
    descripcionIntro:
      "El egresado es un profesional que reconoce la importancia del turismo y está preparado para implementar las técnicas adecuadas para realizar una eficiente administración en cualquier empresa hotelera; además conoce el sistema turístico y la hotelería, los tipos de empresas hoteleras y comprende la importancia de la administración para el éxito de un hotel.",
    descripcionBloques: [
      {
        icono: "gestion",
        titulo: "Administración hotelera",
        texto: "Implementación de técnicas para una eficiente administración en cualquier empresa hotelera.",
      },
      {
        icono: "cultura",
        titulo: "Turismo",
        texto: "Conocimiento del sistema turístico y los tipos de empresas hoteleras.",
      },
      {
        icono: "formacion",
        titulo: "Recepción y housekeeping",
        texto: "Manejo de sistemas y procedimientos en Reservas, Recepción y Housekeeping.",
      },
      {
        icono: "cocina",
        titulo: "Bar y comedor",
        texto: "Técnicas de atención del servicio en el área de Bar y Comedor.",
      },
    ],
    queAprenderas: [
      {
        titulo: "Turismo y counter",
        items: [
          "Administración de empresas turísticas",
          "Fundamentos del turismo y la hostelería",
          "Legislación turística",
          "Agencias de viajes y turismo",
          "Counter turístico",
          "Información turística del Perú y regional",
        ],
      },
      {
        titulo: "Recepción y reservas",
        items: [
          "Técnicas de recepción",
          "Documentación mercantil hotelera",
          "Organización de eventos y protocolo",
          "Marketing turístico",
        ],
      },
      {
        titulo: "Housekeeping (pisos y lavandería)",
        items: [
          "Tecnología de pisos",
          "Preparación de habitaciones",
          "Preparación de áreas complementarias",
          "Control y gestión del mantenimiento hotelero",
          "Compras y manejo de stock",
        ],
      },
      {
        titulo: "Bar y comedor",
        items: [
          "Tecnología de comedor",
          "Tecnología de bar",
          "Preparación de bebidas frías y calientes",
          "Preparación de cócteles y tragos",
          "Diseño de cartas y menús",
        ],
      },
      {
        titulo: "Gestión y atención al cliente",
        items: [
          "Técnicas de atención al cliente",
          "Etiqueta y protocolo",
          "Primeros auxilios",
          "Seguridad e higiene de personal",
          "Costos y presupuestos",
          "Gestión microempresarial",
          "Liderazgo y valores",
          "Inglés aplicado y computación",
        ],
      },
    ],
    planEstudios: [
      {
        numero: 1,
        nombre: "Reservas y Counter Turístico",
        duracionMeses: 3,
        cursos: [
          "Administración de Empresas Turísticas",
          "Técnicas de Atención al Cliente",
          "Fundamentos del Turismo y la Hostelería",
          "Legislación Turística",
          "Agencias de Viajes y Turismo",
          "Counter Turístico",
          "Etiqueta Personal",
          "Inglés Básico",
          "Computación Aplicada a la Administración",
          "Formación Integral I",
        ],
      },
      {
        numero: 2,
        nombre: "Gestión de Recepción y Reservas",
        duracionMeses: 3,
        cursos: [
          "Técnicas de Recepción",
          "Primeros Auxilios",
          "Documentación Mercantil Hotelera",
          "Organización de Eventos - Etiqueta y Protocolo",
          "Marketing Turístico",
          "Información Turística del Perú",
          "Inglés para Recepción y Reservas",
          "Computación",
          "Liderazgo y Valores",
        ],
      },
      {
        numero: 3,
        nombre: "Administración de Pisos y Lavandería (Housekeeping)",
        duracionMeses: 3,
        cursos: [
          "Tecnología de Pisos",
          "Preparación de Habitaciones",
          "Preparación de Áreas Complementarias",
          "Control y Gestión del Mantenimiento Hotelero",
          "Compras y Manejo de Stock (Almacén)",
          "Seguridad e Higiene de Personal",
          "Computación para Housekeeping",
          "Inglés Técnico para Housekeeping",
          "Información Turística Regional",
          "Formación Integral",
        ],
      },
      {
        numero: 4,
        nombre: "Bar y Comedor",
        duracionMeses: 3,
        cursos: [
          "Tecnología de Comedor",
          "Preparación de Bebidas Frías y Calientes",
          "Tecnología de Bar",
          "Gestión Microempresarial",
          "Preparación de Cócteles y Tragos",
          "Diseño de Cartas y Menús",
          "Costos y Presupuestos",
          "Entorno Laboral",
        ],
      },
    ],
    // La fuente oficial de esta carrera no especifica un porcentaje de
    // practica/teoria (a diferencia de Gastronomia y Panaderia), asi que no
    // se inventa uno: se omite practicaPorcentaje/teoriaPorcentaje y la
    // seccion "Aprende haciendo" no se renderiza para esta carrera.
    perfilEgresadoTexto:
      "El egresado es un profesional que reconoce la importancia del turismo y está preparado para implementar las técnicas adecuadas para realizar una eficiente administración en cualquier empresa hotelera. Conoce y utiliza los sistemas y procedimientos empleados en el área de Reservas y Counter, Gestión de Recepción y Reservas, manejo y gestión del área de Housekeeping, y las técnicas de atención del servicio en el área de Bar y Comedor.",
    perfilEgresadoCompetencias: [
      "Administración eficiente de empresas hoteleras",
      "Conocimiento del sistema turístico y la hotelería",
      "Gestión de Reservas y Counter",
      "Gestión de Recepción y Reservas",
      "Manejo y gestión del área de Housekeeping",
      "Técnicas de atención en el área de Bar y Comedor",
    ],
    campoLaboral: [
      {
        titulo: "Empresas Hoteleras",
        descripcion: "Administración eficiente en cualquier tipo de empresa hotelera.",
      },
      {
        titulo: "Empresas Turísticas",
        descripcion: "Desempeño dentro del sector turístico, especialmente en la Ciudad del Cusco.",
      },
      {
        titulo: "Recepción y Reservas",
        descripcion: "Gestión de Reservas, Counter Turístico y Recepción.",
      },
      {
        titulo: "Housekeeping",
        descripcion: "Administración de Pisos y Lavandería: manejo y gestión del área de Housekeeping.",
      },
      {
        titulo: "Bar y Comedor",
        descripcion: "Técnicas de atención y servicio en el área de Bar y Comedor.",
      },
      {
        titulo: "Administración Hotelera",
        descripcion: "Desempeño como asistente y/o responsable de la administración hotelera.",
      },
    ],
    // La fuente oficial de esta carrera no menciona explicitamente la
    // posibilidad de emprender (a diferencia de Gastronomia y Panaderia),
    // asi que se omite emprendimientoTexto/emprendimientoEjemplos y la
    // seccion de emprendimiento no se renderiza para esta carrera.
    galeria: [
      {
        src: "/carreras/hosteleria-y-turismo.jpg",
        alt: "Estudiantes de Hotelería y Turismo de INCA EDUCA en formación práctica",
      },
      {
        src: "/hero/carrusel-hoteleria-turismo.webp",
        alt: "Formación práctica de la carrera de Hotelería y Turismo en INCA EDUCA",
      },
    ],
    faq: [
      {
        pregunta: "¿Cuánto dura Hotelería y Turismo?",
        respuesta: "La carrera tiene una duración de 12 meses.",
      },
      {
        pregunta: "¿Cuántos módulos tiene?",
        respuesta: "La formación está organizada en 4 módulos de 3 meses cada uno.",
      },
      {
        pregunta: "¿Qué aprenderé durante la carrera?",
        respuesta:
          "Aprenderás Reservas y Counter Turístico, Gestión de Recepción y Reservas, Administración de Pisos y Lavandería (Housekeeping), y Bar y Comedor.",
      },
      {
        pregunta: "¿Dónde podré trabajar?",
        respuesta:
          "El campo laboral incluye empresas del sector turístico y hotelero, donde podrás desempeñarte como asistente o responsable de la administración, en las áreas de Recepción y Reservas, Housekeeping y Bar y Comedor.",
      },
      {
        pregunta: "¿Qué es la Administración Hostelera?",
        respuesta:
          "Es la carrera que te prepara para implementar una eficiente administración en cualquier empresa hotelera, conociendo el sistema turístico y los procedimientos de sus principales áreas.",
      },
      {
        pregunta: "¿Dónde hay mayor oportunidad laboral para esta carrera?",
        respuesta:
          "La Hotelería y el Turismo son especialmente importantes en la Ciudad del Cusco, lo que representa una oportunidad de campo laboral en la zona.",
      },
    ],
  },
  "apoyo-administrativo": {
    slug: "apoyo-administrativo",
    // NOTA: el folleto fuente es el programa legado "Asistente Administrativo,
    // Logistica y Almacen", que combinaba 4 bloques (Asistente de Oficina,
    // Asistente Administrativo, Computacion Win Office System y Logistica y
    // Almacen). En la oferta vigente esos bloques corresponden a carreras
    // independientes. Por decision explicita del usuario, esta pagina usa
    // UNICAMENTE los modulos 1 y 2 (Asistente de Oficina + Asistente
    // Administrativo), con una duracion de 6 meses (2 x 3 meses) segun el
    // propio desglose del folleto. Los bloques de Computacion y de Logistica
    // y Almacen quedan reservados para las paginas de esas otras carreras.
    metaDescripcion:
      "Estudia Apoyo Administrativo en INCA EDUCA: formación técnica en Asistente de Oficina y Asistente Administrativo, con redacción comercial, atención al cliente y herramientas informáticas de oficina.",
    heroTituloLinea1: "APOYO",
    heroTituloLinea2: "ADMINISTRATIVO",
    heroSubtitulo:
      "Fórmate para organizar, mantener y controlar el flujo documentario de una oficina.",
    heroImagen: "/carreras/apoyo-administrativo.jpg",
    statsRapidas: [
      { valor: "6", etiqueta: "Meses de duración" },
      { valor: "2", etiqueta: "Módulos" },
    ],
    descripcionIntro:
      "El egresado es un profesional calificado para organizar, mantener y controlar el flujo de documentos de una oficina, y para redactar documentos de correspondencia comercial y mercantil, haciendo uso de paquetes informáticos.",
    descripcionBloques: [
      {
        icono: "gestion",
        titulo: "Asistente de oficina",
        texto: "Organización, mantenimiento y control del flujo documentario de una oficina.",
      },
      {
        icono: "formacion",
        titulo: "Redacción y correspondencia",
        texto: "Redacción de documentos de correspondencia comercial y mercantil.",
      },
      {
        icono: "cultura",
        titulo: "Atención y protocolo",
        texto: "Protocolo, relaciones públicas, organización de eventos y atención al cliente.",
      },
      {
        icono: "innovacion",
        titulo: "Herramientas informáticas",
        texto: "Manejo de paquetes informáticos aplicados a la gestión de oficina.",
      },
    ],
    queAprenderas: [
      {
        titulo: "Gestión documentaria y de oficina",
        items: [
          "Imagen ejecutiva y técnicas de protocolo",
          "Producción de textos",
          "Administración de archivos",
          "Administración de oficinas y logística",
          "Transcripción y producción de textos",
        ],
      },
      {
        titulo: "Redacción y comunicación comercial",
        items: ["Redacción comercial básica", "Redacción comercial y administrativa", "Digitación básica I y II"],
      },
      {
        titulo: "Atención y gestión empresarial",
        items: [
          "Protocolo, relaciones públicas y organización de eventos",
          "Servicio y atención al cliente",
          "Gestión empresarial",
          "Marketing empresarial",
        ],
      },
      {
        titulo: "Fundamentos contables y numéricos",
        items: ["Matemática básica", "Contabilidad básica"],
      },
      {
        titulo: "Formación complementaria",
        items: ["Inglés I y II", "Liderazgo y valores", "Formación integral", "Computación I y II Win Office System"],
      },
    ],
    planEstudios: [
      {
        numero: 1,
        nombre: "Asistente de Oficina",
        duracionMeses: 3,
        cursos: [
          "Imagen Ejecutiva y Técnicas de Protocolo",
          "Producción de Textos",
          "Digitación Básica I",
          "Matemática Básica",
          "Redacción Comercial Básica",
          "Administración de Archivos",
          "Computación I Win Office System",
          "Administración de Oficinas y Logística",
          "Inglés I",
          "Formación Integral",
        ],
      },
      {
        numero: 2,
        nombre: "Asistente Administrativo",
        duracionMeses: 3,
        cursos: [
          "Protocolo, Relaciones Públicas y Organización de Eventos",
          "Marketing Empresarial",
          "Redacción Comercial y Administrativa",
          "Contabilidad Básica",
          "Digitación Básica II",
          "Servicio y Atención al Cliente",
          "Transcripción y Producción de Textos II",
          "Gestión Empresarial",
          "Inglés Básico II",
          "Liderazgo y Valores",
          "Computación II Win Office System",
        ],
      },
    ],
    // La fuente no especifica un porcentaje practica/teoria para esta
    // carrera: se omite en vez de inventarlo.
    perfilEgresadoTexto:
      "El egresado está calificado para organizar, mantener y controlar el flujo de documentos de una oficina, y para redactar documentos de correspondencia comercial y mercantil haciendo uso de paquetes informáticos.",
    perfilEgresadoCompetencias: [
      "Organización del flujo documentario de una oficina",
      "Redacción de correspondencia comercial y mercantil",
      "Manejo de paquetes informáticos de oficina",
      "Atención al cliente y protocolo",
      "Organización de eventos y relaciones públicas",
      "Gestión empresarial básica",
    ],
    campoLaboral: [
      {
        titulo: "Gobiernos Regionales",
        descripcion: "Apoyo administrativo y gestión documentaria en instituciones públicas regionales.",
      },
      {
        titulo: "Municipalidades",
        descripcion: "Organización y control del flujo documentario en gobiernos locales.",
      },
      {
        titulo: "Proyectos Especiales",
        descripcion: "Soporte administrativo en proyectos especiales del sector público.",
      },
      {
        titulo: "Entidades Financieras",
        descripcion: "Redacción y gestión de documentación comercial en el sector financiero.",
      },
      {
        titulo: "Agencias de Turismo",
        descripcion: "Apoyo administrativo y atención en agencias de turismo.",
      },
      {
        titulo: "Empresa Privada",
        descripcion: "Desempeño como asistente administrativo en cualquier empresa privada.",
      },
    ],
    // La fuente no menciona explicitamente la posibilidad de emprender para
    // esta carrera: se omite la seccion en vez de inventarla.
    galeria: [
      {
        src: "/carreras/apoyo-administrativo.jpg",
        alt: "Estudiante de Apoyo Administrativo de INCA EDUCA en formación práctica",
      },
    ],
    faq: [
      {
        pregunta: "¿Cuánto dura Apoyo Administrativo?",
        respuesta:
          "Los módulos de Asistente de Oficina y Asistente Administrativo tienen una duración de 3 meses cada uno, 6 meses en total.",
      },
      {
        pregunta: "¿Cuántos módulos tiene?",
        respuesta: "La formación está organizada en 2 módulos de 3 meses cada uno: Asistente de Oficina y Asistente Administrativo.",
      },
      {
        pregunta: "¿Qué aprenderé durante la carrera?",
        respuesta:
          "Aprenderás a organizar y controlar el flujo documentario de una oficina, redactar correspondencia comercial y administrativa, atención al cliente, protocolo y herramientas informáticas de oficina.",
      },
      {
        pregunta: "¿Dónde podré trabajar?",
        respuesta:
          "El campo laboral incluye instituciones públicas como Gobiernos Regionales, Municipalidades y Proyectos Especiales, además de entidades financieras, agencias de turismo y toda empresa privada.",
      },
      {
        pregunta: "¿Esta carrera incluye Logística y Almacén o Computación?",
        respuesta:
          "No; Logística y Almacén y Computación son carreras independientes en INCA EDUCA, con su propio plan de estudios.",
      },
    ],
  },
  "cosmetologia-y-estetica-personal": {
    slug: "cosmetologia-y-estetica-personal",
    // NOTA: el nombre oficial de esta carrera en la base de datos es
    // "Cosmetologia y Barberia" (duracion registrada: 16 meses), pero el
    // folleto disponible solo cubre el componente de "Cosmetologia y
    // Estetica Personal" (4 modulos, 12 meses) y no incluye contenido
    // especifico de Barberia. Por decision explicita del usuario, esta
    // pagina usa unicamente lo que trae el folleto (12 meses) y deja una
    // nota visible (notaPendiente) explicando el componente que falta.
    metaDescripcion:
      "Estudia Cosmetología y Estética Personal en INCA EDUCA: 12 meses de formación técnica en corte, peinado, maquillaje, ondulaciones, laceados y colorimetría.",
    heroTituloLinea1: "COSMETOLOGÍA Y",
    heroTituloLinea2: "ESTÉTICA PERSONAL",
    heroSubtitulo: "Desarrolla el arte de la belleza: corte, peinado, coloración, tratamientos y estética personal.",
    heroImagen: "/carreras/cosmetologia-y-estetica-personal.jpg",
    statsRapidas: [
      { valor: "12", etiqueta: "Meses de duración" },
      { valor: "4", etiqueta: "Módulos" },
    ],
    descripcionIntro:
      "La profesional en Cosmetología y Estética Personal desempeña el arte de la belleza a través de la oferta de sus servicios en diferentes campos por su carácter múltiple: Corte, Peinados, Ondulaciones y laceado, Tintes (técnicas en colorimetría), Tratamiento Capilar, Tratamiento Facial, Depilación, Estética Corporal, Maquillaje, Manicure y Pedicure.",
    descripcionBloques: [
      {
        icono: "decoracion",
        titulo: "Corte y peinado",
        texto: "Técnicas de corte, peinado, ondulaciones y laceado del cabello.",
      },
      {
        icono: "innovacion",
        titulo: "Colorimetría y tratamientos",
        texto: "Tintes, técnicas de colorimetría, tratamiento capilar y facial.",
      },
      {
        icono: "formacion",
        titulo: "Estética y belleza integral",
        texto: "Depilación, estética corporal, maquillaje, manicure y pedicure.",
      },
      {
        icono: "gestion",
        titulo: "Producción y gestión",
        texto: "Elaboración de productos de posticería y cosmética, y gestión de pequeñas y medianas empresas.",
      },
    ],
    queAprenderas: [
      {
        titulo: "Corte y tratamiento capilar",
        items: ["Lavado de cabello", "Tratamiento capilar", "Corte de cabello", "Depilaciones"],
      },
      {
        titulo: "Peinado y maquillaje",
        items: [
          "Peinados para novias, quinceañeras y ocasiones",
          "Maquillaje",
          "Tratamientos faciales",
          "Cepillado de cabello",
        ],
      },
      {
        titulo: "Ondulaciones, laceados y manicure",
        items: ["Ondulación del cabello", "Laceado del cabello", "Manicure y tratamiento de manos"],
      },
      {
        titulo: "Colorimetría",
        items: [
          "Decoloración y tinturación del cabello",
          "Técnicas para rayos, lazos y high light",
          "Aclaración de vellos",
        ],
      },
      {
        titulo: "Gestión y formación complementaria",
        items: [
          "Atención al cliente",
          "Marketing empresarial",
          "Gestión microempresarial",
          "Proyecto de producción",
          "Liderazgo y oratoria",
          "Mantenimiento e inglés",
        ],
      },
    ],
    planEstudios: [
      {
        numero: 1,
        nombre: "Técnicas en Corte y Tratamiento Capilar",
        duracionMeses: 3,
        cursos: [
          "Lavado de Cabello",
          "Talleres de Tratamiento Capilar",
          "Corte de Cabello, Depilaciones",
          "Formas",
          "Técnicas de Tratamiento Capilar",
          "Proyecto de Producción",
          "Atención al Cliente",
          "Formación Integral",
        ],
      },
      {
        numero: 2,
        nombre: "Técnicas en Peinado y Maquillaje",
        duracionMeses: 3,
        cursos: [
          "Organización de los Servicios para Peinados y Cepillados",
          "Peinados para Novias, Quinceañeras y Ocasiones",
          "Maquillaje, Tratamientos Faciales",
          "Cepillado en Cabellos Cortos y Cabellos Largos",
          "Proyecto de Producción",
          "Mantenimiento / Inglés",
          "Liderazgo y Oratoria",
        ],
      },
      {
        numero: 3,
        nombre: "Técnicas en Ondulaciones y Laceados",
        duracionMeses: 3,
        cursos: [
          "Técnicas y Materiales para la Ondulación del Cabello",
          "Técnica de Laceado del Cabello de Manera Eficiente",
          "Marketing Empresarial",
          "Manicure, Tratamiento de Manos",
          "Proyecto de Producción",
          "Atención al Cliente",
        ],
      },
      {
        numero: 4,
        nombre: "Técnicas en Colorimetría",
        duracionMeses: 3,
        cursos: [
          "Decoloración y Tinturación del Cabello",
          "Técnica de Decoloración y Tinturación del Cabello de Manera Eficiente",
          "Aclaración de Vellos de Manera Eficiente",
          "Técnicas para Rayos, Lazos y High Light en el Cabello",
          "Gestión Microempresarial",
          "Proyecto Productivo",
        ],
      },
    ],
    // La fuente no especifica un porcentaje practica/teoria para esta
    // carrera: se omite en vez de inventarlo.
    perfilEgresadoTexto:
      "La profesional en Cosmetología y Estética Personal desempeña el arte de la belleza a través de sus servicios en Corte, Peinados, Ondulaciones y laceado, Tintes (técnicas en colorimetría), Tratamiento Capilar, Tratamiento Facial, Depilación, Estética Corporal, Maquillaje, Manicure y Pedicure; además de la producción de bienes en Posticería (pelucas, pestañas, etc.) y la elaboración de productos como cera depiladora, pastas y mascarillas, aplicando técnicas y procedimientos eficaces, así como la gestión de pequeñas y medianas empresas.",
    perfilEgresadoCompetencias: [
      "Corte de cabello",
      "Peinados y cepillado",
      "Ondulaciones y laceado",
      "Colorimetría y tinturación",
      "Tratamiento capilar y facial",
      "Depilación y estética corporal",
      "Maquillaje",
      "Manicure y pedicure",
      "Posticería (pelucas, pestañas)",
      "Elaboración de productos cosméticos",
      "Gestión de pequeñas y medianas empresas",
    ],
    campoLaboral: [
      {
        titulo: "Salón de Belleza",
        descripcion: "Posibilidad de emprender tu propio salón de belleza.",
      },
      {
        titulo: "Spas",
        descripcion: "Oportunidades laborales en modernos spas privados.",
      },
      {
        titulo: "Centros de Estética",
        descripcion: "Desempeño en centros de estética privados.",
      },
    ],
    emprendimientoTexto:
      "La formación incluye gestión de pequeñas y medianas empresas, lo que puede contribuir a emprender tu propio salón de belleza.",
    emprendimientoEjemplos: ["Salón de belleza", "Spa", "Centro de estética", "Servicio de posticería"],
    galeria: [
      {
        src: "/carreras/cosmetologia-y-estetica-personal.jpg",
        alt: "Estudiante de Cosmetología y Estética Personal de INCA EDUCA en formación práctica",
      },
      {
        src: "/hero/carrusel-barberia-cosmetologia.webp",
        alt: "Formación práctica de la carrera de Cosmetología en INCA EDUCA",
      },
    ],
    faq: [
      {
        pregunta: "¿Cuánto dura Cosmetología y Estética Personal?",
        respuesta: "Este plan de estudios tiene una duración de 12 meses (4 módulos de 3 meses cada uno).",
      },
      {
        pregunta: "¿Cuántos módulos tiene?",
        respuesta:
          "4 módulos: Técnicas en Corte y Tratamiento Capilar, Técnicas en Peinado y Maquillaje, Técnicas en Ondulaciones y Laceados, y Técnicas en Colorimetría.",
      },
      {
        pregunta: "¿Qué aprenderé durante la carrera?",
        respuesta:
          "Aprenderás corte, peinado, maquillaje, ondulaciones, laceados, colorimetría, tratamientos capilares y faciales, depilación, manicure y pedicure, además de gestión de pequeñas y medianas empresas.",
      },
      {
        pregunta: "¿Dónde podré trabajar?",
        respuesta: "Puedes emprender tu propio salón de belleza, o trabajar en modernos spas y centros de estética privados.",
      },
      {
        pregunta: "¿Esta carrera incluye Barbería?",
        respuesta:
          "Este plan de estudios corresponde al componente de Cosmetología y Estética Personal. El componente específico de Barbería está pendiente de que la institución confirme su contenido.",
      },
    ],
    notaPendiente:
      "Esta página cubre el componente de Cosmetología y Estética Personal (12 meses). El componente de Barbería, incluido en el nombre oficial de la carrera, está pendiente de que la institución proporcione su plan de estudios para completarlo.",
  },
  "logistica-y-almacen": {
    slug: "logistica-y-almacen",
    // NOTA: la fuente disponible es el bloque "Modulo 1 y 2: LOGISTICA Y
    // ALMACEN" del folleto legado "Asistente Administrativo, Logistica y
    // Almacen", que trae su propia duracion explicita de 5 meses (no se
    // divide en dos modulos numerados con cursos separados: el folleto
    // presenta un unico listado de cursos bajo ese bloque). La base de
    // datos registra 12 meses para esta carrera. Se usa el dato confirmado
    // por la fuente (5 meses) y se deja notaPendiente explicando la
    // diferencia, en vez de inventar meses o modulos adicionales.
    metaDescripcion:
      "Estudia Logística y Almacén en INCA EDUCA: formación técnica en gestión de almacenes, inventarios y contrataciones del Estado.",
    heroTituloLinea1: "LOGÍSTICA Y",
    heroTituloLinea2: "ALMACÉN",
    heroSubtitulo: "Gestiona almacenes, inventarios y procesos de contrataciones y adquisiciones.",
    heroImagen: "/carreras/logistica-y-almacen.jpg",
    statsRapidas: [
      { valor: "5", etiqueta: "Meses de duración" },
      { valor: "1", etiqueta: "Módulo" },
    ],
    descripcionIntro:
      "El profesional en Logística y Almacén recibe amplia formación teórica y práctica en torno a las normas legales de la Ley de Contrataciones y Adquisiciones del Estado, procesos de licitación pública, cotizaciones, requerimientos de bienes y servicios, y manejo de órdenes de compra.",
    descripcionBloques: [
      {
        icono: "gestion",
        titulo: "Organización de almacén",
        texto: "Documentación, organización, salida y rotación de productos en almacén.",
      },
      {
        icono: "innovacion",
        titulo: "Sistemas e inventarios",
        texto: "Registro manual y digital de stock, sistemas informatizados de almacén e inventarios.",
      },
      {
        icono: "formacion",
        titulo: "Contrataciones del Estado",
        texto: "Normas legales de la Ley de Contrataciones y Adquisiciones, procesos de licitación y adjudicación.",
      },
      {
        icono: "cultura",
        titulo: "Logística empresarial",
        texto: "Logística en empresas, cotizaciones, requerimientos de bienes y servicios y órdenes de compra.",
      },
    ],
    queAprenderas: [
      {
        titulo: "Gestión de almacén",
        items: [
          "Documentación de almacenes",
          "Organización del almacén",
          "Salida y rotación de productos",
          "Registros manual y digital de stock (Kardex)",
        ],
      },
      {
        titulo: "Sistemas e inventarios",
        items: [
          "Sistema informatizado de almacenes",
          "Inventarios",
          "Métodos de valuación",
          "Códigos de los bienes y existencias",
        ],
      },
      {
        titulo: "Contrataciones y adquisiciones del Estado",
        items: [
          "Reglamento de la Ley de Contrataciones y Adquisiciones del Estado",
          "Procesos de adjudicación",
          "Cotizaciones, requerimientos de bienes y servicios",
          "Órdenes de compra",
        ],
      },
      {
        titulo: "Logística empresarial y fundamentos",
        items: ["Logística en empresas", "Matemática básica", "Formato Kardex"],
      },
    ],
    planEstudios: [
      {
        numero: 1,
        nombre: "Logística y Almacén",
        duracionMeses: 5,
        cursos: [
          "Documentación de Almacenes",
          "Organización del Almacén",
          "Salida y Rotación de Productos",
          "Registros Manual y Digital de Stock de Mercadería",
          "Sistema Informatizado de Almacenes",
          "Inventarios",
          "Matemática Básica",
          "Formato Kardex",
          "Logística en Empresas",
          "Métodos de Valuación",
          "Procesos de Adjudicación",
          "Cotizaciones, Requerimientos de Bienes y Servicios",
          "Reglamento de la Ley de Contrataciones y Adquisiciones del Estado",
          "Los Códigos de los Bienes y Existencias",
          "Órdenes de Compras",
        ],
      },
    ],
    // La fuente no especifica un porcentaje practica/teoria para esta
    // carrera: se omite en vez de inventarlo.
    perfilEgresadoTexto:
      "El egresado recibe amplia formación teórica y práctica en torno a las normas legales de la Ley de Contrataciones y Adquisiciones del Estado, procesos de licitación pública, cotizaciones, requerimientos de bienes y servicios, y manejo de órdenes de compra, además de la documentación, organización y control de almacenes.",
    perfilEgresadoCompetencias: [
      "Documentación y organización de almacenes",
      "Registro manual y digital de stock (Kardex)",
      "Manejo de sistemas informatizados de almacén",
      "Inventarios y métodos de valuación",
      "Procesos de adjudicación y licitación pública",
      "Cotizaciones y requerimientos de bienes y servicios",
      "Conocimiento de la Ley de Contrataciones y Adquisiciones del Estado",
      "Manejo de órdenes de compra",
    ],
    campoLaboral: [
      {
        titulo: "Gobiernos Regionales",
        descripcion: "Gestión logística y de almacén en instituciones públicas regionales.",
      },
      {
        titulo: "Municipalidades",
        descripcion: "Procesos de adquisición y control de almacén en gobiernos locales.",
      },
      {
        titulo: "Proyectos Especiales",
        descripcion: "Logística y abastecimiento en proyectos especiales del sector público.",
      },
      {
        titulo: "Entidades Financieras",
        descripcion: "Gestión de almacén e inventarios en el sector financiero.",
      },
      {
        titulo: "Agencias de Turismo",
        descripcion: "Logística y control de stock en agencias de turismo.",
      },
      {
        titulo: "Empresa Privada",
        descripcion: "Gestión logística y de almacén en cualquier empresa privada.",
      },
    ],
    galeria: [
      {
        src: "/carreras/logistica-y-almacen.jpg",
        alt: "Estudiante de Logística y Almacén de INCA EDUCA en formación práctica",
      },
    ],
    faq: [
      {
        pregunta: "¿Cuánto dura Logística y Almacén?",
        respuesta:
          "El material disponible confirma 5 meses de formación en Logística y Almacén. La duración total oficial de la carrera está pendiente de confirmación por la institución.",
      },
      {
        pregunta: "¿Qué aprenderé durante la carrera?",
        respuesta:
          "Aprenderás documentación y organización de almacenes, inventarios, sistemas informatizados, y los procesos de la Ley de Contrataciones y Adquisiciones del Estado.",
      },
      {
        pregunta: "¿Dónde podré trabajar?",
        respuesta:
          "El campo laboral incluye instituciones públicas como Gobiernos Regionales, Municipalidades y Proyectos Especiales, además de entidades financieras, agencias de turismo y toda empresa privada.",
      },
      {
        pregunta: "¿Qué es la Ley de Contrataciones y Adquisiciones del Estado?",
        respuesta:
          "Es el marco legal que regula los procesos de compras y contrataciones públicas, uno de los ejes centrales de esta carrera.",
      },
      {
        pregunta: "¿Esta carrera incluye Apoyo Administrativo o Computación?",
        respuesta:
          "No; Apoyo Administrativo y Computación son carreras independientes en INCA EDUCA, con su propio plan de estudios.",
      },
    ],
    notaPendiente:
      "Esta página muestra el módulo de Logística y Almacén confirmado en el material disponible (5 meses). La base de datos registra 12 meses para esta carrera; la institución debe confirmar si existen módulos adicionales para completarla.",
  },
  "operador-de-computadoras": {
    slug: "operador-de-computadoras",
    // NOTA: la fuente disponible es el bloque "Modulo 1: COMPUTACION WIN
    // OFFICE SISTEM" del mismo folleto legado. Es un unico modulo (8 items),
    // sin una duracion propia indicada en ese bloque especifico; se usa la
    // convencion "3 meses por modulo" que el propio folleto declara para
    // todos sus modulos. El seed.ts del proyecto ya documenta que los 12
    // meses registrados en la base de datos para esta carrera fueron una
    // duracion ASUMIDA, pendiente de confirmar con direccion academica — no
    // se inventan mas meses ni modulos aqui.
    metaDescripcion:
      "Estudia Computación e Informática en INCA EDUCA: manejo de Windows y el paquete Microsoft Office aplicado al trabajo de oficina.",
    heroTituloLinea1: "COMPUTACIÓN E",
    heroTituloLinea2: "INFORMÁTICA",
    heroSubtitulo: "Fórmate en el manejo de herramientas ofimáticas esenciales para cualquier oficina.",
    heroImagen: "/carreras/operador-de-computadoras.jpg",
    statsRapidas: [
      { valor: "3", etiqueta: "Meses de duración" },
      { valor: "1", etiqueta: "Módulo" },
    ],
    descripcionIntro:
      "Formación en el manejo del sistema operativo Windows y el paquete Microsoft Office, herramientas esenciales para el trabajo de oficina y la comunicación digital.",
    descripcionBloques: [
      {
        icono: "gestion",
        titulo: "Sistema operativo",
        texto: "Manejo del sistema operativo Windows.",
      },
      {
        icono: "formacion",
        titulo: "Ofimática",
        texto: "Microsoft Word, Publisher, Excel y PowerPoint.",
      },
      {
        icono: "innovacion",
        titulo: "Internet",
        texto: "Navegación web con Microsoft Internet Explorer.",
      },
      {
        icono: "cultura",
        titulo: "Comunicación digital",
        texto: "Correo electrónico y Microsoft Outlook.",
      },
    ],
    queAprenderas: [
      { titulo: "Sistema operativo", items: ["Windows"] },
      {
        titulo: "Ofimática",
        items: ["Microsoft Word", "Microsoft Publisher", "Microsoft Excel", "Microsoft PowerPoint"],
      },
      {
        titulo: "Internet y comunicación",
        items: ["Microsoft Internet Explorer", "Correo electrónico", "Microsoft Outlook"],
      },
    ],
    planEstudios: [
      {
        numero: 1,
        nombre: "Computación Win Office System",
        duracionMeses: 3,
        cursos: [
          "Windows",
          "Microsoft Office Word",
          "Microsoft Office Publisher",
          "Microsoft Office Excel",
          "Microsoft Office PowerPoint",
          "Microsoft Internet Explorer",
          "Correo Electrónico",
          "Microsoft Outlook",
        ],
      },
    ],
    // La fuente no especifica un porcentaje practica/teoria para esta
    // carrera: se omite en vez de inventarlo.
    perfilEgresadoTexto:
      "El egresado maneja el sistema operativo Windows y el paquete Microsoft Office (Word, Publisher, Excel, PowerPoint), además de herramientas de navegación por internet y correo electrónico, aplicables al trabajo de oficina.",
    perfilEgresadoCompetencias: [
      "Manejo del sistema operativo Windows",
      "Procesamiento de textos con Microsoft Word",
      "Diseño de publicaciones con Microsoft Publisher",
      "Hojas de cálculo con Microsoft Excel",
      "Presentaciones con Microsoft PowerPoint",
      "Navegación web",
      "Gestión de correo electrónico con Microsoft Outlook",
    ],
    campoLaboral: [
      {
        titulo: "Empresa Privada",
        descripcion: "Manejo de herramientas ofimáticas en cualquier empresa privada.",
      },
      {
        titulo: "Instituciones Públicas",
        descripcion: "Apoyo en digitación y manejo de office en instituciones públicas.",
      },
      {
        titulo: "Emprendimiento",
        descripcion: "Aplicación de herramientas informáticas en tu propio negocio o proyecto.",
      },
    ],
    galeria: [
      {
        src: "/carreras/operador-de-computadoras.jpg",
        alt: "Estudiante de Computación e Informática de INCA EDUCA en formación práctica",
      },
    ],
    faq: [
      {
        pregunta: "¿Cuánto dura Computación e Informática?",
        respuesta:
          "El material disponible confirma un módulo de 3 meses (Computación Win Office System). La duración total oficial de la carrera está pendiente de confirmación por la institución.",
      },
      {
        pregunta: "¿Qué aprenderé durante la carrera?",
        respuesta:
          "Aprenderás a manejar Windows y el paquete Microsoft Office: Word, Publisher, Excel y PowerPoint, además de navegación web, correo electrónico y Outlook.",
      },
      {
        pregunta: "¿Dónde podré trabajar?",
        respuesta:
          "Estas herramientas son aplicables en cualquier empresa privada o institución pública que requiera manejo de office, así como en tu propio negocio o proyecto.",
      },
      {
        pregunta: "¿Este módulo forma parte de otra carrera?",
        respuesta:
          "El material de este módulo proviene del mismo folleto de Asistente Administrativo, Logística y Almacén; en la oferta vigente, Computación e Informática es una carrera independiente.",
      },
    ],
    notaPendiente:
      "Esta página muestra únicamente el módulo de Computación Win Office System confirmado en el material disponible (3 meses). La base de datos registra 12 meses para esta carrera, pero ese valor fue una duración estimada pendiente de confirmar con la dirección académica; la institución debe confirmar la duración total y si existen módulos adicionales.",
  },
  "asistente-contable": {
    slug: "asistente-contable",
    metaDescripcion:
      "Estudia Asistente Contable en INCA EDUCA: 1 año de formación técnica en contabilidad, tributación, Excel, software contable y gestión administrativa.",
    heroTituloLinea1: "ASISTENTE",
    heroTituloLinea2: "CONTABLE",
    heroSubtitulo:
      "Fórmate para apoyar en los procesos contables, administrativos, financieros y tributarios de empresas e instituciones.",
    heroImagen: "/carreras/asistente-contable.jpg",
    statsRapidas: [
      { valor: "12", etiqueta: "Meses de duración" },
      { valor: "3", etiqueta: "Módulos" },
    ],
    descripcionIntro:
      "Asistente Contable es una carrera de formación técnica de 1 año, orientada a preparar profesionales capaces de apoyar en los procesos contables, administrativos, financieros y tributarios de empresas e instituciones. El estudiante desarrolla competencias en contabilidad, registro de compras y ventas, gestión tributaria, Excel, software contable, estados financieros, planillas y gestión administrativa.",
    descripcionBloques: [
      {
        icono: "gestion",
        titulo: "Contabilidad y gestión empresarial",
        texto: "Fundamentos de contabilidad, documentación comercial y administración empresarial.",
      },
      {
        icono: "formacion",
        titulo: "Tributación",
        texto: "Legislación tributaria, comprobantes de pago y gestión tributaria.",
      },
      {
        icono: "innovacion",
        titulo: "Herramientas digitales",
        texto: "Excel aplicado a contabilidad y manejo de software y sistemas contables.",
      },
      {
        icono: "cultura",
        titulo: "Práctica profesional",
        texto: "Estados financieros, costos, planillas y proyecto integrador.",
      },
    ],
    queAprenderas: [
      {
        titulo: "Fundamentos contables",
        items: ["Fundamentos de contabilidad", "Contabilidad financiera", "Contabilidad aplicada", "Documentación comercial"],
      },
      {
        titulo: "Operaciones y tesorería",
        items: ["Registro de compras y ventas", "Caja y bancos", "Cuentas por cobrar y pagar", "Comprobantes de pago"],
      },
      {
        titulo: "Tributación",
        items: ["Legislación tributaria", "Gestión tributaria"],
      },
      {
        titulo: "Herramientas digitales",
        items: [
          "Excel básico, intermedio y financiero para contabilidad",
          "Software contable",
          "Sistemas contables computarizados",
          "Informática aplicada",
        ],
      },
      {
        titulo: "Gestión financiera y administrativa",
        items: [
          "Matemática financiera",
          "Administración empresarial",
          "Economía general",
          "Estados financieros",
          "Costos y presupuestos",
          "Planillas y remuneraciones",
        ],
      },
    ],
    planEstudios: [
      {
        numero: 1,
        nombre: "Fundamentos de Contabilidad y Gestión Empresarial",
        duracionMeses: 4,
        cursos: [
          "Fundamentos de Contabilidad",
          "Documentación Comercial",
          "Matemática Financiera",
          "Administración Empresarial",
          "Economía General",
          "Informática Aplicada",
          "Excel Básico para Contabilidad",
        ],
      },
      {
        numero: 2,
        nombre: "Contabilidad, Tributación y Herramientas Digitales",
        duracionMeses: 4,
        cursos: [
          "Contabilidad Financiera",
          "Registro de Compras y Ventas",
          "Caja y Bancos",
          "Cuentas por Cobrar y Pagar",
          "Legislación Tributaria",
          "Comprobantes de Pago",
          "Excel Intermedio para Contabilidad",
          "Software Contable",
        ],
      },
      {
        numero: 3,
        nombre: "Gestión Contable, Financiera y Práctica Profesional",
        duracionMeses: 4,
        cursos: [
          "Contabilidad Aplicada",
          "Estados Financieros",
          "Costos y Presupuestos",
          "Gestión Tributaria",
          "Planillas y Remuneraciones",
          "Excel Financiero",
          "Sistemas Contables Computarizados",
          "Práctica y Proyecto Integrador",
        ],
      },
    ],
    // La fuente no especifica un porcentaje practica/teoria para esta
    // carrera (solo indica "formación técnica y práctica" en general): se
    // omite en vez de inventar un numero.
    perfilEgresadoTexto:
      "El egresado de la carrera de Asistente Contable estará preparado para brindar apoyo en las actividades contables, administrativas, financieras y tributarias de empresas e instituciones. Contará con conocimientos para registrar y organizar operaciones económicas, gestionar documentación contable, procesar información de compras y ventas, controlar ingresos y gastos y utilizar herramientas digitales y sistemas contables. Podrá colaborar en la preparación de información financiera y tributaria bajo la supervisión del profesional responsable del área.",
    perfilEgresadoCompetencias: [
      "Registrar operaciones contables básicas",
      "Registrar compras y ventas",
      "Organizar comprobantes de pago",
      "Controlar ingresos y egresos",
      "Apoyar en el manejo de caja y bancos",
      "Controlar cuentas por cobrar y pagar",
      "Utilizar Excel aplicado a la contabilidad",
      "Utilizar sistemas y software contable",
      "Apoyar en la preparación de estados financieros",
      "Apoyar en procesos tributarios",
      "Procesar información relacionada con planillas",
      "Aplicar principios de ética profesional",
    ],
    campoLaboral: [
      {
        titulo: "Empresas Privadas",
        descripcion: "Empresas comerciales, de servicios, industriales, constructoras, de transporte y turísticas, entre otras.",
      },
      {
        titulo: "Estudios Contables",
        descripcion: "Apoyo en registro de compras y ventas, comprobantes y preparación de información contable.",
      },
      {
        titulo: "Área de Tesorería",
        descripcion: "Control de ingresos, egresos y apoyo en conciliaciones.",
      },
      {
        titulo: "Área de Facturación",
        descripcion: "Emisión de comprobantes, registro de ventas y seguimiento de facturación.",
      },
      {
        titulo: "Área Administrativa",
        descripcion: "Gestión documentaria, organización de archivos y elaboración de reportes.",
      },
      {
        titulo: "Área de Inventarios",
        descripcion: "Registro y control de entradas y salidas de productos.",
      },
      {
        titulo: "Emprendimientos y Negocios",
        descripcion: "Apoyo contable y administrativo en pequeñas y medianas empresas o emprendimientos propios.",
      },
    ],
    galeria: [
      {
        src: "/carreras/asistente-contable.jpg",
        alt: "Estudiante de Asistente Contable de INCA EDUCA en formación práctica",
      },
    ],
    faq: [
      {
        pregunta: "¿Cuánto dura Asistente Contable?",
        respuesta: "La carrera tiene una duración de 1 año (12 meses).",
      },
      {
        pregunta: "¿Cuántos módulos tiene?",
        respuesta:
          "3 módulos de 4 meses cada uno: Fundamentos de Contabilidad y Gestión Empresarial, Contabilidad y Tributación con Herramientas Digitales, y Gestión Contable, Financiera y Práctica Profesional.",
      },
      {
        pregunta: "¿Qué aprenderé durante la carrera?",
        respuesta:
          "Aprenderás contabilidad, registro de compras y ventas, tributación, Excel aplicado a la contabilidad, software contable, estados financieros y planillas.",
      },
      {
        pregunta: "¿Dónde podré trabajar?",
        respuesta:
          "Puedes trabajar en empresas privadas de distintos sectores, estudios contables, y en áreas de tesorería, facturación, administración o inventarios de cualquier organización.",
      },
      {
        pregunta: "¿Qué cargos puedo ocupar al egresar?",
        respuesta:
          "Asistente o auxiliar contable, auxiliar administrativo, asistente de facturación, auxiliar de tesorería, entre otros puestos de apoyo contable y administrativo.",
      },
      {
        pregunta: "¿Necesito ser contador para ejercer estas funciones?",
        respuesta:
          "No; la carrera te forma como asistente o auxiliar, para apoyar en los procesos contables, administrativos, financieros y tributarios bajo la supervisión del profesional responsable del área.",
      },
    ],
  },
};

export function obtenerContenidoCarrera(slug: string): CarreraContenidoDetallado | null {
  return CARRERAS_CONTENIDO[slug] ?? null;
}
