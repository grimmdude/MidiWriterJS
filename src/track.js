import {Constants} from './constants';
import {ControllerChangeEvent} from './meta-events/controller-change-event';
import {CopyrightEvent} from './meta-events/copyright-event';
import {CuePointEvent} from './meta-events/cue-point-event';
import {EndTrackEvent} from './meta-events/end-track-event';
import {InstrumentNameEvent} from './meta-events/instrument-name-event';
import {KeySignatureEvent} from './meta-events/key-signature-event';
import {LyricEvent} from './meta-events/lyric-event';
import {MarkerEvent} from './meta-events/marker-event';
import {NoteEvent} from './note-events/note-event';
import {NoteOnEvent} from './note-events/note-on-event';
import {NoteOffEvent} from './note-events/note-off-event';
import {PitchBendEvent} from './meta-events/pitch-bend-event';
import {TempoEvent} from './meta-events/tempo-event';
import {TextEvent} from './meta-events/text-event';
import {TimeSignatureEvent} from './meta-events/time-signature-event';
import {TrackNameEvent} from './meta-events/track-name-event';
import {Utils} from './utils';

/**
 * Holds all data for a track.
 * @param {object} fields {type: number, data: array, size: array, events: array}
 * @return {Track}
 */
class Track {
	constructor() {
		this.type = Constants.TRACK_CHUNK_TYPE;
		this.data = [];
		this.size = [];
		this.events = [];
		this.explicitTickEvents = [];

		// If there are any events with an explicit tick defined then we will create a "sub" track for those
		// and merge them in and the end.
		this.tickPointer = 0; // Each time an event is added this will increase
	}

	/**
	 * Adds any event type to the track.
	 * Events without a specific startTick property are assumed to be added in order of how they should output.
	 * Events with a specific startTick property are set aside for now will be merged in during build process.
	 * @param {(NoteEvent|ProgramChangeEvent)} events - Event object or array of Event objects.
	 * @param {function} mapFunction - Callback which can be used to apply specific properties to all events.
	 * @return {Track}
	 */
	addEvent(events, mapFunction) {
		Utils.toArray(events).forEach((event, i) => {
			if (event instanceof NoteEvent) {
				// Handle map function if provided
				if (typeof mapFunction === 'function') {
					const properties = mapFunction(i, event);

					if (typeof properties === 'object') {
						for (var j in properties) {
							switch(j) {
								case 'channel':
									event.channel = properties[j];
									break;
								case 'duration':
									event.duration = properties[j];
									break;
								case 'sequential':
									event.sequential = properties[j];
									break;
								case 'velocity':
									event.velocity = Utils.convertVelocity(properties[j]);
									break;
							}
						}
					}
				}

				// If this note event has an explicit startTick then we need to set aside for now
				if (event.startTick !== null) {
					this.explicitTickEvents.push(event);

				} else {
					// Push each on/off event to track's event stack
					event.buildData().events.forEach((e) => this.events.push(e));
				}

			} else {
				this.events.push(event);
			}
		});

		return this;
	}

	/**
	 * Builds int array of all events.
	 * @param {object} options
	 * @return {Track}
	 */
	buildData(options = {}) {
		// Remove existing end track event and add one.
		// This makes sure it's at the very end of the event list.
		this.removeEventsByType('end-track').addEvent(new EndTrackEvent());

		// Reset
		this.data = [];
		this.size = [];
		this.tickPointer = 0;

		let precisionLoss = 0;

		this.events.forEach((event, eventIndex) => {
			// Build event & add to total tick duration
			if (event instanceof NoteOnEvent || event instanceof NoteOffEvent) {
				const built = event.buildData(this, precisionLoss, options);
				precisionLoss = Utils.getPrecisionLoss(event.deltaWithPrecisionCorrection || 0);
				this.data = this.data.concat(built.data);
				this.tickPointer = Utils.getRoundedIfClose(event.tick);

			} else if (event instanceof TempoEvent) {
				this.tickPointer = Utils.getRoundedIfClose(event.tick);
				this.data = this.data.concat(event.data);

			} else {
				this.data = this.data.concat(event.data);
			}
		});

		this.mergeExplicitTickEvents();

		this.size = Utils.numberToBytes(this.data.length, 4); // 4 bytes long
		return this;
	}

	mergeExplicitTickEvents() {
		if (!this.explicitTickEvents.length) return;

		// First sort asc list of events by startTick
		this.explicitTickEvents.sort((a, b) => a.startTick - b.startTick);

		// Now this.explicitTickEvents is in correct order, and so is this.events naturally.
		// For each explicit tick event, splice it into the main list of events and
		// adjust the delta on the following events so they still play normally.
		this.explicitTickEvents.forEach((noteEvent) => {
			// Convert NoteEvent to it's respective NoteOn/NoteOff events
			// Note that as we splice in events the delta for the NoteOff ones will
			// Need to change based on what comes before them after the splice.
			noteEvent.buildData().events.forEach((e) => e.buildData(this));

			// Merge each event indivually into this track's event list.
			noteEvent.events.forEach((event) => this.mergeSingleEvent(event));
		});

		// Hacky way to rebuild track with newly spliced events.  Need better solution.
		this.explicitTickEvents = [];
		this.buildData();
	}

	/**
	 * Merges another track's events with this track.
	 * @param {Track} track
	 * @return {Track}
	 */
	mergeTrack(track) {
		// First build this track to populate each event's tick property
		this.buildData();

		// Then build track to be merged so that tick property is populated on all events & merge each event.
		track.buildData().events.forEach((event) => this.mergeSingleEvent(event));
	}

	/**
	 * Merges a single event into this track's list of events based on event.tick property.
	 * @param {NoteOnEvent|NoteOffEvent} - event
	 * @return {Track}
	 */
	mergeSingleEvent(event) {
		// Find index of existing event we need to follow with
		var lastEventIndex = 0;

		for (var i = 0; i < this.events.length; i++) {
			if (this.events[i].tick > event.tick) break;
			lastEventIndex = i;
		}

		let splicedEventIndex = lastEventIndex + 1;

		// Need to adjust the delta of this event to ensure it falls on the correct tick.
		event.delta = event.tick - this.events[lastEventIndex].tick;

		// Splice this event at lastEventIndex + 1
		this.events.splice(splicedEventIndex, 0, event);

		// Now adjust delta of all following events
		for (var i = splicedEventIndex + 1; i < this.events.length; i++) {
			// Since each existing event should have a tick value at this point we just need to
			// adjust delta to that the event still falls on the correct tick.
			this.events[i].delta = this.events[i].tick - this.events[i - 1].tick;
		}
	}

	/**
	 * Removes all events matching specified type.
	 * @param {string} eventType - Event type
	 * @return {Track}
	 */
	removeEventsByType(eventType) {
		this.events.forEach((event, index) => {
			if (event.type === eventType) {
				this.events.splice(index, 1);
			}
		});

		return this;
	}

	/**
	 * Sets tempo of the MIDI file.
	 * @param {number} bpm - Tempo in beats per minute.
	 * @param {number} tick - Start tick.
	 * @return {Track}
	 */
	setTempo(bpm, tick = 0) {
	   return this.addEvent(new TempoEvent({bpm, tick}));
	}

	/**
	 * Sets time signature.
	 * @param {number} numerator - Top number of the time signature.
	 * @param {number} denominator - Bottom number of the time signature.
	 * @param {number} midiclockspertick - Defaults to 24.
	 * @param {number} notespermidiclock - Defaults to 8.
	 * @return {Track}
	 */
	setTimeSignature(numerator, denominator, midiclockspertick, notespermidiclock) {
		return this.addEvent(new TimeSignatureEvent(numerator, denominator, midiclockspertick, notespermidiclock));
	}

	/**
	 * Sets key signature.
	 * @param {*} sf -
	 * @param {*} mi -
	 * @return {Track}
	 */
	setKeySignature(sf, mi) {
		return this.addEvent(new KeySignatureEvent(sf, mi));
	}

	/**
	 * Adds text to MIDI file.
	 * @param {string} text - Text to add.
	 * @return {Track}
	 */
	addText(text) {
		return this.addEvent(new TextEvent({text}));
	}

	/**
	 * Adds copyright to MIDI file.
	 * @param {string} text - Text of copyright line.
	 * @return {Track}
	 */
	addCopyright(text) {
		return this.addEvent(new CopyrightEvent({text}));
	}

	/**
	 * Adds Sequence/Track Name.
	 * @param {string} text - Text of track name.
	 * @return {Track}
	 */
	addTrackName(text) {
		return this.addEvent(new TrackNameEvent({text}));
	}

	/**
	 * Sets instrument name of track.
	 * @param {string} text - Name of instrument.
	 * @return {Track}
	 */
	addInstrumentName(text) {
		return this.addEvent(new InstrumentNameEvent({text}));
	}

	/**
	 * Adds marker to MIDI file.
	 * @param {string} text - Marker text.
	 * @return {Track}
	 */
	addMarker(text) {
		return this.addEvent(new MarkerEvent({text}));
	}

	/**
	 * Adds cue point to MIDI file.
	 * @param {string} text - Text of cue point.
	 * @return {Track}
	 */
	addCuePoint(text) {
		return this.addEvent(new CuePointEvent({text}));
	}

	/**
	 * Adds lyric to MIDI file.
	 * @param {string} text - Lyric text to add.
	 * @return {Track}
	 */
	addLyric(text) {
		return this.addEvent(new LyricEvent({text}));
	}

	/**
	 * Channel mode messages
	 * @return {Track}
	 */
	polyModeOn() {
		const event = new NoteOnEvent({data: [0x00, 0xB0, 0x7E, 0x00]});
		return this.addEvent(event);
	}


	/**
	 * Sets a pitch bend.
	 * @param {float} bend - Bend value ranging [-1,1], zero meaning no bend.
	 * @return {Track}
	 */
	setPitchBend(bend) {
		return this.addEvent(new PitchBendEvent({bend}));
	}


	/**
	 * Adds a controller change event
	 * @param {number} number - Control number.
	 * @param {number} value - Control value.
	 * @return {Track}
	 */
	controllerChange(number, value) {
		return this.addEvent(new ControllerChangeEvent({controllerNumber: number, controllerValue: value}));
	}

}

export {Track};
