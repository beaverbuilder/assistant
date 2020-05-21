import React, { memo } from 'react'
import { Switch, Route } from 'react-router-dom'
import { Page, Icon } from 'ui'

const Config = ( {
	pages,
	children,
	...rest
} ) => {
	const { baseURL } = rest

	// Handle no pages in config
	if ( ! pages || 0 > Object.keys( pages ).length ) {
		return <NoPages { ...rest } />
	}

	return (
		<Switch>
			{ Object.entries( pages ).map( ( [ path, config ], i ) => {
				let props = {}

				// config could be
				// Component
				// config.component: Component
				// config.render: () => {}
				// config.children

				if ( 'object' === typeof config && 'component' in config ) {
					const { component, ...restConfig } = config
					const Component = memo( component )
					props = {
						...props,
						...restConfig,
						render: () => <Component { ...rest } />
					}

				} else {
					const Component = memo( config )
					props = {
						...props,
						exact: 'default' === path,
						path: 'default' === path ? baseURL : baseURL + '/' + path,
						render: () => <Component { ...rest } />
					}
				}
				return <Route key={ i } { ...props } />
			} )}
			{children}
			<Route component={ Page.NotFound } />
		</Switch>
	)
}

const NoPages = ( { label } ) => {
	return (
		<Page toolbar={ false }>
			<div style={ { margin: 'auto', textAlign: 'center' } }>
				<Icon.Pencil />
				<h1>Hello World, {label}</h1>
				<p>Your app is running! But you need to add some pages.</p>
			</div>
		</Page>
	)
}

export default Config
