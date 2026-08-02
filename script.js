// --- Celestial Data Configuration ---
const celestialData = {
  Sun: { type: "Yellow Dwarf Star", size: "1,392,700 km", distance: "0 AU", period: "N/A", moons: "0 (8 Planets)" },
  Mercury: { type: "Terrestrial Planet", size: "4,879 km", distance: "0.39 AU", period: "88 days", moons: "0" },
  Venus: { type: "Terrestrial Planet", size: "12,104 km", distance: "0.72 AU", period: "225 days", moons: "0" },
  Earth: { type: "Terrestrial Planet", size: "12,742 km", distance: "1.00 AU", period: "365.25 days", moons: "1" },
  Mars: { type: "Terrestrial Planet", size: "6,779 km", distance: "1.52 AU", period: "687 days", moons: "2" },
  Jupiter: { type: "Gas Giant", size: "139,820 km", distance: "5.20 AU", period: "11.9 years", moons: "95" },
  Saturn: { type: "Gas Giant", size: "116,460 km", distance: "9.58 AU", period: "29.5 years", moons: "146" },
  Uranus: { type: "Ice Giant", size: "50,724 km", distance: "19.22 AU", period: "84 years", moons: "28" },
  Neptune: { type: "Ice Giant", size: "49,244 km", distance: "30.05 AU", period: "164.8 years", moons: "16" }
};

const planetsConfig = [
  { name: "Mercury", radius: 70, period: 12 },
  { name: "Venus",   radius: 110, period: 18 },
  { name: "Earth",   radius: 160, period: 24 },
  { name: "Mars",    radius: 210, period: 32 },
  { name: "Jupiter", radius: 290, period: 45 },
  { name: "Saturn",  radius: 380, period: 60 },
  { name: "Uranus",  radius: 460, period: 75 },
  { name: "Neptune", radius: 530, period: 90 }
];

const systemContainer = document.getElementById('system-container');
const viewport = document.getElementById('space-viewport');

// --- Dynamic DOM Generation ---
planetsConfig.forEach(p => {
  const orbit = document.createElement('div');
  orbit.className = 'orbit';
  orbit.style.width = `${p.radius * 2}px`;
  orbit.style.height = `${p.radius * 2}px`;

  const orbitSpin = document.createElement('div');
  orbitSpin.className = 'orbit-spin';
  orbitSpin.style.animationDuration = `${p.period}s`;

  const planet = document.createElement('div');
  planet.className = `planet ${p.name.toLowerCase()}`;
  planet.dataset.name = p.name;

  // --- Specific Target Hovering ---
  // When hovering directly over the planet element, pause only its parent orbit container
  planet.addEventListener('mouseenter', () => {
    orbitSpin.classList.add('paused');
  });

  planet.addEventListener('mouseleave', () => {
    orbitSpin.classList.remove('paused');
  });

  orbitSpin.appendChild(planet);
  orbit.appendChild(orbitSpin);
  systemContainer.appendChild(orbit);
});

// --- Interactive Pan & Zoom Logic ---
let scale = 1;
let panX = 0;
let panY = 0;
let isDragging = false;
let startX = 0;
let startY = 0;

function updateTransform() {
  systemContainer.style.transform = `translate(calc(-50% + ${panX}px), calc(-50% + ${panY}px)) scale(${scale})`;
}

viewport.addEventListener('wheel', (e) => {
  e.preventDefault();
  const zoomFactor = 0.1;
  if (e.deltaY < 0) {
    scale = Math.min(scale + zoomFactor, 3);
  } else {
    scale = Math.max(scale - zoomFactor, 0.4);
  }
  updateTransform();
});

viewport.addEventListener('mousedown', (e) => {
  if (e.target.classList.contains('planet') || e.target.classList.contains('sun')) return;
  isDragging = true;
  startX = e.clientX - panX;
  startY = e.clientY - panY;
});

window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  panX = e.clientX - startX;
  panY = e.clientY - startY;
  updateTransform();
});

window.addEventListener('mouseup', () => {
  isDragging = false;
});

// --- Information Panel Interaction ---
const infoPanel = document.getElementById('info-panel');
const closePanel = document.getElementById('close-panel');

document.querySelectorAll('.planet, .sun').forEach(element => {
  element.addEventListener('click', (e) => {
    e.stopPropagation();
    const name = element.dataset.name;
    const data = celestialData[name];

    document.getElementById('panel-name').textContent = name;
    document.getElementById('panel-type').textContent = data.type;
    document.getElementById('panel-size').textContent = data.size;
    document.getElementById('panel-distance').textContent = data.distance;
    document.getElementById('panel-period').textContent = data.period;
    document.getElementById('panel-moons').textContent = data.moons;

    infoPanel.classList.add('visible');
  });
});

closePanel.addEventListener('click', () => {
  infoPanel.classList.remove('visible');
});