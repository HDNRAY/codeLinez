export interface CommonOption {
    label: string,
    value: string,
    info?: any
}

export interface Cell {
    state: 'empty' | 'set' | 'prepared',
    color: Colors | undefined,
    position: Position
}

export interface Position {
    x: number,
    y: number
}