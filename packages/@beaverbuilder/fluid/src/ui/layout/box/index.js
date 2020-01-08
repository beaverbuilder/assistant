import classname from 'classnames'

const Box = ({
    children,
    className,
    style,
    padX = true,
    padY = true,
    ...rest
}) => {

    const classes = classname({
        'fluid-pad-x' : padX,
        'fluid-pad-y' : padY,
    }, className )

    const boxStyles = {
        display: 'flex',
        flexDirection: 'column',
        ...style,
    }

    return (
        <div className={classes} style={boxStyles} {...rest}>{children}</div>
    )
}

export default Box
