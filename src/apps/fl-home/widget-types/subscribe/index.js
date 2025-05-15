import React, { useLayoutEffect } from 'react'
import { __ } from '@wordpress/i18n'
import { Layout, Text } from 'assistant/ui'
import { getSystemConfig, getSystemStore } from 'assistant/data'
import SubscribeForm from './form'

const Subscribe = ( { remove } ) => {
	const { hasSubscribed } = getSystemStore().getState()
	const { pluginURL } = getSystemConfig()

	// Don't show the widget if we've already subscribed before
	useLayoutEffect( () => {
		if ( hasSubscribed ) {
			remove()
		}
	}, [] )

	return (
		<>
			<Text.Title>
				{ __( 'Sign Up For Updates' ) }
			</Text.Title>
			<p style={ { marginTop: 0 } }>
				{__( 'Keep up-to-date with the latest news and updates about the Assistant Project.' )}
			</p>

			<Layout.AspectBox
				width={ 640 }
				height={ 321 }
				style={ { marginBottom: 20, borderRadius: 10, pointerEvents: 'none' } }
			>
				<img src={ `${pluginURL}/img/apps/fl-home/asst-banner-sm.jpg` } />
			</Layout.AspectBox>

			<SubscribeForm removeWidget={ remove } />
		</>
	)
}

export default Subscribe
