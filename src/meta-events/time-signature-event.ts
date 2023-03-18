import {Constants} from '../constants';
import {Utils} from '../utils';

/**
 * Object representation of a time signature meta event.
 * @return {TimeSignatureEvent}
 */
class TimeSignatureEvent implements AbstractEvent {
	data: number[];
    delta: number;
    tick: number;
    type: string;

	constructor(numerator, denominator, midiclockspertick, notespermidiclock) {
		this.type = 'time-signature';

		// Start with zero time delta
		this.data = Utils.numberToVariableLength(0x00).concat(
			Constants.META_EVENT_ID,
			Constants.META_TIME_SIGNATURE_ID,
			[0x04], // Size
			Utils.numberToBytes(numerator, 1), // Numerator, 1 bytes
			Utils.numberToBytes(Math.log2(denominator), 1), // Denominator is expressed as pow of 2, 1 bytes
			Utils.numberToBytes(midiclockspertick || 24, 1), // MIDI Clocks per tick, 1 bytes
			Utils.numberToBytes(notespermidiclock || 8, 1), // Number of 1/32 notes per MIDI clocks, 1 bytes
		);
	}
}

export {TimeSignatureEvent};
