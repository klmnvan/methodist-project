export default function SpacerV ({size = 1, orientation = 'v'}) {
    const style = {
        width: orientation === 'h' ? `${size}vw ` : 'auto',
        height: orientation === 'v' ? `${size}vh` : 'auto',
        flexShrink: 0,
        display: 'block',
    }

    return <div style={style}/>
}