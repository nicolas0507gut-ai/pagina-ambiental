const SUPABASE_URL = "https://vzdtynxcejpbppbzvvcj.supabase.co";
const SUPABASE_KEY = "sb_publishable_MayIsuOlaeBzYkfiAA_Ymg_Gfc0dJ6G";

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const scoreElement = document.getElementById("score");
const badgeElement = document.getElementById("badge");
const progressFill = document.getElementById("progressFill");
const toast = document.getElementById("toast");

const openAuthBtn = document.getElementById("openAuthBtn");
const closeAuthBtn = document.getElementById("closeAuthBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userStatus = document.getElementById("userStatus");
const authSection = document.getElementById("authSection");
const authMessage = document.getElementById("authMessage");

const showLoginBtn = document.getElementById("showLoginBtn");
const showRegisterBtn = document.getElementById("showRegisterBtn");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginBtn = document.getElementById("loginBtn");

const registerName = document.getElementById("registerName");
const registerEmail = document.getElementById("registerEmail");
const registerPassword = document.getElementById("registerPassword");
const registerBtn = document.getElementById("registerBtn");

const userDashboard = document.getElementById("userDashboard");
const dashboardName = document.getElementById("dashboardName");
const dashboardPoints = document.getElementById("dashboardPoints");
const dashboardRole = document.getElementById("dashboardRole");
const mySubmissionsList = document.getElementById("mySubmissionsList");

const photoInputs = document.querySelectorAll(".mission-photo");
const evidenceButtons = document.querySelectorAll(".submit-evidence-btn");

const adminPanel = document.getElementById("adminPanel");
const adminSubmissionsList = document.getElementById("adminSubmissionsList");
const refreshAdminBtn = document.getElementById("refreshAdminBtn");

const commitmentBtn = document.getElementById("commitmentBtn");
const commitmentMessage = document.getElementById("commitmentMessage");

let currentUser = null;
let currentProfile = null;
let mySubmissions = [];

const dailyQuestions = {
  consejo: [
    {
      question: "¿Qué acción ayuda a reducir la acumulación de residuos sólidos en casa?",
      options: [
        "Separar botellas y plásticos limpios para reutilizarlos",
        "Mezclar todos los residuos en una sola bolsa",
        "Dejar la basura en la esquina de la calle"
      ],
      correct: 0,
      points: 15
    },
    {
      question: "¿Qué se puede hacer con una botella plástica limpia para darle un segundo uso?",
      options: [
        "Botarla junto con residuos orgánicos",
        "Convertirla en una maceta pequeña",
        "Quemarla para reducir el volumen de basura"
      ],
      correct: 1,
      points: 15
    },
    {
      question: "¿Qué práctica ayuda a disminuir el uso innecesario de bolsas plásticas?",
      options: [
        "Pedir una bolsa nueva para cada compra pequeña",
        "Reutilizar bolsas limpias o llevar una bolsa propia",
        "Guardar bolsas sucias con residuos húmedos"
      ],
      correct: 1,
      points: 15
    },
    {
      question: "¿Cuál es una buena recomendación para compartir con un vecino o familiar?",
      options: [
        "Arrojar residuos solo en espacios públicos poco transitados",
        "Evitar dejar basura en la calle y esperar el horario de recolección",
        "Juntar residuos en montículos para que se vean más rápido"
      ],
      correct: 1,
      points: 15
    }
  ],
  entorno: [
    {
      question: "¿Qué problema ambiental se genera cuando las pistas deterioradas levantan polvo?",
      options: [
        "Mejora la calidad del aire",
        "Aumenta la polvareda y puede afectar la salud respiratoria",
        "Reduce la presencia de partículas en el ambiente"
      ],
      correct: 1,
      points: 10
    },
    {
      question: "¿Qué consecuencia puede generar la acumulación de basura en las calles?",
      options: [
        "Atracción de moscas, mosquitos y roedores",
        "Mayor limpieza del suelo",
        "Disminución de malos olores"
      ],
      correct: 0,
      points: 10
    },
    {
      question: "¿Qué tipo de personas pueden verse más afectadas por el polvo y la mala calidad del aire?",
      options: [
        "Niños, adultos mayores y personas con problemas respiratorios",
        "Solo personas que viven lejos del distrito",
        "Únicamente personas que no salen de casa"
      ],
      correct: 0,
      points: 10
    },
    {
      question: "¿Qué acción ayuda a identificar problemas ambientales en la comunidad?",
      options: [
        "Ignorar las zonas con basura o polvo",
        "Observar el entorno y reconocer puntos críticos",
        "Esperar que otros vecinos reporten todo"
      ],
      correct: 1,
      points: 10
    }
  ]
};

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2600);
}

function showAuth() {
  authSection.classList.remove("hidden");
  authSection.scrollIntoView({ behavior: "smooth" });
}

function hideAuth() {
  authSection.classList.add("hidden");
  authMessage.textContent = "";
}

function setAuthMessage(message, type = "") {
  authMessage.textContent = message;
  authMessage.className = type;
}

function getBadge(points) {
  if (points >= 100) return "Protector de Florencia";
  if (points >= 60) return "Guardián Ambiental";
  if (points >= 30) return "Vecino Responsable";
  return "Visitante Verde";
}

function updateProgressUI(points) {
  scoreElement.textContent = points;
  badgeElement.textContent = getBadge(points);

  let percentage = (points / 100) * 100;
  if (percentage > 100) percentage = 100;

  progressFill.style.width = percentage + "%";
}

function formatDate(value) {
  if (!value) return "Sin fecha";
  return new Date(value).toLocaleString("es-PE");
}

function getCleanFileName(fileName) {
  return fileName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9.\-_]/g, "");
}

function requireLogin() {
  if (!currentUser) {
    showToast("Debes iniciar sesión para realizar esta acción.");
    showAuth();
    return false;
  }
  return true;
}

async function loadProfile() {
  if (!currentUser) return null;

  const { data, error } = await db
    .from("profiles")
    .select("*")
    .eq("id", currentUser.id)
    .single();

  if (error) {
    console.error(error);
    showToast("No se pudo cargar el perfil.");
    return null;
  }

  currentProfile = data;
  return data;
}

async function loadMySubmissions() {
  if (!currentUser) {
    mySubmissions = [];
    return [];
  }

  const { data, error } = await db
    .from("mission_submissions")
    .select(`
      id,
      mission_id,
      foto_url,
      estado,
      puntos,
      comentario_admin,
      created_at,
      revisado_en,
      missions (
        titulo,
        puntos
      )
    `)
    .eq("user_id", currentUser.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    showToast("No se pudieron cargar tus evidencias.");
    return [];
  }

  mySubmissions = data || [];
  return mySubmissions;
}

function renderLoggedOutUI() {
  currentProfile = null;
  currentUser = null;
  mySubmissions = [];

  userStatus.textContent = "Visitante";
  openAuthBtn.classList.remove("hidden");
  logoutBtn.classList.add("hidden");
  userDashboard.classList.add("hidden");
  adminPanel.classList.add("hidden");

  updateProgressUI(0);
  resetMissionCardsForVisitor();
  setupDailyQuestion("consejo", "consejoQuestion", "consejoOptions", "consejoMessage", "consejoCooldown");
  setupDailyQuestion("entorno", "entornoQuestion", "entornoOptions", "entornoMessage", "entornoCooldown");
}

function renderLoggedInUI() {
  if (!currentProfile) return;

  userStatus.textContent = currentProfile.nombre || currentProfile.email || "Usuario";
  openAuthBtn.classList.add("hidden");
  logoutBtn.classList.remove("hidden");

  userDashboard.classList.remove("hidden");
  dashboardName.textContent = currentProfile.nombre || "Usuario";
  dashboardPoints.textContent = currentProfile.puntos;
  dashboardRole.textContent = currentProfile.rol === "admin" ? "Administrador" : "Usuario";

  updateProgressUI(currentProfile.puntos);

  if (currentProfile.rol === "admin") {
    adminPanel.classList.remove("hidden");
  } else {
    adminPanel.classList.add("hidden");
  }
}

function resetMissionCardsForVisitor() {
  evidenceButtons.forEach(button => {
    const missionId = button.dataset.id;
    const status = document.getElementById("status-" + missionId);

    button.disabled = false;
    button.textContent = "Inicia sesión para enviar";
    button.classList.remove("completed");

    if (status) {
      status.textContent = "Para enviar evidencia y ganar puntos debes iniciar sesión.";
      status.className = "submission-status pending";
    }
  });
}

function renderMissionStatus() {
  evidenceButtons.forEach(button => {
    const missionId = button.dataset.id;
    const status = document.getElementById("status-" + missionId);

    button.disabled = false;
    button.textContent = "Enviar para verificación";
    button.classList.remove("completed");

    if (status) {
      status.textContent = "Sube una foto y envíala para revisión manual.";
      status.className = "submission-status";
    }

    const related = mySubmissions.filter(item => item.mission_id === missionId);

    const approved = related.find(item => item.estado === "aprobado");
    const pending = related.find(item => item.estado === "pendiente");
    const rejected = related.find(item => item.estado === "rechazado");

    if (approved) {
      button.disabled = true;
      button.textContent = "Misión aprobada";
      button.classList.add("completed");

      if (status) {
        status.textContent = "Aprobado. Ganaste " + approved.puntos + " puntos.";
        status.className = "submission-status approved";
      }
      return;
    }

    if (pending) {
      button.disabled = true;
      button.textContent = "Pendiente de revisión";

      if (status) {
        status.textContent = "Tu evidencia fue enviada y está pendiente de revisión.";
        status.className = "submission-status pending";
      }
      return;
    }

    if (rejected) {
      if (status) {
        status.textContent = rejected.comentario_admin
          ? "Rechazado: " + rejected.comentario_admin
          : "Tu evidencia fue rechazada. Puedes volver a enviar otra.";
        status.className = "submission-status rejected";
      }
    }
  });
}

function renderMySubmissions() {
  if (!currentUser || mySubmissions.length === 0) {
    mySubmissionsList.innerHTML = `<p class="empty-text">Aún no enviaste evidencias.</p>`;
    return;
  }

  mySubmissionsList.innerHTML = "";

  mySubmissions.forEach(item => {
    const div = document.createElement("div");
    div.className = "submission-item";

    div.innerHTML = `
      <div>
        <h4>${item.missions?.titulo || item.mission_id}</h4>
        <p>Estado: <strong class="${item.estado}">${item.estado}</strong></p>
        <p>Puntos: ${item.puntos}</p>
        <p>Enviado: ${formatDate(item.created_at)}</p>
        ${item.comentario_admin ? `<p>Comentario: ${item.comentario_admin}</p>` : ""}
      </div>
      <a href="${item.foto_url}" target="_blank" class="view-photo-btn">Ver foto</a>
    `;

    mySubmissionsList.appendChild(div);
  });
}

async function refreshUserData() {
  if (!currentUser) {
    renderLoggedOutUI();
    return;
  }

  await loadProfile();
  await loadMySubmissions();

  renderLoggedInUI();
  renderMissionStatus();
  renderMySubmissions();

  setupDailyQuestion("consejo", "consejoQuestion", "consejoOptions", "consejoMessage", "consejoCooldown");
  setupDailyQuestion("entorno", "entornoQuestion", "entornoOptions", "entornoMessage", "entornoCooldown");

  if (currentProfile?.rol === "admin") {
    await loadAdminSubmissions();
  }
}

async function handleRegister() {
  const nombre = registerName.value.trim();
  const email = registerEmail.value.trim();
  const password = registerPassword.value.trim();

  if (!nombre || !email || !password) {
    setAuthMessage("Completa todos los campos para crear tu cuenta.", "error");
    return;
  }

  if (password.length < 6) {
    setAuthMessage("La contraseña debe tener como mínimo 6 caracteres.", "error");
    return;
  }

  registerBtn.disabled = true;
  registerBtn.textContent = "Creando cuenta...";

  const { data, error } = await db.auth.signUp({
    email,
    password,
    options: {
      data: {
        nombre
      }
    }
  });

  registerBtn.disabled = false;
  registerBtn.textContent = "Crear cuenta";

  if (error) {
    console.error(error);
    setAuthMessage(error.message, "error");
    return;
  }

  setAuthMessage("Cuenta creada correctamente. Ya puedes iniciar sesión.", "success");

  if (data.session) {
    currentUser = data.session.user;
    hideAuth();
    await refreshUserData();
  }
}

async function handleLogin() {
  const email = loginEmail.value.trim();
  const password = loginPassword.value.trim();

  if (!email || !password) {
    setAuthMessage("Ingresa tu correo y contraseña.", "error");
    return;
  }

  loginBtn.disabled = true;
  loginBtn.textContent = "Ingresando...";

  const { data, error } = await db.auth.signInWithPassword({
    email,
    password
  });

  loginBtn.disabled = false;
  loginBtn.textContent = "Ingresar";

  if (error) {
    console.error(error);
    setAuthMessage("Correo o contraseña incorrectos.", "error");
    return;
  }

  currentUser = data.user;
  hideAuth();
  showToast("Sesión iniciada correctamente.");
  await refreshUserData();
}

async function handleLogout() {
  await db.auth.signOut();
  renderLoggedOutUI();
  showToast("Sesión cerrada.");
}

photoInputs.forEach(input => {
  input.addEventListener("change", () => {
    const file = input.files[0];
    const previewId = input.dataset.preview;
    const preview = document.getElementById(previewId);

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Sube una imagen válida.");
      input.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("La imagen no debe superar los 5 MB.");
      input.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = event => {
      preview.src = event.target.result;
      preview.classList.add("show");
      showToast("Foto cargada correctamente.");
    };

    reader.readAsDataURL(file);
  });
});

evidenceButtons.forEach(button => {
  button.addEventListener("click", async () => {
    if (!requireLogin()) return;

    const missionId = button.dataset.id;
    const card = button.closest(".mission-card");
    const input = card.querySelector(".mission-photo");
    const file = input.files[0];

    if (!file) {
      showToast("Primero sube una foto de evidencia.");
      return;
    }

    button.disabled = true;
    button.textContent = "Enviando evidencia...";

    const cleanName = getCleanFileName(file.name);
    const path = `${currentUser.id}/${missionId}-${Date.now()}-${cleanName}`;

    const uploadResult = await db.storage
      .from("evidencias")
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false
      });

    if (uploadResult.error) {
      console.error(uploadResult.error);
      button.disabled = false;
      button.textContent = "Enviar para verificación";
      showToast("No se pudo subir la foto.");
      return;
    }

    const publicData = db.storage
      .from("evidencias")
      .getPublicUrl(path);

    const fotoUrl = publicData.data.publicUrl;

    const { error } = await db.rpc("enviar_evidencia", {
      p_mission_id: missionId,
      p_foto_path: path,
      p_foto_url: fotoUrl
    });

    if (error) {
      console.error(error);
      button.disabled = false;
      button.textContent = "Enviar para verificación";
      showToast(error.message || "No se pudo enviar la evidencia.");
      return;
    }

    input.value = "";
    const preview = card.querySelector(".photo-preview");
    if (preview) {
      preview.src = "";
      preview.classList.remove("show");
    }

    showToast("Evidencia enviada. Quedó pendiente de revisión.");
    await refreshUserData();
  });
});

async function getLastDailyAttempt(type) {
  if (!currentUser) return null;

  const { data, error } = await db
    .from("daily_question_attempts")
    .select("*")
    .eq("user_id", currentUser.id)
    .eq("tipo", type)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}

function getRemainingTime(availableAfter) {
  const remaining = new Date(availableAfter).getTime() - Date.now();

  if (remaining <= 0) return null;

  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours} h ${minutes} min`;
}

function getRandomQuestion(type, lastQuestionText) {
  const questions = dailyQuestions[type];

  if (questions.length === 1) return questions[0];

  let question = questions[Math.floor(Math.random() * questions.length)];

  while (question.question === lastQuestionText) {
    question = questions[Math.floor(Math.random() * questions.length)];
  }

  return question;
}

async function setupDailyQuestion(type, questionId, optionsId, messageId, cooldownId) {
  const questionElement = document.getElementById(questionId);
  const optionsElement = document.getElementById(optionsId);
  const messageElement = document.getElementById(messageId);
  const cooldownElement = document.getElementById(cooldownId);

  questionElement.textContent = "";
  optionsElement.innerHTML = "";
  messageElement.textContent = "";
  cooldownElement.textContent = "";

  if (!currentUser) {
    const previewQuestion = dailyQuestions[type][0];

    questionElement.textContent = previewQuestion.question;

    previewQuestion.options.forEach(optionText => {
      const button = document.createElement("button");
      button.className = "daily-option";
      button.textContent = optionText;

      button.addEventListener("click", () => {
        showToast("Debes iniciar sesión para responder.");
        showAuth();
      });

      optionsElement.appendChild(button);
    });

    cooldownElement.textContent = "Inicia sesión para responder y ganar puntos.";
    return;
  }

  const lastAttempt = await getLastDailyAttempt(type);

  if (lastAttempt) {
    const remaining = getRemainingTime(lastAttempt.disponible_despues);

    if (remaining) {
      questionElement.textContent = lastAttempt.pregunta;
      messageElement.textContent = lastAttempt.fue_correcta
        ? "Respuesta correcta. Ya ganaste puntos por esta pregunta."
        : "Respuesta incorrecta. Perdiste tu oportunidad.";

      cooldownElement.textContent = "Podrás responder otra pregunta en: " + remaining;
      return;
    }
  }

  const question = getRandomQuestion(type, lastAttempt?.pregunta);

  questionElement.textContent = question.question;
  cooldownElement.textContent = "Disponible ahora. Solo tienes una oportunidad.";

  question.options.forEach((optionText, index) => {
    const button = document.createElement("button");
    button.className = "daily-option";
    button.textContent = optionText;

    button.addEventListener("click", async () => {
      const isCorrect = index === question.correct;

      const allButtons = optionsElement.querySelectorAll(".daily-option");
      allButtons.forEach(btn => btn.disabled = true);

      if (isCorrect) {
        button.classList.add("correct");
      } else {
        button.classList.add("wrong");
      }

      const { error } = await db.rpc("registrar_pregunta_diaria", {
        p_tipo: type,
        p_pregunta: question.question,
        p_opcion_elegida: optionText,
        p_fue_correcta: isCorrect,
        p_puntos: question.points
      });

      if (error) {
        console.error(error);
        showToast(error.message || "No se pudo registrar la respuesta.");
        await refreshUserData();
        return;
      }

      if (isCorrect) {
        messageElement.textContent = "Respuesta correcta. Ganaste " + question.points + " puntos extra.";
        showToast("Ganaste " + question.points + " puntos extra.");
      } else {
        messageElement.textContent = "Respuesta incorrecta. Perdiste tu oportunidad.";
        showToast("Respuesta incorrecta. Vuelve mañana.");
      }

      cooldownElement.textContent = "Vuelve en 24 horas para una nueva pregunta.";
      await refreshUserData();
    });

    optionsElement.appendChild(button);
  });
}

async function loadAdminSubmissions() {
  if (!currentProfile || currentProfile.rol !== "admin") return;

  const { data, error } = await db
    .from("mission_submissions")
    .select(`
      id,
      user_id,
      mission_id,
      foto_url,
      estado,
      puntos,
      created_at,
      missions (
        titulo,
        puntos
      )
    `)
    .eq("estado", "pendiente")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    adminSubmissionsList.innerHTML = `<p class="empty-text">No se pudieron cargar evidencias pendientes.</p>`;
    return;
  }

  const submissions = data || [];

  if (submissions.length === 0) {
    adminSubmissionsList.innerHTML = `<p class="empty-text">No hay evidencias pendientes.</p>`;
    return;
  }

  const userIds = [...new Set(submissions.map(item => item.user_id))];

  const { data: profiles } = await db
    .from("profiles")
    .select("id, nombre, email")
    .in("id", userIds);

  const profileMap = {};
  (profiles || []).forEach(profile => {
    profileMap[profile.id] = profile;
  });

  adminSubmissionsList.innerHTML = "";

  submissions.forEach(item => {
    const profile = profileMap[item.user_id];

    const div = document.createElement("div");
    div.className = "admin-item";

    div.innerHTML = `
      <div class="admin-info">
        <h3>${item.missions?.titulo || item.mission_id}</h3>
        <p><strong>Usuario:</strong> ${profile?.nombre || "Sin nombre"}</p>
        <p><strong>Correo:</strong> ${profile?.email || "Sin correo"}</p>
        <p><strong>Fecha:</strong> ${formatDate(item.created_at)}</p>
        <p><strong>Puntos posibles:</strong> ${item.missions?.puntos || 0}</p>
      </div>

      <div class="admin-photo">
        <img src="${item.foto_url}" alt="Evidencia enviada">
        <a href="${item.foto_url}" target="_blank">Abrir foto</a>
      </div>

      <div class="admin-actions">
        <button class="approve-btn" data-id="${item.id}">Aprobar</button>
        <button class="reject-btn" data-id="${item.id}">Rechazar</button>
      </div>
    `;

    adminSubmissionsList.appendChild(div);
  });

  document.querySelectorAll(".approve-btn").forEach(button => {
    button.addEventListener("click", async () => {
      const id = button.dataset.id;

      button.disabled = true;
      button.textContent = "Aprobando...";

      const { error } = await db.rpc("aprobar_evidencia", {
        p_submission_id: id
      });

      if (error) {
        console.error(error);
        showToast(error.message || "No se pudo aprobar.");
        button.disabled = false;
        button.textContent = "Aprobar";
        return;
      }

      showToast("Evidencia aprobada y puntos sumados.");
      await loadAdminSubmissions();
    });
  });

  document.querySelectorAll(".reject-btn").forEach(button => {
    button.addEventListener("click", async () => {
      const id = button.dataset.id;
      const comentario = prompt("Motivo del rechazo:", "La evidencia no corresponde a la misión.");

      if (comentario === null) return;

      button.disabled = true;
      button.textContent = "Rechazando...";

      const { error } = await db.rpc("rechazar_evidencia", {
        p_submission_id: id,
        p_comentario: comentario
      });

      if (error) {
        console.error(error);
        showToast(error.message || "No se pudo rechazar.");
        button.disabled = false;
        button.textContent = "Rechazar";
        return;
      }

      showToast("Evidencia rechazada.");
      await loadAdminSubmissions();
    });
  });
}

commitmentBtn.addEventListener("click", () => {
  if (!requireLogin()) return;

  commitmentMessage.textContent = "Gracias por ser parte del cambio en Florencia de Mora.";
  showToast("Compromiso aceptado.");
});

openAuthBtn.addEventListener("click", showAuth);
closeAuthBtn.addEventListener("click", hideAuth);
logoutBtn.addEventListener("click", handleLogout);
loginBtn.addEventListener("click", handleLogin);
registerBtn.addEventListener("click", handleRegister);

showLoginBtn.addEventListener("click", () => {
  loginForm.classList.remove("hidden");
  registerForm.classList.add("hidden");
  showLoginBtn.classList.add("active");
  showRegisterBtn.classList.remove("active");
  setAuthMessage("");
});

showRegisterBtn.addEventListener("click", () => {
  registerForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
  showRegisterBtn.classList.add("active");
  showLoginBtn.classList.remove("active");
  setAuthMessage("");
});

refreshAdminBtn.addEventListener("click", loadAdminSubmissions);

async function initApp() {
  const { data } = await db.auth.getSession();

  if (data.session) {
    currentUser = data.session.user;
    await refreshUserData();
  } else {
    renderLoggedOutUI();
  }

  db.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      currentUser = session.user;
      await refreshUserData();
    } else {
      renderLoggedOutUI();
    }
  });
}

initApp();
