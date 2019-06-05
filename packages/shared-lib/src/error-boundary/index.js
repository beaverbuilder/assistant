import { Component } from 'fl-react'
import { render } from 'utils/react'

export class ErrorBoundary extends Component {
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
			return render( alternate, { error } )
		}
		return children
	}
}
