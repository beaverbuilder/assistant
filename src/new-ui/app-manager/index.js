import React, { useContext, useEffect } from 'react'
import { Flipper } from 'react-flip-toolkit'
import { Switch, Route, Link } from 'react-router-dom'
import { useSystemState } from 'store'
import { WindowContext } from 'lib'
import './style.scss'

export const AppRouting = () => {

	return (
		<Switch>
			<Route exact path="/" component={AppSwitcher} />
			<Route path="/:app" component={App} />
			<Route component={NoApp} />
		</Switch>
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
	return (
		<Page>
			<div>{ 'function' === typeof app.icon && app.icon( props ) }</div>
			<div style={{ display: 'flex', flexDirection: 'row' }}>
				{app.label}
				<Link to="/" style={{ marginLeft: 'auto' }}>Apps</Link>
			</div>
			<div>{ app.newContent && app.newContent( props ) }</div>
		</Page>
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
					return (
						<Link to={location} className="app-grid-item" key={i}>
							<div className="icon">
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
	const { requestAnimate } = useContext( WindowContext )
	useEffect( () => {
		requestAnimate()
	}, [] )
	return (
		<Flipper flipId="content" className="app-screen" {...rest}>
			{children}
		</Flipper>
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
