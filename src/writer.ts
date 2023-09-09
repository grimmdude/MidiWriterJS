import {Header} from './chunks/header';
import {Track} from './chunks/track';
import {Utils} from './utils';

/**
 * Object that puts together tracks and provides methods for file output.
 * @param {array|Track} tracks - A single {Track} object or an array of {Track} objects.
 * @param {object} options - {middleC: 'C4'}
 * @return {Writer}
 */
class Writer {
	tracks: Track[];
	options: object;

	constructor(tracks, options = {}) {
		// Ensure tracks is an array
		this.tracks = Utils.toArray(tracks);
		this.options = options;
	}

	/**
	 * Builds array of data from chunkschunks.
	 * @return {array}
	 */
	buildData() {
		const data = [];
		data.push(new Header(this.tracks.length))

		// For each track add final end of track event and build data
		this.tracks.forEach((track) => {
			data.push(track.buildData(this.options));
		});

		return data;
	}

	/**
	 * Builds the file into a Uint8Array
	 * @return {Uint8Array}
	 */
	buildFile(): Uint8Array {
		let build = [];

		// Data consists of chunks which consists of data
		this.buildData().forEach((d) => build = build.concat(d.type, d.size, d.data));

		return new Uint8Array(build);
	}

	/**
	 * Convert file buffer to a base64 string.  Different methods depending on if browser or node.
	 * @return {string}
	 */
	base64(): string {
		if (typeof btoa === 'function') {
			return btoa(String.fromCharCode.apply(null, this.buildFile()));
		}

		return Buffer.from(this.buildFile()).toString('base64');
	}

    /**
     * Get the data URI.
     * @return {string}
     */
    dataUri(): string {
		return 'data:audio/midi;base64,' + this.base64();
    }


	/**
	 * Set option on instantiated Writer.
	 * @param {string} key
	 * @param {any} value
	 * @return {Writer}
	 */
	setOption(key: string, value: number|string): Writer {
		this.options[key] = value;
		return this;
	}

	/**
	 * Output to stdout
	 * @return {string}
	 */
    stdout() {
		return process.stdout.write(Buffer.from(this.buildFile()));
    }
}

export {Writer};
