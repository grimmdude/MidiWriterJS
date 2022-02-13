var MidiWriter = require('..');

var tracks = [];
tracks[0] = new MidiWriter.Track();

// You can chain track methods.
tracks[0]
	.setTempo(60)
	.addEvent([
		// addEvent() accepts an array of event objects like this...
		new MidiWriter.ProgramChangeEvent({instrument : 1}),
		new MidiWriter.NoteEvent({pitch: ['B4'], duration: 'd2'}),
		new MidiWriter.NoteEvent({pitch: ['C5'], duration: '4'}),
		new MidiWriter.NoteEvent({pitch: ['B4'], duration: 'd2'}),
		new MidiWriter.NoteEvent({pitch: ['C5'], duration: '4'}),
		new MidiWriter.NoteEvent({pitch: ['B4'], duration: 'd2'}),
		new MidiWriter.NoteEvent({pitch: ['C5'], duration: '4'}),
		new MidiWriter.NoteEvent({pitch: ['B4'], duration: 'd2'}),
		new MidiWriter.NoteEvent({pitch: ['Bb4'], duration: '4'}),
		new MidiWriter.NoteEvent({pitch: ['A4'], duration: 'd2'}),
		new MidiWriter.NoteEvent({pitch: ['B4'], duration: '4'}),
		new MidiWriter.NoteEvent({pitch: ['A4'], duration: 'd2'}),
		new MidiWriter.NoteEvent({pitch: ['B4'], duration: '4'}),
		new MidiWriter.NoteEvent({pitch: ['A4'], duration: 'd2'}),
		new MidiWriter.NoteEvent({pitch: ['B4'], duration: 'd8'}),
		new MidiWriter.NoteEvent({pitch: ['A4'], duration: '16'}),
		new MidiWriter.NoteEvent({pitch: ['A4'], duration: 'd2'}),
		new MidiWriter.NoteEvent({pitch: ['Ab4'], duration: '2'}),
		new MidiWriter.NoteEvent({pitch: ['A4', 'B4', 'D5', 'C5', 'E4', 'A4'], duration: '8', sequential:true}),
		new MidiWriter.NoteEvent({pitch: ['Gb4'], duration: 'd2'}),
		new MidiWriter.NoteEvent({pitch: ['A4'], duration: '4'}),
		new MidiWriter.NoteEvent({pitch: ['Gb4'], duration: 'd2'}),
		new MidiWriter.NoteEvent({pitch: ['A4'], duration: '4'}),
		new MidiWriter.NoteEvent({pitch: ['G4', 'Gb4', 'C4', 'B3', 'Eb4', 'Gb4'], duration: '8', sequential:true}),
		new MidiWriter.NoteEvent({pitch: ['D5', 'C5', 'B4'], duration: '8t', sequential:true}),
		new MidiWriter.NoteEvent({pitch: ['B4'], duration: 'd2'}),
		new MidiWriter.NoteEvent({pitch: ['C5'], duration: '4'}),
		new MidiWriter.NoteEvent({pitch: ['B4'], duration: 'd2'}),
		new MidiWriter.NoteEvent({pitch: ['C5'], duration: '4'}),
		new MidiWriter.NoteEvent({pitch: ['B4'], duration: 'd2'}),
		new MidiWriter.NoteEvent({pitch: ['C5'], duration: '4'}),
		new MidiWriter.NoteEvent({pitch: ['B4'], duration: 'd8'}),
		new MidiWriter.NoteEvent({pitch: ['Bb4'], duration: '16'}),
		new MidiWriter.NoteEvent({pitch: ['Bb4'], duration: '4'}),
		new MidiWriter.NoteEvent({pitch: ['G5'], duration: '4'}),
		new MidiWriter.NoteEvent({pitch: ['Gb5'], duration: 'd8'}),
		new MidiWriter.NoteEvent({pitch: ['E5'], duration: '16'}),
		new MidiWriter.NoteEvent({pitch: ['E5', 'D#5', 'C6', 'D#5', 'D#5', 'E5', 'G5', 'B4'], duration: '8', sequential:true}),
		new MidiWriter.NoteEvent({pitch: ['D5', 'C5'], duration: '8', sequential:true}),
		new MidiWriter.NoteEvent({pitch: ['E5', 'E4', 'A4'], duration: '8t', sequential:true}),
		new MidiWriter.NoteEvent({pitch: ['Gb4'], duration: 'd4'}),
		new MidiWriter.NoteEvent({pitch: ['A4'], duration: '8'}),
		new MidiWriter.NoteEvent({pitch: ['Gb4'], duration: 'd2'}),
		new MidiWriter.NoteEvent({pitch: ['A4'], duration: '4'}),
		new MidiWriter.NoteEvent({pitch: ['Gb4'], duration: 'd2'}),
		new MidiWriter.NoteEvent({pitch: ['Gb4'], duration: 'd8'}),
		new MidiWriter.NoteEvent({pitch: ['E4'], duration: '16'}),
		new MidiWriter.NoteEvent({pitch: ['E4'], duration: 'd2'}),
		new MidiWriter.NoteEvent({pitch: ['Gb4'], duration: '4'}),
		new MidiWriter.NoteEvent({pitch: ['E4'], duration: 'd2'}),
		new MidiWriter.NoteEvent({pitch: ['Gb4'], duration: '4'}),
		new MidiWriter.NoteEvent({pitch: ['E4'], duration: '2'}),
		new MidiWriter.NoteEvent({pitch: ['C6', 'G5', 'D5', 'C5'], duration: '2', wait: '2'}),
		new MidiWriter.NoteEvent({pitch: ['C6', 'G5', 'D5', 'C5'], duration: '2'}),
		new MidiWriter.NoteEvent({pitch: ['C6', 'G5', 'E5', 'C5'], duration: '4'})
		], function(index, event) {
			return {velocity: 100};
		}
	);

// You can optionally pass a single event object to addEvent() if you wish
tracks[1] = new MidiWriter.Track();
tracks[1].addEvent(new MidiWriter.ProgramChangeEvent({instrument : 1}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['E4', 'B3', 'G3'], duration: '8', repeat: 8}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['E4', 'A3', 'F#3'], duration: '8', repeat: 4}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['D#4', 'A3', 'F#3'], duration: '8', repeat: 4}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['D#4', 'A3', 'F3'], duration: '8', repeat: 4}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['D4', 'A3', 'F3'], duration: '8', repeat: 2}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['D4', 'G#3', 'F3'], duration: '8', repeat: 2}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['D4', 'G#3', 'E3'], duration: '8', repeat: 4}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['D4', 'G3', 'E3'], duration: '8', repeat: 2}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['C#4', 'G3', 'E3'], duration: '8', repeat: 2}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['C4', 'G3', 'E3'], duration: '8', repeat: 4}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['C4', 'F#3', 'E3'], duration: '8', repeat: 8}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['C4', 'F#3', 'D#3'], duration: '8', repeat: 4}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['C4', 'F#3', 'D3'], duration: '8', repeat: 8}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['C4', 'F3', 'D3'], duration: '8', repeat: 4}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['B4', 'F3', 'D3'], duration: '8', repeat: 4}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['B4', 'E3', 'C3'], duration: '8', repeat: 2}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['A4', 'E3', 'C3'], duration: '8', repeat: 6}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['A4', 'E3', 'B3'], duration: '8', repeat: 2}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['A4', 'D#3', 'B3'], duration: '8', repeat: 2}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['A4', 'E3', 'C3'], duration: '8', repeat: 4}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['A4', 'D#3', 'B3'], duration: '8', repeat: 4}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['A4', 'E3', 'C3'], duration: '8', repeat: 4}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['A4', 'D#3', 'B3'], duration: '4'}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['E4', 'B3', 'G3'], duration: '8', wait: 'd2'}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['E4', 'B3', 'G3'], duration: '8'}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['E4', 'B3', 'G3'], duration: '8'}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['E4', 'B3', 'G3'], duration: '8'}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['E4', 'B3', 'G3'], duration: '8'}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['E4', 'B3', 'G3'], duration: '8'}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['E4', 'B3', 'G3'], duration: '8'}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['E4', 'B3', 'G3'], duration: '8'}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['E4', 'A3', 'F#3'], duration: '8', repeat: 4}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['D#4', 'A3', 'F3'], duration: '8', repeat: 4}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['D#4', 'G#3', 'F3'], duration: '8', repeat: 2}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['D4', 'G#3', 'F3'], duration: '8', repeat: 2}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['D4', 'G3', 'E3'], duration: '8', repeat: 4}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['D4', 'G3', 'E3'], duration: '8', repeat: 2}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['C#4', 'G3', 'E3'], duration: '8', repeat: 2}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['A#4', 'E3', 'C#3'], duration: '8', repeat: 2}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['A4', 'E3', 'C3'], duration: '8', repeat: 2}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['B3', 'B2'], duration: '8'}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['A5', 'F#5', 'C4', 'A4'], duration: '8', repeat: 3}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['F#5', 'D#5', 'B4', 'G4'], duration: '8'}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['E5', 'B4', 'G4'], duration: '8', repeat: 3}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['E5', 'C4', 'A4'], duration: '8', repeat: 2}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['A3'], duration: '8'}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['C4', 'F#3', 'E3'], duration: '8'}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['B4', 'E3', 'B3'], duration: '8', repeat: 2}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['A4', 'E3', 'C3'], duration: '8', repeat: 2}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['B3', 'E3', 'B2'], duration: '8', repeat: 4}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['A3', 'E3', 'C3'], duration: '8', repeat: 4}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['B3', 'E3', 'B2'], duration: '8', repeat: 4}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['B3', 'D#3', 'B3'], duration: '8', repeat: 2}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['A3', 'D#3', 'B3'], duration: '8', repeat: 2}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['G3', 'E3', 'C3'], duration: '8', repeat: 4}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Bb3', 'E3', 'C3'], duration: '8', repeat: 2}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['A3', 'E3', 'C3'], duration: '8', repeat: 2}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['A3', 'E3', 'B3'], duration: '8', repeat: 2}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['G#3', 'E3', 'B3'], duration: '8', repeat: 2}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['G3', 'E3', 'B3'], duration: '8', repeat: 4}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['G3', 'C3', 'A#3'], duration: '2'}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['B3', 'B2'], duration: '2', wait: '2'}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['B3', 'F#3', 'B2'], duration: '2'}));
tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['E2', 'E1'], duration: '1'}));

var write = new MidiWriter.Writer(tracks);
console.log(write.dataUri());
//write.stdout();

module.exports = write;