import {BaseTextEvent} from './base-text-event';

/**
 * Object representation of a marker meta event.
 * @param {object} fields {text: string, delta: integer}
 * @return {MarkerEvent}
 */
class MarkerEvent extends BaseTextEvent {
	type: 0x06;

	constructor(fields: { text: string; delta?: number; }) {
		super({type: 0x06, name: 'MarkerEvent', text: fields.text, delta: fields.delta});
		this.type = 0x06;
	}
}

export {MarkerEvent};
