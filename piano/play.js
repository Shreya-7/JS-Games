document.addEventListener('DOMContentLoaded', ()=>{

    var keysPressed = [];
    const mid_octave = 4;
    const keyboard = getKeyboardDict();

    var audioSynth = new AudioSynth();
    audioSynth.setVolume(0.5);   

    // play a note of a given octave
    function playNote(note, octave) {
        src = audioSynth.generate("0", note, octave, 2); // 0 for piano
        container = new Audio(src);
        container.play();
        return container;
    }

    // called during mouse click over or key press over
    function removeKeyBinding(position) {

        const keyCode = keysPressed[position];
        const note = keyboard[keyCode]['note'];
        const octave = parseInt(keyboard[keyCode]['octave_offset']) + mid_octave;

        const keyboardKey = document.querySelector(`[note="${note}"][octave="${octave}"]`);

        // revert to original appearance
        keyboardKey.classList.remove('active');
        keysPressed.splice(position, 1);

    }

    // called whenever a note has to be played (by mouse click or key press)

    function detectKeyPress(keyCode) {

        // if the keycode is already in the "queue"
        var i = keysPressed.length;
		while(i--) {
			if(keysPressed[i]==keyCode) {
				return false;	
			}
		}

        // add the keycode to the key "queue"
		keysPressed.push(keyCode);

        // if the keycode is valid
		if(keyboard[keyCode]) {

            const note = keyboard[keyCode]['note'];
            const octave = parseInt(keyboard[keyCode]['octave_offset']) + mid_octave;

            const keyboardKey = document.querySelector(`[note="${note}"][octave="${octave}"]`);

            // change appearance
            keyboardKey.classList.add('active');

            // play the note
			playNote(note, octave);

		} else {
			return false;	
		}
    }

    // return the note-octave string to be displayed
    function getDisplayNote(note, octave) {
        return note.substr(0,1) + octave + (note.substr(1,1) ? note.substr(1,1) : '');
    }

    // return the string version of the key
    function getKey(keyCode) {
        return String.fromCharCode(keyCode);
    }

    // get the keycode from the keyboard dict for a given note and octave offset
    function getKeyCode(note, octave_offset) {
        for(var i in keyboard) {
            const value = keyboard[i];
            if (value['note'] == note && value['octave_offset'] == octave_offset) {
                return i;
            }
        }
        return -1;
    }

    // return a key (ASCII) to note,octave mapping
    function getKeyboardDict() {
        const keyboard = {
                
                /* ~ */
                96: 'C,-2',

                /* 1 */
                49: 'C#,-2',

                /* 2 */
                50: 'D,-2',

                /* 3 */
                51: 'D#,-2',

                /* 4 */
                52: 'E,-2',

                /* 5 */
                53: 'F,-2',

                /* 6 */
                54: 'F#,-2',

                /* 7 */
                55: 'G,-2',

                /* 8 */
                56: 'G#,-2',

                /* 9 */
                57: 'A,-2',

                /* 0 */
                48: 'A#,-2',

                /* - */
                45: 'B,-2',

                /* = */
                61: 'C,-1',

                /* Q */
                81: 'C#,-1',

                /* W */
                87: 'D,-1',

                /* E */
                69: 'D#,-1',

                /* R */
                82: 'E,-1',

                /* T */
                84: 'F,-1',

                /* Y */
                89: 'F#,-1',

                /* U */
                85: 'G,-1',

                /* I */
                73: 'G#,-1',

                /* O */
                79: 'A,-1',

                /* P */
                80: 'A#,-1',

                /* [ */
                91: 'B,-1',

                /* ] */
                93: 'C,0',

                /* A */
                65: 'C#,0',

                /* S */
                83: 'D,0',

                /* D */
                68: 'D#,0',

                /* F */
                70: 'E,0',

                /* G */
                71: 'F,0',

                /* H */
                72: 'F#,0',

                /* J */
                74: 'G,0',

                /* K */
                75: 'G#,0',

                /* L */
                76: 'A,0',

                /* ; */
                59: 'A#,0',

                /* " */
                32: 'B,0',
                

                /* Z */
                90: 'C,1',

                /* X */
                88: 'C#,1',

                /* C */
                67: 'D,1',

                /* V */
                86: 'D#,1',

                /* B */
                66: 'E,1',

                /* N */
                78: 'F,1',

                /* M */
                77: 'F#,1',

                /* , */
                44: 'G,1',

                /* . */
                46: 'G#,1',

                /* / */
                47: 'A,1',

                /* <- */
                42: 'A#,1',

                /* -> */
                43: 'B,1',
            
            };

        var fixed_keyboard = {};

        // generate dictionary values

        for(var key in keyboard) {
            const value = keyboard[key].split(',');
            fixed_keyboard[key] = {
                'note': value[0],
                'octave_offset': value[1]
            };
        }
        return fixed_keyboard;
    }

    function showKeyboard() {

        const notes = audioSynth._notes;

        const lower_octave_offset = -2;
        const upper_octave_offset = 1;

        var whiteKeys = 0; //count the number of white keys

        // background colours for the keys
        const colors = {
            'C': '#ff9aa2',
            'C#': '#',
            'D': '#ffb7b2',
            'D#': '#',
            'E': '#ffdac1',
            'F': '#faf3e6',
            'F#': '#',
            'G': '#e2f0cb',
            'G#': '#',
            'A': '#b5ead7',
            'A#': '#',
            'B': '#c7ceea',          
        }

        var displayKeyboard = document.getElementById('keyboard');

        // iterate through each octave
        for(var octave=lower_octave_offset; octave<=upper_octave_offset; octave++) {

            // iterate through the notes in each octave
            for(var note in notes) {

                //generate a key element
                var thisKey = document.createElement('div');

                // black key for a sharp note
                if (note.length > 1) { 

                    thisKey.classList.add('black' ,'key');
                    thisKey.style.left = (40 * (whiteKeys - 1)) + 25 + 'px';

                }
                
                // white key for a normal note
                else {

                    thisKey.classList.add('white', 'key');
                    thisKey.style.left = 40 * whiteKeys + 'px';
                    whiteKeys++;
                }

                // add event listener to key
                const keyCode = getKeyCode(note, octave, keyboard);
                thisKey.addEventListener('mousedown', () => {
                    detectKeyPress(keyCode, keyboard);
                });

                thisKey.style.backgroundColor = colors[note];

                // set note and octave attributes
                thisKey.setAttribute('note', note);
                thisKey.setAttribute('octave', octave + mid_octave);

                // create label
                var label = document.createElement('div');
                label.classList.add('label');
                
                var keyLabel = document.createElement('b');
                keyLabel.classList.add('keyLabel');
                keyLabel.innerHTML = getKey(getKeyCode(note, octave, keyboard)) + "<br><br>";

                var noteLabel = document.createElement('span');
                noteLabel.innerHTML = getDisplayNote(note, octave + mid_octave);

                label.appendChild(keyLabel);
                label.appendChild(noteLabel);            

                thisKey.appendChild(label);
                displayKeyboard.appendChild(thisKey);
            }
        }
        displayKeyboard.style.width = whiteKeys * 40 + 'px';
    }

    function playKeyboard() {

        // display the generated keyboard
        showKeyboard();   
        
        window.addEventListener('mouseup', function() {

            // remove all keys in the list
            var n = keysPressed.length;
            while(n--) {
                removeKeyBinding(n);
            }
        });

        window.addEventListener('keydown', (e)=>{

            // send the ASCII of the key pressed
            detectKeyPress(e.key.toUpperCase().charCodeAt());
        });
	    window.addEventListener('keyup', (e)=>{

            // send the ASCII of the key released
            removeKeyBinding(keysPressed.indexOf(e.key.toUpperCase().charCodeAt()));
        });
    }
    playKeyboard();
})

