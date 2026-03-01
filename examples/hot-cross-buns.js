const MidiWriter = require('midi-writer-js');

const track = new MidiWriter.Track();

track.addEvent([
			new MidiWriter.NoteEvent({pitch: ['E4','D4'], duration: '4'}),
			new MidiWriter.NoteEvent({pitch: 'C4', duration: '2'}),
			new MidiWriter.NoteEvent({pitch: ['E4','D4'], duration: '4'}),
			new MidiWriter.NoteEvent({pitch: 'C4', duration: '2'}),
			new MidiWriter.NoteEvent({pitch: ['C4', 'C4', 'C4', 'C4', 'D4', 'D4', 'D4', 'D4'], duration: '8'}),
			new MidiWriter.NoteEvent({pitch: ['E4','D4'], duration: '4'}),
			new MidiWriter.NoteEvent({pitch: 'C4', duration: '2'})
	], function(event, index) {
    return {sequential:true};
  }
);

const writer = new MidiWriter.Writer(track);
console.log(writer.dataUri());
module.exports = writer;
