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
const bounce = [document.querySelector(".bounce-1 .bounce"), document.querySelector(".bounce-2 .bounce")];
const setFreezeArea = [document.querySelector(".bounce-1 .freeze-time"), document.querySelector(".bounce-2 .freeze-time")];
const setFreezeButton = [document.querySelector(".bounce-1 .set-btn"), document.querySelector(".bounce-2 .set-btn")];


var interval;
var freezeInterval = [];

var currentTab = tab1;
var currentTabButton = tab1Button;
var timer = [0,0,0,0];
var isRunning = false;
var redCntrl = false;
var beepCntrl = true;
var voiceCntrl = false;
var voicePause = 5;

var freezeDuration = [2, 2];
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

function freezeStart(){
  if (ballFlying === false) {
    freezeController(0,"start");
    freezeController(1,"start");
    ballFlying = true;
  } else {
    hardStop = true;
    freezeController(0,"stop");
    freezeController(1,"stop");
    ballFlying=false;
    setTimeout(function () {
      hardStop = false;
      startFreezeButton.classList.remove("disabled");
    }, 500);
  }
}

function freezeController(index,part){
  if (part == "start") {
    setFreezeButton[index].classList.add("disabled");
    startFreezeButton.setAttribute("value","Stop");
    runFreezeDot(freezeDuration[index]*1000,index);
    freezeInterval[index] = setInterval(function() { runFreezeDot(freezeDuration[index]*1000,index); }, freezeDuration[index]*2000);
  } else {
    setFreezeButton[index].classList.remove("disabled");
    startFreezeButton.classList.add("disabled");
    startFreezeButton.setAttribute("value","Start");
    clearInterval(freezeInterval[index]);
  }
}

function runFreezeDot(duration,index){
  let startTime = Date.now();
  let timerInterval = setInterval(function() {
    if (hardStop) {
      clearInterval(timerInterval);
      bounce[index].style.left = 0;
      return;
    }
    let timePassed = Date.now() - startTime;
    if (timePassed >= duration * 2) {
      clearInterval(timerInterval);
      return;
    }
    if (timePassed < (duration + 1)) {
      bounce[index].style.left = "calc(" + timePassed / (duration / 100) + "% - " + timePassed / (duration / 2) + "rem)";
    } else {
      bounce[index].style.left = "calc(" + (duration * 2 - timePassed) / (duration / 100) + "% - " + (duration * 2 - timePassed) / (duration / 2) + "rem)";
    }
  }, 5);
}

function setFreezeCheck(index){
  let newValue = setFreezeArea[index].value;
  if (newValue == freezeDuration[index]){
    setFreezeArea[index].classList.remove("area-warn");
    setFreezeArea[index].classList.remove("area-info");
    setFreezeArea[index].classList.add("area-ok");
    setFreezeButton[index].classList.remove("null-value");
  } else if (newValue === "" ) {
    setFreezeArea[index].classList.remove("area-ok");
    setFreezeArea[index].classList.remove("area-info");
    setFreezeArea[index].classList.add("area-warn");
    setFreezeButton[index].classList.add("null-value");
  } else{
    setFreezeArea[index].classList.remove("area-ok");
    setFreezeArea[index].classList.remove("area-warn");
    setFreezeArea[index].classList.add("area-info");
    setFreezeButton[index].classList.remove("null-value");
  }
}

function setFreeze(index){
  let newValue = setFreezeArea[index].value;
  freezeDuration[index] = newValue;
  setFreezeArea[index].classList.remove("area-info");
  setFreezeArea[index].classList.add("area-ok");
}

function newBounce(){
  bounce.push();
  setFreezeArea.push();
  setFreezeButton.push();
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

startFreezeButton.addEventListener("click",freezeStart, false);
setFreezeArea[0].addEventListener("keyup",function() { setFreezeCheck(0); }, false);
setFreezeButton[0] .addEventListener("click",function() { setFreeze(0); }, false);
setFreezeArea[1].addEventListener("keyup",function() { setFreezeCheck(1); }, false);
setFreezeButton[1] .addEventListener("click",function() { setFreeze(1); }, false);
