let showingForecast = false;
let clickCount = 0;

function calculateMoonPhase(date) {
  const LUNAR_CYCLE = 29.53059;

  const knownNewMoon = new Date(2000, 0, 6, 18, 14, 0);

  const timeDiff = date.getTime() - knownNewMoon.getTime();
  const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

  const cyclePosition = daysDiff % LUNAR_CYCLE;

  return cyclePosition;
}

function getMoonSymbol(phaseDay) {
  const phases = ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"];
  const phaseIndex = Math.floor((phaseDay / 29.53059) * 8) % 8;
  return phases[phaseIndex];
}

function getPhaseName(phaseDay) {
  const phaseNames = [
    "New Moon",
    "Waxing Crescent",
    "First Quarter",
    "Waxing Gibbous",
    "Full Moon",
    "Waning Gibbous",
    "Third Quarter",
    "Waning Crescent",
  ];

  const phaseIndex = Math.floor((phaseDay / 29.53059) * 8) % 8;
  return phaseNames[phaseIndex];
}

function calculateIllumination(phaseDay) {
  const cycle = 29.53059;
  const angle = (phaseDay / cycle) * 2 * Math.PI;
  const illumination = (1 + Math.cos(angle + Math.PI)) / 2;
  return Math.round(illumination * 100);
}

function formatFullDate(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatShortDate(date) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[date.getMonth()]} ${date.getDate()}`;
}

function updateCurrentMoon() {
  const now = new Date();
  const phaseDay = calculateMoonPhase(now);

  document.getElementById("currentMoon").textContent = getMoonSymbol(phaseDay);
  document.getElementById("currentPhase").textContent = getPhaseName(phaseDay);
  document.getElementById("currentDate").textContent = formatFullDate(now);
  document.getElementById(
    "currentIllumination"
  ).textContent = `${calculateIllumination(phaseDay)}% illuminated`;
}

function buildWeekForecast() {
  const forecastContainer = document.getElementById("weekForecast");
  forecastContainer.innerHTML = "";

  for (let i = 1; i <= 7; i++) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + i);
    const phaseDay = calculateMoonPhase(futureDate);

    const dayElement = document.createElement("div");
    dayElement.className = "day-item";
    dayElement.innerHTML = `
                    <div class="date-label">${formatShortDate(futureDate)}</div>
                    <div class="mini-moon">${getMoonSymbol(phaseDay)}</div>
                    <div class="phase-label">${getPhaseName(phaseDay)}</div>
                    <div class="percent">${calculateIllumination(
                      phaseDay
                    )}%</div>
                `;

    dayElement.style.animationDelay = `${i * 0.1}s`;

    forecastContainer.appendChild(dayElement);
  }
}

function toggleForecast() {
  const forecast = document.getElementById("weekForecast");
  const toggleBtn = document.getElementById("toggleText");

  if (showingForecast) {
    forecast.classList.remove("show");
    toggleBtn.textContent = "Show Week Ahead";
    showingForecast = false;
  } else {
    if (forecast.innerHTML === "") {
      buildWeekForecast();
    }
    forecast.classList.add("show");
    toggleBtn.textContent = "Hide Forecast";
    showingForecast = true;
  }
}

function moonClick() {
  clickCount++;
  const moonEl = document.getElementById("currentMoon");

  if (clickCount === 5) {
    moonEl.style.animation = "moonFloat 0.5s ease infinite";
    setTimeout(() => {
      moonEl.style.animation = "moonFloat 6s ease-in-out infinite";
    }, 2000);
  } else if (clickCount === 10) {
    alert("🌙 The moon says hello! You found the easter egg! 🌙");
    clickCount = 0;
  }
}

updateCurrentMoon();

const now = new Date();
const tomorrow = new Date(now);
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(0, 0, 0, 0);
const millisecondsUntilMidnight = tomorrow - now;

setTimeout(() => {
  updateCurrentMoon();
  setInterval(updateCurrentMoon, 24 * 60 * 60 * 1000);
}, millisecondsUntilMidnight);

console.log(
  "🌙 Luna Tracker loaded successfully! Click the moon 10 times for a surprise..."
);
