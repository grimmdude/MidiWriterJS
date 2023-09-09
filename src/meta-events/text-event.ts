import {Constants} from '../constants';
import {MetaEvent} from './meta-event';
import {Utils} from '../utils';

/**
 * Object representation of a tempo meta event.
 * @param {object} fields {text: string, delta: integer}
 * @return {TextEvent}
 */
class TextEvent implements MetaEvent {
	data: number[];
	delta: number;
	name: string;
	text: string;
	type: 0x01;

	constructor(fields: { text: string; delta?: number; }) {
		this.delta = fields.delta || 0x00;
		this.text = fields.text;
		this.name = 'TextEvent';
		this.type = 0x01;

		const textBytes = Utils.stringToBytes(this.text);

		// Start with zero time delta
		this.data = Utils.numberToVariableLength(fields.delta).concat(
			Constants.META_EVENT_ID,
			this.type,
			Utils.numberToVariableLength(textBytes.length), // Size
			textBytes, // Text
		);
	}
}

export {TextEvent};
