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
	status: 0x90;
	name: string;
	pitch: string|string[]|number|number[];
	velocity: number;
	wait: string|number;
	tick: number;
	deltaWithPrecisionCorrection: number;

	constructor(fields: { channel?: number; wait?: string|number; velocity?: number; pitch?: string|string[]|number|number[]; tick?: number; data?: number[]; delta?: number }) {
		this.name 		= 'NoteOnEvent';
		this.channel 	= fields.channel || 1;
		this.pitch 		= fields.pitch;
		this.wait 		= fields.wait || 0;
		this.velocity 	= fields.velocity || 50;

		this.tick 		= fields.tick || null;
		this.delta 		= null;
		this.data 		= fields.data;
		this.status = 0x90;
	}

	/**
	 * Builds int array for this event.
	 * @param {Track} track - parent track
	 * @return {NoteOnEvent}
	 */
	buildData(track, precisionDelta, options: {middleC?: string} = {}) {
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
						this.status | this.channel - 1,
							Utils.getPitch(this.pitch, options.middleC),
							Utils.convertVelocity(this.velocity)
					);

		return this;
	}
}

export {NoteOnEvent};
