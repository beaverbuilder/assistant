import React, { Suspense } from 'react'
import { MemoryRouter } from 'react-router-dom'
import Error from '../error'

const AppCoreDefaultSuspenseFallback = () => (
	<div>Loading...</div>
)

const AppCoreRoot = ( {
	children,

	// Error API  - setup default boundary alternate view
	error,

	// Suspense API - setup default fallback view for suspense loading
	loading: Loading = AppCoreDefaultSuspenseFallback,

	// Navigation API - for setting up the default router
	router: Router = MemoryRouter,
	routerProps = {}
} ) => {
	return (
		<Error.Boundary alternate={ error }>
			<Router { ...routerProps }>
				<Suspense fallback={ <Loading /> }>
					{children}
				</Suspense>
			</Router>
		</Error.Boundary>
	)
}

export default AppCoreRoot
