import { type ColorOption } from './type.d'

export const AllColors: Array<ColorOption> = [
    {
        label: '红色',
        value: 'red',
    },
    {
        label: '黄色',
        value: 'yellow',
    },
    {
        label: '蓝色',
        value: 'blue',
    },
    {
        label: '绿色',
        value: 'green',
    },
    {
        label: '粉色',
        value: 'pink',
    },
    {
        label: '棕色',
        value: 'brown',
    },
    {
        label: '青色',
        value: 'cyan',
    },
]

export const ColorLabelMap = AllColors.reduce((result: any, item) => {
    result[item.value] = item.label
    return result
}, {})
