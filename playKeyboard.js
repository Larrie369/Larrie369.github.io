function keyboard() {

	// creates the audioSynth instance and sets the volume
	var __audioSynth = new AudioSynth();
	__audioSynth.setVolume(0.5);
	var __octave = 4;
	
	// Change octave
	var changeOctave = (x) => {
		x |= 0;
		__octave += x;
		__octave = Math.min(5, Math.max(3, __octave));
		var octaveName = document.getElementsByName('octaveLabel');
		var i = octaveName.length;

		while(i--) {
			var val = parseInt(octaveName[i].getAttribute('value'));
			octaveName[i].innerHTML = (val + __octave);
		}
		document.getElementById('octave-lower').innerHTML = __octave-1;
		document.getElementById('octave-upper').innerHTML = __octave+1;
	};

	// Key bindings, notes to keyCodes.
	var keyboard = { 
		50: 'C#,-1',
		51: 'D#,-1',
		53: 'F#,-1',
		54: 'G#,-1',
		55: 'A#,-1',
		57: 'C#,0', 
		48: 'D#,0',
		187: 'F#,0',
		61: 'F#,0',
		81: 'C,-1',
		87: 'D,-1',
		69: 'E,-1',
		82: 'F,-1',
		84: 'G,-1',
		89: 'A,-1',
		85: 'B,-1',
		73: 'C,0',
		79: 'D,0',
		80: 'E,0',
		219: 'F,0',
		221: 'G,0',
		65: 'G#,0',
		83: 'A#,0',
		70: 'C#,1',
		71: 'D#,1',
		74: 'F#,1',
		75: 'G#,1',
		76: 'A#,1',
		90: 'A,0',
		88: 'B,0',
		67: 'C,1',
		86: 'D,1',
		66: 'E,1',
		78: 'F,1',
		77: 'G,1',
		188: 'A,1',
		190: 'B,1'
		};
	
	var reverseLookupText = {};
	var reverseLookup = {};

	// Create a reverse lookup table.
	for(var i in keyboard) {
		var val;
		switch(i|0) {
			case 187:
				val = 61;
				break;
			case 219:
				val = 91;
				break;
			case 221:
				val = 93;
				break;
			case 188:
				val = 44;
				break;
			case 190:
				val = 46;
				break;
			default:
				val = i;
				break;
		}

		reverseLookupText[keyboard[i]] = val;
		reverseLookup[keyboard[i]] = i;
	}

	// Keys pressed down keys
	var keysPressed = [];

	var visualKeyboard;
	var selectSound;

	// Creates the keyboard
	var createKeyboard = () => {

		// selects the main keyboard element
		visualKeyboard = document.getElementById('keyboard');

		// gets the sound profile selection
		selectSound = document.getElementById('sound');

		// white note counter variable
		var iWhite = 0;

		// gets base notes from audioSynth (C, C♯, D, D♯, ...)
		var notes = __audioSynth._notes;

		// first loop for getting 3 octaves of keys
		for(var i=-1;i<=1;i++) {

			// second loop loops for each base note
			for(var n in notes) {

				var thisKey = document.createElement('div');

				// creates black keys for notes with accidentals and white keys for main notes
				if(n.length > 1) {
					thisKey.className = 'black key';
					thisKey.style.width = '3em';
					thisKey.style.height = '120px';
					thisKey.style.left = (5 * (iWhite - 1)) + 3.5 + 'em';
				} else {
					thisKey.className = 'white key';
					thisKey.style.width = '5em';
					thisKey.style.height = '250px';
					thisKey.style.left = 5 * iWhite + 'em';
					iWhite++;
				}
				// creates label for each key with name of the key on keyboard (key code to string) and note name with octave number
				var label = document.createElement('div');
				label.className = 'label';
				label.innerHTML = '<b>' + String.fromCharCode(reverseLookupText[n + ',' + i]) + '</b>' + '<br /><br />' + n + '<span name="octaveLabel" value="' + i + '">' + (__octave + parseInt(i)) + '</span>';
				thisKey.appendChild(label);

				// sets ID for each key to note name and octave value in keyboard range (-1, 0, 1)
				thisKey.setAttribute('ID', 'KEY_' + n + ',' + i);

				// adds event listener for mouse click on each key, reverse looks up the key code value to play the note
				thisKey.addEventListener('mousedown', (function(_temp) { return () => { playKeyboard({keyCode:_temp}); } })(reverseLookup[n + ',' + i]));

				visualKeyboard[n + ',' + i] = thisKey;
				visualKeyboard.appendChild(thisKey);
				
			}
		}

		// sets the width of the keyboard container
		visualKeyboard.style.width = '50em';

		// adds the event listener to mouse click release of previously played notes from keysPressed array
		window.addEventListener('mouseup', () => { n = keysPressed.length; while(n--) { removeKeyBinding({keyCode:keysPressed[n]}); } });
	
	};

	// Creates our audio player
	var playNote = (note, octave) => {
		src = __audioSynth.generate(selectSound.value, note, octave, 2);
		container = new Audio(src);
		container.addEventListener('ended', () => { container = null; });
		container.addEventListener('loadeddata', (e) => { e.target.play(); });
		container.autoplay = false;
		container.setAttribute('type', 'audio/wav');
		container.load();
		return container;
	
	};

	// Detect keypresses, play notes.
	var playKeyboard = (e) => {
	
		var i = keysPressed.length;

		while(i--) {
			if(keysPressed[i]==e.keyCode) {
				return false;	
			}
		}

		keysPressed.push(e.keyCode);
		
		// switch for detecting arrow and shift keys
		switch(e.keyCode) {
			case 37:
				changeOctave(-1);
				break;
			case 39:
				changeOctave(+1);
				break;
			case 16:
				// Rick Astley -  Never Gonna Give You Up, cuz why not :D
				playSong([
					['G,-1', 6],
					['A,-1', 6],
					['C,0', 6],
					['A,-1', 6],
					['E,0', 4],
					['E,0', 6],
					['D,0', 2],
					['G,-1', 6],
					['A,-1', 6],
					['C,0', 6],
					['A,-1', 6],
					['D,0', 4],
					['D,0', 6],
					['C,0', 2],
					['B,-1', 6],
					['A,-1', 6],
					['G,-1', 6],
					['A,-1', 6],
					['C,0', 6],
					['A,-1', 6],
					['C,0', 4],
					['D,0', 6],
					['B,-1', 4],
					['A,-1', 6],
					['G,-1', 4],
					['G,-1', 6],
					['D,0', 2],
					['C,0', 1],
				]);
				break;
		}
	
		// highlights the pressed key and passes to playNote function
		if(keyboard[e.keyCode]) {
			if(visualKeyboard[keyboard[e.keyCode]]) {
				visualKeyboard[keyboard[e.keyCode]].style.backgroundColor = '#67809f';
				visualKeyboard[keyboard[e.keyCode]].style.color = '#88e3ff';
				visualKeyboard[keyboard[e.keyCode]].style.marginTop = '5px';
				visualKeyboard[keyboard[e.keyCode]].style.boxShadow = 'none';
			}
			var arrPlayNote = keyboard[e.keyCode].split(',');
			var note = arrPlayNote[0];
			var octaveModifier = arrPlayNote[1]|0;
			playNote(note, __octave + octaveModifier);
		} else {
			return false;	
		}
	
	}

	// Remove key bindings once note is done.
	var removeKeyBinding = (e) => {
	
		var i = keysPressed.length;
		while(i--) {
			if(keysPressed[i]==e.keyCode) {
				if(visualKeyboard[keyboard[e.keyCode]]) {
					visualKeyboard[keyboard[e.keyCode]].style.backgroundColor = '';
					visualKeyboard[keyboard[e.keyCode]].style.color = '';
					visualKeyboard[keyboard[e.keyCode]].style.marginTop = '';
					visualKeyboard[keyboard[e.keyCode]].style.boxShadow = '';
				}
				keysPressed.splice(i, 1);
			}
		}
	
	}

	var playSong = (arr) => {
	
		if(arr.length>0) {
		
			var noteLen = 1000*(1/parseInt(arr[0][1]));
			if(!(arr[0][0] instanceof Array)) {
				arr[0][0] = [arr[0][0]];	
			}
			var i = arr[0][0].length;
			var keys = [];
			while(i--) {
				keys.unshift(reverseLookup[arr[0][0][i]]);
				playKeyboard({keyCode:keys[0]});
			}
			arr.shift();
			// timeout for playing all the notes one after another, depending on their setted note length
			setTimeout(function(array, val) { return () => { var i = val.length; while(i--) { removeKeyBinding({keyCode:val[i]}); } playSong(array); } }(arr, keys), noteLen);
		
		}
	
	};

	// Set up global event listeners for whole keyboard and mouse click on octave change buttons
	window.addEventListener('keydown', playKeyboard);
	window.addEventListener('keyup', removeKeyBinding);
	document.getElementById('octave-dec').addEventListener('click', () => { changeOctave(-1); });
	document.getElementById('octave-inc').addEventListener('click', () => { changeOctave(1); });
	
	// draws the whole object
	Object.defineProperty(this, 'draw', {
		value: createKeyboard
	});

}