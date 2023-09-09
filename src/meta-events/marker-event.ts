import {Constants} from '../constants';
import {MetaEvent} from './meta-event';
import {Utils} from '../utils';

/**
 * Object representation of a marker meta event.
 * @param {object} fields {text: string, delta: integer}
 * @return {MarkerEvent}
 */
class MarkerEvent implements MetaEvent {
	data: number[];
	delta: number;
	name: string;
	text: string;
	type: 0x06;

	constructor(fields: { text: string; delta?: number; }) {
		this.delta = fields.delta || 0x00;
		this.name = 'MarkerEvent';
		this.text = fields.text;
		this.type = 0x06;

		const textBytes = Utils.stringToBytes(this.text);

		// Start with zero time delta
		this.data = Utils.numberToVariableLength(this.delta).concat(
			Constants.META_EVENT_ID,
			this.type,
			Utils.numberToVariableLength(textBytes.length), // Size
			textBytes, // Text
		);
	}
}

export {MarkerEvent};
