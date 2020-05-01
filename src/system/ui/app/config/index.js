import React, { memo } from 'react'
import { Switch, Route } from 'react-router-dom'
import { Page, Icon } from 'ui'

const Config = ( {
	pages,
	shouldAnimate = false,
	...rest
} ) => {
	const { baseURL } = rest

	// Handle no pages in config
	if ( ! pages || 0 > Object.keys( pages ).length ) {
		return <NoPages { ...rest } />
	}

	return (
		<Switch>
			{ Object.entries( pages ).map( ( [ path, component ], i ) => {

				const Component = memo( component )

				return (
					<Route
						key={ i }
						exact={ 'default' === path }
						path={ 'default' === path ? baseURL : baseURL + '/' + path }
						render={ () => {
							return <Component { ...rest } />
						} }
					/>
				)
			} )}
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
