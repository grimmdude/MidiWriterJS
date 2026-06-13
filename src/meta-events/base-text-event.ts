import {Constants} from '../constants';
import {MetaEvent} from './meta-event';
import {Utils} from '../utils';

/**
 * Base class for text-based meta events (types 0x01-0x07).
 * These events share identical structure, differing only in type number and name.
 * @param {object} fields {type: number, name: string, text: string, delta: integer}
 * @return {BaseTextEvent}
 */
class BaseTextEvent implements MetaEvent {
	data: number[];
	delta: number;
	name: string;
	text: string;
	type: number;

	constructor(fields: { type: number; name: string; text: string; delta?: number; }) {
		this.delta = fields.delta || 0x00;
		this.name = fields.name;
		this.text = fields.text;
		this.type = fields.type;

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

export {BaseTextEvent};
