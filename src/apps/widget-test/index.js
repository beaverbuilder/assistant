import React from 'react'
import { Switch, Route, NavLink } from 'react-router-dom'
import { registerApp } from 'assistant'
import { Frame } from 'assistant/ui'
import { Widget, BigListWidget, SinglePostWidget } from './widgets'
import './style.scss'

const App = ( { baseURL } ) => {
	return (
		<div className="widget-test">

			<div className="toolbar">
				<div className="center">
					<div className="tabs">
						<NavLink to={ `${baseURL}/` } replace exact>What's New</NavLink>
						<NavLink to={ `${baseURL}/dashboard` } replace exact>Dashboard</NavLink>
					</div>
				</div>
			</div>

			<Switch>
				<Route exact path={ `${baseURL}/` } component={ Intro } />
				<Route exact path={ `${baseURL}/dashboard` } component={ Dashboard } />
			</Switch>

		</div>
	)
}

const Intro = () => {
	const { isMedium } = Frame.use()
	return (
		<div className="fluid-widget-area">
			<Widget
				style= { {
					gridColumn: isMedium ? 'span 6' : 'span 2',
					gridRow: 'span 2',
					background: '#F09701',
					color: 'white',
				} }
			>
				Assistant can help you take WordPress Further
			</Widget>
			<Widget style={ { background: '#0068C8', color: 'white', gridRow: isMedium ? 'span 2' : null } }>Introducing Libraries</Widget>
			<Widget style={ { background: '#2C45C8', color: 'white', gridRow: isMedium ? 'span 2' : null } }>Content App</Widget>
			<Widget style={ { background: '#00AED4', color: 'white' } }>Media App</Widget>
			<Widget style={ { background: '#7610F7', color: 'white' } }>Comments & Updates</Widget>
		</div>
	)
}

const Dashboard = () => {
	const { isMedium } = Frame.use()
	return (
		<div className="fluid-widget-area">
			<Widget style={ { gridColumn: isMedium ? 'span 2' : 'span 1' } }>Small</Widget>
			<Widget style={ { gridColumn: isMedium ? 'span 2' : 'span 1' } }>Small</Widget>
			<SinglePostWidget />
			<Widget>Default Size</Widget>
			<BigListWidget isMedium={ isMedium } />
			<Widget style={ { gridColumn: isMedium ? 'span 2' : 'span 1' } }>Small</Widget>
			<BigListWidget isMedium={ isMedium } />
		</div>
	)
}

registerApp( 'widget-test', {
	label: 'Widget Test',
	root: App,
} )
