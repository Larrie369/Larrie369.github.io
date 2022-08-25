// panel management
const panels = document.querySelectorAll('.panel');
const ps = document.querySelectorAll('p');
const overlay = document.querySelector('.overlay');

function toggleOpen() {
  var setClasses = !this.parentElement.classList.contains('open');
  setClass(panels, 'open', 'remove');
  
  if (setClasses){
    overlay.style.display = 'block';
    this.parentElement.classList.toggle('open');
  }
  
  // stop function for tuner and learn fretboard
  if (recording){
    selectedStrings = undefined;
    recording = false;
    Mic.suspendContext();
    const btnInstActive = document.querySelector('.instrumentSelectBtn.active');
    console.log(btnInstActive);
    if (btnInstActive !== (undefined || null)){
      btnInstActive.classList.remove('active');
    }
    document.getElementById('selectInstument').style.display = 'block';
    document.getElementById('play').style.display = 'none';
  }

  // stop function for metronome
  if (isRunning){
      metronome.stop();
      isRunning = false;
      startStopBtn.textContent = 'Start';
  }

}

function setClass(els, className, fnName){
  for (var i = 0; i < els.length; i++) {
    els[i].classList[fnName](className);
  }
}

function toggleActive(e){
  if (e.propertyName.includes('flex')){
    this.classList.toggle('open-active');
    overlay.style.display = 'none';
  }
}

ps.forEach(p => p.addEventListener('click', toggleOpen));
panels.forEach(panel => panel.addEventListener('transitionend', toggleActive));

// instrument select
const btnInstrument = document.querySelectorAll('.instrumentSelectBtn');

function toggleInstrument(){
  var setClasses = !this.classList.contains('active');
  setClassAHide(btnInstrument, 'active', 'remove');

  if (setClasses){
    this.classList.toggle('active');
    if(this.id == 'bassSelect'){
      document.getElementById('stringSettings').style.display = 'block';
      document.getElementById('stringSettingsB').style.display = 'block';
      document.querySelector('.start').setAttribute('id', 'bass');
    } else {
      document.getElementById('stringSettings').style.display = 'block';
      document.getElementById('stringSettingsG').style.display = 'block';
      document.querySelector('.start').setAttribute('id', 'guitar');
    }
  }
};

function setClassAHide(els, className, fnName){
  for (var i = 0; i < els.length; i++) {
    els[i].classList[fnName](className);

    if(els[i].id == 'bassSelect'){
      document.getElementById('stringSettings').style.display = 'none';
      document.getElementById('stringSettingsB').style.display = 'none';
    } else if (els[i].id == 'guitarSelect'){
      document.getElementById('stringSettings').style.display = 'none';
      document.getElementById('stringSettingsG').style.display = 'none';
    }
  }
}

btnInstrument.forEach(btn => btn.addEventListener('click', toggleInstrument));


// string select buttons management
const btnStrings = document.querySelectorAll(".stringSelect");

function toggleString(){
    this.classList.toggle('active');
};

btnStrings.forEach(btn => btn.addEventListener('click', toggleString));

// accidentals select buttons management
const btnAccid = document.querySelectorAll(".accidentalsSelect");

function toggleAccidentals(){
  var setClasses = !this.classList.contains('active');
  setClassAHide(btnAccid, 'active', 'remove');

  if (setClasses){
    this.classList.toggle('active');
  }

}

btnAccid.forEach(btn => btn.addEventListener('click', toggleAccidentals));

// fret select settings

function checkValueMin() {
  var minA = parseInt(document.getElementById('fretMin').value) + 2;
  var maxA = document.getElementById('fretMax').value;
  var maxB = parseInt(document.getElementById('fretMax').value) - 2;

  if (minA > maxA){
    document.getElementById('fretMin').value = maxB;
  }

}

function checkValueMax(){
  var minA = document.getElementById('fretMin').value;
  var minB = parseInt(document.getElementById('fretMin').value) + 2;
  var maxA = parseInt(document.getElementById('fretMax').value) - 2;
  
  if (minA > maxA){
    document.getElementById('fretMax').value = minB;
  }

}

// stop button in fretboard
const stopBtn = document.getElementById('stop');

stopBtn.addEventListener('click', () => {
  selectedStrings = undefined;
  recording = false;
  Mic.suspendContext();
  const btnInstActive = document.querySelector('.instrumentSelectBtn.active');
  btnInstActive.classList.remove('active');
  document.getElementById('selectInstument').style.display = 'block';
  document.getElementById('play').style.display = 'none';
});

// tuner setup - lines drawing
const meter = document.querySelector('.meter');

window.onload = () => {
  for (var i = 0; i <= 10; i += 1) {
    const $scale = document.createElement('div')
    $scale.className = 'meter-scale'
    $scale.style.transform = 'rotate(' + (i * 9 - 45) + 'deg)'
    if (i % 5 === 0) {
      $scale.classList.add('meter-scale-strong')
    }
    meter.appendChild($scale)
  }
  var a = new keyboard();
  a.draw();
};

// keyboard settings
function playSound(e){
  const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
  const key = document.querySelector(`.key[data-key="${e.keyCode}"]`);
  if(!audio) return; // stops the function, when no data-key found
  audio.currentTime = 0; // rewind the audio to the start
  audio.play();
  key.classList.add('playing');
};

function removeTransition(e){
  if(e.propertyName !== 'transform') return; // skips if not transformed
  this.classList.remove('playing');
}

const keys = document.querySelectorAll('.key');
keys.forEach(key => key.addEventListener('transitionend', removeTransition));

window.addEventListener('keydown', playSound);