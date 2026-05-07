const introScreen = document.getElementById("introScreen");
const rainLayer = document.getElementById("rainLayer");
const countdownText = document.getElementById("countdownText");
const beginBtn = document.getElementById("beginBtn");
const loadingScreen = document.getElementById("loadingScreen");
const loadingFill = document.getElementById("loadingFill");
const loadingLabel = document.getElementById("loadingLabel");
const loadingTitle = document.getElementById("loadingTitle");
const montageSection = document.getElementById("montageSection");
const montageTrack = document.getElementById("montageTrack");
const montageRain = document.getElementById("montageRain");
const gameSection = document.getElementById("gameSection");
const heartsContainer = document.getElementById("heartsContainer");
const arrowLayer = document.getElementById("arrowLayer");
const memorySection = document.getElementById("bookSection");
const memoryNodes = document.querySelectorAll(".memory-node");
const memoryCount = document.getElementById("memoryCount");
const memoryCard = document.getElementById("memoryCard");
const memoryParticles = document.getElementById("memoryParticles");
const memoryBadge = document.getElementById("memoryBadge");
const memoryImage = document.getElementById("memoryImage");
const memoryTitle = document.getElementById("memoryTitle");
const memorySubtitle = document.getElementById("memorySubtitle");
const memoryText = document.getElementById("memoryText");
const memorySpeaker = document.getElementById("memorySpeaker");
const memoryChapter = document.getElementById("memoryChapter");
const memoryMood = document.getElementById("memoryMood");
const memoryTag = document.getElementById("memoryTag");
const music = document.getElementById("bgMusic");
const closeBook = document.getElementById("closeBook");
const finalMessage = document.getElementById("finalMessage");
const scoreText = document.getElementById("score");

const GAME_TARGET = 10;
const HEART_SPAWN_MS = 1400;
const HEART_LIFETIME_MS = 9800;
const MONTAGE_DURATION_MS = 5200;

let score = 0;
let gameIntervalId = null;
let gameFinished = false;
let journeyStarted = false;
let typingTimer = null;
let openedMemories = new Set();

const montageMedia = [
  ...Array.from({ length: 57 }, (_, index) => `assets/images/memory-photo-${String(index + 1).padStart(2, "0")}.jpeg`),
  ...Array.from({ length: 6 }, (_, index) => `assets/images/memory-video-${String(index + 1).padStart(2, "0")}.mp4`)
];

const memories = [
  {
    badge: "memory 01",
    image: "assets/images/memory-photo-01.jpeg",
    title: "Kalau Hari Itu Diulang",
    subtitle: "soft sky, quiet heart",
    text: "Kamu bikin hari biasa terasa lebih indah.",
    speaker: "Narrator",
    chapter: "Episode 01",
    mood: "dreamy",
    tag: "first glow"
  },
  {
    badge: "memory 02",
    image: "assets/images/memory-photo-08.jpeg",
    title: "Senyum Yang Datang Pelan",
    subtitle: "warm light, shy eyes",
    text: "Senyum kamu datang pelan, tapi tinggal lama.",
    speaker: "Heart Note",
    chapter: "Episode 02",
    mood: "gentle",
    tag: "soft smile"
  },
  {
    badge: "memory 03",
    image: "assets/images/memory-photo-16.jpeg",
    title: "Obrolan Yang Tidak Berat",
    subtitle: "rain song, little spark",
    text: "Obrolan sederhana itu ternyata jadi kenangan manis.",
    speaker: "Moon Diary",
    chapter: "Episode 03",
    mood: "warm",
    tag: "little talk"
  },
  {
    badge: "memory 04",
    image: "assets/images/memory-photo-24.jpeg",
    title: "Tatapan Yang Lama Tinggal",
    subtitle: "moon dust, anime night",
    text: "Ada tatapan singkat yang susah pergi dari kepala.",
    speaker: "Night Scene",
    chapter: "Episode 04",
    mood: "cinematic",
    tag: "moon scene"
  },
  {
    badge: "memory 05",
    image: "assets/images/memory-photo-33.jpeg",
    title: "Versi Dunia Yang Lebih Lembut",
    subtitle: "petals, soft steps",
    text: "Sejak ada kamu, dunia terasa lebih lembut.",
    speaker: "Dream Route",
    chapter: "Episode 05",
    mood: "tender",
    tag: "warm world"
  },
  {
    badge: "memory 06",
    image: "assets/images/memory-photo-41.jpeg",
    title: "Kenangan Yang Tidak Ingin Hilang",
    subtitle: "last glow, forever note",
    text: "Kalau jadi kenangan, semoga ini tetap jadi yang paling cantik.",
    speaker: "Final Note",
    chapter: "Episode 06",
    mood: "forever",
    tag: "last note"
  }
];

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

function createMontageRain() {
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < 55; index += 1) {
    const drop = document.createElement("span");
    drop.className = "montage-rain-drop";
    drop.style.left = `${Math.random() * 100}%`;
    drop.style.animationDuration = `${Math.random() * 0.9 + 0.9}s`;
    drop.style.animationDelay = `${Math.random() * -1.4}s`;
    drop.style.opacity = `${Math.random() * 0.22 + 0.15}`;
    fragment.appendChild(drop);
  }

  montageRain.appendChild(fragment);
}

function createMontageMediaElement(mediaPath, index) {
  if (mediaPath.endsWith(".mp4")) {
    const video = document.createElement("video");
    video.src = mediaPath;
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    return video;
  }

  const image = document.createElement("img");
  image.src = mediaPath;
  image.alt = `Montage media ${index + 1}`;
  return image;
}

function buildMontageScene() {
  montageMedia.forEach((mediaPath, index) => {
    const card = document.createElement("figure");
    card.className = "montage-card";
    card.appendChild(createMontageMediaElement(mediaPath, index));
    montageTrack.appendChild(card);
  });

  positionMontageCards();
}

function positionMontageCards() {
  const cards = montageTrack.querySelectorAll(".montage-card");
  const total = cards.length;
  const radius = window.innerWidth <= 768 ? 150 : 280;

  cards.forEach((card, index) => {
    const phi = Math.acos(-1 + (2 * index) / total);
    const theta = Math.sqrt(total * Math.PI) * phi;
    const x = radius * Math.cos(theta) * Math.sin(phi);
    const y = radius * Math.sin(theta) * Math.sin(phi);
    const z = radius * Math.cos(phi);

    card.style.left = "50%";
    card.style.top = "50%";
    card.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px)`;
  });
}

function startMusic() {
  music.volume = 0.55;
  music.currentTime = music.currentTime || 0;
  music.play().catch(() => {
    beginBtn.classList.remove("hidden");
  });
}

function typeText(element, text) {
  if (!element) {
    return;
  }

  const fullText = text || element.dataset.text || element.textContent.trim();
  window.clearInterval(typingTimer);
  element.textContent = "";

  let index = 0;
  typingTimer = window.setInterval(() => {
    element.textContent += fullText.charAt(index);
    index += 1;

    if (index >= fullText.length) {
      window.clearInterval(typingTimer);
    }
  }, 18);
}

function burstMemoryParticles() {
  const rect = memoryCard.getBoundingClientRect();

  for (let index = 0; index < 12; index += 1) {
    const particle = document.createElement("span");
    particle.className = "memory-particle";
    particle.style.left = `${rect.left + rect.width / 2}px`;
    particle.style.top = `${rect.top + rect.height / 3}px`;
    particle.style.setProperty("--move-x", `${Math.random() * 180 - 90}px`);
    particle.style.setProperty("--move-y", `${Math.random() * -130 - 40}px`);
    memoryParticles.appendChild(particle);

    window.setTimeout(() => {
      particle.remove();
    }, 1300);
  }
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
  gameSection.classList.add("hidden");
  montageSection.classList.remove("hidden");
  await wait(MONTAGE_DURATION_MS);
  montageSection.classList.add("hidden");
  await runLoadingSequence("Membuka Kenangan Terindah", "anime memories and soft light", 1900);
  memorySection.classList.remove("hidden");
  revealMemory(0);
}

function updateMemoryProgress() {
  memoryCount.textContent = String(openedMemories.size);

  if (openedMemories.size === memories.length) {
    closeBook.classList.remove("hidden");
  }
}

function revealMemory(index) {
  const memory = memories[index];

  if (!memory) {
    return;
  }

  openedMemories.add(index);
  updateMemoryProgress();

  memoryBadge.textContent = memory.badge;
  memoryImage.src = memory.image;
  memoryTitle.textContent = memory.title;
  memorySubtitle.textContent = memory.subtitle;
  memorySpeaker.textContent = memory.speaker;
  memoryChapter.textContent = memory.chapter;
  memoryMood.textContent = memory.mood;
  memoryTag.textContent = memory.tag;
  memoryText.textContent = "";
  typeText(memoryText, memory.text);

  memoryCard.classList.remove("is-revealing");
  void memoryCard.offsetWidth;
  memoryCard.classList.add("is-revealing");
  burstMemoryParticles();

  memoryNodes.forEach((node) => {
    const isCurrent = Number(node.dataset.memory) === index;
    node.classList.toggle("is-open", openedMemories.has(Number(node.dataset.memory)));
    node.classList.toggle("is-active", isCurrent);
  });
}

function setupMemoryScene() {
  memoryNodes.forEach((node) => {
    node.addEventListener("click", () => {
      revealMemory(Number(node.dataset.memory));
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
  startMusic();
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
  memorySection.querySelector(".memory-layout").style.display = "none";
  finalMessage.classList.remove("hidden");
});

beginBtn.addEventListener("click", () => {
  startJourney();
});

window.addEventListener("pointerdown", startMusic, { once: true });
window.addEventListener("resize", positionMontageCards);

createRain();
createMontageRain();
buildMontageScene();
setupMemoryScene();
runCountdown();


const dreamWorld = document.getElementById("dreamWorld");

let playerX = 180;
let playerY = 280;

const speed = 12;
const keys = {};

document.addEventListener("keydown", (e) => {
  keys[e.key.toLowerCase()] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.key.toLowerCase()] = false;
});

function movePlayer() {
  if (!dreamWorld) {
    return;
  }

  if (keys["w"]) playerY -= speed;
  if (keys["s"]) playerY += speed;
  if (keys["a"]) playerX -= speed;
  if (keys["d"]) playerX += speed;

  const bounds = dreamWorld.getBoundingClientRect();
  const size = player.offsetWidth || 58;
  const maxX = Math.max(0, bounds.width - size);
  const maxY = Math.max(0, bounds.height - size);

  playerX = Math.max(0, Math.min(playerX, maxX));
  playerY = Math.max(0, Math.min(playerY, maxY));

  player.style.left = `${playerX}px`;
  player.style.top = `${playerY}px`;

  requestAnimationFrame(movePlayer);
}

movePlayer();

const orbs = document.querySelectorAll(".memory-orb");

orbs.forEach((orb) => {
  orb.addEventListener("click", () => {
    const memoryIndex = Number(orb.dataset.memory);
    orb.classList.add("opened");
    orb.style.opacity = "0.24";
    orb.style.transform = "scale(1.22)";
    revealMemory(memoryIndex);
  });
});

function checkCollision() {
  const playerRect = player.getBoundingClientRect();

  orbs.forEach((orb) => {
    const orbRect = orb.getBoundingClientRect();

    const hit =
      playerRect.left < orbRect.right &&
      playerRect.right > orbRect.left &&
      playerRect.top < orbRect.bottom &&
      playerRect.bottom > orbRect.top;

    if (hit && !orb.classList.contains("opened")) {
      orb.classList.add("opened");

      const memoryIndex = Number(orb.dataset.memory);

      revealMemory(memoryIndex);

      orb.style.opacity = "0.2";
      orb.style.transform = "scale(1.5)";
    }
  });

  requestAnimationFrame(checkCollision);
}

checkCollision();

  const fruits = document.querySelectorAll(".memory-fruit");

  fruits.forEach((fruit) => {
    fruit.addEventListener("click", () => {
      const memoryIndex = Number(fruit.dataset.memory);

      revealMemory(memoryIndex);

      fruit.style.opacity = "0.5";
      fruit.style.transform = "scale(1.2)";
    });
  });