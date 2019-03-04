import React, { useEffect, useState } from 'react'
import classname from 'classnames'
import Clipboard from 'react-clipboard.js'

export const CopyButton = ( {
	label = 'Copy',
	text,
	className,
} ) => {
	const [ buttonLabel, setbuttonLabel ] = useState( label )
	const classes = classname( className, 'fl-asst-button' )
	let clickTimeout = null

	const onClick = () => {
		setbuttonLabel( 'Copied!' )
		clearTimeout( clickTimeout )
		clickTimeout = setTimeout( () => setbuttonLabel( label ), 1500 )
	}

	useEffect( () => {
		return () => clearTimeout( clickTimeout )
	}, [] )

	return (
		<Clipboard onClick={ onClick } data-clipboard-text={ text } button-className={ classes }>
			{ buttonLabel }
		</Clipboard>
	)
}
