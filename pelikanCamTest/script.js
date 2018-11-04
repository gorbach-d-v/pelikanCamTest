const tab1Button = document.querySelector("#tab1-btn");
const tab2Button = document.querySelector("#tab2-btn");
const tab1 = document.querySelector(".tab1");
const tab2 = document.querySelector(".tab2");
const theTimer = document.querySelector(".timer");
const redDot = document.querySelector(".diod");
const startButton = document.querySelector("#start-btn");
const stopButton = document.querySelector("#stop-btn");
const resetButton = document.querySelector("#reset-btn");

const chbRed = document.querySelector("#chb-red");
const chbBeep = document.querySelector("#chb-beep");
const chbVoice = document.querySelector("#chb-voice");
const setVoiceArea = document.querySelector("#set-input");
const setVoiceButton = document.querySelector("#set-btn");

const startFreezeButton = document.querySelector("#start-freeze");
const bounce = document.querySelector(".bounce");
const setFreezeArea = document.querySelector(".freeze-time");
const setFreezeButton = document.querySelector("#set-freeze-time");

var interval;
var interval1;

var timer = [0,0,0,0];
var isRunning = false;
var redCntrl = false;
var beepCntrl = true;
var voiceCntrl = false;
var voicePause = 5;
var freezeDuration = 2;
var currentTab = tab1;
var currentTabButton = tab1Button;
var ballFlying = false;
var hardStop = false;


function tabListen(index){
  currentTab.setAttribute("hidden",true);
  if (index == 1) {
    currentTab = tab1;
  } else {
    currentTab = tab2;
  }
  currentTab.removeAttribute("hidden");

  currentTabButton.removeAttribute("disabled");
  currentTabButton.classList.toggle("active");
  if (index == 1) {
    currentTabButton = tab1Button;
  } else {
    currentTabButton = tab2Button;
  }
  currentTabButton.setAttribute("disabled",true);
  currentTabButton.classList.toggle("active");
}

function runTimer(){
  timer[3]++;

  timer[0] = Math.floor((timer[3]/60)/60);
  timer[1] = Math.floor((timer[3]/60) - (timer[0]*60));
  timer[2] = Math.floor((timer[3]) - (timer[1]*60) - (timer[0]*3600));

  let currentTime = loadingZero(timer[0]) + ":" + loadingZero(timer[1]) + ":" + loadingZero(timer[2]);
  theTimer.innerHTML = currentTime;
}

function loadingZero(time){
  if (time <= 9){
    time = "0" + time;
  }
  return time;
}

function runRedDot(){
  let startt = Date.now();
  let timerr = setInterval(function() {
    let timePassed = Date.now() - startt;
    if (timePassed >= 500) {
      redDot.style.opacity= 0;
      clearInterval(timerr);
      return;
    }
    redDot.style.opacity = timePassed / 5;
  }, 20);
}

function runSound(){
  if (!voiceCntrl || ((timer[3] % voicePause) !== 0)){
    peep11 = new newAudio("sounds/beep1.wav");
    peep11.play();
  }
}

function runVoice(){
  if ((timer[3] % voicePause) === 0){
    if (timer[2] < 21){
      curTimeSound = new newAudio("sounds/" + timer[2] + ".wav","time");
      curTimeSound.play();
    } else {
      curTimeSound1 = new newAudio("sounds/" + (Math.floor(timer[2]/10)) + "0.wav","time");
      curTimeSound2 = new newAudio("sounds/" + (timer[2] % 10) + ".wav","time");
      curTimeSound1.play();
      curTimeSound1.addEventListener("ended",function(){
        if (timer[2] % 10 !== 0){
          curTimeSound2.play();
        }
      },false);
    }
  }
}

function newAudio(src,type=null) {
  var audio = new Audio();
  audio.src = src;
  if (type == "time"){
    audio.playbackRate = 1.6;
  }
  return audio;
}

function start(){
  if (!isRunning){
    startButton.classList.toggle("disabled");
    stopButton.classList.toggle("disabled");
    isRunning = true;
    interval = setInterval(period, 1000);
  }
}

function period(){
  runTimer();
  if (redCntrl){
    runRedDot();
  }
  if (beepCntrl){
    runSound();
  }
  if (voiceCntrl){
    runVoice();
  }
}

function stop(){
  clearInterval(interval);
  interval = null;

  isRunning = false;

  stopButton.classList.toggle("disabled");
  startButton.setAttribute("value","Resume");
  startButton.classList.toggle("disabled");
  console.log(1);
}

function reset(){
  clearInterval(interval);
  interval = null;

  timer = [0,0,0,0];
  isRunning = false;

  startButton.setAttribute("value","Start");
  startButton.classList.remove("disabled");
  stopButton.classList.add("disabled");
  theTimer.innerHTML = "00:00:00";
}

function chbControl(chb){
  if (chb == "red") {
    redCntrl =!redCntrl;
  }
  if (chb == "beep") {
    beepCntrl =!beepCntrl;
  }
  if (chb == "voice") {
    voiceCntrl =!voiceCntrl;
  }
}

function setVoiceCheck(){
  let newValue = setVoiceArea.value;
  if (newValue == voicePause){
    setVoiceArea.classList.remove("area-warn");
    setVoiceArea.classList.remove("area-info");
    setVoiceArea.classList.add("area-ok");
    setVoiceButton.classList.add("disabled");
  } else if (newValue === "" ) {
    setVoiceArea.classList.remove("area-ok");
    setVoiceArea.classList.remove("area-info");
    setVoiceArea.classList.add("area-warn");
    setVoiceButton.classList.add("disabled");
  } else{
    setVoiceArea.classList.remove("area-ok");
    setVoiceArea.classList.remove("area-warn");
    setVoiceArea.classList.add("area-info");
    setVoiceButton.classList.remove("disabled");
  }
}

function setVoice(){
  let newValue = setVoiceArea.value;
  voicePause = newValue;
  setVoiceButton.classList.add("disabled");
  setVoiceArea.classList.remove("area-info");
  setVoiceArea.classList.add("area-ok");
}


function runFreezeDot(duration){
  let startTime = Date.now();
  let timerInterval = setInterval(function() {
    if (hardStop) {
      clearInterval(timerInterval);
      bounce.style.left = 0;
      return;
    }
    let timePassed = Date.now() - startTime;
    if (timePassed >= duration * 2) {
      clearInterval(timerInterval);
      return;
    }
    if (timePassed < (duration + 1)) {
      bounce.style.left = "calc(" + timePassed / (duration / 100) + "% - " + timePassed / (duration / 2) + "rem)";
    } else {
      bounce.style.left = "calc(" + (duration * 2 - timePassed) / (duration / 100) + "% - " + (duration * 2 - timePassed) / (duration / 2) + "rem)";
    }
  }, 5);
}

function freezeController(){
  if (ballFlying === false) {
    setFreezeButton.classList.add("disabled");
    startFreezeButton.setAttribute("value","Stop");
    ballFlying = true;
    runFreezeDot(freezeDuration*1000);
    interval1 = setInterval(function() { runFreezeDot(freezeDuration*1000); }, freezeDuration*2000);
  } else {
    setFreezeButton.classList.remove("disabled");
    startFreezeButton.classList.add("disabled");
    hardStop = true;
    startFreezeButton.setAttribute("value","Start");
    clearInterval(interval1);
    ballFlying=false;
    setTimeout(function () {
      hardStop = false;
      startFreezeButton.classList.remove("disabled");
    }, 500);
  }
}

function setFreezeCheck(){
  let newValue = setFreezeArea.value;
  if (newValue == freezeDuration){
    setFreezeArea.classList.remove("area-warn");
    setFreezeArea.classList.remove("area-info");
    setFreezeArea.classList.add("area-ok");
    setFreezeButton.classList.remove("null-value");
  } else if (newValue === "" ) {
    setFreezeArea.classList.remove("area-ok");
    setFreezeArea.classList.remove("area-info");
    setFreezeArea.classList.add("area-warn");
    setFreezeButton.classList.add("null-value");
  } else{
    setFreezeArea.classList.remove("area-ok");
    setFreezeArea.classList.remove("area-warn");
    setFreezeArea.classList.add("area-info");
    setFreezeButton.classList.remove("null-value");
  }
}

function setFreeze(){
  let newValue = setFreezeArea.value;
  freezeDuration = newValue;
  setFreezeArea.classList.remove("area-info");
  setFreezeArea.classList.add("area-ok");
}

tab1Button.addEventListener("click", function() { tabListen(1); }, false);
tab2Button.addEventListener("click", function() { tabListen(2); }, false);
startButton.addEventListener("click", start, false);
stopButton.addEventListener("click", stop, false);
resetButton.addEventListener("click", reset, false);
chbRed.addEventListener("click",function() { chbControl("red"); },false);
chbBeep.addEventListener("click",function() { chbControl("beep"); },false);
chbVoice.addEventListener("click",function() { chbControl("voice"); },false);
setVoiceArea.addEventListener("keyup",setVoiceCheck,false);
setVoiceButton.addEventListener("click",setVoice,false);

startFreezeButton.addEventListener("click",freezeController, false);
setFreezeArea.addEventListener("keyup",setFreezeCheck, false);
setFreezeButton .addEventListener("click",setFreeze, false);
