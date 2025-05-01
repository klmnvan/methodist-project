const SpacerEM = ({size = 1, orientation = 'v'}) => {
    const style = {
        width: orientation === 'h' ? `${size}em` : 'auto',
        height: orientation === 'v' ? `${size}em` : 'auto',
        flexShrink: 0
    }

    return <div style={style}/>
}

export default SpacerEM;

