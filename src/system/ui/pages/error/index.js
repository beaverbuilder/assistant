import React from 'react'
import { __ } from '@wordpress/i18n'
import { Page, Icon } from 'ui'

const Error = ( {
	headline = __( 'Oh no!' ),
	message = __( 'There seems to be an issue' ),
	error,
	...rest
} ) => {
	return (
		<Page toolbar={ false } { ...rest }>
			<div style={ {
				margin: 'auto',
				textAlign: 'center'
			} }>
				<Icon.Pencil size={ 60 } />
				<h1>{headline}</h1>
				<p>{message}</p>
				{ error && <code>{error.message}</code> }
			</div>
		</Page>
	)
}

export default Error
