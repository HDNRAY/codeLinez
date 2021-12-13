
export interface CommonOption {
    label: string,
    value: string,
    info?: any
}

export interface ColorOption {
    label: string,
    value: Colors,
    color: string
}

export interface Cell {
    state: 'empty' | 'set' | 'prepared',
    color?: Colors,
    position: Position
}

export interface Code {
    color?: Colors,
    position?: Position
}

export interface Position {
    x: number,
    y: number
}