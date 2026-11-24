import MidiWriter from 'midi-writer-js';

const track = new MidiWriter.Track();
track.addEvent(new MidiWriter.NoteEvent({pitch: ['C4'], duration: '4'}));
const data: Uint8Array = new MidiWriter.Writer(track).buildFile();
