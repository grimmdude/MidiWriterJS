import {Constants} from './constants';
import {toMidi} from 'tonal-midi';

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
	 * @return {number}
	 */
	static getPitch(pitch) {
		return toMidi(pitch);
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

		while (ticks = ticks >> 7) {
			buffer <<= 8;
			buffer |= ((ticks & 0x7F) | 0x80);
		}

		var bList = [];
		while (true) {
			bList.push(buffer & 0xff);

			if (buffer & 0x80) buffer >>= 8
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
			if (stringResult.length == 1) stringResult = "0" + stringResult

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
		hexArray = hexArray.map(item => parseInt(item, 16))

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
			return parseInt(duration.substring(1));
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

export {Utils};
