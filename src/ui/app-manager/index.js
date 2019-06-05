import React, { useContext } from 'fl-react'
import { AppContext, defaultAppContext, Icon, Switch, Route, Link } from 'assistant/lib'
import { useSystemState } from 'assistant/store'
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
			<Page>
				<p>We can't seem to find the app you're looking for.</p>
				<AppSwitcher />
			</Page>
		)
	}
	const app = apps[appName]
	const appProps = {
		...props,
		...app,
	}
	const context = {
		...defaultAppContext,
		handle: appName,
		...app,
	}
	let style = {}
	if ( 'undefined' !== context.accentColor ) {
		style['--fl-asst-accent-color'] = context.accentColor.color
	}
	return (
		<AppContext.Provider value={context}>
			<Page style={style}>
				<AppHeader />
				<div className="fl-asst-padding">{ app.root ? app.root( appProps ) : 'This app has not been converted.'}</div>
			</Page>
		</AppContext.Provider>
	)
}

const AppHeader = () => {
	const { shouldShowLabels } = useSystemState()
	const app = useContext( AppContext )
	const { icon, label } = app
	const iconStyle = {
		color: 'var(--fl-asst-accent-color)'
	}
	return (
		<div className="fl-asst-app-header">
			{ 'function' === typeof icon &&
				<div className="fl-asst-app-header-icon" style={iconStyle}>{icon( app )}</div>
			}
			<div className="fl-asst-app-header-name">{label}</div>

			<div className="fl-asst-app-header-actions">
				<Link to="/" style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					color: 'inherit',
					lineHeight: 1,
				}}>
					<div style={{
						color: 'var(--fl-asst-accent-color)',
						marginBottom: 5
					}}>
						<Icon.Apps />
					</div>
					{ shouldShowLabels && <div>Apps</div> }
				</Link>
			</div>
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
		<div className="fl-asst-app-screen" {...rest}>
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
