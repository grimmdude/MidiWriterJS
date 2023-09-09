interface AbstractEvent {
    data: number[];
    delta: number;
    name: string;
    tick?: number;
}

export {AbstractEvent};