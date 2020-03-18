import React, { useContext } from 'react'
import classname from 'classnames'
import { useLocation } from 'react-router-dom'
import { __ } from '@wordpress/i18n'
import { App, Nav, Page, Icon, Button } from 'assistant/ui'
import { useSystemState } from 'assistant/data'
import { HomeScreen } from './home-screen'
import Sidebar from './side-bar'
import './style.scss'

const AppMain = ( { actions } ) => {
	const location = useLocation()
	const { window } = useSystemState()
	const side = window.origin[0]
	return (
		<div style={{
			display: 'flex',
			flexDirection: side ? 'row-reverse' : 'row',
			flex: '1 1 auto',
			maxHeight: '100%',
			minHeight: 0
		}}
		>
			<Sidebar edge={ side ? 'right' : 'left' } />
			
			<div style={{ flex: '1 1 auto', position: 'relative' }}>
				<NavToolbar actions={ actions } />
				<Nav.Switch location={ location }>
					<Nav.Route exact path="/" component={ HomeScreen } />
					<Nav.Route path="/:app" component={ AppContent } />
					<Nav.Route component={ Page.NotFound } />
				</Nav.Switch>
			</div>
		</div>
	)
}
AppMain.displayName = 'AppMain'

const NavToolbar = ( {
		actions,
		appearance = 'light'
} ) => {
	const { isRoot, goToRoot } = useContext( Nav.Context )
	const { label } = useContext( App.Context )
	const labelStyle = {
		padding: '2px 10px'
	}
	const iconWrapStyle = {
		display: 'inline-flex',
		transform: 'translateY(2px)',
		padding: '0 4px 4px'
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
		'fl-asst-overlay-toolbar': true,
		[`fl-asst-toolbar-appearance-${appearance}`] : appearance,
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
					<span style={ iconWrapStyle }>
						<Icon.BreadcrumbArrow />
					</span>
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
