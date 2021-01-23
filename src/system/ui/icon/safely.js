import React, { Suspense } from 'react'
import { Placeholder, Loading, Error as ErrorIcon } from '@beaverbuilder/icons'
import { Error } from '@beaverbuilder/app-core'

const Safely = ( {
	icon: Tag = Placeholder,
	alternate = ErrorIcon,
	fallback: Fallback = Loading,
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
