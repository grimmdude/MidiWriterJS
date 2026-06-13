import {BaseTextEvent} from './base-text-event';

/**
 * Object representation of a lyric meta event.
 * @param {object} fields {text: string, delta: integer}
 * @return {LyricEvent}
 */
class LyricEvent extends BaseTextEvent {
	type: 0x05;

	constructor(fields: { text: string; delta?: number; }) {
		super({type: 0x05, name: 'LyricEvent', text: fields.text, delta: fields.delta});
		this.type = 0x05;
	}
}

export {LyricEvent};
