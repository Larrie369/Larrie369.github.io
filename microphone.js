
function Microphone (_fft) {
  var FFT_SIZE = 4096;
  this.spectrum = [];
  var audioContext;
  var streamV;

  // for cross browser support
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;


  // initialize the mic and creates the AudioContext
  this.init = () => {
    try {
      audioContext = new AudioContext();
      startMic(audioContext);
    } catch (e) {
      console.error(e);
      alert('Web Audio API is not supported in this browser');
    }
  }

  // suspend context, when tools that use it are not currently in use to reduce CPU usage 
  // when you leave or stop the tuner and learn fretboard function
  this.suspendContext = () => {
    audioContext.suspend();
  }

  // gets the permision from the user to use the mic
  // when not allowed it shows the error message and it's recursively called again, till allowed
  // when allowed than it removes the gray overlay on the app and creates the stream
  function startMic (context) {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function(stream) {
      streamV = stream;
      const overlay = document.querySelector('.overlay');
      overlay.classList.toggle('transparent');
      overlay.style.display = 'none';
    }).catch(function(err){
      alert(err.message);
      startMic(context);
    });
  }

  this.processSound = () => {
    audioContext.resume();
    var input = audioContext.createMediaStreamSource(streamV);
    var analyser = audioContext.createAnalyser();
    analyser.fftSize = FFT_SIZE;
    input.connect(analyser);
    var node = audioContext.createScriptProcessor(FFT_SIZE, 1, 1);
    //console.log(analyser);
    node.onaudioprocess = () => {
      this.spectrum = new Float32Array(4096);
      analyser.getFloatTimeDomainData(this.spectrum);
      interpret(this.spectrum, audioContext.sampleRate);
    }
    
    analyser.connect(node);
    node.connect(audioContext.destination);
  }
  
  return this;
}