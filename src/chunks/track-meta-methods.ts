import {ControllerChangeEvent} from '../midi-events/controller-change-event';
import {CopyrightEvent} from '../meta-events/copyright-event';
import {CuePointEvent} from '../meta-events/cue-point-event';
import {InstrumentNameEvent} from '../meta-events/instrument-name-event';
import {KeySignatureEvent} from '../meta-events/key-signature-event';
import {LyricEvent} from '../meta-events/lyric-event';
import {MarkerEvent} from '../meta-events/marker-event';
import {NoteOnEvent} from '../midi-events/note-on-event';
import {PitchBendEvent} from '../midi-events/pitch-bend-event';
import {TempoEvent} from '../meta-events/tempo-event';
import {TextEvent} from '../meta-events/text-event';
import {TimeSignatureEvent} from '../meta-events/time-signature-event';
import {TrackNameEvent} from '../meta-events/track-name-event';

/**
 * Helper functions that create events for Track convenience methods.
 * These are separated from the Track class to reduce its import footprint.
 */

function createTempoEvent(bpm: number, tick = 0) {
	return new TempoEvent({bpm, tick});
}

function createTimeSignatureEvent(numerator: number, denominator: number, midiclockspertick: number, notespermidiclock: number) {
	return new TimeSignatureEvent(numerator, denominator, midiclockspertick, notespermidiclock);
}

function createKeySignatureEvent(sf, mi) {
	return new KeySignatureEvent(sf, mi);
}

function createTextEvent(text: string) {
	return new TextEvent({text});
}

function createCopyrightEvent(text: string) {
	return new CopyrightEvent({text});
}

function createTrackNameEvent(text: string) {
	return new TrackNameEvent({text});
}

function createInstrumentNameEvent(text: string) {
	return new InstrumentNameEvent({text});
}

function createMarkerEvent(text: string) {
	return new MarkerEvent({text});
}

function createCuePointEvent(text: string) {
	return new CuePointEvent({text});
}

function createLyricEvent(text: string) {
	return new LyricEvent({text});
}

function createPolyModeOnEvent() {
	return new NoteOnEvent({data: [0x00, 0xB0, 0x7E, 0x00]});
}

function createPitchBendEvent(bend: number) {
	return new PitchBendEvent({bend});
}

function createControllerChangeEvent(number: number, value: number, channel?: number, delta?: number) {
	return new ControllerChangeEvent({controllerNumber: number, controllerValue: value, channel: channel, delta: delta});
}

export {
	createTempoEvent,
	createTimeSignatureEvent,
	createKeySignatureEvent,
	createTextEvent,
	createCopyrightEvent,
	createTrackNameEvent,
	createInstrumentNameEvent,
	createMarkerEvent,
	createCuePointEvent,
	createLyricEvent,
	createPolyModeOnEvent,
	createPitchBendEvent,
	createControllerChangeEvent
};
