import {MidiEvent} from './midi-event';
import {Utils} from '../utils';

/**
 * Holds all data for a "note off" MIDI event
 * @param {object} fields {data: []}
 * @return {NoteOffEvent}
 */
class NoteOffEvent implements MidiEvent {
	channel: number;
	data: number[];
	delta: number;
	deltaWithPrecisionCorrection: number;
	velocity: number;
	pitch: string|number;
	duration: string|number;
	tick: number;

	constructor(fields: { channel: number; duration: string|number; velocity: number; pitch: string|number; tick?: number; data?: number[]; delta?: number }) {
		this.channel = fields.channel || 1;
		this.pitch = fields.pitch;
		this.velocity = fields.velocity || 50;
		this.tick = fields.tick || null;
		this.data = fields.data;
		this.delta = fields.delta || Utils.getTickDuration(fields.duration);
	}

	/**
	 * Builds int array for this event.
	 * @param {Track} track - parent track
	 * @return {NoteOffEvent}
	 */
	buildData(track, precisionDelta: number, options: {middleC?: string} = {}) {
		if (this.tick === null) {
			this.tick = Utils.getRoundedIfClose(this.delta + track.tickPointer);
		}

		this.deltaWithPrecisionCorrection = Utils.getRoundedIfClose(this.delta - precisionDelta);

		this.data = Utils.numberToVariableLength(this.deltaWithPrecisionCorrection)
					.concat(
							this.status,
							Utils.getPitch(this.pitch, options.middleC),
							Utils.convertVelocity(this.velocity)
					);

		return this;
	}

	public get name() {
		return 'NoteOffEvent';
	}

	public get status() {
		return 0x80 | this.channel - 1;
	}
}

export {NoteOffEvent};
