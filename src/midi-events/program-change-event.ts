import {MidiEvent} from './midi-event';
import {Utils} from '../utils';

/**
 * Holds all data for a "program change" MIDI event
 * @param {object} fields {instrument: integer, delta: integer}
 * @return {ProgramChangeEvent}
 */
class ProgramChangeEvent implements MidiEvent {
	channel: number;
    delta: number;
	instrument: number;

	constructor(fields: { channel?: number; delta?: number; instrument: number; }) {
		this.channel = fields.channel || 0;
		this.delta = fields.delta || 0x00;
		this.instrument = fields.instrument;
	}

	public get data() {
		return Utils.numberToVariableLength(this.delta).concat(this.status, this.instrument);
	}

	public get name() {
		return 'ProgramChangeEvent';
	}

	public get status() {
		return 0xC0 | this.channel;
	}
}

export {ProgramChangeEvent};
