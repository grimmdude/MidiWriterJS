import {Constants} from '../constants';
import {MetaEvent} from './meta-event';
import {Utils} from '../utils';

/**
 * Object representation of a lyric meta event.
 * @param {object} fields {text: string, delta: integer}
 * @return {LyricEvent}
 */
class LyricEvent implements MetaEvent {
	delta: number;
	text: string;

	constructor(fields: { text: string; delta?: number; }) {
		this.delta = fields.delta || 0x00;
		this.text = fields.text;
	}

	public get data() {
		const textBytes = Utils.stringToBytes(this.text);

		return Utils.numberToVariableLength(this.delta).concat(
			Constants.META_EVENT_ID,
			this.type,
			Utils.numberToVariableLength(textBytes.length), // Size
			textBytes, // Text
		);
	}

	public get name() {
		return 'LyricEvent';
	}

	public get type() {
		return 0x05;
	}
}

export {LyricEvent};
