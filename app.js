// ============================================================================
// ANUARUS — MOTOR CLÍNICO, BIOMECÁNICO Y NUBE (app.js)
// Entrenador y Nutriólogo: Diego Rodea
// ============================================================================

const STORAGE_KEY = 'ANUARUS_CLOUD_STATE_V1';
const CLOUD_CONFIG_KEY = 'ANUARUS_CLOUD_ENDPOINT_V1';
const THEME_KEY = 'ANUARUS_THEME_V1';
const KG_TO_LB = 2.20462262185;

// ============================================================================
// 1. BASE DE DATOS INDEXED-DB PARA VIDEOS LOCALES DE ALTA CAPACIDAD
// ============================================================================
const VideoStore = {
  dbName: 'AnuarusVideoDB',
  storeName: 'videos',
  open() {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) return resolve(null);
      const req = indexedDB.open(this.dbName, 1);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    });
  },
  async saveBlob(id, blob) {
    const db = await this.open();
    if (!db) return false;
    return new Promise((resolve) => {
      const tx = db.transaction(this.storeName, 'readwrite');
      tx.objectStore(this.storeName).put(blob, id);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  },
  async getBlobUrl(id) {
    const db = await this.open();
    if (!db) return null;
    return new Promise((resolve) => {
      const tx = db.transaction(this.storeName, 'readonly');
      const req = tx.objectStore(this.storeName).get(id);
      req.onsuccess = () => {
        if (req.result) {
          resolve(URL.createObjectURL(req.result));
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  },
  async deleteBlob(id) {
    const db = await this.open();
    if (!db) return;
    const tx = db.transaction(this.storeName, 'readwrite');
    tx.objectStore(this.storeName).delete(id);
  }
};

// ============================================================================
// 2. DATOS INICIALES (DEMO REALISTA PARA PRUEBA INMEDIATA)
// ============================================================================
function getInitialSeedData() {
  const today = new Date();
  const fmtDate = (daysAgo) => {
    const d = new Date(today);
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split('T')[0];
  };
  const futureDate = (daysAhead) => {
    const d = new Date(today);
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString().split('T')[0];
  };

  return {
    lastUpdated: new Date().toISOString(),
    coachProfile: {
      name: 'Diego Rodea',
      title: 'Entrenador & Nutriólogo Clínico',
      whatsapp: '5215500000000',
      generalAnnouncement: 'Recuerda registrar tus levantamientos en cada sesión buscando superar por al menos 1 repetición o 1.25–2.5 kg la marca de la semana pasada manteniendo técnica estricta.'
    },
    users: [
      {
        id: 'usr_carlos',
        username: 'carlos',
        password: '123',
        name: 'Carlos Mendoza',
        sex: 'M',
        age: 28,
        weightKg: 82.0,
        heightCm: 178,
        preferredUnit: 'kg',
        active: true,
        paymentDate: futureDate(12),
        goal: 'Recomposición Corporal & Fuerza Avanzada',
        coachFeedback: 'Excelente progresión en Peso Muerto y Press Inclinado estas últimas 3 semanas. Prioriza controlar la fase excéntrica en Dominadas y agrega 2 series directas para gemelo y bíceps al final de la sesión para equilibrar perímetros.',
        coachFeedbackDate: fmtDate(2),
        measurements: {
          waist: 81.0,
          neck: 40.5,
          hip: 98.0,
          arm: 38.5,
          calf: 37.5,
          thigh: 58.0,
          updatedAt: fmtDate(1)
        },
        measurementsHistory: [
          { date: fmtDate(21), weightKg: 83.2, waist: 83.5, neck: 40.0, hip: 99.0, arm: 37.8, calf: 37.0, thigh: 57.0 },
          { date: fmtDate(14), weightKg: 82.6, waist: 82.2, neck: 40.2, hip: 98.5, arm: 38.1, calf: 37.2, thigh: 57.5 },
          { date: fmtDate(1), weightKg: 82.0, waist: 81.0, neck: 40.5, hip: 98.0, arm: 38.5, calf: 37.5, thigh: 58.0 }
        ],
        sessions: [
          {
            id: 'ses_c1',
            date: fmtDate(21),
            unit: 'kg',
            notes: 'Semana 1 - Base de fuerza sólida',
            exercises: [
              { exerciseId: 'deadlift', sets: [{ weightKg: 130, reps: 5 }, { weightKg: 135, reps: 5 }, { weightKg: 140, reps: 4 }] },
              { exerciseId: 'squat', sets: [{ weightKg: 105, reps: 5 }, { weightKg: 110, reps: 5 }, { weightKg: 112.5, reps: 5 }] },
              { exerciseId: 'incline_bench', sets: [{ weightKg: 75, reps: 6 }, { weightKg: 77.5, reps: 6 }] },
              { exerciseId: 'pullup', sets: [{ weightKg: 10, reps: 6 }, { weightKg: 10, reps: 5 }] }
            ]
          },
          {
            id: 'ses_c2',
            date: fmtDate(14),
            unit: 'kg',
            notes: 'Semana 2 - Mejor velocidad de barra en sentadilla',
            exercises: [
              { exerciseId: 'deadlift', sets: [{ weightKg: 135, reps: 5 }, { weightKg: 142.5, reps: 5 }, { weightKg: 145, reps: 4 }] },
              { exerciseId: 'squat', sets: [{ weightKg: 110, reps: 5 }, { weightKg: 115, reps: 5 }, { weightKg: 117.5, reps: 4 }] },
              { exerciseId: 'dips', sets: [{ weightKg: 15, reps: 8 }, { weightKg: 20, reps: 6 }] },
              { exerciseId: 'ohp', sets: [{ weightKg: 50, reps: 6 }, { weightKg: 52.5, reps: 5 }] }
            ]
          },
          {
            id: 'ses_c3',
            date: fmtDate(7),
            unit: 'kg',
            notes: 'Semana Pasada - Récord en Peso Muerto y Banca Inclinada',
            exercises: [
              { exerciseId: 'deadlift', sets: [{ weightKg: 140, reps: 5 }, { weightKg: 147.5, reps: 5 }, { weightKg: 152.5, reps: 4 }] },
              { exerciseId: 'squat', sets: [{ weightKg: 115, reps: 5 }, { weightKg: 120, reps: 5 }] },
              { exerciseId: 'dips', sets: [{ weightKg: 20, reps: 8 }, { weightKg: 22.5, reps: 6 }] },
              { exerciseId: 'ohp', sets: [{ weightKg: 52.5, reps: 6 }, { weightKg: 55, reps: 5 }] },
              { exerciseId: 'incline_bench', sets: [{ weightKg: 80, reps: 6 }, { weightKg: 82.5, reps: 5 }] },
              { exerciseId: 'pullup', sets: [{ weightKg: 12.5, reps: 6 }, { weightKg: 15, reps: 5 }] }
            ]
          }
        ],
        videos: [
          {
            id: 'vid_demo_1',
            date: fmtDate(6),
            exerciseId: 'deadlift',
            weightKg: 152.5,
            reps: 4,
            userNotes: 'Última serie pesada de la semana pasada. ¿Cómo ves la posición lumbar en la 4ª repetición?',
            externalUrl: '',
            hasLocalBlob: false,
            status: 'reviewed',
            rating: 'Técnica Sólida (Ajuste Menor)',
            coachComment: 'Buen bloqueo y bisagra de cadera en las primeras 3 reps. En la 4ª repetición la barra se separa 2 cm de la tibia al despegar; enfócate en tensar el dorsal ("proteger las axilas") antes de empujar el piso.'
          }
        ]
      },
      {
        id: 'usr_valeria',
        username: 'valeria',
        password: '123',
        name: 'Valeria Gómez',
        sex: 'F',
        age: 26,
        weightKg: 60.5,
        heightCm: 165,
        preferredUnit: 'kg',
        active: true,
        paymentDate: futureDate(3),
        goal: 'Hipertrofia Estética & Fuerza Tren Inferior',
        coachFeedback: 'Gran simetría en tren inferior y cintura. Vamos a priorizar el Press Militar y Dominadas para mejorar el puntaje de fuerza de tren superior este mes.',
        coachFeedbackDate: fmtDate(3),
        measurements: {
          waist: 66.0,
          neck: 32.0,
          hip: 96.5,
          arm: 29.0,
          calf: 35.0,
          thigh: 55.5,
          updatedAt: fmtDate(2)
        },
        measurementsHistory: [
          { date: fmtDate(14), weightKg: 61.0, waist: 67.2, neck: 32.0, hip: 96.0, arm: 28.5, calf: 34.8, thigh: 55.0 },
          { date: fmtDate(2), weightKg: 60.5, waist: 66.0, neck: 32.0, hip: 96.5, arm: 29.0, calf: 35.0, thigh: 55.5 }
        ],
        sessions: [
          {
            id: 'ses_v1',
            date: fmtDate(14),
            unit: 'kg',
            notes: 'Sesión Fuerza Base',
            exercises: [
              { exerciseId: 'deadlift', sets: [{ weightKg: 75, reps: 6 }, { weightKg: 80, reps: 5 }] },
              { exerciseId: 'squat', sets: [{ weightKg: 65, reps: 6 }, { weightKg: 70, reps: 5 }] },
              { exerciseId: 'ohp', sets: [{ weightKg: 25, reps: 6 }, { weightKg: 27.5, reps: 5 }] },
              { exerciseId: 'pullup', sets: [{ weightKg: 0, reps: 5 }, { weightKg: 0, reps: 4 }] }
            ]
          },
          {
            id: 'ses_v2',
            date: fmtDate(7),
            unit: 'kg',
            notes: 'Semana Pasada - Subida en Sentadilla y Peso Muerto',
            exercises: [
              { exerciseId: 'deadlift', sets: [{ weightKg: 80, reps: 6 }, { weightKg: 85, reps: 5 }] },
              { exerciseId: 'squat', sets: [{ weightKg: 70, reps: 6 }, { weightKg: 75, reps: 5 }] },
              { exerciseId: 'dips', sets: [{ weightKg: 0, reps: 8 }, { weightKg: 2.5, reps: 6 }] },
              { exerciseId: 'ohp', sets: [{ weightKg: 27.5, reps: 6 }, { weightKg: 30, reps: 4 }] },
              { exerciseId: 'incline_bench', sets: [{ weightKg: 35, reps: 6 }, { weightKg: 37.5, reps: 5 }] },
              { exerciseId: 'pullup', sets: [{ weightKg: 0, reps: 6 }, { weightKg: 2.5, reps: 4 }] }
            ]
          }
        ],
        videos: []
      }
    ]
  };
}

// ============================================================================
// 3. CÁLCULOS CLÍNICOS (GRASA CORPORAL US NAVY, FFMI, SIMETRÍA Y PUNTOS DÉBILES)
// ============================================================================
const ClinicalEngine = {
  // US Navy Body Fat % Formula
  calculateBodyFat(sex, heightCm, waistCm, neckCm, hipCm) {
    const h = Number(heightCm) || 170;
    const w = Number(waistCm) || 80;
    const n = Number(neckCm) || 38;
    const hip = Number(hipCm) || 95;

    if (h <= 0 || w <= 0 || n <= 0) return 18.0;

    let bf = 18.0;
    if (sex === 'F') {
      const diff = w + hip - n;
      if (diff <= 10) return 16.0;
      bf = 495 / (1.29579 - 0.35004 * Math.log10(diff) + 0.22100 * Math.log10(h)) - 450;
    } else {
      const diff = w - n;
      if (diff <= 5) return 8.0;
      bf = 495 / (1.0324 - 0.19077 * Math.log10(diff) + 0.15456 * Math.log10(h)) - 450;
    }
    return Math.max(4.0, Math.min(50.0, Number(bf.toFixed(1))));
  },

  // Body Fat Category
  getBodyFatCategory(sex, bf) {
    if (sex === 'F') {
      if (bf < 14) return { label: 'Grasa Esencial / Competencia', status: 'Muy Bajo' };
      if (bf < 21) return { label: 'Atlético Definido', status: 'Óptimo Atlético' };
      if (bf < 25) return { label: 'Fitness Saludable', status: 'Saludable' };
      if (bf < 32) return { label: 'Promedio Clínico', status: 'Moderado' };
      return { label: 'Porcentaje Elevado (Priorizar Déficit)', status: 'Elevado' };
    } else {
      if (bf < 8) return { label: 'Competencia / Muy Bajo', status: 'Muy Bajo' };
      if (bf < 14) return { label: 'Atlético Definido', status: 'Óptimo Atlético' };
      if (bf < 18) return { label: 'Fitness Estético', status: 'Saludable' };
      if (bf < 25) return { label: 'Promedio Clínico', status: 'Moderado' };
      return { label: 'Porcentaje Elevado (Priorizar Déficit)', status: 'Elevado' };
    }
  },

  // FFMI & Normalized FFMI Calculation
  calculateFFMI(weightKg, heightCm, bodyFatPct, sex) {
    const w = Number(weightKg) || 70;
    const hMeters = (Number(heightCm) || 170) / 100;
    const bf = Number(bodyFatPct) || 18;

    const fatMassKg = w * (bf / 100);
    const leanMassKg = w - fatMassKg;
    const ffmi = leanMassKg / (hMeters * hMeters);
    // Normalized to 1.80m
    const normalizedFfmi = ffmi + 6.1 * (1.8 - hMeters);

    let level = 'Promedio';
    let scorePct = 50;

    if (sex === 'F') {
      if (normalizedFfmi < 14.5) { level = 'Inicial / Baja Masa Muscular'; scorePct = 28; }
      else if (normalizedFfmi < 16.0) { level = 'Promedio'; scorePct = 48; }
      else if (normalizedFfmi < 17.8) { level = 'Atlético / Intermedio'; scorePct = 70; }
      else if (normalizedFfmi < 19.5) { level = 'Avanzado'; scorePct = 88; }
      else { level = 'Élite Natural'; scorePct = 98; }
    } else {
      if (normalizedFfmi < 18.0) { level = 'Inicial / Baja Masa Muscular'; scorePct = 28; }
      else if (normalizedFfmi < 19.8) { level = 'Promedio'; scorePct = 48; }
      else if (normalizedFfmi < 21.8) { level = 'Atlético / Intermedio'; scorePct = 70; }
      else if (normalizedFfmi < 23.8) { level = 'Avanzado'; scorePct = 88; }
      else { level = 'Élite Natural'; scorePct = 98; }
    }

    return {
      fatMassKg: Number(fatMassKg.toFixed(1)),
      leanMassKg: Number(leanMassKg.toFixed(1)),
      ffmi: Number(ffmi.toFixed(2)),
      normalizedFfmi: Number(normalizedFfmi.toFixed(2)),
      level,
      scorePct
    };
  },

  // Full Anthropometric Weak Points & Improvement Diagnosis
  analyzePhysique(user) {
    const m = user.measurements || {};
    const sex = user.sex || 'M';
    const h = Number(user.heightCm) || 170;
    const w = Number(user.weightKg) || 70;
    const waist = Number(m.waist) || 80;
    const neck = Number(m.neck) || 38;
    const hip = Number(m.hip) || 95;
    const arm = Number(m.arm) || 35;
    const calf = Number(m.calf) || 36;
    const thigh = Number(m.thigh) || 55;

    const bf = this.calculateBodyFat(sex, h, waist, neck, hip);
    const bfCat = this.getBodyFatCategory(sex, bf);
    const ffmiData = this.calculateFFMI(w, h, bf, sex);

    // Ideal Aesthetic & Athletic Proportions based on Height & Frame
    const idealWaist = sex === 'M' ? +(h * 0.445).toFixed(1) : +(h * 0.405).toFixed(1);
    const idealArm = sex === 'M' ? +(neck * 1.00).toFixed(1) : +(neck * 0.90).toFixed(1);
    const idealCalf = sex === 'M' ? +(neck * 0.98).toFixed(1) : +(neck * 1.04).toFixed(1);
    const idealThigh = sex === 'M' ? +(idealWaist * 0.72).toFixed(1) : +(idealWaist * 0.82).toFixed(1);
    const waistToHeight = +(waist / h).toFixed(2);
    const waistToHip = +(waist / hip).toFixed(2);

    const weakPoints = [];
    const strongPoints = [];
    const actionPlan = [];

    // 1. Body Fat & Waist Evaluation
    if ((sex === 'M' && bf > 18.5) || (sex === 'F' && bf > 26.5) || waistToHeight > 0.49) {
      weakPoints.push(`Grasa corporal (${bf}%) y relación cintura/altura (${waistToHeight}) por encima del rango atlético ideal.`);
      actionPlan.push(`Nutrición: Aplicar déficit calórico controlado (-300 a -450 kcal/día) con proteína en 2.0–2.2 g/kg para reducir cintura hacia ~${idealWaist} cm preservando masa magra.`);
    } else if ((sex === 'M' && bf <= 14.5) || (sex === 'F' && bf <= 22.0)) {
      strongPoints.push(`Composición corporal definida (${bf}% grasa corporal) y cintura compacta (${waist} cm).`);
    }

    // 2. FFMI Evaluation
    if ((sex === 'M' && ffmiData.normalizedFfmi < 19.5) || (sex === 'F' && ffmiData.normalizedFfmi < 15.8)) {
      weakPoints.push(`Densidad muscular global (FFMI Normalizado: ${ffmiData.normalizedFfmi}) en etapa de desarrollo.`);
      actionPlan.push(`Hipertrofia: Priorizar sobrecarga progresiva en los 6 básicos con superávit ligero o normocalórica alta en proteína.`);
    } else {
      strongPoints.push(`Índice de Masa Libre de Grasa sólido (FFMI ${ffmiData.ffmi} — Nivel ${ffmiData.level}).`);
    }

    // 3. Segmental Symmetry (Arms, Thighs, Calves)
    const armDiff = +(arm - idealArm).toFixed(1);
    const calfDiff = +(calf - idealCalf).toFixed(1);
    const thighDiff = +(thigh - idealThigh).toFixed(1);

    if (armDiff < -1.2) {
      weakPoints.push(`Perímetro de Brazo (${arm} cm) rezagado respecto a simetría de cuello/torso (meta ideal: ~${idealArm} cm).`);
      actionPlan.push(`Énfasis en Pull Up (Dominadas supinas/pronas) y Fondos en Paralelas con lastre para densificar bíceps y tríceps.`);
    } else {
      strongPoints.push(`Desarrollo de Brazo proporcionado (${arm} cm vs meta ${idealArm} cm).`);
    }

    if (thighDiff < -1.8) {
      weakPoints.push(`Muslo Medio (${thigh} cm) por debajo de la proporción ideal de tren inferior (meta: ~${idealThigh} cm).`);
      actionPlan.push(`Aumentar frecuencia o volumen efectivo en Sentadilla Libre y Peso Muerto buscando +2.5 kg por mes.`);
    } else {
      strongPoints.push(`Buen volumen de Muslo Medio (${thigh} cm).`);
    }

    if (calfDiff < -1.5) {
      weakPoints.push(`Pantorrilla (${calf} cm) con margen de mejora frente a la simetría clásica (~${idealCalf} cm).`);
      actionPlan.push(`Incluir trabajo específico de flexión plantar en rango completo al finalizar tus sesiones de pierna.`);
    } else {
      strongPoints.push(`Pantorrilla bien proporcionada (${calf} cm).`);
    }

    if (weakPoints.length === 0) {
      weakPoints.push('Proporciones antropométricas equilibradas sin rezagos críticos detectados.');
    }
    if (actionPlan.length === 0) {
      actionPlan.push('Mantener progresión semanal de cargas en los 6 ejercicios buscando perfeccionar el ratio de fuerza relativa.');
    }

    return {
      bf,
      bfCat,
      ffmiData,
      waistToHeight,
      waistToHip,
      comparisons: [
        { name: 'Cintura', current: waist, ideal: idealWaist, unit: 'cm', note: 'Meta estética ≤ ' + idealWaist + ' cm' },
        { name: 'Brazo', current: arm, ideal: idealArm, unit: 'cm', note: 'Simetría vs cuello' },
        { name: 'Muslo Medio', current: thigh, ideal: idealThigh, unit: 'cm', note: 'Proporción tren inferior' },
        { name: 'Pantorrilla', current: calf, ideal: idealCalf, unit: 'cm', note: 'Simetría pierna inferior' }
      ],
      weakPoints,
      strongPoints,
      actionPlan
    };
  }
};

// ============================================================================
// 4. MOTOR DE FUERZA: 1RM APROXIMADO, COMPARATIVA SEMANAL Y NIVELES
// ============================================================================
const StrengthEngine = {
  // Epley 1RM formula: 1RM = weight * (1 + reps / 30)
  // For 1 rep, 1RM = weight
  calculate1RM(weightKg, reps) {
    const w = Number(weightKg) || 0;
    const r = Number(reps) || 0;
    if (r <= 0 || w < 0) return 0;
    if (r === 1) return Number(w.toFixed(1));
    const rm = w * (1 + r / 30);
    return Number(rm.toFixed(1));
  },

  // For bodyweight+ exercises (Dips & Pull-ups), systemic load = Bodyweight + External Weight
  // We compute both External 1RM (the plate weight 1RM) and Total Systemic 1RM!
  calculateExerciseMetrics(exerciseObj, weightKg, reps, userWeightKg) {
    const extW = Number(weightKg) || 0;
    const r = Number(reps) || 0;
    const bw = Number(userWeightKg) || 75;
    if (r <= 0) return { est1RMKg: 0, systemic1RMKg: 0, ratioBW: 0 };

    if (exerciseObj.isBodyweightPlus) {
      const totalLoad = bw + extW;
      const systemic1RM = r === 1 ? totalLoad : totalLoad * (1 + r / 30);
      const ext1RM = Math.max(0, systemic1RM - bw);
      const ratioBW = systemic1RM / bw;
      return {
        est1RMKg: Number(ext1RM.toFixed(1)),
        systemic1RMKg: Number(systemic1RM.toFixed(1)),
        ratioBW: Number(ratioBW.toFixed(2))
      };
    } else {
      const rm = this.calculate1RM(extW, r);
      return {
        est1RMKg: rm,
        systemic1RMKg: rm,
        ratioBW: Number((rm / bw).toFixed(2))
      };
    }
  },

  // Classify strength level: Principiante, Intermedio, Avanzado, Élite
  classifyLevel(exerciseObj, ratioBW, sex, hasData = true) {
    if (!hasData || ratioBW <= 0) {
      return { level: 'Sin Registro', tier: 0, pctOfElite: 0 };
    }
    const std = exerciseObj.standards[sex === 'F' ? 'F' : 'M'];
    const pctOfElite = Math.min(115, Math.round((ratioBW / std.elite) * 100));

    if (ratioBW >= std.elite) {
      return { level: 'Élite', tier: 4, pctOfElite };
    } else if (ratioBW >= std.advanced) {
      return { level: 'Avanzado', tier: 3, pctOfElite };
    } else if (ratioBW >= std.intermediate) {
      return { level: 'Intermedio', tier: 2, pctOfElite };
    } else {
      return { level: 'Principiante', tier: 1, pctOfElite: Math.max(18, pctOfElite) };
    }
  },

  // Get previous session record for a given exercise BEFORE a target date (or latest overall)
  getLastSessionForExercise(user, exerciseId, beforeDate = null) {
    const sessions = (user.sessions || [])
      .filter(s => {
        if (beforeDate && s.date >= beforeDate) return false;
        return (s.exercises || []).some(e => e.exerciseId === exerciseId && (e.sets || []).length > 0);
      })
      .sort((a, b) => b.date.localeCompare(a.date));

    if (sessions.length === 0) return null;

    const latestSession = sessions[0];
    const exEntry = latestSession.exercises.find(e => e.exerciseId === exerciseId);
    const exConfig = window.ANUARUS_EXERCISES.find(x => x.id === exerciseId);

    let bestSet = null;
    let bestMetric = { est1RMKg: 0, systemic1RMKg: 0, ratioBW: 0 };

    (exEntry.sets || []).forEach(set => {
      const m = this.calculateExerciseMetrics(exConfig, set.weightKg, set.reps, user.weightKg);
      if (m.systemic1RMKg >= bestMetric.systemic1RMKg) {
        bestMetric = m;
        bestSet = set;
      }
    });

    return {
      date: latestSession.date,
      sets: exEntry.sets || [],
      bestSet,
      bestMetric
    };
  },

  // Get complete profile across all 6 exercises for a user
  getUserStrengthSummary(user) {
    const sex = user.sex || 'M';
    const bw = Number(user.weightKg) || 75;

    const byExercise = window.ANUARUS_EXERCISES.map(ex => {
      // Find best all-time and latest session
      const historyPoints = [];
      let allTimeBest = { est1RMKg: 0, systemic1RMKg: 0, ratioBW: 0, weightKg: 0, reps: 0, date: null };

      const sortedSessions = [...(user.sessions || [])].sort((a, b) => a.date.localeCompare(b.date));

      sortedSessions.forEach(ses => {
        const found = (ses.exercises || []).find(e => e.exerciseId === ex.id);
        if (found && found.sets && found.sets.length > 0) {
          let sessionBest = { est1RMKg: 0, systemic1RMKg: 0, ratioBW: 0, weightKg: 0, reps: 0 };
          found.sets.forEach(s => {
            const m = this.calculateExerciseMetrics(ex, s.weightKg, s.reps, bw);
            if (m.systemic1RMKg >= sessionBest.systemic1RMKg) {
              sessionBest = { ...m, weightKg: s.weightKg, reps: s.reps };
            }
          });
          historyPoints.push({
            date: ses.date,
            ...sessionBest,
            sets: found.sets
          });
          if (sessionBest.systemic1RMKg >= allTimeBest.systemic1RMKg) {
            allTimeBest = { ...sessionBest, date: ses.date };
          }
        }
      });

      const latest = historyPoints.length > 0 ? historyPoints[historyPoints.length - 1] : null;
      const previous = historyPoints.length > 1 ? historyPoints[historyPoints.length - 2] : null;
      const activeMetric = latest || allTimeBest;
      const classification = this.classifyLevel(ex, activeMetric.ratioBW, sex, !!latest);

      // Delta vs previous session
      let delta1RMKg = null;
      if (latest && previous) {
        delta1RMKg = Number((latest.est1RMKg - previous.est1RMKg).toFixed(1));
      }

      return {
        exercise: ex,
        hasData: !!latest,
        latest,
        previous,
        allTimeBest,
        historyPoints,
        classification,
        delta1RMKg
      };
    });

    const recorded = byExercise.filter(x => x.hasData);
    const avgPctElite = recorded.length > 0
      ? Math.round(recorded.reduce((acc, x) => acc + x.classification.pctOfElite, 0) / recorded.length)
      : 0;

    let overallLevel = 'Principiante';
    if (avgPctElite >= 95) overallLevel = 'Élite';
    else if (avgPctElite >= 75) overallLevel = 'Avanzado';
    else if (avgPctElite >= 52) overallLevel = 'Intermedio';

    // Sort recorded exercises by pctOfElite to identify Strongest vs Weakest lifts
    const sortedByStrength = [...recorded].sort((a, b) => b.classification.pctOfElite - a.classification.pctOfElite);
    const strongestLift = sortedByStrength[0] || null;
    const weakestLift = sortedByStrength[sortedByStrength.length - 1] || null;

    return {
      byExercise,
      avgPctElite,
      overallLevel,
      strongestLift,
      weakestLift
    };
  }
};

// ============================================================================
// 5. MOTOR DE NUBE Y PERSISTENCIA (LOCAL + REST CLOUD SYNC PARA GITHUB PAGES)
// ============================================================================
const CloudSync = {
  getConfig() {
    try {
      return JSON.parse(localStorage.getItem(CLOUD_CONFIG_KEY) || '{}');
    } catch {
      return {};
    }
  },
  saveConfig(cfg) {
    localStorage.setItem(CLOUD_CONFIG_KEY, JSON.stringify(cfg));
  },
  async pushToCloud(stateData) {
    const cfg = this.getConfig();
    if (!cfg.endpointUrl) return { ok: true, mode: 'local' };
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (cfg.apiKey) {
        headers['X-Master-Key'] = cfg.apiKey;
        headers['Authorization'] = `Bearer ${cfg.apiKey}`;
      }
      const res = await fetch(cfg.endpointUrl, {
        method: 'PUT',
        headers,
        body: JSON.stringify(stateData)
      });
      return { ok: res.ok, mode: 'cloud' };
    } catch (e) {
      console.warn('Cloud push error:', e);
      return { ok: false, mode: 'error' };
    }
  },
  async pullFromCloud() {
    const cfg = this.getConfig();
    if (!cfg.endpointUrl) return null;
    try {
      const headers = {};
      if (cfg.apiKey) {
        headers['X-Master-Key'] = cfg.apiKey;
        headers['Authorization'] = `Bearer ${cfg.apiKey}`;
      }
      const res = await fetch(cfg.endpointUrl, { headers });
      if (!res.ok) return null;
      const json = await res.json();
      return json.record ? json.record : json;
    } catch (e) {
      console.warn('Cloud pull error:', e);
      return null;
    }
  }
};

// ============================================================================
// 6. ESTADO GLOBAL DE LA APLICACIÓN ANUARUS
// ============================================================================
const AppState = {
  db: null,
  currentUser: null, // { role: 'admin' } or { role: 'user', userId: '...' }
  impersonatingUserId: null, // Admin viewing a specific client's full dashboard
  activeTab: 'dashboard',
  theme: localStorage.getItem(THEME_KEY) || 'light',
  // Workout logger draft state
  workoutDraft: {
    date: new Date().toISOString().split('T')[0],
    unit: 'kg',
    selectedExercises: ['deadlift', 'squat', 'incline_bench'],
    setsByExercise: {},
    notes: ''
  },
  selectedProgressExercise: 'all',

  init() {
    document.documentElement.setAttribute('data-theme', this.theme);
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        this.db = JSON.parse(raw);
      } catch {
        this.db = getInitialSeedData();
      }
    } else {
      this.db = getInitialSeedData();
      this.persist(false);
    }

    // Check URL hash for portable shared state snapshot (#sync=...)
    this.checkUrlSyncImport();

    // Pull from cloud if configured
    CloudSync.pullFromCloud().then(remoteDb => {
      if (remoteDb && remoteDb.users) {
        this.db = remoteDb;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.db));
        this.render();
      }
    });

    this.render();
  },

  persist(syncRemote = true) {
    this.db.lastUpdated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.db));
    if (syncRemote) {
      CloudSync.pushToCloud(this.db).then(status => {
        const dot = document.getElementById('cloud-status-text');
        if (dot) {
          dot.textContent = status.mode === 'cloud' ? 'Nube Sincronizada (Remoto + Local)' : 'Nube Activa (Guardado Automático)';
        }
      });
    }
  },

  checkUrlSyncImport() {
    if (window.location.hash && window.location.hash.startsWith('#anuarus_import=')) {
      try {
        const b64 = decodeURIComponent(window.location.hash.replace('#anuarus_import=', ''));
        const decoded = JSON.parse(decodeURIComponent(escape(atob(b64))));
        if (decoded && decoded.users) {
          this.db = decoded;
          this.persist(false);
          window.history.replaceState(null, '', window.location.pathname);
          setTimeout(() => showToast('Base de datos Anuarus importada y sincronizada.'), 300);
        }
      } catch (e) {
        console.warn('Error importing URL state:', e);
      }
    }
  },

  getActiveClient() {
    const id = this.impersonatingUserId || (this.currentUser && this.currentUser.userId);
    if (!id) return null;
    return (this.db.users || []).find(u => u.id === id) || null;
  },

  formatWeight(weightKg, unit = 'kg') {
    const w = Number(weightKg) || 0;
    if (unit === 'lb') {
      return `${(w * KG_TO_LB).toFixed(1)} lb`;
    }
    return `${w.toFixed(1)} kg`;
  },

  convertWeightValue(weightKg, unit = 'kg') {
    const w = Number(weightKg) || 0;
    return unit === 'lb' ? Number((w * KG_TO_LB).toFixed(1)) : Number(w.toFixed(1));
  },

  toKg(val, unit = 'kg') {
    const v = Number(val) || 0;
    return unit === 'lb' ? Number((v / KG_TO_LB).toFixed(2)) : v;
  }
};

// ============================================================================
// 7. GRÁFICAS EN CANVAS DE ALTA DEFINICIÓN (PROGRESO SEMANAL & RADAR FUERZAS)
// ============================================================================
const ChartRenderer = {
  // 1. Hexagonal Radar Chart for Strong vs Weak Points (6 Exercises)
  drawStrengthRadar(canvasId, summary) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width || 420;
    const h = rect.height || 340;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const fg = isDark ? '#FAFAFA' : '#0A0A0A';
    const muted = isDark ? '#525252' : '#D4D4D4';
    const subText = isDark ? '#A3A3A3' : '#525252';

    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2 + 6;
    const radius = Math.min(w, h) * 0.33;
    const items = summary.byExercise;
    const total = items.length; // 6

    // Draw concentric polygons (25%, 50%, 75%, 100% Élite)
    const levels = [0.25, 0.5, 0.75, 1.0];
    levels.forEach((lvl, idx) => {
      ctx.beginPath();
      for (let i = 0; i < total; i++) {
        const angle = (Math.PI * 2 * i) / total - Math.PI / 2;
        const x = cx + Math.cos(angle) * radius * lvl;
        const y = cy + Math.sin(angle) * radius * lvl;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = idx === 3 ? fg : muted;
      ctx.lineWidth = idx === 3 ? 1.3 : 0.8;
      if (idx < 3) ctx.setLineDash([3, 3]);
      else ctx.setLineDash([]);
      ctx.stroke();
    });
    ctx.setLineDash([]);

    // Draw axes and labels
    items.forEach((item, i) => {
      const angle = (Math.PI * 2 * i) / total - Math.PI / 2;
      const xEnd = cx + Math.cos(angle) * radius;
      const yEnd = cy + Math.sin(angle) * radius;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(xEnd, yEnd);
      ctx.strokeStyle = muted;
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Label position
      const lx = cx + Math.cos(angle) * (radius + 28);
      const ly = cy + Math.sin(angle) * (radius + 20);
      ctx.fillStyle = fg;
      ctx.font = '600 11px Inter, sans-serif';
      ctx.textAlign = Math.abs(Math.cos(angle)) < 0.2 ? 'center' : (Math.cos(angle) > 0 ? 'left' : 'right');
      ctx.textBaseline = 'middle';
      const shortName = item.exercise.name.replace('Press de ', '').replace(' (Dominadas)', '');
      ctx.fillText(shortName, lx, ly - 6);

      ctx.fillStyle = subText;
      ctx.font = '500 10px "JetBrains Mono", monospace';
      ctx.fillText(`${item.classification.pctOfElite}% (${item.classification.level})`, lx, ly + 8);
    });

    // Draw Athlete Polygon
    ctx.beginPath();
    items.forEach((item, i) => {
      const norm = Math.max(0.1, Math.min(1.08, item.classification.pctOfElite / 100));
      const angle = (Math.PI * 2 * i) / total - Math.PI / 2;
      const x = cx + Math.cos(angle) * radius * norm;
      const y = cy + Math.sin(angle) * radius * norm;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(10, 10, 10, 0.12)';
    ctx.fill();
    ctx.strokeStyle = fg;
    ctx.lineWidth = 2.4;
    ctx.stroke();

    // Draw vertex dots
    items.forEach((item, i) => {
      const norm = Math.max(0.1, Math.min(1.08, item.classification.pctOfElite / 100));
      const angle = (Math.PI * 2 * i) / total - Math.PI / 2;
      const x = cx + Math.cos(angle) * radius * norm;
      const y = cy + Math.sin(angle) * radius * norm;
      ctx.beginPath();
      ctx.arc(x, y, 4.2, 0, Math.PI * 2);
      ctx.fillStyle = fg;
      ctx.fill();
    });
  },

  // 2. Weekly 1RM Progression Line Chart
  drawProgressionChart(canvasId, summary, filterExerciseId, unit = 'kg') {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width || 560;
    const h = rect.height || 300;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const fg = isDark ? '#FAFAFA' : '#0A0A0A';
    const gridColor = isDark ? '#262626' : '#E5E5E5';
    const subText = isDark ? '#A3A3A3' : '#525252';

    ctx.clearRect(0, 0, w, h);

    const pad = { top: 28, right: 28, bottom: 42, left: 54 };
    const plotW = w - pad.left - pad.right;
    const plotH = h - pad.top - pad.bottom;

    // Collect series
    const targetExercises = filterExerciseId === 'all'
      ? summary.byExercise.filter(x => x.historyPoints.length > 0)
      : summary.byExercise.filter(x => x.exercise.id === filterExerciseId && x.historyPoints.length > 0);

    // Collect all unique dates
    const dateSet = new Set();
    let minVal = Infinity;
    let maxVal = 0;

    targetExercises.forEach(exItem => {
      exItem.historyPoints.forEach(pt => {
        dateSet.add(pt.date);
        const val = AppState.convertWeightValue(pt.est1RMKg, unit);
        if (val < minVal) minVal = val;
        if (val > maxVal) maxVal = val;
      });
    });

    const dates = Array.from(dateSet).sort();
    if (dates.length === 0) {
      ctx.fillStyle = subText;
      ctx.font = '500 13px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Registra sesiones para visualizar la curva de progreso semanal de 1RM.', w / 2, h / 2);
      return;
    }

    if (minVal === Infinity) minVal = 0;
    minVal = Math.max(0, Math.floor(minVal * 0.85));
    maxVal = Math.ceil(maxVal * 1.1 + 5);
    if (maxVal <= minVal) maxVal = minVal + 20;

    // Horizontal grid lines
    const steps = 4;
    for (let i = 0; i <= steps; i++) {
      const y = pad.top + (plotH * i) / steps;
      const val = Math.round(maxVal - ((maxVal - minVal) * i) / steps);
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(pad.left + plotW, y);
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = subText;
      ctx.font = '500 10px "JetBrains Mono", monospace';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${val}${unit}`, pad.left - 8, y);
    }

    // X-axis date labels
    dates.forEach((d, idx) => {
      const x = dates.length === 1
        ? pad.left + plotW / 2
        : pad.left + (plotW * idx) / (dates.length - 1);
      ctx.fillStyle = subText;
      ctx.font = '500 10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(d.slice(5), x, h - 14);
    });

    // Line styles for monochrome distinction
    const dashPatterns = [[], [6, 4], [2, 3], [10, 4, 2, 4], [4, 4], [8, 3]];

    targetExercises.forEach((exItem, sIdx) => {
      const pts = exItem.historyPoints.map(pt => {
        const dIdx = dates.indexOf(pt.date);
        const x = dates.length === 1
          ? pad.left + plotW / 2
          : pad.left + (plotW * dIdx) / (dates.length - 1);
        const val = AppState.convertWeightValue(pt.est1RMKg, unit);
        const y = pad.top + plotH - ((val - minVal) / (maxVal - minVal)) * plotH;
        return { x, y, val, date: pt.date };
      });

      ctx.beginPath();
      ctx.setLineDash(dashPatterns[sIdx % dashPatterns.length]);
      pts.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.strokeStyle = fg;
      ctx.lineWidth = filterExerciseId === 'all' ? 2 : 2.8;
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw points & value labels
      pts.forEach((p, i) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = fg;
        ctx.fill();

        if (filterExerciseId !== 'all' || i === pts.length - 1) {
          ctx.fillStyle = fg;
          ctx.font = '700 10px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillText(
            filterExerciseId === 'all'
              ? `${exItem.exercise.name.split(' ')[0]}: ${p.val}${unit}`
              : `${p.val} ${unit}`,
            p.x,
            p.y - 10
          );
        }
      });
    });
  }
};

// ============================================================================
// 8. UTILIDADES DE INTERFAZ Y FECHAS DE PAGO
// ============================================================================
function showToast(msg) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  container.appendChild(el);
  setTimeout(() => {
    el.remove();
  }, 3600);
}

function getPaymentStatus(paymentDateStr) {
  if (!paymentDateStr) return { label: 'Sin Fecha', badgeClass: 'badge-dashed', daysLeft: 0 };
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(paymentDateStr + 'T00:00:00');
  const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { label: `VENCIDO (${Math.abs(diffDays)}d)`, badgeClass: 'badge-solid', daysLeft: diffDays };
  }
  if (diffDays <= 5) {
    return { label: `PRÓXIMO (${diffDays}d)`, badgeClass: 'badge-outline', daysLeft: diffDays };
  }
  return { label: `AL CORRIENTE (${paymentDateStr})`, badgeClass: 'badge', daysLeft: diffDays };
}

function escapeHtml(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ============================================================================
// 9. RENDERIZADO PRINCIPAL DE LA APLICACIÓN
// ============================================================================
AppState.render = function() {
  const root = document.getElementById('app-root');
  if (!root) return;

  if (!this.currentUser) {
    root.innerHTML = renderAuthView();
    bindAuthEvents();
    refreshLogos();
    return;
  }

  // If Admin is NOT impersonating a user, show the Admin Dashboard (or let Admin switch tabs)
  if (this.currentUser.role === 'admin' && !this.impersonatingUserId) {
    root.innerHTML = renderAdminShell();
    bindAdminEvents();
    refreshLogos();
    return;
  }

  // Client View (or Admin inspecting a client)
  const client = this.getActiveClient();
  if (!client) {
    this.impersonatingUserId = null;
    this.currentUser = null;
    this.render();
    return;
  }

  root.innerHTML = renderClientShell(client);
  bindClientEvents(client);
  refreshLogos();

  // Render charts if on relevant tab
  if (this.activeTab === 'dashboard' || this.activeTab === 'progress') {
    setTimeout(() => {
      const summary = StrengthEngine.getUserStrengthSummary(client);
      ChartRenderer.drawStrengthRadar('radar-canvas', summary);
      ChartRenderer.drawProgressionChart('progress-canvas', summary, this.selectedProgressExercise, client.preferredUnit || 'kg');
    }, 30);
  }

  // Load local IndexedDB videos if on videos tab
  if (this.activeTab === 'videos') {
    loadClientVideoBlobs(client);
  }
};

function refreshLogos() {
  document.querySelectorAll('img[data-anuarus-logo]').forEach(el => {
    el.src = window.ANUARUS_TRANSPARENT_LOGO || window.ANUARUS_RAW_LOGO;
  });
}

// ============================================================================
// 10. VISTA DE INICIO DE SESIÓN (ADMIN: diego rodea / 123456 & CLIENTES)
// ============================================================================
function renderAuthView() {
  const activeClients = (AppState.db.users || []).filter(u => u.active);
  return `
    <div class="auth-wrapper">
      <div class="auth-card">
        <div class="auth-header">
          <div class="logo-frame auth-logo">
            <img data-anuarus-logo src="${window.ANUARUS_TRANSPARENT_LOGO || ''}" alt="Anuarus Logo" style="width:100%;height:100%;" />
          </div>
          <h1 class="auth-title">ANUARUS</h1>
          <p class="auth-subtitle">Clinical Nutrition &amp; Strength System // Diego Rodea</p>
        </div>

        <form id="login-form">
          <div class="form-group">
            <label class="form-label">
              <span>USUARIO / CUENTA</span>
              <span class="mono" style="font-size:0.7rem;color:var(--text-muted);">ADMIN O PACIENTE</span>
            </label>
            <input type="text" id="login-username" class="form-input" placeholder="Ej. diego rodea" required autocomplete="username" />
          </div>

          <div class="form-group">
            <label class="form-label">
              <span>CONTRASEÑA</span>
            </label>
            <input type="password" id="login-password" class="form-input mono" placeholder="••••••" required autocomplete="current-password" />
          </div>

          <div id="login-error" style="display:none;margin-bottom:1rem;padding:0.7rem;border:1px solid var(--border-strong);background:var(--bg-secondary);font-size:0.82rem;font-weight:600;"></div>

          <button type="submit" class="btn btn-block" style="padding:0.8rem;">
            INGRESAR A PLATAFORMA ANUARUS
          </button>
        </form>

        <div class="quick-access-pills">
          <div class="eyebrow">ACCESO RÁPIDO DEMOSTRACIÓN:</div>
          <div class="pill-list">
            <button type="button" class="pill-btn" data-quick-user="diego rodea" data-quick-pass="123456">
              ★ Admin: diego rodea
            </button>
            ${activeClients.map(u => `
              <button type="button" class="pill-btn" data-quick-user="${escapeHtml(u.username)}" data-quick-pass="${escapeHtml(u.password)}">
                Cliente: ${escapeHtml(u.name.split(' ')[0])}
              </button>
            `).join('')}
          </div>
        </div>

        <div style="margin-top:1.25rem;display:flex;justify-content:space-between;align-items:center;font-size:0.75rem;color:var(--text-secondary);">
          <button type="button" id="auth-theme-toggle" class="pill-btn">
            Cambiar Tema (${AppState.theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'})
          </button>
          <span class="mono">NUBE LISTA · GITHUB WEB</span>
        </div>
      </div>
    </div>
  `;
}

function bindAuthEvents() {
  const form = document.getElementById('login-form');
  const errBox = document.getElementById('login-error');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const rawUser = (document.getElementById('login-username').value || '').trim();
      const rawPass = (document.getElementById('login-password').value || '').trim();
      const normUser = rawUser.toLowerCase().replace(/\s+/g, ' ');

      // Check Admin Account: diego rodea / 123456
      if ((normUser === 'diego rodea' || normUser === 'diegorodea' || normUser === 'admin') && rawPass === '123456') {
        AppState.currentUser = { role: 'admin', name: 'Diego Rodea' };
        AppState.impersonatingUserId = null;
        AppState.activeTab = 'admin_users';
        AppState.render();
        showToast('Bienvenido, Entrenador y Nutriólogo Diego Rodea.');
        return;
      }

      // Check Client Accounts
      const found = (AppState.db.users || []).find(
        u => u.username.toLowerCase().trim() === normUser && u.password === rawPass
      );

      if (!found) {
        errBox.style.display = 'block';
        errBox.textContent = 'Credenciales incorrectas. Verifica tu usuario y contraseña.';
        return;
      }

      if (!found.active) {
        errBox.style.display = 'block';
        errBox.textContent = `Cuenta dada de baja temporalmente (Fecha de corte: ${found.paymentDate || 'vencida'}). Contacta a Diego Rodea para reactivar tu acceso.`;
        return;
      }

      AppState.currentUser = { role: 'user', userId: found.id };
      AppState.workoutDraft.unit = found.preferredUnit || 'kg';
      AppState.activeTab = 'dashboard';
      AppState.render();
      showToast(`Bienvenido a Anuarus, ${found.name}.`);
    });
  }

  document.querySelectorAll('[data-quick-user]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('login-username').value = btn.getAttribute('data-quick-user');
      document.getElementById('login-password').value = btn.getAttribute('data-quick-pass');
      form.dispatchEvent(new Event('submit'));
    });
  });

  const themeBtn = document.getElementById('auth-theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      AppState.theme = AppState.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem(THEME_KEY, AppState.theme);
      document.documentElement.setAttribute('data-theme', AppState.theme);
      AppState.render();
    });
  }
}

// ============================================================================
// 11. PANEL DE ADMINISTRADOR (DIEGO RODEA: ALTAS, BAJAS, PAGOS, VIDEOS, NUBE)
// ============================================================================
function renderAdminShell() {
  const users = AppState.db.users || [];
  const activeCount = users.filter(u => u.active).length;
  const inactiveCount = users.length - activeCount;

  // Count all videos & pending videos across users
  const allVideos = [];
  users.forEach(u => {
    (u.videos || []).forEach(v => {
      allVideos.push({ ...v, user: u });
    });
  });
  const pendingVideos = allVideos.filter(v => v.status !== 'reviewed').length;

  const activeAdminTab = AppState.activeTab.startsWith('admin_') ? AppState.activeTab : 'admin_users';

  return `
    <div class="app-shell">
      <header class="topbar">
        <div class="brand-cluster">
          <div class="logo-frame brand-logo">
            <img data-anuarus-logo src="${window.ANUARUS_TRANSPARENT_LOGO || ''}" alt="Anuarus" style="width:100%;height:100%;" />
          </div>
          <div>
            <div class="brand-name">ANUARUS <span class="badge badge-solid" style="vertical-align:middle;margin-left:0.35rem;">ADMIN</span></div>
            <div class="brand-tagline">PANEL CLÍNICO &amp; DEPORTIVO · DIEGO RODEA</div>
          </div>
        </div>

        <div class="topbar-actions">
          <button type="button" class="cloud-badge" id="open-cloud-modal-btn" title="Configurar Sincronización en la Nube y Respaldos">
            <span class="cloud-dot"></span>
            <span id="cloud-status-text">Nube Activa (Sincronizar)</span>
          </button>
          <button type="button" class="btn btn-secondary btn-sm" id="toggle-theme-btn">
            ${AppState.theme === 'dark' ? '☀ Modo Blanco' : '☾ Modo Negro'}
          </button>
          <button type="button" class="btn btn-outline btn-sm" id="logout-btn">
            Cerrar Sesión
          </button>
        </div>
      </header>

      <nav class="nav-bar">
        <button class="nav-tab ${activeAdminTab === 'admin_users' ? 'active' : ''}" data-admin-tab="admin_users">
          Clientes, Altas/Bajas y Pagos <span class="nav-count">${users.length}</span>
        </button>
        <button class="nav-tab ${activeAdminTab === 'admin_videos' ? 'active' : ''}" data-admin-tab="admin_videos">
          Análisis de Videos y Retroalimentación <span class="nav-count">${pendingVideos > 0 ? pendingVideos + ' pend.' : allVideos.length}</span>
        </button>
        <button class="nav-tab ${activeAdminTab === 'admin_cloud' ? 'active' : ''}" data-admin-tab="admin_cloud">
          Nube, GitHub Pages y Configuración
        </button>
      </nav>

      <main class="main-container">
        ${activeAdminTab === 'admin_users' ? renderAdminUsersTab(users, activeCount, inactiveCount, allVideos.length) : ''}
        ${activeAdminTab === 'admin_videos' ? renderAdminVideosTab(allVideos) : ''}
        ${activeAdminTab === 'admin_cloud' ? renderAdminCloudTab() : ''}
      </main>

      <div id="admin-modal-slot"></div>
    </div>
  `;
}

function renderAdminUsersTab(users, activeCount, inactiveCount, totalVideos) {
  return `
    <div class="section-header">
      <div>
        <div class="eyebrow">ADMINISTRACIÓN CENTRAL // DIEGO RODEA</div>
        <h2 class="section-title">Gestión de Clientes, Pacientes y Mensualidades</h2>
        <p class="section-desc">Da de alta o baja a tus atletas, controla sus fechas de pago y accede a su expediente clínico y de fuerza.</p>
      </div>
      <div style="display:flex;gap:0.65rem;flex-wrap:wrap;">
        <button type="button" class="btn" id="btn-new-user">
          + CREAR NUEVO CLIENTE / PACIENTE
        </button>
      </div>
    </div>

    <div class="grid-4" style="margin-bottom:1.75rem;">
      <div class="stat-card">
        <span class="eyebrow">TOTAL REGISTRADOS</span>
        <div class="stat-value">${users.length}</div>
        <span class="stat-meta">Cuentas en la nube</span>
      </div>
      <div class="stat-card">
        <span class="eyebrow">USUARIOS EN ALTA</span>
        <div class="stat-value">${activeCount}</div>
        <span class="stat-meta">Con acceso activo</span>
      </div>
      <div class="stat-card">
        <span class="eyebrow">USUARIOS EN BAJA</span>
        <div class="stat-value">${inactiveCount}</div>
        <span class="stat-meta">Acceso suspendido</span>
      </div>
      <div class="stat-card">
        <span class="eyebrow">VIDEOS SUBIDOS</span>
        <div class="stat-value">${totalVideos}</div>
        <span class="stat-meta">Para revisión biomecánica</span>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Directorio de Clientes y Control de Pagos</h3>
        <span class="mono" style="font-size:0.75rem;color:var(--text-secondary);">Haz clic en "Ver Expediente" para analizar gráficas, FFMI, videos o exportar PDF</span>
      </div>

      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Cliente / Usuario</th>
              <th>Estado (Alta/Baja)</th>
              <th>Fecha de Pago</th>
              <th>Composición (Grasa / FFMI)</th>
              <th>Nivel Fuerza (6 Básicos)</th>
              <th>Acciones de Administrador</th>
            </tr>
          </thead>
          <tbody>
            ${users.map(u => {
              const pay = getPaymentStatus(u.paymentDate);
              const phys = ClinicalEngine.analyzePhysique(u);
              const str = StrengthEngine.getUserStrengthSummary(u);
              return `
                <tr>
                  <td>
                    <div style="font-weight:700;">${escapeHtml(u.name)}</div>
                    <div class="mono" style="font-size:0.75rem;color:var(--text-secondary);">
                      usr: <strong>${escapeHtml(u.username)}</strong> · pass: ${escapeHtml(u.password)} · ${u.sex === 'F' ? 'Mujer' : 'Hombre'} (${u.weightKg}kg, ${u.heightCm}cm)
                    </div>
                  </td>
                  <td>
                    <span class="badge ${u.active ? 'badge-solid' : 'badge-dashed'}">
                      ${u.active ? '● ALTA (ACTIVO)' : '○ BAJA (INACTIVO)'}
                    </span>
                  </td>
                  <td>
                    <div style="display:flex;flex-direction:column;gap:0.3rem;">
                      <span class="badge ${pay.badgeClass}">${pay.label}</span>
                      <input type="date" class="form-input mono" style="padding:0.25rem 0.45rem;font-size:0.76rem;width:142px;" value="${escapeHtml(u.paymentDate || '')}" data-admin-paydate="${u.id}" title="Cambiar fecha de pago" />
                    </div>
                  </td>
                  <td>
                    <div class="mono" style="font-weight:600;">Grasa: ${phys.bf}% · FFMI: ${phys.ffmiData.ffmi}</div>
                    <div style="font-size:0.76rem;color:var(--text-secondary);">${phys.ffmiData.level}</div>
                  </td>
                  <td>
                    <span class="badge badge-outline">${str.overallLevel} (${str.avgPctElite}%)</span>
                    <div style="font-size:0.74rem;color:var(--text-secondary);margin-top:0.2rem;">
                      ${(u.sessions || []).length} sesiones · ${(u.videos || []).length} videos
                    </div>
                  </td>
                  <td>
                    <div style="display:flex;gap:0.4rem;flex-wrap:wrap;">
                      <button type="button" class="btn btn-sm" data-inspect-user="${u.id}">
                        Ver Expediente
                      </button>
                      <button type="button" class="btn btn-secondary btn-sm" data-toggle-active="${u.id}">
                        ${u.active ? 'Dar de Baja' : 'Dar de Alta'}
                      </button>
                      <button type="button" class="btn btn-secondary btn-sm" data-feedback-modal="${u.id}">
                        Retroalimentar
                      </button>
                      <button type="button" class="btn btn-secondary btn-sm" data-delete-user="${u.id}" title="Eliminar cuenta">
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderAdminVideosTab(allVideos) {
  return `
    <div class="section-header">
      <div>
        <div class="eyebrow">LABORATORIO BIOMECÁNICO // DIEGO RODEA</div>
        <h2 class="section-title">Análisis de Videos y Retroalimentación Técnica</h2>
        <p class="section-desc">Revisa la ejecución de tus clientes en cámara lenta y deja tus correcciones directamente en su expediente.</p>
      </div>
    </div>

    ${allVideos.length === 0 ? `
      <div class="card" style="text-align:center;padding:3rem 1.5rem;">
        <h3 style="margin-bottom:0.5rem;">Aún no hay videos subidos</h3>
        <p style="color:var(--text-secondary);">Cuando tus clientes suban videos de sus levantamientos desde su cuenta, aparecerán aquí para tu evaluación.</p>
      </div>
    ` : `
      <div class="grid-2">
        ${allVideos.map(v => {
          const ex = window.ANUARUS_EXERCISES.find(e => e.id === v.exerciseId) || { name: v.exerciseId };
          return `
            <div class="card card-strong">
              <div class="card-header">
                <div>
                  <span class="eyebrow">${escapeHtml(v.user.name)} · ${escapeHtml(v.date)}</span>
                  <h3 class="card-title">${escapeHtml(ex.name)} — ${v.weightKg} kg × ${v.reps} reps</h3>
                </div>
                <span class="badge ${v.status === 'reviewed' ? 'badge-solid' : 'badge-outline'}">
                  ${v.status === 'reviewed' ? '✓ REVISADO' : '● PENDIENTE'}
                </span>
              </div>

              ${v.hasLocalBlob || v.externalUrl ? `
                <div class="video-player-box" style="margin-bottom:0.85rem;">
                  <video controls playsinline id="admin-vid-el-${v.id}" src="${escapeHtml(v.externalUrl || '')}"></video>
                </div>
                <div style="display:flex;gap:0.4rem;margin-bottom:0.85rem;align-items:center;">
                  <span class="mono" style="font-size:0.72rem;color:var(--text-secondary);">VELOCIDAD:</span>
                  <button type="button" class="pill-btn" data-vid-speed="0.25" data-vid-target="admin-vid-el-${v.id}">0.25x</button>
                  <button type="button" class="pill-btn" data-vid-speed="0.5" data-vid-target="admin-vid-el-${v.id}">0.5x</button>
                  <button type="button" class="pill-btn" data-vid-speed="1" data-vid-target="admin-vid-el-${v.id}">1.0x</button>
                </div>
              ` : `
                <div style="padding:1rem;background:var(--bg-secondary);border:1px dashed var(--border-color);border-radius:var(--radius-sm);margin-bottom:0.85rem;font-size:0.82rem;">
                  Registro de video técnico (${escapeHtml(ex.name)} — ${v.weightKg} kg × ${v.reps} reps).
                </div>
              `}

              <div style="font-size:0.85rem;margin-bottom:1rem;">
                <strong>Nota del atleta:</strong> "${escapeHtml(v.userNotes || 'Sin comentarios adicionales.')}"
              </div>

              <div style="border-top:1px solid var(--border-color);padding-top:1rem;">
                <div class="form-group">
                  <label class="form-label">EVALUACIÓN TÉCNICA DE DIEGO RODEA</label>
                  <select class="form-select" id="adm-rating-${v.id}">
                    <option value="Técnica Óptima (Aprobada)" ${v.rating === 'Técnica Óptima (Aprobada)' ? 'selected' : ''}>Técnica Óptima (Aprobada)</option>
                    <option value="Técnica Sólida (Ajuste Menor)" ${v.rating === 'Técnica Sólida (Ajuste Menor)' ? 'selected' : ''}>Técnica Sólida (Ajuste Menor)</option>
                    <option value="Corregir Biomecánica / Bajar Carga" ${v.rating === 'Corregir Biomecánica / Bajar Carga' ? 'selected' : ''}>Corregir Biomecánica / Bajar Carga</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">RETROALIMENTACIÓN Y CORRECCIONES BIOMECÁNICAS</label>
                  <textarea class="form-textarea" rows="3" id="adm-comment-${v.id}" placeholder="Escribe tus observaciones posturales, tempo, profundidad o bloqueo...">${escapeHtml(v.coachComment || '')}</textarea>
                </div>
                <button type="button" class="btn btn-sm" data-save-video-feedback="${v.id}" data-video-userid="${v.user.id}">
                  Guardar Retroalimentación en la Nube
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `}
  `;
}

function renderAdminCloudTab() {
  const cfg = CloudSync.getConfig();
  return `
    <div class="section-header">
      <div>
        <div class="eyebrow">INFRAESTRUCTURA WEB &amp; NUBE // GITHUB PAGES</div>
        <h2 class="section-title">Sincronización en la Nube, WhatsApp y Despliegue en GitHub</h2>
        <p class="section-desc">Configura tu número de WhatsApp para recibir los informes PDF de tus pacientes y conecta o respalda la base de datos en la nube.</p>
      </div>
    </div>

    <div class="grid-2">
      <div class="card card-strong">
        <h3 class="card-title" style="margin-bottom:0.75rem;">1. Perfil Clínico y WhatsApp de Diego Rodea</h3>
        <p style="font-size:0.84rem;color:var(--text-secondary);margin-bottom:1.1rem;">
          Cuando un cliente presiona <strong>"Enviar Informe PDF por WhatsApp"</strong>, la app abrirá chat directo hacia este número con el resumen de su FFMI, % grasa y récords semanales.
        </p>
        <div class="form-group">
          <label class="form-label">NÚMERO DE WHATSAPP (CON CÓDIGO DE PAÍS, EJ. 521...)</label>
          <input type="text" id="coach-wa-input" class="form-input mono" value="${escapeHtml(AppState.db.coachProfile?.whatsapp || '5215500000000')}" placeholder="5215512345678" />
        </div>
        <div class="form-group">
          <label class="form-label">MENSAJE / AVISO GENERAL PARA TODOS LOS CLIENTES</label>
          <textarea id="coach-notice-input" class="form-textarea" rows="3">${escapeHtml(AppState.db.coachProfile?.generalAnnouncement || '')}</textarea>
        </div>
        <button type="button" class="btn" id="save-coach-profile-btn">Guardar Configuración de Coach</button>
      </div>

      <div class="card">
        <h3 class="card-title" style="margin-bottom:0.75rem;">2. Sincronización en la Nube (Firebase / JSONBin REST)</h3>
        <p style="font-size:0.84rem;color:var(--text-secondary);margin-bottom:1rem;">
          Todos los registros se guardan automáticamente en el dispositivo y pueden sincronizarse en tiempo real con un endpoint gratuito de Firebase Realtime DB (<code>https://tu-proyecto.firebaseio.com/anuarus.json</code>) o JSONBin.io.
        </p>
        <div class="form-group">
          <label class="form-label">URL DE BASE DE DATOS EN LA NUBE (FIREBASE / REST JSON)</label>
          <input type="url" id="cloud-url-input" class="form-input mono" value="${escapeHtml(cfg.endpointUrl || '')}" placeholder="https://anuarus-app-default-rtdb.firebaseio.com/db.json" />
        </div>
        <div class="form-group">
          <label class="form-label">API KEY / TOKEN (OPCIONAL)</label>
          <input type="password" id="cloud-key-input" class="form-input mono" value="${escapeHtml(cfg.apiKey || '')}" placeholder="Opcional para JSONBin / Supabase" />
        </div>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
          <button type="button" class="btn" id="save-cloud-cfg-btn">Conectar y Sincronizar Ahora</button>
          <button type="button" class="btn btn-secondary" id="export-json-btn">Descargar Respaldo (.JSON)</button>
          <label class="btn btn-secondary" style="cursor:pointer;">
            Importar Respaldo (.JSON)
            <input type="file" id="import-json-input" accept=".json" style="display:none;" />
          </label>
        </div>
        <div style="margin-top:1rem;padding-top:1rem;border-top:1px dashed var(--border-color);">
          <button type="button" class="btn btn-outline btn-sm btn-block" id="copy-sync-link-btn">
            🔗 Copiar Enlace Portátil con Cuentas para Compartir por WhatsApp
          </button>
        </div>
      </div>
    </div>

    <div class="card" style="margin-top:1.25rem;">
      <h3 class="card-title" style="margin-bottom:0.5rem;">3. ¿Cómo alojar Anuarus gratis en GitHub Pages?</h3>
      <ol style="padding-left:1.25rem;font-size:0.86rem;color:var(--text-secondary);line-height:1.7;">
        <li>Crea un repositorio nuevo en <a href="https://github.com/new" target="_blank" style="color:var(--text-primary);font-weight:600;">github.com/new</a> llamado <code>anuarus</code>.</li>
        <li>Sube los archivos de esta carpeta (<code>index.html</code>, <code>styles.css</code>, <code>app.js</code>, <code>illustrations.js</code>, <code>logo-data.js</code> y la carpeta <code>assets/</code>).</li>
        <li>En tu repositorio de GitHub entra a <strong>Settings → Pages</strong> y en <strong>Branch</strong> elige <code>main</code> (root) y pulsa <strong>Save</strong>.</li>
        <li>En 1 minuto tu aplicación estará en línea en <code>https://tu-usuario.github.io/anuarus/</code> lista para abrirse en cualquier celular o computadora.</li>
      </ol>
    </div>
  `;
}

// ============================================================================
// 12. EVENTOS DEL PANEL DE ADMINISTRADOR (DIEGO RODEA)
// ============================================================================
function bindAdminEvents() {
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      AppState.currentUser = null;
      AppState.impersonatingUserId = null;
      AppState.render();
    });
  }

  const themeBtn = document.getElementById('toggle-theme-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      AppState.theme = AppState.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem(THEME_KEY, AppState.theme);
      document.documentElement.setAttribute('data-theme', AppState.theme);
      AppState.render();
    });
  }

  const cloudModalBtn = document.getElementById('open-cloud-modal-btn');
  if (cloudModalBtn) {
    cloudModalBtn.addEventListener('click', () => {
      AppState.activeTab = 'admin_cloud';
      AppState.render();
    });
  }

  document.querySelectorAll('[data-admin-tab]').forEach(tab => {
    tab.addEventListener('click', () => {
      AppState.activeTab = tab.getAttribute('data-admin-tab');
      AppState.render();
    });
  });

  // Load local blobs if on admin_videos
  if (AppState.activeTab === 'admin_videos') {
    (AppState.db.users || []).forEach(u => {
      (u.videos || []).forEach(v => {
        if (v.hasLocalBlob) {
          VideoStore.getBlobUrl(v.id).then(url => {
            const el = document.getElementById(`admin-vid-el-${v.id}`);
            if (el && url) el.src = url;
          });
        }
      });
    });
  }

  // Video speed buttons
  document.querySelectorAll('[data-vid-speed]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-vid-target');
      const speed = parseFloat(btn.getAttribute('data-vid-speed')) || 1;
      const vid = document.getElementById(targetId);
      if (vid) {
        vid.playbackRate = speed;
        showToast(`Velocidad de análisis ajustada a ${speed}x`);
      }
    });
  });

  // Save video feedback
  document.querySelectorAll('[data-save-video-feedback]').forEach(btn => {
    btn.addEventListener('click', () => {
      const vidId = btn.getAttribute('data-save-video-feedback');
      const userId = btn.getAttribute('data-video-userid');
      const user = (AppState.db.users || []).find(u => u.id === userId);
      if (!user) return;
      const vid = (user.videos || []).find(v => v.id === vidId);
      if (!vid) return;

      vid.rating = document.getElementById(`adm-rating-${vidId}`).value;
      vid.coachComment = document.getElementById(`adm-comment-${vidId}`).value.trim();
      vid.status = 'reviewed';
      AppState.persist();
      AppState.render();
      showToast(`Retroalimentación guardada para ${user.name}.`);
    });
  });

  // Create New User Modal
  const newUserBtn = document.getElementById('btn-new-user');
  if (newUserBtn) {
    newUserBtn.addEventListener('click', () => openCreateUserModal());
  }

  // Inspect User (Enter client view as Coach)
  document.querySelectorAll('[data-inspect-user]').forEach(btn => {
    btn.addEventListener('click', () => {
      const uid = btn.getAttribute('data-inspect-user');
      AppState.impersonatingUserId = uid;
      AppState.activeTab = 'dashboard';
      AppState.render();
    });
  });

  // Toggle Active / Inactive (Alta / Baja)
  document.querySelectorAll('[data-toggle-active]').forEach(btn => {
    btn.addEventListener('click', () => {
      const uid = btn.getAttribute('data-toggle-active');
      const u = (AppState.db.users || []).find(x => x.id === uid);
      if (!u) return;
      u.active = !u.active;
      AppState.persist();
      AppState.render();
      showToast(`${u.name}: estado actualizado a ${u.active ? 'ALTA (Activo)' : 'BAJA (Inactivo)'}.`);
    });
  });

  // Payment date change
  document.querySelectorAll('[data-admin-paydate]').forEach(inp => {
    inp.addEventListener('change', () => {
      const uid = inp.getAttribute('data-admin-paydate');
      const u = (AppState.db.users || []).find(x => x.id === uid);
      if (!u) return;
      u.paymentDate = inp.value;
      AppState.persist();
      AppState.render();
      showToast(`Fecha de pago de ${u.name} actualizada a ${inp.value}.`);
    });
  });

  // General Coach Feedback Modal
  document.querySelectorAll('[data-feedback-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const uid = btn.getAttribute('data-feedback-modal');
      const u = (AppState.db.users || []).find(x => x.id === uid);
      if (u) openCoachFeedbackModal(u);
    });
  });

  // Delete User
  document.querySelectorAll('[data-delete-user]').forEach(btn => {
    btn.addEventListener('click', () => {
      const uid = btn.getAttribute('data-delete-user');
      const u = (AppState.db.users || []).find(x => x.id === uid);
      if (!u) return;
      if (confirm(`¿Eliminar permanentemente la cuenta de ${u.name}?`)) {
        AppState.db.users = AppState.db.users.filter(x => x.id !== uid);
        AppState.persist();
        AppState.render();
        showToast(`Usuario ${u.name} eliminado.`);
      }
    });
  });

  // Cloud & Coach Config Tab Events
  const saveCoachBtn = document.getElementById('save-coach-profile-btn');
  if (saveCoachBtn) {
    saveCoachBtn.addEventListener('click', () => {
      AppState.db.coachProfile = {
        ...AppState.db.coachProfile,
        whatsapp: (document.getElementById('coach-wa-input').value || '').replace(/\D+/g, ''),
        generalAnnouncement: document.getElementById('coach-notice-input').value.trim()
      };
      AppState.persist();
      showToast('Configuración de Coach Diego Rodea guardada.');
    });
  }

  const saveCloudBtn = document.getElementById('save-cloud-cfg-btn');
  if (saveCloudBtn) {
    saveCloudBtn.addEventListener('click', async () => {
      const endpointUrl = document.getElementById('cloud-url-input').value.trim();
      const apiKey = document.getElementById('cloud-key-input').value.trim();
      CloudSync.saveConfig({ endpointUrl, apiKey });
      const res = await CloudSync.pushToCloud(AppState.db);
      if (res.ok) {
        showToast('Nube sincronizada correctamente.');
      } else {
        showToast('Guardado localmente. Revisa permisos CORS/URL del endpoint remoto.');
      }
    });
  }

  const exportBtn = document.getElementById('export-json-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(AppState.db, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `Anuarus_Cloud_Backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      showToast('Respaldo JSON descargado.');
    });
  }

  const importInp = document.getElementById('import-json-input');
  if (importInp) {
    importInp.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result);
          if (parsed && parsed.users) {
            AppState.db = parsed;
            AppState.persist();
            AppState.render();
            showToast('Respaldo importado con éxito.');
          }
        } catch {
          showToast('Archivo JSON inválido.');
        }
      };
      reader.readAsText(file);
    });
  }

  const copySyncBtn = document.getElementById('copy-sync-link-btn');
  if (copySyncBtn) {
    copySyncBtn.addEventListener('click', () => {
      const b64 = btoa(unescape(encodeURIComponent(JSON.stringify(AppState.db))));
      const url = `${window.location.origin}${window.location.pathname}#anuarus_import=${encodeURIComponent(b64)}`;
      navigator.clipboard.writeText(url).then(() => {
        showToast('Enlace de sincronización copiado al portapapeles.');
      });
    });
  }
}

function openCreateUserModal() {
  const slot = document.getElementById('admin-modal-slot');
  if (!slot) return;
  const nextMonth = new Date();
  nextMonth.setDate(nextMonth.getDate() + 30);
  const defaultPayDate = nextMonth.toISOString().split('T')[0];

  slot.innerHTML = `
    <div class="modal-backdrop" id="modal-create-user">
      <div class="modal-box">
        <div class="card-header">
          <div>
            <span class="eyebrow">ALTA EN LA NUBE // ANUARUS</span>
            <h3 class="card-title">Crear Nuevo Cliente / Paciente</h3>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" id="close-create-modal">✕</button>
        </div>

        <form id="form-create-user">
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">NOMBRE COMPLETO</label>
              <input type="text" id="nu-name" class="form-input" placeholder="Ej. Alejandro Torres" required />
            </div>
            <div class="form-group">
              <label class="form-label">SEXO BIOLÓGICO</label>
              <select id="nu-sex" class="form-select">
                <option value="M">Hombre (Masculino)</option>
                <option value="F">Mujer (Femenino)</option>
              </select>
            </div>
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">USUARIO (PARA INICIAR SESIÓN)</label>
              <input type="text" id="nu-username" class="form-input mono" placeholder="Ej. alejandro" required />
            </div>
            <div class="form-group">
              <label class="form-label">CONTRASEÑA ASIGNADA</label>
              <input type="text" id="nu-password" class="form-input mono" value="123456" required />
            </div>
          </div>

          <div class="grid-3">
            <div class="form-group">
              <label class="form-label">PESO INICIAL (KG)</label>
              <input type="number" step="0.1" id="nu-weight" class="form-input mono" value="75.0" required />
            </div>
            <div class="form-group">
              <label class="form-label">ALTURA (CM)</label>
              <input type="number" step="1" id="nu-height" class="form-input mono" value="175" required />
            </div>
            <div class="form-group">
              <label class="form-label">FECHA DE PRÓXIMO PAGO</label>
              <input type="date" id="nu-paydate" class="form-input mono" value="${defaultPayDate}" required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">OBJETIVO CLÍNICO Y DEPORTIVO</label>
            <input type="text" id="nu-goal" class="form-input" value="Recomposición Corporal, Reducción de % Grasa y Progresión de Fuerza" />
          </div>

          <div class="form-group">
            <label class="form-label">RETROALIMENTACIÓN INICIAL DE DIEGO RODEA</label>
            <textarea id="nu-feedback" class="form-textarea" rows="2" placeholder="Indicaciones nutricionales y enfoque de entrenamiento para su primera semana..."></textarea>
          </div>

          <div style="display:flex;justify-content:flex-end;gap:0.65rem;margin-top:1.25rem;">
            <button type="button" class="btn btn-secondary" id="cancel-create-modal">Cancelar</button>
            <button type="submit" class="btn">Dar de Alta y Guardar en la Nube</button>
          </div>
        </form>
      </div>
    </div>
  `;

  const close = () => { slot.innerHTML = ''; };
  document.getElementById('close-create-modal').addEventListener('click', close);
  document.getElementById('cancel-create-modal').addEventListener('click', close);

  document.getElementById('form-create-user').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('nu-name').value.trim();
    const sex = document.getElementById('nu-sex').value;
    const username = document.getElementById('nu-username').value.trim().toLowerCase();
    const password = document.getElementById('nu-password').value.trim();
    const weightKg = parseFloat(document.getElementById('nu-weight').value) || 75;
    const heightCm = parseFloat(document.getElementById('nu-height').value) || 175;
    const paymentDate = document.getElementById('nu-paydate').value;
    const goal = document.getElementById('nu-goal').value.trim();
    const coachFeedback = document.getElementById('nu-feedback').value.trim() ||
      'Bienvenido a Anuarus. Ingresa tus 6 perímetros corporales en la pestaña de Antropometría y registra tus levantamientos cada semana.';

    if ((AppState.db.users || []).some(u => u.username.toLowerCase() === username)) {
      alert('Ese nombre de usuario ya existe. Elige uno distinto.');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const defaultMeas = sex === 'F'
      ? { waist: 68, neck: 32, hip: 96, arm: 28, calf: 34, thigh: 53, updatedAt: todayStr }
      : { waist: 82, neck: 39, hip: 98, arm: 36, calf: 37, thigh: 56, updatedAt: todayStr };

    const newUser = {
      id: 'usr_' + Date.now(),
      name,
      username,
      password,
      sex,
      age: 27,
      weightKg,
      heightCm,
      preferredUnit: 'kg',
      active: true,
      paymentDate,
      goal,
      coachFeedback,
      coachFeedbackDate: todayStr,
      measurements: defaultMeas,
      measurementsHistory: [{ date: todayStr, weightKg, ...defaultMeas }],
      sessions: [],
      videos: []
    };

    AppState.db.users.push(newUser);
    AppState.persist();
    close();
    AppState.render();
    showToast(`Cuenta creada para ${name} (usuario: ${username}).`);
  });
}

function openCoachFeedbackModal(user) {
  const slot = document.getElementById('admin-modal-slot');
  if (!slot) return;

  slot.innerHTML = `
    <div class="modal-backdrop">
      <div class="modal-box">
        <div class="card-header">
          <div>
            <span class="eyebrow">RETROALIMENTACIÓN CLÍNICA Y DEPORTIVA</span>
            <h3 class="card-title">Nota de Diego Rodea para ${escapeHtml(user.name)}</h3>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" id="close-fb-modal">✕</button>
        </div>

        <form id="form-coach-fb">
          <div class="form-group">
            <label class="form-label">OBJETIVO ACTUAL DEL PACIENTE / ATLETA</label>
            <input type="text" id="fb-goal" class="form-input" value="${escapeHtml(user.goal || '')}" />
          </div>
          <div class="form-group">
            <label class="form-label">RETROALIMENTACIÓN NUTRICIONAL, ANTROPOMÉTRICA Y DE FUERZA</label>
            <textarea id="fb-text" class="form-textarea" rows="5" required>${escapeHtml(user.coachFeedback || '')}</textarea>
          </div>
          <div style="display:flex;justify-content:flex-end;gap:0.65rem;">
            <button type="button" class="btn btn-secondary" id="cancel-fb-modal">Cancelar</button>
            <button type="submit" class="btn">Guardar Retroalimentación</button>
          </div>
        </form>
      </div>
    </div>
  `;

  const close = () => { slot.innerHTML = ''; };
  document.getElementById('close-fb-modal').addEventListener('click', close);
  document.getElementById('cancel-fb-modal').addEventListener('click', close);

  document.getElementById('form-coach-fb').addEventListener('submit', (e) => {
    e.preventDefault();
    user.goal = document.getElementById('fb-goal').value.trim();
    user.coachFeedback = document.getElementById('fb-text').value.trim();
    user.coachFeedbackDate = new Date().toISOString().split('T')[0];
    AppState.persist();
    close();
    AppState.render();
    showToast(`Retroalimentación actualizada para ${user.name}.`);
  });
}

// ============================================================================
// 13. INTERFAZ DEL CLIENTE / PACIENTE (Y VISTA DE INSPECCIÓN DEL COACH)
// ============================================================================
function renderClientShell(client) {
  const isCoachInspecting = AppState.currentUser && AppState.currentUser.role === 'admin';
  const pay = getPaymentStatus(client.paymentDate);
  const phys = ClinicalEngine.analyzePhysique(client);
  const str = StrengthEngine.getUserStrengthSummary(client);
  const tab = ['dashboard', 'anthropometry', 'workout', 'progress', 'videos'].includes(AppState.activeTab)
    ? AppState.activeTab
    : 'dashboard';

  return `
    <div class="app-shell">
      ${isCoachInspecting ? `
        <div class="impersonation-banner">
          <div>
            <strong>MODO ENTRENADOR (DIEGO RODEA):</strong> Estás visualizando y editando el expediente de <strong>${escapeHtml(client.name)}</strong>.
          </div>
          <button type="button" class="btn-invert" id="exit-inspect-btn">
            ← Volver al Panel de Administrador
          </button>
        </div>
      ` : ''}

      <header class="topbar">
        <div class="brand-cluster">
          <div class="logo-frame brand-logo">
            <img data-anuarus-logo src="${window.ANUARUS_TRANSPARENT_LOGO || ''}" alt="Anuarus" style="width:100%;height:100%;" />
          </div>
          <div>
            <div class="brand-name">ANUARUS</div>
            <div class="brand-tagline">ATLETA: ${escapeHtml(client.name.toUpperCase())} · NIVEL ${str.overallLevel.toUpperCase()}</div>
          </div>
        </div>

        <div class="topbar-actions">
          <span class="badge ${pay.badgeClass}" title="Fecha de corte / mensualidad">
            PAGO: ${pay.label}
          </span>
          <button type="button" class="btn btn-sm" id="export-pdf-top-btn">
            ⬇ Informe PDF
          </button>
          <button type="button" class="btn btn-secondary btn-sm" id="send-wa-top-btn">
            WhatsApp a Diego Rodea
          </button>
          <button type="button" class="btn btn-secondary btn-sm" id="client-theme-btn">
            ${AppState.theme === 'dark' ? '☀' : '☾'}
          </button>
          <button type="button" class="btn btn-outline btn-sm" id="client-logout-btn">
            Salir
          </button>
        </div>
      </header>

      <nav class="nav-bar">
        <button class="nav-tab ${tab === 'dashboard' ? 'active' : ''}" data-client-tab="dashboard">
          01. Resumen &amp; Diagnóstico
        </button>
        <button class="nav-tab ${tab === 'anthropometry' ? 'active' : ''}" data-client-tab="anthropometry">
          02. Medidas, Grasa &amp; FFMI (Cómo Medir)
        </button>
        <button class="nav-tab ${tab === 'workout' ? 'active' : ''}" data-client-tab="workout">
          03. Registrar Sesión (6 Ejercicios)
        </button>
        <button class="nav-tab ${tab === 'progress' ? 'active' : ''}" data-client-tab="progress">
          04. 1RM, Gráficas &amp; Puntos Fuertes/Débiles
        </button>
        <button class="nav-tab ${tab === 'videos' ? 'active' : ''}" data-client-tab="videos">
          05. Videos &amp; Retroalimentación <span class="nav-count">${(client.videos || []).length}</span>
        </button>
      </nav>

      <main class="main-container">
        ${tab === 'dashboard' ? renderClientDashboardTab(client, phys, str) : ''}
        ${tab === 'anthropometry' ? renderClientAnthropometryTab(client, phys) : ''}
        ${tab === 'workout' ? renderClientWorkoutTab(client, str) : ''}
        ${tab === 'progress' ? renderClientProgressTab(client, phys, str) : ''}
        ${tab === 'videos' ? renderClientVideosTab(client) : ''}
      </main>

      <!-- Hidden Print/PDF Dossier Staging Area -->
      <div style="position:fixed;left:-9999px;top:0;z-index:-1;">
        <div id="pdf-report-staging"></div>
      </div>

      <div id="client-modal-slot"></div>
    </div>
  `;
}

// ============================================================================
// TAB 1: RESUMEN GENERAL, RETROALIMENTACIÓN DE DIEGO RODEA Y DIAGNÓSTICO
// ============================================================================
function renderClientDashboardTab(client, phys, str) {
  const unit = client.preferredUnit || 'kg';
  return `
    <div class="section-header">
      <div>
        <div class="eyebrow">EXPEDIENTE CLÍNICO Y BIOMECÁNICO // ANUARUS</div>
        <h2 class="section-title">Hola, ${escapeHtml(client.name)}</h2>
        <p class="section-desc">Objetivo activo: <strong>${escapeHtml(client.goal || 'Recomposición Corporal & Progresión de Fuerza')}</strong></p>
      </div>
      <div style="display:flex;gap:0.65rem;flex-wrap:wrap;">
        <button type="button" class="btn" data-go-tab="workout">
          + Registrar Entrenamiento de Hoy
        </button>
        <button type="button" class="btn btn-secondary" id="dash-pdf-btn">
          Descargar PDF y Enviar por WhatsApp
        </button>
      </div>
    </div>

    <!-- Retroalimentación del Entrenador y Nutriólogo Diego Rodea -->
    <div class="card card-strong" style="margin-bottom:1.5rem;">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;margin-bottom:0.65rem;">
        <div style="display:flex;align-items:center;gap:0.75rem;">
          <img data-anuarus-logo src="${window.ANUARUS_TRANSPARENT_LOGO || ''}" alt="Logo" style="width:40px;height:40px;object-fit:contain;" />
          <div>
            <div class="eyebrow">RETROALIMENTACIÓN DIRECTA DEL ENTRENADOR &amp; NUTRIÓLOGO</div>
            <h3 class="card-title">Diego Rodea · Indicaciones Clínicas y Técnicas</h3>
          </div>
        </div>
        <span class="badge badge-solid">ACTUALIZADO: ${escapeHtml(client.coachFeedbackDate || 'Reciente')}</span>
      </div>
      <p style="font-size:0.95rem;line-height:1.6;padding:0.85rem 1rem;background:var(--bg-secondary);border-left:3px solid var(--border-strong);border-radius:0 4px 4px 0;">
        "${escapeHtml(client.coachFeedback || 'Mantén constancia en el registro semanal de tus 6 ejercicios básicos y actualiza tus medidas corporales cada 14 días.')}"
      </p>
    </div>

    <!-- 4 KPI Cards -->
    <div class="grid-4" style="margin-bottom:1.5rem;">
      <div class="stat-card">
        <span class="eyebrow">PESO &amp; ALTURA</span>
        <div class="stat-value">${AppState.formatWeight(client.weightKg, unit)}</div>
        <span class="stat-meta">${client.heightCm} cm · ${client.sex === 'F' ? 'Mujer' : 'Hombre'}</span>
      </div>
      <div class="stat-card">
        <span class="eyebrow">GRASA CORPORAL</span>
        <div class="stat-value">${phys.bf}%</div>
        <span class="stat-meta">${phys.bfCat.label} (${phys.ffmiData.fatMassKg} kg grasa)</span>
      </div>
      <div class="stat-card">
        <span class="eyebrow">ÍNDICE FFMI (MASA MAGRA)</span>
        <div class="stat-value">${phys.ffmiData.ffmi}</div>
        <span class="stat-meta">Nivel: <strong>${phys.ffmiData.level}</strong> (${phys.ffmiData.leanMassKg} kg magros)</span>
      </div>
      <div class="stat-card">
        <span class="eyebrow">CLASIFICACIÓN DE FUERZA</span>
        <div class="stat-value">${str.overallLevel}</div>
        <span class="stat-meta">Índice global: ${str.avgPctElite}% del estándar Élite</span>
      </div>
    </div>

    <!-- Diagnóstico de Puntos Fuertes, Puntos Débiles y Qué Mejorar -->
    <div class="grid-2" style="margin-bottom:1.5rem;">
      <div class="card">
        <div class="card-header">
          <div>
            <span class="eyebrow">DIAGNÓSTICO ANTROPOMÉTRICO &amp; NUTRICIONAL</span>
            <h3 class="card-title">Puntos Débiles, Grasa Corporal y Qué Mejorar</h3>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" data-go-tab="anthropometry">Editar Medidas</button>
        </div>

        <div style="margin-bottom:1rem;">
          <div class="eyebrow" style="margin-bottom:0.4rem;">PUNTOS DÉBILES A CORREGIR:</div>
          <ul style="padding-left:1.15rem;font-size:0.86rem;line-height:1.55;">
            ${phys.weakPoints.map(w => `<li style="margin-bottom:0.3rem;">${escapeHtml(w)}</li>`).join('')}
          </ul>
        </div>

        <div style="margin-bottom:1rem;">
          <div class="eyebrow" style="margin-bottom:0.4rem;">PLAN DE MEJORA RECOMENDADO:</div>
          <ul style="padding-left:1.15rem;font-size:0.86rem;line-height:1.55;">
            ${phys.actionPlan.map(a => `<li style="margin-bottom:0.3rem;"><strong>${escapeHtml(a)}</strong></li>`).join('')}
          </ul>
        </div>

        <div>
          <div class="eyebrow" style="margin-bottom:0.4rem;">PUNTOS FUERTES ACTUALES:</div>
          <ul style="padding-left:1.15rem;font-size:0.84rem;color:var(--text-secondary);line-height:1.5;">
            ${phys.strongPoints.map(s => `<li>${escapeHtml(s)}</li>`).join('')}
          </ul>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div>
            <span class="eyebrow">HEXÁGONO BIOMECÁNICO</span>
            <h3 class="card-title">Mapa de Puntos Fuertes y Débiles (6 Ejercicios)</h3>
          </div>
          <span class="badge badge-outline">${str.overallLevel}</span>
        </div>
        <div style="width:100%;height:310px;">
          <canvas id="radar-canvas" style="width:100%;height:100%;"></canvas>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:0.8rem;color:var(--text-secondary);margin-top:0.5rem;padding-top:0.65rem;border-top:1px solid var(--border-color);">
          <span><strong>Punto más fuerte:</strong> ${str.strongestLift ? escapeHtml(str.strongestLift.exercise.name) + ' (' + str.strongestLift.classification.level + ')' : 'N/A'}</span>
          <span><strong>A priorizar:</strong> ${str.weakestLift ? escapeHtml(str.weakestLift.exercise.name) + ' (' + str.weakestLift.classification.level + ')' : 'N/A'}</span>
        </div>
      </div>
    </div>

    <!-- Resumen de los 6 Ejercicios y Comparativa Semana Pasada -->
    <div class="card">
      <div class="card-header">
        <div>
          <span class="eyebrow">ESTADO DE FUERZA EN LOS 6 EJERCICIOS OFICIALES</span>
          <h3 class="card-title">1RM Aproximado, Nivel Actual y Comparativa Semanal</h3>
        </div>
        <button type="button" class="btn btn-sm" data-go-tab="workout">Registrar Nueva Sesión</button>
      </div>

      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Ejercicio</th>
              <th>Última Marca Registrada</th>
              <th>1RM Aproximado</th>
              <th>Cambio vs Semana Anterior</th>
              <th>Nivel del Atleta</th>
            </tr>
          </thead>
          <tbody>
            ${str.byExercise.map(item => {
              const latestText = item.latest
                ? `${AppState.formatWeight(item.latest.weightKg, unit)} × ${item.latest.reps} reps (${item.latest.date})`
                : 'Sin registros aún';
              const rmText = item.hasData
                ? `${AppState.formatWeight(item.latest.est1RMKg, unit)}${item.exercise.isBodyweightPlus ? ' (+Peso Corp.)' : ''}`
                : '—';
              let deltaBadge = '<span class="badge badge-dashed">Base inicial</span>';
              if (item.delta1RMKg !== null) {
                const convDelta = AppState.convertWeightValue(item.delta1RMKg, unit);
                const sign = convDelta >= 0 ? '+' : '';
                deltaBadge = `<span class="badge ${convDelta >= 0 ? 'badge-solid' : 'badge-outline'}">${sign}${convDelta} ${unit} en 1RM</span>`;
              }
              return `
                <tr>
                  <td>
                    <strong>${escapeHtml(item.exercise.name)}</strong>
                    <div style="font-size:0.75rem;color:var(--text-secondary);">${escapeHtml(item.exercise.category)}</div>
                  </td>
                  <td class="mono">${latestText}</td>
                  <td class="mono" style="font-weight:700;">${rmText}</td>
                  <td>${deltaBadge}</td>
                  <td>
                    <span class="badge ${item.classification.tier >= 3 ? 'badge-solid' : 'badge-outline'}">
                      ${item.classification.level} (${item.classification.pctOfElite}%)
                    </span>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ============================================================================
// TAB 2: ANTROPOMETRÍA, CÓMO MEDIR CON IMAGEN, FFMI, GRASA Y PUNTOS DÉBILES
// ============================================================================
function renderClientAnthropometryTab(client, phys) {
  const m = client.measurements || {};
  const guides = window.ANUARUS_MEASUREMENTS_GUIDE;

  return `
    <div class="section-header">
      <div>
        <div class="eyebrow">EVALUACIÓN NUTRICIONAL &amp; ANTROPOMÉTRICA // ANUARUS</div>
        <h2 class="section-title">Peso, Medidas Corporales, FFMI y Diagnóstico de Grasa Corporal</h2>
        <p class="section-desc">Actualiza tu peso, altura, sexo y tus 6 perímetros siguiendo la guía visual. Todos tus cambios se guardan en la nube.</p>
      </div>
    </div>

    <div class="grid-2" style="margin-bottom:1.75rem;">
      <!-- Formulario Editable de Datos y 6 Medidas -->
      <div class="card card-strong">
        <div class="card-header">
          <h3 class="card-title">Actualizar Datos y Perímetros Corporales</h3>
          <span class="badge">ÚLTIMA EDICIÓN: ${escapeHtml(m.updatedAt || 'Hoy')}</span>
        </div>

        <form id="form-anthropometry">
          <div class="grid-3">
            <div class="form-group">
              <label class="form-label">PESO CORPORAL (KG)</label>
              <input type="number" step="0.1" id="ant-weight" class="form-input mono" value="${client.weightKg}" required />
            </div>
            <div class="form-group">
              <label class="form-label">ALTURA (CM)</label>
              <input type="number" step="0.5" id="ant-height" class="form-input mono" value="${client.heightCm}" required />
            </div>
            <div class="form-group">
              <label class="form-label">SEXO</label>
              <select id="ant-sex" class="form-select">
                <option value="M" ${client.sex === 'M' ? 'selected' : ''}>Hombre</option>
                <option value="F" ${client.sex === 'F' ? 'selected' : ''}>Mujer</option>
              </select>
            </div>
          </div>

          <div style="margin:0.85rem 0 0.65rem;padding-top:0.65rem;border-top:1px solid var(--border-color);">
            <span class="eyebrow">6 PERÍMETROS ANATÓMICOS (EN CENTÍMETROS)</span>
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">
                <span>1. CINTURA (CM)</span>
                <button type="button" class="pill-btn" data-show-measure-guide="waist">¿Cómo medir?</button>
              </label>
              <input type="number" step="0.1" id="ant-waist" class="form-input mono" value="${m.waist || 80}" required />
            </div>

            <div class="form-group">
              <label class="form-label">
                <span>2. CUELLO (CM)</span>
                <button type="button" class="pill-btn" data-show-measure-guide="neck">¿Cómo medir?</button>
              </label>
              <input type="number" step="0.1" id="ant-neck" class="form-input mono" value="${m.neck || 38}" required />
            </div>

            <div class="form-group">
              <label class="form-label">
                <span>3. CADERA (CM)</span>
                <button type="button" class="pill-btn" data-show-measure-guide="hip">¿Cómo medir?</button>
              </label>
              <input type="number" step="0.1" id="ant-hip" class="form-input mono" value="${m.hip || 96}" required />
            </div>

            <div class="form-group">
              <label class="form-label">
                <span>4. BRAZO CONTRAÍDO (CM)</span>
                <button type="button" class="pill-btn" data-show-measure-guide="arm">¿Cómo medir?</button>
              </label>
              <input type="number" step="0.1" id="ant-arm" class="form-input mono" value="${m.arm || 36}" required />
            </div>

            <div class="form-group">
              <label class="form-label">
                <span>5. PANTORRILLA (CM)</span>
                <button type="button" class="pill-btn" data-show-measure-guide="calf">¿Cómo medir?</button>
              </label>
              <input type="number" step="0.1" id="ant-calf" class="form-input mono" value="${m.calf || 37}" required />
            </div>

            <div class="form-group">
              <label class="form-label">
                <span>6. MUSLO MEDIO (CM)</span>
                <button type="button" class="pill-btn" data-show-measure-guide="thigh">¿Cómo medir?</button>
              </label>
              <input type="number" step="0.1" id="ant-thigh" class="form-input mono" value="${m.thigh || 56}" required />
            </div>
          </div>

          <button type="submit" class="btn btn-block" style="margin-top:0.5rem;">
            Guardar Medidas y Recalcular FFMI / Grasa Corporal
          </button>
        </form>
      </div>

      <!-- Panel de Resultados Clínicos: FFMI, Nivel, % Grasa y Simetría -->
      <div class="card">
        <div class="card-header">
          <div>
            <span class="eyebrow">RESULTADO BIOMÉTRICO EN TIEMPO REAL</span>
            <h3 class="card-title">Tu Nivel de FFMI, Grasa Corporal y Simetría</h3>
          </div>
          <span class="badge badge-solid">${phys.ffmiData.level}</span>
        </div>

        <div class="grid-2" style="margin-bottom:1.15rem;">
          <div style="padding:1rem;background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:var(--radius-sm);">
            <div class="eyebrow">FFMI / MASA LIBRE DE GRASA</div>
            <div class="mono" style="font-size:1.75rem;font-weight:800;margin:0.2rem 0;">${phys.ffmiData.ffmi} <span style="font-size:0.82rem;font-weight:500;">kg/m²</span></div>
            <div style="font-size:0.78rem;color:var(--text-secondary);">FFMI Normalizado (1.80m): <strong>${phys.ffmiData.normalizedFfmi}</strong></div>
            <div style="font-size:0.78rem;margin-top:0.25rem;">Nivel Muscular: <strong>${phys.ffmiData.level}</strong></div>
          </div>

          <div style="padding:1rem;background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:var(--radius-sm);">
            <div class="eyebrow">GRASA CORPORAL ESTIMADA</div>
            <div class="mono" style="font-size:1.75rem;font-weight:800;margin:0.2rem 0;">${phys.bf}%</div>
            <div style="font-size:0.78rem;color:var(--text-secondary);">Masa Magra: <strong>${phys.ffmiData.leanMassKg} kg</strong> · Grasa: <strong>${phys.ffmiData.fatMassKg} kg</strong></div>
            <div style="font-size:0.78rem;margin-top:0.25rem;">Estado: <strong>${phys.bfCat.label}</strong></div>
          </div>
        </div>

        <div style="margin-bottom:1.15rem;">
          <div style="display:flex;justify-content:space-between;font-size:0.78rem;font-weight:600;margin-bottom:0.35rem;">
            <span>ESCALA DE DESARROLLO MUSCULAR (FFMI)</span>
            <span class="mono">${phys.ffmiData.scorePct}%</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" style="width:${phys.ffmiData.scorePct}%;"></div>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:0.68rem;color:var(--text-muted);margin-top:0.3rem;" class="mono">
            <span>INICIAL</span>
            <span>PROMEDIO</span>
            <span>ATLÉTICO</span>
            <span>AVANZADO</span>
            <span>ÉLITE NATURAL</span>
          </div>
        </div>

        <div class="eyebrow" style="margin-bottom:0.5rem;">COMPARATIVA DE PROPORCIONES CORPORALES (ACTUAL VS IDEAL ATLÉTICO)</div>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Zona</th>
                <th>Tu Medida</th>
                <th>Proporción Ideal</th>
                <th>Diagnóstico</th>
              </tr>
            </thead>
            <tbody>
              ${phys.comparisons.map(c => {
                const diff = +(c.current - c.ideal).toFixed(1);
                let statusText = 'Óptimo';
                if (c.name === 'Cintura') {
                  statusText = diff > 2.5 ? `Reducir ${diff} cm` : 'Cintura Atlética';
                } else {
                  statusText = diff < -1.2 ? `Punto Débil (${diff} cm)` : 'Fuerte / En Meta';
                }
                return `
                  <tr>
                    <td><strong>${c.name}</strong></td>
                    <td class="mono">${c.current} cm</td>
                    <td class="mono">${c.ideal} cm</td>
                    <td><span class="badge ${statusText.includes('Débil') || statusText.includes('Reducir') ? 'badge-outline' : 'badge-solid'}">${statusText}</span></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Guía Visual con Imágenes de Cómo Medir los 6 Perímetros -->
    <div class="card">
      <div class="card-header">
        <div>
          <span class="eyebrow">MANUAL VISUAL ANATÓMICO // ANUARUS</span>
          <h3 class="card-title">Guía con Imagen: ¿Cómo Medir Correctamente cada Zona?</h3>
        </div>
        <span class="badge badge-outline">ESTÁNDAR ISAK / CLÍNICO</span>
      </div>

      <div class="grid-3">
        ${Object.values(guides).map(g => `
          <div style="border:1px solid var(--border-color);border-radius:var(--radius-sm);padding:1rem;background:var(--bg-primary);">
            ${g.svg}
            <div style="margin-top:0.75rem;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.3rem;">
                <h4 style="font-size:0.95rem;">${escapeHtml(g.name)}</h4>
                <span class="badge">${escapeHtml(m[g.id] || '—')} cm</span>
              </div>
              <div class="mono" style="font-size:0.72rem;color:var(--text-secondary);margin-bottom:0.5rem;">
                Ref: ${escapeHtml(g.landmark)}
              </div>
              <ul style="padding-left:1rem;font-size:0.78rem;color:var(--text-secondary);line-height:1.45;">
                ${g.instructions.map(inst => `<li style="margin-bottom:0.2rem;">${escapeHtml(inst)}</li>`).join('')}
              </ul>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ============================================================================
// TAB 3: REGISTRO DE SESIÓN (6 EJERCICIOS CON IMAGEN + COMPARATIVA SEMANA PASADA)
// ============================================================================
function renderClientWorkoutTab(client, str) {
  const draft = AppState.workoutDraft;
  const unit = draft.unit || client.preferredUnit || 'kg';

  // Ensure default sets exist for selected exercises
  draft.selectedExercises.forEach(exId => {
    if (!draft.setsByExercise[exId] || draft.setsByExercise[exId].length === 0) {
      const last = StrengthEngine.getLastSessionForExercise(client, exId, null);
      const defaultWeight = last && last.bestSet
        ? AppState.convertWeightValue(last.bestSet.weightKg, unit)
        : (unit === 'lb' ? 135 : 60);
      const defaultReps = last && last.bestSet ? last.bestSet.reps : 5;
      draft.setsByExercise[exId] = [
        { weight: defaultWeight, reps: defaultReps },
        { weight: defaultWeight, reps: defaultReps },
        { weight: defaultWeight, reps: defaultReps }
      ];
    }
  });

  return `
    <div class="section-header">
      <div>
        <div class="eyebrow">BITÁCORA DE SOBRECARGA PROGRESIVA // ANUARUS</div>
        <h2 class="section-title">Registrar Sesión de Fuerza (6 Ejercicios Oficiales)</h2>
        <p class="section-desc">Elige el día, la unidad (Kilos o Libras) y los ejercicios que realizarás hoy. Al ingresar tus repeticiones verás tu marca de la semana pasada.</p>
      </div>
      <div style="display:flex;align-items:center;gap:0.75rem;">
        <span class="eyebrow">UNIDAD DE PESO:</span>
        <div class="segmented-control">
          <button type="button" class="segment-btn ${unit === 'kg' ? 'active' : ''}" data-set-unit="kg">KILOS (KG)</button>
          <button type="button" class="segment-btn ${unit === 'lb' ? 'active' : ''}" data-set-unit="lb">LIBRAS (LB)</button>
        </div>
      </div>
    </div>

    <!-- Paso 1: Fecha y Selección de los 6 Ejercicios con Ejemplo en Imagen -->
    <div class="card" style="margin-bottom:1.5rem;">
      <div class="card-header">
        <div>
          <span class="eyebrow">PASO 1 · PLANIFICACIÓN DEL DÍA</span>
          <h3 class="card-title">Selecciona la Fecha y qué Ejercicios vas a Realizar Hoy</h3>
        </div>
        <div style="display:flex;align-items:center;gap:0.5rem;">
          <label class="eyebrow" for="wo-date-input">DÍA DE SESIÓN:</label>
          <input type="date" id="wo-date-input" class="form-input mono" style="width:165px;padding:0.4rem 0.65rem;" value="${escapeHtml(draft.date)}" />
        </div>
      </div>

      <div class="grid-3">
        ${window.ANUARUS_EXERCISES.map(ex => {
          const isSelected = draft.selectedExercises.includes(ex.id);
          const last = StrengthEngine.getLastSessionForExercise(client, ex.id, null);
          const lastSummary = last && last.bestSet
            ? `${AppState.formatWeight(last.bestSet.weightKg, unit)} × ${last.bestSet.reps} reps`
            : 'Sin registro previo';
          return `
            <div class="exercise-select-card ${isSelected ? 'selected' : ''}" data-toggle-workout-ex="${ex.id}">
              <div class="exercise-check-indicator">${isSelected ? '✓' : '+'}</div>
              ${ex.svg}
              <div style="margin-top:0.65rem;">
                <h4 style="font-size:0.96rem;">${escapeHtml(ex.name)}</h4>
                <div style="font-size:0.75rem;color:var(--text-secondary);margin-bottom:0.35rem;">${escapeHtml(ex.muscles)}</div>
                <div class="mono" style="font-size:0.73rem;padding:0.3rem 0.5rem;background:var(--bg-primary);border:1px solid var(--border-color);border-radius:3px;">
                  Semana pasada: <strong>${lastSummary}</strong>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Paso 2: Registro de Series y Repeticiones con Comparativa "Semana Pasada" -->
    <div class="card card-strong" style="margin-bottom:1.5rem;">
      <div class="card-header">
        <div>
          <span class="eyebrow">PASO 2 · CAPTURA DE PESO (${unit.toUpperCase()}) Y REPETICIONES</span>
          <h3 class="card-title">Registro de Series y Comparativa con la Semana Pasada</h3>
        </div>
        <span class="badge badge-solid">${draft.selectedExercises.length} EJERCICIOS ACTIVOS</span>
      </div>

      ${draft.selectedExercises.length === 0 ? `
        <div style="padding:2rem;text-align:center;color:var(--text-secondary);">
          Haz clic en al menos uno de los 6 ejercicios de arriba para registrar tus series de hoy.
        </div>
      ` : `
        <div style="display:flex;flex-direction:column;gap:1.5rem;">
          ${draft.selectedExercises.map(exId => {
            const ex = window.ANUARUS_EXERCISES.find(x => x.id === exId);
            const last = StrengthEngine.getLastSessionForExercise(client, exId, null);
            const sets = draft.setsByExercise[exId] || [];

            let lastWeekHtml = '';
            if (last && last.bestSet) {
              const bestW = AppState.convertWeightValue(last.bestSet.weightKg, unit);
              const bestRM = AppState.convertWeightValue(last.bestMetric.est1RMKg, unit);
              const allSetsStr = last.sets.map(s => `${AppState.convertWeightValue(s.weightKg, unit)}${unit}×${s.reps}`).join(' | ');
              const targetReps = last.bestSet.reps + 1;
              const targetWeight = +(bestW + (unit === 'lb' ? 5 : 2.5)).toFixed(1);

              lastWeekHtml = `
                <div class="last-week-banner">
                  <div>
                    <div class="eyebrow">MARCA DE LA SEMANA PASADA (${escapeHtml(last.date)})</div>
                    <div class="mono" style="font-size:0.95rem;font-weight:700;margin-top:0.15rem;">
                      Mejor serie: ${bestW} ${unit} × ${last.bestSet.reps} reps <span style="font-weight:400;color:var(--text-secondary);">(1RM Est: ${bestRM} ${unit})</span>
                    </div>
                    <div class="mono" style="font-size:0.74rem;color:var(--text-secondary);margin-top:0.15rem;">
                      Series realizadas: ${allSetsStr}
                    </div>
                  </div>
                  <div style="text-align:right;">
                    <span class="badge badge-solid">META HOY: ${bestW} ${unit} × ${targetReps} reps ó ${targetWeight} ${unit} × ${last.bestSet.reps} reps</span>
                  </div>
                </div>
              `;
            } else {
              lastWeekHtml = `
                <div class="last-week-banner">
                  <div>
                    <div class="eyebrow">PRIMERA SESIÓN EN ESTE EJERCICIO</div>
                    <div style="font-size:0.84rem;">Establece tu marca base hoy. La próxima semana te mostraremos este registro para superarlo.</div>
                  </div>
                </div>
              `;
            }

            return `
              <div style="border:1px solid var(--border-color);border-radius:var(--radius-md);padding:1.25rem;background:var(--bg-primary);">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;flex-wrap:wrap;gap:0.5rem;">
                  <div>
                    <h4 style="font-size:1.1rem;">${escapeHtml(ex.name)} ${ex.isBodyweightPlus ? '<span class="badge">Peso Corporal + Lastre</span>' : ''}</h4>
                    <div style="font-size:0.78rem;color:var(--text-secondary);">Clave técnica: ${escapeHtml(ex.cues[0])}</div>
                  </div>
                  <button type="button" class="btn btn-secondary btn-sm" data-add-set="${ex.id}">+ Agregar Serie</button>
                </div>

                ${lastWeekHtml}

                <div class="set-row" style="margin-bottom:0.35rem;">
                  <span class="eyebrow" style="text-align:center;">SERIE</span>
                  <span class="eyebrow">PESO (${unit.toUpperCase()})${ex.isBodyweightPlus ? ' LASTRE' : ''}</span>
                  <span class="eyebrow">REPETICIONES</span>
                  <span class="eyebrow" style="text-align:center;">1RM HOY vs SEMANA PASADA</span>
                  <span></span>
                </div>

                ${sets.map((s, idx) => {
                  const weightKg = AppState.toKg(s.weight, unit);
                  const curMetric = StrengthEngine.calculateExerciseMetrics(ex, weightKg, s.reps, client.weightKg);
                  const cur1RMDisp = AppState.convertWeightValue(curMetric.est1RMKg, unit);
                  let compLabel = `1RM: ${cur1RMDisp} ${unit}`;
                  if (last && last.bestMetric && last.bestMetric.systemic1RMKg > 0) {
                    const diffKg = +(curMetric.systemic1RMKg - last.bestMetric.systemic1RMKg).toFixed(1);
                    if (diffKg > 0) compLabel = `★ PR! 1RM: ${cur1RMDisp}${unit} (+${AppState.convertWeightValue(diffKg, unit)})`;
                    else if (diffKg === 0) compLabel = `= Igualó (${cur1RMDisp}${unit})`;
                    else compLabel = `1RM: ${cur1RMDisp}${unit} (Sem. pas: ${AppState.convertWeightValue(last.bestMetric.est1RMKg, unit)})`;
                  }
                  return `
                    <div class="set-row">
                      <div class="set-num">#${idx + 1}</div>
                      <input type="number" step="0.5" class="form-input mono" value="${s.weight}" data-set-input="weight" data-ex-id="${ex.id}" data-set-idx="${idx}" placeholder="Peso (${unit})" />
                      <input type="number" step="1" min="1" max="50" class="form-input mono" value="${s.reps}" data-set-input="reps" data-ex-id="${ex.id}" data-set-idx="${idx}" placeholder="Reps" />
                      <div class="rm-live-pill" id="rm-pill-${ex.id}-${idx}">${compLabel}</div>
                      <button type="button" class="btn btn-secondary btn-sm" style="padding:0.45rem 0;" data-remove-set="${ex.id}" data-set-idx="${idx}" title="Quitar serie">✕</button>
                    </div>
                  `;
                }).join('')}
              </div>
            `;
          }).join('')}

          <div class="form-group" style="margin-top:0.5rem;">
            <label class="form-label">SENSACIONES DE LA SESIÓN / NOTAS PARA DIEGO RODEA</label>
            <input type="text" id="wo-notes-input" class="form-input" value="${escapeHtml(draft.notes || '')}" placeholder="Ej. Me sentí muy fuerte en Peso Muerto, dormí 8 horas..." />
          </div>

          <button type="button" class="btn btn-block" style="padding:0.9rem;font-size:0.95rem;" id="save-workout-session-btn">
            ✓ GUARDAR SESIÓN EN LA NUBE Y ACTUALIZAR 1RM / GRÁFICAS
          </button>
        </div>
      `}
    </div>

    <!-- Historial de Sesiones Registradas -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Historial de Sesiones Semanales</h3>
        <span class="badge">${(client.sessions || []).length} SESIONES GUARDADAS</span>
      </div>
      ${(client.sessions || []).length === 0 ? `
        <p style="color:var(--text-secondary);font-size:0.86rem;">Aún no tienes sesiones registradas.</p>
      ` : `
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Ejercicios y Series Realizadas</th>
                <th>Notas</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              ${[...(client.sessions || [])].sort((a, b) => b.date.localeCompare(a.date)).map(ses => `
                <tr>
                  <td class="mono" style="font-weight:700;white-space:nowrap;">${escapeHtml(ses.date)}</td>
                  <td>
                    ${(ses.exercises || []).map(e => {
                      const exObj = window.ANUARUS_EXERCISES.find(x => x.id === e.exerciseId) || { name: e.exerciseId };
                      const setsTxt = (e.sets || []).map(s => `${AppState.convertWeightValue(s.weightKg, unit)}${unit}×${s.reps}`).join(', ');
                      return `<div style="margin-bottom:0.2rem;"><strong>${escapeHtml(exObj.name)}:</strong> <span class="mono" style="font-size:0.8rem;">${setsTxt}</span></div>`;
                    }).join('')}
                  </td>
                  <td style="font-size:0.82rem;color:var(--text-secondary);">${escapeHtml(ses.notes || '—')}</td>
                  <td>
                    <button type="button" class="btn btn-secondary btn-sm" data-delete-session="${ses.id}">Eliminar</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `}
    </div>
  `;
}

// ============================================================================
// TAB 4: 1RM APROXIMADO, NIVELES (PRINCIPIANTE/AVANZADO/ÉLITE) Y GRÁFICAS
// ============================================================================
function renderClientProgressTab(client, phys, str) {
  const unit = client.preferredUnit || 'kg';
  return `
    <div class="section-header">
      <div>
        <div class="eyebrow">ANÁLISIS BIOMECÁNICO Y ESTÁNDARES DE FUERZA // ANUARUS</div>
        <h2 class="section-title">1RM Aproximado, Gráfica de Progreso y Puntos Fuertes / Débiles</h2>
        <p class="section-desc">Clasificación automática entre Principiante, Intermedio, Avanzado y Élite según tu peso corporal (${client.weightKg} kg) y sexo.</p>
      </div>
      <div class="segmented-control">
        <button type="button" class="segment-btn ${unit === 'kg' ? 'active' : ''}" data-set-unit="kg">VER EN KG</button>
        <button type="button" class="segment-btn ${unit === 'lb' ? 'active' : ''}" data-set-unit="lb">VER EN LB</button>
      </div>
    </div>

    <div class="grid-2" style="margin-bottom:1.5rem;">
      <!-- Gráfica de Progreso Semanal (Línea) -->
      <div class="card card-strong">
        <div class="card-header">
          <div>
            <span class="eyebrow">EVOLUCIÓN SEMANA A SEMANA</span>
            <h3 class="card-title">Gráfica de Progreso de 1RM Aproximado (${unit.toUpperCase()})</h3>
          </div>
          <select id="progress-ex-filter" class="form-select" style="width:190px;padding:0.35rem 0.6rem;font-size:0.8rem;">
            <option value="all" ${AppState.selectedProgressExercise === 'all' ? 'selected' : ''}>Todos los 6 Ejercicios</option>
            ${window.ANUARUS_EXERCISES.map(ex => `
              <option value="${ex.id}" ${AppState.selectedProgressExercise === ex.id ? 'selected' : ''}>${escapeHtml(ex.name)}</option>
            `).join('')}
          </select>
        </div>
        <div style="width:100%;height:300px;">
          <canvas id="progress-canvas" style="width:100%;height:100%;"></canvas>
        </div>
      </div>

      <!-- Gráfica Hexagonal de Puntos Fuertes y Débiles -->
      <div class="card">
        <div class="card-header">
          <div>
            <span class="eyebrow">EQUILIBRIO ESTRUCTURAL</span>
            <h3 class="card-title">Gráfica de Puntos Fuertes y Puntos Débiles</h3>
          </div>
          <span class="badge badge-solid">NIVEL GLOBAL: ${str.overallLevel}</span>
        </div>
        <div style="width:100%;height:300px;">
          <canvas id="radar-canvas" style="width:100%;height:100%;"></canvas>
        </div>
      </div>
    </div>

    <!-- Barras de Nivel por Ejercicio (Principiante / Intermedio / Avanzado / Élite) -->
    <div class="card" style="margin-bottom:1.5rem;">
      <div class="card-header">
        <div>
          <span class="eyebrow">CLASIFICACIÓN DE ATLETA ANUARUS</span>
          <h3 class="card-title">Tabla de 1RM Aproximado, Cargas de Trabajo y Nivel por Ejercicio</h3>
        </div>
      </div>

      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Ejercicio</th>
              <th>1RM Aproximado</th>
              <th>5RM Estimado (86%)</th>
              <th>8RM Estimado (79%)</th>
              <th>Progreso hacia Élite</th>
              <th>Clasificación</th>
            </tr>
          </thead>
          <tbody>
            ${str.byExercise.map(item => {
              const rm1 = item.hasData ? AppState.convertWeightValue(item.latest.est1RMKg, unit) : 0;
              const rm5 = +(rm1 * 0.86).toFixed(1);
              const rm8 = +(rm1 * 0.79).toFixed(1);
              return `
                <tr>
                  <td>
                    <strong>${escapeHtml(item.exercise.name)}</strong>
                    ${item.exercise.isBodyweightPlus ? '<div style="font-size:0.7rem;color:var(--text-secondary);">Lastre adicional a peso corporal</div>' : ''}
                  </td>
                  <td class="mono" style="font-size:1rem;font-weight:800;">${item.hasData ? `${rm1} ${unit}` : '—'}</td>
                  <td class="mono">${item.hasData ? `${rm5} ${unit}` : '—'}</td>
                  <td class="mono">${item.hasData ? `${rm8} ${unit}` : '—'}</td>
                  <td style="min-width:170px;">
                    <div class="progress-track">
                      <div class="progress-fill" style="width:${Math.min(100, item.classification.pctOfElite)}%;"></div>
                    </div>
                    <div style="display:flex;justify-content:space-between;font-size:0.66rem;color:var(--text-muted);margin-top:0.2rem;" class="mono">
                      <span>PRINC.</span>
                      <span>AVANZADO</span>
                      <span>ÉLITE</span>
                    </div>
                  </td>
                  <td>
                    <span class="badge ${item.classification.tier >= 3 ? 'badge-solid' : 'badge-outline'}">
                      ${item.classification.level}
                    </span>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ============================================================================
// TAB 5: SUBIDA DE VIDEOS DE EJERCICIOS Y RETROALIMENTACIÓN DEL ADMINISTRADOR
// ============================================================================
function renderClientVideosTab(client) {
  const videos = client.videos || [];
  return `
    <div class="section-header">
      <div>
        <div class="eyebrow">ANÁLISIS DE TÉCNICA // REVISIÓN POR DIEGO RODEA</div>
        <h2 class="section-title">Subir Videos de Ejercicios y Ver Retroalimentación</h2>
        <p class="section-desc">Sube el video de tu serie para que Diego Rodea analice tu postura, profundidad y velocidad de barra y te deje tu retroalimentación aquí mismo.</p>
      </div>
    </div>

    <div class="grid-2" style="margin-bottom:1.75rem;">
      <!-- Formulario para Subir Video -->
      <div class="card card-strong">
        <h3 class="card-title" style="margin-bottom:1rem;">Subir Nuevo Video para Análisis</h3>
        <form id="form-upload-video">
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">EJERCICIO REALIZADO</label>
              <select id="vid-exercise" class="form-select" required>
                ${window.ANUARUS_EXERCISES.map(ex => `<option value="${ex.id}">${escapeHtml(ex.name)}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">FECHA DEL LEVANTAMIENTO</label>
              <input type="date" id="vid-date" class="form-input mono" value="${new Date().toISOString().split('T')[0]}" required />
            </div>
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">PESO UTILIZADO (KG)</label>
              <input type="number" step="0.5" id="vid-weight" class="form-input mono" value="100" required />
            </div>
            <div class="form-group">
              <label class="form-label">REPETICIONES EN EL VIDEO</label>
              <input type="number" step="1" id="vid-reps" class="form-input mono" value="5" required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">SELECCIONAR ARCHIVO DE VIDEO (DESDE TU CELULAR O PC)</label>
            <input type="file" id="vid-file" accept="video/*" class="form-input" />
          </div>

          <div class="form-group">
            <label class="form-label">O PEGAR ENLACE DE VIDEO (OPCIONAL: DRIVE / YOUTUBE / ICLOUD)</label>
            <input type="url" id="vid-url" class="form-input mono" placeholder="https://..." />
          </div>

          <div class="form-group">
            <label class="form-label">DUDAS O COMENTARIOS PARA DIEGO RODEA</label>
            <textarea id="vid-notes" class="form-textarea" rows="2" placeholder="Ej. ¿Cómo ves la profundidad en la 3ra repetición?"></textarea>
          </div>

          <button type="submit" class="btn btn-block">
            Subir Video y Enviar a Revisión de Diego Rodea
          </button>
        </form>
      </div>

      <!-- Guía de Grabación Biomecánica -->
      <div class="card">
        <div class="eyebrow">PROTOCOLO DE GRABACIÓN ANUARUS</div>
        <h3 class="card-title" style="margin-bottom:0.75rem;">¿Cómo grabar tus ejercicios para un análisis óptimo?</h3>
        <ul style="padding-left:1.2rem;font-size:0.86rem;line-height:1.65;color:var(--text-secondary);">
          <li style="margin-bottom:0.45rem;"><strong>Peso Muerto y Sentadilla Libre:</strong> Coloca la cámara a la altura de la cadera en un ángulo diagonal lateral (45° o 90° de perfil) donde se vean los pies y el recorrido completo de la barra.</li>
          <li style="margin-bottom:0.45rem;"><strong>Press Militar y Fondos en Paralelas:</strong> Graba de perfil completo para evaluar la alineación vertical muñeca-codo-hombro y la estabilidad lumbar.</li>
          <li style="margin-bottom:0.45rem;"><strong>Press de Banca Inclinado y Pull Up:</strong> Graba en diagonal a 45° para observar la retracción escapular y el rango completo de movimiento.</li>
        </ul>
      </div>
    </div>

    <!-- Lista de Videos del Cliente y Retroalimentación de Diego Rodea -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Mis Videos Subidos y Retroalimentación de Diego Rodea</h3>
        <span class="badge">${videos.length} VIDEOS</span>
      </div>

      ${videos.length === 0 ? `
        <p style="color:var(--text-secondary);font-size:0.88rem;">Aún no has subido videos. Utiliza el formulario superior para subir tu primer levantamiento.</p>
      ` : `
        <div class="grid-2">
          ${videos.map(v => {
            const ex = window.ANUARUS_EXERCISES.find(x => x.id === v.exerciseId) || { name: v.exerciseId };
            return `
              <div style="border:1px solid var(--border-color);border-radius:var(--radius-md);padding:1.25rem;background:var(--bg-primary);">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.75rem;gap:0.5rem;">
                  <div>
                    <span class="eyebrow">${escapeHtml(v.date)}</span>
                    <h4 style="font-size:1rem;">${escapeHtml(ex.name)} — ${v.weightKg} kg × ${v.reps} reps</h4>
                  </div>
                  <span class="badge ${v.status === 'reviewed' ? 'badge-solid' : 'badge-outline'}">
                    ${v.status === 'reviewed' ? '✓ RETROALIMENTADO POR DIEGO RODEA' : '● EN REVISIÓN'}
                  </span>
                </div>

                ${v.hasLocalBlob || v.externalUrl ? `
                  <div class="video-player-box" style="margin-bottom:0.65rem;">
                    <video controls playsinline id="client-vid-el-${v.id}" src="${escapeHtml(v.externalUrl || '')}"></video>
                  </div>
                ` : ''}

                <div style="font-size:0.84rem;color:var(--text-secondary);margin-bottom:0.5rem;">
                  <strong>Tu nota:</strong> "${escapeHtml(v.userNotes || 'Sin nota')}"
                </div>

                <div class="coach-feedback-box">
                  <div class="eyebrow" style="margin-bottom:0.25rem;">RETROALIMENTACIÓN DE DIEGO RODEA:</div>
                  ${v.status === 'reviewed' ? `
                    <div style="font-weight:700;font-size:0.85rem;margin-bottom:0.25rem;">Diagnóstico: ${escapeHtml(v.rating || 'Revisado')}</div>
                    <p style="font-size:0.86rem;line-height:1.5;">"${escapeHtml(v.coachComment)}"</p>
                  ` : `
                    <p style="font-size:0.84rem;color:var(--text-secondary);">Tu video ya está en la bandeja de tu entrenador Diego Rodea. Recibirás sus comentarios biomecánicos aquí mismo.</p>
                  `}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `}
    </div>
  `;
}

// ============================================================================
// 14. EVENTOS DE LA VISTA DEL CLIENTE Y GENERACIÓN DE INFORME PDF + WHATSAPP
// ============================================================================
function loadClientVideoBlobs(client) {
  (client.videos || []).forEach(v => {
    if (v.hasLocalBlob) {
      VideoStore.getBlobUrl(v.id).then(url => {
        const el = document.getElementById(`client-vid-el-${v.id}`);
        if (el && url) el.src = url;
      });
    }
  });
}

function bindClientEvents(client) {
  // Exit Coach Inspection
  const exitInspectBtn = document.getElementById('exit-inspect-btn');
  if (exitInspectBtn) {
    exitInspectBtn.addEventListener('click', () => {
      AppState.impersonatingUserId = null;
      AppState.activeTab = 'admin_users';
      AppState.render();
    });
  }

  // Logout
  const logoutBtn = document.getElementById('client-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (AppState.impersonatingUserId) {
        AppState.impersonatingUserId = null;
        AppState.activeTab = 'admin_users';
      } else {
        AppState.currentUser = null;
      }
      AppState.render();
    });
  }

  // Theme Toggle
  const themeBtn = document.getElementById('client-theme-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      AppState.theme = AppState.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem(THEME_KEY, AppState.theme);
      document.documentElement.setAttribute('data-theme', AppState.theme);
      AppState.render();
    });
  }

  // Navigation Tabs
  document.querySelectorAll('[data-client-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      AppState.activeTab = btn.getAttribute('data-client-tab');
      AppState.render();
    });
  });

  document.querySelectorAll('[data-go-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      AppState.activeTab = btn.getAttribute('data-go-tab');
      AppState.render();
    });
  });

  // Topbar PDF & WhatsApp Buttons
  const pdfTopBtn = document.getElementById('export-pdf-top-btn');
  if (pdfTopBtn) {
    pdfTopBtn.addEventListener('click', () => generateClientPdfReport(client, false));
  }

  const waTopBtn = document.getElementById('send-wa-top-btn');
  if (waTopBtn) {
    waTopBtn.addEventListener('click', () => sendWhatsAppReport(client));
  }

  const dashPdfBtn = document.getElementById('dash-pdf-btn');
  if (dashPdfBtn) {
    dashPdfBtn.addEventListener('click', () => {
      generateClientPdfReport(client, true);
    });
  }

  // Unit Switcher (KG / LB)
  document.querySelectorAll('[data-set-unit]').forEach(btn => {
    btn.addEventListener('click', () => {
      const newUnit = btn.getAttribute('data-set-unit');
      const oldUnit = AppState.workoutDraft.unit || client.preferredUnit || 'kg';
      if (newUnit !== oldUnit) {
        // Convert existing draft weights
        Object.keys(AppState.workoutDraft.setsByExercise).forEach(exId => {
          AppState.workoutDraft.setsByExercise[exId] = (AppState.workoutDraft.setsByExercise[exId] || []).map(s => {
            const kgVal = AppState.toKg(s.weight, oldUnit);
            return {
              ...s,
              weight: AppState.convertWeightValue(kgVal, newUnit)
            };
          });
        });
      }
      client.preferredUnit = newUnit;
      AppState.workoutDraft.unit = newUnit;
      AppState.persist();
      AppState.render();
      showToast(`Unidad cambiada a ${newUnit.toUpperCase()}.`);
    });
  });

  // Anthropometry Form Submit
  const antForm = document.getElementById('form-anthropometry');
  if (antForm) {
    antForm.addEventListener('submit', (e) => {
      e.preventDefault();
      client.weightKg = parseFloat(document.getElementById('ant-weight').value) || client.weightKg;
      client.heightCm = parseFloat(document.getElementById('ant-height').value) || client.heightCm;
      client.sex = document.getElementById('ant-sex').value;

      const todayStr = new Date().toISOString().split('T')[0];
      const newMeas = {
        waist: parseFloat(document.getElementById('ant-waist').value) || 80,
        neck: parseFloat(document.getElementById('ant-neck').value) || 38,
        hip: parseFloat(document.getElementById('ant-hip').value) || 96,
        arm: parseFloat(document.getElementById('ant-arm').value) || 35,
        calf: parseFloat(document.getElementById('ant-calf').value) || 36,
        thigh: parseFloat(document.getElementById('ant-thigh').value) || 55,
        updatedAt: todayStr
      };
      client.measurements = newMeas;
      client.measurementsHistory = client.measurementsHistory || [];
      client.measurementsHistory.push({ date: todayStr, weightKg: client.weightKg, ...newMeas });

      AppState.persist();
      AppState.render();
      showToast('Medidas, % Grasa Corporal y FFMI actualizados en la nube.');
    });
  }

  // Measurement Visual Guide Modal
  document.querySelectorAll('[data-show-measure-guide]').forEach(btn => {
    btn.addEventListener('click', () => {
      const mKey = btn.getAttribute('data-show-measure-guide');
      const g = window.ANUARUS_MEASUREMENTS_GUIDE[mKey];
      if (!g) return;
      const slot = document.getElementById('client-modal-slot');
      slot.innerHTML = `
        <div class="modal-backdrop" id="measure-guide-modal">
          <div class="modal-box" style="max-width:480px;">
            <div class="card-header">
              <div>
                <span class="eyebrow">GUÍA VISUAL DE MEDICIÓN // ANUARUS</span>
                <h3 class="card-title">Cómo medir: ${escapeHtml(g.name)}</h3>
              </div>
              <button type="button" class="btn btn-secondary btn-sm" id="close-mguide-btn">✕</button>
            </div>
            <div style="margin-bottom:1rem;">${g.svg}</div>
            <div class="mono" style="font-size:0.78rem;font-weight:700;margin-bottom:0.5rem;">
              Punto anatómico: ${escapeHtml(g.landmark)}
            </div>
            <ol style="padding-left:1.25rem;font-size:0.86rem;line-height:1.6;">
              ${g.instructions.map(i => `<li style="margin-bottom:0.3rem;">${escapeHtml(i)}</li>`).join('')}
            </ol>
          </div>
        </div>
      `;
      document.getElementById('close-mguide-btn').addEventListener('click', () => { slot.innerHTML = ''; });
    });
  });

  // Workout Logger Events
  const woDateInp = document.getElementById('wo-date-input');
  if (woDateInp) {
    woDateInp.addEventListener('change', () => {
      AppState.workoutDraft.date = woDateInp.value;
    });
  }

  const woNotesInp = document.getElementById('wo-notes-input');
  if (woNotesInp) {
    woNotesInp.addEventListener('input', () => {
      AppState.workoutDraft.notes = woNotesInp.value;
    });
  }

  document.querySelectorAll('[data-toggle-workout-ex]').forEach(card => {
    card.addEventListener('click', () => {
      const exId = card.getAttribute('data-toggle-workout-ex');
      const idx = AppState.workoutDraft.selectedExercises.indexOf(exId);
      if (idx >= 0) {
        AppState.workoutDraft.selectedExercises.splice(idx, 1);
      } else {
        AppState.workoutDraft.selectedExercises.push(exId);
      }
      AppState.render();
    });
  });

  document.querySelectorAll('[data-add-set]').forEach(btn => {
    btn.addEventListener('click', () => {
      const exId = btn.getAttribute('data-add-set');
      const arr = AppState.workoutDraft.setsByExercise[exId] || [];
      const prev = arr[arr.length - 1] || { weight: 60, reps: 5 };
      arr.push({ weight: prev.weight, reps: prev.reps });
      AppState.workoutDraft.setsByExercise[exId] = arr;
      AppState.render();
    });
  });

  document.querySelectorAll('[data-remove-set]').forEach(btn => {
    btn.addEventListener('click', () => {
      const exId = btn.getAttribute('data-remove-set');
      const idx = parseInt(btn.getAttribute('data-set-idx'), 10);
      const arr = AppState.workoutDraft.setsByExercise[exId] || [];
      if (arr.length > 1) {
        arr.splice(idx, 1);
        AppState.render();
      }
    });
  });

  // Live 1RM & Week-over-Week comparison as user types weight or reps!
  document.querySelectorAll('[data-set-input]').forEach(inp => {
    inp.addEventListener('input', () => {
      const field = inp.getAttribute('data-set-input');
      const exId = inp.getAttribute('data-ex-id');
      const idx = parseInt(inp.getAttribute('data-set-idx'), 10);
      const unit = AppState.workoutDraft.unit || client.preferredUnit || 'kg';
      const arr = AppState.workoutDraft.setsByExercise[exId];
      if (!arr || !arr[idx]) return;

      arr[idx][field] = parseFloat(inp.value) || 0;

      const ex = window.ANUARUS_EXERCISES.find(x => x.id === exId);
      const last = StrengthEngine.getLastSessionForExercise(client, exId, null);
      const weightKg = AppState.toKg(arr[idx].weight, unit);
      const curMetric = StrengthEngine.calculateExerciseMetrics(ex, weightKg, arr[idx].reps, client.weightKg);
      const cur1RMDisp = AppState.convertWeightValue(curMetric.est1RMKg, unit);

      let compLabel = `1RM: ${cur1RMDisp} ${unit}`;
      if (last && last.bestMetric && last.bestMetric.systemic1RMKg > 0) {
        const diffKg = +(curMetric.systemic1RMKg - last.bestMetric.systemic1RMKg).toFixed(1);
        if (diffKg > 0) compLabel = `★ PR! 1RM: ${cur1RMDisp}${unit} (+${AppState.convertWeightValue(diffKg, unit)})`;
        else if (diffKg === 0) compLabel = `= Igualó (${cur1RMDisp}${unit})`;
        else compLabel = `1RM: ${cur1RMDisp}${unit} (Sem. pas: ${AppState.convertWeightValue(last.bestMetric.est1RMKg, unit)})`;
      }
      const pill = document.getElementById(`rm-pill-${exId}-${idx}`);
      if (pill) pill.textContent = compLabel;
    });
  });

  // Save Workout Session
  const saveWoBtn = document.getElementById('save-workout-session-btn');
  if (saveWoBtn) {
    saveWoBtn.addEventListener('click', () => {
      const draft = AppState.workoutDraft;
      const unit = draft.unit || client.preferredUnit || 'kg';
      if (draft.selectedExercises.length === 0) {
        alert('Selecciona al menos un ejercicio.');
        return;
      }

      const exercisesPayload = draft.selectedExercises.map(exId => {
        const rawSets = draft.setsByExercise[exId] || [];
        const validSets = rawSets
          .filter(s => Number(s.reps) > 0)
          .map(s => ({
            weightKg: AppState.toKg(s.weight, unit),
            reps: parseInt(s.reps, 10)
          }));
        return { exerciseId: exId, sets: validSets };
      }).filter(e => e.sets.length > 0);

      if (exercisesPayload.length === 0) {
        alert('Ingresa al menos una serie con repeticiones válidas.');
        return;
      }

      const newSession = {
        id: 'ses_' + Date.now(),
        date: draft.date || new Date().toISOString().split('T')[0],
        unit,
        notes: (document.getElementById('wo-notes-input')?.value || '').trim(),
        exercises: exercisesPayload
      };

      client.sessions = client.sessions || [];
      client.sessions.push(newSession);
      AppState.workoutDraft.notes = '';
      AppState.persist();
      AppState.activeTab = 'progress';
      AppState.render();
      showToast('Sesión guardada en la nube. Tu 1RM y gráficas han sido actualizados.');
    });
  }

  // Delete Session
  document.querySelectorAll('[data-delete-session]').forEach(btn => {
    btn.addEventListener('click', () => {
      const sesId = btn.getAttribute('data-delete-session');
      client.sessions = (client.sessions || []).filter(s => s.id !== sesId);
      AppState.persist();
      AppState.render();
      showToast('Sesión eliminada.');
    });
  });

  // Progress Chart Exercise Filter
  const progFilter = document.getElementById('progress-ex-filter');
  if (progFilter) {
    progFilter.addEventListener('change', () => {
      AppState.selectedProgressExercise = progFilter.value;
      const summary = StrengthEngine.getUserStrengthSummary(client);
      ChartRenderer.drawProgressionChart('progress-canvas', summary, AppState.selectedProgressExercise, client.preferredUnit || 'kg');
    });
  }

  // Upload Video Form
  const vidForm = document.getElementById('form-upload-video');
  if (vidForm) {
    vidForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const exerciseId = document.getElementById('vid-exercise').value;
      const date = document.getElementById('vid-date').value;
      const weightKg = parseFloat(document.getElementById('vid-weight').value) || 0;
      const reps = parseInt(document.getElementById('vid-reps').value, 10) || 1;
      const externalUrl = document.getElementById('vid-url').value.trim();
      const userNotes = document.getElementById('vid-notes').value.trim();
      const fileInput = document.getElementById('vid-file');
      const file = fileInput && fileInput.files ? fileInput.files[0] : null;

      const vidId = 'vid_' + Date.now();
      let hasLocalBlob = false;
      if (file) {
        hasLocalBlob = await VideoStore.saveBlob(vidId, file);
      }

      client.videos = client.videos || [];
      client.videos.unshift({
        id: vidId,
        date,
        exerciseId,
        weightKg,
        reps,
        userNotes,
        externalUrl,
        hasLocalBlob,
        status: 'pending',
        rating: '',
        coachComment: ''
      });

      AppState.persist();
      AppState.render();
      showToast('Video subido con éxito para revisión de Diego Rodea.');
    });
  }
}

// ============================================================================
// 15. GENERADOR DE INFORME PDF Y ENVÍO POR WHATSAPP A DIEGO RODEA
// ============================================================================
function buildReportHtml(client) {
  const phys = ClinicalEngine.analyzePhysique(client);
  const str = StrengthEngine.getUserStrengthSummary(client);
  const unit = client.preferredUnit || 'kg';
  const m = client.measurements || {};
  const todayStr = new Date().toISOString().split('T')[0];

  return `
    <div style="border:2px solid #0A0A0A;padding:28px;background:#FFFFFF;color:#0A0A0A;">
      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #0A0A0A;padding-bottom:16px;margin-bottom:20px;">
        <div style="display:flex;align-items:center;gap:14px;">
          <img src="${window.ANUARUS_TRANSPARENT_LOGO || ''}" style="width:68px;height:68px;object-fit:contain;" />
          <div>
            <div style="font-size:22px;font-weight:800;letter-spacing:3px;">ANUARUS</div>
            <div style="font-family:monospace;font-size:11px;color:#444;">INFORME CLÍNICO, ANTROPOMÉTRICO Y DE FUERZA</div>
            <div style="font-size:12px;font-weight:600;margin-top:2px;">Entrenador &amp; Nutriólogo: Diego Rodea</div>
          </div>
        </div>
        <div style="text-align:right;font-family:monospace;font-size:11px;">
          <div><strong>PACIENTE / ATLETA:</strong> ${escapeHtml(client.name)}</div>
          <div><strong>FECHA DE EMISIÓN:</strong> ${todayStr}</div>
          <div><strong>CLASIFICACIÓN:</strong> ${str.overallLevel.toUpperCase()} (${str.avgPctElite}%)</div>
        </div>
      </div>

      <!-- KPIs -->
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:18px;">
        <div style="border:1px solid #0A0A0A;padding:10px;">
          <div style="font-size:10px;font-family:monospace;color:#555;">PESO / ALTURA</div>
          <div style="font-size:18px;font-weight:800;font-family:monospace;">${client.weightKg} kg / ${client.heightCm} cm</div>
        </div>
        <div style="border:1px solid #0A0A0A;padding:10px;">
          <div style="font-size:10px;font-family:monospace;color:#555;">GRASA CORPORAL</div>
          <div style="font-size:18px;font-weight:800;font-family:monospace;">${phys.bf}%</div>
          <div style="font-size:10px;">${phys.bfCat.label}</div>
        </div>
        <div style="border:1px solid #0A0A0A;padding:10px;">
          <div style="font-size:10px;font-family:monospace;color:#555;">FFMI (MASA MAGRA)</div>
          <div style="font-size:18px;font-weight:800;font-family:monospace;">${phys.ffmiData.ffmi}</div>
          <div style="font-size:10px;">${phys.ffmiData.level} (${phys.ffmiData.leanMassKg} kg)</div>
        </div>
        <div style="border:1px solid #0A0A0A;padding:10px;">
          <div style="font-size:10px;font-family:monospace;color:#555;">NIVEL DE FUERZA</div>
          <div style="font-size:18px;font-weight:800;font-family:monospace;">${str.overallLevel}</div>
          <div style="font-size:10px;">Índice: ${str.avgPctElite}% Élite</div>
        </div>
      </div>

      <!-- Perímetros Corporales -->
      <div style="margin-bottom:18px;">
        <div style="font-family:monospace;font-size:11px;font-weight:700;text-transform:uppercase;margin-bottom:6px;">
          01 // PERÍMETROS ANTROPOMÉTRICOS Y DIAGNÓSTICO DE SIMETRÍA
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:12px;">
          <thead>
            <tr style="background:#F2F2F2;">
              <th style="border:1px solid #0A0A0A;padding:6px;text-align:left;">Cintura</th>
              <th style="border:1px solid #0A0A0A;padding:6px;text-align:left;">Cuello</th>
              <th style="border:1px solid #0A0A0A;padding:6px;text-align:left;">Cadera</th>
              <th style="border:1px solid #0A0A0A;padding:6px;text-align:left;">Brazo</th>
              <th style="border:1px solid #0A0A0A;padding:6px;text-align:left;">Pantorrilla</th>
              <th style="border:1px solid #0A0A0A;padding:6px;text-align:left;">Muslo Medio</th>
            </tr>
          </thead>
          <tbody>
            <tr style="font-family:monospace;font-weight:700;">
              <td style="border:1px solid #0A0A0A;padding:6px;">${m.waist || '—'} cm</td>
              <td style="border:1px solid #0A0A0A;padding:6px;">${m.neck || '—'} cm</td>
              <td style="border:1px solid #0A0A0A;padding:6px;">${m.hip || '—'} cm</td>
              <td style="border:1px solid #0A0A0A;padding:6px;">${m.arm || '—'} cm</td>
              <td style="border:1px solid #0A0A0A;padding:6px;">${m.calf || '—'} cm</td>
              <td style="border:1px solid #0A0A0A;padding:6px;">${m.thigh || '—'} cm</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Puntos Débiles y Qué Mejorar -->
      <div style="border:1px solid #0A0A0A;padding:12px;margin-bottom:18px;background:#FAFAFA;">
        <div style="font-family:monospace;font-size:11px;font-weight:700;margin-bottom:6px;">
          02 // PUNTOS DÉBILES DETECTADOS Y PLAN DE MEJORA
        </div>
        <ul style="padding-left:16px;font-size:12px;line-height:1.5;margin-bottom:8px;">
          ${phys.weakPoints.map(w => `<li>${escapeHtml(w)}</li>`).join('')}
        </ul>
        <div style="font-size:12px;">
          <strong>Qué mejorar:</strong> ${phys.actionPlan.map(a => escapeHtml(a)).join(' ')}
        </div>
      </div>

      <!-- Tabla de los 6 Ejercicios y 1RM -->
      <div style="margin-bottom:18px;">
        <div style="font-family:monospace;font-size:11px;font-weight:700;margin-bottom:6px;">
          03 // RENDIMIENTO EN LOS 6 EJERCICIOS OFICIALES Y 1RM APROXIMADO
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:12px;">
          <thead>
            <tr style="background:#F2F2F2;">
              <th style="border:1px solid #0A0A0A;padding:6px;text-align:left;">Ejercicio</th>
              <th style="border:1px solid #0A0A0A;padding:6px;text-align:left;">Última Marca</th>
              <th style="border:1px solid #0A0A0A;padding:6px;text-align:left;">1RM Aproximado</th>
              <th style="border:1px solid #0A0A0A;padding:6px;text-align:left;">Nivel</th>
            </tr>
          </thead>
          <tbody>
            ${str.byExercise.map(item => `
              <tr>
                <td style="border:1px solid #0A0A0A;padding:6px;"><strong>${escapeHtml(item.exercise.name)}</strong></td>
                <td style="border:1px solid #0A0A0A;padding:6px;font-family:monospace;">
                  ${item.latest ? `${AppState.formatWeight(item.latest.weightKg, unit)} × ${item.latest.reps} (${item.latest.date})` : 'Sin registro'}
                </td>
                <td style="border:1px solid #0A0A0A;padding:6px;font-family:monospace;font-weight:700;">
                  ${item.hasData ? AppState.formatWeight(item.latest.est1RMKg, unit) : '—'}
                </td>
                <td style="border:1px solid #0A0A0A;padding:6px;font-family:monospace;">
                  ${item.classification.level} (${item.classification.pctOfElite}%)
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Retroalimentación de Diego Rodea -->
      <div style="border-left:4px solid #0A0A0A;padding:10px 14px;background:#F4F4F4;">
        <div style="font-family:monospace;font-size:10px;font-weight:700;">RETROALIMENTACIÓN DEL ENTRENADOR Y NUTRIÓLOGO DIEGO RODEA:</div>
        <div style="font-size:12px;margin-top:4px;line-height:1.5;">"${escapeHtml(client.coachFeedback || 'Continuar con sobrecarga progresiva semanal.')}"</div>
      </div>
    </div>
  `;
}

async function generateClientPdfReport(client, alsoOpenWhatsApp = false) {
  const staging = document.getElementById('pdf-report-staging');
  if (!staging) return;
  staging.innerHTML = buildReportHtml(client);
  showToast('Generando informe PDF de progreso Anuarus...');

  const fileName = `Informe_Anuarus_${client.name.replace(/\s+/g, '_')}.pdf`;

  if (window.html2pdf) {
    try {
      const opt = {
        margin: 8,
        filename: fileName,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#FFFFFF' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      await window.html2pdf().set(opt).from(staging).save();
      showToast('Informe PDF descargado correctamente.');
      if (alsoOpenWhatsApp) {
        setTimeout(() => sendWhatsAppReport(client), 600);
      }
      return;
    } catch (e) {
      console.warn('html2pdf fallback to print:', e);
    }
  }

  window.print();
  if (alsoOpenWhatsApp) {
    sendWhatsAppReport(client);
  }
}

function sendWhatsAppReport(client) {
  const phys = ClinicalEngine.analyzePhysique(client);
  const str = StrengthEngine.getUserStrengthSummary(client);
  const unit = client.preferredUnit || 'kg';
  const m = client.measurements || {};
  const coachPhone = (AppState.db.coachProfile?.whatsapp || '').replace(/\D+/g, '');

  const liftsLines = str.byExercise
    .filter(x => x.hasData)
    .map(x => `• ${x.exercise.name}: ${AppState.formatWeight(x.latest.weightKg, unit)} x ${x.latest.reps} (1RM: ${AppState.formatWeight(x.latest.est1RMKg, unit)} - ${x.classification.level})`)
    .join('\n');

  const msg = [
    `*INFORME DE PROGRESO ANUARUS*`,
    `Atleta: *${client.name}*`,
    `Peso: ${client.weightKg} kg | Altura: ${client.heightCm} cm`,
    `% Grasa Corporal: *${phys.bf}%* (${phys.bfCat.label})`,
    `FFMI: *${phys.ffmiData.ffmi}* (Nivel: ${phys.ffmiData.level})`,
    `Medidas (cm): Cintura ${m.waist} | Cuello ${m.neck} | Cadera ${m.hip} | Brazo ${m.arm} | Muslo ${m.thigh} | Pantorrilla ${m.calf}`,
    ``,
    `*Nivel Global de Fuerza:* ${str.overallLevel} (${str.avgPctElite}%)`,
    liftsLines || 'Sin sesiones registradas aún.',
    ``,
    `Hola Diego, te envío mi reporte actualizado de la semana (adjunto mi PDF descargado de Anuarus).`
  ].join('\n');

  const waUrl = coachPhone
    ? `https://wa.me/${coachPhone}?text=${encodeURIComponent(msg)}`
    : `https://wa.me/?text=${encodeURIComponent(msg)}`;

  window.open(waUrl, '_blank');
}

// ============================================================================
// INICIALIZAR AL CARGAR EL DOM
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  AppState.init();
});
