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

const registerDni = document.getElementById("registerDni");
const searchDniBtn = document.getElementById("searchDniBtn");
const dniMessage = document.getElementById("dniMessage");
const registerName = document.getElementById("registerName");
const registerEmail = document.getElementById("registerEmail");
const registerPassword = document.getElementById("registerPassword");
const registerPasswordConfirm = document.getElementById("registerPasswordConfirm");
const registerBtn = document.getElementById("registerBtn");

const passwordToggleButtons = document.querySelectorAll(".toggle-password");

const userDashboard = document.getElementById("userDashboard");
const dashboardName = document.getElementById("dashboardName");
const dashboardPoints = document.getElementById("dashboardPoints");
const dashboardRole = document.getElementById("dashboardRole");
const dashboardRank = document.getElementById("dashboardRank");
const mySubmissionsList = document.getElementById("mySubmissionsList");

const photoInputs = document.querySelectorAll(".mission-photo");
const evidenceButtons = document.querySelectorAll(".submit-evidence-btn");

const adminPanel = document.getElementById("adminPanel");
const adminSubmissionsList = document.getElementById("adminSubmissionsList");
const refreshAdminBtn = document.getElementById("refreshAdminBtn");

const heroCarouselImage = document.getElementById("heroCarouselImage");
const carouselDots = document.querySelectorAll(".carousel-dot");
const podiumList = document.getElementById("podiumList");

let currentUser = null;
let currentProfile = null;
let mySubmissions = [];
let dniData = null;
let currentRanking = null;
let carouselIndex = 0;

const heroImages = [
  {
    src: "img/florencia-1.jpg",
    alt: "Pista deteriorada en Florencia de Mora"
  },
  {
    src: "img/florencia-2.jpg",
    alt: "Acumulación de residuos en Florencia de Mora"
  },
  {
    src: "img/florencia-3.jpg",
    alt: "Zona afectada por polvo y basura en Florencia de Mora"
  }
];

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

function setDniMessage(message, type = "") {
  dniMessage.textContent = message;
  dniMessage.className = "dni-message " + type;
}

function setupHeroCarousel() {
  if (!heroCarouselImage) return;

  function changeImage() {
    carouselIndex = (carouselIndex + 1) % heroImages.length;

    heroCarouselImage.style.opacity = "0";

    setTimeout(() => {
      heroCarouselImage.src = heroImages[carouselIndex].src;
      heroCarouselImage.alt = heroImages[carouselIndex].alt;

      carouselDots.forEach((dot, index) => {
        dot.classList.toggle("active", index === carouselIndex);
      });

      heroCarouselImage.style.opacity = "1";
    }, 250);
  }

  setInterval(changeImage, 3000);
}

function setupPasswordToggles() {
  passwordToggleButtons.forEach(button => {
    button.addEventListener("click", () => {
      const targetId = button.dataset.target;
      const input = document.getElementById(targetId);

      if (!input) return;

      if (input.type === "password") {
        input.type = "text";
        button.textContent = "Ocultar";
      } else {
        input.type = "password";
        button.textContent = "Ver";
      }
    });
  });
}

function setupDniInput() {
  registerDni.addEventListener("input", () => {
    registerDni.value = registerDni.value.replace(/\D/g, "").slice(0, 8);
    registerName.value = "";
    dniData = null;

    if (registerDni.value.length > 0 && registerDni.value.length < 8) {
      setDniMessage("El DNI debe tener 8 números.", "error");
    } else {
      setDniMessage("");
    }
  });
}

function setupEmailInput() {
  registerEmail.addEventListener("input", () => {
    setAuthMessage("");
  });
}

function getBadge(points) {
  if (points >= 300) return "Líder EcoFlorencia";
  if (points >= 200) return "Protector del Distrito";
  if (points >= 100) return "Protector de Florencia";
  if (points >= 60) return "Guardián Ambiental";
  if (points >= 30) return "Vecino Responsable";
  return "Visitante Verde";
}

function updateProgressUI(points) {
  scoreElement.textContent = points;
  badgeElement.textContent = getBadge(points);

  let percentage = 0;

  if (points > 0) {
    percentage = points % 100;

    if (percentage === 0) {
      percentage = 100;
    }
  }

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

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function validarDisponibilidadRegistro(dni = null, email = null) {
  const { data, error } = await db.rpc("validar_registro_disponible", {
    p_dni: dni,
    p_email: email
  });

  if (error) {
    console.error(error);
    return {
      success: false,
      message: "No se pudo validar si el DNI o correo ya existen."
    };
  }

  return data;
}

async function loadPodium() {
  if (!podiumList) return;

  const { data, error } = await db.rpc("obtener_podio");

  if (error) {
    console.error("Error cargando podio:", error);
    podiumList.innerHTML = `
      <p class="empty-text">No se pudo cargar el podio.</p>
    `;
    return;
  }

  renderPodium(data || []);
}

function renderPodium(podium) {
  if (!podiumList) return;

  const first = podium.find(item => item.posicion === 1);
  const second = podium.find(item => item.posicion === 2);
  const third = podium.find(item => item.posicion === 3);

  podiumList.innerHTML = `
    ${renderPodiumCard(second, "second-place", "2")}
    ${renderPodiumCard(first, "first-place", "1")}
    ${renderPodiumCard(third, "third-place", "3")}
  `;
}

function renderPodiumCard(user, className, position) {
  const nombre = user?.nombre || "Sin participante";
  const puntos = user?.puntos || 0;

  return `
    <article class="podium-card ${className}">
      <div class="podium-position">${position}</div>
      <h3>${nombre}</h3>
      <p>${puntos} puntos</p>
    </article>
  `;
}

async function loadMyRanking() {
  if (!currentUser) {
    currentRanking = null;
    return null;
  }

  const { data, error } = await db.rpc("obtener_mi_ranking");

  if (error) {
    console.error(error);
    currentRanking = null;
    return null;
  }

  currentRanking = data && data.length > 0 ? data[0] : null;
  return currentRanking;
}

async function searchDni() {
  const dni = registerDni.value.trim();

  registerName.value = "";
  dniData = null;
  setAuthMessage("");

  if (!/^[0-9]{8}$/.test(dni)) {
    setDniMessage("Ingresa un DNI válido de 8 números.", "error");
    return;
  }

  searchDniBtn.disabled = true;
  searchDniBtn.textContent = "Validando...";
  setDniMessage("Verificando si el DNI ya está registrado...", "loading");

  const disponibilidad = await validarDisponibilidadRegistro(dni, null);

  if (!disponibilidad || disponibilidad.success === false) {
    searchDniBtn.disabled = false;
    searchDniBtn.textContent = "Buscar DNI";
    setDniMessage(disponibilidad?.message || "No se pudo validar el DNI.", "error");
    return;
  }

  if (disponibilidad.dni_existe) {
    searchDniBtn.disabled = false;
    searchDniBtn.textContent = "Buscar DNI";
    setDniMessage("Este DNI ya está registrado. Usa otro DNI o inicia sesión.", "error");
    return;
  }

  searchDniBtn.textContent = "Buscando...";
  setDniMessage("Consultando datos del DNI...", "loading");

  const { data, error } = await db.functions.invoke("consultar-dni", {
    body: {
      dni: dni
    }
  });

  searchDniBtn.disabled = false;
  searchDniBtn.textContent = "Buscar DNI";

  if (error) {
    console.error(error);
    setDniMessage("No se pudo consultar el DNI. Intenta nuevamente.", "error");
    return;
  }

  if (!data || !data.success || !data.data) {
    setDniMessage(data?.message || "No se encontraron datos para este DNI.", "error");
    return;
  }

  dniData = data.data;
  registerName.value = dniData.nombre_completo || "";

  if (!registerName.value) {
    dniData = null;
    setDniMessage("El DNI fue encontrado, pero no devolvió un nombre válido.", "error");
    return;
  }

  setDniMessage("DNI encontrado correctamente.", "success");
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
  currentRanking = null;
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

  if (dashboardRank) {
    if (currentRanking) {
      dashboardRank.textContent = "#" + currentRanking.posicion + " de " + currentRanking.total_participantes;
    } else {
      dashboardRank.textContent = currentProfile.rol === "admin" ? "Admin" : "Sin ranking";
    }
  }

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
    await loadPodium();
    return;
  }

  await loadProfile();
  await loadMySubmissions();
  await loadMyRanking();
  await loadPodium();

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
  const dni = registerDni.value.trim();
  const nombre = registerName.value.trim();
  const email = registerEmail.value.trim().toLowerCase();
  const password = registerPassword.value.trim();
  const confirmPassword = registerPasswordConfirm.value.trim();

  if (!dni || !nombre || !email || !password || !confirmPassword) {
    setAuthMessage("Completa todos los campos para crear tu cuenta.", "error");
    return;
  }

  if (!/^[0-9]{8}$/.test(dni)) {
    setAuthMessage("El DNI debe tener exactamente 8 números.", "error");
    return;
  }

  if (!dniData || dniData.dni !== dni) {
    setAuthMessage("Primero debes buscar y validar tu DNI.", "error");
    return;
  }

  if (!isValidEmail(email)) {
    setAuthMessage("Ingresa un correo válido.", "error");
    return;
  }

  if (password.length < 6) {
    setAuthMessage("La contraseña debe tener como mínimo 6 caracteres.", "error");
    return;
  }

  if (password !== confirmPassword) {
    setAuthMessage("Las contraseñas no coinciden. Vuelve a revisar los campos.", "error");
    return;
  }

  registerBtn.disabled = true;
  registerBtn.textContent = "Validando datos...";

  const disponibilidad = await validarDisponibilidadRegistro(dni, email);

  if (!disponibilidad || disponibilidad.success === false) {
    registerBtn.disabled = false;
    registerBtn.textContent = "Crear cuenta";
    setAuthMessage(disponibilidad?.message || "No se pudo validar el registro.", "error");
    return;
  }

  if (disponibilidad.dni_existe) {
    registerBtn.disabled = false;
    registerBtn.textContent = "Crear cuenta";
    setAuthMessage("Este DNI ya está registrado. No se puede crear otra cuenta con el mismo DNI.", "error");
    return;
  }

  if (disponibilidad.email_existe) {
    registerBtn.disabled = false;
    registerBtn.textContent = "Crear cuenta";
    setAuthMessage("Este correo ya está registrado. Usa otro correo o inicia sesión.", "error");
    return;
  }

  registerBtn.textContent = "Creando cuenta...";

  const { data, error } = await db.auth.signUp({
    email,
    password,
    options: {
      data: {
        dni: dniData.dni || dni,
        nombre: dniData.nombre_completo || nombre,
        nombre_completo: dniData.nombre_completo || nombre,
        direccion: dniData.direccion || "NO DISPONIBLE",
        departamento: dniData.departamento || "NO DISPONIBLE",
        provincia: dniData.provincia || "NO DISPONIBLE",
        distrito: dniData.distrito || "NO DISPONIBLE"
      }
    }
  });

  registerBtn.disabled = false;
  registerBtn.textContent = "Crear cuenta";

  if (error) {
    console.error(error);

    if (error.message && error.message.toLowerCase().includes("already registered")) {
      setAuthMessage("Este correo ya está registrado. Usa otro correo o inicia sesión.", "error");
    } else if (error.message && error.message.toLowerCase().includes("database")) {
      setAuthMessage("No se pudo crear la cuenta. Es posible que el DNI o correo ya estén registrados.", "error");
    } else {
      setAuthMessage(error.message, "error");
    }

    return;
  }

  setAuthMessage("Cuenta creada correctamente. Ya puedes iniciar sesión.", "success");

  registerDni.value = "";
  registerName.value = "";
  registerEmail.value = "";
  registerPassword.value = "";
  registerPasswordConfirm.value = "";
  dniData = null;

  setDniMessage("");

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
  await loadPodium();
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
    .select("id, nombre, email, direccion, departamento, provincia, distrito")
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
        <p><strong>Dirección:</strong> ${profile?.direccion || "No disponible"}</p>
        <p><strong>Ubicación:</strong> ${profile?.departamento || "-"} / ${profile?.provincia || "-"} / ${profile?.distrito || "-"}</p>
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
      await loadPodium();
      await refreshUserData();
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

openAuthBtn.addEventListener("click", showAuth);
closeAuthBtn.addEventListener("click", hideAuth);
logoutBtn.addEventListener("click", handleLogout);
loginBtn.addEventListener("click", handleLogin);
registerBtn.addEventListener("click", handleRegister);
searchDniBtn.addEventListener("click", searchDni);
refreshAdminBtn.addEventListener("click", loadAdminSubmissions);

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

async function initApp() {
  setupHeroCarousel();
  setupPasswordToggles();
  setupDniInput();
  setupEmailInput();

  await loadPodium();

  const { data } = await db.auth.getSession();

  if (data.session) {
    currentUser = data.session.user;
    await refreshUserData();
  } else {
    renderLoggedOutUI();
    await loadPodium();
  }

  db.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      currentUser = session.user;
      await refreshUserData();
    } else {
      renderLoggedOutUI();
      await loadPodium();
    }
  });
}

initApp();
