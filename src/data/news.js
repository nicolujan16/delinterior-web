import React from 'react';
export const categories = [
  { id: 'todas', name: 'Todas', color: 'gray' },
  { id: 'politica', name: 'Política', color: 'red' },
  { id: 'deportes', name: 'Deportes', color: 'green' },
  { id: 'economia', name: 'Economía', color: 'blue' },
  { id: 'cultura', name: 'Cultura', color: 'purple' },
  { id: 'tecnologia', name: 'Tecnología', color: 'indigo' },
  { id: 'salud', name: 'Salud', color: 'pink' },
  { id: 'local', name: 'Local', color: 'yellow' },
  { id: 'provincial', name: 'Provincial', color: 'orange' },
  { id: 'nacional', name: 'Nacional', color: 'teal' }
];

export const breakingNews = [
  "ÚLTIMO MOMENTO: Nueva inversión millonaria llegará a la región",
  "DEPORTES: Equipo local clasifica a semifinales del torneo nacional",
  "ECONOMÍA: Apertura de nueva zona comercial genera 500 empleos"
];

const STABLE_IMAGE_URL = "https://images.unsplash.com/photo-1541888946425-d81bb19240f5";

export const sliderNews = [
  {
    id: 1,
    title: 'Quintela continúa impulsando la educación técnica',
    summary: "El gobernador inauguró un galpón en el Instituto Superior de Formación Técnico Profesional “La Totorita”, consolidando un espacio clave para la formación de técnicos en gestión de producción agropecuaria y promoviendo la reconversión productiva del interior riojano.\n\nEn el marco del 148º aniversario del Departamento General Ortiz de Ocampo, el gobernador Ricardo Quintela, encabezó la inauguración de un galpón destinado al Instituto Superior de Formación Técnico Profesional “La Totorita”, una institución clave para la formación de técnicos en gestión de la producción agropecuaria en la región.\n\nAl respecto, el gobernador manifestó que “fuimos a visitar la Escuela Técnica Superior, cosa que nos llena de satisfacción, porque es un edificio antiquísimo, de la época del general Juan Domingo Perón, y se está recuperando, se hizo un salón totalmente nuevo, pero queremos recuperarla y restaurarla para que quede como testimonio de la importancia a que le damos al interior del interior del interior del país; en una zona tan alejada, absolutamente despoblada, sin embargo ahí en el corazón de Los Llanos riojanos se construyó este instituto superior para capacitar a todo aquel que quisiera hacerlo y aportar al crecimiento y desarrollo del departamento”.\n\nPor su parte, el ministro de Educación Ariel Martínez destacó que “es muy importante para el sistema educativo y para el departamento poder recuperar este espacio que permitirá no solo fortalecer las prácticas pedagógicas, sino también resguardar el equipamiento necesario para la formación técnica”. “Para nosotros es trascendental contar con un nuevo espacio que garantice los derechos de nuestros estudiantes, hace a una estrategia prioritaria que ha manifestado nuestro gobernador que es la educación pública, practica y técnica dentro del sistema educativo” agregó.\n\nAdemás, Martínez también valoró la trayectoria del instituto y remarcó su permanencia desde hace 50 años: “Que esta institución siga permaneciendo en el tiempo y trascienda épocas habla de una verdadera política de Estado”.",
    category: "Politica",
    author: "Carlos S.",
    date: "2025-08-08",
    readTime: "5 min",
    views: "2.3k",
    image: "https://www.delinterior.com.ar/sitio/2018/img/noticias/31633_1757377712.jpg",
    isBreaking: true
  },
  {
    id: 2,
    title: 'Plazo fijo arriba del 50% anual',
    summary: "Cuánto pagan los principales bancos por depósitos de $1 millón. Actualización de tasas refleja condiciones cambiantes en el mercado financiero argentino. Los rendimientos entre bancos difieren por encima de 20.000 pesos para un depósito de un millón (Franco Fafasuli)\n\nLa herramienta del plazo fijo continúa siendo una de las alternativas más consultadas por ahorristas en un contexto de inestabilidad macroeconómica y movimientos constantes en la política monetaria. El recorte de las tasas y los nuevos valores para depósitos a 30 días, informados por las entidades financieras al Banco Central de la República Argentina (BCRA), muestran un escenario renovado para quienes buscan opciones de resguardo y rentabilidad para sus pesos.El análisis de las tasas vigentes en los principales bancos revela diferencias marcadas entre las entidades, tanto en la remuneración como en el rendimiento final para operaciones de un millón de pesos. Fuentes de referencia, como Infobae y el propio relevamiento actualizado, indican que al día de hoy los bancos que reportan sus condiciones al BCRA ofrecen un rango que abarca desde retornos del 30% nominal anual, hasta máximos que alcanzan o superan el 55%.\n\nDe acuerdo a la información financiera más reciente, el Banco del Sol S.A. y Banco Voii S.A. lideran la tabla con una tasa nominal anual del 55,00, mientras Banco Meridian S.A. y Crédito Regional Compañía Financiera S.A.U. se ubican levemente por debajo, con registros de 54,50. Estas entidades se posicionan sobre el resto del sistema con valores que superan holgadamente la media simple de todas las tasas relevadas.\n\nAl momento de calcular la rentabilidad para un depósito estándar de un millón de pesos a 30 días, los resultados varían sensiblemente. En el caso de Banco del Sol S.A. y Banco Voii S.A., el monto acreditado al vencimiento asciende a 1.045.205,48 pesos. Por su parte, quienes eligen operaciones con Banco Meridian S.A. y Crédito Regional Compañía Financiera S.A.U. encuentran retornos de 1.044.794,52 pesos tras un mes.",
    category: "Politica",
    author: "Nombre de autor",
    date: "2025-08-08",
    readTime: "3 min",
    views: "1.8k",
    image: "https://www.delinterior.com.ar/sitio/2018/img/noticias/31702_1757973040.jpg",
    isBreaking: false
  },
  {
    id: 3,
    title: 'Cuipán tiene un "Nuevo Parque Solar"',
    summary: 'El gobernador Ricardo Quintela recorrió el proyecto que permitirá cubrir el 20% del consumo municipal en alumbrado público y se suma a otros seis parques solares ya instalados en distintos departamentos. Se consolida la estrategia energética basada en soberanía, eficiencia y desarrollo sustentable.\n\nEste viernes, en el marco del 159° aniversario del departamento San Blas de Los Sauces, el gobernador Ricardo Quintela visitó la obra del Parque Solar de Cuipán. La implementación de este emprendimiento permitirá cubrir alrededor del 20% del consumo municipal en alumbrado público, fortaleciendo la eficiencia energética y el cuidado ambiental en la región.\n\nEl parque cuenta con una potencia instalada de 50 kW y está equipado con 100 paneles solares de última tecnología Jinko Tiger Pro de 560 W, además de un inversor inteligente Huawei que posibilita el monitoreo en tiempo real. La estructura, construida con acero galvanizado y preparada para resistir condiciones climáticas adversas, fue ejecutada íntegramente por personal técnico capacitado de la provincia.\n\nEsta obra se suma a otros seis parques solares con las mismas características ya en funcionamiento en General Lamadrid, Villa Castelli, Independencia (Patquía), Famatina (Pituil), General Ocampo (Milagro), Sanagasta y General San Martín (Ulapes), consolidando una red provincial de energías renovables que busca reducir costos, generar empleo local y avanzar en la transición hacia un modelo energético más sustentable.',
    category: "tecnologia",
    author: "Nombre de autor",
    date: "2025-08-07",
    readTime: "4 min",
    views: "1.5k",
    image: "https://www.delinterior.com.ar/sitio/2018/img/noticias/31689_1757930560.jpg",
    isBreaking: false
  }
];

export const localNews = [
  {
    id: 20,
    title: "Quintela continúa impulsando la educación técnica",
    summary: "El gobernador inauguró un galpón en el Instituto Superior de Formación Técnico Profesional “La Totorita”, consolidando un espacio clave para la formación de técnicos en gestión de producción agropecuaria y promoviendo la reconversión productiva del interior riojano.\n\nEn el marco del 148º aniversario del Departamento General Ortiz de Ocampo, el gobernador Ricardo Quintela, encabezó la inauguración de un galpón destinado al Instituto Superior de Formación Técnico Profesional “La Totorita”, una institución clave para la formación de técnicos en gestión de la producción agropecuaria en la región.\n\nAl respecto, el gobernador manifestó que “fuimos a visitar la Escuela Técnica Superior, cosa que nos llena de satisfacción, porque es un edificio antiquísimo, de la época del general Juan Domingo Perón, y se está recuperando, se hizo un salón totalmente nuevo, pero queremos recuperarla y restaurarla para que quede como testimonio de la importancia a que le damos al interior del interior del interior del país; en una zona tan alejada, absolutamente despoblada, sin embargo ahí en el corazón de Los Llanos riojanos se construyó este instituto superior para capacitar a todo aquel que quisiera hacerlo y aportar al crecimiento y desarrollo del departamento”.",
    category: "local",
    author: "Nombre de autor",
    date: "2025-08-08",
    image: "http://www.delinterior.com.ar/sitio/2018/img/noticias/31692_1757969870.jpg",
  },
  {
    id: 21,
    title: "El Gobierno impulsa “Infancias Cuidadas”",
    category: "local",
    author: "Nombre de autor",
    date: "2025-08-08",
    image: "https://www.delinterior.com.ar/sitio/2018/img/noticias/31369_1755206738.jpg_t.jpg",
  },
  {
    id: 22,
    title: "Importante investigación sobre Enfermedades Respiratorias Crónicas",
    category: "local",
    author: "Nombre de autor",
    date: "2025-08-07",
    image: "https://www.delinterior.com.ar/sitio/2018/img/noticias/31366_1755205936.jpg_t.jpg",
  },
  {
    id: 23,
    title: "1° Foro Provincial de la Energía – Energía para el Desarrollo",
    category: "local",
    author: "Nombre de autor",
    date: "2025-08-06",
    image: "https://www.delinterior.com.ar/sitio/2018/img/noticias/31367_1755206136.jpg_t.jpg",
  },
  {
    id: 24,
    title: "El municipio lanza un nuevo programa de reciclaje",
    category: "local",
    author: "Martín Herrera",
    date: "2025-08-05",
    image: STABLE_IMAGE_URL,
  },
  {
    id: 25,
    title: "Renuevan la iluminación LED en el casco céntrico",
    category: "local",
    author: "Elena Ríos",
    date: "2025-08-04",
    image: STABLE_IMAGE_URL,
  },
];

export const politicalNews = [
  {
    id: 30,
    title: "El debate por la jornada laboral de 4 días llega al congreso",
    category: "politica",
    author: "Martín Herrera",
    date: "2025-08-05",
    image: STABLE_IMAGE_URL,
  },
  {
    id: 31,
    title: "Nuevas alianzas políticas se perfilan para las próximas elecciones",
    category: "politica",
    author: "Laura Fernández",
    date: "2025-08-08",
    image: STABLE_IMAGE_URL,
  },
  {
    id: 32,
    title: "Gobierno anuncia paquete de medidas para incentivar el consumo",
    category: "politica",
    author: "Javier Torres",
    date: "2025-08-07",
    image: STABLE_IMAGE_URL,
  },
  {
    id: 33,
    title: "La oposición presenta un proyecto de ley alternativo",
    category: "politica",
    author: "Sofía Moreno",
    date: "2025-08-06",
    image: STABLE_IMAGE_URL,
  },
  {
    id: 34,
    title: "Intenso debate en la legislatura por el presupuesto 2026",
    category: "politica",
    author: "Roberto Sánchez",
    date: "2025-08-08",
    image: STABLE_IMAGE_URL,
  },
  {
    id: 35,
    title: "Cumbre de gobernadores para discutir la coparticipación",
    category: "politica",
    author: "Elena Ríos",
    date: "2025-08-04",
    image: STABLE_IMAGE_URL,
  },
];

export const provincialNews = [
  {
    id: 40,
    title: "Anuncian inversión para el Parque Nacional Talampaya",
    category: "provincial",
    author: "Javier Torres",
    date: "2025-08-07",
    image: STABLE_IMAGE_URL,
  },
  {
    id: 41,
    title: "La producción vitivinícola de La Rioja bate récords de exportación",
    category: "provincial",
    author: "Sofía Moreno",
    date: "2025-08-06",
    image: STABLE_IMAGE_URL,
  },
  {
    id: 42,
    title: "Avanza la construcción del nuevo dique en el interior provincial",
    category: "provincial",
    author: "Martín Herrera",
    date: "2025-08-05",
    image: STABLE_IMAGE_URL,
  },
];

export const nationalNews = [
  {
    id: 50,
    title: "Ecuador designó como entidad terrorista al Cártel de los Soles",
    category: "nacional",
    author: "Roberto Sánchez",
    date: "2025-08-08",
    image: "https://www.delinterior.com.ar/sitio/2018/img/noticias/31381_1755257142.jpg_t.jpg",
  },
  {
    id: 51,
    title: "La selección Argentina se prepara para la Copa América",
    category: "nacional",
    author: "Laura Fernández",
    date: "2025-08-08",
    image: STABLE_IMAGE_URL,
  },
  {
    id: 52,
    title: "Lanzan el plan PreViaje 6 para fomentar el turismo interno",
    category: "nacional",
    author: "Elena Ríos",
    date: "2025-08-04",
    image: STABLE_IMAGE_URL,
  },
];