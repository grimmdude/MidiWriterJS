import {Constants} from '../constants';
import {Utils} from '../utils';

/**
 * Object representation of a end track meta event.
 * @param {object} fields {delta: integer}
 * @return {EndTrackEvent}
 */
class EndTrackEvent {
	constructor(fields) {
		// Set default fields
		fields = Object.assign({
			delta: 0x00,
		}, fields);

		this.type = 'end-track';

		// Start with zero time delta
		this.data = Utils.numberToVariableLength(fields.delta).concat(
			Constants.META_EVENT_ID,
			Constants.META_END_OF_TRACK_ID
		);
	}
}

export {EndTrackEvent};
