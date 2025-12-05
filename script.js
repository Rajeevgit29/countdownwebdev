
const input = document.getElementById("secondsInput");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const permBtn = document.getElementById("permBtn");
const display = document.getElementById("display");
const ringFg = document.querySelector(".ring-fg");


let total = 0;
let remaining = 0;
let interval = null;
let running = false;


const RADIUS = 52;
const CIRC = 2 * Math.PI * RADIUS;
ringFg.style.strokeDasharray = CIRC;

let ctx = null;
function beep() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.frequency.value = 550;
  osc.type = "square";
  gain.gain.value = 0.1;

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  setTimeout(() => osc.stop(), 250);
}


function format(sec) {
  sec = Math.max(0, Math.floor(sec));
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}


function updateDisplay() {
  display.textContent = format(remaining);
  const progress = (remaining / total) * CIRC;
  ringFg.style.strokeDashoffset = CIRC - progress;
}


function notify() {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("Timer finished");
  }
  beep();
}


startBtn.onclick = () => {
  if (running) return;
  const val = parseInt(input.value);

  if (!val || val <= 0) {
    alert("Enter a valid number.");
    return;
  }

  total = remaining = val;
  updateDisplay();

  interval = setInterval(() => {
    remaining--;
    updateDisplay();
    if (remaining <= 0) {
      clearInterval(interval);
      running = false;
      updateButtons();
      notify();
    }
  }, 1000);

  running = true;
  updateButtons();
};

pauseBtn.onclick = () => {
  if (!running) return;
  clearInterval(interval);
  running = false;
  updateButtons();
};

resetBtn.onclick = () => {
  clearInterval(interval);
  running = false;
  remaining = total;
  updateDisplay();
  updateButtons();
};

permBtn.onclick = () => {
  if ("Notification" in window)
    Notification.requestPermission();
};


function updateButtons() {
  startBtn.disabled = running;
  pauseBtn.disabled = !running;
  resetBtn.disabled = running || remaining === 0 || remaining === total;
}

updateDisplay();
updateButtons();