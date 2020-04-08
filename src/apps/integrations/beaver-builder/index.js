import React from 'react'
import { addFilter } from 'assistant/hooks'
import { sprintf } from '@wordpress/i18n'
import { Icon } from 'assistant/ui'

addFilter( 'list-item-actions', 'fl-assistant', ( actions, item ) => {

	const { bbEditUrl, bbIsEnabled, bbBranding, bbCanEdit } = item
	const i = actions.findIndex( action => 'edit-post' === action.handle )
	const bbAction = {
		title: sprintf( 'Edit in %s', bbBranding ),
		href: bbEditUrl,
		isShowing: bbCanEdit,
		icon: (
            <>
                <Icon.Beaver />
                { bbIsEnabled && <span className="fl-asst-extra-dot" /> }
            </>
		),
	}

	if ( i ) {

		// insert after edit-post item
		actions.splice( i + 1, 0, bbAction )
	} else {

		// insert at end
		actions.push( bbAction )
	}
	return actions
} )
