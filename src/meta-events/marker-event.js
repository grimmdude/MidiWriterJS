import {Constants} from '../constants';
import {Utils} from '../utils';

/**
 * Object representation of a marker meta event.
 * @param {object} fields {text: string, delta: integer}
 * @return {MarkerEvent}
 */
class MarkerEvent {
	constructor(fields) {
		// Set default fields
		fields = Object.assign({
			delta: 0x00,
		}, fields);

		this.type = 'marker';

		const textBytes = Utils.stringToBytes(fields.text);

		// Start with zero time delta
		this.data = Utils.numberToVariableLength(fields.delta).concat(
			Constants.META_EVENT_ID,
			Constants.META_MARKER_ID,
			Utils.numberToVariableLength(textBytes.length), // Size
			textBytes, // Text
		);
	}
}

export {MarkerEvent};
