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
const addBounceButton = document.querySelector("#add-bounce");
var bounceMap = new Map();
var setFreezeAreaMap = new Map();
var setFreezeButtonMap = new Map();
var freezeSpeedMap = new Map();
bounceMap.set(0,document.querySelector(".bounce-1 .bounce"));
setFreezeAreaMap.set(0,document.querySelector(".bounce-1 .freeze-time"));
setFreezeButtonMap.set(0,document.querySelector(".bounce-1 .set-btn"));
freezeSpeedMap.set(0,50);

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

var bounceIndex = 0;
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
    addBounceButton.classList.add("disabled");
    for (var key of bounceMap.keys()) {
      freezeController(key,"start");
    }
    ballFlying = true;
  } else {
    hardStop = true;
    for (var key of bounceMap.keys()) {
      freezeController(key,"stop");
    }
    ballFlying=false;
    setTimeout(function () {
      hardStop = false;
      addBounceButton.classList.remove("disabled");
      startFreezeButton.classList.remove("disabled");
    }, 500);
  }
}

function freezeController(index,part){
  if (part == "start") {
    setFreezeButtonMap.get(index).classList.add("disabled");
    startFreezeButton.setAttribute("value","Stop");
    runFreezeDot(freezeSpeedMap.get(index),index);
    freezeInterval[index] = setInterval(function() { runFreezeDot(freezeSpeedMap.get(index),index); }, (2*1000*100/freezeSpeedMap.get(index)));
  } else {
    setFreezeButtonMap.get(index).classList.remove("disabled");
    startFreezeButton.classList.add("disabled");
    startFreezeButton.setAttribute("value","Start");
    clearInterval(freezeInterval[index]);
  }
}

function runFreezeDot(speed,index){
  let startTime = Date.now();
  let timerInterval = setInterval(function() {
    if (hardStop) {
      clearInterval(timerInterval);
      bounceMap.get(index).style.left = 0;
      return;
    }
    let timePassed = Date.now() - startTime;
    if (timePassed >= (2*1000*100/speed)) {
      clearInterval(timerInterval);
      return;
    }

    if (timePassed < (1000*100/speed)) {
      let mult = (timePassed / 1000) * (speed / 100);
      bounceMap.get(index).style.left = "calc(" + (100 * mult) + "% - " + (2 * mult) + "rem)";
    } else {
      let mult = ((timePassed - (1000*100/speed)) / 1000) * (speed / 100);
      bounceMap.get(index).style.left = "calc(" + (100 * (1 - mult)) + "% - " + (2 * (1 - mult)) + "rem)";
    }
  }, 5);
}

function setFreezeCheck(index){
  let newValue = setFreezeAreaMap.get(index).value;
  if (newValue == freezeSpeedMap.get(index)){
    setFreezeAreaMap.get(index).classList.remove("area-warn");
    setFreezeAreaMap.get(index).classList.remove("area-info");
    setFreezeAreaMap.get(index).classList.add("area-ok");
    setFreezeButtonMap.get(index).classList.remove("null-value");
  } else if (newValue === "" ) {
    setFreezeAreaMap.get(index).classList.remove("area-ok");
    setFreezeAreaMap.get(index).classList.remove("area-info");
    setFreezeAreaMap.get(index).classList.add("area-warn");
    setFreezeButtonMap.get(index).classList.add("null-value");
  } else{
    setFreezeAreaMap.get(index).classList.remove("area-ok");
    setFreezeAreaMap.get(index).classList.remove("area-warn");
    setFreezeAreaMap.get(index).classList.add("area-info");
    setFreezeButtonMap.get(index).classList.remove("null-value");
  }
}

function setFreeze(index){
  let newValue = setFreezeAreaMap.get(index).value;
  freezeSpeedMap.set(index,newValue);
  console.log(freezeSpeedMap);
  setFreezeAreaMap.get(index).classList.remove("area-info");
  setFreezeAreaMap.get(index).classList.add("area-ok");
}

function newBounce(){
  bounceIndex++;

  Element.prototype.appendBefore = function (element) {
      element.parentNode.insertBefore(this, element);
  }, false;
  var NewElement = document.createElement('div');
  NewElement.className = 'bounce-zone bounce-' + (bounceIndex + 1);
  NewElement.innerHTML = '<div class="bounce"></div><span class="duration-text">Time duration, % / s</span><input class="freeze-time" type="text" value="50" oninput="this.value = this.value.replace(/\\D|^[0]/g, \'\')"/> <input class="btn set-btn" type="button" value="Set"/>';
  NewElement.appendBefore(document.querySelector(".add-bounce-btn"));

  bounceMap.set(bounceIndex,document.querySelector(".bounce-" + (bounceIndex + 1) + " .bounce"));
  setFreezeAreaMap.set(bounceIndex,document.querySelector(".bounce-" + (bounceIndex + 1) + " .freeze-time"));
  setFreezeButtonMap.set(bounceIndex,document.querySelector(".bounce-" + (bounceIndex + 1) + " .set-btn"));
  freezeSpeedMap.set(bounceIndex,50);
  setFreezeAreaMap.get(bounceIndex).addEventListener("keyup",function() { setFreezeCheck(bounceIndex); }, false);
  setFreezeButtonMap.get(bounceIndex).addEventListener("click",function() { setFreeze(bounceIndex); }, false);
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
setFreezeAreaMap.get(0).addEventListener("keyup",function() { setFreezeCheck(0); }, false);
setFreezeButtonMap.get(0).addEventListener("click",function() { setFreeze(0); }, false);
addBounceButton.addEventListener("click",newBounce, false);
