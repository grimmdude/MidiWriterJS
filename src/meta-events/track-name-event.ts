import {BaseTextEvent} from './base-text-event';

/**
 * Object representation of a track name meta event.
 * @param {object} fields {text: string, delta: integer}
 * @return {TrackNameEvent}
 */
class TrackNameEvent extends BaseTextEvent {
	type: 0x03;

	constructor(fields: { text: string; delta?: number; }) {
		super({type: 0x03, name: 'TrackNameEvent', text: fields.text, delta: fields.delta});
		this.type = 0x03;
	}
}

export {TrackNameEvent};
