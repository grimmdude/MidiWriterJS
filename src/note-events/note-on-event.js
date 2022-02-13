import {Utils} from '../utils';

/**
 * Holds all data for a "note on" MIDI event
 * @param {object} fields {data: []}
 * @return {NoteOnEvent}
 */
class NoteOnEvent {
	constructor(fields) {
		// Set default fields
		fields = Object.assign({
			channel: 1,
			startTick: null,
			velocity: 50,
			wait: 0,
		}, fields);

		this.type 		= 'note-on';
		this.channel 	= fields.channel;
		this.pitch 		= fields.pitch;
		this.wait 		= fields.wait;
		this.velocity 	= fields.velocity;
		this.startTick 	= fields.startTick;

		this.tick 		= null;
		this.delta 		= null;
		this.data 		= fields.data;
	}

	/**
	 * Builds int array for this event.
	 * @param {Track} track - parent track
	 * @return {NoteOnEvent}
	 */
	buildData(track, precisionDelta, options = {}) {
		this.data = [];

		// Explicitly defined startTick event
		if (this.startTick) {
			this.tick = Utils.getRoundedIfClose(this.startTick);

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
							this.getStatusByte(),
							Utils.getPitch(this.pitch, options.middleC),
							Utils.convertVelocity(this.velocity)
					);

		return this;
	}

	/**
	 * Gets the note on status code based on the selected channel. 0x9{0-F}
	 * Note on at channel 0 is 0x90 (144)
	 * 0 = Ch 1
	 * @return {number}
	 */
	getStatusByte() {return 144 + this.channel - 1}
}

export {NoteOnEvent};
