import {MidiEvent} from './midi-event';
import {Utils} from '../utils';


/**
 * Holds all data for a "Pitch Bend" MIDI event
 * [ -1.0, 0, 1.0 ] ->  [ 0, 8192, 16383]
 * @param {object} fields { bend : float, channel : int, delta: int }
 * @return {PitchBendEvent}
 */
class PitchBendEvent implements MidiEvent {
	channel: number;
	data: number[];
	delta: number;
	name: string;
	status: 0xE0;

    constructor(fields) {
		this.channel = fields.channel || 0;
		this.delta = fields.delta || 0x00;
		this.name = 'PitchBendEvent';
		this.status = 0xE0;
 
		const bend14 = this.scale14bits(fields.bend);

		const lsbValue = bend14 & 0x7f;          
		const msbValue = ( bend14 >> 7 ) & 0x7f;
		this.data = Utils.numberToVariableLength(this.delta).concat(this.status | this.channel, lsbValue, msbValue);
    }

	scale14bits(zeroOne) {
		if ( zeroOne <= 0 ) {
			return Math.floor( 16384 * ( zeroOne + 1 ) / 2 );
		}
	
		return Math.floor( 16383 * ( zeroOne + 1 ) / 2 );
	}
}

export {PitchBendEvent};
