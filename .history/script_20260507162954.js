const introScreen = document.getElementById("introScreen");
const rainLayer = document.getElementById("rainLayer");
const countdownText = document.getElementById("countdownText");
const beginBtn = document.getElementById("beginBtn");
const loadingScreen = document.getElementById("loadingScreen");
const loadingFill = document.getElementById("loadingFill");
const loadingLabel = document.getElementById("loadingLabel");
const loadingTitle = document.getElementById("loadingTitle");
const gameSection = document.getElementById("gameSection");
const heartsContainer = document.getElementById("heartsContainer");
const arrowLayer = document.getElementById("arrowLayer");
const bookSection = document.getElementById("bookSection");
const book = document.getElementById("book");
const pages = document.querySelectorAll(".page");
const music = document.getElementById("bgMusic");
const closeBook = document.getElementById("closeBook");
const finalMessage = document.getElementById("finalMessage");
const scoreText = document.getElementById("score");

const GAME_TARGET = 10;
const HEART_SPAWN_MS = 1400;
const HEART_LIFETIME_MS = 9800;

let score = 0;
let gameIntervalId = null;
let gameFinished = false;
let journeyStarted = false;

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function createRain() {
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < 80; index += 1) {
    const drop = document.createElement("span");
    drop.className = "rain-drop";
    drop.style.left = `${Math.random() * 100}%`;
    drop.style.animationDuration = `${Math.random() * 0.8 + 0.8}s`;
    drop.style.animationDelay = `${Math.random() * -1.2}s`;
    drop.style.opacity = `${Math.random() * 0.35 + 0.2}`;
    fragment.appendChild(drop);
  }

  rainLayer.appendChild(fragment);
}

function startMusic() {
  music.volume = 0.55;
  music.play().catch(() => {
    beginBtn.classList.remove("hidden");
  });
}

async function runLoadingSequence(title, label, duration = 1800) {
  loadingTitle.textContent = title;
  loadingLabel.textContent = label;
  loadingFill.style.width = "0%";
  loadingScreen.classList.remove("hidden");

  const startedAt = Date.now();

  while (true) {
    const elapsed = Date.now() - startedAt;
    const progress = Math.min(100, Math.round((elapsed / duration) * 100));
    loadingFill.style.width = `${progress}%`;

    if (progress >= 100) {
      break;
    }

    await wait(18);
  }

  await wait(250);
  loadingScreen.classList.add("hidden");
}

function getArrowStartPoint() {
  return {
    x: window.innerWidth / 2 - 10,
    y: window.innerHeight - 108
  };
}

function stickArrowOnHeart(heart) {
  if (!heart.isConnected) {
    return;
  }

  const impact = document.createElement("span");
  impact.className = "heart__impact";

  const feather = document.createElement("span");
  feather.className = "heart__feather";
  impact.appendChild(feather);

  heart.appendChild(impact);
  heart.classList.add("is-hit");

  window.setTimeout(() => {
    heart.remove();
  }, 2100);
}

function launchArrow(targetHeart) {
  const start = getArrowStartPoint();
  const targetRect = targetHeart.getBoundingClientRect();
  const end = {
    x: targetRect.left + targetRect.width / 2,
    y: targetRect.top + targetRect.height / 2
  };

  const deltaX = end.x - start.x;
  const deltaY = end.y - start.y;
  const distance = Math.hypot(deltaX, deltaY);
  const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

  const arrow = document.createElement("div");
  arrow.className = "arrow-shot";
  arrow.style.left = `${start.x}px`;
  arrow.style.top = `${start.y}px`;
  arrow.style.width = `${distance}px`;
  arrow.style.transform = `rotate(${angle}deg) scaleX(0.18)`;
  arrow.style.opacity = "0";

  const arrowFeather = document.createElement("span");
  arrowFeather.className = "arrow-shot__feather";
  arrow.appendChild(arrowFeather);
  arrowLayer.appendChild(arrow);

  requestAnimationFrame(() => {
    arrow.style.transition = "transform 420ms cubic-bezier(0.2, 0.7, 0.22, 1), opacity 140ms ease";
    arrow.style.transform = `rotate(${angle}deg) scaleX(1)`;
    arrow.style.opacity = "1";
  });

  window.setTimeout(() => {
    arrow.style.transition = "opacity 180ms ease";
    arrow.style.opacity = "0";
    stickArrowOnHeart(targetHeart);
  }, 430);

  window.setTimeout(() => {
    arrow.remove();
  }, 640);
}

function updateScore() {
  scoreText.textContent = String(score);

  if (score >= GAME_TARGET && !gameFinished) {
    gameWin();
  }
}

function handleHeartHit(heart) {
  if (gameFinished || heart.dataset.hit === "true") {
    return;
  }

  heart.dataset.hit = "true";
  heart.disabled = true;
  score += 1;
  updateScore();
  launchArrow(heart);
}

function createHeart() {
  if (gameFinished) {
    return;
  }

  const heart = document.createElement("button");
  heart.type = "button";
  heart.className = "heart";
  heart.style.left = `${Math.random() * 82 + 6}vw`;
  heart.style.bottom = `${Math.random() * 14 - 12}vh`;
  heart.style.animationDuration = `${Math.random() * 2 + 6.4}s`;
  heart.style.setProperty("--heart-scale", `${Math.random() * 0.22 + 0.94}`);
  heart.setAttribute("aria-label", "Heart target");

  const heartLabel = document.createElement("span");
  heartLabel.className = "heart__label";
  heartLabel.textContent = "❤";
  heart.appendChild(heartLabel);

  heart.addEventListener("click", () => {
    handleHeartHit(heart);
  }, { once: true });

  heartsContainer.appendChild(heart);

  window.setTimeout(() => {
    if (heart.dataset.hit !== "true") {
      heart.remove();
    }
  }, HEART_LIFETIME_MS);
}

function startGame() {
  score = 0;
  gameFinished = false;
  heartsContainer.innerHTML = "";
  arrowLayer.innerHTML = "";
  updateScore();

  createHeart();
  gameIntervalId = window.setInterval(createHeart, HEART_SPAWN_MS);
}

async function gameWin() {
  gameFinished = true;

  if (gameIntervalId) {
    window.clearInterval(gameIntervalId);
    gameIntervalId = null;
  }

  heartsContainer.innerHTML = "";
  arrowLayer.innerHTML = "";
  gameSection.innerHTML = `
    <div class="game-section__bg"></div>
    <div class="game-success">
      <p class="game-panel__eyebrow">mission complete</p>
      <h2>Hatinya Sudah Kena</h2>
      <p>Panahnya sampai dengan lembut. Sekarang kita masuk ke halaman yang lebih cantik.</p>
    </div>
  `;

  await wait(1800);
  gameSection.classList.add("hidden");
  await runLoadingSequence("Opening The Last Chapter", "softly turning pages", 1700);
  bookSection.classList.remove("hidden");
}

function setupBookPages() {
  pages.forEach((page, index) => {
    page.style.zIndex = String(pages.length - index);

    page.addEventListener("click", () => {
      page.classList.toggle("flipped");

      if (page.classList.contains("flipped")) {
        page.style.zIndex = String(index);
      } else {
        page.style.zIndex = String(pages.length - index);
      }
    });
  });
}

async function startJourney() {
  if (journeyStarted) {
    return;
  }

  journeyStarted = true;
  introScreen.classList.add("hidden");
  startMusic();
  await runLoadingSequence("Loading Love Story", "after the rain", 1900);
  gameSection.classList.remove("hidden");
  startGame();
}

async function runCountdown() {
  const numbers = ["5", "4", "3", "2", "1"];

  for (const number of numbers) {
    countdownText.textContent = number;
    await wait(900);
  }

  countdownText.textContent = "go";
  await wait(700);
  beginBtn.classList.remove("hidden");
  startJourney();
}

closeBook.addEventListener("click", (event) => {
  event.stopPropagation();
  book.style.display = "none";
  finalMessage.classList.remove("hidden");
});

beginBtn.addEventListener("click", () => {
  startJourney();
});

window.addEventListener("pointerdown", startMusic, { once: true });

createRain();
setupBookPages();
runCountdown();
