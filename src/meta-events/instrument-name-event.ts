import {Constants} from '../constants';
import {MetaEvent} from './meta-event';
import {Utils} from '../utils';

/**
 * Object representation of an instrument name meta event.
 * @param {object} fields {text: string, delta: integer}
 * @return {InstrumentNameEvent}
 */
class InstrumentNameEvent implements MetaEvent {
	delta: number;
	text: string;

	constructor(fields: { text: string; delta?: number; }) {
		this.delta = fields.delta || 0x00;
		this.text = fields.text;
	}

	public get data() {
		const textBytes = Utils.stringToBytes(this.text);

		// Start with zero time delta
		return Utils.numberToVariableLength(this.delta).concat(
			Constants.META_EVENT_ID,
			this.type,
			Utils.numberToVariableLength(textBytes.length), // Size
			textBytes, // Instrument name
		);
	}

	public get name() {
		return 'InstrumentNameEvent';
	}

	public get type() {
		return 0x04;
	}
}

export {InstrumentNameEvent};
