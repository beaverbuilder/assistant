import classname from 'classnames'

const Box = ({
    children,
    className,
    style,
    padX = true,
    padY = true,
    outset = false,
    ...rest
}) => {

    const classes = classname({
        'fluid-box' : true,
        'fluid-pad-x' : padX && !outset,
        'fluid-pad-y' : padY,
        'fluid-box-outset' : outset,
    }, className )

    return (
        <div className={classes} style={style} {...rest}>{children}</div>
    )
}

export default Box
