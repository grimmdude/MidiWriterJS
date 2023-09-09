import {Chunk} from './chunk';
import {Constants} from '../constants';
import {Utils} from '../utils';

/**
 * Object representation of a header chunk section of a MIDI file.
 * @param {number} numberOfTracks - Number of tracks
 * @return {Header}
 */
class Header implements Chunk {
	data: number[];
	type: number[];
	size: number[];

	constructor(numberOfTracks) {
		this.type = Constants.HEADER_CHUNK_TYPE;

		const trackType = numberOfTracks > 1? Constants.HEADER_CHUNK_FORMAT1 : Constants.HEADER_CHUNK_FORMAT0;

		this.data = trackType.concat(
					Utils.numberToBytes(numberOfTracks, 2), // two bytes long,
					Constants.HEADER_CHUNK_DIVISION
		);

		this.size = [0, 0, 0, this.data.length];
	}
}

export {Header};
