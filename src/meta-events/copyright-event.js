import {Constants} from '../constants';
import {Utils} from '../utils';

/**
 * Object representation of a tempo meta event.
 * @param {object} fields {text: string, delta: integer}
 * @return {CopyrightEvent}
 */
class CopyrightEvent {
	constructor(fields) {
		// Set default fields
		fields = Object.assign({
			delta: 0x00,
		}, fields);

		this.type = 'copyright';

		const textBytes = Utils.stringToBytes(fields.text);

		// Start with zero time delta
		this.data = Utils.numberToVariableLength(fields.delta).concat(
			Constants.META_EVENT_ID,
			Constants.META_COPYRIGHT_ID,
			Utils.numberToVariableLength(textBytes.length), // Size
			textBytes, // Text
		);
	}
}

export {CopyrightEvent};
