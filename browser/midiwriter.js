var MidiWriter = (function () {
	'use strict';

	/**
	 * MIDI file format constants.
	 * @return {Constants}
	 */

	const Constants = {
		VERSION					: '2.1.4',
		HEADER_CHUNK_TYPE  		: [0x4d, 0x54, 0x68, 0x64], // Mthd
		HEADER_CHUNK_LENGTH  	: [0x00, 0x00, 0x00, 0x06], // Header size for SMF
		HEADER_CHUNK_FORMAT0    : [0x00, 0x00], // Midi Type 0 id
		HEADER_CHUNK_FORMAT1    : [0x00, 0x01], // Midi Type 1 id
		HEADER_CHUNK_DIVISION   : [0x00, 0x80], // Defaults to 128 ticks per beat
		TRACK_CHUNK_TYPE		: [0x4d, 0x54, 0x72, 0x6b], // MTrk,
		META_EVENT_ID			: 0xFF,
		META_TEXT_ID			: 0x01,
		META_COPYRIGHT_ID		: 0x02,
		META_TRACK_NAME_ID		: 0x03,
		META_INSTRUMENT_NAME_ID : 0x04,
		META_LYRIC_ID			: 0x05,
		META_MARKER_ID			: 0x06,
		META_CUE_POINT			: 0x07,
		META_TEMPO_ID			: 0x51,
		META_SMTPE_OFFSET		: 0x54,
		META_TIME_SIGNATURE_ID	: 0x58,
		META_KEY_SIGNATURE_ID	: 0x59,
		META_END_OF_TRACK_ID	: [0x2F, 0x00],
		CONTROLLER_CHANGE_STATUS: 0xB0, // includes channel number (0)
		PITCH_BEND_STATUS       : 0xE0, // includes channel number (0)
	};

	function isNum (x) { return typeof x === 'number' }
	function isStr (x) { return typeof x === 'string' }
	function isDef (x) { return typeof x !== 'undefined' }
	function midiToFreq (midi, tuning) {
	  return Math.pow(2, (midi - 69) / 12) * (tuning || 440)
	}

	var REGEX = /^([a-gA-G])(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)\s*$/;

	var SEMITONES = [0, 2, 4, 5, 7, 9, 11];
	/**
	 * Parse a note name in scientific notation an return it's components,
	 * and some numeric properties including midi number and frequency.
	 *
	 * @name parse
	 * @function
	 * @param {String} note - the note string to be parsed
	 * @param {Boolean} isTonic - true the strings it's supposed to contain a note number
	 * and some category (for example an scale: 'C# major'). It's false by default,
	 * but when true, en extra tonicOf property is returned with the category ('major')
	 * @param {Float} tunning - The frequency of A4 note to calculate frequencies.
	 * By default it 440.
	 * @return {Object} the parsed note name or null if not a valid note
	 *
	 * The parsed note name object will ALWAYS contains:
	 * - letter: the uppercase letter of the note
	 * - acc: the accidentals of the note (only sharps or flats)
	 * - pc: the pitch class (letter + acc)
	 * - step: s a numeric representation of the letter. It's an integer from 0 to 6
	 * where 0 = C, 1 = D ... 6 = B
	 * - alt: a numeric representation of the accidentals. 0 means no alteration,
	 * positive numbers are for sharps and negative for flats
	 * - chroma: a numeric representation of the pitch class. It's like midi for
	 * pitch classes. 0 = C, 1 = C#, 2 = D ... 11 = B. Can be used to find enharmonics
	 * since, for example, chroma of 'Cb' and 'B' are both 11
	 *
	 * If the note has octave, the parser object will contain:
	 * - oct: the octave number (as integer)
	 * - midi: the midi number
	 * - freq: the frequency (using tuning parameter as base)
	 *
	 * If the parameter `isTonic` is set to true, the parsed object will contain:
	 * - tonicOf: the rest of the string that follows note name (left and right trimmed)
	 *
	 * @example
	 * var parse = require('note-parser').parse
	 * parse('Cb4')
	 * // => { letter: 'C', acc: 'b', pc: 'Cb', step: 0, alt: -1, chroma: -1,
	 *         oct: 4, midi: 59, freq: 246.94165062806206 }
	 * // if no octave, no midi, no freq
	 * parse('fx')
	 * // => { letter: 'F', acc: '##', pc: 'F##', step: 3, alt: 2, chroma: 7 })
	 */
	function parse (str, isTonic, tuning) {
	  if (typeof str !== 'string') return null
	  var m = REGEX.exec(str);
	  if (!m || (!isTonic && m[4])) return null

	  var p = { letter: m[1].toUpperCase(), acc: m[2].replace(/x/g, '##') };
	  p.pc = p.letter + p.acc;
	  p.step = (p.letter.charCodeAt(0) + 3) % 7;
	  p.alt = p.acc[0] === 'b' ? -p.acc.length : p.acc.length;
	  var pos = SEMITONES[p.step] + p.alt;
	  p.chroma = pos < 0 ? 12 + pos : pos % 12;
	  if (m[3]) { // has octave
	    p.oct = +m[3];
	    p.midi = pos + 12 * (p.oct + 1);
	    p.freq = midiToFreq(p.midi, tuning);
	  }
	  if (isTonic) p.tonicOf = m[4];
	  return p
	}

	/**
	 * Get midi of a note
	 *
	 * @name midi
	 * @function
	 * @param {String|Integer} note - the note name or midi number
	 * @return {Integer} the midi number of the note or null if not a valid note
	 * or the note does NOT contains octave
	 * @example
	 * var parser = require('note-parser')
	 * parser.midi('A4') // => 69
	 * parser.midi('A') // => null
	 * @example
	 * // midi numbers are bypassed (even as strings)
	 * parser.midi(60) // => 60
	 * parser.midi('60') // => 60
	 */
	function midi (note) {
	  if ((isNum(note) || isStr(note)) && note >= 0 && note < 128) return +note
	  var p = parse(note);
	  return p && isDef(p.midi) ? p.midi : null
	}

	/**
	 * A midi note number is a number representation of a note pitch. It can be
	 * integers so it's equal tempered tuned, or float to indicate it's not
	 * tuned into equal temepered scale.
	 *
	 * This module contains functions to convert to and from midi notes.
	 *
	 * @example
	 * var midi = require('tonal-midi')
	 * midi.toMidi('A4') // => 69
	 * midi.note(69) // => 'A4'
	 * midi.note(61) // => 'Db4'
	 * midi.note(61, true) // => 'C#4'
	 *
	 * @module midi
	 */

	/**
	 * Convert the given note to a midi note number. If you pass a midi number it
	 * will returned as is.
	 *
	 * @param {Array|String|Number} note - the note to get the midi number from
	 * @return {Integer} the midi number or null if not valid pitch
	 * @example
	 * midi.toMidi('C4') // => 60
	 * midi.toMidi(60) // => 60
	 * midi.toMidi('60') // => 60
	 */
	function toMidi (val) {
	  if (Array.isArray(val) && val.length === 2) return val[0] * 7 + val[1] * 12 + 12
	  return midi(val)
	}

	/**
	 * Static utility functions used throughout the library.
	 */
	class Utils {

		/**
		 * Gets MidiWriterJS version number.
		 * @return {string}
		 */
		static version() {
			return Constants.VERSION;
		}

		/**
		 * Convert a string to an array of bytes
		 * @param {string} string
		 * @return {array}
		 */
		static stringToBytes(string) {
			return string.split('').map(char => char.charCodeAt())
		}

		/**
		 * Checks if argument is a valid number.
		 * @param {*} n - Value to check
		 * @return {boolean}
		 */
		static isNumeric(n) {
			return !isNaN(parseFloat(n)) && isFinite(n)
		}

		/**
		 * Returns the correct MIDI number for the specified pitch.
		 * Uses Tonal Midi - https://github.com/danigb/tonal/tree/master/packages/midi
		 * @param {(string|number)} pitch - 'C#4' or midi note code
		 * @param {string} middleC
		 * @return {number}
		 */
		static getPitch(pitch, middleC = 'C4') {
			return 60 - toMidi(middleC) + toMidi(pitch);
		}

		/**
		 * Translates number of ticks to MIDI timestamp format, returning an array of
		 * hex strings with the time values. Midi has a very particular time to express time,
		 * take a good look at the spec before ever touching this function.
		 * Thanks to https://github.com/sergi/jsmidi
		 *
		 * @param {number} ticks - Number of ticks to be translated
		 * @return {array} - Bytes that form the MIDI time value
		 */
		static numberToVariableLength(ticks) {
			ticks = Math.round(ticks);
			var buffer = ticks & 0x7F;

			// eslint-disable-next-line no-cond-assign
			while (ticks = ticks >> 7) {
				buffer <<= 8;
				buffer |= ((ticks & 0x7F) | 0x80);
			}

			var bList = [];
			while (true) {
				bList.push(buffer & 0xff);

				if (buffer & 0x80) buffer >>= 8;
				else { break; }
			}

			return bList;
		}

		/**
		 * Counts number of bytes in string
		 * @param {string} s
		 * @return {array}
		 */
		static stringByteCount(s) {
			return encodeURI(s).split(/%..|./).length - 1
		}

		/**
		 * Get an int from an array of bytes.
		 * @param {array} bytes
		 * @return {number}
		 */
		static numberFromBytes(bytes) {
			var hex = '';
			var stringResult;

			bytes.forEach((byte) => {
				stringResult = byte.toString(16);

				// ensure string is 2 chars
				if (stringResult.length == 1) stringResult = "0" + stringResult;

				hex += stringResult;
			});

			return parseInt(hex, 16);
		}

		/**
		 * Takes a number and splits it up into an array of bytes.  Can be padded by passing a number to bytesNeeded
		 * @param {number} number
		 * @param {number} bytesNeeded
		 * @return {array} - Array of bytes
		 */
		static numberToBytes(number, bytesNeeded) {
			bytesNeeded = bytesNeeded || 1;

			var hexString = number.toString(16);

			if (hexString.length & 1) { // Make sure hex string is even number of chars
				hexString = '0' + hexString;
			}

			// Split hex string into an array of two char elements
			var hexArray = hexString.match(/.{2}/g);

			// Now parse them out as integers
			hexArray = hexArray.map(item => parseInt(item, 16));

			// Prepend empty bytes if we don't have enough
			if (hexArray.length < bytesNeeded) {
				while (bytesNeeded - hexArray.length > 0) {
					hexArray.unshift(0);
				}
			}

			return hexArray;
		}

		/**
		 * Converts value to array if needed.
		 * @param {string} value
		 * @return {array}
		 */
		static toArray(value) {
			if (Array.isArray(value)) return value;
			return [value];
		}

		/**
		 * Converts velocity to value 0-127
		 * @param {number} velocity - Velocity value 1-100
		 * @return {number}
		 */
		static convertVelocity(velocity) {
			// Max passed value limited to 100
			velocity = velocity > 100 ? 100 : velocity;
			return Math.round(velocity / 100 * 127);
		}

		/**
		 * Gets the total number of ticks of a specified duration.
		 * Note: type=='note' defaults to quarter note, type==='rest' defaults to 0
		 * @param {(string|array)} duration
		 * @return {number}
		 */
		static getTickDuration(duration) {
			if (Array.isArray(duration)) {
				// Recursively execute this method for each item in the array and return the sum of tick durations.
				return duration.map((value) => {
					return Utils.getTickDuration(value);
				}).reduce((a, b) => {
					return a + b;
				}, 0);
			}

			duration = duration.toString();

			if (duration.toLowerCase().charAt(0) === 't') {
				// If duration starts with 't' then the number that follows is an explicit tick count
				const ticks = parseInt(duration.substring(1));

				if (isNaN(ticks) || ticks < 0) {
					throw new Error(duration + ' is not a valid duration.');
				}

				return ticks;
			}

			// Need to apply duration here.  Quarter note == Constants.HEADER_CHUNK_DIVISION
			var quarterTicks = Utils.numberFromBytes(Constants.HEADER_CHUNK_DIVISION);
			const tickDuration = quarterTicks * Utils.getDurationMultiplier(duration);
			return Utils.getRoundedIfClose(tickDuration)
		}

		/**
		 * Due to rounding errors in JavaScript engines,
		 * it's safe to round when we're very close to the actual tick number
		 *
		 * @static
		 * @param {number} tick
		 * @return {number}
		 */
		static getRoundedIfClose(tick) {
			const roundedTick = Math.round(tick);
			return Math.abs(roundedTick - tick) < 0.000001 ? roundedTick : tick;
		}

		/**
		 * Due to low precision of MIDI,
		 * we need to keep track of rounding errors in deltas.
		 * This function will calculate the rounding error for a given duration.
		 *
		 * @static
		 * @param {number} tick
		 * @return {number}
		 */
		static getPrecisionLoss(tick) {
			const roundedTick = Math.round(tick);
			return roundedTick - tick;
		}

		/**
		 * Gets what to multiple ticks/quarter note by to get the specified duration.
		 * Note: type=='note' defaults to quarter note, type==='rest' defaults to 0
		 * @param {string} duration
		 * @return {number}
		 */
		static getDurationMultiplier(duration) {
			// Need to apply duration here.
			// Quarter note == Constants.HEADER_CHUNK_DIVISION ticks.

			if (duration === '0') return 0;

			const match = duration.match(/^(?<dotted>d+)?(?<base>\d+)(?:t(?<tuplet>\d*))?/);
			if (match) {
				const base = Number(match.groups.base);
				// 1 or any power of two:
				const isValidBase = base === 1 || ((base & (base - 1)) === 0);
				if (isValidBase) {
					// how much faster or slower is this note compared to a quarter?
					const ratio = base / 4;
					let durationInQuarters = 1 / ratio;
					const {dotted, tuplet} = match.groups;
					if (dotted) {
						const thisManyDots = dotted.length;
						const divisor = Math.pow(2, thisManyDots);
						durationInQuarters = durationInQuarters + (durationInQuarters * ((divisor - 1) / divisor));
					}
					if (typeof tuplet === 'string') {
						const fitInto = durationInQuarters * 2;
						// default to triplet:
						const thisManyNotes = Number(tuplet || '3');
						durationInQuarters = fitInto / thisManyNotes;
					}
					return durationInQuarters
				}
			}
			throw new Error(duration + ' is not a valid duration.');
		}
	}

	/**
	 * Holds all data for a "controller change" MIDI event
	 * @param {object} fields {controllerNumber: integer, controllerValue: integer, delta: integer}
	 * @return {ControllerChangeEvent}
	 */
	class ControllerChangeEvent {
		constructor(fields) {
			// Set default fields
			fields = Object.assign({
				delta: 0x00,
			}, fields);

			this.type = 'controller';
			// delta time defaults to 0.
			this.data = Utils.numberToVariableLength(fields.delta).concat(Constants.CONTROLLER_CHANGE_STATUS, fields.controllerNumber, fields.controllerValue);
		}
	}

	/**
	 * Object representation of a cue point meta event.
	 * @param {object} fields {text: string, delta: integer}
	 * @return {CuePointEvent}
	 */
	class CuePointEvent {
		constructor(fields) {
			// Set default fields
			fields = Object.assign({
				delta: 0x00,
			}, fields);

			this.type = 'cue-point';

			const textBytes = Utils.stringToBytes(fields.text);

			// Start with zero time delta
			this.data = Utils.numberToVariableLength(fields.delta).concat(
				Constants.META_EVENT_ID,
				Constants.META_CUE_POINT,
				Utils.numberToVariableLength(textBytes.length), // Size
				textBytes, // Text
			);
		}
	}

	/**
	 * Object representation of a end track meta event.
	 * @param {object} fields {delta: integer}
	 * @return {EndTrackEvent}
	 */
	class EndTrackEvent {
		constructor(fields) {
			// Set default fields
			fields = Object.assign({
				delta: 0x00,
			}, fields);

			this.type = 'end-track';

			// Start with zero time delta
			this.data = Utils.numberToVariableLength(fields.delta).concat(
				Constants.META_EVENT_ID,
				Constants.META_END_OF_TRACK_ID
			);
		}
	}

	/**
	 * Object representation of an instrument name meta event.
	 * @param {object} fields {text: string, delta: integer}
	 * @return {InstrumentNameEvent}
	 */
	class InstrumentNameEvent {
		constructor(fields) {
			// Set default fields
			fields = Object.assign({
				delta: 0x00,
			}, fields);

			this.type = 'instrument-name';

			const textBytes = Utils.stringToBytes(fields.text);

			// Start with zero time delta
			this.data = Utils.numberToVariableLength(fields.delta).concat(
				Constants.META_EVENT_ID,
				Constants.META_INSTRUMENT_NAME_ID,
				Utils.numberToVariableLength(textBytes.length), // Size
				textBytes, // Instrument name
			);
		}
	}

	/**
	 * Object representation of a key signature meta event.
	 * @return {KeySignatureEvent}
	 */
	class KeySignatureEvent {
		constructor(sf, mi) {
			this.type = 'key-signature';

			var mode = mi || 0;
			sf = sf || 0;

			//	Function called with string notation
			if (typeof mi === 'undefined') {
				var fifths = [
					['Cb', 'Gb', 'Db', 'Ab', 'Eb', 'Bb', 'F', 'C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#'],
					['ab', 'eb', 'bb', 'f', 'c', 'g', 'd', 'a', 'e', 'b', 'f#', 'c#', 'g#', 'd#', 'a#']
				];
				var _sflen = sf.length;
				var note = sf || 'C';

				if (sf[0] === sf[0].toLowerCase()) mode = 1;

				if (_sflen > 1) {
					switch (sf.charAt(_sflen - 1)) {
						case 'm':
							mode = 1;
							note = sf.charAt(0).toLowerCase();
							note = note.concat(sf.substring(1, _sflen - 1));
							break;
						case '-':
							mode = 1;
							note = sf.charAt(0).toLowerCase();
							note = note.concat(sf.substring(1, _sflen - 1));
							break;
						case 'M':
							mode = 0;
							note = sf.charAt(0).toUpperCase();
							note = note.concat(sf.substring(1, _sflen - 1));
							break;
						case '+':
							mode = 0;
							note = sf.charAt(0).toUpperCase();
							note = note.concat(sf.substring(1, _sflen - 1));
							break;
					}
				}

				var fifthindex = fifths[mode].indexOf(note);
				sf = fifthindex === -1 ? 0 : fifthindex - 7;
			}

			// Start with zero time delta
			this.data = Utils.numberToVariableLength(0x00).concat(
				Constants.META_EVENT_ID,
				Constants.META_KEY_SIGNATURE_ID,
				[0x02], // Size
				Utils.numberToBytes(sf, 1), // Number of sharp or flats ( < 0 flat; > 0 sharp)
				Utils.numberToBytes(mode, 1), // Mode: 0 major, 1 minor
			);
		}
	}

	/**
	 * Object representation of a lyric meta event.
	 * @param {object} fields {text: string, delta: integer}
	 * @return {LyricEvent}
	 */
	class LyricEvent {
		constructor(fields) {
			// Set default fields
			fields = Object.assign({
				delta: 0x00,
			}, fields);

			this.type = 'lyric';

			const textBytes = Utils.stringToBytes(fields.text);

			// Start with zero time delta
			this.data = Utils.numberToVariableLength(fields.delta).concat(
				Constants.META_EVENT_ID,
				Constants.META_LYRIC_ID,
				Utils.numberToVariableLength(textBytes.length), // Size
				textBytes, // Text
			);
		}
	}

	/**
	 * Object representation of a marker meta event.
	 * @param {object} fields {text: string, delta: integer}
	 * @return {MarkerEvent}
	 */
	class MarkerEvent {
		constructor(fields) {
			// Set default fields
			fields = Object.assign({
				delta: 0x00,
			}, fields);

			this.type = 'marker';

			const textBytes = Utils.stringToBytes(fields.text);

			// Start with zero time delta
			this.data = Utils.numberToVariableLength(fields.delta).concat(
				Constants.META_EVENT_ID,
				Constants.META_MARKER_ID,
				Utils.numberToVariableLength(textBytes.length), // Size
				textBytes, // Text
			);
		}
	}

	/**
	 * Holds all data for a "note on" MIDI event
	 * @param {object} fields {data: []}
	 * @return {NoteOnEvent}
	 */
	class NoteOnEvent {
		constructor(fields) {
			// Set default fields
			fields = Object.assign({
				channel: 1,
				startTick: null,
				velocity: 50,
				wait: 0,
			}, fields);

			this.type 		= 'note-on';
			this.channel 	= fields.channel;
			this.pitch 		= fields.pitch;
			this.wait 		= fields.wait;
			this.velocity 	= fields.velocity;
			this.startTick 	= fields.startTick;

			this.tick 		= null;
			this.delta 		= null;
			this.data 		= fields.data;
		}

		/**
		 * Builds int array for this event.
		 * @param {Track} track - parent track
		 * @return {NoteOnEvent}
		 */
		buildData(track, precisionDelta, options = {}) {
			this.data = [];

			// Explicitly defined startTick event
			if (this.startTick) {
				this.tick = Utils.getRoundedIfClose(this.startTick);

				// If this is the first event in the track then use event's starting tick as delta.
				if (track.tickPointer == 0) {
					this.delta = this.tick;
				}

			} else {
				this.delta = Utils.getTickDuration(this.wait);
				this.tick = Utils.getRoundedIfClose(track.tickPointer + this.delta);
			}

			this.deltaWithPrecisionCorrection = Utils.getRoundedIfClose(this.delta - precisionDelta);

			this.data = Utils.numberToVariableLength(this.deltaWithPrecisionCorrection)
						.concat(
								this.getStatusByte(),
								Utils.getPitch(this.pitch, options.middleC),
								Utils.convertVelocity(this.velocity)
						);

			return this;
		}

		/**
		 * Gets the note on status code based on the selected channel. 0x9{0-F}
		 * Note on at channel 0 is 0x90 (144)
		 * 0 = Ch 1
		 * @return {number}
		 */
		getStatusByte() {return 144 + this.channel - 1}
	}

	/**
	 * Holds all data for a "note off" MIDI event
	 * @param {object} fields {data: []}
	 * @return {NoteOffEvent}
	 */
	class NoteOffEvent {
		constructor(fields) {
			// Set default fields
			fields = Object.assign({
				channel: 1,
				velocity: 50,
				tick: null,
			}, fields);

			this.type 		= 'note-off';
			this.channel 	= fields.channel;
			this.pitch 		= fields.pitch;
			this.duration 	= fields.duration;
			this.velocity 	= fields.velocity;

			this.tick 		= fields.tick;
			this.delta 		= Utils.getTickDuration(this.duration);
			this.data 		= fields.data;
		}

		/**
		 * Builds int array for this event.
		 * @param {Track} track - parent track
		 * @return {NoteOffEvent}
		 */
		buildData(track, precisionDelta, options = {}) {
			if (this.tick === null) {
				this.tick = Utils.getRoundedIfClose(this.delta + track.tickPointer);
			}

			this.deltaWithPrecisionCorrection = Utils.getRoundedIfClose(this.delta - precisionDelta);

			this.data = Utils.numberToVariableLength(this.deltaWithPrecisionCorrection)
						.concat(
								this.getStatusByte(),
								Utils.getPitch(this.pitch, options.middleC),
								Utils.convertVelocity(this.velocity)
						);

			return this;
		}

		/**
		 * Gets the note off status code based on the selected channel. 0x8{0-F}
		 * Note off at channel 0 is 0x80 (128)
		 * 0 = Ch 1
		 * @return {number}
		 */
		getStatusByte() {return 128 + this.channel - 1}
	}

	/**
	 * Wrapper for noteOnEvent/noteOffEvent objects that builds both events.
	 * @param {object} fields - {pitch: '[C4]', duration: '4', wait: '4', velocity: 1-100}
	 * @return {NoteEvent}
	 */
	class NoteEvent {
		constructor(fields) {
			// Set default fields
			fields = Object.assign({
				channel: 1,
				repeat: 1,
				sequential: false,
				startTick: null,
				velocity: 50,
				wait: 0,
			}, fields);

			this.data 		= [];
			this.type 		= 'note';
			this.pitch 		= Utils.toArray(fields.pitch);

			this.channel 	= fields.channel;
			this.duration 	= fields.duration;
			this.grace		= fields.grace;
			this.repeat 	= fields.repeat;
			this.sequential = fields.sequential;
			this.startTick	= fields.startTick;
			this.velocity 	= fields.velocity;
			this.wait 		= fields.wait;

			this.tickDuration = Utils.getTickDuration(this.duration);
			this.restDuration = Utils.getTickDuration(this.wait);

			this.events 	= []; // Hold actual NoteOn/NoteOff events
		}

		/**
		 * Builds int array for this event.
		 * @return {NoteEvent}
		 */
		buildData() {
			// Reset data array
			this.data = [];

			// Apply grace note(s) and subtract ticks (currently 1 tick per grace note) from tickDuration so net value is the same
			if (this.grace) {
				let graceDuration = 1;
				this.grace = Utils.toArray(this.grace);
				this.grace.forEach(() => {
					let noteEvent = new NoteEvent({pitch: this.grace, duration:'T' + graceDuration});
					this.data = this.data.concat(noteEvent.data);
				});
			}

			// fields.pitch could be an array of pitches.
			// If so create note events for each and apply the same duration.

			// By default this is a chord if it's an array of notes that requires one NoteOnEvent.
			// If this.sequential === true then it's a sequential string of notes that requires separate NoteOnEvents.
			if ( ! this.sequential) {
				// Handle repeat
				for (let j = 0; j < this.repeat; j++) {
					// Note on
					this.pitch.forEach((p, i) => {
						let noteOnNew;

						if (i == 0) {
							noteOnNew = new NoteOnEvent({
								channel: this.channel,
								wait: this.wait,
								velocity: this.velocity,
								pitch: p,
								startTick: this.startTick
							});

						} else {
							// Running status (can ommit the note on status)
							//noteOn = new NoteOnEvent({data: [0, Utils.getPitch(p), Utils.convertVelocity(this.velocity)]});
							noteOnNew = new NoteOnEvent({
								channel: this.channel,
								wait: 0,
								velocity: this.velocity,
								pitch: p,
								startTick: this.startTick
							});
						}

						this.events.push(noteOnNew);
					});

					// Note off
					this.pitch.forEach((p, i) => {
						let noteOffNew;

						if (i == 0) {
							//noteOff = new NoteOffEvent({data: Utils.numberToVariableLength(tickDuration).concat(this.getNoteOffStatus(), Utils.getPitch(p), Utils.convertVelocity(this.velocity))});
							noteOffNew = new NoteOffEvent({
								channel: this.channel,
								duration: this.duration,
								velocity: this.velocity,
								pitch: p,
								tick: this.startTick !== null ? Utils.getTickDuration(this.duration) + this.startTick : null,
							});

						} else {
							// Running status (can ommit the note off status)
							//noteOff = new NoteOffEvent({data: [0, Utils.getPitch(p), Utils.convertVelocity(this.velocity)]});
							noteOffNew = new NoteOffEvent({
								channel: this.channel,
								duration: 0,
								velocity: this.velocity,
								pitch: p,
								tick: this.startTick !== null ? Utils.getTickDuration(this.duration) + this.startTick : null,
							});
						}

						this.events.push(noteOffNew);
					});
				}

			} else {
				// Handle repeat
				for (let j = 0; j < this.repeat; j++) {
					this.pitch.forEach((p, i) => {
						const noteOnNew = new NoteOnEvent({
							channel: this.channel,
							wait: (i > 0 ? 0 : this.wait), // wait only applies to first note in repetition
							velocity: this.velocity,
							pitch: p,
							startTick: this.startTick,
						});

						const noteOffNew = new NoteOffEvent({
							channel: this.channel,
							duration: this.duration,
							velocity: this.velocity,
							pitch: p,
						});

						this.events.push(noteOnNew, noteOffNew);
					});
				}
			}

			return this;
		}
	}

	/**
	 * Holds all data for a "Pitch Bend" MIDI event
	 * [ -1.0, 0, 1.0 ] ->  [ 0, 8192, 16383]
	 * @param {object} fields { bend : float, channel : int, delta: int }
	 * @return {PitchBendEvent}
	 */
	const scale14bits = (zeroOne) => {
	    if ( zeroOne <= 0 ) {
	        return Math.floor( 16384 * ( zeroOne + 1 ) / 2 );
	    }

	    return Math.floor( 16383 * ( zeroOne + 1 ) / 2 );
	};

	class PitchBendEvent {
	    constructor(fields) {
	        // Set default fields
			fields = Object.assign({
				delta: 0x00,
			}, fields);

			this.type = 'pitch-bend';
	 
			let bend14 = scale14bits(fields.bend);
			let channel = fields.channel || 0;

			let lsbValue = bend14 & 0x7f;          
			let msbValue = ( bend14 >> 7 ) & 0x7f;
			this.data = Utils.numberToVariableLength(fields.delta).concat(Constants.PITCH_BEND_STATUS | channel, lsbValue, msbValue);
	    }
	}

	/**
	 * Holds all data for a "program change" MIDI event
	 * @param {object} fields {instrument: integer, delta: integer}
	 * @return {ProgramChangeEvent}
	 */
	class ProgramChangeEvent {
		constructor(fields) {
			// Set default fields
			this.fields = Object.assign({
				channel: 1,
				delta: 0x00,
			}, fields);

			this.type = 'program';
			// delta time defaults to 0.
			this.data = Utils.numberToVariableLength(this.fields.delta).concat(this.getStatusByte(), this.fields.instrument);
		}


		/**
		 * Gets the status code based on the selected channel. 0xC{0-F}
		 * Program change status byte for channel 0 is 0xC0 (192)
		 * 0 = Ch 1
		 * @return {number}
		 */
		getStatusByte() {return 192 + this.fields.channel - 1}
	}

	/**
	 * Object representation of a tempo meta event.
	 * @param {object} fields {bpm: integer, delta: integer}
	 * @return {TempoEvent}
	 */
	class TempoEvent {
		constructor(fields) {
			// Set default fields
			fields = Object.assign({
				delta: 0x00,
			}, fields);

			this.type = 'tempo';

			this.tick = fields.tick;

			const tempo = Math.round(60000000 / fields.bpm);

			// Start with zero time delta
			this.data = Utils.numberToVariableLength(fields.delta).concat(
				Constants.META_EVENT_ID,
				Constants.META_TEMPO_ID,
				[0x03], // Size
				Utils.numberToBytes(tempo, 3), // Tempo, 3 bytes
			);
		}
	}

	/**
	 * Object representation of a tempo meta event.
	 * @param {object} fields {text: string, delta: integer}
	 * @return {TextEvent}
	 */
	class TextEvent {
		constructor(fields) {
			// Set default fields
			fields = Object.assign({
				delta: 0x00,
			}, fields);

			this.type = 'text';

			const textBytes = Utils.stringToBytes(fields.text);

			// Start with zero time delta
			this.data = Utils.numberToVariableLength(fields.delta).concat(
				Constants.META_EVENT_ID,
				Constants.META_TEXT_ID,
				Utils.numberToVariableLength(textBytes.length), // Size
				textBytes, // Text
			);
		}
	}

	/**
	 * Object representation of a time signature meta event.
	 * @return {TimeSignatureEvent}
	 */
	class TimeSignatureEvent {
		constructor(numerator, denominator, midiclockspertick, notespermidiclock) {
			this.type = 'time-signature';

			// Start with zero time delta
			this.data = Utils.numberToVariableLength(0x00).concat(
				Constants.META_EVENT_ID,
				Constants.META_TIME_SIGNATURE_ID,
				[0x04], // Size
				Utils.numberToBytes(numerator, 1), // Numerator, 1 bytes
				Utils.numberToBytes(Math.log2(denominator), 1), // Denominator is expressed as pow of 2, 1 bytes
				Utils.numberToBytes(midiclockspertick || 24, 1), // MIDI Clocks per tick, 1 bytes
				Utils.numberToBytes(notespermidiclock || 8, 1), // Number of 1/32 notes per MIDI clocks, 1 bytes
			);
		}
	}

	/**
	 * Object representation of a tempo meta event.
	 * @param {object} fields {text: string, delta: integer}
	 * @return {CopyrightEvent}
	 */
	class CopyrightEvent {
		constructor(fields) {
			// Set default fields
			fields = Object.assign({
				delta: 0x00,
			}, fields);

			this.type = 'copyright';

			const textBytes = Utils.stringToBytes(fields.text);

			// Start with zero time delta
			this.data = Utils.numberToVariableLength(fields.delta).concat(
				Constants.META_EVENT_ID,
				Constants.META_COPYRIGHT_ID,
				Utils.numberToVariableLength(textBytes.length), // Size
				textBytes, // Text
			);
		}
	}

	/**
	 * Object representation of a tempo meta event.
	 * @param {object} fields {text: string, delta: integer}
	 * @return {TrackNameEvent}
	 */
	class TrackNameEvent {
		constructor(fields) {
			// Set default fields
			fields = Object.assign({
				delta: 0x00,
			}, fields);

			this.type = 'track-name';

			const textBytes = Utils.stringToBytes(fields.text);

			// Start with zero time delta
			this.data = Utils.numberToVariableLength(fields.delta).concat(
				Constants.META_EVENT_ID,
				Constants.META_TRACK_NAME_ID,
				Utils.numberToVariableLength(textBytes.length), // Size
				textBytes, // Text
			);
		}
	}

	/**
	 * Holds all data for a track.
	 * @param {object} fields {type: number, data: array, size: array, events: array}
	 * @return {Track}
	 */
	var Track = /** @class */ (function () {
	    function Track() {
	        this.type = Constants.TRACK_CHUNK_TYPE;
	        this.data = [];
	        this.size = [];
	        this.events = [];
	        this.explicitTickEvents = [];
	        // If there are any events with an explicit tick defined then we will create a "sub" track for those
	        // and merge them in and the end.
	        this.tickPointer = 0; // Each time an event is added this will increase
	    }
	    /**
	     * Adds any event type to the track.
	     * Events without a specific startTick property are assumed to be added in order of how they should output.
	     * Events with a specific startTick property are set aside for now will be merged in during build process.
	     * @param {(NoteEvent|ProgramChangeEvent)} events - Event object or array of Event objects.
	     * @param {Function} mapFunction - Callback which can be used to apply specific properties to all events.
	     * @return {Track}
	     */
	    Track.prototype.addEvent = function (events, mapFunction) {
	        var _this = this;
	        Utils.toArray(events).forEach(function (event, i) {
	            if (event instanceof NoteEvent) {
	                // Handle map function if provided
	                if (typeof mapFunction === 'function') {
	                    var properties = mapFunction(i, event);
	                    if (typeof properties === 'object') {
	                        for (var j in properties) {
	                            switch (j) {
	                                case 'channel':
	                                    event.channel = properties[j];
	                                    break;
	                                case 'duration':
	                                    event.duration = properties[j];
	                                    break;
	                                case 'sequential':
	                                    event.sequential = properties[j];
	                                    break;
	                                case 'velocity':
	                                    event.velocity = Utils.convertVelocity(properties[j]);
	                                    break;
	                            }
	                        }
	                    }
	                }
	                // If this note event has an explicit startTick then we need to set aside for now
	                if (event.startTick !== null) {
	                    _this.explicitTickEvents.push(event);
	                }
	                else {
	                    // Push each on/off event to track's event stack
	                    event.buildData().events.forEach(function (e) { return _this.events.push(e); });
	                }
	            }
	            else if (event instanceof EndTrackEvent) {
	                // Only one EndTrackEvent is allowed, so remove
	                // any existing ones before adding.
	                _this.removeEventsByType('end-track');
	                _this.events.push(event);
	            }
	            else {
	                _this.events.push(event);
	            }
	        });
	        return this;
	    };
	    /**
	     * Builds int array of all events.
	     * @param {object} options
	     * @return {Track}
	     */
	    Track.prototype.buildData = function (options) {
	        var _this = this;
	        if (options === void 0) { options = {}; }
	        // If the last event isn't EndTrackEvent, then tack it onto the data.
	        if (!this.events.length || !(this.events[this.events.length - 1] instanceof EndTrackEvent)) {
	            this.addEvent(new EndTrackEvent());
	        }
	        // Reset
	        this.data = [];
	        this.size = [];
	        this.tickPointer = 0;
	        var precisionLoss = 0;
	        this.events.forEach(function (event) {
	            // Build event & add to total tick duration
	            if (event instanceof NoteOnEvent || event instanceof NoteOffEvent) {
	                var built = event.buildData(_this, precisionLoss, options);
	                precisionLoss = Utils.getPrecisionLoss(event.deltaWithPrecisionCorrection || 0);
	                _this.data = _this.data.concat(built.data);
	                _this.tickPointer = Utils.getRoundedIfClose(event.tick);
	            }
	            else if (event instanceof TempoEvent) {
	                _this.tickPointer = Utils.getRoundedIfClose(event.tick);
	                _this.data = _this.data.concat(event.data);
	            }
	            else {
	                _this.data = _this.data.concat(event.data);
	            }
	        });
	        this.mergeExplicitTickEvents();
	        this.size = Utils.numberToBytes(this.data.length, 4); // 4 bytes long
	        return this;
	    };
	    Track.prototype.mergeExplicitTickEvents = function () {
	        var _this = this;
	        if (!this.explicitTickEvents.length)
	            return;
	        // First sort asc list of events by startTick
	        this.explicitTickEvents.sort(function (a, b) { return a.startTick - b.startTick; });
	        // Now this.explicitTickEvents is in correct order, and so is this.events naturally.
	        // For each explicit tick event, splice it into the main list of events and
	        // adjust the delta on the following events so they still play normally.
	        this.explicitTickEvents.forEach(function (noteEvent) {
	            // Convert NoteEvent to it's respective NoteOn/NoteOff events
	            // Note that as we splice in events the delta for the NoteOff ones will
	            // Need to change based on what comes before them after the splice.
	            noteEvent.buildData().events.forEach(function (e) { return e.buildData(_this); });
	            // Merge each event indivually into this track's event list.
	            noteEvent.events.forEach(function (event) { return _this.mergeSingleEvent(event); });
	        });
	        // Hacky way to rebuild track with newly spliced events.  Need better solution.
	        this.explicitTickEvents = [];
	        this.buildData();
	    };
	    /**
	     * Merges another track's events with this track.
	     * @param {Track} track
	     * @return {Track}
	     */
	    Track.prototype.mergeTrack = function (track) {
	        var _this = this;
	        // First build this track to populate each event's tick property
	        this.buildData();
	        // Then build track to be merged so that tick property is populated on all events & merge each event.
	        track.buildData().events.forEach(function (event) { return _this.mergeSingleEvent(event); });
	    };
	    /**
	     * Merges a single event into this track's list of events based on event.tick property.
	     * @param {NoteOnEvent|NoteOffEvent} - event
	     * @return {Track}
	     */
	    Track.prototype.mergeSingleEvent = function (event) {
	        // There are no events yet, so just add it in.
	        if (!this.events.length) {
	            this.addEvent(event);
	            return;
	        }
	        // Find index of existing event we need to follow with
	        var lastEventIndex;
	        for (var i = 0; i < this.events.length; i++) {
	            if (this.events[i].tick > event.tick)
	                break;
	            lastEventIndex = i;
	        }
	        var splicedEventIndex = lastEventIndex + 1;
	        // Need to adjust the delta of this event to ensure it falls on the correct tick.
	        event.delta = event.tick - this.events[lastEventIndex].tick;
	        // Splice this event at lastEventIndex + 1
	        this.events.splice(splicedEventIndex, 0, event);
	        // Now adjust delta of all following events
	        for (var i = splicedEventIndex + 1; i < this.events.length; i++) {
	            // Since each existing event should have a tick value at this point we just need to
	            // adjust delta to that the event still falls on the correct tick.
	            this.events[i].delta = this.events[i].tick - this.events[i - 1].tick;
	        }
	    };
	    /**
	     * Removes all events matching specified type.
	     * @param {string} eventType - Event type
	     * @return {Track}
	     */
	    Track.prototype.removeEventsByType = function (eventType) {
	        var _this = this;
	        this.events.forEach(function (event, index) {
	            if (event.type === eventType) {
	                _this.events.splice(index, 1);
	            }
	        });
	        return this;
	    };
	    /**
	     * Sets tempo of the MIDI file.
	     * @param {number} bpm - Tempo in beats per minute.
	     * @param {number} tick - Start tick.
	     * @return {Track}
	     */
	    Track.prototype.setTempo = function (bpm, tick) {
	        if (tick === void 0) { tick = 0; }
	        return this.addEvent(new TempoEvent({ bpm: bpm, tick: tick }));
	    };
	    /**
	     * Sets time signature.
	     * @param {number} numerator - Top number of the time signature.
	     * @param {number} denominator - Bottom number of the time signature.
	     * @param {number} midiclockspertick - Defaults to 24.
	     * @param {number} notespermidiclock - Defaults to 8.
	     * @return {Track}
	     */
	    Track.prototype.setTimeSignature = function (numerator, denominator, midiclockspertick, notespermidiclock) {
	        return this.addEvent(new TimeSignatureEvent(numerator, denominator, midiclockspertick, notespermidiclock));
	    };
	    /**
	     * Sets key signature.
	     * @param {*} sf -
	     * @param {*} mi -
	     * @return {Track}
	     */
	    Track.prototype.setKeySignature = function (sf, mi) {
	        return this.addEvent(new KeySignatureEvent(sf, mi));
	    };
	    /**
	     * Adds text to MIDI file.
	     * @param {string} text - Text to add.
	     * @return {Track}
	     */
	    Track.prototype.addText = function (text) {
	        return this.addEvent(new TextEvent({ text: text }));
	    };
	    /**
	     * Adds copyright to MIDI file.
	     * @param {string} text - Text of copyright line.
	     * @return {Track}
	     */
	    Track.prototype.addCopyright = function (text) {
	        return this.addEvent(new CopyrightEvent({ text: text }));
	    };
	    /**
	     * Adds Sequence/Track Name.
	     * @param {string} text - Text of track name.
	     * @return {Track}
	     */
	    Track.prototype.addTrackName = function (text) {
	        return this.addEvent(new TrackNameEvent({ text: text }));
	    };
	    /**
	     * Sets instrument name of track.
	     * @param {string} text - Name of instrument.
	     * @return {Track}
	     */
	    Track.prototype.addInstrumentName = function (text) {
	        return this.addEvent(new InstrumentNameEvent({ text: text }));
	    };
	    /**
	     * Adds marker to MIDI file.
	     * @param {string} text - Marker text.
	     * @return {Track}
	     */
	    Track.prototype.addMarker = function (text) {
	        return this.addEvent(new MarkerEvent({ text: text }));
	    };
	    /**
	     * Adds cue point to MIDI file.
	     * @param {string} text - Text of cue point.
	     * @return {Track}
	     */
	    Track.prototype.addCuePoint = function (text) {
	        return this.addEvent(new CuePointEvent({ text: text }));
	    };
	    /**
	     * Adds lyric to MIDI file.
	     * @param {string} text - Lyric text to add.
	     * @return {Track}
	     */
	    Track.prototype.addLyric = function (text) {
	        return this.addEvent(new LyricEvent({ text: text }));
	    };
	    /**
	     * Channel mode messages
	     * @return {Track}
	     */
	    Track.prototype.polyModeOn = function () {
	        var event = new NoteOnEvent({ data: [0x00, 0xB0, 0x7E, 0x00] });
	        return this.addEvent(event);
	    };
	    /**
	     * Sets a pitch bend.
	     * @param {float} bend - Bend value ranging [-1,1], zero meaning no bend.
	     * @return {Track}
	     */
	    Track.prototype.setPitchBend = function (bend) {
	        return this.addEvent(new PitchBendEvent({ bend: bend }));
	    };
	    /**
	     * Adds a controller change event
	     * @param {number} number - Control number.
	     * @param {number} value - Control value.
	     * @return {Track}
	     */
	    Track.prototype.controllerChange = function (number, value) {
	        return this.addEvent(new ControllerChangeEvent({ controllerNumber: number, controllerValue: value }));
	    };
	    return Track;
	}());

	class VexFlow {

		/**
		 * Support for converting VexFlow voice into MidiWriterJS track
		 * @return MidiWriter.Track object
		 */
		trackFromVoice(voice, options = {addRenderedAccidentals: false}) {
			const track = new Track();
			let wait = [];

			voice.tickables.forEach(tickable => {
				if (tickable.noteType === 'n') {
					track.addEvent(new NoteEvent({
						pitch: tickable.keys.map((pitch, index) => this.convertPitch(pitch, index, tickable, options.addRenderedAccidentals)),
						duration: this.convertDuration(tickable),
						wait
					}));
					// reset wait
					wait = [];
				} else if (tickable.noteType === 'r') {
					// move on to the next tickable and add this to the stack
					// of the `wait` property for the next note event
					wait.push(this.convertDuration(tickable));
				}
			});

			// There may be outstanding rests at the end of the track,
			// pad with a ghost note (zero duration and velocity), just to capture the wait.
			if(wait.length > 0) {
				track.addEvent(new NoteEvent({pitch: '[c4]', duration: '0', wait, velocity: '0'}));
			}

			return track;
		}

		/**
		 * Converts VexFlow pitch syntax to MidiWriterJS syntax
		 * @param pitch string
		 * @param index pitch index
		 * @param note struct from Vexflow
		 * @param addRenderedAccidentals adds Vexflow rendered accidentals
		 */
		convertPitch(pitch, index, note, addRenderedAccidentals = false) {
			// Splits note name from octave
			const pitchParts = pitch.split('/');

			// Retrieves accidentals from pitch
			// Removes natural accidentals since they are not accepted in Tonal Midi
			let accidentals = pitchParts[0].substring(1).replace('n', '');
			
			if (addRenderedAccidentals) {
				note.getAccidentals()?.forEach(accidental => {
					if (accidental.index === index) {
						if (accidental.type === 'n') {
							accidentals = '';
						} else {
							accidentals += accidental.type;
						}
					}
				});
			}

			return pitchParts[0][0] + accidentals + pitchParts[1];
		}

		/**
		 * Converts VexFlow duration syntax to MidiWriterJS syntax
		 * @param note struct from VexFlow
		 */
		convertDuration(note) {
			return 'd'.repeat(note.dots) + this.convertBaseDuration(note.duration) + (note.tuplet ? 't' + note.tuplet.num_notes : '');
		}

		/**
		 * Converts VexFlow base duration syntax to MidiWriterJS syntax
		 * @param duration Vexflow duration
		 * @returns MidiWriterJS duration
		 */
		convertBaseDuration(duration) {
			switch (duration) {
				case 'w':
					return '1';
				case 'h':
					return '2';
				case 'q':
					return '4';
				default:
					return duration;
			}
		}
	}

	/**
	 * Object representation of a header chunk section of a MIDI file.
	 * @param {number} numberOfTracks - Number of tracks
	 * @return {HeaderChunk}
	 */
	class HeaderChunk {
		constructor(numberOfTracks) {
			this.type = Constants.HEADER_CHUNK_TYPE;

			const trackType = numberOfTracks > 1 ? Constants.HEADER_CHUNK_FORMAT1 : Constants.HEADER_CHUNK_FORMAT0;

			this.data = trackType.concat(
						Utils.numberToBytes(numberOfTracks, 2), // two bytes long,
						Constants.HEADER_CHUNK_DIVISION
			);

			this.size = [0, 0, 0, this.data.length];
		}
	}

	/**
	 * Object that puts together tracks and provides methods for file output.
	 * @param {array|Track} tracks - A single {Track} object or an array of {Track} objects.
	 * @param {object} options - {middleC: 'C4'}
	 * @return {Writer}
	 */
	class Writer {
		constructor(tracks, options = {}) {
			// Ensure tracks is an array
			this.tracks = Utils.toArray(tracks);
			this.options = options;
		}

		/**
		 * Builds array of data from chunkschunks.
		 * @return {array}
		 */
		buildData() {
			const data = [];
			data.push(new HeaderChunk(this.tracks.length));

			// For each track add final end of track event and build data
			this.tracks.forEach((track) => {
				data.push(track.buildData(this.options));
			});

			return data;
		}

		/**
		 * Builds the file into a Uint8Array
		 * @return {Uint8Array}
		 */
		buildFile() {
			var build = [];

			// Data consists of chunks which consists of data
			this.buildData().forEach((d) => build = build.concat(d.type, d.size, d.data));

			return new Uint8Array(build);
		}

		/**
		 * Convert file buffer to a base64 string.  Different methods depending on if browser or node.
		 * @return {string}
		 */
		base64() {
			if (typeof btoa === 'function') return btoa(String.fromCharCode.apply(null, this.buildFile()));
			return Buffer.from(this.buildFile()).toString('base64');
		}

	    /**
	     * Get the data URI.
	     * @return {string}
	     */
	    dataUri() {
			return 'data:audio/midi;base64,' + this.base64();
	    }


		/**
		 * Set option on instantiated Writer.
		 * @param {string} key
		 * @param {any} value
		 * @return {Writer}
		 */
		setOption(key, value) {
			this.options[key] = value;
			return this;
		}

		/**
		 * Output to stdout
		 * @return {string}
		 */
	    stdout() {
			return process.stdout.write(Buffer.from(this.buildFile()));
	    }
	}

	var main = {
	  Constants,
	  ControllerChangeEvent,
	  CuePointEvent,
	  EndTrackEvent,
	  InstrumentNameEvent,
	  KeySignatureEvent,
	  LyricEvent,
	  MarkerEvent,
	  NoteOnEvent,
	  NoteOffEvent,
	  NoteEvent,
	  PitchBendEvent,
	  ProgramChangeEvent,
	  TempoEvent,
	  TextEvent,
	  TimeSignatureEvent,
	  Track,
	  TrackNameEvent,
	  Utils,
	  VexFlow,
	  Writer
	};

	return main;

})();
