export interface CommonOption {
    label: string
    value: string
    info?: any
}

export type Color = 'red' | 'yellow' | 'blue' | 'green' | 'pink' | 'brown' | 'cyan'

export interface ColorOption {
    label: string
    value: Color
}

export interface Cell {
    state: 'empty' | 'set' | 'prepared'
    color?: Color
    position: Position
}

export interface Code {
    color?: Color
    position?: Position
}

export interface Position {
    x: number
    y: number
}
