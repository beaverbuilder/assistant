import React, { Fragment } from 'react'
import { AppRoute, AppLink } from 'lib'

export const NewApp = () => {
	return (
		<Fragment>
			<AppRoute exact path="/" component={Root} />
			<AppRoute path="/next" component={NextScreen} />
		</Fragment>
	)
}

const Root = () => {
	return (
		<Fragment>
			<p>This is the root screen</p>
			<div>
				<AppLink to="/next">Next Screen</AppLink>
			</div>
		</Fragment>
	)
}

const NextScreen = () => {
	return (
		<Fragment>
			<h2>Test Screen</h2>
			<button onClick={() => history.goBack()}>Back</button>
		</Fragment>
	)
}
