import React from 'react'
import { addFilter, applyFilters } from 'assistant/hooks'
import { sprintf } from '@wordpress/i18n'
import { Icon } from 'assistant/ui'

const integrationEnabled = () => applyFilters( 'enable-default-integration', true, 'beaver-builder' )

addFilter( 'list-item-actions', 'fl-assistant', ( actions, { item, listType, env } ) => {

	// Allow default integration to be overridden
	if (
		! integrationEnabled() ||
		'post' !== listType ||
		'beaver-builder' === env.application
	) {
		return actions
	}

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


addFilter( 'list-item-props', 'fl-assistant', ( props, args ) => {
	if ( 'fl-builder-template' === args.item.type ) {
		return {
			...props,
			thumbnailSize: 'poster',
		}
	}
	return props
} )
