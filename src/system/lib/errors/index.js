import { Component, createElement } from 'react'

export const Error = props => props.children

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
		const { alternate, children } = this.props
		const { hasError, error } = this.state
		if ( hasError ) {
			return createElement( alternate, error )
		}
		return children
	}
}

Error.Boundary = ErrorBoundary
Error.Boundary.displayName = 'Error.Boundary'
