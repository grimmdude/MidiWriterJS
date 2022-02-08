import {Constants} from '../constants';
import {Utils} from '../utils';

/**
 * Holds all data for a "Pitch Bend" MIDI event
 * [ -1.0, 0, 1.0 ] ->  [ 0, 8192, 16383]
 * @param {object} fields { bend : float, channel : int, delta: int }
 * @return {PitchBendEvent}
 */
const scale14bits = (zeroOne) => {
    if ( zeroOne <= 0 ) {
        return Math.floor( 16384 * ( zeroOne + 1 ) / 2 );
    }

    return Math.floor( 16383 * ( zeroOne + 1 ) / 2 );
}

class PitchBendEvent {
    constructor(fields) {
        // Set default fields
		fields = Object.assign({
			delta: 0x00,
		}, fields);

		this.type = 'pitch-bend';
 
		let bend14 = scale14bits(fields.bend);
		let channel = fields.channel || 0;

		let lsbValue = bend14 & 0x7f;          
		let msbValue = ( bend14 >> 7 ) & 0x7f;
		this.data = Utils.numberToVariableLength(fields.delta).concat(Constants.PITCH_BEND_STATUS | channel, lsbValue, msbValue);
    }
}

export {PitchBendEvent};
