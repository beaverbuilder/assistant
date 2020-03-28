import React from 'react'
import { __, sprintf } from '@wordpress/i18n'
import { useCloudState } from 'assistant/data'
import { cloudLogout } from 'assistant/utils/cloud'
import { Button, Layout } from 'ui'
import CloudLayout from '../layout'

export default () => {
	const { cloudUser } = useCloudState()

	return (
		<CloudLayout>
			<Layout.Headline>{ sprintf( 'Welcome, %s', cloudUser.name ) }</Layout.Headline>
			<Layout.Box padX={ false }>
				<Button status="primary" onClick={ cloudLogout }>{ __( 'Logout' ) }</Button>
			</Layout.Box>
		</CloudLayout>
	)
}
