import { useLocation } from 'react-router-dom'
import { __ } from '@wordpress/i18n'

import * as post from './config/post'
import * as image from './config/image'
import * as svg from './config/svg'

import ItemContext from '../context'
import CollectionsField from './fields/collections'
import ActionsField from './fields/actions'

const methods = {
	post,
	image,
	svg
}

/**
 * Item specific form tab config.
 */
export const getFormTabs = ( item ) => {
	const { pathname } = useLocation()
	const basePath = pathname.split( '/edit/' ).shift()
	const { libraryId } = ItemContext.use()
	const { type } = item

	let tabs = {
		settings: {
			label: __( 'Settings' ),
			path: basePath,
			exact: true,
			sections: {
				general: {
					fields: {
						name: {
							label: __( 'Name' ),
							component: 'text',
							validate: ( value, errors ) => {
								if ( '' === value ) {
									errors.push( __( 'Please enter a name.' ) )
								}
							},
						},
						collections: {
							label: __( 'Collections' ),
							component: CollectionsField,
							libraryId
						},
					},
				}
			}
		}
	}

	if ( methods[ type ] ) {
		tabs = methods[ type ].getTabs( item, tabs )
	}

	tabs.settings.sections.actions = {
		label: __( 'Actions' ),
		fields: {
			actions: {
				component: ActionsField,
				options: () => getFormActions( item ),
			},
		},
	}

	if ( 1 === Object.keys( tabs ).length ) {
		return {
			sections: tabs.settings.sections
		}
	} else {
		Object.keys( tabs ).map( key => {
			if ( ! tabs[ key ].path ) {
				tabs[ key ].path = `${ basePath }/edit/${ key }`
			}
		} )
	}

	return {
		tabs
	}
}

/**
 * Item specific form actions.
 */
export const getFormActions = ( item ) => {
	const { type } = item
	if ( methods[ type ] ) {
		return methods[ type ].getActions( item )
	}
	return []
}

/**
 * Item specific form defaults.
 */
export const getFormDefaults = ( item ) => {
	const { type, name, collections } = item
	const defaults = {
		name,
		collections: collections.map( collection => collection.name )
	}
	if ( methods[ type ] ) {
		return methods[ type ].getDefaults( item, defaults )
	}
	return defaults
}

/**
 * Item specific data sent to the API.
 */
export const getFormData = ( item, values ) => {
	const { type } = item
	const { name, collections } = values
	const data = new FormData()
	data.append( 'name', name )
	data.append( 'collections', JSON.stringify( collections ) )
	if ( methods[ type ] ) {
		return methods[ type ].getData( item, values, data )
	}
	return data
}
