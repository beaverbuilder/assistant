import React, { useContext } from 'react'
import classname from 'classnames'
import { __ } from '@wordpress/i18n'
import { App, Nav, Page, Icon, Button } from 'assistant/ui'
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
					<Button
						appearance="transparent"
						onClick={ goToRoot }
						style={ {
							pointerEvents: 'auto',
							textDecoration: 'underline',
							padding: '0 10px',
						} }
					>{__( 'Assistant' )}</Button>
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

export default AppMain
