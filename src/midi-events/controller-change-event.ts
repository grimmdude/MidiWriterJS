import {MidiEvent} from './midi-event';
import {Utils} from '../utils';

/**
 * Holds all data for a "controller change" MIDI event
 * @param {object} fields {controllerNumber: integer, controllerValue: integer, delta: integer}
 * @return {ControllerChangeEvent}
 */
class ControllerChangeEvent implements MidiEvent {
	channel: number;
	controllerNumber: number;
	controllerValue: number;
	data: number[];
	delta: number;
	name: string;
	status: 0xB0;

	constructor(fields: { controllerNumber: number; controllerValue: number; channel?: number; delta?: number; }) {
		this.channel = fields.channel - 1 || 0;
		this.controllerValue = fields.controllerValue;
		this.controllerNumber = fields.controllerNumber;
		this.delta = fields.delta || 0x00;
		this.name = 'ControllerChangeEvent';
		this.status = 0xB0;

		this.data = Utils.numberToVariableLength(fields.delta).concat(this.status | this.channel, this.controllerNumber, this.controllerValue);
	}
}

export {ControllerChangeEvent};
