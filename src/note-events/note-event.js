import {NoteOnEvent} from './note-on-event';
import {NoteOffEvent} from './note-off-event';
import {Utils} from '../utils';

/**
 * Wrapper for noteOnEvent/noteOffEvent objects that builds both events.
 * @param {object} fields - {pitch: '[C4]', duration: '4', wait: '4', velocity: 1-100}
 * @return {NoteEvent}
 */
class NoteEvent {
	constructor(fields) {
		// Set default fields
		fields = Object.assign({
			channel: 1,
			repeat: 1,
			sequential: false,
			startTick: null,
			velocity: 50,
			wait: 0,
		}, fields);

		this.data 		= [];
		this.type 		= 'note';
		this.pitch 		= Utils.toArray(fields.pitch);

		this.channel 	= fields.channel;
		this.duration 	= fields.duration;
		this.grace		= fields.grace;
		this.repeat 	= fields.repeat;
		this.sequential = fields.sequential;
		this.startTick	= fields.startTick;
		this.velocity 	= fields.velocity;
		this.wait 		= fields.wait;

		this.tickDuration = Utils.getTickDuration(this.duration);
		this.restDuration = Utils.getTickDuration(this.wait);

		this.events 	= []; // Hold actual NoteOn/NoteOff events
	}

	/**
	 * Builds int array for this event.
	 * @return {NoteEvent}
	 */
	buildData() {
		// Reset data array
		this.data = [];

		var tickDuration = this.tickDuration;
		var restDuration = this.restDuration;

		// Apply grace note(s) and subtract ticks (currently 1 tick per grace note) from tickDuration so net value is the same
		if (this.grace) {
			let graceDuration = 1;
			this.grace = Utils.toArray(this.grace);
			this.grace.forEach((pitch) => {
				let noteEvent = new NoteEvent({pitch:this.grace, duration:'T' + graceDuration});
				this.data = this.data.concat(noteEvent.data)

				tickDuration -= graceDuration;
			});
		}

		// fields.pitch could be an array of pitches.
		// If so create note events for each and apply the same duration.
		var noteOn, noteOff;
		// By default this is a chord if it's an array of notes that requires one NoteOnEvent.
		// If this.sequential === true then it's a sequential string of notes that requires separate NoteOnEvents.
		if ( ! this.sequential) {
			// Handle repeat
			for (var j = 0; j < this.repeat; j++) {
				// Note on
				this.pitch.forEach((p, i) => {
					if (i == 0) {
						var noteOnNew = new NoteOnEvent({
							channel: this.channel,
							wait: this.wait,
							velocity: this.velocity,
							pitch: p,
							startTick: this.startTick
						});

					} else {
						// Running status (can ommit the note on status)
						//noteOn = new NoteOnEvent({data: [0, Utils.getPitch(p), Utils.convertVelocity(this.velocity)]});
						var noteOnNew = new NoteOnEvent({
							channel: this.channel,
							wait: 0,
							velocity: this.velocity,
							pitch: p,
							startTick: this.startTick
						});
					}

					this.events.push(noteOnNew);
				});

				// Note off
				this.pitch.forEach((p, i) => {
					if (i == 0) {
						//noteOff = new NoteOffEvent({data: Utils.numberToVariableLength(tickDuration).concat(this.getNoteOffStatus(), Utils.getPitch(p), Utils.convertVelocity(this.velocity))});
						var noteOffNew = new NoteOffEvent({
							channel: this.channel,
							duration: this.duration,
							velocity: this.velocity,
							pitch: p,
							tick: this.startTick !== null ? Utils.getTickDuration(this.duration) + this.startTick : null,
						});

					} else {
						// Running status (can ommit the note off status)
						//noteOff = new NoteOffEvent({data: [0, Utils.getPitch(p), Utils.convertVelocity(this.velocity)]});
						var noteOffNew = new NoteOffEvent({
							channel: this.channel,
							duration: 0,
							velocity: this.velocity,
							pitch: p,
							tick: this.startTick !== null ? Utils.getTickDuration(this.duration) + this.startTick : null,
						});
					}

					this.events.push(noteOffNew);
				});
			}

		} else {
			// Handle repeat
			for (var j = 0; j < this.repeat; j++) {
				this.pitch.forEach((p, i) => {
					// restDuration only applies to first note
					if (i > 0) {
						restDuration = 0;
					}

					var noteOnNew = new NoteOnEvent({
						channel: this.channel,
						wait: (i > 0 ? 0 : this.wait), // wait only applies to first note in repetition
						velocity: this.velocity,
						pitch: p,
						startTick: this.startTick,
					});

					var noteOffNew = new NoteOffEvent({
						channel: this.channel,
						duration: this.duration,
						velocity: this.velocity,
						pitch: p,
					});

					this.events.push(noteOnNew, noteOffNew);
				});
			}
		}

		return this;
	}
}

export {NoteEvent};
