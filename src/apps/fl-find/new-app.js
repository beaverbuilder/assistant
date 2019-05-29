import React, { Fragment } from 'react'
import { Switch, Route } from 'react-router-dom'

export const NewApp = props => {
	const { app } = props
	return (
		<Switch>
			<Route path={`/${app}`} component={Root} />
			<Route path={`/${app}/something`} component={NextScreen} />
		</Switch>
	)
}

const Root = () => {
	return (
		<Fragment>
			<h1>This App Yo</h1>
			<p>Curabitur blandit tempus porttitor. Nulla vitae elit libero, a pharetra augue.</p>
			<p>Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Cras mattis consectetur purus sit amet fermentum.</p>
			<p>Cras mattis consectetur purus sit amet fermentum. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Nulla vitae elit libero, a pharetra augue. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Donec sed odio dui. Nullam id dolor id nibh ultricies vehicula ut id elit. Nulla vitae elit libero, a pharetra augue.</p>
			<p>Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Nulla vitae elit libero, a pharetra augue.</p>
		</Fragment>
	)
}

const NextScreen = () => {
	return (
		<div>Test</div>
	)
}
