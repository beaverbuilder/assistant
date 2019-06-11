import React, { Fragment, useContext } from 'fl-react'
import { MemoryRouter, Switch, Route, Link } from 'fl-react-router-dom'
import { App, Icon, Page, Nav } from 'assistant/lib'
import { useSystemState, getSystemActions } from 'assistant/store'
import './style.scss'

export const AppRouting = () => {
	const { history } = useSystemState()
	const { setHistory } = getSystemActions()

	const routerProps = {
		initialIndex: history.index,
	}
	if ( history.entries && history.entries.length ) {
		routerProps.initialEntries = history.entries
	}

	const handleChange = ( history ) => {
		setHistory( history.index, history.entries )
	}

	return (
		<MemoryRouter {...routerProps}>
			<Nav.Manager onChange={handleChange}>
				<Switch>
					<Route exact path="/" component={Switcher} />
					<Route path="/:app" component={AppContent} />
					<Route component={NoApp} />
				</Switch>
			</Nav.Manager>
		</MemoryRouter>
	)
}

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
			<div className="fl-asst-screen" style={style}>
				<AppHeader
					label={app.label}
					icon={app.icon}
				/>
				<div className="fl-asst-screen-content">
					{ app.root ? app.root( appProps ) : <Page>This app has not been converted.</Page> }
				</div>
			</div>
		</App.Context.Provider>
	)
}

const AppHeader = ( { label, icon } ) => {
	const { shouldShowLabels } = useSystemState()
	const app = useContext( App.Context )
	const { history } = useContext( Nav.Context )
	const isRoot = 2 > history.index

	return (
		<div className="fl-asst-screen-header fl-asst-app-header">

			{ 'function' === typeof icon &&
				<div className="fl-asst-app-header-icon">
					{ isRoot && icon( app ) }
					{ ! isRoot && <button onClick={history.goBack}>Back</button> }
				</div>
			}
			<div className="fl-asst-app-header-name">{label}</div>

			<div className="fl-asst-app-header-actions">

				{ true &&
				<button
				 	onClick={history.goBack}
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						color: 'inherit',
						lineHeight: 1,
					}}
				>
					<div style={{
						color: 'var(--fl-asst-accent-color)',
						marginBottom: shouldShowLabels ? 5 : null,
					}}>
						<Icon.Apps />
					</div>
					{ shouldShowLabels && <span>Apps</span> }
				</button> }

			</div>
		</div>
	)
}

const Switcher = () => {
	const { apps, appOrder } = useSystemState()
	return (
		<Fragment>
			<AppHeader label="Apps" />
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
			<button onClick={() => history.goBack()}>Back</button>
			<h1>Could not find page</h1>
		</Page>
	)
}
