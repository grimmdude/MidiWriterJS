import {HeaderChunk} from './header-chunk';
import {Utils} from './utils';

/**
 * Object that puts together tracks and provides methods for file output.
 * @param {array|Track} tracks - A single {Track} object or an array of {Track} objects.
 * @return {Writer}
 */
class Writer {
	constructor(tracks) {
		// Ensure track is an array
		tracks = Utils.toArray(tracks);

		this.data = [];
		this.data.push(new HeaderChunk(tracks.length))

		// For each track add final end of track event and build data
		tracks.forEach((track, i) => {
			this.data.push(track.buildData());
		});
	}

	/**
	 * Builds the file into a Uint8Array
	 * @return {Uint8Array}
	 */
	buildFile() {
		var build = [];

		// Data consists of chunks which consists of data
		this.data.forEach((d) => build = build.concat(d.type, d.size, d.data));

		return new Uint8Array(build);
	}

	/**
	 * Convert file buffer to a base64 string.  Different methods depending on if browser or node.
	 * @return {string}
	 */
	base64() {
		if (typeof btoa === 'function') return btoa(String.fromCharCode.apply(null, this.buildFile()));
		return Buffer.from(this.buildFile()).toString('base64');
	}

    /**
     * Get the data URI.
     * @return {string}
     */
    dataUri() {
		return 'data:audio/midi;base64,' + this.base64();
    }

	/**
	 * Output to stdout
	 * @return {string}
	 */
    stdout() {
		return process.stdout.write(new Buffer(this.buildFile()));
    }
}

export {Writer};
