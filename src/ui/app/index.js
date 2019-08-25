import React, { forwardRef } from 'fl-react'
import { withRouter } from 'fl-react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import classname from 'classnames'
import { __ } from 'assistant/i18n'
import { App, Page, Nav, Error } from 'assistant/ui'
import { useSystemState } from 'assistant/data'
import { HomeScreen } from './home-screen'
import './style.scss'

export const AppRouting = withRouter(  ( { location, history } ) => {

	const shouldTransitionCard = false
	const classes = classname( {
		[history.action]: shouldTransitionCard
	} )
	return (
		<TransitionGroup className="fl-asst-transition-group">
			{/*<CSSTransition
				key={ location.key }
				classNames={ classes }
				timeout={ shouldTransitionCard ? 210 : 0 }
			>*/}
			<Nav.Switch location={ location }>
				<Nav.Route exact path="/" component={ HomeScreen } />
				<Nav.Route path="/:app" component={ AppContent } />
				<Nav.Route component={ NoApp } />
			</Nav.Switch>
			{/*</CSSTransition>*/}
		</TransitionGroup>
	)
} )

const AppContent = props => {
	const { match } = props
	const { apps } = useSystemState()
	const { params: { app: appName } } = match

	const app = apps[appName]

	if ( 'undefined' === typeof app ) {
		return null
	}

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

	const appWrapClasses = classname({
		'fl-asst-screen-content' : true,
		'fl-asst-app-content' : true,
		[`fl-asst-app-${appName}`] : appName,
	})
	return (
		<>
			{ /* Alerts component here */ }
			<ScreenCard>
				<div className={appWrapClasses} style={ style }>
					{ 'function' === typeof app.root ? app.root( appProps ) : null }
				</div>
			</ScreenCard>
		</>
	)
}

const CardError = () => {
	return (
		<Page shouldPadTop={ true } shouldShowHeader={ false }>
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
		minHeight: 0,
		flex: '1 1 auto',
		display: 'flex',
		flexDirection: 'column',
	}

	return (
		<div className={ classes } { ...rest }>
			<div className="fl-asst-screen-content" ref={ ref } style={ style }>
				<Error.Boundary alternate={ CardError }>
					{children}
				</Error.Boundary>
			</div>
		</div>
	)
} )

const NoApp = () => {
	return (
		<Page>
			<h1>{__( 'Could not find page' )}</h1>
		</Page>
	)
}
