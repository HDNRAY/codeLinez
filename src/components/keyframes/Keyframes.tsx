interface KeyframeProps {
    name: string
    [key: string]: React.CSSProperties | string
}

export const Keyframes = (props: KeyframeProps) => {
    const toCss = (cssObject: React.CSSProperties | string) =>
        typeof cssObject === 'string'
            ? cssObject
            : Object.keys(cssObject).reduce((accumulator, key) => {
                  const cssKey = key.replace(/[A-Z]/g, (v) => `-${v.toLowerCase()}`)
                  const cssValue = (cssObject as any)[key].toString().replace("'", '')
                  return `${accumulator}${cssKey}:${cssValue};`
              }, '')

    return (
        <style>
            {`@keyframes ${props.name} {
          ${Object.keys(props)
              .map((key) => {
                  return ['from', 'to'].includes(key)
                      ? `${key} { ${toCss(props[key])} }`
                      : /^_[0-9]+$/.test(key)
                      ? `${key.replace('_', '')}% { ${toCss(props[key])} }`
                      : ''
              })
              .join(' ')}
        }`}
        </style>
    )
}
