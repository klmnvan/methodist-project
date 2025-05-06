const SpacerPX = ({size = 1, orientation = 'v'}) => {
    const style = {
        width: orientation === 'h' ? `${size}px` : 'auto',
        height: orientation === 'v' ? `${size}px` : 'auto',
        flexShrink: 0
    }

    return <div style={style}/>
}

export default SpacerPX;