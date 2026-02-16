# MidiWriterJS

[![npm version](https://img.shields.io/npm/v/midi-writer-js.svg)](https://www.npmjs.com/package/midi-writer-js)
![Tests](https://github.com/grimmdude/MidiWriterJS/actions/workflows/lint.js.yml/badge.svg)
![Lint](https://github.com/grimmdude/MidiWriterJS/actions/workflows/node.js.yml/badge.svg)
[![Try midi-writer-js on RunKit](https://badge.runkitcdn.com/midi-writer-js.svg)](https://npm.runkit.com/midi-writer-js)

A JavaScript library for generating expressive multi-track MIDI files.

- Multi-track MIDI file generation
- Written in TypeScript with full type definitions
- Works in Node.js (CJS & ESM) and the browser
- Note names (`C#4`, `Eb5`) or raw MIDI numbers
- Chords, arpeggios, grace notes, pitch bends, and more
- Experimental VexFlow integration

[Full API Documentation](https://grimmdude.com/MidiWriterJS/docs/)

## Install

```sh
npm install midi-writer-js
```

## Quick Start

### ESM (recommended)

```javascript
import MidiWriter from 'midi-writer-js';

const track = new MidiWriter.Track();
track.addEvent(new MidiWriter.ProgramChangeEvent({instrument: 1}));
track.addEvent(new MidiWriter.NoteEvent({pitch: ['C4', 'D4', 'E4'], duration: '4', sequential: true}));

const writer = new MidiWriter.Writer(track);
console.log(writer.dataUri());
```

### CommonJS

```javascript
const MidiWriter = require('midi-writer-js');

const track = new MidiWriter.Track();
track.addEvent(new MidiWriter.NoteEvent({pitch: ['C4', 'E4', 'G4'], duration: '2'}));

const writer = new MidiWriter.Writer(track);
console.log(writer.dataUri());
```

### TypeScript

```typescript
import MidiWriter from 'midi-writer-js';

const track = new MidiWriter.Track();
track.addEvent(new MidiWriter.NoteEvent({pitch: ['C4', 'E4', 'G4'], duration: '2'}));

const writer = new MidiWriter.Writer(track);
const data: Uint8Array = writer.buildFile();
```

## Examples

### Melody (Hot Cross Buns)

```javascript
import MidiWriter from 'midi-writer-js';

const track = new MidiWriter.Track();

track.addEvent([
    new MidiWriter.NoteEvent({pitch: ['E4', 'D4'], duration: '4'}),
    new MidiWriter.NoteEvent({pitch: ['C4'], duration: '2'}),
    new MidiWriter.NoteEvent({pitch: ['E4', 'D4'], duration: '4'}),
    new MidiWriter.NoteEvent({pitch: ['C4'], duration: '2'}),
    new MidiWriter.NoteEvent({pitch: ['C4', 'C4', 'C4', 'C4', 'D4', 'D4', 'D4', 'D4'], duration: '8'}),
    new MidiWriter.NoteEvent({pitch: ['E4', 'D4'], duration: '4'}),
    new MidiWriter.NoteEvent({pitch: ['C4'], duration: '2'}),
  ], function(event, index) {
    return {sequential: true};
  }
);

const writer = new MidiWriter.Writer(track);
console.log(writer.dataUri());
```

### Chords vs. Sequential Notes

When `pitch` is an array, the notes play as a chord by default. Set `sequential: true` to play them one after another instead.

```javascript
// Chord (notes play simultaneously)
track.addEvent(new MidiWriter.NoteEvent({pitch: ['C4', 'E4', 'G4'], duration: '1'}));

// Arpeggio (notes play sequentially)
track.addEvent(new MidiWriter.NoteEvent({pitch: ['C4', 'E4', 'G4'], duration: '8', sequential: true}));
```

### Multi-Track

Pass an array of tracks to `Writer` to create a multi-track MIDI file.

```javascript
import MidiWriter from 'midi-writer-js';

const melody = new MidiWriter.Track();
melody.addTrackName('Melody');
melody.addEvent(new MidiWriter.ProgramChangeEvent({instrument: 1}));
melody.addEvent(new MidiWriter.NoteEvent({pitch: ['E5', 'D5', 'C5'], duration: '4', sequential: true}));

const bass = new MidiWriter.Track();
bass.addTrackName('Bass');
bass.addEvent(new MidiWriter.ProgramChangeEvent({instrument: 33}));
bass.addEvent(new MidiWriter.NoteEvent({pitch: ['C2'], duration: '1'}));

const writer = new MidiWriter.Writer([melody, bass]);
console.log(writer.dataUri());
```

### Controller Changes & Pitch Bend

```javascript
import MidiWriter from 'midi-writer-js';

const track = new MidiWriter.Track();

// Set volume via CC #7
track.addEvent(new MidiWriter.ControllerChangeEvent({controllerNumber: 7, controllerValue: 100}));

// Pitch bend ranging from -1.0 to 1.0 (0 = no bend)
track.addEvent(new MidiWriter.PitchBendEvent({bend: 0.5}));

track.addEvent(new MidiWriter.NoteEvent({pitch: ['E4'], duration: '2'}));

const writer = new MidiWriter.Writer(track);
console.log(writer.dataUri());
```

## API Summary

### `Track`

| Method | Description |
|---|---|
| `addEvent(event, mapFunction?)` | Add one or more events. Supports method chaining. |
| `setTempo(bpm, tick?)` | Set tempo in beats per minute. |
| `setTimeSignature(numerator, denominator)` | Set time signature. |
| `setKeySignature(sf, mi?)` | Set key signature (e.g., `'C'`, `'Dm'`, `'F#'`). |
| `setPitchBend(bend)` | Set pitch bend (`-1.0` to `1.0`). |
| `controllerChange(number, value, channel?, delta?)` | Add a controller change event. |
| `addTrackName(text)` | Set the track name. |
| `addText(text)` | Add a text event. |
| `addCopyright(text)` | Add a copyright notice. |
| `addInstrumentName(text)` | Set the instrument name. |
| `addMarker(text)` | Add a marker event. |
| `addCuePoint(text)` | Add a cue point event. |
| `addLyric(text)` | Add a lyric event. |
| `mergeTrack(track)` | Merge another track's events into this track. |
| `removeEventsByName(name)` | Remove all events of a given type. |
| `polyModeOn()` | Enable poly mode. |

### `NoteEvent` Options

<table>
	<thead>
		<tr>
			<th>Name</th>
			<th>Type</th>
			<th>Default</th>
			<th>Description</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><b>pitch</b></td>
			<td>string or array</td>
			<td></td>
			<td>Each pitch can be a string or valid MIDI note code.  Format for string is <code>C#4</code>.  You can use the output from <a href="https://github.com/tonaljs/tonal" target="_blank">tonal</a> to build scales, chords, etc.</td>
		</tr>
		<tr>
			<td><b>duration</b></td>
			<td>string or array</td>
			<td><code>'4'</code></td>
			<td>How long the note should sound (see <a href="#duration-values">Duration Values</a>). If an array of durations is passed then the sum will be used.</td>
		</tr>
		<tr>
			<td><b>wait</b></td>
			<td>string or array</td>
			<td><code>0</code></td>
			<td>Rest before sounding note. Takes same values as <b>duration</b>.</td>
		</tr>
		<tr>
			<td><b>sequential</b></td>
			<td>boolean</td>
			<td><code>false</code></td>
			<td>If <code>true</code>, array of pitches plays sequentially instead of as a chord.</td>
		</tr>
		<tr>
			<td><b>velocity</b></td>
			<td>number</td>
			<td><code>50</code></td>
			<td>How loud the note should sound, values 1-100.</td>
		</tr>
		<tr>
			<td><b>repeat</b></td>
			<td>number</td>
			<td><code>1</code></td>
			<td>How many times this event should repeat.</td>
		</tr>
		<tr>
			<td><b>channel</b></td>
			<td>number</td>
			<td><code>1</code></td>
			<td>MIDI channel to use (1-16).</td>
		</tr>
		<tr>
			<td><b>grace</b></td>
			<td>string or array</td>
			<td></td>
			<td>Grace note(s) applied before the main note. Takes same format as <code>pitch</code>.</td>
		</tr>
		<tr>
			<td><b>startTick</b></td>
			<td>number</td>
			<td></td>
			<td>Explicit tick position for this event. If supplied, <code>wait</code> is ignored.</td>
		</tr>
		<tr>
			<td><b>tick</b></td>
			<td>number</td>
			<td></td>
			<td>Alias for <code>startTick</code>.</td>
		</tr>
	</tbody>
</table>

### `Writer`

| Method | Returns | Description |
|---|---|---|
| `buildFile()` | `Uint8Array` | Build the MIDI file as a byte array. |
| `base64()` | `string` | Base64-encoded string of the MIDI file. |
| `dataUri()` | `string` | Data URI string (useful for playback or download links). |
| `stdout()` | — | Write MIDI file to stdout (Node.js CLI usage). |
| `setOption(key, value)` | `Writer` | Set an option on the writer instance. |

### Event Classes

| Class | Description |
|---|---|
| `NoteEvent` | High-level note event that generates NoteOn/NoteOff pairs. |
| `NoteOnEvent` | Raw MIDI note-on event. |
| `NoteOffEvent` | Raw MIDI note-off event. |
| `ProgramChangeEvent` | Change the instrument (patch) on a channel. |
| `PitchBendEvent` | Pitch bend event (`-1.0` to `1.0`). |
| `ControllerChangeEvent` | Controller change (CC) event. |
| `TempoEvent` | Set tempo (BPM). |
| `TimeSignatureEvent` | Set time signature. |
| `KeySignatureEvent` | Set key signature. |
| `TextEvent` | General text meta event. |
| `CopyrightEvent` | Copyright meta event. |
| `TrackNameEvent` | Track/sequence name meta event. |
| `InstrumentNameEvent` | Instrument name meta event. |
| `MarkerEvent` | Marker meta event. |
| `CuePointEvent` | Cue point meta event. |
| `LyricEvent` | Lyric meta event. |
| `EndTrackEvent` | End of track meta event (added automatically). |

See the [full API documentation](https://grimmdude.com/MidiWriterJS/docs/) for details on each class.

### Duration Values

| Value | Duration |
|---|---|
| `1` | Whole |
| `2` | Half |
| `d2` | Dotted half |
| `dd2` | Double dotted half |
| `4` | Quarter |
| `4t` | Quarter triplet |
| `d4` | Dotted quarter |
| `dd4` | Double dotted quarter |
| `8` | Eighth |
| `8t` | Eighth triplet |
| `d8` | Dotted eighth |
| `dd8` | Double dotted eighth |
| `16` | Sixteenth |
| `16t` | Sixteenth triplet |
| `32` | Thirty-second |
| `64` | Sixty-fourth |
| `Tn` | Explicit number of ticks (e.g., `T128` = 1 beat) |

## VexFlow Integration

MidiWriterJS can export MIDI from VexFlow voices, though this feature is **experimental**.

```javascript
// ...VexFlow code defining notes
const voice = create_4_4_voice().addTickables(notes);

const vexWriter = new MidiWriter.VexFlow();
const track = vexWriter.trackFromVoice(voice);
const writer = new MidiWriter.Writer([track]);
console.log(writer.dataUri());
```

## Demos

- [Example with Magenta player](https://codepen.io/dirkk0/pen/rNZLXjZ) by Dirk Krause [@dirkk0](https://github.com/dirkk0)

## License

MIT
