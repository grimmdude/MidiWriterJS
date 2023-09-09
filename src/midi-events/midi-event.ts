import {AbstractEvent} from '../abstract-event';


interface MidiEvent extends AbstractEvent {
    channel: number;
    status: number;
    // eslint-disable-next-line @typescript-eslint/ban-types
    buildData?: Function;
}

export {MidiEvent};
