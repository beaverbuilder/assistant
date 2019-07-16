import React, { Children, forwardRef, useState, cloneElement } from 'fl-react'
import { Link } from 'fl-react-router-dom'
import classname from 'classnames'
import { __ } from 'assistant'
import { App, Icon, Page, Nav, Error } from 'assistant/lib'
import { useSystemState } from 'assistant/store'
import './style.scss'

export const AppRouting = () => (
	<Nav.Switch>
		<Nav.Route exact path="/" component={Switcher} />
		<Nav.Route path="/:app" component={AppContent} />
		<Nav.Route component={NoApp} />
	</Nav.Switch>
)

const AppContent = props => {
	const { match } = props
	const { apps } = useSystemState()
	const { params: { app: appName } } = match

	const app = apps[appName]
	const appProps = {
		...props,
		...app,
	}
	const context = {
		...App.defaults,
		handle: appName,
		...app,
	}
	const style = {}
	if ( 'undefined' !== typeof context.accent ) {
		style['--fl-asst-accent-color'] = context.accent.color
	}
	return (
		<App.Context.Provider value={context}>
			{ /* Alerts component here */ }
			<ScreenCard>
				<div className="fl-asst-screen-content" style={style}>
					{ 'function' === typeof app.root ? app.root( appProps ) : null }
				</div>
			</ScreenCard>
		</App.Context.Provider>
	)
}

const CardError = () => {
	return (
		<Page shouldPadTop={true}>
			<h1>{__( 'We Have A Problem!' )}</h1>
			<p>{__( 'There seems to be an issue inside the current card.' )}</p>
		</Page>
	)
}

const ScreenCard = forwardRef( ( { className, children, ...rest }, ref ) => {
	const classes = classname( {
		'fl-asst-screen': true,
		'fl-asst-screen-card': true,
	}, className )

	const style = {
		maxHeight: '100%',
		flex: '1 1 auto',
		display: 'flex',
		flexDirection: 'column',
	}

	return (
		<div className={classes} {...rest}>
			<div ref={ref} style={style}>
				<Error.Boundary alternate={CardError}>
					{children}
				</Error.Boundary>
			</div>
		</div>
	)
} )

const CardStack = ( { children, style: passedStyles, ...rest } ) => {
	const [ cardHeight, setCardHeight ] = useState( 0 )
	const count = Children.count( children )
	const offset = 20

	const handleRef = el => {
		if ( el ) {
			if ( el.offsetHeight > cardHeight ) {
				setCardHeight( el.offsetHeight )
			}
		}
	}

	const newChildren = Children.map( children, ( child, i ) => {
		const reverseIndex = count - ( i + 1 )
		const topOffset = ( offset / ( count - 1 ) ) * i
		return cloneElement( child, {
			ref: handleRef,
			style: {
				top: topOffset ? topOffset : 0,
				transform: `scale(${1 - ( .06 * reverseIndex )})`,
			}
		} )
	} )

	const style = {
		...passedStyles,
		position: 'relative',
		flex: '1 1 auto',
		display: 'flex',
		height: 1 < count ? cardHeight + offset : 'auto',
		maxHeight: '100%',
	}

	return (
		<div style={style} {...rest}>{newChildren}</div>
	)
}


const Switcher = () => {
	const { apps, appOrder } = useSystemState()
	return (
		<Page shouldPadTop={true} title={__( 'Apps' )} icon={Icon.Apps}>
			<div className="app-grid">
				{ appOrder.map( ( handle, i ) => {
					const app = apps[handle]
					const location = {
						pathname: `/${handle}`,
						state: app,
					}
					const style = {}
					if ( 'undefined' !== typeof app.accent ) {
						style['--fl-asst-accent-color'] = app.accent.color
						style.backgroundColor = 'var(--fl-asst-accent-color)'
					}

					return (
						<Link to={location} className="app-grid-item" key={i}>
							<div className="fl-asst-app-icon" style={style}>
								{ 'function' === typeof app.icon && app.icon( {} ) }
							</div>
							<label>{app.label}</label>
						</Link>
					)
				} )}
			</div>
		</Page>
	)
}

const NoApp = ( { history } ) => {
	return (
		<Page>
			<h1>{__( 'Could not find page' )}</h1>
		</Page>
	)
}
