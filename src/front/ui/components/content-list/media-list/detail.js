import React, { useContext } from 'react'
import { ViewContext, BackButton } from 'components'

export const MediaDetail = () => {
	const view = useContext( ViewContext )
	const { urls } = view
	return (
		<div>
			<BackButton />
		</div>
	)
}
