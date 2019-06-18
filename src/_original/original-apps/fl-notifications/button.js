import React, { useContext } from 'react'
import { getSystemActions, useSystemState } from 'store'
import { clearCache } from 'utils/cache'
import { useHeartbeat } from 'utils/wordpress'
import { AppTabButton, UIContext } from 'components'
import { AppIcon } from './app'

export const NotificationsAppButton = ( { isShowingAppsMenu } ) => {
	const { apps, counts } = useSystemState()
	const { setCounts } = getSystemActions()
	const { setActiveApp, activeAppName } = useContext( UIContext )
	const notifications = apps[ 'fl-notifications' ] ? apps[ 'fl-notifications' ] : null
	const active = 'fl-notifications' === activeAppName && ! isShowingAppsMenu

	if ( ! notifications || ! notifications.enabled ) {
		return null
	}

	useHeartbeat( 'fl-assistant/v1/counts', response => {
		if ( response['comment/pending'] > counts['comment/pending'] ) {
			clearCache( 'comments' )
		}
		setCounts( response )
	} )

	return (
		<AppTabButton
			onClick={ () => setActiveApp( 'fl-notifications' ) }
			isSelected={ active }
			tooltip={ notifications.label }
		>
			<AppIcon count={ counts['notification/total'] || 0 } />
		</AppTabButton>
	)
}
