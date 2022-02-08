import {Constants} from '../constants';
import {Utils} from '../utils';

/**
 * Object representation of an instrument name meta event.
 * @param {object} fields {text: string, delta: integer}
 * @return {InstrumentNameEvent}
 */
class InstrumentNameEvent {
	constructor(fields) {
		// Set default fields
		fields = Object.assign({
			delta: 0x00,
		}, fields);

		this.type = 'instrument-name';

		const textBytes = Utils.stringToBytes(fields.text);

		// Start with zero time delta
		this.data = Utils.numberToVariableLength(fields.delta).concat(
			Constants.META_EVENT_ID,
			Constants.META_INSTRUMENT_NAME_ID,
			Utils.numberToVariableLength(textBytes.length), // Size
			textBytes, // Instrument name
		);
	}
}

export {InstrumentNameEvent};
