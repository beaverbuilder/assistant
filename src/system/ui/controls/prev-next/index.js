import React from 'react'
import classname from 'classnames'
import { Button, Icon } from 'ui'

export const NextPrev = ( {
	className,
	onPrev = () => {},
	onNext = () => {},
	...rest
} ) => {
	const classes = classname( {
		'fl-asst-control-next-prev': true,
	}, className )

	return (
		<div className={ classes } { ...rest }>
			<Button appearance="transparent" onClick={ e => onPrev( e ) }>
				<Icon.CaretLeft />
			</Button>
			<Button appearance="transparent" onClick={ e => onNext( e ) }>
				<Icon.CaretRight />
			</Button>
		</div>
	)
}
