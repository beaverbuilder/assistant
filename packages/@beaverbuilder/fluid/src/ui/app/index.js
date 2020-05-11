import React from 'react'
import classname from 'classnames'
import Error from '../error'
import Nav from '../nav'
import './style.scss'

const Root = ( {
	children,
	errorComponent,
	colorScheme = 'light',
	className,
	routerProps = {},
	onHistoryChanged,
	...rest
} ) => {
	const classes = classname( {
		'fluid': true,
		'fl': true,
		'uid': true,
		[`fluid-color-scheme-${colorScheme}`]: colorScheme
	}, className )

	return (
		<Error.Boundary alternate={ errorComponent }>
			<Nav.Root onHistoryChanged={ onHistoryChanged } { ...routerProps }>
				<div className={ classes } { ...rest }>
					{children}
				</div>
			</Nav.Root>
		</Error.Boundary>
	)
}

const App = Root

App.Root = Root
App.Root.displayName = 'App.Root'

export default App
