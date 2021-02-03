const assert = require('assert');
const MidiWriter = require('..');

/**
 * Mock a VexFlow StaveNote
 * @param {String} noteType
 * @param {String} duration
 * @param {[String]} keys
 * @param {boolean} isDotted
 */
function mockNote(noteType='n', duration='8', keys=['c/4'], isDotted=false) {
	const result = {
		noteType,
		duration,
		keys,
		isDotted() {
			return isDotted;
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
				const vexNote = 'pit/ch';
				const vexFlow = new MidiWriter.VexFlow();
				assert.strictEqual(vexFlow.convertPitch(vexNote), 'pitch');
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
				const tickable = mockNote('n', 'h', ['c4'], true);
				assert.strictEqual(vexFlow.convertDuration(tickable), 'd2');
				tickable.duration = 'q'
				assert.strictEqual(vexFlow.convertDuration(tickable), 'd4');
				tickable.duration = '8'
				assert.strictEqual(vexFlow.convertDuration(tickable), 'd8');
			});
			it('preserves numeric and other durations', function () {
				const vexFlow = new MidiWriter.VexFlow();
				const tickable = mockNote('n', 99);
				assert.strictEqual(vexFlow.convertDuration(tickable), 99);
				tickable.duration = 'other'
				assert.strictEqual(vexFlow.convertDuration(tickable), 'other');
			});
		});
	});
});
