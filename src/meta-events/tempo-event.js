import {Constants} from '../constants';
import {Utils} from '../utils';

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

export {TempoEvent};
