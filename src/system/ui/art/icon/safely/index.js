import React, { Suspense } from 'react'
import Icon from '../'
import { Error } from 'ui'

const Safely = ( {
	icon: Tag = Icon.Placeholder,
	alternate = Icon.Error,
	fallback: Fallback = Icon.Loading,
	...rest
} ) => {
	return (
		<Error.Boundary alternate={ alternate }>
			<Suspense fallback={ <Fallback /> }>
				<Tag { ...rest } />
			</Suspense>
		</Error.Boundary>
	)
}

export default Safely
