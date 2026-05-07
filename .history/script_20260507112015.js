const openBtn = document.getElementById("openBtn");
const welcome = document.getElementById("welcome");
const bookSection = document.getElementById("bookSection");
const pages = document.querySelectorAll(".page");
const music = document.getElementById("bgMusic");
const closeBook = document.getElementById("closeBook");
const finalMessage = document.getElementById("finalMessage");

openBtn.addEventListener("click", () => {

  welcome.classList.add("hidden");
  bookSection.classList.remove("hidden");

  // Play music
  music.play();

});

pages.forEach((page, index) => {

  page.style.zIndex = pages.length - index;

  page.addEventListener("click", () => {

    page.classList.toggle("flipped");

  });

});

closeBook.addEventListener("click", () => {

  document.querySelector(".book").style.display = "none";

  finalMessage.classList.remove("hidden");

});