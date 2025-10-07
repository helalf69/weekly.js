// Din eksisterende array:
const monthColor = [
  "LightBlue",      // Jan
  "White",          // Feb
  "Aquamarine",     // Mar
  "LightGreen",     // Apr
  "LimeGreen",      // May
  "Gold",           // Jun
  "Orange",         // Jul
  "Tomato",         // Aug
  "Olive",          // Sep
  "OrangeRed",      // Oct
  "Brown",          // Nov
  "LightSteelBlue"  // Dec
];

// Hjelpere
function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }
function lerp(a, b, t) { return a + (b - a) * t; } // t ∈ [0,1]
function mapRange(x, inMin, inMax, outMin, outMax) {
  if (inMax === inMin) return outMin;
  const t = clamp((x - inMin) / (inMax - inMin), 0, 1);
  return lerp(outMin, outMax, t);
}

function daysInMonth(year, monthIndex0) {
  // monthIndex0: 0=Jan..11=Dec
  return new Date(year, monthIndex0 + 1, 0).getDate();
}

function fadeBackground() {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();      // 0..11
  const d = now.getDate();       // 1..31

  const D = daysInMonth(y, m);   // antall dager i denne måneden
  const last7StartDay = D - 7 + 1; // første dag i "siste 7"

  // Farger
  const prev = monthColor[(m + 12 - 1) % 12];
  const curr = monthColor[m];
  const next = monthColor[(m + 1) % 12];

  // Venstre bredde (forrige måned): dag 1..15 => 15% -> 1%
  let leftWidth = 0;
  if (d <= 15) {
    leftWidth = mapRange(d, 1, 15, 15, 1); // prosent
  }

  // Høyre bredde (neste måned)
  // Skaler litt i midt-fasen for måneder som ikke er 30 dager:
  const midEndTarget = 8 * (D / 30); // ca 7.5% ved 28d, 8.27% ved 31d
  let rightWidth = 0;

  if (d >= 16 && d < last7StartDay) {
    // Fra dag 16 til (siste-7): 1% -> ~8%
    rightWidth = mapRange(d, 16, last7StartDay - 1, 1, midEndTarget);
  } else if (d >= last7StartDay) {
    // Siste 7 dager: ~8% -> 84%
    // Startverdi i overgang = midEndTarget
    rightWidth = mapRange(d, last7StartDay, D, midEndTarget, 84);
  }

  // Skriv CSS-variablene
  const bg = document.getElementById('bg');
  if (!bg) return;

  bg.style.setProperty('--left-color', prev);
  bg.style.setProperty('--current-color', curr);
  bg.style.setProperty('--right-color', next);

  bg.style.setProperty('--left-width', `${leftWidth}%`);
  bg.style.setProperty('--right-width', `${rightWidth}%`);
}

// Kjør på last (din PHP-versjon brukte onload – vi kan gjøre det likt)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', fadeBackground);
} else {
  fadeBackground();
}

// (Valgfritt) hvis du vil oppdatere ved midnatt uten reload, kan vi sette en timer senere.

// Hjelpere
function monthName(date, locale = "en-US") {
  return new Intl.DateTimeFormat(locale, { month: "long" }).format(date);
}
function weekdayName(date, locale = "en-US") {
  return new Intl.DateTimeFormat(locale, { weekday: "long" }).format(date);
}
function ordinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
function shiftMonth(date, delta) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + delta);
  return d;
}

function renderTitle() {
  const el = document.getElementById("title");
  if (!el) return;

  const now = new Date();
  const day = now.getDate(); // 1..31

  const thisMonth = monthName(now);                 // "February"
  const prevMonth = monthName(shiftMonth(now, -1)); // "January"
  const nextMonth = monthName(shiftMonth(now, +1)); // "March"

  // PHP-logikken:
  // $month = "<span class='big-month'>F</span>"
  // if (day > 15) echo month + small(nextMonth)
  // else          echo small(prevMonth) + month
  let monthLine = "";
  if (day > 15) {
    monthLine =
      `<span class="big-month">${thisMonth}</span> ` +
      `<span class="small-month">${nextMonth}</span>`;
  } else {
    monthLine =
      `<span class="small-month">${prevMonth}</span> ` +
      `<span class="big-month">${thisMonth}</span>`;
  }

  const dateLine = `${weekdayName(now)} ${ordinal(day)}`;

  el.innerHTML = `
     <span class="brand">Weekly by Hawk</span><br/>
    ${monthLine}<br/>
    <span class="date-line">${dateLine}</span>
  `;
}

// Kjør når DOM er klar
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderTitle);
} else {
  renderTitle();
}
