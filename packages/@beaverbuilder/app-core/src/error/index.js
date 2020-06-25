import React, { Component, createElement } from 'react'
import { __ } from '@wordpress/i18n'

const Error = {}

class Boundary extends Component {
	constructor( props ) {
		super( props )
		this.state = {
			hasError: false,
			error: null,
		}
	}

	static getDerivedStateFromError( error ) {
		return {
			hasError: true,
			error,
		}
	}

	render() {
		const { alternate = DefaultError, children } = this.props
		const { hasError, error } = this.state

		if ( hasError ) {
			return createElement( alternate, { error } )
		}
		return children
	}
}

const DefaultError = ( {
	error,
	title = __( 'There seems to be an error' ),
	children,
	style = {},
	...rest
} ) => {
	const boxStyle = {
		...style,
		display: 'flex',
		flexDirection: 'column',
		flex: '1 1 auto',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 40,
		textAlign: 'center',
		minHeight: 0,
		maxHeight: '100%',
	}
	return (
		<div style={ boxStyle } {...rest}>
			<h1 style={{ marginBottom: 20 }}>{title}</h1>
			<code style={{ padding: 10 }}>{error.message}</code>
			{children}
		</div>
	)
}

// Ensure the proper display name in the react dev tools tree
Error.Boundary = Boundary
Error.Boundary.displayName = 'Error.Boundary'

Error.Page = DefaultError
Error.Page.displayName = 'Error.Page'

export default Error
