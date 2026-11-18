// ---------- Dark / light mode toggle ----------
const root = document.documentElement;
const toggleBtn = document.getElementById("theme-toggle");
const STORAGE_KEY = "umair-portfolio-theme";

function applyTheme(theme) {
  if (theme === "light") {
    root.setAttribute("data-theme", "light");
  } else {
    root.removeAttribute("data-theme");
  }
}

function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    applyTheme(saved);
    return;
  }
  const prefersLight = window.matchMedia(
    "(prefers-color-scheme: light)",
  ).matches;
  applyTheme(prefersLight ? "light" : "dark");
}

toggleBtn.addEventListener("click", () => {
  const isLight = root.getAttribute("data-theme") === "light";
  const next = isLight ? "dark" : "light";
  applyTheme(next);
  localStorage.setItem(STORAGE_KEY, next);
});

initTheme();

// ---------- Live project status badge ----------
// Reads status.json so your CI/CD pipeline can update it on every deploy
// (e.g. a step in your GitHub Actions workflow that writes the commit SHA
// and build time into this file before the Docker image is built).
async function loadStatus() {
  const dot = document.getElementById("status-dot");
  const label = document.getElementById("status-label");
  const versionEl = document.getElementById("status-version");
  const timeEl = document.getElementById("status-time");

  try {
    const res = await fetch("status.json", { cache: "no-store" });
    if (!res.ok) throw new Error("status.json not found");
    const data = await res.json();

    dot.classList.add("live");
    label.textContent = data.status || "Live";
    versionEl.textContent = data.version || "—";
    timeEl.textContent = data.lastDeployed || "—";
  } catch (err) {
    // Falls back gracefully if status.json is missing — site still works.
    dot.classList.remove("live");
    label.textContent = "Status unavailable";
    versionEl.textContent = "—";
    timeEl.textContent = "—";
  }
}

loadStatus();

// ---------- Footer year ----------
document.getElementById("year").textContent = new Date().getFullYear();
