import { AbstractEvent } from "../abstract-event";

interface MetaEvent extends AbstractEvent {
    readonly type: number|number[];
}

export {MetaEvent};
