import {AbstractEvent} from '../abstract-event';
import {MidiEvent} from './midi-event';
import {NoteOnEvent} from './note-on-event';
import {NoteOffEvent} from './note-off-event';
import {Utils} from '../utils';

/**
 * Wrapper for noteOnEvent/noteOffEvent objects that builds both events.
 * @param {object} fields - {pitch: '[C4]', duration: '4', wait: '4', velocity: 1-100}
 * @return {NoteEvent}
 */
class NoteEvent implements AbstractEvent {
	data: number[];
	delta: number;
	events: MidiEvent[];
	name: string;
	pitch: string[];
	grace: string|string[];
	channel: number;
	repeat: number;
	tick: number;
	duration: string;
	sequential: boolean;
	wait: string;
	velocity: number;
	tickDuration: number;
	restDuration: number;

	constructor(fields) {
		this.data = [];
		this.name = 'NoteEvent';
		this.pitch = Utils.toArray(fields.pitch);

		this.channel = fields.channel || 1;
		this.duration = fields.duration || '4';
		this.grace = fields.grace;
		this.repeat = fields.repeat || 1;
		this.sequential = fields.sequential || false;
		this.tick = fields.startTick || fields.tick || null;
		this.velocity = fields.velocity || 50;
		this.wait = fields.wait || 0;

		this.tickDuration = Utils.getTickDuration(this.duration);
		this.restDuration = Utils.getTickDuration(this.wait);

		this.events 	= []; // Hold actual NoteOn/NoteOff events
	}

	/**
	 * Builds int array for this event.
	 * @return {NoteEvent}
	 */
	buildData(): NoteEvent {
		// Reset data array
		this.data = [];

		// Apply grace note(s) and subtract ticks (currently 1 tick per grace note) from tickDuration so net value is the same
		if (this.grace) {
			const graceDuration = 1;
			this.grace = Utils.toArray(this.grace);
			this.grace.forEach(() => {
				const noteEvent = new NoteEvent({pitch: this.grace, duration:'T' + graceDuration});
				this.data = this.data.concat(noteEvent.data);
			});
		}

		// fields.pitch could be an array of pitches.
		// If so create note events for each and apply the same duration.

		// By default this is a chord if it's an array of notes that requires one NoteOnEvent.
		// If this.sequential === true then it's a sequential string of notes that requires separate NoteOnEvents.
		if ( ! this.sequential) {
			// Handle repeat
			for (let j = 0; j < this.repeat; j++) {
				// Note on
				this.pitch.forEach((p, i) => {
					let noteOnNew;

					if (i == 0) {
						noteOnNew = new NoteOnEvent({
							channel: this.channel,
							wait: this.wait,
							delta: Utils.getTickDuration(this.wait),
							velocity: this.velocity,
							pitch: p,
							tick: this.tick,
						});

					} else {
						// Running status (can ommit the note on status)
						//noteOn = new NoteOnEvent({data: [0, Utils.getPitch(p), Utils.convertVelocity(this.velocity)]});
						noteOnNew = new NoteOnEvent({
							channel: this.channel,
							wait: 0,
							delta: 0,
							velocity: this.velocity,
							pitch: p,
							tick: this.tick,
						});
					}

					this.events.push(noteOnNew);
				});

				// Note off
				this.pitch.forEach((p, i) => {
					let noteOffNew;

					if (i == 0) {
						//noteOff = new NoteOffEvent({data: Utils.numberToVariableLength(tickDuration).concat(this.getNoteOffStatus(), Utils.getPitch(p), Utils.convertVelocity(this.velocity))});
						noteOffNew = new NoteOffEvent({
							channel: this.channel,
							duration: this.duration,
							velocity: this.velocity,
							pitch: p,
							tick: this.tick !== null ? Utils.getTickDuration(this.duration) + this.tick : null,
						});

					} else {
						// Running status (can omit the note off status)
						//noteOff = new NoteOffEvent({data: [0, Utils.getPitch(p), Utils.convertVelocity(this.velocity)]});
						noteOffNew = new NoteOffEvent({
							channel: this.channel,
							duration: 0,
							velocity: this.velocity,
							pitch: p,
							tick: this.tick !== null ? Utils.getTickDuration(this.duration) + this.tick : null,
						});
					}

					this.events.push(noteOffNew);
				});
			}

		} else {
			// Handle repeat
			for (let j = 0; j < this.repeat; j++) {
				this.pitch.forEach((p, i) => {
					const noteOnNew = new NoteOnEvent({
						channel: this.channel,
						wait: (i > 0 ? 0 : this.wait), // wait only applies to first note in repetition
						delta: (i > 0 ? 0 : Utils.getTickDuration(this.wait)),
						velocity: this.velocity,
						pitch: p,
						tick: this.tick,
					});

					const noteOffNew = new NoteOffEvent({
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
