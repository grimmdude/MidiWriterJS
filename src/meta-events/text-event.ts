import {BaseTextEvent} from './base-text-event';

/**
 * Object representation of a text meta event.
 * @param {object} fields {text: string, delta: integer}
 * @return {TextEvent}
 */
class TextEvent extends BaseTextEvent {
	type: 0x01;

	constructor(fields: { text: string; delta?: number; }) {
		super({type: 0x01, name: 'TextEvent', text: fields.text, delta: fields.delta});
		this.type = 0x01;
	}
}

export {TextEvent};
