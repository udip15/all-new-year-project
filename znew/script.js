// --- Page Element & Skip Button ---
const countdownPage = document.getElementById("countdown-page");
const animationPage = document.getElementById("animation-page");
const skipButton = document.getElementById("skip-button");

// --- Countdown Variables ---
let dayBox = document.getElementById("day-box");
let hrBox = document.getElementById("hr-box");
let minBox = document.getElementById("min-box");
let secBox = document.getElementById("sec-box");

// Target date set explicitly to NPT (UTC/GMT +05:45 hrs). 
// This is the correct, fixed point in time corresponding to the link you provided.
let endDate = new Date("2026-01-01T00:00:00+05:45");
let endTime = endDate.getTime();
let countdownInterval;

// --- Fireworks Variables ---
var c = document.getElementById("Canvas");
var ctx = c.getContext("2d");
var cwidth, cheight;
var shells = [];
var pass = [];
var colors = ['#FF5252', '#FF4081', '#E040FB', '#7C4DFF', '#536DFE', '#448AFF', '#40C4FF', 'rgb(247, 0, 255)', '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41', '#FFFF00', '#FFD740', '#FFAB40', '#FF6E40'];


// --- Page Switching Logic ---
function showAnimationPage() {
    // 1. Stop the countdown
    clearInterval(countdownInterval);

    // 2. Hide countdown page and show animation page
    countdownPage.classList.add('hidden');
    animationPage.classList.remove('hidden');

    // 3. Start the fireworks animation (canvas)
    resetCanvas();
    Run();
}

// Event listener for the skip button
skipButton.addEventListener('click', showAnimationPage);


// --- Countdown Functions ---

function countdown() {
    let todayDate = new Date();
    let todayTime = todayDate.getTime();
    let remainingTime = endTime - todayTime;
    let oneMin = 60 * 1000;
    let oneHr = 60 * oneMin;
    let oneDay = 24 * oneHr;

    let addZeroes = (num) => (num < 10 ? `0${num}` : num);

    if (remainingTime <= 0) {
        // Countdown finished, show the animation page
        showAnimationPage();
        document.querySelector(
            ".countdown"
        ).innerHTML = `<h1>Happy New Year!</h1>`;
    } else {
        let daysLeft = Math.floor(remainingTime / oneDay);
        let hrsLeft = Math.floor((remainingTime % oneDay) / oneHr);
        let minsLeft = Math.floor((remainingTime % oneHr) / oneMin);
        let secsLeft = Math.floor((remainingTime % oneMin) / 1000);

        dayBox.textContent = addZeroes(daysLeft);
        hrBox.textContent = addZeroes(hrsLeft);
        minBox.textContent = addZeroes(minsLeft);
        secBox.textContent = addZeroes(secsLeft);
    }
}

// Start the countdown
countdownInterval = setInterval(countdown, 1000);
countdown();


// --- Fireworks Functions ---

window.onresize = function() { resetCanvas(); }

function resetCanvas() {
    cwidth = window.innerWidth;
    cheight = window.innerHeight;
    c.width = cwidth;
    c.height = cheight;
}

function newShell() {
    var left = (Math.random() > 0.5);
    var shell = {};
    shell.x = (1 * left);
    shell.y = 1;
    shell.xoff = (0.01 + Math.random() * 0.007) * (left ? 1 : -1);
    shell.yoff = 0.01 + Math.random() * 0.007;
    shell.size = Math.random() * 6 + 3;
    shell.color = colors[Math.floor(Math.random() * colors.length)];
    shells.push(shell);
}

function newPass(shell) {
    var pasCount = Math.ceil(Math.pow(shell.size, 2) * Math.PI);
    for (i = 0; i < pasCount; i++) {
        var pas = {};
        pas.x = shell.x * cwidth;
        pas.y = shell.y * cheight;
        var a = Math.random() * 4;
        var s = Math.random() * 10;
        pas.xoff = s * Math.sin((5 - a) * (Math.PI / 2));
        pas.yoff = s * Math.sin(a * (Math.PI / 2));
        pas.color = shell.color;
        pas.size = Math.sqrt(shell.size);
        if (pass.length < 1000) { pass.push(pas); }
    }
}

var lastRun = 0;

function Run() {
    if (animationPage.classList.contains('hidden')) return;

    var dt = 1;
    if (lastRun != 0) { dt = Math.min(50, (performance.now() - lastRun)); }
    lastRun = performance.now();

    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(0, 0, cwidth, cheight);

    if ((shells.length < 10) && (Math.random() > 0.96)) { newShell(); }

    for (let ix in shells) {
        var shell = shells[ix];
        ctx.beginPath();
        ctx.arc(shell.x * cwidth, shell.y * cheight, shell.size, 0, 2 * Math.PI);
        ctx.fillStyle = shell.color;
        ctx.fill();
        shell.x -= shell.xoff;
        shell.y -= shell.yoff;
        shell.xoff -= (shell.xoff * dt * 0.001);
        shell.yoff -= ((shell.yoff + 0.2) * dt * 0.00005);
        if (shell.yoff < -0.005) {
            newPass(shell);
            shells.splice(ix, 1);
        }
    }

    for (let ix in pass) {
        var pas = pass[ix];
        ctx.beginPath();
        ctx.arc(pas.x, pas.y, pas.size, 0, 2 * Math.PI);
        ctx.fillStyle = pas.color;
        ctx.fill();
        pas.x -= pas.xoff;
        pas.y -= pas.yoff;
        pas.xoff -= (pas.xoff * dt * 0.001);
        pas.yoff -= ((pas.yoff + 5) * dt * 0.0005);
        pas.size -= (dt * 0.002 * Math.random())
        if ((pas.y > cheight) || (pas.y < -50) || (pas.size <= 0)) {
            pass.splice(ix, 1);
        }
    }
    requestAnimationFrame(Run);
}