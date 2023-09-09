/**
 * MIDI file format constants.
 * @return {Constants}
 */

const Constants = {
	VERSION					: '3.0.0',
	HEADER_CHUNK_TYPE  		: [0x4d, 0x54, 0x68, 0x64], // Mthd
	HEADER_CHUNK_LENGTH  	: [0x00, 0x00, 0x00, 0x06], // Header size for SMF
	HEADER_CHUNK_FORMAT0    : [0x00, 0x00], // Midi Type 0 id
	HEADER_CHUNK_FORMAT1    : [0x00, 0x01], // Midi Type 1 id
	HEADER_CHUNK_DIVISION   : [0x00, 0x80], // Defaults to 128 ticks per beat
	TRACK_CHUNK_TYPE		: [0x4d, 0x54, 0x72, 0x6b], // MTrk,
	META_EVENT_ID			: 0xFF,
	META_SMTPE_OFFSET		: 0x54
};

export {Constants};
