// Elementos del DOM
const scoreElement = document.getElementById("score");
const badgeElement = document.getElementById("badge");
const progressFill = document.getElementById("progressFill");
const missionButtons = document.querySelectorAll(".mission-btn");
const commitmentBtn = document.getElementById("commitmentBtn");
const commitmentMessage = document.getElementById("commitmentMessage");
const toast = document.getElementById("toast");
const photoInputs = document.querySelectorAll(".mission-photo");

// Variables
let score = Number(localStorage.getItem("eco_score")) || 0;
let completedMissions = JSON.parse(localStorage.getItem("eco_completed_missions")) || [];

// Preguntas diarias basadas en el proyecto
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

// Función para guardar progreso
function saveProgress() {
  localStorage.setItem("eco_score", score);
  localStorage.setItem("eco_completed_missions", JSON.stringify(completedMissions));
}

// Función para obtener el badge según puntos
function getBadge() {
  if (score >= 100) return "Protector de Florencia";
  if (score >= 60) return "Guardián Ambiental";
  if (score >= 30) return "Vecino Responsable";
  return "Visitante Verde";
}

// Función para actualizar progreso y UI
function updateProgress() {
  scoreElement.textContent = score;
  badgeElement.textContent = getBadge();

  let percentage = (score / 100) * 100;
  if (percentage > 100) percentage = 100;
  progressFill.style.width = percentage + "%";

  missionButtons.forEach(button => {
    const missionId = button.dataset.id;

    if (completedMissions.includes(missionId)) {
      button.textContent = "Misión completada";
      button.classList.add("completed");
      button.disabled = true;
    }
  });

  if (completedMissions.includes("compromiso-ambiental")) {
    commitmentBtn.disabled = true;
    commitmentBtn.textContent = "Compromiso aceptado";
    commitmentMessage.textContent = "Gracias por ser parte del cambio en Florencia de Mora.";
  }
}

// Función para completar una misión normal
function completeMission(missionId, points) {
  if (completedMissions.includes(missionId)) {
    showToast("Esta misión ya fue completada.");
    return;
  }

  completedMissions.push(missionId);
  score += points;
  saveProgress();
  updateProgress();
  showToast("Misión completada. Ganaste " + points + " puntos.");
}

// Función para mostrar toast
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

// Subida de fotos con vista previa
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

    const reader = new FileReader();

    reader.onload = function(event) {
      preview.src = event.target.result;
      preview.classList.add("show");
      showToast("Foto cargada correctamente.");
    };

    reader.readAsDataURL(file);
  });
});

// Validación de subir foto antes de completar misión normal
missionButtons.forEach(button => {
  button.addEventListener("click", () => {
    const missionId = button.dataset.id;
    const points = Number(button.dataset.points);
    const card = button.closest(".mission-card");
    const photoInput = card.querySelector(".mission-photo");

    if (photoInput && photoInput.files.length === 0) {
      showToast("Primero sube una foto de evidencia.");
      return;
    }

    completeMission(missionId, points);
  });
});

// Función para calcular tiempo restante
function getRemainingTime(lastAnsweredAt) {
  const now = Date.now();
  const waitTime = 24 * 60 * 60 * 1000;
  const elapsed = now - lastAnsweredAt;
  const remaining = waitTime - elapsed;

  if (remaining <= 0) return null;

  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours} h ${minutes} min`;
}

// Función para elegir una pregunta diferente a la anterior
function getQuestionIndex(type, lastIndex) {
  const questions = dailyQuestions[type];

  if (questions.length === 1) return 0;

  let newIndex = Math.floor(Math.random() * questions.length);

  while (newIndex === lastIndex) {
    newIndex = Math.floor(Math.random() * questions.length);
  }

  return newIndex;
}

// Función para bloquear opciones después de responder
function blockDailyOptions(optionsElement) {
  const allButtons = optionsElement.querySelectorAll(".daily-option");
  allButtons.forEach(btn => btn.disabled = true);
}

// Configuración de pregunta diaria
function setupDailyQuestion(type, questionId, optionsId, messageId, cooldownId) {
  const questionElement = document.getElementById(questionId);
  const optionsElement = document.getElementById(optionsId);
  const messageElement = document.getElementById(messageId);
  const cooldownElement = document.getElementById(cooldownId);

  const storageKey = `eco_daily_${type}`;

  const savedData = JSON.parse(localStorage.getItem(storageKey)) || {
    lastAnsweredAt: 0,
    lastQuestionIndex: -1,
    lastWasCorrect: null
  };

  const remainingTime = getRemainingTime(savedData.lastAnsweredAt);

  if (remainingTime) {
    const question = dailyQuestions[type][savedData.lastQuestionIndex];

    questionElement.textContent = question.question;
    optionsElement.innerHTML = "";

    question.options.forEach((optionText, index) => {
      const button = document.createElement("button");
      button.className = "daily-option";
      button.textContent = optionText;
      button.disabled = true;

      if (savedData.selectedOption === index) {
        if (savedData.lastWasCorrect) {
          button.classList.add("correct");
        } else {
          button.classList.add("wrong");
        }
      }

      optionsElement.appendChild(button);
    });

    if (savedData.lastWasCorrect) {
      messageElement.textContent = "Respuesta correcta. Ya ganaste puntos por esta pregunta.";
    } else {
      messageElement.textContent = "Respuesta incorrecta. Perdiste esta oportunidad.";
    }

    cooldownElement.textContent = "Podrás responder otra pregunta en: " + remainingTime;
    return;
  }

  const questionIndex = getQuestionIndex(type, savedData.lastQuestionIndex);
  const question = dailyQuestions[type][questionIndex];

  questionElement.textContent = question.question;
  optionsElement.innerHTML = "";
  messageElement.textContent = "";
  cooldownElement.textContent = "Disponible ahora. Solo tienes una oportunidad.";

  question.options.forEach((optionText, index) => {
    const button = document.createElement("button");
    button.className = "daily-option";
    button.textContent = optionText;

    button.addEventListener("click", () => {
      const isCorrect = index === question.correct;

      const newData = {
        lastAnsweredAt: Date.now(),
        lastQuestionIndex: questionIndex,
        lastWasCorrect: isCorrect,
        selectedOption: index
      };

      localStorage.setItem(storageKey, JSON.stringify(newData));

      if (isCorrect) {
        button.classList.add("correct");
        score += question.points;
        saveProgress();
        updateProgress();

        messageElement.textContent = "Respuesta correcta. Ganaste " + question.points + " puntos extra.";
        showToast("Ganaste " + question.points + " puntos extra.");
      } else {
        button.classList.add("wrong");
        messageElement.textContent = "Respuesta incorrecta. Perdiste tu oportunidad.";
        showToast("Respuesta incorrecta. Vuelve a intentarlo mañana.");
      }

      cooldownElement.textContent = "Vuelve en 24 horas para una nueva pregunta.";
      blockDailyOptions(optionsElement);
    });

    optionsElement.appendChild(button);
  });
}

// Inicializar preguntas diarias
setupDailyQuestion(
  "consejo",
  "consejoQuestion",
  "consejoOptions",
  "consejoMessage",
  "consejoCooldown"
);

setupDailyQuestion(
  "entorno",
  "entornoQuestion",
  "entornoOptions",
  "entornoMessage",
  "entornoCooldown"
);

// Compromiso ambiental
commitmentBtn.addEventListener("click", () => {
  completeMission("compromiso-ambiental", 15);
  commitmentMessage.textContent = "Gracias por ser parte del cambio en Florencia de Mora.";
});

// Inicializar
updateProgress();
