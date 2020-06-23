import React, { useState } from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Layout } from 'assistant/ui'
import { getSystemConfig } from 'assistant/data'
import { getQueryArgs, addQueryArgs } from 'assistant/utils/url'
import cloud from 'assistant/cloud'
import AuthLayout from './layout'

export default ( { location, history } ) => {
	const { cloudAppUrl } = getSystemConfig()
	const { href } = window.location
	const { token, ...args } = getQueryArgs( href )

	if ( token ) {
		cloud.session.create( token, { email: 'test@test.com' }, true )
		history.replace( '/fl-cloud' )
		window.location.href = addQueryArgs( href.split( '?' ).shift(), args )
		return null
	}

	const connect = () => {
		const redirect = encodeURIComponent( window.location.href )
		window.location.href = `${ cloudAppUrl }/login/connect?redirect=${ redirect }`
	}

	return (
		<AuthLayout>
			<Layout.Headline>{ __( 'Connect to Assistant Cloud' ) }</Layout.Headline>
			<p>{ __( 'Click the button below to connect this site to your Assistant Cloud account.' ) }</p>
			<Button status="primary" onClick={ connect }>
				{ __( 'Connect' ) }
			</Button>
		</AuthLayout>
	)
}
