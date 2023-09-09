import {Constants} from '../constants';
import {MetaEvent} from './meta-event';
import {Utils} from '../utils';

/**
 * Object representation of a tempo meta event.
 * @param {object} fields {bpm: integer, delta: integer}
 * @return {TempoEvent}
 */
class TempoEvent implements MetaEvent {
	bpm: number;
	data: number[];
	delta: number;
	name: string;
	tick: number;
	type: 0x51;
	
	constructor(fields: { bpm: number; tick?: number; delta?: number; }) {
		this.bpm = fields.bpm;
		this.delta = fields.delta || 0x00;
		this.tick = fields.tick;
		this.name = 'TempoEvent';
		this.type = 0x51;

		const tempo = Math.round(60000000 / this.bpm);

		// Start with zero time delta
		this.data = Utils.numberToVariableLength(this.delta).concat(
			Constants.META_EVENT_ID,
			this.type,
			[0x03], // Size
			Utils.numberToBytes(tempo, 3), // Tempo, 3 bytes
		);
	}
}

export {TempoEvent};
