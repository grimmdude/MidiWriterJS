import MidiWriter = require('midi-writer-js');

const track = new MidiWriter.Track();
const data: Uint8Array = new MidiWriter.Writer(track).buildFile();
