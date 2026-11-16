const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");
const modal = document.querySelector("#poster-modal");
const frame = document.querySelector("#poster-frame");
const video = document.querySelector("video");
const pdf = "assets/images/poster.pdf#navpanes=0&view=Fit";
let lastTrigger = null;

function setNav(open) {
  nav.classList.toggle("is-open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.textContent = open ? "Cerrar" : "Menú";
  document.body.classList.toggle("nav-lock", open);
}

navToggle.addEventListener("click", () => {
  setNav(!nav.classList.contains("is-open"));
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setNav(false));
});

function openPoster(trigger) {
  lastTrigger = trigger || document.activeElement;
  if (!frame.getAttribute("src")) frame.src = pdf;
  if (video && !video.paused) video.pause();
  setNav(false);
  modal.hidden = false;
  document.body.classList.add("modal-lock");
  modal.querySelector(".modal-close").focus();
}

function closePoster() {
  modal.hidden = true;
  document.body.classList.remove("modal-lock");
  if (lastTrigger && typeof lastTrigger.focus === "function") lastTrigger.focus();
}

document.querySelectorAll("[data-open-poster]").forEach((button) => {
  button.addEventListener("click", () => openPoster(button));
});

modal.querySelector(".modal-close").addEventListener("click", closePoster);

modal.addEventListener("click", (event) => {
  if (event.target === modal) closePoster();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.hidden) closePoster();
  if (event.key === "Escape" && nav.classList.contains("is-open")) setNav(false);
});

const links = [...nav.querySelectorAll('a[href^="#"]')];
const sections = links
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-40% 0px -50% 0px", threshold: 0.01 }
);

sections.forEach((section) => observer.observe(section));

if (location.hash === "#cartel") openPoster(document.querySelector("[data-open-poster]"));

window.addEventListener("resize", () => {
  if (window.innerWidth > 980) setNav(false);
});
