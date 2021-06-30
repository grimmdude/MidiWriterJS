const assert = require('assert');
const MidiWriter = require('..');

/**
 * Mock a VexFlow StaveNote
 * @param {String} noteType
 * @param {String} duration
 * @param {[String]} keys
 * @param {boolean} isDotted
 */
function mockNote(noteType='n', duration='8', keys=['c/4'], dots=0, tuplet=null, accidentals=null) {
	const result = {
		noteType,
		duration,
		keys,
		dots,
		tuplet,
		getAccidentals() {
			return accidentals;
		}
	};
	return result;
}

describe('MidiWriterJS', function() {
	describe('#VexFlow()', function() {
		it('instantiates', function() {
			const v = new MidiWriter.VexFlow();
			assert.notStrictEqual(typeof v, 'undefined');
			assert.strictEqual(v instanceof MidiWriter.VexFlow, true);
		});
		describe('#trackFromVoice', function() {
			it('converts a VexFlow voice into a track', function() {
				const mockVoice = {
					tickables: [
						mockNote('n', '8', ['g#/3']),
						mockNote('n', '8', ['b/3']),
						mockNote('n', '8', ['c#/3']),
						mockNote('r'),
						mockNote('n', '8', ['b/3']),
						mockNote('r'),
						mockNote('n', '8', ['c#/3']),
						mockNote('n', '8', ['b/3']),
						mockNote('n', '8', ['a#/3']),
						mockNote('r'),
						mockNote('n', '8', ['b/3']),
						mockNote('r')
					]
				};
				const vexFlow = new MidiWriter.VexFlow();
				const track = vexFlow.trackFromVoice(mockVoice);
				const write = new MidiWriter.Writer(track);
				assert.strictEqual(write.base64(), 'TVRoZAAAAAYAAAABAIBNVHJrAAAATACQOEBAgDhAAJA7QECAO0AAkDFAQIAxQECQO0BAgDtAQJAxQECAMUAAkDtAQIA7QACQOkBAgDpAQJA7QECAO0BAkAAAAIAAAAD/LwA=');
			});

			it('preserves multiple rests', function() {
				const mockVoice = {
					tickables: [
						mockNote(),
						mockNote('r'),
						mockNote('r'),
						mockNote('')
					]
				};
				const vexFlow = new MidiWriter.VexFlow();
				const track = vexFlow.trackFromVoice(mockVoice);
				const write = new MidiWriter.Writer(track);
				assert.strictEqual(write.base64(), 'TVRoZAAAAAYAAAABAIBNVHJrAAAAFQCQPEBAgDxAgQCQAAAAgAAAAP8vAA==');
			});

			it('appends trailing rests with a silent note', function() {
				const mockVoice = {
					tickables: [
						mockNote(),
						mockNote(),
						mockNote('r'),
						mockNote('r')
					]
				};
				const vexFlow = new MidiWriter.VexFlow();
				const track = vexFlow.trackFromVoice(mockVoice);
				const write = new MidiWriter.Writer(track);
				assert.strictEqual(write.base64(), 'TVRoZAAAAAYAAAABAIBNVHJrAAAAHQCQPEBAgDxAAJA8QECAPECBAJAAAACAAAAA/y8A');
			});
		});

		describe('#convertPitch()', function() {
			it('converts pitch', function () {
				const vexFlow = new MidiWriter.VexFlow();
				const tickable = mockNote('n', 'h', ['c/4']);
				assert.deepStrictEqual(tickable.keys.map((pitch, index) => vexFlow.convertPitch(pitch, index, tickable)), ['c4']);
			});
			it('converts multiple pitch', function() {
				const vexFlow = new MidiWriter.VexFlow();
				const tickable = mockNote('n', 'h', ['b/4', 'c/4']);
				assert.deepStrictEqual(tickable.keys.map((pitch, index) => vexFlow.convertPitch(pitch, index, tickable)), ['b4', 'c4']);
			});
			it('converts accidentals pitch', function() {
				const vexFlow = new MidiWriter.VexFlow();
				const tickable = mockNote('n', 'h', ['b#/4', 'cb/4', 'dn/4']);
				assert.deepStrictEqual(tickable.keys.map((pitch, index) => vexFlow.convertPitch(pitch, index, tickable)), ['b#4', 'cb4', 'd4']);
			});
			it('converts rendered accidentals pitch', function() {
				const vexFlow = new MidiWriter.VexFlow();
				const tickable = mockNote('n', 'h', ['b/4', 'c/4'], 0, null, [{index: 0, type: '#'}, {index: 1, type: 'b'}]);
				assert.deepStrictEqual(tickable.keys.map((pitch, index) => vexFlow.convertPitch(pitch, index, tickable, true)), ['b#4', 'cb4']);
			});
		});

		describe('#convertDuration()', function() {
			it('converts whole, half, quarter and eighth durations', function () {
				const vexFlow = new MidiWriter.VexFlow();
				const tickable = mockNote('n', 'w');
				assert.strictEqual(vexFlow.convertDuration(tickable), '1');
				tickable.duration = 'h'
				assert.strictEqual(vexFlow.convertDuration(tickable), '2');
				tickable.duration = 'q'
				assert.strictEqual(vexFlow.convertDuration(tickable), '4');
				tickable.duration = '8'
				assert.strictEqual(vexFlow.convertDuration(tickable), '8');
			});
			it('converts dotted half, quarter and eighth durations', function () {
				const vexFlow = new MidiWriter.VexFlow();
				const tickable = mockNote('n', 'h', ['c/4'], 1);
				assert.strictEqual(vexFlow.convertDuration(tickable), 'd2');
				tickable.duration = 'q'
				assert.strictEqual(vexFlow.convertDuration(tickable), 'd4');
				tickable.duration = '8'
				assert.strictEqual(vexFlow.convertDuration(tickable), 'd8');
			});
			it('converts multiple dotted durations', function() {
				const vexFlow = new MidiWriter.VexFlow();
				const tickable = mockNote('n', 'h', ['c/4'], 2);
				assert.strictEqual(vexFlow.convertDuration(tickable), 'dd2');
				tickable.dots = 3
				assert.strictEqual(vexFlow.convertDuration(tickable), 'ddd2');
				tickable.dots = 4
				assert.strictEqual(vexFlow.convertDuration(tickable), 'dddd2');
			});
			it('converts tuplet durations', function() {
				const vexFlow = new MidiWriter.VexFlow();
				const tickable = mockNote('n', 'h', ['c/4'], 0, {num_notes: 3});
				assert.strictEqual(vexFlow.convertDuration(tickable), '2t3');
				tickable.tuplet.num_notes = 5
				assert.strictEqual(vexFlow.convertDuration(tickable), '2t5');
				tickable.tuplet.num_notes = 7
				assert.strictEqual(vexFlow.convertDuration(tickable), '2t7');
			});
			it('converts dotted tuplet durations', function() {
				const vexFlow = new MidiWriter.VexFlow();
				const tickable = mockNote('n', 'h', ['c/4'], 1, {num_notes: 3});
				assert.strictEqual(vexFlow.convertDuration(tickable), 'd2t3');
				tickable.tuplet.num_notes = 5
				assert.strictEqual(vexFlow.convertDuration(tickable), 'd2t5');
				tickable.dots = 2
				assert.strictEqual(vexFlow.convertDuration(tickable), 'dd2t5');
			});
			it('returns other durations', function () {
				const vexFlow = new MidiWriter.VexFlow();
				const tickable = mockNote('n', '64', ['c/4']);	
				assert.strictEqual(vexFlow.convertDuration(tickable), '64');
			});
		});
	});
});
