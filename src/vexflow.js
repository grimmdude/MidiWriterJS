import {NoteEvent} from './note-events/note-event';
import {Track} from './track';

class VexFlow {

	/**
	 * Support for converting VexFlow voice into MidiWriterJS track
	 * @return MidiWriter.Track object
	 */
	trackFromVoice(voice, options = {addRenderedAccidentals: false}) {
		const track = new Track();
		let wait = [];

		voice.tickables.forEach(tickable => {
			if (tickable.noteType === 'n') {
				track.addEvent(new NoteEvent({
					pitch: tickable.keys.map((pitch, index) => this.convertPitch(pitch, index, tickable, options.addRenderedAccidentals)),
					duration: this.convertDuration(tickable),
					wait
				}));
				// reset wait
				wait = [];
			} else if (tickable.noteType === 'r') {
				// move on to the next tickable and add this to the stack
				// of the `wait` property for the next note event
				wait.push(this.convertDuration(tickable));
			}
		});

		// There may be outstanding rests at the end of the track,
		// pad with a ghost note (zero duration and velocity), just to capture the wait.
		if(wait.length > 0) {
			track.addEvent(new NoteEvent({pitch: '[c4]', duration: '0', wait, velocity: '0'}));
		}

		return track;
	}

	/**
	 * Converts VexFlow pitch syntax to MidiWriterJS syntax
	 * @param pitch string
	 * @param index pitch index
	 * @param note struct from Vexflow
	 * @param addRenderedAccidentals adds Vexflow rendered accidentals
	 */
	convertPitch(pitch, index, note, addRenderedAccidentals = false) {
		// Splits note name from octave
		const pitchParts = pitch.split('/');

		// Retrieves accidentals from pitch
		// Removes natural accidentals since they are not accepted in Tonal Midi
		let accidentals = pitchParts[0].substring(1).replace('n', '');
		
		if (addRenderedAccidentals) {
			note.getAccidentals()?.forEach(accidental => {
				if (accidental.index === index) {
					if (accidental.type === 'n') {
						accidentals = '';
					} else {
						accidentals += accidental.type;
					}
				}
			});
		}

		return pitchParts[0][0] + accidentals + pitchParts[1];
	}

	/**
	 * Converts VexFlow duration syntax to MidiWriterJS syntax
	 * @param note struct from VexFlow
	 */
	convertDuration(note) {
		return 'd'.repeat(note.dots) + this.convertBaseDuration(note.duration) + (note.tuplet ? 't' + note.tuplet.num_notes : '');
	}

	/**
	 * Converts VexFlow base duration syntax to MidiWriterJS syntax
	 * @param duration Vexflow duration
	 * @returns MidiWriterJS duration
	 */
	convertBaseDuration(duration) {
		switch (duration) {
			case 'w':
				return '1';
			case 'h':
				return '2';
			case 'q':
				return '4';
			default:
				return duration;
		}
	}
}

export {VexFlow};
