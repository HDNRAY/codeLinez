import { ColorOption } from './type'

export enum Colors {
    RED = 1,
    YELLOW = 2,
    BLUE = 3,
    GREEN = 4,
    PINK = 5,
    BROWN = 6,
    CYAN = 7,
}

export const AllColors: Array<ColorOption> = [
    {
        label: '红色',
        value: Colors.RED,
        color: 'red',
    },
    {
        label: '黄色',
        value: Colors.YELLOW,
        color: 'yellow',
    },
    {
        label: '蓝色',
        value: Colors.BLUE,
        color: 'blue',
    },
    {
        label: '绿色',
        value: Colors.GREEN,
        color: 'green',
    },
    {
        label: '粉色',
        value: Colors.PINK,
        color: 'pink',
    },
    {
        label: '棕色',
        value: Colors.BROWN,
        color: 'chocolate',
    },
    {
        label: '青色',
        value: Colors.CYAN,
        color: 'cyan',
    },
]

export const ColorLabelMap = AllColors.reduce((result: any, item) => {
    result[item.value] = item.label
    return result
}, {})

export const ColorMap = AllColors.reduce((result: any, item) => {
    result[item.value] = item.color
    return result
}, {})
