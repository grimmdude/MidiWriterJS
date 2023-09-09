import { AbstractEvent } from "../abstract-event";

interface MetaEvent extends AbstractEvent {
    type: number|number[];
}

export {MetaEvent};
