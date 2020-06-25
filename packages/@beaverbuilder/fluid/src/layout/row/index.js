import React from 'react'
import classname from 'classnames'
import { getSpacingValue } from '../utils'
import Layout from '../'

const Row = ( {
	className,
	align = 'center',
	style,
	padX = false,
	padY = false,
	gap = 0,
	direction,
	...rest
} ) => {

	const formatAlign = val => {

		if ( 'left' === val ) {
			return 'flex-start'
		}
		if ( 'right' === val ) {
			return 'flex-end'
		}

		return val
	}

	const formatDirection = val => {
		if ( 'reverse' === val ) {
			return 'row-reverse'
		}
		return val
	}

	const styles = {
		justifyContent: formatAlign( align ),
		'--fluid-gap': getSpacingValue( gap ),
		flexDirection: formatDirection( direction ),
		...style,
	}

	const classes = classname( 'fluid-row', className )

	return (
		<Layout.Box
			padX={ padX }
			padY={ padY }
			className={ classes }
			style={ styles }
			{ ...rest }
		/>
	)
}

export default Row
