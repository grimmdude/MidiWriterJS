var MidiWriter = require('..');

var track = new MidiWriter.Track();

track.addEvent([
			new MidiWriter.NoteEvent({
				pitch: 'C4',
				duration: 'T50',
				startTick: 0
			}),
			new MidiWriter.NoteEvent({
				pitch: 'E4',
				duration: 'T50',
				startTick: 50
			}),
			new MidiWriter.NoteEvent({
				pitch: ['G4', 'B4'],
				duration: 'T50',
				startTick: 100
			}),
			new MidiWriter.NoteEvent({
				pitch: 'C5',
				duration: 'T50',
				startTick: 150
			}),
			new MidiWriter.NoteEvent({
				pitch: 'D5',
				duration: 'T50',
				startTick: 200
			}),
			new MidiWriter.NoteEvent({
				pitch: 'F5',
				duration: 'T50',
				startTick: 250
			}),
			new MidiWriter.NoteEvent({
				pitch: 'A5',
				duration: 'T50',
				startTick: 300
			}),
	]
);

var write = new MidiWriter.Writer(track);
console.log(write.dataUri());
module.exports = write;