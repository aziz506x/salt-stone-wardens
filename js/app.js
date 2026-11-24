import { initialState } from "./data.js";

const $ = (s) => document.querySelector(s);
const clone = (v) => JSON.parse(JSON.stringify(v));
let state;
let saveTimer;
let toastTimer;

function openDatabase() {
  return new Promise((resolve) => {
    if (!("indexedDB" in window)) return resolve(null);
    const request = indexedDB.open("SaltStoneWardens", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("saves");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve(null);
  });
}
let db;
async function loadState() {
  db = await openDatabase();
  if (db) {
    const value = await new Promise(resolve => {
      const req = db.transaction("saves","readonly").objectStore("saves").get("main");
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
    if (value) return value;
  }
  try {
    const raw = localStorage.getItem("ssw-save");
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
async function persist() {
  state.lastSavedAt = Date.now();
  const snapshot = clone(state);
  if (db) await new Promise(resolve => {
    const tx = db.transaction("saves","readwrite");
    tx.objectStore("saves").put(snapshot,"main");
    tx.oncomplete = resolve; tx.onerror = resolve;
  });
  try { localStorage.setItem("ssw-save", JSON.stringify(snapshot)); } catch {}
  $("#saveStatus").textContent = "Saved locally";
}
function logEvent(title, body) {
  const day = Math.floor(state.gameMinutes / 1440) + 1;
  const minute = state.gameMinutes % 1440;
  const hh = String(Math.floor(minute/60)).padStart(2,"0");
  const mm = String(minute%60).padStart(2,"0");
  state.chronicle.unshift({day,time:`${hh}:${mm}`,title,body});
  state.chronicle = state.chronicle.slice(0,40);
}
function formatClock() {
  const day = Math.floor(state.gameMinutes / 1440) + 1;
  const minute = state.gameMinutes % 1440;
  const hh = String(Math.floor(minute/60)).padStart(2,"0");
  const mm = String(minute%60).padStart(2,"0");
  $("#dateLabel").textContent = `Day ${day} · ${day===1?"First Thaw":"The Long Vigil"}`;
  $("#timeLabel").textContent = `${hh}:${mm}`;
  $("#speedLabel").textContent = state.speed===0 ? "PAUSED" : state.speed===1 ? "NORMAL" : "FAST";
}
function renderResources() {
  const items = [["silver","◈","SILVER"],["food","✣","PROVISIONS"],["medicine","✚","MEDICINE"],["timber","⌁","TIMBER"],["stone","▧","STONE"]];
  $("#resourceStrip").innerHTML = items.map(([key,icon,label])=>`<div class="resource"><span class="resource-label"><span class="resource-icon">${icon}</span>${label}</span><strong class="resource-value">${state.resources[key]}</strong></div>`).join("");
}
function renderBastion() {
  $("#bastionStats").innerHTML = [
    ["COMPANY MORALE",`${state.company.morale}%`],["REPUTATION",state.company.reputation],["ACTIVE PERSONNEL",state.characters.length]
  ].map(([a,b])=>`<div class="stat-card"><span>${a}</span><strong>${b}</strong></div>`).join("");
  $("#facilityGrid").innerHTML = state.facilities.map(f=>`<article class="facility-card"><span class="level">LVL ${f.level}</span><div class="facility-icon">${f.icon}</div><h3>${f.name}</h3><p>${f.description}</p></article>`).join("");
}
function renderCompany() {
  $("#companySummary").innerHTML = `<div class="summary-chip"><span>ROSTER</span><strong>${state.characters.length} / 12</strong></div><div class="summary-chip"><span>COMPANY MORALE</span><strong>${state.company.morale}%</strong></div><div class="summary-chip"><span>REPUTATION</span><strong>${state.company.reputation}</strong></div>`;
  $("#characterList").innerHTML = state.characters.map(c=>`<article class="character-card" data-character="${c.id}"><div class="portrait">${c.name.split(" ").map(x=>x[0]).join("")}</div><div class="character-info"><h3>${c.name}</h3><p>${c.role} · ${c.archetype}</p></div><div class="character-traits"><strong>${c.level}</strong><span>LEVEL</span></div></article>`).join("");
  document.querySelectorAll("[data-character]").forEach(el=>el.addEventListener("click",()=>showCharacter(el.dataset.character)));
}
function renderWorld() {
  $("#factionList").innerHTML = state.factions.map(f=>`<article class="faction-card"><div class="faction-sigil">${f.symbol}</div><div><strong>${f.name}</strong><p>${f.description}</p></div><span class="faction-status">${f.status}</span></article>`).join("");
}
function renderChronicle() {
  $("#chronicleList").innerHTML = state.chronicle.map(e=>`<article class="chronicle-entry"><div class="chronicle-time">DAY ${e.day}<br>${e.time}</div><div><strong>${e.title}</strong><p>${e.body}</p></div></article>`).join("");
}
function render() {
  formatClock(); renderResources(); renderBastion(); renderCompany(); renderWorld(); renderChronicle();
}
function showCharacter(id) {
  const c = state.characters.find(x=>x.id===id); if(!c) return;
  $("#characterDetail").innerHTML = `<div class="eyebrow">COMPANY PERSONNEL · PERSONNEL FILE</div><div class="character-detail-head"><div class="portrait">${c.name.split(" ").map(x=>x[0]).join("")}</div><div><h2>${c.name}</h2><p>${c.role} · ${c.archetype}</p></div></div><p class="modal-copy">${c.bio}</p><div class="detail-grid">${[["LEVEL",c.level],["EXPERIENCE",`${c.xp} XP`],["HEALTH",`${c.health}%`],["MORALE",`${c.morale}%`],["STRENGTH",c.strength],["AGILITY",c.agility],["INTELLECT",c.intellect],["RESOLVE",c.resolve],["PERSONALITY",c.trait]].map(([a,b])=>`<div class="detail-stat"><span>${a}</span><strong>${b}</strong></div>`).join("")}</div>`;
  $("#characterDialog").showModal();
}
function toast(message) {
  const el=$("#toast"); el.textContent=message; el.classList.add("show");
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove("show"),2200);
}
function setSpeed(speed) {
  state.speed=Number(speed); formatClock(); persist();
  document.querySelectorAll("[data-speed]").forEach(b=>b.classList.toggle("selected",Number(b.dataset.speed)===state.speed));
}
function navigate(view) {
  document.querySelectorAll(".view").forEach(el=>el.classList.toggle("active",el.id===`view-${view}`));
  document.querySelectorAll(".nav-item").forEach(el=>el.classList.toggle("active",el.dataset.view===view));
  window.scrollTo({top:0,behavior:"smooth"});
}
function recruit() {
  if(state.characters.length>=12) return toast("The barracks are at capacity.");
  if(state.resources.silver<30 || state.resources.food<5) return toast("Insufficient silver or provisions.");
  const names=["Tomas Reed","Elira Fen","Bram Holt","Nessa Crow","Orrin Marsh","Vey Ansel"];
  const used=new Set(state.characters.map(c=>c.name));
  const name=names.find(n=>!used.has(n)) || `Warden ${state.characters.length+1}`;
  state.resources.silver-=30; state.resources.food-=5;
  state.characters.push({id:`recruit-${Date.now()}`,name,role:"New Recruit",archetype:"Unproven · Resolute",level:1,xp:0,health:100,morale:70,strength:10,agility:10,intellect:9,resolve:10,trait:"Unproven",bio:"A new arrival at Stonewake Bastion. Their story will be shaped by the company and the dangers ahead."});
  state.company.morale=Math.min(100,state.company.morale+1);
  logEvent("A new recruit arrives",`${name} joins the Salt Stone Wardens. Thirty silver and five provisions were spent on recruitment.`);
  render(); persist(); toast(`${name} has joined the company.`);
}
function tick() {
  if(state.speed===0) return;
  state.gameMinutes += state.speed;
  renderClockOnly();
}
function renderClockOnly(){formatClock();}
async function init() {
  const saved=await loadState();
  state=saved || clone(initialState);
  const elapsed=Math.max(0,Math.min(86400,(Date.now()-(state.lastSavedAt||Date.now()))/1000));
  if(saved && state.speed!==0 && elapsed>60) {
    state.gameMinutes += elapsed * state.speed;
    logEvent("The hours pass",`The company endured ${Math.floor(elapsed/3600)} real hours of elapsed time while away.`);
  }
  state.lastSavedAt=Date.now();
  render();
  document.querySelectorAll(".nav-item").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.view)));
  $("#recruitButton").addEventListener("click",recruit);
  $("#settingsButton").addEventListener("click",()=>$("#settingsDialog").showModal());
  $("#fortressDetails").addEventListener("click",()=>toast("Fortress records will expand in a later milestone."));
  document.querySelectorAll("[data-speed]").forEach(b=>b.addEventListener("click",()=>setSpeed(b.dataset.speed)));
  $("#exportSave").addEventListener("click",()=>{
    const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob); const a=document.createElement("a");
    a.href=url;a.download="salt-stone-wardens-save.json";a.click();URL.revokeObjectURL(url);toast("Save backup exported.");
  });
  $("#importSave").addEventListener("change",async e=>{
    const file=e.target.files[0];if(!file)return;
    try{const parsed=JSON.parse(await file.text());if(!parsed.version||!parsed.resources||!parsed.characters)throw Error("Invalid save");
      state=parsed;state.lastSavedAt=Date.now();render();await persist();toast("Save imported successfully.");
    }catch{toast("That save file could not be imported.");} e.target.value="";
  });
  setInterval(tick,1000);
  saveTimer=setInterval(()=>persist(),10000);
  document.addEventListener("visibilitychange",()=>{if(document.hidden)persist();});
  window.addEventListener("beforeunload",()=>persist());
  if("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("./service-worker.js").catch(()=>{});
  await persist();
}
init();
