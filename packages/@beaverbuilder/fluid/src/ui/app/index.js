import classname from 'classnames'
import Error from '../error'
import Nav from '../nav'
import './style.scss'

const App = ( {
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

export default App
