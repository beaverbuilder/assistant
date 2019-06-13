import React, { useContext } from 'fl-react'
import { Switch, Route, Link } from 'fl-react-router-dom'
import { App, Icon, Page } from 'assistant/lib'
import { useSystemState } from 'assistant/store'
import './style.scss'

export const AppRouting = () => {
	return (
		<Switch>
			<Route exact path="/" component={Switcher} />
			<Route path="/:app" component={AppContent} />
			<Route component={NoApp} />
		</Switch>
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
			<div style={style}>
				<AppHeader />
				{ app.root ? app.root( appProps ) : <Page>This app has not been converted.</Page> }
			</div>
		</App.Context.Provider>
	)
}

const AppHeader = () => {
	const { shouldShowLabels } = useSystemState()
	const app = useContext( App.Context )
	const { icon, label } = app
	return (
		<div className="fl-asst-app-header">
			{ 'function' === typeof icon &&
				<div className="fl-asst-app-header-icon">{ icon( app ) }</div>
			}
			<div className="fl-asst-app-header-name">{label}</div>

			<div className="fl-asst-app-header-actions">
				<Link to="/" style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					color: 'inherit',
					lineHeight: 1,
				}}>
					<div style={{
						color: 'var(--fl-asst-accent-color)',
						marginBottom: shouldShowLabels ? 5 : null,
					}}>
						<Icon.Apps />
					</div>
					{ shouldShowLabels && <span>Apps</span> }
				</Link>
			</div>
		</div>
	)
}

const Switcher = () => {
	const { apps, appOrder } = useSystemState()
	return (
		<Page>
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
			<button onClick={() => history.goBack()}>Back</button>
			<h1>Could not find page</h1>
		</Page>
	)
}
