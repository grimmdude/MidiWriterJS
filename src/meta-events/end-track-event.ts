import {Constants} from '../constants';
import {MetaEvent} from './meta-event';
import {Utils} from '../utils';

/**
 * Object representation of a end track meta event.
 * @param {object} fields {delta: integer}
 * @return {EndTrackEvent}
 */
class EndTrackEvent implements MetaEvent {
	delta: number;

	constructor(fields?: { delta: number; }) {
		this.delta = fields?.delta || 0x00;
	}

	public get data() {
		return Utils.numberToVariableLength(this.delta).concat(
			Constants.META_EVENT_ID,
			this.type
		);
	}

	public get name() {
		return 'EndTrackEvent';
	}

	public get type() {
		return [0x2F, 0x00];
	}
}

export {EndTrackEvent};
