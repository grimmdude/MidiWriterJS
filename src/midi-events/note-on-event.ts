import {MidiEvent} from './midi-event';
import {Utils} from '../utils';

/**
 * Holds all data for a "note on" MIDI event
 * @param {object} fields {data: []}
 * @return {NoteOnEvent}
 */
class NoteOnEvent implements MidiEvent {
	channel: number;
	data: number[];
	delta: number;
	pitch: string|string[]|number|number[];
	velocity: number;
	wait: string|number;
	tick: number;
	deltaWithPrecisionCorrection: number;
	middleC: string;

	constructor(fields: { channel?: number; wait?: string|number; velocity?: number; pitch?: string|string[]|number|number[]; tick?: number; data?: number[]; delta?: number, middleC?: string }) {
		this.channel = fields.channel || 1;
		this.pitch = fields.pitch;
		this.wait = fields.wait || 0;
		this.velocity = fields.velocity || 50;
		this.middleC = fields.middleC;

		this.tick = fields.tick || null;
		this.delta = null;
		this.data = fields.data;
	}

	/**
	 * Builds int array for this event.
	 * @param {Track} track - parent track
	 * @return {NoteOnEvent}
	 */
	buildData(track, precisionDelta) {
		this.data = [];

		// Explicitly defined startTick event
		if (this.tick) {
			this.tick = Utils.getRoundedIfClose(this.tick);

			// If this is the first event in the track then use event's starting tick as delta.
			if (track.tickPointer == 0) {
				this.delta = this.tick;
			}

		} else {
			this.delta = Utils.getTickDuration(this.wait);
			this.tick = Utils.getRoundedIfClose(track.tickPointer + this.delta);
		}

		this.deltaWithPrecisionCorrection = Utils.getRoundedIfClose(this.delta - precisionDelta);

		this.data = Utils.numberToVariableLength(this.deltaWithPrecisionCorrection)
					.concat(
						this.status,
						Utils.getPitch(this.pitch, this.middleC),
						Utils.convertVelocity(this.velocity)
					);

		return this;
	}

	public get name() {
		return 'NoteOnEvent';
	}

	public get status() {
		return 0x90 | this.channel - 1;
	}
}

export {NoteOnEvent};
