import React, { createContext, useContext } from 'react'
import classname from 'classnames'

import './reset.scss'
import './style.scss'
import './forms.scss'

export const Appearance = ( {
	className,
	brightness,
	size,
	...rest,
} ) => {
	const parentContext = useContext( Appearance.Context )

	const classes = classname( {
		'fl-asst-appearance': true,
		[`fl-asst-brightness-${brightness}`]: brightness,
		[`fl-asst-size-${size}`]: size,
	}, className )

	const context = {
		...parentContext,
		brightness,
		size,
	}
	return (
		<Appearance.Context.Provider value={ context }>
			<div className={ classes } { ...rest } />
		</Appearance.Context.Provider>
	)
}

Appearance.defaults = {
	brightness: 'light',
	size: 'normal',
}

Appearance.Context = createContext( Appearance.defaults )
Appearance.Context.displayName = 'Appearance.Context'
