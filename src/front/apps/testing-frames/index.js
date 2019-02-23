import React, { Fragment, useContext } from 'react'
import { getSystemActions } from 'store'
import { FrameContext, EmptyMessage } from 'components'

const { registerApp } = getSystemActions()

const App = () => {
	return (
		<Fragment>
			<InsideFrame />
		</Fragment>
	)
}

const InsideFrame = () => {
	const { size, width, height } = useContext( FrameContext )
	return (
		<EmptyMessage>
			{ size && <div>{size}</div> }
			{ width && <div>{width} x {height}</div> }
		</EmptyMessage>
	)
}

registerApp( 'testing', {
	label: 'Testing',
	content: () => <App />
} )
