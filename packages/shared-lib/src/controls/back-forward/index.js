import React from 'fl-react'
import classname from 'classnames'
import { Button, Icon } from 'components'
import './style.scss'

export const BackForwardControl = props => {
	const {
		className,
		onNext = () => {},
		onPrevious = () => {},
		isNextEnabled = true,
		isPreviousEnabled = true,
	} = props

	const classes = classname( {
		'fl-asst-back-forward-control': true,
	}, className )

	return (
		<div className={classes}>
			<Button onClick={onPrevious} appearance="transparent" disabled={! isPreviousEnabled}><Icon name="back" /></Button>
			<Button onClick={onNext} appearance="transparent" disabled={! isNextEnabled}><Icon name="forward" /></Button>
		</div>
	)
}
