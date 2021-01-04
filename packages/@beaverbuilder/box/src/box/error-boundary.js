import React, { Component, createElement } from 'react'

const DefaultError = ( { error } ) => <code>{error.message}</code>

class ErrorBoundary extends Component {
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
			return createElement( true === alternate ? DefaultError : alternate, { error } )
		}
		return children
	}
}

export default ErrorBoundary
