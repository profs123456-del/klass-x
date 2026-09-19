/* =========================
   ✅ FIREBASE CONFIG
   ========================= */
const firebaseConfig = {
  apiKey: "AIzaSyCN2z5hKD5Tp9Ji2MQhpK3aUe2waoxvKOA",
  authDomain: "klass-x.firebaseapp.com",
  databaseURL: "https://klass-x-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "klass-x",
  storageBucket: "klass-x.firebasestorage.app",
  messagingSenderId: "760760762940",
  appId: "1:760760762940:web:9f8e96a8c041e34ec8b939"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

/* ✅ SERVER TIME SYNC (fix +12 sec issues) */
let serverOffset = 0;
let serverReady = false;

db.ref(".info/serverTimeOffset").on("value", snap => {
  serverOffset = snap.val() || 0;
  serverReady = true;
});

/* =========================
   ✅ SETTINGS
   ========================= */
const HISTORY_LIMIT = 400;     // show last 200 logs
const ADMIN_PIN = "tracker";      // change this

let inputLock = false;
document.addEventListener("focusin", e => { if (e.target.type === "datetime-local") inputLock = true; });
document.addEventListener("focusout", e => { if (e.target.type === "datetime-local") inputLock = false; });

/* =========================
   ✅ BOSS PANEL
   One combined panel (was 4 separate CHANNEL 0-3 panels).
   Which channel a card belongs to is now shown on the card
   itself and controlled via the BOSSES & RESPAWN TIME filter.
   ========================= */
const BOSS_SECTION_KEY = "bosses";

/* Each boss entry has its own independent `respawn` value, in MINUTES.
   This is what makes different respawn intervals per boss possible —
   e.g. Darkswordsman Jr. (respawn:60 = 1 hour) and Etherial Fist
   (respawn:120 = 2 hours) each count down on their own schedule.
   Cheat sheet: 60=1h, 90=1.5h, 120=2h, 180=3h, 240=4h, 360=6h, 480=8h,
   720=12h. When changing a boss's respawn time, update it on ALL of
   that boss's channel lines (CH-0/CH-1/CH-2/CH-3) below, and keep the
   matching entry in BOSS_CATEGORIES (further down) in sync too, since
   that's what drives the respawn-time filter dropdown's label/grouping. */
const bosses = [
  {id:"1",name:"Darkswordsman Jr.",location:"Mystic Peak Hole",fullName:"CH-0 Darkswordsman Jr. - Mystic Peak Hole.",channel:0,respawn:60},
  {id:"2",name:"Darkswordsman Jr.",location:"Phoenix Hole",fullName:"CH-0 Darkswordsman Jr. - Phoenix Hole.",channel:0,respawn:60},
  {id:"3",name:"Darkswordsman Jr.",location:"SG Campus",fullName:"CH-0 Darkswordsman Jr. - SGe Campus.",channel:0,respawn:60},
  {id:"4",name:"Darkswordsman Jr.",location:"MP Campus",fullName:"CH-0 Darkswordsman Jr. - MP Campus.",channel:0,respawn:60},
  {id:"5",name:"Darkswordsman Jr.",location:"Phoenix Campus",fullName:"CH-0 Darkswordsman Jr. - Phoenix Campus.",channel:0,respawn:60},
  {id:"6",name:"Etherial Fist",location:"Mystic Peak Hole",fullName:"CH-0 Etherial Fist - Mystic Peak Hole.",channel:0,respawn:120},
  {id:"7",name:"Etherial Fist",location:"Phoenix Hole",fullName:"CH-0 Etherial Fist - Phoenix Hole.",channel:0,respawn:120},
  {id:"8",name:"Etherial Fist",location:"Sacred Gate Hole",fullName:"CH-0 Etherial Fist - Sacred Gate Hole.",channel:0,respawn:120},
  {id:"9",name:"Ninja Knife",location:"Sacred Gate Hole",fullName:"CH-0 Ninja Knife - Sacred Gate HOle.",channel:0,respawn:120},
  {id:"10",name:"Dark Swordsman",location:"Sacred Gate Hole",fullName:"CH-0 Dark Swordsman - Sacred Gate Hole.",channel:0,respawn:120},
  {id:"11",name:"Dark Art Master",location:"Leonine Campus B3",fullName:"CH-0 Dark Art Master - Leonine Campus B3",channel:0,respawn:360},
  {id:"12",name:"Cruel Jupiter",location:"Practicing Yard",fullName:"CH-0 Cruel Jupiter- Practicing Yard",channel:0,respawn:480},
  {id:"13",name:"Darkswordsman Jr.",location:"Mystic Peak Hole",fullName:"CH-1 Darkswordsman Jr. - Mystic Peak Hole.",channel:1,respawn:60},
  {id:"14",name:"Darkswordsman Jr.",location:"Phoenix Hole",fullName:"CH-1 Darkswordsman Jr. - Phoenix Hole.",channel:1,respawn:60},
  {id:"15",name:"Darkswordsman Jr.",location:"SG Campus",fullName:"CH-1 Darkswordsman Jr. - SG Campus.",channel:1,respawn:60},
  {id:"16",name:"Darkswordsman Jr.",location:"MP Campus",fullName:"CH-1 Darkswordsman Jr. - MP Campus.",channel:1,respawn:60},
  {id:"17",name:"Darkswordsman Jr.",location:"Phoenix Campus",fullName:"CH-1 Darkswordsman Jr. - Phoenix Campus.",channel:1,respawn:60},
  {id:"18",name:"Etherial Fist",location:"Mystic Peak Hole",fullName:"CH-1 Etherial Fist - Mystic Peak Hole.",channel:1,respawn:120},
  {id:"19",name:"Etherial Fist",location:"Phoenix Hole",fullName:"CH-1 Etherial Fist - Phoenix Hole.",channel:1,respawn:120},
  {id:"20",name:"Etherial Fist",location:"Sacred Gate Hole",fullName:"CH-1 Etherial Fist - Sacred Gate Hole.",channel:1,respawn:120},
  {id:"21",name:"Ninja Knife",location:"Sacred Gate Hole",fullName:"CH-1 Ninja Knife - Sacred Gate HOle.",channel:1,respawn:120},
  {id:"22",name:"Dark Swordsman",location:"Sacred Gate Hole",fullName:"CH-1 Dark Swordsman - Sacred Gate Hole.",channel:1,respawn:120},
  {id:"23",name:"Dark Art Master",location:"Leonine Campus B3",fullName:"CH-1 Dark Art Master - Leonine Campus B3",channel:1,respawn:360},
  {id:"24",name:"Cruel Jupiter",location:"Practicing Yard",fullName:"CH-0 Cruel Jupiter- Practicing Yard",channel:1,respawn:480},
  {id:"25",name:"Darkswordsman Jr.",location:"Mystic Peak Hole",fullName:"CH-2 Darkswordsman Jr. - Mystic Peak Hole.",channel:2,respawn:60},
  {id:"26",name:"Darkswordsman Jr.",location:"Phoenix Hole",fullName:"CH-2 Darkswordsman Jr. - Phoenix Hole.",channel:2,respawn:60},
  {id:"27",name:"Darkswordsman Jr.",location:"SG Campus",fullName:"CH-2 Darkswordsman Jr. - SG Campus.",channel:2,respawn:60},
  {id:"28",name:"Darkswordsman Jr.",location:"MP Campus",fullName:"CH-2 Darkswordsman Jr. - MP Campus.",channel:2,respawn:60},
  {id:"29",name:"Darkswordsman Jr.",location:"Phoenix Campus",fullName:"CH-2 Darkswordsman Jr. - Phoenix Campus.",channel:2,respawn:60},
  {id:"30",name:"Etherial Fist",location:"Mystic Peak Hole",fullName:"CH-2 Etherial Fist - Mystic Peak Hole.",channel:2,respawn:120},
  {id:"31",name:"Etherial Fist",location:"Phoenix Hole",fullName:"CH-2 Etherial Fist - Phoenix Hole.",channel:2,respawn:120},
  {id:"32",name:"Etherial Fist",location:"Sacred Gate Hole",fullName:"CH-2 Etherial Fist - Sacred Gate Hole.",channel:2,respawn:120},
  {id:"33",name:"Ninja Knife",location:"Sacred Gate Hole",fullName:"CH-2 Ninja Knife - Sacred Gate HOle.",channel:2,respawn:120},
  {id:"34",name:"Dark Swordsman",location:"Sacred Gate Hole",fullName:"CH-2 Dark Swordsman - Sacred Gate Hole.",channel:2,respawn:120},
  {id:"35",name:"Dark Art Master",location:"Leonine Campus B3",fullName:"CH-2 Dark Art Master - Leonine Campus B3",channel:2,respawn:360},
  {id:"36",name:"Cruel Jupiter",location:"Practicing Yard",fullName:"CH-2 Cruel Jupiter- Practicing Yard",channel:2,respawn:480},
  {id:"37",name:"Darkswordsman Jr.",location:"Mystic Peak Hole",fullName:"CH-3 Darkswordsman Jr. - Mystic Peak Hole.",channel:3,respawn:60},
  {id:"38",name:"Darkswordsman Jr.",location:"Phoenix Hole",fullName:"CH-3 Darkswordsman Jr. - Phoenix Hole.",channel:3,respawn:60},
  {id:"39",name:"Darkswordsman Jr.",location:"SG Campus",fullName:"CH-3 Darkswordsman Jr. - SG Campus.",channel:3,respawn:60},
  {id:"40",name:"Darkswordsman Jr.",location:"MP Campus",fullName:"CH-3 Darkswordsman Jr. - MP Campus.",channel:3,respawn:60},
  {id:"41",name:"Darkswordsman Jr.",location:"Phoenix Campus",fullName:"CH-3 Darkswordsman Jr. - Phoenix Campus.",channel:3,respawn:60},
  {id:"42",name:"Etherial Fist",location:"Mystic Peak Hole",fullName:"CH-3 Etherial Fist - Mystic Peak Hole.",channel:3,respawn:120},
  {id:"43",name:"Etherial Fist",location:"Phoenix Hole",fullName:"CH-3 Etherial Fist - Phoenix Hole.",channel:3,respawn:120},
  {id:"44",name:"Etherial Fist",location:"Sacred Gate Hole",fullName:"CH-3 Etherial Fist - Sacred Gate Hole.",channel:3,respawn:120},
  {id:"45",name:"Ninja Knife",location:"Sacred Gate Hole",fullName:"CH-3 Ninja Knife - Sacred Gate HOle.",channel:3,respawn:120},
  {id:"46",name:"Dark Swordsman",location:"Sacred Gate Hole",fullName:"CH-3 Dark Swordsman - Sacred Gate Hole.",channel:3,respawn:120},
  {id:"47",name:"Dark Art Master",location:"Leonine Campus B3",fullName:"CH-3 Dark Art Master - Leonine Campus B3",channel:3,respawn:360},
  {id:"48",name:"Cruel Jupiter",location:"Practicing Yard",fullName:"CH-3 Cruel Jupiter- Practicing Yard",channel:3,respawn:480},
];

/* Map of boss-name substring -> background image file.
   (Replaces the long chain of duplicated if-statements from the original file.) */
const BOSS_BG_MAP = [
  ["Darkswordsman Jr.", "ds jr.png"],
  ["Etherial Fist", "EF.png"],
  ["Ninja Knife", "NK.png"],
  ["Dark Swordsman", "Dark_Swordsman.png"],
  ["Dark Art Master", "dam.png"],
  ["Cruel Jupiter", "cj enhance.png"],
];

/* Per-location art overrides. Checked before BOSS_BG_MAP, so a specific
   school/location can get unique art instead of the species' generic
   background. Keyed by the boss's `location` field. */
const LOCATION_BG_MAP = [
  ["MP Campus", "mystic_bg.png"],
];

/* Per boss+location art (the actual in-game render screenshots).
   Checked BEFORE the generic LOCATION_BG_MAP/BOSS_BG_MAP, since some
   locations (e.g. "Phoenix Hole") are shared by more than one boss
   species and need to resolve to different art per species. */
const BOSS_LOCATION_ART_MAP = [
  { name: "Darkswordsman Jr.", location: "MP Campus",    file: "MP_Campdsjr.png" },
  { name: "Darkswordsman Jr.", location: "Mystic Peak Hole",    file: "Mystic_Peak_Hole.png" },
  { name: "Darkswordsman Jr.", location: "Phoenix Hole",        file: "Phoenix_Hole_DS.png" },
  { name: "Darkswordsman Jr.", location: "SG Campus",  file: "Sacred_Gate_Dsjr_.png" },
  { name: "Darkswordsman Jr.", location: "Phoenix Campus",      file: "Phoenix_Campus_DS.png" },
  { name: "Etherial Fist",     location: "Mystic Peak Hole",    file: "Etherial_Fist_MP.png" },
  { name: "Etherial Fist",     location: "Phoenix Hole",        file: "Etherial_Fist_PH.png" },
  { name: "Etherial Fist",     location: "Sacred Gate Hole",        file: "Etherial_Fist_SG.png" },
  { name: "Ninja Knife",       location: "Sacred Gate Hole",                  file: "Ninja_Knife.png" },
  { name: "Dark Swordsman",       location: "Sacred Gate Hole",                  file: "Dark_Swordsman.png" },
  { name: "Dark Art Master",       location: "Leonine Campus B3",                  file: "dam.png" },
  { name: "Cruel Jupiter",       location: "Practicing Yard",                  file: "cj enhance.png" },
];

function getBossBg(b){
  const name = typeof b === "string" ? b : b.name;
  const location = typeof b === "string" ? b : b.location;

  const exactHit = BOSS_LOCATION_ART_MAP.find(entry =>
    name.includes(entry.name) &&
    (entry.location === null || (location && location.includes(entry.location)))
  );
  if(exactHit) return exactHit.file;

  if(location){
    const locHit = LOCATION_BG_MAP.find(([key]) => location.includes(key));
    if(locHit) return locHit[1];
  }
  const hit = BOSS_BG_MAP.find(([key]) => name.includes(key));
  return hit ? hit[1] : null;
}

/* Map of school/map-name substring -> map icon file. Used to badge each
   boss card (and the hero "next spawn" art) with the icon of the school
   that boss's location belongs to: Mystic Peak, Sacred Gate, or Phoenix.
   Keyed independently of species name/background, since different boss
   species (Darkswordsman Jr., Etherial Fist) can share the same school. */
const MAP_ICON_MAP = [
  ["Mystic Peak", "Mystic_Peak.png"],
  ["MP Campus", "Mystic_Peak.png"],
  ["Sacred Gate Hole", "Sacred_Gate.png"],
  ["SG Campus", "Sacred_Gate.png"],
  ["Phoenix", "Phoenix.png"],
  
];

/* Full scenic background for the "NEXT SPAWN" hero panel, swapped in
   based on which school/location the next boss belongs to. Add more
   entries here as more location backgrounds are provided (Phoenix,
   Sacred Gate, etc). */
const PANEL_BG_MAP = [
  ["Mystic Peak Hole", "Mystic.png"],
  ["MP Campus", "mystic_bg.png"],
  ["Phoenix Hole", "phoenix_hole_BG.png"],
  ["Phoenix Campus", "Phc_bg.png"],
  ["Sacred Gate Hole", "SacredGate_BG.png"],
  ["SG Campus", "SG_Campus_BG.png"],
  ["Practicing Yard", "Practicing_Yard_BG.png"],
];

function getPanelBg(location){
  if(!location) return null;
  const hit = PANEL_BG_MAP.find(([key]) => location.includes(key));
  return hit ? hit[1] : null;
}

function setHeroPanelBg(location){
  const panel = document.getElementById("nextBossPanel");
  if(!panel) return;
  const bg = getPanelBg(location);
  if(bg){
    panel.style.backgroundImage =
      "linear-gradient(135deg, rgba(6,9,20,.88) 0%, rgba(6,9,20,.7) 55%, rgba(6,9,20,.92) 100%), url('" + bg + "')";
    panel.style.backgroundSize = "cover";
    panel.style.backgroundPosition = "center";
  } else {
    panel.style.backgroundImage = "";
  }
}

function getMapIcon(location){
  if(!location) return null;
  const hit = MAP_ICON_MAP.find(([key]) => location.includes(key));
  return hit ? hit[1] : null;
}

/* Clean, compact "Sep 8 · 12:02 PM" style formatting for next-spawn
   timestamps, used instead of the verbose default toLocaleString()
   output (e.g. "9/8/2025, 12:02:37 PM") so the boss cards and hero
   panel read smoother at a glance. */
function formatSpawnTime(date){
  const datePart = date.toLocaleDateString([], {month:"short", day:"numeric"});
  const timePart = date.toLocaleTimeString([], {hour:"2-digit", minute:"2-digit", second:"2-digit"});
  return `${datePart} · ${timePart}`;
}

/* Map of boss-name substring -> card accent color class (matches the
   colored borders/badges in the KLASS X redesign). */
const BOSS_CAT_CLASS_MAP = [
  ["Darkswordsman Jr.", "cat-dsjr"],
  ["Etherial Fist", "cat-ef"],
  ["Ninja Knife", "cat-nk"],
  ["DARK SWORDSMAN", "cat-ds"],
  ["DARK ART MASTER", "cat-dam"],
];

function getBossCatClass(name){
  const hit = BOSS_CAT_CLASS_MAP.find(([key]) => name.includes(key));
  return hit ? hit[1] : "";
}

const channelsWrapper = document.getElementById("channelsWrapper");
const sound = document.getElementById("sound");
const sortBtn = document.getElementById("sortBtn");
const soundBtn = document.getElementById("soundBtn");
const nextBossTimer = document.getElementById("nextBossTimer");

let autoSort = true;
let alarmOn = true;
let alerted = {};
let warnedTenMin = {};
let warnedFiveMin = {};
let lastBeepSecond = null;

function speak(text){
  try{
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1;
    u.pitch = 1;
    u.volume = 1;
    speechSynthesis.speak(u);
  }catch(e){}
}

/* =========================
   ✅ BUILD BOSS PANEL + CARDS
   ========================= */
function isChannelCollapsed(ch){
  try{ return localStorage.getItem("channel-collapsed-" + ch) === "1"; }catch(e){ return false; }
}

function toggleChannel(ch){
  const section = document.getElementById("channel-" + ch + "-section");
  section.classList.toggle("collapsed");
  try{
    localStorage.setItem("channel-collapsed-" + ch, section.classList.contains("collapsed") ? "1" : "0");
  }catch(e){}
}

(function buildBossSection(){
  const section = document.createElement("div");
  section.className = "channel-section";
  section.id = "channel-" + BOSS_SECTION_KEY + "-section";
  // Collapse/expand no longer has a visible toggle in the redesigned layout,
  // so the boss grid always renders expanded (ignore any stale saved state).

  section.innerHTML = `
    <div class="channel-header" onclick="toggleChannel('${BOSS_SECTION_KEY}')">
      <div class="channel-toggle">▾</div>
      <div class="channel-title">BOSSES</div>
    </div>
    <div class="channel-body" id="channel-${BOSS_SECTION_KEY}-body"></div>
  `;
  channelsWrapper.appendChild(section);
})();

bosses.forEach(b => {
  const card = document.createElement("div");
  const catClass = getBossCatClass(b.name);
  card.className = "card" + (catClass ? " " + catClass : "");
  card.id = b.id + "-card";

  const bg = getBossBg(b);
  const artStyle = bg ? ` style="background-image:url('${bg}')"` : "";
  const mapIcon = getMapIcon(b.location);
  const mapIconHtml = mapIcon ? `<img class="card-map-icon" src="${mapIcon}" alt="${b.location}">` : "";
  const locationHtml = b.location ? `<div class="card-location">${b.location}</div>` : "";

  card.innerHTML = `
    <div class="card-art"${artStyle}>
      <div class="card-drag-handle" title="Drag to trash to reset">🗑️</div>
      ${mapIconHtml}
      <div class="card-art-info">
        <div class="card-name">${b.name}</div>
        ${locationHtml}
        <div class="card-ch-badge ch-${b.channel}">CH ${b.channel}</div>
      </div>
    </div>
    <div class="card-body">
      <div class="timer" id="${b.id}-timer">--:--:--</div>
      <div class="next-label" id="${b.id}-next">Next Spawn: --</div>

      <div class="calendar-panel">
        <div class="calendar-display">Select Date &amp; Time</div>
        <input
        type="datetime-local"
        class="datetime-input"
        id="${b.id}-input"
        step="1">
      </div>

      <button class="killed-now" onclick="now('${b.id}',${b.respawn})">Killed Now</button>
      <button class="set-manual" onclick="manual('${b.id}',${b.respawn})">Set Manual</button>
    </div>
  `;
  document.getElementById("channel-" + BOSS_SECTION_KEY + "-body").appendChild(card);
});

/* =========================
   ✅ BOSS FILTER PANEL
   Lets the user pick which bosses/channels actually
   show up in the tracker grid, organized HOUR -> BOSS -> CHANNEL.
   Choices persist locally per browser.
   ========================= */

/* Boss "families" shown in the filter — each covers every specific
   name that shares that background/category. Rename display names
   here later once the exact per-boss naming is finalized. */
/* This table is ONLY used to power the "BOSSES & RESPAWN TIME" filter
   dropdown (grouping + hour-pill labels) — it does NOT control the
   actual countdown. The real timer always comes from each boss's own
   `respawn` field up in the `bosses` array above. Keep the `respawn`
   value here matching whatever you set on that boss's entries above,
   or the filter pill will show the wrong hour label. */
const BOSS_CATEGORIES = [
  { name: "Dark Swordsman Jr.", respawn: 60,  match: ["Darkswordsman Jr."] },
  { name: "Etherial Fist",      respawn: 120, match: ["Etherial Fist"] },
  { name: "Ninja Knife",        respawn: 120, match: ["Ninja Knife"] },
  { name: "Darkswordsman",      respawn: 120, match: ["Dark Swordsman"] },
  { name: "Dark Art Master",    respawn: 360, match: ["Dark Art Master"] },
  { name: "Cruel Jupiter",    respawn: 480, match: ["Cruel Jupiter"] },
];

/* =========================
   ✅ SMART BOSS SEARCH
   Powers the "Search: ch0, ef, mpcamp…" box in the toolbar. Typing
   shorthand tokens (channel, boss abbreviation, map abbreviation),
   separated by spaces, filters the boss card grid directly — every
   token has to match (AND), so "ch0 ef" only shows CH-0 Etherial
   Fist cards. Plain text still works as a normal substring search.
   ========================= */
const BOSS_ABBR = [
  { tokens:["dsjr"],          test:b => b.name === "Darkswordsman Jr." },
  { tokens:["ef"],            test:b => b.name === "Etherial Fist" },
  { tokens:["nk"],            test:b => b.name === "Ninja Knife" },
  { tokens:["ds","dsbig"],    test:b => b.name === "Dark Swordsman" },
  { tokens:["dam"],           test:b => b.name === "Dark Art Master" },
  { tokens:["cj"],            test:b => b.name === "Cruel Jupiter" },
];

const LOCATION_ABBR = [
  { tokens:["mpcamp","mpc"],       test:loc => loc.includes("MP Campus") },
  { tokens:["sgcamp","sgc"],       test:loc => loc.includes("SG Campus") },
  { tokens:["phcamp","phc"],       test:loc => loc.includes("Phoenix Campus") },
  { tokens:["mph","mphole"],       test:loc => loc.includes("Mystic Peak Hole") },
  { tokens:["sgh","sghole"],       test:loc => loc.includes("Sacred Gate Hole") },
  { tokens:["phh","phhole"],       test:loc => loc.includes("Phoenix Hole") },
  { tokens:["py"],                 test:loc => loc.includes("Practicing Yard") },
  { tokens:["lcb3","leo"],         test:loc => loc.includes("Leonine Campus B3") },
];

/* Joins shorthand that people naturally type with a space ("ds jr",
   "ch 0") into single tokens before splitting, so "ch0 ds jr" and
   "ch 0 dsjr" both resolve the same way. */
function normalizeSearchQuery(raw){
  return raw
    .toLowerCase()
    .replace(/ch\s*([0-3])/g, "ch$1")
    .replace(/ds\s*jr\.?/g, "dsjr");
}

function tokenMatchesBoss(token, b){
  const chMatch = token.match(/^ch([0-3])$/);
  if(chMatch) return b.channel === parseInt(chMatch[1], 10);

  const bossHit = BOSS_ABBR.find(entry => entry.tokens.includes(token));
  if(bossHit) return bossHit.test(b);

  const locHit = LOCATION_ABBR.find(entry => entry.tokens.includes(token));
  if(locHit) return locHit.test(b.location || "");

  const haystack = (b.name + " " + (b.location || "") + " ch" + b.channel).toLowerCase();
  return haystack.includes(token);
}

function bossMatchesQuery(b, rawQuery){
  const q = normalizeSearchQuery(rawQuery.trim());
  if(!q) return true;
  const tokens = q.split(/\s+/).filter(Boolean);
  return tokens.every(t => tokenMatchesBoss(t, b));
}

const FILTER_STORAGE_KEY = "boss-visibility-v2";

function loadBossVisibility(){
  try{
    const raw = localStorage.getItem(FILTER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  }catch(e){ return {}; }
}

function saveBossVisibility(state){
  try{ localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(state)); }catch(e){}
}

let bossVisibility = loadBossVisibility();

/* True once the user has made at least one explicit filter choice.
   Before that, isGroupVisible() defaulting to "visible" would make
   every hour-pill and channel-pill LOOK pre-selected/active even
   though the user never touched anything — implying a filter is
   already applied when it isn't. Pills stay neutral until the user
   actually clicks one; the boss list itself still shows everything
   by default regardless, this only affects the pill highlight. */
function hasCustomFilters(){
  return Object.keys(bossVisibility).length > 0;
}

function visKey(catName, ch){ return catName + "::" + ch; }

function isGroupVisible(catName, ch){
  return bossVisibility[visKey(catName, ch)] !== false; // default: visible
}

function categoryForBoss(b){
  return BOSS_CATEGORIES.find(c => c.match.includes(b.name)) || null;
}

function applyBossVisibility(){
  bosses.forEach(b => {
    const cat = categoryForBoss(b);
    const visible = cat ? isGroupVisible(cat.name, b.channel) : true;
    const card = document.getElementById(b.id + "-card");
    if(card){
      const searchHidden = card.dataset.searchHidden === "1";
      card.style.display = (visible && !searchHidden) ? "" : "none";
    }
  });
}

/* Live search — filters the boss CARD GRID itself as you type (see
   the BOSS_ABBR/LOCATION_ABBR tables above for supported shorthand). */
(function initBossCardSearch(){
  const input = document.getElementById("bossSearchInput");
  if(!input) return;
  input.addEventListener("input", () => {
    const q = input.value;
    bosses.forEach(b => {
      const card = document.getElementById(b.id + "-card");
      if(!card) return;
      card.dataset.searchHidden = bossMatchesQuery(b, q) ? "" : "1";
    });
    applyBossVisibility();
  });
})();

/* Fixed set of respawn brackets the tracker supports (in hours).
   Any BOSS_CATEGORIES entry using one of these (respawn in minutes,
   e.g. 60 -> 1H, 360 -> 6H) will automatically land in the matching
   pill/group below. Brackets with no bosses yet still show as a
   dimmed "empty" pill so the full 1H-12H range is always visible. */
const RESPAWN_HOURS = [1,2,3,4,5,6,7,8,10,12];

function hourLabel(minutes){ return (minutes / 60) + "H"; }

(function buildHourPillRow(){
  const row = document.getElementById("hourPillRow");
  if(!row) return;

  RESPAWN_HOURS.forEach(hr => {
    const minutes = hr * 60;
    const cats = BOSS_CATEGORIES.filter(c => c.respawn === minutes);
    const pill = document.createElement("button");
    pill.type = "button";
    pill.className = "hour-pill" + (cats.length ? "" : " empty");
    pill.textContent = hr + "H";

    if(cats.length){
      const active = hasCustomFilters() && cats.some(cat => [0,1,2,3].some(ch => isGroupVisible(cat.name, ch)));
      pill.classList.toggle("active", active);

      pill.onclick = () => {
        const showing = !pill.classList.contains("active");

        /* Only touch channels that are currently part of the user's
           channel selection, instead of forcing ALL 4 channels on/off.
           Previously this pill blindly overrode every channel for this
           respawn bracket, which silently undid any channel a user had
           manually hidden — confusing since nothing they clicked here
           was the "CHANNEL FILTER" row. Now it respects that choice. */
        const activeChannels = [0,1,2,3].filter(ch =>
          BOSS_CATEGORIES.some(c => isGroupVisible(c.name, ch))
        );
        const channelsToToggle = activeChannels.length ? activeChannels : [0,1,2,3];

        cats.forEach(cat => {
          channelsToToggle.forEach(ch => { bossVisibility[visKey(cat.name, ch)] = showing; });
        });
        saveBossVisibility(bossVisibility);
        pill.classList.toggle("active", showing);
        syncFilterCheckboxes();
        syncChannelPills();
        applyBossVisibility();
      };
    } else {
      pill.disabled = true;
      pill.title = "No bosses assigned to this respawn time yet";
    }

    row.appendChild(pill);
  });
})();

function syncFilterCheckboxes(){
  document.querySelectorAll('#bossFilterList input[type="checkbox"]').forEach(cb => {
    cb.checked = isGroupVisible(cb.getAttribute("data-cat"), cb.getAttribute("data-ch"));
  });
}

(function buildChannelPillRow(){
  const row = document.getElementById("channelPillRow");
  if(!row) return;

  [0,1,2,3].forEach(ch => {
    const pill = document.createElement("button");
    pill.type = "button";
    pill.className = "channel-pill";
    pill.textContent = "CH " + ch;

    const active = hasCustomFilters() && BOSS_CATEGORIES.some(cat => isGroupVisible(cat.name, ch));
    pill.classList.toggle("active", active);

    pill.onclick = () => {
      const showing = !pill.classList.contains("active");
      BOSS_CATEGORIES.forEach(cat => {
        bossVisibility[visKey(cat.name, ch)] = showing;
      });
      saveBossVisibility(bossVisibility);
      pill.classList.toggle("active", showing);
      syncFilterCheckboxes();
      syncHourPills();
      applyBossVisibility();
    };

    row.appendChild(pill);
  });
})();

function syncChannelPills(){
  document.querySelectorAll("#channelPillRow .channel-pill").forEach(pill => {
    const ch = parseInt(pill.textContent.replace("CH ", ""), 10);
    const active = hasCustomFilters() && BOSS_CATEGORIES.some(cat => isGroupVisible(cat.name, ch));
    pill.classList.toggle("active", active);
  });
}

(function buildBossFilterPanel(){
  const list = document.getElementById("bossFilterList");
  if(!list) return;

  const hours = [...new Set(BOSS_CATEGORIES.map(c => c.respawn))].sort((a,b) => a - b);

  hours.forEach(hr => {
    const hourGroup = document.createElement("div");
    hourGroup.className = "hour-group";
    hourGroup.innerHTML = `
      <button class="hour-group-toggle" type="button">
        <span class="hour-group-label">${hourLabel(hr)}</span>
        <span class="hour-group-arrow">▾</span>
      </button>
      <div class="hour-group-body"></div>
    `;
    list.appendChild(hourGroup);

    hourGroup.querySelector(".hour-group-toggle").onclick = () => {
      hourGroup.classList.toggle("open");
    };

    const hourBody = hourGroup.querySelector(".hour-group-body");

    BOSS_CATEGORIES.filter(c => c.respawn === hr).forEach(cat => {
      const item = document.createElement("div");
      item.className = "boss-filter-item";
      item.innerHTML = `
        <button class="boss-filter-toggle" type="button">
          <span class="bf-name">${cat.name}</span>
          <span class="bf-arrow">▾</span>
        </button>
        <div class="boss-filter-body">
          ${[0,1,2,3].map(ch => `
            <label class="bf-check">
              <input type="checkbox" data-cat="${cat.name}" data-ch="${ch}" ${isGroupVisible(cat.name, ch) ? "checked" : ""}>
              CH ${ch}
            </label>
          `).join("")}
        </div>
      `;
      hourBody.appendChild(item);

      item.querySelector(".boss-filter-toggle").onclick = () => {
        item.classList.toggle("open");
      };

      item.querySelectorAll("input[type=checkbox]").forEach(cb => {
        cb.addEventListener("change", () => {
          const key = visKey(cb.getAttribute("data-cat"), cb.getAttribute("data-ch"));
          bossVisibility[key] = cb.checked;
          saveBossVisibility(bossVisibility);
          syncHourPills();
          syncChannelPills();
          applyBossVisibility();
        });
      });
    });
  });

  const showAllBtn = document.getElementById("filterShowAllBtn");
  const hideAllBtn = document.getElementById("filterHideAllBtn");

  function setAll(visible){
    BOSS_CATEGORIES.forEach(cat => {
      [0,1,2,3].forEach(ch => { bossVisibility[visKey(cat.name, ch)] = visible; });
    });
    saveBossVisibility(bossVisibility);
    list.querySelectorAll("input[type=checkbox]").forEach(cb => { cb.checked = visible; });
    syncHourPills();
    syncChannelPills();
    applyBossVisibility();
  }

  if(showAllBtn) showAllBtn.onclick = () => setAll(true);
  if(hideAllBtn) hideAllBtn.onclick = () => setAll(false);

  applyBossVisibility();
})();

function syncHourPills(){
  document.querySelectorAll("#hourPillRow .hour-pill:not(.empty)").forEach(pill => {
    const hr = parseInt(pill.textContent, 10);
    const minutes = hr * 60;
    const cats = BOSS_CATEGORIES.filter(c => c.respawn === minutes);
    const active = hasCustomFilters() && cats.some(cat => [0,1,2,3].some(ch => isGroupVisible(cat.name, ch)));
    pill.classList.toggle("active", active);
  });
}

/* =========================
   ✅ RESPAWN FILTER DOCK (top-right dropdown)
   ========================= */
(function wireFilterDock(){
  const dock = document.getElementById("respawnFilterDock");
  const toggleBtn = document.getElementById("bossFilterToggleBtn");
  if(!dock || !toggleBtn) return;

  toggleBtn.onclick = (e) => {
    e.stopPropagation();
    dock.classList.toggle("open");
  };

  document.addEventListener("click", (e) => {
    if(dock.classList.contains("open") && !dock.contains(e.target)){
      dock.classList.remove("open");
    }
  });
})();

/* =========================
   ✅ TOP BUTTONS
   ========================= */
sortBtn.onclick = () => {
  autoSort = !autoSort;
  sortBtn.textContent = "AUTO SORT: " + (autoSort ? "ON" : "OFF");
  sortBtn.classList.toggle("off", !autoSort);
};

soundBtn.onclick = () => {
  alarmOn = !alarmOn;
  soundBtn.textContent = "ALARM: " + (alarmOn ? "ON" : "SILENT");
  soundBtn.classList.toggle("off", !alarmOn);
};

/* =========================
   ✅ HISTORY
   ========================= */
/* Pull "Boss Name" and "Location" back out of a history entry's raw
   fullName string (e.g. "CH-0 Darkswordsman Jr. - Mystic Peak Hole.").
   Falls back gracefully for older/odd-format entries that don't match
   the "Name - Location" pattern, so history never shows a blank icon
   or a garbled string with no explanation. */
/* Close-up "icon" art for the Kill History avatars specifically.
   The boss-card art (BOSS_LOCATION_ART_MAP / BOSS_BG_MAP) is a full
   scene shot, which crops awkwardly into a small 44px circle — these
   are tighter portrait crops chosen to read clearly at avatar size. */
const BOSS_HISTORY_ICON_MAP = [
  ["Etherial Fist", "Etherial_Fist_Icon.png"],
  ["Darkswordsman Jr.", "Darkswordsman_Icon.png"],
  ["Ninja Knife", "Ninja_Knife_Icon.png"],
];

function getHistoryIcon(name){
  const hit = BOSS_HISTORY_ICON_MAP.find(([key]) => name.includes(key));
  return hit ? hit[1] : null;
}

function parseHistoryEntry(raw){
  const chMatch = raw.match(/CH-(\d+)/);
  const ch = chMatch ? chMatch[1] : "?";

  let rest = raw.replace(/^CH-\d+\s*/, "").trim();
  rest = rest.replace(/\.+$/, "");

  const sepIdx = rest.indexOf(" - ");
  let bossName, location;
  if(sepIdx !== -1){
    bossName = rest.slice(0, sepIdx).trim();
    location = rest.slice(sepIdx + 3).trim();
  } else {
    bossName = rest;
    location = "";
  }

  const bg = getHistoryIcon(bossName) || getBossBg({name: bossName, location});
  const mapIcon = location ? getMapIcon(location) : null;

  return {ch, bossName, location, bg, mapIcon};
}

function renderHistory(items){
  const historyList = document.getElementById("historyList");
  historyList.innerHTML = "";

  if(!items || items.length === 0){
    const empty = document.createElement("div");
    empty.className = "history-item";
    empty.textContent = "No logs yet. Click Killed Now.";
    historyList.appendChild(empty);
    return;
  }

  items.forEach(item => {
    const div = document.createElement("div");
    div.className = "history-item";

    const {ch, bossName, location, bg, mapIcon} = parseHistoryEntry(item.name);
    const avatarStyle = bg ? ` style="background-image:url('${bg}')"` : "";
    const avatarClass = bg ? "history-avatar" : "history-avatar history-avatar--fallback";
    const mapBadge = mapIcon ? `<img class="history-map-badge" src="${mapIcon}" alt="" onerror="this.style.display='none'">` : "";
    const locationRow = location
      ? `<div class="history-location" title="${location}"><span class="rf-icon">📍</span>${location}</div>`
      : `<div class="history-location history-location--unknown"><span class="rf-icon">❓</span>Unknown location</div>`;
    const killedDate = new Date(item.killedAt);

    div.innerHTML = `
      <div class="history-avatar-wrap">
        <div class="${avatarClass}"${avatarStyle}></div>
        ${mapBadge}
      </div>
      <div class="history-info">
        <div class="history-name" title="${bossName}">${bossName}</div>
        ${locationRow}
        <div class="history-ch">CH ${ch}</div>
      </div>
      <div class="history-date">
        ${killedDate.toLocaleDateString([], {month:"short", day:"numeric"})}<br>
        ${killedDate.toLocaleTimeString([], {hour:"2-digit", minute:"2-digit", second:"2-digit"})}
      </div>
    `;
    historyList.appendChild(div);
  });
}

function refreshHistory(){
  db.ref("history").limitToLast(HISTORY_LIMIT).once("value").then(snapshot => {
    const data = snapshot.val();
    if(!data) return renderHistory([]);
    const items = Object.values(data).sort((a,b) => b.killedAt - a.killedAt);
    renderHistory(items);
  });
}

function clearHistory(){
  const pinInput = document.getElementById("pinInput");
  const pinError = document.getElementById("pinError");
  const pin = (pinInput.value || "").trim();

  if(pin !== ADMIN_PIN){
    pinError.style.color = "#a13d2b";
    pinError.textContent = "❌ Wrong PIN";
    return;
  }

  if(!confirm("Clear ALL kill history?")) return;

  db.ref("history").remove().then(() => {
    pinError.style.color = "#8fae6a";
    pinError.textContent = "✅ History Cleared!";
    pinInput.value = "";
  }).catch(() => {
    pinError.style.color = "#a13d2b";
    pinError.textContent = "❌ Error clearing history";
  });
}

db.ref("history").limitToLast(HISTORY_LIMIT).on("value", snapshot => {
  const data = snapshot.val();
  if(!data) return renderHistory([]);
  const items = Object.values(data).sort((a,b) => b.killedAt - a.killedAt);
  renderHistory(items);
});

/* =========================
   ✅ TIMER STORAGE (FIREBASE)
   ========================= */
/* Cache the last known timer data locally so that on a page refresh,
   the tracker immediately shows the last real state instead of
   flashing the empty "---" / "--:--:--" placeholder while waiting for
   Firebase to respond over the network. Firebase remains the source
   of truth — this cache is only used as an instant first paint, and
   gets overwritten the moment Firebase's real "value" event arrives. */
const BOSSES_CACHE_KEY = "cached-bosses-v1";

function loadCachedBosses(){
  try{
    const raw = localStorage.getItem(BOSSES_CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  }catch(e){ return {}; }
}

function saveCachedBosses(data){
  try{ localStorage.setItem(BOSSES_CACHE_KEY, JSON.stringify(data)); }catch(e){}
}

let firebaseBosses = loadCachedBosses();

db.ref("bosses").on("value", snapshot => {
  firebaseBosses = snapshot.val() || {};
  saveCachedBosses(firebaseBosses);
});

/* =========================
   ✅ SET NEXT (MANUAL)
   ========================= */
function setNext(id,mins,k){
  const nextTime = k.getTime() + mins * 60000;
  db.ref("bosses/" + id).set(nextTime);
  alerted[id] = false;
  warnedTenMin[id] = false;
}

/* =========================
   ✅ BUTTON ACTIONS
   ========================= */
function now(id,mins){
  // prevent clicking before server time is ready
  if(!serverReady){
    const pinError = document.getElementById("pinError");
    if(pinError){
      pinError.style.color = "#d9b878";
      pinError.textContent = "⏳ Wait 1 second (syncing server time)...";
      setTimeout(() => { pinError.textContent = ""; }, 1500);
    }
    return;
  }

  const serverNow = Date.now() + serverOffset;
  const nextTime = serverNow + mins * 60000;

  db.ref("bosses/" + id).set(nextTime);
  alerted[id] = false;
  warnedTenMin[id] = false;

  const boss = bosses.find(b => b.id === id);
  db.ref("history").push({
    bossId: id,
    name: boss ? boss.fullName : ("BOSS " + id),
    killedAt: serverNow
  });
}

function manual(id,mins){
  const v = document.getElementById(id + "-input").value;
  if(!v) return alert("Enter time");
  setNext(id, mins, new Date(v));
}

function resetAll(){
  if(!confirm("Reset ALL timers?")) return;
  alerted = {};
  warnedTenMin = {};
  lastBeepSecond = null;
  db.ref("bosses").remove();
}

/* Resets a single boss back to its original "no time set" state —
   used when a card is dragged onto the trash bin. */
function resetBoss(id){
  db.ref("bosses/" + id).remove();
  alerted[id] = false;
  warnedTenMin[id] = false;
  warnedFiveMin[id] = false;
  const input = document.getElementById(id + "-input");
  if(input) input.value = "";
}

/* =========================
   ✅ MAIN UPDATE LOOP
   ========================= */
function update(){
  if(inputLock) return;
  let soonest = null, soonId = null;
  const sortData = [];

  bosses.forEach(b => {
    const t = firebaseBosses[b.id];
    const timer = document.getElementById(b.id + "-timer");
    const next = document.getElementById(b.id + "-next");
    const card = document.getElementById(b.id + "-card");
    card.classList.remove("next");

    if (Object.keys(firebaseBosses).length === 0) {
      document.getElementById("nextBossName").textContent = "---";
      const nextBossLocationEmpty = document.getElementById("nextBossLocation");
      if(nextBossLocationEmpty) nextBossLocationEmpty.textContent = "";
      document.getElementById("nextBossTimer").textContent = "--:--:--";
      document.getElementById("nextBossTime").textContent = "---";
      document.getElementById("nextBossTimer").classList.remove("danger");
      const chBadge = document.getElementById("nextBossChBadge");
      if(chBadge){
        chBadge.innerHTML = '<span class="rf-icon">⏱</span> CH --';
        chBadge.className = "hero-ch-badge";
      }
      const bar = document.getElementById("heroProgressBar");
      if(bar) bar.style.width = "0%";
      const heroArt = document.getElementById("heroArt");
      if(heroArt) heroArt.style.backgroundImage = "none";
      const heroMapIconEmpty = document.getElementById("heroMapIcon");
      if(heroMapIconEmpty) heroMapIconEmpty.style.display = "none";
      setHeroPanelBg(null);
    }

    if (!t) {
      timer.textContent = "--:--:--";
      timer.classList.remove("danger");
      next.textContent = "Next Spawn: --";
      sortData.push({ id: b.id, time: Infinity });
      return;
    }

    // ✅ server-time countdown
    const nowServer = Date.now() + serverOffset;
    const d = t - nowServer;

    if(d <= 0){
      timer.textContent = "SPAWNED!";
      timer.classList.add("danger");
      next.textContent = "NOW";
      warnedTenMin[b.id] = false;
      warnedFiveMin[b.id] = false;
      if(!alerted[b.id]){
        if(alarmOn){
          sound.currentTime = 0;
          sound.play().catch(() => {});
          speak(b.name + " has spawned at " + b.location + ", channel " + b.channel);
        }
        alerted[b.id] = true;
      }
      sortData.push({id:b.id, time:0});
      return;
    }

    if(d <= 10*60*1000 && d > 9*60*1000 && !warnedTenMin[b.id]){
      if(alarmOn){
        sound.currentTime = 0;
        sound.play().catch(() => {});
        setTimeout(() => {
          speak(b.name + " will spawn in 10 minutes at " + b.location + ", channel " + b.channel);
        }, 250);
      }
      warnedTenMin[b.id] = true;
    }

    if(d > 10*60*1000){
      warnedTenMin[b.id] = false;
    }

    if(d <= 5*60*1000 && d > 4*60*1000 && !warnedFiveMin[b.id]){
      if(alarmOn){
        sound.currentTime = 0;
        sound.play().catch(() => {});
        setTimeout(() => {
          speak(b.name + " will spawn in 5 minutes at " + b.location + ", channel " + b.channel);
        }, 250);
      }
      warnedFiveMin[b.id] = true;
    }

    if(d > 5*60*1000){
      warnedFiveMin[b.id] = false;
    }

    sortData.push({id:b.id, time:d});
    if(soonest === null || d < soonest){ soonest = d; soonId = b.id; }

    const hh = String(Math.floor(d/3600000)).padStart(2,"0");
    const mm = String(Math.floor(d%3600000/60000)).padStart(2,"0");
    const ss = String(Math.floor(d%60000/1000)).padStart(2,"0");
    timer.textContent = `${hh}:${mm}:${ss}`;
    next.textContent = "Next: " + formatSpawnTime(new Date(t));

    // This boss's own card turns red once IT is under 5 minutes away —
    // independent of whichever boss is soonest overall in the hero panel.
    if(d <= 5*60*1000){
      timer.classList.add("danger");
    }else{
      timer.classList.remove("danger");
    }
  });

  if(autoSort){
    sortData.sort((a,b) => a.time - b.time);
    const body = document.getElementById("channel-" + BOSS_SECTION_KEY + "-body");
    if(body) sortData.forEach(o => body.appendChild(document.getElementById(o.id + "-card")));
  }

  if(soonId){
    document.getElementById(soonId + "-card").classList.add("next");
    const b = bosses.find(x => x.id === soonId);
    document.getElementById("nextBossName").textContent = b.name;
    const nextBossLocationEl = document.getElementById("nextBossLocation");
    if(nextBossLocationEl) nextBossLocationEl.textContent = b.location || "";
    setHeroPanelBg(b.location);
    document.getElementById("nextBossTimer").textContent = document.getElementById(soonId + "-timer").textContent;

    const chBadge = document.getElementById("nextBossChBadge");
    if(chBadge){
      chBadge.innerHTML = '<span class="rf-icon">⏱</span> CH ' + b.channel;
      chBadge.className = "hero-ch-badge ch-" + b.channel;
    }

    const heroArt = document.getElementById("heroArt");
    if(heroArt){
      const heroBg = getBossBg(b);
      heroArt.style.backgroundImage = heroBg ? `url('${heroBg}')` : "none";
    }

    const heroMapIcon = document.getElementById("heroMapIcon");
    if(heroMapIcon){
      const icon = getMapIcon(b.location);
      if(icon){
        heroMapIcon.src = icon;
        heroMapIcon.style.display = "block";
      }else{
        heroMapIcon.removeAttribute("src");
        heroMapIcon.style.display = "none";
      }
    }

    const bar = document.getElementById("heroProgressBar");
    if(bar){
      const totalMs = b.respawn * 60000;
      const pct = totalMs > 0 ? Math.max(0, Math.min(100, (1 - (soonest / totalMs)) * 100)) : 0;
      bar.style.width = pct + "%";
    }

    const soonTs = firebaseBosses[soonId];
    document.getElementById("nextBossTime").textContent = soonTs
      ? ("Spawns at: " + formatSpawnTime(new Date(soonTs)))
      : "---";

    if(soonest <= 10000 && soonest > 0){
      const sec = Math.ceil(soonest/1000);
      if(lastBeepSecond !== sec){
        if(alarmOn){
          sound.currentTime = 0;
          sound.play().catch(() => {});
        }
        lastBeepSecond = sec;
      }
    }else{ lastBeepSecond = null; }

    if(soonest <= 5*60*1000){
      nextBossTimer.classList.add("danger");
    }else{
      nextBossTimer.classList.remove("danger");
    }
  }
}

setInterval(update, 1000);

/* =========================
   ✅ DRAG-TO-SCROLL (channels wrapper)
   Lets users click+drag left/right to pan between
   channel panels instead of needing a scrollbar —
   handy when the browser window is narrow.
   ========================= */
(function initDragScroll(){
  const wrapper = channelsWrapper;
  if(!wrapper) return;

  const DRAG_THRESHOLD = 6; // px of movement before it counts as a drag, not a click
  let isPointerDown = false;
  let isDragging = false;
  let startX = 0;
  let startScrollLeft = 0;

  function isFormControl(el){
    return el.closest("input, textarea, select, button, .datetime-input, .card-drag-handle");
  }

  wrapper.addEventListener("mousedown", (e) => {
    // Only left-click drags
    if(e.button !== 0) return;

    // If the click started on a button/input/etc, don't track it as a
    // potential drag at all — otherwise normal mouse jitter while clicking
    // (very common with a real mouse) can cross the drag threshold and
    // cause the click to be swallowed by endDrag()'s suppressClick logic,
    // making buttons like "Killed Now" seem to randomly not respond.
    if(isFormControl(e.target)) return;

    isPointerDown = true;
    isDragging = false;
    startX = e.pageX;
    startScrollLeft = wrapper.scrollLeft;

    // Stop the browser's native text-selection drag from starting at all.
    e.preventDefault();
  });

  window.addEventListener("mousemove", (e) => {
    if(!isPointerDown) return;
    const dx = e.pageX - startX;

    if(!isDragging && Math.abs(dx) > DRAG_THRESHOLD){
      isDragging = true;
      wrapper.classList.add("dragging");
    }

    if(isDragging){
      e.preventDefault();
      wrapper.scrollLeft = startScrollLeft - dx;
    }
  });

  function endDrag(){
    if(isDragging){
      wrapper.classList.remove("dragging");
      // Swallow the click that follows a drag so buttons/toggles
      // underneath the cursor don't accidentally fire.
      const suppressClick = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        window.removeEventListener("click", suppressClick, true);
      };
      window.addEventListener("click", suppressClick, true);
      setTimeout(() => window.removeEventListener("click", suppressClick, true), 0);
    }
    isPointerDown = false;
    isDragging = false;
  }

  window.addEventListener("mouseup", endDrag);
  wrapper.addEventListener("mouseleave", (e) => {
    // Only end the drag if the mouse actually left the window area over the wrapper edge,
    // not just moved over a child element (mouseleave on wrapper fires for children too
    // only if relatedTarget is outside wrapper).
    if(!wrapper.contains(e.relatedTarget)) endDrag();
  });

  /* =========================
     ✅ TOUCH SWIPE — same click-and-drag panning, for touchscreens.
     Horizontal swipes pan between channels (like the mouse drag above);
     vertical swipes are left alone so the page/panels scroll natively
     up and down as expected.
     ========================= */
  let touchStartX = 0;
  let touchStartY = 0;
  let touchScrollLeft = 0;
  let touchAxis = null; // "x" | "y" | null (undecided)

  wrapper.addEventListener("touchstart", (e) => {
    if(isFormControl(e.target)) return;
    const t = e.touches[0];
    touchStartX = t.pageX;
    touchStartY = t.pageY;
    touchScrollLeft = wrapper.scrollLeft;
    touchAxis = null;
  }, { passive: true });

  wrapper.addEventListener("touchmove", (e) => {
    if(!e.touches.length) return;
    const t = e.touches[0];
    const dx = t.pageX - touchStartX;
    const dy = t.pageY - touchStartY;

    if(!touchAxis){
      if(Math.abs(dx) < 8 && Math.abs(dy) < 8) return; // not enough movement yet
      touchAxis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if(touchAxis === "x") wrapper.classList.add("dragging");
    }

    if(touchAxis === "x"){
      // Horizontal swipe: pan the channels, and stop the page from
      // scrolling vertically underneath the gesture.
      e.preventDefault();
      wrapper.scrollLeft = touchScrollLeft - dx;
    }
    // touchAxis === "y": do nothing — native vertical scroll takes over.
  }, { passive: false });

  wrapper.addEventListener("touchend", () => {
    wrapper.classList.remove("dragging");
    touchAxis = null;
  });
  wrapper.addEventListener("touchcancel", () => {
    wrapper.classList.remove("dragging");
    touchAxis = null;
  });
})();

/* =========================
   ✅ DRAG-TO-TRASH
   Grabbing a card's ⠿ handle and dropping it on the trash bin (left
   sidebar) resets that boss to its original "no time set" state —
   same as if it had never been killed. Uses Pointer Events so mouse
   and touch both work with one code path.
   ========================= */
(function initCardTrash(){
  const trash = document.getElementById("trashBin");
  if(!trash) return;

  let dragId = null;
  let ghost = null;

  function makeGhost(label){
    const g = document.createElement("div");
    g.className = "drag-ghost";
    g.textContent = label;
    document.body.appendChild(g);
    return g;
  }
  function moveGhost(x, y){
    if(ghost){ ghost.style.left = x + "px"; ghost.style.top = y + "px"; }
  }
  function removeGhost(){
    if(ghost){ ghost.remove(); ghost = null; }
  }
  function isOverTrash(x, y){
    const r = trash.getBoundingClientRect();
    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  }

  function onPointerMove(e){
    if(dragId === null) return;
    moveGhost(e.clientX, e.clientY);
    trash.classList.toggle("drag-over", isOverTrash(e.clientX, e.clientY));
  }

  function onPointerUp(e){
    if(dragId === null) return;
    if(isOverTrash(e.clientX, e.clientY)) resetBoss(dragId);

    const card = document.getElementById(dragId + "-card");
    if(card) card.classList.remove("dragging-source");
    trash.classList.remove("drag-over");
    removeGhost();
    dragId = null;

    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
  }

  document.querySelectorAll(".card-drag-handle").forEach(handle => {
    handle.addEventListener("pointerdown", (e) => {
      // Stop this from also being read as a channel-panning drag, and
      // suppress the compatibility mouse events that would otherwise
      // fire on the wrapper right after.
      e.preventDefault();
      e.stopPropagation();

      const card = handle.closest(".card");
      if(!card) return;
      dragId = card.id.replace(/-card$/, "");
      card.classList.add("dragging-source");

      const nameEl = card.querySelector(".card-name");
      ghost = makeGhost(nameEl ? nameEl.textContent : "Boss");
      moveGhost(e.clientX, e.clientY);

      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
    });
  });
})();

/* =========================
   ✅ POP-UP GUIDE
   ========================= */
(function initGuide(){
  const overlay   = document.getElementById("guideOverlay");
  const helpBtn   = document.getElementById("guideHelpBtn");
  const closeBtn  = document.getElementById("guideCloseBtn");
  const gotItBtn  = document.getElementById("guideGotItBtn");
  const dontShow  = document.getElementById("guideDontShow");
  const STORAGE_KEY = "ran-tracker-guide-dismissed";

  function guideDismissed(){
    try{ return localStorage.getItem(STORAGE_KEY) === "1"; }catch(e){ return false; }
  }
  function setGuideDismissed(v){
    try{ localStorage.setItem(STORAGE_KEY, v ? "1" : "0"); }catch(e){}
  }

  function openGuide(){
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeGuide(){
    overlay.classList.remove("open");
    document.body.style.overflow = "";
    if(dontShow && dontShow.checked) setGuideDismissed(true);
  }

  if(helpBtn) helpBtn.onclick = openGuide;
  if(closeBtn) closeBtn.onclick = closeGuide;
  if(gotItBtn) gotItBtn.onclick = closeGuide;

  // Click outside the modal to close
  if(overlay){
    overlay.addEventListener("click", (e) => {
      if(e.target === overlay) closeGuide();
    });
  }

  // Escape key to close
  document.addEventListener("keydown", (e) => {
    if(e.key === "Escape" && overlay && overlay.classList.contains("open")) closeGuide();
  });

  // Auto-show on first visit only
  if(!guideDismissed()) openGuide();
})();
/* =========================
   ✅ TOP BAR — LIVE CLOCK + SERVER STATUS DOT
   ========================= */
(function initTopBar(){
  const clockEl = document.getElementById("liveClock");
  const dateEl  = document.getElementById("liveDate");
  const dot     = document.getElementById("serverDot");

  function tick(){
    const now = new Date();
    if(clockEl) clockEl.textContent = now.toLocaleTimeString([], { hour12:false });
    if(dateEl)  dateEl.textContent  = now.toLocaleDateString([], { month:"short", day:"numeric", year:"numeric" });
    if(dot)     dot.className = "dot" + (serverReady ? "" : " syncing");
  }
  tick();
  setInterval(tick, 1000);
})();

/* =========================
   ✅ LEFT SIDE NAV — smooth-scroll to sections + active state
   ========================= */
(function initSideNav(){
  const items = document.querySelectorAll("#sideNav .nav-item");
  if(!items.length) return;

  items.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      const target = document.getElementById(targetId);

      items.forEach(i => i.classList.remove("active"));
      btn.classList.add("active");

      // "Settings" opens the respawn filter dropdown instead of just scrolling to it
      if(targetId === "respawnFilterDock"){
        const dock = document.getElementById("respawnFilterDock");
        if(dock) dock.classList.add("open");
      }

      if(target) target.scrollIntoView({ behavior:"smooth", block:"start" });
    });
  });
})();
