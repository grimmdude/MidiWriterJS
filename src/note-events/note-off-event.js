import {Utils} from '../utils';

/**
 * Holds all data for a "note off" MIDI event
 * @param {object} fields {data: []}
 * @return {NoteOffEvent}
 */
class NoteOffEvent {
	constructor(fields) {
		// Set default fields
		fields = Object.assign({
			channel: 1,
			velocity: 50,
			tick: null,
		}, fields);

		this.type 		= 'note-off';
		this.channel 	= fields.channel;
		this.pitch 		= fields.pitch;
		this.duration 	= fields.duration;
		this.velocity 	= fields.velocity;

		this.midiNumber = Utils.getPitch(this.pitch);
		this.tick 		= fields.tick;
		this.delta 		= Utils.getTickDuration(this.duration);
		this.data 		= fields.data;
	}

	/**
	 * Builds int array for this event.
	 * @param {Track} track - parent track
	 * @return {NoteOffEvent}
	 */
	buildData(track, precisionDelta) {
		if (this.tick === null) {
			this.tick = Utils.getRoundedIfClose(this.delta + track.tickPointer);
		}

		this.deltaWithPrecisionCorrection = Utils.getRoundedIfClose(this.delta - precisionDelta);

		this.data = Utils.numberToVariableLength(this.deltaWithPrecisionCorrection)
					.concat(
							this.getStatusByte(),
							this.midiNumber,
							Utils.convertVelocity(this.velocity)
					);

		return this;
	}

	/**
	 * Gets the note off status code based on the selected channel. 0x8{0-F}
	 * Note off at channel 0 is 0x80 (128)
	 * 0 = Ch 1
	 * @return {number}
	 */
	getStatusByte() {return 128 + this.channel - 1}
}

export {NoteOffEvent};
