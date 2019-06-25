import React, { Fragment, useContext } from 'fl-react'
import { Route, Link } from 'fl-react-router-dom'
import { __ } from 'assistant'
import { App, Icon, Page, Nav } from 'assistant/lib'
import { useSystemState } from 'assistant/store'
import './style.scss'

export const AppRouting = () => (
	<Nav.Switch>
		<Route exact path="/" component={Switcher} />
		<Route path="/:app" component={AppContent} />
		<Route component={NoApp} />
	</Nav.Switch>
)

const AppContent = props => {
	const { match } = props
	const { apps } = useSystemState()
	const { params: { app: appName } } = match

	// Can't find that app
	if ( ! ( appName in apps ) ) {
		return (
			<Switcher />
		)
	}

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
			<div className="fl-asst-screen fl-asst-app-screen fl-asst-primary-content" style={style}>
				<AppHeader
					label={app.label}
					icon={app.icon}
				/>
				<div className="fl-asst-screen-content">
					{ app.root ? app.root( appProps ) : <Page>{__( 'This app has not been converted.' )}</Page> }
				</div>
			</div>
		</App.Context.Provider>
	)
}

const AppHeader = ( { label, icon } ) => {
	const { shouldShowLabels } = useSystemState()
	const app = useContext( App.Context )
	const { history } = useContext( Nav.Context )
	const isAppRoot = 2 > history.index

	let breadcrumb = null
	if ( 2 < history.entries.length && 1 < history.index ) {
		const entries = Array.from( history.entries ).slice( 2 )
		const crumbs = entries.map( entry => {

			// Need better way to get name for views here.
			const parts = entry.pathname.split( '/' )
			return parts[parts.length - 1]
		} )
		breadcrumb = crumbs.join( ' > ' )
	}

	return (
		<div className="fl-asst-screen-header fl-asst-app-header">

			{ 'function' === typeof icon &&
				<div className="fl-asst-app-header-icon">
					{ isAppRoot && icon( app ) }
					{ ! isAppRoot &&
					<button
						onClick={history.goBack}
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							color: 'inherit',
							lineHeight: 1,
							fontSize: 12,
						}}
					>
						<div style={{
							color: 'var(--fl-asst-accent-color)',
							marginBottom: shouldShowLabels ? 5 : null,
						}}>
							<Icon.BackArrow />
						</div>
						{ shouldShowLabels && <span style={{ marginTop: 'auto' }}>{__( 'Back' )}</span> }
					</button> }
				</div>
			}
			<div className="fl-asst-app-header-name">
				<span>{label}</span>
				{ breadcrumb && <span className="fl-asst-app-header-name-description">{breadcrumb}</span> }
			</div>

			<div className="fl-asst-app-header-actions">
				{ /* App actions go here */ }
			</div>
		</div>
	)
}

const Switcher = () => {
	const { apps, appOrder } = useSystemState()
	return (
		<Fragment>
			<AppHeader label="Apps" icon={Icon.Apps} />
			<Page shouldPadTop={true}>
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
		</Fragment>
	)
}

const NoApp = ( { history } ) => {
	return (
		<Page>
			<button onClick={() => history.goBack()}>{__( 'Back' )}</button>
			<h1>{__( 'Could not find page' )}</h1>
		</Page>
	)
}
