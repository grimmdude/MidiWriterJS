import {Constants} from '../constants';
import {MetaEvent} from './meta-event';
import {Utils} from '../utils';

/**
 * Object representation of an instrument name meta event.
 * @param {object} fields {text: string, delta: integer}
 * @return {InstrumentNameEvent}
 */
class InstrumentNameEvent implements MetaEvent {
	data: number[];
	delta: number;
	name: string;
	text: string;
	type: 0x04;

	constructor(fields: { text: string; delta?: number; }) {
		this.delta = fields.delta || 0x00;
		this.name = 'InstrumentNameEvent';
		this.text = fields.text;
		this.type = 0x04;

		const textBytes = Utils.stringToBytes(this.text);

		// Start with zero time delta
		this.data = Utils.numberToVariableLength(this.delta).concat(
			Constants.META_EVENT_ID,
			this.type,
			Utils.numberToVariableLength(textBytes.length), // Size
			textBytes, // Instrument name
		);
	}
}

export {InstrumentNameEvent};
