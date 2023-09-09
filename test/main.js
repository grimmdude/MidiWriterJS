const assert = require('assert');
const MidiWriter = require('..');

describe('MidiWriterJS', function() {
	describe('#NoteEvent()', function () {
		describe('#getTickDuration()', function () {
			it('should create a dotted half note if passed three quarter notes.', function () {
				const track = new MidiWriter.Track(); // Need to instantiate to build note object
				const note = new MidiWriter.NoteEvent({pitch: 'C4', duration: ['4', '4', '4']});
				track.addEvent(note);
				const write = new MidiWriter.Writer(track);
				assert.equal('TVRoZAAAAAYAAAABAIBNVHJrAAAADQCQPECDAIA8QAD/LwA=', write.base64());
			});

			it('should create a note with duration of 50 ticks if passed T50', function () {
				const track = new MidiWriter.Track(); // Need to instantiate to build note object
				const note = new MidiWriter.NoteEvent({pitch: 'C4', duration: 'T50'});
				track.addEvent(note);
				const write = new MidiWriter.Writer(track);
				assert.equal('TVRoZAAAAAYAAAABAIBNVHJrAAAADACQPEAygDxAAP8vAA==', write.base64());
			});
		});
	});

	describe('#Track()', function() {
		describe('#Time Signature', function() {
			it('should return specific base64 string when time signature is 4/4', function() {
				const track = new MidiWriter.Track();
				track.setTimeSignature(4, 4);
				const write = new MidiWriter.Writer(track);
				assert.equal('TVRoZAAAAAYAAAABAIBNVHJrAAAADAD/WAQEAhgIAP8vAA==', write.base64());
			});

			it('should return specific base64 string when time signature is 2/2', function() {
				const track = new MidiWriter.Track();
				track.setTimeSignature(2, 2);
				const write = new MidiWriter.Writer(track);
				assert.equal('TVRoZAAAAAYAAAABAIBNVHJrAAAADAD/WAQCARgIAP8vAA==', write.base64());
			});

			it('should return specific base64 string when time signature is 2/8', function() {
				const track = new MidiWriter.Track();
				track.setTimeSignature(2, 8);
				const write = new MidiWriter.Writer(track);
				assert.equal('TVRoZAAAAAYAAAABAIBNVHJrAAAADAD/WAQCAxgIAP8vAA==', write.base64());
			});
		});

		it('should return specific base64 string when setting C major key signature', function() {
			const track = new MidiWriter.Track();
			track.setKeySignature('C');
			const write = new MidiWriter.Writer(track);
			assert.equal('TVRoZAAAAAYAAAABAIBNVHJrAAAACgD/WQIAAAD/LwA=', write.base64());
		});

		it('should return specific base64 string when adding copyright', function() {
			const track = new MidiWriter.Track();
			track.addCopyright('2018 Garrett Grimm');
			const write = new MidiWriter.Writer(track);
			assert.equal('TVRoZAAAAAYAAAABAIBNVHJrAAAAGgD/AhIyMDE4IEdhcnJldHQgR3JpbW0A/y8A', write.base64());
		});

		it('should return specific base64 string when adding text', function() {
			const track = new MidiWriter.Track();
			track.addText('MidiWriterJS is the bomb!');
			const write = new MidiWriter.Writer(track);
			assert.equal('TVRoZAAAAAYAAAABAIBNVHJrAAAAIQD/ARlNaWRpV3JpdGVySlMgaXMgdGhlIGJvbWIhAP8vAA==', write.base64());
		});

		it('should return specific base64 string when adding a track name', function() {
			const track = new MidiWriter.Track();
			track.addTrackName('Name of a cool track');
			const write = new MidiWriter.Writer(track);
			assert.equal('TVRoZAAAAAYAAAABAIBNVHJrAAAAHAD/AxROYW1lIG9mIGEgY29vbCB0cmFjawD/LwA=', write.base64());
		});

		it('should return specific base64 string when adding an instrument name', function() {
			const track = new MidiWriter.Track();
			track.addInstrumentName('Alto Saxophone');
			const write = new MidiWriter.Writer(track);
			assert.equal('TVRoZAAAAAYAAAABAIBNVHJrAAAAFgD/BA5BbHRvIFNheG9waG9uZQD/LwA=', write.base64());
		});

		it('should return specific base64 string when adding a marker', function() {
			const track = new MidiWriter.Track();
			track.addMarker('This is my favorite part of the song.');
			const write = new MidiWriter.Writer(track);
			assert.equal('TVRoZAAAAAYAAAABAIBNVHJrAAAALQD/BiVUaGlzIGlzIG15IGZhdm9yaXRlIHBhcnQgb2YgdGhlIHNvbmcuAP8vAA==', write.base64());
		});

		it('should return specific base64 string when adding a cue point', function() {
			const track = new MidiWriter.Track();
			track.addCuePoint('Here is a cue point.');
			const write = new MidiWriter.Writer(track);
			assert.equal('TVRoZAAAAAYAAAABAIBNVHJrAAAAHAD/BxRIZXJlIGlzIGEgY3VlIHBvaW50LgD/LwA=', write.base64());
		});

		it('should return specific base64 string when adding a lyric', function() {
			const track = new MidiWriter.Track();
			track.addLyric('Oh say can you see.');
			const write = new MidiWriter.Writer(track);
			assert.equal('TVRoZAAAAAYAAAABAIBNVHJrAAAAGwD/BRNPaCBzYXkgY2FuIHlvdSBzZWUuAP8vAA==', write.base64());
		});

		it('should return specific base64 string when adding a controller change event', function() {
			const track = new MidiWriter.Track();
			track.controllerChange(1, 127);
			const write = new MidiWriter.Writer(track);
			assert.equal('TVRoZAAAAAYAAAABAIBNVHJrAAAACACwAX8A/y8A', write.base64());
		});

		it('should return specific base64 string when adding a controller change event with channel and delta specified', function() {
			const track = new MidiWriter.Track();
			track.controllerChange(1, 127, 16, 256);
			const write = new MidiWriter.Writer(track);
			assert.equal('TVRoZAAAAAYAAAABAIBNVHJrAAAACYIAvwF/AP8vAA==', write.base64());
		});

		it('should create 3 triplet eights followed by a quarter - on correct ticks', function() {
			const track = new MidiWriter.Track();
			track.addEvent([
				new MidiWriter.NoteEvent({pitch: ['D5', 'C5', 'B4'], duration: '8t', sequential: true}),
				new MidiWriter.NoteEvent({pitch: ['B4'], duration: 'd2'}),
			])
			const builtTrack = track.buildData();
			assert.equal(builtTrack.events[6].tick, 128)
			assert.equal(builtTrack.events[7].tick, 512)
		})

		/*
		it('should create 3 triplet eights followed by a whole, after normal 6 eights - on correct ticks', function() {
			const track = new MidiWriter.Track();
			track.addEvent([
				new MidiWriter.NoteEvent({pitch: ['G4', 'Gb4', 'C4', 'B3', 'Eb4', 'Gb4'], duration: '8', sequential:true}),
				new MidiWriter.NoteEvent({pitch: ['D5', 'C5', 'B4'], duration: '8t', sequential: true}),
				new MidiWriter.NoteEvent({pitch: ['B#4'], duration: '1'}),
			])
			const builtTrack = track.buildData();

			// Reversing these events breaks this test since EndOfTrackEvent gets misplaced.
			const lastEvents = [...builtTrack.events].reverse();
			// 2nd bar:
			assert.equal(lastEvents[2].tick, 128 * 4);
			// 3rd bar:
			assert.equal(lastEvents[1].tick, 128 * 8);
		})
		*/

		it('should write 14 bars where certain notes should start exactly at the beginning of each bar', function() {
			const track = new MidiWriter.Track();
			track
				.setTempo(60)
				.addEvent([
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
					new MidiWriter.NoteEvent({pitch: ['G1', 'Gb4', 'C4', 'B3', 'Eb4', 'Gb4'], duration: '8', sequential: true}),
					new MidiWriter.NoteEvent({pitch: ['D5', 'C5', 'B5'], duration: '8t', sequential: true}),
					// 4x quintuplets
					new MidiWriter.NoteEvent({pitch: ['B1', 'A4', 'A4', 'A4', 'A4'], duration: '8t5', sequential: true}),
					new MidiWriter.NoteEvent({pitch: ['A4', 'A4', 'A4', 'A4', 'A4'], duration: '8t5', sequential: true}),
					new MidiWriter.NoteEvent({pitch: ['A4', 'A4', 'A4', 'A4', 'A4'], duration: '8t5', sequential: true}),
					new MidiWriter.NoteEvent({pitch: ['A4', 'A4', 'A4', 'A4', 'A4'], duration: '8t5', sequential: true}),
					new MidiWriter.NoteEvent({pitch: ['F1'], duration: '1'}),
				]);

			const builtTrack = track.buildData();
			const twelvethBarEvent = builtTrack.events.find((event) => event.pitch === 'G1')
			const thirteenthBarEvent = builtTrack.events.find((event) => event.pitch === 'B1');
			const fourteenthBarEvent = builtTrack.events.find((event) => event.pitch === 'F1');
			// 12th bar:
			assert.equal(twelvethBarEvent.tick, 512 * 11);
			// 13th bar:
			assert.equal(thirteenthBarEvent.tick, 512 * 12);
			// 14th bar:
			assert.equal(fourteenthBarEvent.tick, 512 * 13);
			// console.log(builtTrack.events)
		})

		it('3 triplets and 1 dotted is the duration as one whole - next bar starts in the correct place', function() {
			const track = new MidiWriter.Track();

			track
				.addEvent([
					new MidiWriter.ProgramChangeEvent({instrument : 1}),
					new MidiWriter.NoteEvent({pitch: ['D5', 'G5', 'B4'], duration: '8t', sequential: true}),
					new MidiWriter.NoteEvent({pitch: ['B4'], duration: 'd2'}),
					new MidiWriter.NoteEvent({pitch: ['C5'], duration: '4'}),
				]);

			const builtTrack = track.buildData();
			const bar2note = builtTrack.events.find((event) => event.pitch === 'C5');

			const track2 = new MidiWriter.Track();

			track2
				.addEvent([
					new MidiWriter.ProgramChangeEvent({instrument : 1}),
					new MidiWriter.NoteEvent({pitch: ['D5'], duration: '1'}),
					new MidiWriter.NoteEvent({pitch: ['C5'], duration: '4'}),
				]);

			const builtTrack2 = track2.buildData();
			const bar2note2 = builtTrack2.events.find((event) => event.pitch === 'C5');

			assert.equal(JSON.stringify(bar2note, null, 2), JSON.stringify(bar2note2, null, 2));
		})

		it('should return specific base64 string when manually adding EndTrackEvent', function() {
			const track = new MidiWriter.Track();

			track.addEvent([
				new MidiWriter.NoteEvent({pitch: ['C5', 'E5', 'G4'], duration: '4'}),
				new MidiWriter.EndTrackEvent({delta: 5000}),
			]);

			const write = new MidiWriter.Writer(track);
			assert.equal('TVRoZAAAAAYAAAABAIBNVHJrAAAAHgCQSEAAkExAAJBDQIEAgEhAAIBMQACAQ0CnCP8vAA==', write.base64());
		})

		it('should return specific base64 string when removing events by name', function() {
			const track = new MidiWriter.Track();

			track.addEvent(new MidiWriter.CopyrightEvent({text: "Garrett Grimm"}));
			track.removeEventsByName('CopyrightEvent');
			track.addEvent(new MidiWriter.NoteEvent({pitch: ["C4", "D4", "E4"], sequential: true}));

			const write = new MidiWriter.Writer([track]);

			assert.equal('TVRoZAAAAAYAAAABAIBNVHJrAAAAHwCQPECBAIA8QACQPkCBAIA+QACQQECBAIBAQAD/LwA=', write.base64());
		});
	});

	describe('#Utils()', function() {
		describe('#stringToBytes()', function () {
			it('should return [116, 101, 115, 116] when "test" is passed.', function () {
				assert.equal([116, 101, 115, 116].toString(), MidiWriter.Utils.stringToBytes('test').toString());
			});
		});

		describe('#isNumeric()', function () {
			it('should return false when "t" is passed.', function () {
				assert.equal(false, MidiWriter.Utils.isNumeric('t'));
			});
		});

		describe('#getPitch()', function () {
			it('should return 101 when "F7" is passed.', function () {
				assert.equal(101, MidiWriter.Utils.getPitch('F7'));
			});

			it('should return 98 when "D6" is passed and middle C is set to "C3".', function () {
				assert.equal(98, MidiWriter.Utils.getPitch('D6', 'C3'));
			});

			it('should return 72 (C5) when "B#4" is passed.', function () {
				assert.equal(72, MidiWriter.Utils.getPitch('B#4'));
			});
		});

		describe('#stringByteCount()', function () {
			it('should return 7 when "Garrett" is passed.', function () {
				assert.equal(7, MidiWriter.Utils.stringByteCount('Garrett'));
			});
		});

		describe('#numberFromBytes()', function () {
			it('should return 8463 when [0x21, 0x0f] is passed.', function () {
				assert.equal(8463, MidiWriter.Utils.numberFromBytes([0x21, 0x0f]));
			});
		});

		describe('#numberToBytes()', function () {
			it('should return [0, 5] when converting the number 5 into two bytes.', function() {
				assert.equal([0, 5].toString(), MidiWriter.Utils.numberToBytes(5, 2));
			});
		});

		describe('#getDurationMultiplier()', function () {
			it('should return 1 for a quarter note.', function () {
				const note = new MidiWriter.NoteEvent({pitch: 'C4', duration: '4'});
				assert.equal(MidiWriter.Utils.getDurationMultiplier(note.duration), 1);
			});
		});

		describe('#getTickDuration()', function () {
			it('should return 128 for a quarter note.', function () {
				const note = new MidiWriter.NoteEvent({pitch: 'C4', duration: '4'});
				assert.equal(MidiWriter.Utils.getTickDuration(note.duration), 128);
			});
			it('should return 128 for 3 triplet eights.', function () {
				const note = new MidiWriter.NoteEvent({pitch: 'C4', duration: ['8t', '8t', '8t']});
				assert.equal(MidiWriter.Utils.getTickDuration(note.duration), 128);
			});
		});

	});
});
