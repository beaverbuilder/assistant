import React from 'react'
import { MemoryRouter, Switch, Route, Link } from 'react-router-dom'
import { useSystemState } from 'store'
import './style.scss'

export const AppRouting = () => {

	return (
		<MemoryRouter>
			<Switch>
				<Route exact path="/" component={AppSwitcher} />
				<Route path="/:app" component={App} />
				<Route component={NoApp} />
			</Switch>
		</MemoryRouter>
	)
}

const App = props => {
	const { match } = props
	const { apps } = useSystemState()
	const { params: { app: appName } } = match

	if ( ! ( appName in apps ) ) {
		return (
			<Page>We can't seem to find the app you're looking for.</Page>
		)
	}
	const app = apps[appName]
	const appProps = {
		...props,
		...app,
	}
	return (
		<Page>
			<AppHeader {...app} />
			<div>{ app.newContent ? app.newContent( appProps ) : 'This app has not been converted.'}</div>
		</Page>
	)
}

const AppHeader = props => {
	const { icon, label } = props
	return (
		<div style={{ display: 'flex', flexDirection: 'row' }}>
			<div>{ 'function' === typeof icon && icon( props ) }</div>
			{label}
			<Link to="/" style={{ marginLeft: 'auto' }}>Apps</Link>
		</div>
	)
}

const AppSwitcher = () => {
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

					const { accentColor } = app
					let color = null
					if ( 'undefined' !== typeof accentColor ) {
						color = accentColor.color
					}

					return (
						<Link to={location} className="app-grid-item" key={i}>
							<div className="icon" style={{ backgroundColor: color }}>
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

const Page = ( { children, ...rest } ) => {
	return (
		<div className="app-screen" {...rest}>
			{children}
		</div>
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
