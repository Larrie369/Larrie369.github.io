
/* Since the most prominent frequency could be a harmonic, divide it continually until the frequency
is within the range of the fundamental frequencies we are interested in */
function getFundamentalFrequency (frequency) {
    for (var i = 1; i <= 5; i++) {
        var currentHarmonic = frequency  / i;
        if (currentHarmonic < 1500) {
            return currentHarmonic;
        }
    }

    return frequency;
}

// map with note names with accidentals and octave
var noteNames = {
    '30.87': 'B0',
    '32.7': 'C1',
    '34.65': 'C♯1, D♭1',
    '36.71': 'D1',
    '38.89': 'D♯1, E♭1',
    '41.2': 'E1',
    '43.65': 'F1',
    '46.25': 'F♯1, G♭1',
    '49': 'G1',
    '51.91': 'G♯1, A♭1',
    '55': 'A1',
    '58.27': 'A♯1, B♭1',
    '61.74': 'B1',
    '65.41': 'C2',
    '69.3': 'C♯2, D♭2',
    '73.42': 'D2',
    '77.78': 'D♯2, E♭2',
    '82.41': 'E2',
    '87.31': 'F2',
    '92.5': 'F♯2, G♭2',
    '98': 'G2',
    '103.83': 'G♯2, A♭2',
    '110': 'A2',
    '116.54': 'A♯2, B♭2',
    '123.47': 'B2',
    '130.81': 'C3',
    '138.59': 'C♯3, D♭3',
    '146.83': 'D3',
    '155.56': 'D♯3, E♭3',
    '164.81': 'E3',
    '174.61': 'F3',
    '185': 'F♯3, G♭3',
    '196': 'G3',
    '207.65': 'G♯3, A♭3',
    '220': 'A3',
    '233.08': 'A♯3, B♭3',
    '246.94': 'B3',
    '261.63': 'C4',
    '277.18': 'C♯4, D♭4',
    '293.66': 'D4',
    '311.13': 'D♯4, E♭4',
    '329.63': 'E4',
    '349.23': 'F4',
    '369.99': 'F♯4, G♭4',
    '392': 'G4',
    '415.3':'G♯4, A♭4',
    '440':'A4',
    '466.16':'A♯4, B♭4',
    '493.88':'B4',
    '523.25':'C5',
    '554.37':'C♯5, D♭5',
    '587.33':'D5',
    '622.25':'D♯5, E♭5',
    '659.25':'E5',
    '698.46':'F5',
    '739.99':'F♯5, G♭5',
    '783.99':'G5',
    '830.61':'G♯5, A♭5',
    '880':'A5',
    '932.33':'A♯5, B♭5',
    '987.77':'B5',
    '1046.5':'C6',
    '1108.73':'C♯6, D♭6',
    '1174.66':'D6',
    '1244.51':'D♯6, E♭6',
    '1318.51':'E6'
}

// array with note freqencies
var notes = [30.87, 32.7, 34.65, 36.71, 38.89, 41.2, 43.65, 46.25, 49, 51.91, 55, 58.27, 61.74, 65.41, 69.3, 73.42, 77.78, 82.41, 87.31, 92.5, 98, 103.83, 110, 116.54, 123.47, 130.81, 138.59, 146.83, 155.56, 164.81, 174.61, 185, 196, 207.65, 220, 233.08, 246.94, 261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392, 415.3, 440, 466.16, 493.88, 523.25, 554.37, 587.33, 622.25, 659.25, 698.46, 739.99, 783.99, 830.61, 880, 932.33, 987.77, 1046.50, 1108.73, 1174.66, 1244.51, 1318.51];

var start;
var end;
var startFret;
var endFret;
var accidental;
var stringRange = [];
var selectedNotes = [];

// function array for getting the string interval in frequency array
stringRange['B0'] = function() { start , end };
stringRange['E1'] = function() { start += 5, end += 5 };
stringRange['A1'] = function() { start += 10, end += 10 };
stringRange['D2'] = function() { start += 15, end += 15 };
stringRange['G2'] = function() { start += 20, end += 20 };

stringRange['E2'] = function() { start += 17, end += 17 };
stringRange['A2'] = function() { start += 22, end += 22 };
stringRange['D3'] = function() { start += 27, end += 27 };
stringRange['G3'] = function() { start += 32, end += 32 };
stringRange['B3'] = function() { start += 36, end += 36 };
stringRange['E4'] = function() { start += 41, end += 41 };

// returns the closest frequency from frequency array of currently played note
function getClosestNoteFrequency (frequency) {
    var smallestDifference = Number.MAX_SAFE_INTEGER;
    var closestNote = Number.MAX_SAFE_INTEGER;
    for (var i = 0; i < notes.length; i++) {
      var difference = Math.abs(frequency - notes[i]);
      if (difference < smallestDifference) {
          smallestDifference = difference;
          closestNote = notes[i];
      }
    }
    return closestNote;
}

// returns the note name with correct accidental
function getNoteLetter(frequency, accidental) {
    var notes = [];

    // just to avoid infinity error 
    if (frequency < 20000){
        notes = noteNames[frequency.toString()].split(', ');
    }

    if (accidental == 'sharp' || notes.length == 1){
        console.log(notes);
        return notes[0];
    } else {
        return notes[1];
    }
}

// creates the array of selected values from string setup in learn freatboard
function selectedNotesArray(selection){
    var strings = [];
    selectedNotes = [];
    
    accidental = selection[0];
    startFret = selection[1];
    endFret = selection[2];

    for(i = 3; i < selection.length; i++){
        strings.push(selection[i]);
    }

    strings.forEach(string => getNoteRange(string));
    console.log(selectedNotes);

}

// get the string range, based on selected values in previous function
function getNoteRange(string){
    var stringNotes = [];
    start = parseInt(startFret);
    end = parseInt(endFret);

    stringRange[string]();

    stringNotes = notes.filter(note => notes.indexOf(note) >= start && notes.indexOf(note) <= end);

    console.log(stringNotes);
    selectedNotes.push(...stringNotes);
}

function randomNote(){
    var note = selectedNotes[Math.floor(Math.random() * selectedNotes.length)];
    var randomNote = getNoteLetter(note, accidental);

    return randomNote;
}