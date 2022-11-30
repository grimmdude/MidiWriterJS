import {Utils} from '../utils';

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

export {ProgramChangeEvent};
