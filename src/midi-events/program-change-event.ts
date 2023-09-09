import {MidiEvent} from './midi-event';
import {Utils} from '../utils';

/**
 * Holds all data for a "program change" MIDI event
 * @param {object} fields {instrument: integer, delta: integer}
 * @return {ProgramChangeEvent}
 */
class ProgramChangeEvent implements MidiEvent {
	channel: number;
    data: number[];
    delta: number;
	status: 0xC0;
    name: string;
	instrument: number;

	constructor(fields: { channel?: number; delta?: number; instrument: number; }) {
		this.channel = fields.channel || 0;
		this.delta = fields.delta || 0x00;
		this.instrument = fields.instrument;
		this.status = 0xC0;
		this.name = 'ProgramChangeEvent';
		// delta time defaults to 0.
		this.data = Utils.numberToVariableLength(this.delta).concat(this.status | this.channel, this.instrument);
	}
}

export {ProgramChangeEvent};
