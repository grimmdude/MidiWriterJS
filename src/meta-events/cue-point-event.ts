import {BaseTextEvent} from './base-text-event';

/**
 * Object representation of a cue point meta event.
 * @param {object} fields {text: string, delta: integer}
 * @return {CuePointEvent}
 */
class CuePointEvent extends BaseTextEvent {
	type: 0x07;

	constructor(fields: { text: string; delta?: number; }) {
		super({type: 0x07, name: 'CuePointEvent', text: fields.text, delta: fields.delta});
		this.type = 0x07;
	}
}

export {CuePointEvent};
