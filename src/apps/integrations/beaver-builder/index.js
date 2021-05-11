import React from 'react'
import { addFilter, applyFilters } from '@wordpress/hooks'
import { sprintf } from '@wordpress/i18n'
import Beaver from './beaver'

const integrationEnabled = () => applyFilters( 'fl-asst.enable-default-integration', true, 'beaver-builder' )

addFilter( 'fl-asst.list-item-actions', 'fl-assistant', ( actions, { item, listType, env } ) => {

	// Allow default integration to be overridden
	if (
		! integrationEnabled() ||
		'post' !== listType
	) {
		return actions
	}

	// Don't show if you're currently editing this item in BB
	const href = window.location.href.split( '?' )
	if ( 'beaver-builder' === env.application && item.url === href[0] ) {
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
				<Beaver />
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

/**
 * Update the item props for BB Templates
 */
addFilter( 'fl-asst.list-item-props', 'fl-assistant', ( props, args ) => {
	if ( 'fl-builder-template' === args.item.type ) {
		return {
			...props,
			thumbnailSize: 'poster',
		}
	}
	return props
} )

/**
 * Add Beaver Icon to Currently Viewing action */
addFilter( 'fl-asst.currently-viewing-actions', 'fl-assistant', actions => actions.map( action => {
	if ( 'fl-builder' === action.handle ) {
		return {
			...action,
			label: <Beaver />
		}
	}
	return action
} ) )
