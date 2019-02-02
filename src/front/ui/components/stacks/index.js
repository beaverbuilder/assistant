import React, { useState } from 'react'
import classname from 'classnames'
import posed from 'react-pose'
import { Button, StackContext } from 'components'
import './style.scss'

export const StackView = posed.div({
	init: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'var(--fl-background-color)'
	},
	past: {
		x: '-100%',
	},
	present: {
		x: '0%',
	},
	future: {
		x: '100%'
	},
})

export const Stack = ( { children, className } ) => {
	const [currPose, setCurrPose] = useState('present')
	const [futurePose, setFuturePose] = useState('future')
	const classes = classname( {
		'fl-asst-stack': true,
	}, className )

	const context = {
		pushView: () => {
			console.log('push')
			setCurrPose('past')
			setFuturePose('present')
		},
		popView: () => {
			console.log('pop')
			setFuturePose('future')
			setCurrPose('present')
		},
	}

	return (
		<StackContext.Provider value={context}>
			<div className={classes}>
				<StackView pose={currPose}>
					{children}
				</StackView>
				<StackView pose={futurePose}>
					Next View
					<Button onClick={context.popView}>Pop View</Button>
				</StackView>
			</div>
		</StackContext.Provider>
	)
}
