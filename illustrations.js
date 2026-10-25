// ============================================================================
// ANUARUS — ILUSTRACIONES ANATÓMICAS Y BIOMECÁNICAS (BLANCO Y NEGRO)
// Guía visual de antropometría (6 perímetros) y biblioteca de los 6 ejercicios
// ============================================================================

window.ANUARUS_MEASUREMENTS_GUIDE = {
  neck: {
    id: 'neck',
    name: 'Cuello',
    unit: 'cm',
    landmark: 'Debajo de la prominencia laríngea (nuez)',
    instructions: [
      'Paciente de pie o sentado con la cabeza en plano de Frankfort (mirada al frente).',
      'Hombros relajados hacia abajo sin contraer el trapecio.',
      'Coloca la cinta métrica justo por debajo de la laringe (nuez de Adán), perpendicular al eje largo del cuello.',
      'Aplica tensión suave sin comprimir el tejido subcutáneo.'
    ],
    svg: `<svg viewBox="0 0 220 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="anat-svg">
      <!-- Grid lines -->
      <line x1="110" y1="10" x2="110" y2="190" stroke="currentColor" stroke-opacity="0.12" stroke-dasharray="3 3"/>
      <!-- Head & jaw silhouette -->
      <path d="M78 48 C78 24, 142 24, 142 48 C142 66, 134 84, 124 94 L126 128 L168 148 L178 182 L42 182 L52 148 L94 128 L96 94 C86 84, 78 66, 78 48 Z" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.03"/>
      <!-- Clavicles -->
      <path d="M62 146 Q92 154 106 146 M158 146 Q128 154 114 146" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.5"/>
      <!-- Sternocleidomastoid hint -->
      <line x1="94" y1="92" x2="105" y2="144" stroke="currentColor" stroke-width="1" stroke-opacity="0.35"/>
      <line x1="126" y1="92" x2="115" y2="144" stroke="currentColor" stroke-width="1" stroke-opacity="0.35"/>
      <!-- Larynx marker -->
      <circle cx="110" cy="105" r="2.5" fill="currentColor" fill-opacity="0.5"/>
      <!-- Measurement Tape Band -->
      <path d="M92 115 C102 120, 118 120, 128 115" stroke="currentColor" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M92 115 C102 111, 118 111, 128 115" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 2" stroke-opacity="0.6"/>
      <!-- Dimension Arrows -->
      <line x1="65" y1="116" x2="88" y2="116" stroke="currentColor" stroke-width="1.5"/>
      <polygon points="88,116 82,113 82,119" fill="currentColor"/>
      <line x1="155" y1="116" x2="132" y2="116" stroke="currentColor" stroke-width="1.5"/>
      <polygon points="132,116 138,113 138,119" fill="currentColor"/>
      <text x="110" y="172" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="10" font-weight="700" letter-spacing="1">PERÍMETRO DE CUELLO</text>
    </svg>`
  },
  waist: {
    id: 'waist',
    name: 'Cintura',
    unit: 'cm',
    landmark: 'Punto más estrecho del abdomen (entre última costilla y cresta ilíaca)',
    instructions: [
      'De pie con el abdomen relajado y brazos cruzados en el tórax o ligeramente separados.',
      'Localiza el punto más estrecho entre el borde costal inferior (10ª costilla) y la cresta ilíaca (o a nivel umbilical si no hay estrechamiento visible).',
      'Toma la lectura exactamente al final de una espiración normal (sin meter el abdomen).'
    ],
    svg: `<svg viewBox="0 0 220 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="anat-svg">
      <line x1="110" y1="10" x2="110" y2="190" stroke="currentColor" stroke-opacity="0.12" stroke-dasharray="3 3"/>
      <!-- Torso outline -->
      <path d="M64 25 L74 72 C78 92, 82 104, 80 118 C76 134, 68 150, 70 175 L150 175 C152 150, 144 134, 140 118 C138 104, 142 92, 146 72 L156 25" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.03"/>
      <!-- Pectoral & Ribcage lines -->
      <path d="M74 54 Q92 62 108 54 M146 54 Q128 62 112 54" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.5"/>
      <path d="M88 86 Q110 74 132 86" stroke="currentColor" stroke-width="1" stroke-dasharray="2 2" stroke-opacity="0.4"/>
      <!-- Umbilicus -->
      <circle cx="110" cy="112" r="2.2" fill="currentColor"/>
      <!-- Measurement Tape around narrowest waist -->
      <path d="M80 104 C96 110, 124 110, 140 104" stroke="currentColor" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M80 104 C96 98, 124 98, 140 104" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 2" stroke-opacity="0.6"/>
      <!-- Callout arrows -->
      <line x1="48" y1="104" x2="74" y2="104" stroke="currentColor" stroke-width="1.5"/>
      <polygon points="74,104 68,101 68,107" fill="currentColor"/>
      <line x1="172" y1="104" x2="146" y2="104" stroke="currentColor" stroke-width="1.5"/>
      <polygon points="146,104 152,101 152,107" fill="currentColor"/>
      <text x="110" y="188" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="10" font-weight="700" letter-spacing="1">CINTURA MÍNIMA / UMBILICAL</text>
    </svg>`
  },
  hip: {
    id: 'hip',
    name: 'Cadera',
    unit: 'cm',
    landmark: 'Nivel de máxima prominencia glútea (pies juntos)',
    instructions: [
      'Paciente de pie con los pies juntos y glúteos relajados.',
      'Observa de perfil el punto de mayor proyección posterior de los glúteos.',
      'Pasa la cinta métrica en un plano totalmente horizontal alrededor de esa máxima circunferencia.'
    ],
    svg: `<svg viewBox="0 0 220 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="anat-svg">
      <line x1="110" y1="10" x2="110" y2="190" stroke="currentColor" stroke-opacity="0.12" stroke-dasharray="3 3"/>
      <!-- Lower torso & pelvis silhouette -->
      <path d="M80 24 C82 48, 82 62, 74 82 C64 102, 64 126, 72 148 L76 176 L105 176 L108 134 L112 134 L115 176 L144 176 L148 148 C156 126, 156 102, 146 82 C138 62, 138 48, 140 24" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.03"/>
      <!-- Iliac crest hints -->
      <path d="M80 68 Q92 78 102 76 M140 68 Q128 78 118 76" stroke="currentColor" stroke-width="1.2" stroke-opacity="0.4"/>
      <!-- Measurement Tape around widest hip/glute level -->
      <path d="M66 112 C90 120, 130 120, 154 112" stroke="currentColor" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M66 112 C90 105, 130 105, 154 112" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 2" stroke-opacity="0.6"/>
      <!-- Arrows -->
      <line x1="38" y1="112" x2="60" y2="112" stroke="currentColor" stroke-width="1.5"/>
      <polygon points="60,112 54,109 54,115" fill="currentColor"/>
      <line x1="182" y1="112" x2="160" y2="112" stroke="currentColor" stroke-width="1.5"/>
      <polygon points="160,112 166,109 166,115" fill="currentColor"/>
      <text x="110" y="190" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="10" font-weight="700" letter-spacing="1">MÁXIMA PROMINENCIA GLÚTEA</text>
    </svg>`
  },
  arm: {
    id: 'arm',
    name: 'Brazo (Contraído)',
    unit: 'cm',
    landmark: 'Pico máximo del bíceps en flexión a 90°',
    instructions: [
      'Eleva el brazo hasta la horizontal (abducción de 90°) y flexiona el codo a 90°.',
      'Cierra el puño y realiza una contracción máxima del bíceps y tríceps.',
      'Rodea con la cinta el punto de mayor circunferencia (pico del bíceps) perpendicular al húmero.'
    ],
    svg: `<svg viewBox="0 0 220 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="anat-svg">
      <!-- Flexed Arm Outline -->
      <path d="M35 125 C45 96, 66 88, 86 94 C98 76, 124 74, 140 92 L152 46 C154 36, 168 36, 172 46 L168 118 C166 132, 152 138, 136 136 C116 138, 92 136, 70 132 L45 154" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.03"/>
      <!-- Bicep Peak detail -->
      <path d="M88 94 Q114 76 138 92" stroke="currentColor" stroke-width="2"/>
      <!-- 90 degree angle indicator -->
      <polyline points="136,98 148,98 148,84" stroke="currentColor" stroke-width="1" stroke-opacity="0.5"/>
      <!-- Measurement Tape around Bicep Peak -->
      <path d="M113 79 C117 98, 117 118, 113 137" stroke="currentColor" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M113 79 C109 98, 109 118, 113 137" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 2" stroke-opacity="0.6"/>
      <!-- Arrows -->
      <line x1="113" y1="50" x2="113" y2="73" stroke="currentColor" stroke-width="1.5"/>
      <polygon points="113,73 110,67 116,67" fill="currentColor"/>
      <line x1="113" y1="164" x2="113" y2="143" stroke="currentColor" stroke-width="1.5"/>
      <polygon points="113,143 110,149 116,149" fill="currentColor"/>
      <text x="110" y="186" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="10" font-weight="700" letter-spacing="1">BRAZO FLEXIONADO 90°</text>
    </svg>`
  },
  thigh: {
    id: 'thigh',
    name: 'Muslo Medio',
    unit: 'cm',
    landmark: 'Punto medio entre pliegue inguinal y borde superior de la rótula',
    instructions: [
      'De pie con los pies separados al ancho de los hombros y el peso repartido por igual en ambas piernas.',
      'Ubica el punto medio (50%) entre el pliegue inguinal y el borde superior de la rótula.',
      'Coloca la cinta horizontalmente alrededor del muslo sin comprimir la piel.'
    ],
    svg: `<svg viewBox="0 0 220 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="anat-svg">
      <!-- Thigh & Knee Silhouette -->
      <path d="M72 20 C68 62, 74 106, 82 142 C84 152, 82 162, 84 176 L132 176 C134 162, 132 152, 134 142 C142 106, 148 62, 144 20" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.03"/>
      <!-- Inguinal crease & Patella markers -->
      <line x1="74" y1="30" x2="108" y2="48" stroke="currentColor" stroke-width="1.2" stroke-dasharray="3 2" stroke-opacity="0.5"/>
      <rect x="98" y="142" width="20" height="16" rx="6" stroke="currentColor" stroke-width="1.3" stroke-opacity="0.5"/>
      <!-- 50% distance ruler on left -->
      <line x1="50" y1="38" x2="50" y2="142" stroke="currentColor" stroke-width="1" stroke-opacity="0.4"/>
      <line x1="45" y1="38" x2="55" y2="38" stroke="currentColor" stroke-width="1" stroke-opacity="0.4"/>
      <line x1="45" y1="142" x2="55" y2="142" stroke="currentColor" stroke-width="1" stroke-opacity="0.4"/>
      <text x="36" y="93" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="9" opacity="0.7">50%</text>
      <!-- Measurement Tape at Mid-Thigh -->
      <path d="M73 90 C94 97, 122 97, 143 90" stroke="currentColor" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M73 90 C94 84, 122 84, 143 90" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 2" stroke-opacity="0.6"/>
      <!-- Arrow -->
      <line x1="176" y1="90" x2="150" y2="90" stroke="currentColor" stroke-width="1.5"/>
      <polygon points="150,90 156,87 156,93" fill="currentColor"/>
      <text x="110" y="190" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="10" font-weight="700" letter-spacing="1">PUNTO MEDIO DEL MUSLO</text>
    </svg>`
  },
  calf: {
    id: 'calf',
    name: 'Pantorrilla',
    unit: 'cm',
    landmark: 'Circunferencia máxima de los gemelos (gastrocnemio)',
    instructions: [
      'Paciente de pie con el peso distribuido equitativamente en ambos pies y musculatura relajada.',
      'Rodea la pantorrilla con la cinta y desplázala ligeramente arriba/abajo hasta encontrar el perímetro máximo.',
      'Asegúrate de que la cinta esté totalmente horizontal respecto al suelo.'
    ],
    svg: `<svg viewBox="0 0 220 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="anat-svg">
      <!-- Lower leg & Calf Silhouette -->
      <path d="M86 18 L84 36 C72 64, 72 94, 86 124 L92 158 L84 172 L134 172 L126 158 L132 124 C146 94, 146 64, 134 36 L132 18" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.03"/>
      <!-- Gastrocnemius medial/lateral head lines -->
      <path d="M84 96 Q104 108 109 86 M134 96 Q114 108 109 86" stroke="currentColor" stroke-width="1.2" stroke-opacity="0.4"/>
      <!-- Measurement Tape around widest Calf -->
      <path d="M75 76 C96 82, 122 82, 143 76" stroke="currentColor" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M75 76 C96 70, 122 70, 143 76" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 2" stroke-opacity="0.6"/>
      <!-- Arrows -->
      <line x1="46" y1="76" x2="69" y2="76" stroke="currentColor" stroke-width="1.5"/>
      <polygon points="69,76 63,73 63,79" fill="currentColor"/>
      <line x1="172" y1="76" x2="149" y2="76" stroke="currentColor" stroke-width="1.5"/>
      <polygon points="149,76 155,73 155,79" fill="currentColor"/>
      <text x="110" y="190" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="10" font-weight="700" letter-spacing="1">PERÍMETRO MÁXIMO DE GEMELO</text>
    </svg>`
  }
};

// ============================================================================
// LOS 6 EJERCICIOS OFICIALES DE ANUARUS (CON DIAGRAMA BIOMECÁNICO Y ESTÁNDARES)
// ============================================================================
// Standards are expressed as 1RM / Bodyweight ratios for Male and Female:
// [Principiante, Intermedio, Avanzado, Élite]
// Note: For Dips (fondos) and Pull-ups (dominadas), ratios represent EXTERNAL LOAD / BW
// (or total load normalized), we calculate both external weight and total systemic load!

window.ANUARUS_EXERCISES = [
  {
    id: 'deadlift',
    name: 'Peso Muerto',
    subtitle: 'Deadlift Convencional / Barra Libre',
    category: 'Cadena Posterior & Fuerza Axial',
    muscles: 'Isquiosurales, Glúteo Mayor, Erectores Espinales, Trapecio',
    isBodyweightPlus: false,
    cues: [
      'Barra sobre la mitad del pie (a ~2-3 cm de la tibia).',
      'Escápulas exactamente encima de la barra; activa el dorsal ("rompe la barra").',
      'Empuja el suelo con las piernas manteniendo la columna neutra hasta el bloqueo de cadera.'
    ],
    // Ratios of 1RM / BodyWeight
    standards: {
      M: { beginner: 1.0, intermediate: 1.5, advanced: 2.0, elite: 2.5 },
      F: { beginner: 0.65, intermediate: 1.05, advanced: 1.45, elite: 1.85 }
    },
    svg: `<svg viewBox="0 0 260 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="exercise-svg">
      <!-- Floor line -->
      <line x1="20" y1="168" x2="240" y2="168" stroke="currentColor" stroke-width="2"/>
      <!-- Vertical bar path guide -->
      <line x1="138" y1="24" x2="138" y2="168" stroke="currentColor" stroke-width="1.2" stroke-dasharray="4 3" stroke-opacity="0.45"/>
      <polygon points="138,26 134,34 142,34" fill="currentColor" fill-opacity="0.6"/>
      <!-- Lifter in Hinge setup (Ghost) & Lockout / Mid-pull -->
      <!-- Plates -->
      <circle cx="138" cy="140" r="27" stroke="currentColor" stroke-width="2.5" fill="currentColor" fill-opacity="0.06"/>
      <circle cx="138" cy="140" r="8" stroke="currentColor" stroke-width="1.5"/>
      <!-- Lifter Anatomy (Hinge Profile) -->
      <!-- Head -->
      <circle cx="152" cy="54" r="11" stroke="currentColor" stroke-width="2.2"/>
      <!-- Spine / Torso (Highlighted Posterior Chain) -->
      <line x1="144" y1="63" x2="92" y2="102" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>
      <!-- Hip Joint -->
      <circle cx="92" cy="102" r="5" fill="currentColor"/>
      <!-- Femur (Thigh) -->
      <line x1="92" y1="102" x2="130" y2="128" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
      <!-- Knee Joint -->
      <circle cx="130" cy="128" r="4" fill="currentColor"/>
      <!-- Tibia (Shin) -->
      <line x1="130" y1="128" x2="126" y2="166" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
      <!-- Foot -->
      <line x1="118" y1="166" x2="148" y2="166" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>
      <!-- Arm vertical to bar -->
      <line x1="138" y1="68" x2="138" y2="140" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>
      <!-- Angle arc at hip -->
      <path d="M108 90 A20 20 0 0 1 108 112" stroke="currentColor" stroke-width="1.2" stroke-opacity="0.6"/>
      <text x="28" y="34" fill="currentColor" font-family="monospace" font-size="10" font-weight="700">01 // PESO MUERTO</text>
      <text x="150" y="34" fill="currentColor" font-family="monospace" font-size="9" opacity="0.65">TRAYECTORIA VERTICAL</text>
    </svg>`
  },
  {
    id: 'squat',
    name: 'Sentadilla Libre',
    subtitle: 'Back Squat con Barra Olímpica',
    category: 'Dominante de Rodilla & Tren Inferior',
    muscles: 'Cuádriceps, Glúteo Mayor, Aductores, Core Estabilizador',
    isBodyweightPlus: false,
    cues: [
      'Apoya la barra firme sobre el trapecio o deltoides posterior; codos alineados con el torso.',
      'Toma aire diafragmático (bracing 360°) antes de iniciar el descenso.',
      'Desciende rompiendo el paralelo (pliegue de la cadera bajo la rodilla) manteniendo la barra sobre medio pie.'
    ],
    standards: {
      M: { beginner: 0.85, intermediate: 1.25, advanced: 1.7, elite: 2.15 },
      F: { beginner: 0.55, intermediate: 0.9, advanced: 1.25, elite: 1.6 }
    },
    svg: `<svg viewBox="0 0 260 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="exercise-svg">
      <!-- Floor -->
      <line x1="20" y1="168" x2="240" y2="168" stroke="currentColor" stroke-width="2"/>
      <!-- Parallel depth reference line -->
      <line x1="56" y1="126" x2="195" y2="126" stroke="currentColor" stroke-width="1" stroke-dasharray="3 3" stroke-opacity="0.45"/>
      <text x="198" y="129" fill="currentColor" font-family="monospace" font-size="8" opacity="0.7">PARALELO 90°</text>
      <!-- Vertical bar path over mid-foot -->
      <line x1="128" y1="30" x2="128" y2="168" stroke="currentColor" stroke-width="1.2" stroke-dasharray="4 3" stroke-opacity="0.45"/>
      <!-- Barbell plate on back -->
      <circle cx="128" cy="70" r="16" stroke="currentColor" stroke-width="2.2" fill="currentColor" fill-opacity="0.08"/>
      <circle cx="128" cy="70" r="5" fill="currentColor"/>
      <!-- Head -->
      <circle cx="140" cy="54" r="10.5" stroke="currentColor" stroke-width="2.2"/>
      <!-- Torso -->
      <line x1="128" y1="70" x2="90" y2="128" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>
      <!-- Hip below parallel -->
      <circle cx="90" cy="128" r="5" fill="currentColor"/>
      <!-- Femur (Quads highlighted) -->
      <line x1="90" y1="128" x2="146" y2="124" stroke="currentColor" stroke-width="5.5" stroke-linecap="round"/>
      <!-- Knee -->
      <circle cx="146" cy="124" r="4" fill="currentColor"/>
      <!-- Tibia -->
      <line x1="146" y1="124" x2="122" y2="166" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
      <!-- Foot -->
      <line x1="114" y1="166" x2="144" y2="166" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>
      <text x="28" y="34" fill="currentColor" font-family="monospace" font-size="10" font-weight="700">02 // SENTADILLA LIBRE</text>
    </svg>`
  },
  {
    id: 'dips',
    name: 'Fondo en Paralelas',
    subtitle: 'Parallel Bar Dips (Peso Corporal + Lastre)',
    category: 'Empuje Vertical / Horizontal de Tren Superior',
    muscles: 'Pectoral Mayor (Porción Esternal), Tríceps Braquial, Deltoides Anterior',
    isBodyweightPlus: true,
    cues: [
      'Deprime las escápulas (hombros lejos de las orejas) antes de flexionar los codos.',
      'Inclina el torso ligeramente hacia adelante (15°–20°) para reclutar pectoral y proteger la cápsula articular.',
      'Baja hasta que el hombro quede ligeramente por debajo del nivel del codo (90°) y extiende por completo.'
    ],
    // Ratios use Total Load (Bodyweight + External Weight) / Bodyweight OR External load.
    // We evaluate using Total Systemic Load / BW: e.g. 1.05x BW (BW + 5%), 1.25x BW (+25% lastre), 1.50x BW (+50% lastre), 1.80x BW (+80% lastre)
    standards: {
      M: { beginner: 1.0, intermediate: 1.22, advanced: 1.48, elite: 1.75 },
      F: { beginner: 0.85, intermediate: 1.02, advanced: 1.20, elite: 1.40 }
    },
    svg: `<svg viewBox="0 0 260 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="exercise-svg">
      <!-- Parallel Bars Structure -->
      <line x1="70" y1="108" x2="190" y2="108" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>
      <line x1="82" y1="108" x2="82" y2="174" stroke="currentColor" stroke-width="2" stroke-opacity="0.5"/>
      <line x1="178" y1="108" x2="178" y2="174" stroke="currentColor" stroke-width="2" stroke-opacity="0.5"/>
      <!-- Lifter on bars -->
      <!-- Head -->
      <circle cx="148" cy="52" r="10.5" stroke="currentColor" stroke-width="2.2"/>
      <!-- Shoulder -->
      <circle cx="134" cy="74" r="4.5" fill="currentColor"/>
      <!-- Upper Arm (90 deg flexion) -->
      <line x1="134" y1="74" x2="108" y2="74" stroke="currentColor" stroke-width="4.5" stroke-linecap="round"/>
      <!-- Forearm vertical to bar -->
      <line x1="108" y1="74" x2="112" y2="108" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
      <!-- Torso leaned 18 deg forward -->
      <line x1="134" y1="74" x2="118" y2="122" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>
      <!-- Legs tucked behind -->
      <line x1="118" y1="122" x2="114" y2="156" stroke="currentColor" stroke-width="4.5" stroke-linecap="round"/>
      <line x1="114" y1="156" x2="96" y2="148" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>
      <!-- Optional Dip Belt Plate -->
      <line x1="120" y1="122" x2="132" y2="146" stroke="currentColor" stroke-width="1.2" stroke-dasharray="2 2"/>
      <circle cx="132" cy="152" r="10" stroke="currentColor" stroke-width="1.8" fill="currentColor" fill-opacity="0.08"/>
      <text x="28" y="34" fill="currentColor" font-family="monospace" font-size="10" font-weight="700">03 // FONDO EN PARALELAS</text>
    </svg>`
  },
  {
    id: 'ohp',
    name: 'Press Militar',
    subtitle: 'Overhead Barbell Military Press (De Pie)',
    category: 'Empuje Vertical Estricto',
    muscles: 'Deltoides Anterior y Lateral, Tríceps, Haz Clavicular, Core',
    isBodyweightPlus: false,
    cues: [
      'Agarre ligeramente más ancho que los hombros; muñecas neutras apiladas sobre los codos.',
      'Contrae glúteos y abdomen fuertemente para evitar hiperextender la zona lumbar.',
      'Empuja la barra verticalmente cerca del rostro y mete la cabeza bajo la barra al bloquear arriba.'
    ],
    standards: {
      M: { beginner: 0.45, intermediate: 0.65, advanced: 0.85, elite: 1.05 },
      F: { beginner: 0.28, intermediate: 0.42, advanced: 0.58, elite: 0.75 }
    },
    svg: `<svg viewBox="0 0 260 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="exercise-svg">
      <!-- Floor -->
      <line x1="20" y1="172" x2="240" y2="172" stroke="currentColor" stroke-width="2"/>
      <!-- Vertical plumb line -->
      <line x1="130" y1="22" x2="130" y2="172" stroke="currentColor" stroke-width="1.2" stroke-dasharray="4 3" stroke-opacity="0.4"/>
      <!-- Barbell Overhead Lockout -->
      <circle cx="130" cy="36" r="14" stroke="currentColor" stroke-width="2.2" fill="currentColor" fill-opacity="0.08"/>
      <circle cx="130" cy="36" r="4" fill="currentColor"/>
      <!-- Upward Force Arrow -->
      <line x1="164" y1="78" x2="164" y2="36" stroke="currentColor" stroke-width="1.5"/>
      <polygon points="164,32 160,40 168,40" fill="currentColor"/>
      <!-- Head -->
      <circle cx="132" cy="74" r="9.5" stroke="currentColor" stroke-width="2.2"/>
      <!-- Arms extended overhead -->
      <line x1="128" y1="88" x2="130" y2="36" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
      <!-- Torso stacked vertically -->
      <line x1="128" y1="88" x2="128" y2="128" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>
      <!-- Legs -->
      <line x1="128" y1="128" x2="128" y2="170" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
      <line x1="122" y1="170" x2="142" y2="170" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>
      <text x="28" y="28" fill="currentColor" font-family="monospace" font-size="10" font-weight="700">04 // PRESS MILITAR</text>
    </svg>`
  },
  {
    id: 'incline_bench',
    name: 'Press de Banca Inclinado',
    subtitle: 'Incline Barbell Bench Press (30°–45°)',
    category: 'Empuje En Ángulo (Tren Superior)',
    muscles: 'Pectoral Mayor (Porción Clavicular/Superior), Deltoides Anterior, Tríceps',
    isBodyweightPlus: false,
    cues: [
      'Ajusta el banco entre 30° y 45°; retrae y deprime las escápulas contra el respaldo.',
      'Mantén los pies firmes en el suelo (leg drive) y glúteos siempre en contacto con el asiento.',
      'Baja la barra de forma controlada hacia la parte alta del pecho (bajo la clavícula) con codos a ~45°–60°.'
    ],
    standards: {
      M: { beginner: 0.60, intermediate: 0.90, advanced: 1.20, elite: 1.50 },
      F: { beginner: 0.35, intermediate: 0.55, advanced: 0.78, elite: 1.00 }
    },
    svg: `<svg viewBox="0 0 260 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="exercise-svg">
      <!-- Floor -->
      <line x1="20" y1="168" x2="240" y2="168" stroke="currentColor" stroke-width="2"/>
      <!-- 35-degree Incline Bench -->
      <line x1="66" y1="86" x2="142" y2="138" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-opacity="0.45"/>
      <line x1="142" y1="138" x2="166" y2="128" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-opacity="0.45"/>
      <line x1="96" y1="108" x2="86" y2="168" stroke="currentColor" stroke-width="2" stroke-opacity="0.4"/>
      <line x1="148" y1="136" x2="156" y2="168" stroke="currentColor" stroke-width="2" stroke-opacity="0.4"/>
      <!-- Lifter on Incline Bench -->
      <circle cx="80" cy="76" r="9.5" stroke="currentColor" stroke-width="2.2"/>
      <!-- Torso on bench -->
      <line x1="94" y1="88" x2="142" y2="128" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>
      <!-- Thigh & Lower leg -->
      <line x1="142" y1="128" x2="178" y2="126" stroke="currentColor" stroke-width="4.5" stroke-linecap="round"/>
      <line x1="178" y1="126" x2="184" y2="166" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
      <!-- Arms pressing vertically from upper chest -->
      <line x1="102" y1="92" x2="102" y2="44" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
      <!-- Barbell & Plates -->
      <circle cx="102" cy="44" r="15" stroke="currentColor" stroke-width="2.2" fill="currentColor" fill-opacity="0.08"/>
      <circle cx="102" cy="44" r="4.5" fill="currentColor"/>
      <line x1="102" y1="44" x2="102" y2="92" stroke="currentColor" stroke-width="1.2" stroke-dasharray="3 2" stroke-opacity="0.5"/>
      <text x="128" y="34" fill="currentColor" font-family="monospace" font-size="10" font-weight="700">05 // BANCA INCLINADO</text>
      <text x="128" y="48" fill="currentColor" font-family="monospace" font-size="9" opacity="0.65">ÁNGULO 30°–45°</text>
    </svg>`
  },
  {
    id: 'pullup',
    name: 'Pull Up (Dominadas)',
    subtitle: 'Pronated Pull-Up (Peso Corporal + Lastre)',
    category: 'Tracción Vertical de Tren Superior',
    muscles: 'Dorsal Ancho, Bíceps Braquial, Braquiorradial, Romboides y Trapecio Inferior',
    isBodyweightPlus: true,
    cues: [
      'Inicia desde suspensión completa (brazos extendidos) activando la depresión escapular.',
      'Tracciona llevando los codos hacia las costillas y el pecho hacia la barra hasta pasar la barbilla.',
      'Controla la fase excéntrica sin balanceo de cadera (kipping).'
    ],
    // Ratios use Total Systemic Load (Bodyweight + External Weight) / Bodyweight
    standards: {
      M: { beginner: 1.0, intermediate: 1.18, advanced: 1.40, elite: 1.65 },
      F: { beginner: 0.82, intermediate: 1.00, advanced: 1.15, elite: 1.32 }
    },
    svg: `<svg viewBox="0 0 260 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="exercise-svg">
      <!-- Overhead Pull-up Bar -->
      <line x1="60" y1="42" x2="200" y2="42" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>
      <!-- Hands on bar -->
      <circle cx="102" cy="42" r="3.5" fill="currentColor"/>
      <circle cx="158" cy="42" r="3.5" fill="currentColor"/>
      <!-- Head clearing bar -->
      <circle cx="130" cy="34" r="9.5" stroke="currentColor" stroke-width="2.2"/>
      <!-- Flexed Arms pulling up -->
      <polyline points="102,42 94,68 116,58" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <polyline points="158,42 166,68 144,58" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- V-Taper Back / Lats -->
      <path d="M114 56 L146 56 L138 104 L122 104 Z" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.12"/>
      <!-- Lower body hanging -->
      <line x1="125" y1="104" x2="124" y2="162" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
      <line x1="135" y1="104" x2="136" y2="162" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
      <!-- Optional weight plate on belt -->
      <circle cx="130" cy="128" r="9" stroke="currentColor" stroke-width="1.8" fill="currentColor" fill-opacity="0.08"/>
      <text x="24" y="184" fill="currentColor" font-family="monospace" font-size="10" font-weight="700">06 // PULL UP / DOMINADAS</text>
    </svg>`
  }
];
