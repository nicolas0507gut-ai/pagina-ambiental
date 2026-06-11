const scoreElement = document.getElementById("score");
const badgeElement = document.getElementById("badge");
const progressFill = document.getElementById("progressFill");
const missionButtons = document.querySelectorAll(".mission-btn");
const quizOptions = document.querySelectorAll(".quiz-option");
const quizMessage = document.getElementById("quizMessage");
const commitmentBtn = document.getElementById("commitmentBtn");
const commitmentMessage = document.getElementById("commitmentMessage");
const resetBtn = document.getElementById("resetBtn");
const toast = document.getElementById("toast");

let score = Number(localStorage.getItem("eco_score")) || 0;
let completedMissions = JSON.parse(localStorage.getItem("eco_completed_missions")) || [];

function saveProgress() {
  localStorage.setItem("eco_score", score);
  localStorage.setItem("eco_completed_missions", JSON.stringify(completedMissions));
}

function getBadge() {
  if (score >= 100) {
    return "Protector de Florencia";
  }

  if (score >= 60) {
    return "Guardián Ambiental";
  }

  if (score >= 30) {
    return "Vecino Responsable";
  }

  return "Visitante Verde";
}

function updateProgress() {
  scoreElement.textContent = score;
  badgeElement.textContent = getBadge();

  let percentage = (score / 120) * 100;

  if (percentage > 100) {
    percentage = 100;
  }

  progressFill.style.width = percentage + "%";

  missionButtons.forEach(button => {
    const missionId = button.dataset.id;

    if (completedMissions.includes(missionId)) {
      button.textContent = "Misión completada";
      button.classList.add("completed");
      button.disabled = true;
    }
  });

  if (completedMissions.includes("trivia-ambiental")) {
    quizOptions.forEach(option => {
      option.disabled = true;

      if (option.dataset.correct === "true") {
        option.classList.add("correct");
      }
    });

    quizMessage.textContent = "Trivia completada. Ganaste 20 puntos.";
  }

  if (completedMissions.includes("compromiso-ambiental")) {
    commitmentBtn.disabled = true;
    commitmentBtn.textContent = "Compromiso aceptado";
    commitmentMessage.textContent = "Gracias por ser parte del cambio en Florencia de Mora.";
  }
}

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

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

missionButtons.forEach(button => {
  button.addEventListener("click", () => {
    const missionId = button.dataset.id;
    const points = Number(button.dataset.points);

    completeMission(missionId, points);
  });
});

quizOptions.forEach(option => {
  option.addEventListener("click", () => {
    if (completedMissions.includes("trivia-ambiental")) {
      return;
    }

    const isCorrect = option.dataset.correct === "true";

    if (isCorrect) {
      option.classList.add("correct");
      quizMessage.textContent = "Respuesta correcta. Ganaste 20 puntos.";
      completeMission("trivia-ambiental", 20);

      quizOptions.forEach(btn => {
        btn.disabled = true;
      });
    } else {
      option.classList.add("wrong");
      quizMessage.textContent = "Respuesta incorrecta. Intenta con otra opción.";
      showToast("Aún puedes intentarlo otra vez.");
    }
  });
});

commitmentBtn.addEventListener("click", () => {
  completeMission("compromiso-ambiental", 15);
  commitmentMessage.textContent = "Gracias por ser parte del cambio en Florencia de Mora.";
});

resetBtn.addEventListener("click", () => {
  const confirmReset = confirm("¿Seguro que quieres reiniciar tu progreso?");

  if (confirmReset) {
    localStorage.removeItem("eco_score");
    localStorage.removeItem("eco_completed_missions");
    location.reload();
  }
});

updateProgress();
