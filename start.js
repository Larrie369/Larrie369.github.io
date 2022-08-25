var Mic;

function getMicPermission(){
    Mic = new Microphone(1024 * 16);
    Mic.init();
    body.removeEventListener('click', getMicPermission);
}

function startMicrophoneRecording() {
    var instrumentId = this.id;
    Mic.processSound();
    hideSettings();  
    getInstrument(instrumentId);
}

function hideSettings() {
    document.getElementById('stringSettings').style.display = 'none';
    document.getElementById('selectInstument').style.display = 'none';
    document.getElementById('play').style.display = 'block';
}

function startTuner(){
    Mic.processSound();
}

// on click listener for getting around autoplay policy to get users permission to get mic access
const body = document.querySelector("body");
body.addEventListener('click', getMicPermission);

// start sound process after clicking on the feature that require it
// for start button in learn fretboard feature
const startButton = document.querySelector(".start");
startButton.addEventListener('click', startMicrophoneRecording);
// for clicking on the tunner pannel
const tunerButton = document.querySelector('#button1');
tunerButton.addEventListener('click', startTuner);