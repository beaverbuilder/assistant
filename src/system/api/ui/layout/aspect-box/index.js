import React from 'react'
import classname from 'classnames'
import { Layout } from 'fluid/ui'
import './style.scss'

const AspectBox = ( {
	children,
	className,
	ratio = 'square',
	style,
	width,
	height,
	...rest
} ) => {

	const classes = classname( 'fl-asst-aspect-box', className )

	const paddingForRatio = () => {

		if ( width && height ) {
			return ( height / width ) * 100 + '%'
		}

		if ( 'square' === ratio || '1:1' === ratio ) {
			return '100%'
		} else if ( 'video' === ratio || '16:9' === ratio ) {
			return '56.25%'
		} else if ( 'poster' === ratio || '3:4' === ratio ) {
			return '133.3%'
		} else {
			const parts = ratio.split( ':' )
			return ( 100 / parts[0] ) * parts[1] + '%'
		}
	}

	const styles = {
		...style,
		paddingTop: paddingForRatio(),
	}

	return (
		<Layout.Box
			padY={ false }
			padX={ false }
			className={ classes }
			style={ styles }
			{ ...rest }
		>
			<div>{children}</div>
		</Layout.Box>
	)
}

export default AspectBox
