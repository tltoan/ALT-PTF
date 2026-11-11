const strip = document.querySelector(".filmstrip");
const studies = [...strip.querySelectorAll(".study")];
const title = document.querySelector(".caption-title");
const edition = document.querySelector(".caption-edition");
const controls = [...document.querySelectorAll(".gallery-controls button")];
const featured = studies.findIndex((study) => study.getAttribute("aria-pressed") === "true");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let selected = featured;
let frame = 0;

function centerStudy(index, behavior) {
  const study = studies[index];
  const left = strip.scrollLeft + study.getBoundingClientRect().left - strip.getBoundingClientRect().left;
  strip.scrollTo({ left: left + (study.offsetWidth - strip.clientWidth) / 2, behavior });
}

function updateStrip() {
  frame = 0;
  const first = studies[0].getBoundingClientRect();
  const center = strip.getBoundingClientRect().left + strip.clientWidth / 2;
  const slot = first.width;
  if (!slot) return;
  const position = Math.max(0, Math.min(studies.length - 1, (center - first.left) / slot - .5));
  const emphasis = studies.map((_, index) => Math.max(0, 1 - Math.abs(index - position)));
  const fullWidth = parseFloat(getComputedStyle(studies[0].firstElementChild).width);
  const gap = Math.max(8, Math.min(18, window.innerWidth * .0115));
  const thumbnail = (slot - gap) * 2 - fullWidth;
  const widths = emphasis.map((weight) => thumbnail + (fullWidth - thumbnail) * weight);
  const centers = [0];
  for (let index = 1; index < widths.length; index++) {
    centers.push(centers[index - 1] + gap + (widths[index - 1] + widths[index]) / 2);
  }
  const lower = Math.floor(position);
  const visualCenter = centers[lower] + (position - lower) * ((centers[lower + 1] ?? centers[lower]) - centers[lower]);
  const nextSelected = Math.round(position);
  studies.forEach((study, index) => {
    const shift = centers[index] - visualCenter - (index - position) * slot;
    study.style.setProperty("--shift", shift + "px");
    study.style.setProperty("--scale", widths[index] / fullWidth);
    study.style.setProperty("--opacity", .66 + .34 * emphasis[index]);
    if (nextSelected !== selected) {
      study.setAttribute("aria-pressed", String(index === nextSelected));
    }
  });
  if (nextSelected !== selected) {
    selected = nextSelected;
    const study = studies[selected];
    title.textContent = study.dataset.title;
    edition.hidden = !study.dataset.edition;
    edition.textContent = study.dataset.edition ? "edition " + study.dataset.edition + "/10" : "";
  }
  controls[0].disabled = selected === 0;
  controls[1].disabled = selected === studies.length - 1;
}

function goTo(index, focus = false) {
  const next = Math.max(0, Math.min(index, studies.length - 1));
  if (focus) studies[next].focus({ preventScroll: true });
  centerStudy(next, reducedMotion.matches ? "instant" : "smooth");
}

strip.addEventListener("scroll", () => {
  if (!frame) frame = requestAnimationFrame(updateStrip);
}, { passive: true });

strip.addEventListener("click", (event) => {
  const index = studies.indexOf(event.target.closest(".study"));
  if (index !== -1) goTo(index);
});

strip.addEventListener("keydown", (event) => {
  const direction = { ArrowLeft: -1, ArrowRight: 1 }[event.key];
  const index = studies.indexOf(document.activeElement);
  if (!direction || index < 0) return;
  event.preventDefault();
  goTo(index + direction, true);
});

controls.forEach((button) => {
  button.addEventListener("click", () => goTo(selected + Number(button.dataset.step)));
});

function initializeStrip() {
  centerStudy(featured, "instant");
  updateStrip();
  document.documentElement.classList.remove("gallery-initializing");
}

initializeStrip();
window.addEventListener("pageshow", (event) => {
  if (event.persisted) initializeStrip();
});

let stripWidth = strip.clientWidth;
new ResizeObserver(() => {
  if (strip.clientWidth === stripWidth) return;
  stripWidth = strip.clientWidth;
  centerStudy(selected, "instant");
  updateStrip();
}).observe(strip);
