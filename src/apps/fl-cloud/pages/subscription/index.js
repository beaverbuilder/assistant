import React from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Layout, Page } from 'ui'

export default () => {

	return (
		<Page
			title={ __( 'Subscription' ) }
			shouldShowBackButton={ true }
		>
			<Layout.Headline>{ __( 'Your Subscription' ) }</Layout.Headline>
			<p>You are currently on Assistant's free plan.</p>
			<Button status="primary">
				{ __( 'Upgrade' ) }
			</Button>
		</Page>
	)
}
