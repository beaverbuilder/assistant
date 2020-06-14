import React, { Component, createElement } from 'react'

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

const DefaultError = ( { error } ) => {
	const style = {
		display: 'flex',
		flexDirection: 'column',
		flex: '1 0 auto',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20
	}
	return (
		<div className="fluid-default-error-message" style={ style }>
			<div>There seems to be an error.</div>
			<code>{error.message}</code>
		</div>
	)
}

// Ensure the proper display name in the react dev tools tree
Error.Boundary = Boundary
Error.Boundary.displayName = 'Error.Boundary'

Error.DefaultError = DefaultError
Error.DefaultError.displayName = 'Error.DefaultError'

export default Error
