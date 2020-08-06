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
 * Item specific form section config.
 */
export const getFormSections = ( item ) => {
	const { libraryId } = ItemContext.use()
	const { type } = item

	let sections = {
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

	if ( methods[ type ] ) {
		sections = methods[ type ].getSections( item, sections )
	}

	sections.actions = {
		label: __( 'Actions' ),
		fields: {
			actions: {
				component: ActionsField,
				options: () => getFormActions( item ),
			},
		},
	}

	return sections
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
	const data = { name, collections }
	if ( methods[ type ] ) {
		return methods[ type ].getData( item, values, data )
	}
	return data
}
