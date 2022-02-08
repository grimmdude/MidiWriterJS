import {Constants} from '../constants';
import {Utils} from '../utils';

/**
 * Holds all data for a "program change" MIDI event
 * @param {object} fields {instrument: integer, delta: integer}
 * @return {ProgramChangeEvent}
 */
class ProgramChangeEvent {
	constructor(fields) {
		// Set default fields
		fields = Object.assign({
			delta: 0x00,
		}, fields);

		this.type = 'program';
		// delta time defaults to 0.
		this.data = Utils.numberToVariableLength(fields.delta).concat(Constants.PROGRAM_CHANGE_STATUS, fields.instrument);
	}
}

export {ProgramChangeEvent};
