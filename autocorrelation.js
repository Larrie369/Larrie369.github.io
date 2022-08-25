
//autocorrelation function
function autocorrelation(x) {
  var result = [];
  var N = x.length;
  for (var l = 0; l < N; l++) {
    var sum = 0;
    for (var n = 0; n <= N - l - 1; n++) {
        sum += (x[n] * x[n + l]);
    }
    result[l] = sum;
  }
  return result;
}

//peak detection
function getFreq (autocorrelation, sampleRate) {
    var sum = 0;
    var pd_state = 0;
    var period = 0;
  
    for (i = 0; i < autocorrelation.length; i++) {
      sum_old = sum;
      sum = autocorrelation[i];
  
      if (pd_state == 2 && sum - sum_old <= 0) {
        period = i;
        pd_state = 3;
      }
      if (pd_state == 1 && sum > thresh && sum - sum_old > 0) {
        pd_state = 2;
      }
      if (!i) {
        thresh = sum * 0.5;
        pd_state = 1;
      }
    }
  
    frequency = sampleRate / period;
    return frequency;
}

var fundamental_frequency;
var closest_note_frequency;
var note_letter;
var selectedStrings;
var random_note;
var recording;
var lastFreq = 440;
var lastNote = 'A4';

function interpret(timeDomainData, sampleRate) {
  recording = true;
  var selectedAccidetal;
  var autocorrelationResult = autocorrelation(timeDomainData);
  var freq = getFreq(autocorrelationResult, sampleRate);

  fundamental_frequency = getFundamentalFrequency(freq);
  closest_note_frequency = getClosestNoteFrequency(fundamental_frequency);

  // if statement to deferentiate between the tuner or learn fretboard
  if (selectedStrings == undefined){
    selectedAccidetal = 'sharp';
    note_letter = getNoteLetter(closest_note_frequency, selectedAccidetal);
    tuner(freq);
  } else {
    selectedAccidetal = selectedStrings[0];
    note_letter = getNoteLetter(closest_note_frequency, selectedAccidetal);
    outputFretboard(freq);
  }

}


function outputFretboard(freq){
  if (random_note == note_letter){
    setTimeout(() => {
      if (random_note == note_letter){
        random_note = randomNote(selectedStrings);
      }
    }, 500);
  }
  
  /* console.log('Frequency: ' + freq);
  console.log('estimated fundamental frequency: ' + fundamental_frequency);
  console.log('estimated closest note: ' + closest_note_frequency);
  console.log('estimated note: ' + note_letter);*/
  
  if(fundamental_frequency === Infinity || note_letter === undefined || fundamental_frequency > 3000){
    console.log("Freq: " + fundamental_frequency);
    console.log("Note letter: " + note_letter);
    fundamental_frequency = '';
    note_letter = ''
  } else {
    fundamental_frequency = fundamental_frequency.toFixed(2);
  }

  document.getElementById('current').innerHTML = random_note;
  document.getElementById('frequency').innerHTML = 'Frequency: ' + fundamental_frequency;
  document.getElementById('note').innerHTML = 'Current note: ' + note_letter;
    
}

function getInstrument(id){
  var instrument;
  const accidentals = document.querySelector('.accidentalsSelect.active');
  const frets = document.querySelectorAll('.fretSelect');
  selectedStrings = [];

  if (id == 'bass'){
      instrument = document.querySelector('#stringSettingsB');
  } else {
      instrument = document.querySelector('#stringSettingsG');
  }
  
  selectedStrings.push(accidentals.value);
  frets.forEach(fret => selectedStrings.push(fret.value));

  const strings = instrument.querySelectorAll('.active');
  strings.forEach(string => selectedStrings.push(string.value));

  selectedNotesArray(selectedStrings);
  random_note = randomNote();
}

function tuner(freq){
  //console.log('In the tuner function!!');
  var cents = Math.floor((1200 * Math.log(fundamental_frequency / closest_note_frequency)) / Math.log(2));
  console.log(cents);
  updateTuner(cents, freq);
}

function updateTuner(cents, freq){
  if (cents > 45){
    cents = 0;
  }
  if (cents < -45){
    cents = 0;
  }
  var pointer = document.querySelector('.meter-pointer');
  pointer.style.transform = 'rotate(' + cents + 'deg)';

  if(freq == Infinity || note_letter == undefined || freq > 1600){
    freq = lastFreq;
    note_letter = lastNote;
  } else {
    freq = freq.toFixed(2);
    lastFreq = closest_note_frequency;
    lastNote = note_letter;
  }


  document.querySelector('.notes-list').innerHTML = note_letter;
  document.querySelector('.frequency').innerHTML = freq + ' Hz';
}