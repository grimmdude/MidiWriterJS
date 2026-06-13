import {BaseTextEvent} from './base-text-event';

/**
 * Object representation of a copyright meta event.
 * @param {object} fields {text: string, delta: integer}
 * @return {CopyrightEvent}
 */
class CopyrightEvent extends BaseTextEvent {
	type: 0x02;

	constructor(fields: { text: string; delta?: number; }) {
		super({type: 0x02, name: 'CopyrightEvent', text: fields.text, delta: fields.delta});
		this.type = 0x02;
	}
}

export {CopyrightEvent};
