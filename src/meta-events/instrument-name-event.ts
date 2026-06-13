import {BaseTextEvent} from './base-text-event';

/**
 * Object representation of an instrument name meta event.
 * @param {object} fields {text: string, delta: integer}
 * @return {InstrumentNameEvent}
 */
class InstrumentNameEvent extends BaseTextEvent {
	type: 0x04;

	constructor(fields: { text: string; delta?: number; }) {
		super({type: 0x04, name: 'InstrumentNameEvent', text: fields.text, delta: fields.delta});
		this.type = 0x04;
	}
}

export {InstrumentNameEvent};
