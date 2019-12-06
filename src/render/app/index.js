import React, { useContext } from 'react'
import classname from 'classnames'
import { __ } from '@wordpress/i18n'
import { App, Nav, Page, Icon } from 'assistant/ui'
import { useSystemState } from 'assistant/data'
import { HomeScreen } from './home-screen'
import './style.scss'

const AppMain = Nav.withRouter(  ( { location, actions } ) => {
	return (
		<>
			<NavToolbar actions={ actions } />
			<Nav.Switch location={ location }>
				<Nav.Route exact path="/" component={ HomeScreen } />
				<Nav.Route path="/:app" component={ AppContent } />
				<Nav.Route component={ Page.NotFound } />
			</Nav.Switch>
		</>
	)
} )
AppMain.displayName = 'AppMain'

const NavToolbar = ( { actions } ) => {
	const { isRoot, goToRoot } = useContext( Nav.Context )
	const { label } = useContext( App.Context )
	const labelStyle = {
		padding: '2px 10px'
	}
	const iconWrapStyle = {
		display: 'inline-flex',
		transform: 'translateY(2px)',
		paddingBottom: 4
	}

	const style = {
		pointerEvents: 'none',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	}

	const toolbarClasses = classname( {
		'fl-asst-panel-toolbar': true,
		'fl-asst-window-drag-handle': true,
		'fl-asst-window-overlay-toolbar': false,
	} )

	const stopProp = e => e.stopPropagation()
	const stopEvts = {
		onMouseDown: stopProp,
		onTouchStart: stopProp,
	}

	return (
		<div className={ toolbarClasses }>
			<span style={ style } { ...stopEvts }>
				{ isRoot && <span style={ labelStyle }>{__( 'Assistant' )}</span> }

				{ ! isRoot && <>
					<button onClick={ goToRoot } style={ {
						pointerEvents: 'auto',
						textDecoration: 'underline',
						padding: '0 10px',
					} }>{__( 'Assistant' )}</button>
					<span style={ iconWrapStyle }><Icon.BreadcrumbArrow /></span>
					<span style={ labelStyle }>{label}</span>
				</> }
			</span>
			{ actions && <span style={ {
				marginLeft: 'auto',
				display: 'flex',
				alignItems: 'center'
			} } { ...stopEvts }>{actions}</span> }
		</div>
	)
}

const AppContent = props => {
	const { match } = props
	const { apps } = useSystemState()
	const { params: { app: appName } } = match
	const app = apps[appName]

	if ( 'undefined' === typeof app ) {
		return null
	}

	const appProps = { ...props, ...app }

	const appWrapClasses = classname( {
		'fl-asst-screen-content': true,
		'fl-asst-app-content': true,
		[`fl-asst-app-${appName}`]: appName,
	} )

	return (
		<div className={ appWrapClasses }>
			{ 'function' === typeof app.root ? app.root( appProps ) : null }
		</div>
	)
}

/*
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

const CardError = () => {
	return (
		<Page shouldPadTop={ true } shouldShowHeader={ false }>
			<h1>{__( 'We Have A Problem!' )}</h1>
			<p>{__( 'There seems to be an issue inside the current card.' )}</p>
		</Page>
	)
}
*/

export default AppMain
