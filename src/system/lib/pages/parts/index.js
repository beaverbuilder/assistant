import React from 'fl-react'
import classname from 'fl-classnames'

// Horizontal Toolbar - edge padding for controls
export const Toolbar = ( {
	className,
	shouldPadSides = true,
	shouldPadBottom = false,
	shouldPadTop = false,
	...rest
} ) => {
	const classes = classname( {
		'fl-asst-toolbar': true,
		'fl-asst-pad-top': shouldPadTop,
		'fl-asst-pad-sides': shouldPadSides,
		'fl-asst-pad-bottom': shouldPadBottom,
	}, className )
	return (
		<div className={ classes } { ...rest } />
	)
}

// Padded box
export const Pad = ( {
	className,
	top = true,
	sides = true,
	bottom = true,
	...rest
} ) => {
	const classes = classname( {
		'fl-asst-pad-top': top,
		'fl-asst-pad-sides': sides,
		'fl-asst-pad-bottom': bottom,
	}, className )

	return <div className={ classes } { ...rest } />
}

export const TitleCard = ({ className, title }) => {
    const classes = classname({
        'fl-asst-title-card' : true,
    }, className )
    
    return (
        <div className={classes}>
            { title && <div>{title}</div> }
        </div>
    )
}
