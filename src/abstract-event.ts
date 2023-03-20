interface AbstractEvent {
    readonly data: number[];
    delta: number;
    readonly name: string;
    tick?: number;
}

export {AbstractEvent};