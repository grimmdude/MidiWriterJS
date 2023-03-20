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
	delta: number;

	constructor(fields: { controllerNumber: number; controllerValue: number; channel?: number; delta?: number; }) {
		this.channel = fields.channel || 0;
		this.controllerValue = fields.controllerValue;
		this.controllerNumber = fields.controllerNumber;
		this.delta = fields.delta || 0x00;
	}

	public get data() {
		return Utils.numberToVariableLength(this.delta).concat(this.status, this.controllerNumber, this.controllerValue);
	}

	public get name() {
		return 'ControllerChangeEvent';
	}

	public get status() {
		return 0xB0 | this.channel;
	}
}

export {ControllerChangeEvent};
