import React, { Component, createElement } from 'react'

class ErrorBoundary extends Component {
	constructor( props ) {
		super( props )
		this.state = {
			hasError: false,
			error: null,
		}
	}

	static getDerivedStateFromError( error ) {

		// Update state so the next render will show the fallback UI.
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

export default ErrorBoundary
