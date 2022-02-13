/**
	VARIATIONS
	Faciles
	Pour la Guitare
	Sur un air National Autrichien
	Composées
	PAR
	MAURO GIULIANI
	Oev: 47 Prix 3f
	à Paris
	chez RICHAULT...
	Boulevard Poissonièr No 16, au 1er
	[N.] 1303. R.

	This is the main theme, the pubblication comes along with 12
	variations, it´s a pretty good start for classical guitarists.
**/
var MidiWriter = require('..');
var tracks = [];

tracks[0] = new MidiWriter.Track();
tracks[0].setTimeSignature(3, 4);
tracks[0].setTempo(100);

var notes;

// melody
tracks[1] = new MidiWriter.Track();
notes = new MidiWriter.NoteEvent({pitch:['C#5', 'E5'], duration: '2'});
tracks[1].addEvent(notes);
notes = new MidiWriter.NoteEvent({pitch:['C#5', 'E5'], duration: '4'});
tracks[1].addEvent(notes);
notes = new MidiWriter.NoteEvent({pitch:['C#5', 'E5'], duration: '2'});
tracks[1].addEvent(notes);
notes = new MidiWriter.NoteEvent({pitch:['A4', 'C#5'], duration: '4'});
tracks[1].addEvent(notes);
notes = new MidiWriter.NoteEvent({pitch:['B4', 'D5'], duration: '2'});
tracks[1].addEvent(notes);
notes = new MidiWriter.NoteEvent({pitch:['G#4', 'E5'], duration: '4'});
tracks[1].addEvent(notes);
notes = new MidiWriter.NoteEvent({pitch:['A4', 'C#5'], duration: '2'});
tracks[1].addEvent(notes);
notes = new MidiWriter.NoteEvent({pitch:['A4'], duration: '4'});
tracks[1].addEvent(notes);
notes = new MidiWriter.NoteEvent({pitch:['C#5', 'E5'], duration: '2'});
tracks[1].addEvent(notes);
notes = new MidiWriter.NoteEvent({pitch:['C#5', 'E5'], duration: '4'});
tracks[1].addEvent(notes);
notes = new MidiWriter.NoteEvent({pitch:['C#5', 'E5'], duration: '2'});
tracks[1].addEvent(notes);
notes = new MidiWriter.NoteEvent({pitch:['A4', 'C#5'], duration: '4'});
tracks[1].addEvent(notes);
notes = new MidiWriter.NoteEvent({pitch:['B4', 'D5'], duration: '2'});
tracks[1].addEvent(notes);
notes = new MidiWriter.NoteEvent({pitch:['G#4', 'E5'], duration: '4'});
tracks[1].addEvent(notes);
notes = new MidiWriter.NoteEvent({pitch:['A4', 'C#5'], duration: '2'});
tracks[1].addEvent(notes);
// note how the previous rest is handled: it became the wait
notes = new MidiWriter.NoteEvent({wait: '4', pitch:['E5', 'E5'], duration: '4'});
tracks[1].addEvent(notes);
notes = new MidiWriter.NoteEvent({pitch:['D#5', 'F#5'], duration: '4'});
tracks[1].addEvent(notes);
notes = new MidiWriter.NoteEvent({pitch:['D5', 'G#5'], duration: '4'});
tracks[1].addEvent(notes);
notes = new MidiWriter.NoteEvent({pitch:['C#5', 'A5'], duration: '2'});
tracks[1].addEvent(notes);
notes = new MidiWriter.NoteEvent({pitch:['E5'], duration: '4'});
tracks[1].addEvent(notes);
notes = new MidiWriter.NoteEvent({pitch:['E5', 'E5'], duration: '4'});
tracks[1].addEvent(notes);
notes = new MidiWriter.NoteEvent({pitch:['D#5', 'F#5'], duration: '4'});
tracks[1].addEvent(notes);
notes = new MidiWriter.NoteEvent({pitch:['D5', 'G#5'], duration: '4'});
tracks[1].addEvent(notes);
notes = new MidiWriter.NoteEvent({pitch:['C#5', 'A5'], duration: '2'});
tracks[1].addEvent(notes);
notes = new MidiWriter.NoteEvent({wait: '4', pitch:['C#5', 'E5'], duration: '2'});
tracks[1].addEvent(notes);
notes = new MidiWriter.NoteEvent({pitch:['C#5', 'E5'], duration: '4'});
tracks[1].addEvent(notes);
notes = new MidiWriter.NoteEvent({pitch:['C#5', 'E5'], duration: '4'});
tracks[1].addEvent(notes);
notes = new MidiWriter.NoteEvent({pitch:['A5'], duration: '4'});
tracks[1].addEvent(notes);
notes = new MidiWriter.NoteEvent({pitch:['A4', 'C#5'], duration: '4'});
tracks[1].addEvent(notes);
notes = new MidiWriter.NoteEvent({pitch:['C#5', 'E5'], duration: '4'});
tracks[1].addEvent(notes);
notes = new MidiWriter.NoteEvent({pitch:['B4', 'D5'], duration: '4'});
tracks[1].addEvent(notes);
notes = new MidiWriter.NoteEvent({pitch:['G#4', 'B4'], duration: '4'});
tracks[1].addEvent(notes);
notes = new MidiWriter.NoteEvent({pitch:['A4'], duration: '2'});
tracks[1].addEvent(notes);

// bass
tracks[2] = new MidiWriter.Track();
notes = new MidiWriter.NoteEvent({pitch:['A3'], duration: '2'});
tracks[2].addEvent(notes);
notes = new MidiWriter.NoteEvent({wait: '4', pitch: ['A3'], duration: '2'});
tracks[2].addEvent(notes);
notes = new MidiWriter.NoteEvent({wait: '4', pitch: ['E3'], duration: '2'});
tracks[2].addEvent(notes);
notes = new MidiWriter.NoteEvent({wait: '4', pitch: ['A3'], duration: '2'});
tracks[2].addEvent(notes);
notes = new MidiWriter.NoteEvent({wait: '4', pitch: ['A3'], duration: '2'});
tracks[2].addEvent(notes);
notes = new MidiWriter.NoteEvent({wait: '4', pitch: ['A3'], duration: '2'});
tracks[2].addEvent(notes);
notes = new MidiWriter.NoteEvent({wait: '4', pitch: ['E3'], duration: '2'});
tracks[2].addEvent(notes);
notes = new MidiWriter.NoteEvent({wait: '4', pitch: ['A3'], duration: '2'});
tracks[2].addEvent(notes);
notes = new MidiWriter.NoteEvent({wait: '4', pitch: ['E3'], duration: '2'});
tracks[2].addEvent(notes);
notes = new MidiWriter.NoteEvent({wait: '4', pitch: ['A3'], duration: '2'});
tracks[2].addEvent(notes);
notes = new MidiWriter.NoteEvent({wait: '4', pitch: ['E3'], duration: '2'});
tracks[2].addEvent(notes);
notes = new MidiWriter.NoteEvent({wait: '4', pitch: ['A3'], duration: '2'});
tracks[2].addEvent(notes);
notes = new MidiWriter.NoteEvent({wait: '4', pitch: ['A3'], duration: '2'});
tracks[2].addEvent(notes);
notes = new MidiWriter.NoteEvent({wait: '4', pitch: ['A3'], duration: '2'});
tracks[2].addEvent(notes);
notes = new MidiWriter.NoteEvent({wait: '4', pitch: ['E3'], duration: '2'});
tracks[2].addEvent(notes);
notes = new MidiWriter.NoteEvent({wait: '4', pitch: ['A3'], duration: '2'});
tracks[2].addEvent(notes);


var write = new MidiWriter.Writer(tracks);

console.log(write.dataUri());
module.exports = write;