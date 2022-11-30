declare module "midi-writer-js" {
	type BaseDuration = "1" | "2" | "4" | "8" | "16" | "32" | "64";
	type TickDuration = `T${number}`;
	type DottedDuration = `d${BaseDuration}`;
	type DoubleDottedDuration = `dd${BaseDuration}`;
	type TripletDuration = `${BaseDuration}t`;
	type Duration =
		| BaseDuration
		| TickDuration
		| DottedDuration
		| DoubleDottedDuration
		| TripletDuration;
	type PitchModifier = "#" | "b" | "";
	type BasePitch = "A" | "B" | "C" | "D" | "E" | "F" | "G";
	type Pitch = `${BasePitch}${PitchModifier}${number}`;

	type Options = Omit<NoteEvent, "wait" | "startTick"> &
		(Pick<NoteEvent, "startTick"> | Pick<NoteEvent, "wait">);

	class Event {}
	class NoteEvent extends Event {
		/**
		 * Each pitch can be a string or valid MIDI note code. Format for string
		 * is C#4. Pro tip: You can use the output from tonal functions to build
		 * scales, chords, intervals, etc. in this parameter.
		 */
		pitch: Pitch | Pitch[];
		/**
		 * How long the note should sound.
		 * - 1 : whole
		 * - 2 : half
		 * - d2 : dotted half
		 * - dd2 : double dotted half
		 * - 4 : quarter
		 * - 4t : quarter triplet
		 * - d4 : dotted quarter
		 * - dd4 : double dotted quarter
		 * - 8 : eighth
		 * - 8t : eighth triplet
		 * - d8 : dotted eighth
		 * - dd8 : double dotted eighth
		 * - 16 : sixteenth
		 * - 16t : sixteenth triplet
		 * - 32 : thirty-second
		 * - 64 : sixty-fourth
		 * - Tn : where n is an explicit number of ticks (T128 = 1 beat)
		 *
		 * If an array of durations is passed then the sum of the durations will be used.
		 */
		duration: Duration | Duration[];
		/**
		 * Grace note to be applied to note event. Takes same value format as pitch
		 */
		grace?: Pitch | Pitch[];
		/**
		 * If true then array of pitches will be played sequentially as opposed to simulatanously.
		 * Default: false
		 */
		sequential?: boolean;
		/**
		 * How loud the note should sound, values 1-100. Default: 50
		 */
		velocity?: number;
		/**
		 * How many times this event should be repeated. Default: 1
		 */
		repeat?: number;
		/**
		 * MIDI channel to use. Default: 1
		 */
		channel?: number;
		/**
		 * How long to wait before sounding note (rest). Takes same values as duration.
		 */
		wait?: Duration | Duration[];
		/**
		 * Specific tick where this event should be played. If this parameter is supplied
		 * then wait is disregarded if also supplied.
		 */
		startTick?: number;

		constructor(options: Options);
	}
	class ProgramChangeEvent {
		constructor(options?: Partial<{ instrument: number }>);
	}
	class Track {
		addEvent<EventType extends Event>(
			event: EventType | EventType[],
			mapFunction?: (index: number, event: EventType) => Partial<EventType>
		): void;
		setTempo(tempo: number, tick: number): void;
		addText(text: string): void;
		addCopyright(text: string): void;
		addTrackName(text: string): void;
		addInstrumentName(text: string): void;
		addMarker(text: string): void;
		addCuePoint(text: string): void;
		addLyric(text: string): void;
		setTimeSignature(numerator: number, denominator: number): void;
	}
	class Writer {
		constructor(track: Track | Track[]);
		buildFile(): Uint8Array;
		base64(): string;
		dataUri(): string;
		saveMIDI(filename: string): void;
		/**
		 *  file stream (cli)
		 */
		stdout(): void;
	}
}
