import { useHistory } from 'react-router-dom'
import { __ } from '@wordpress/i18n'
import cloud from 'assistant/cloud'
import ItemContext from '../context'

import * as post from './post'
import * as image from './image'
import * as svg from './svg'

const methods = {
	post,
	image,
	svg
}

/**
 * Item specific form section config.
 */
export const getFormSections = () => {
	const { item } = ItemContext.use()
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
					component: 'select',
					options: {
						'': __( 'Choose...' ),
					},
				},
			},
		}
	}

	if ( methods[ type ] ) {
		sections = methods[ type ].getSections( sections )
	}

	sections.actions = {
		label: __( 'Actions' ),
		fields: {
			actions: {
				component: 'actions',
				options: args => getFormActions(),
			},
		},
	}

	return sections
}

/**
 * Item specific form actions.
 */
export const getFormActions = () => {
	const { item } = ItemContext.use()
	const { id, type } = item
	const history = useHistory()

	const moveItem = () => {

	}

	const deleteItem = () => {
		if ( confirm( __( 'Do you really want to delete this item?' ) ) ) {
			cloud.libraries.deleteItem( id )
			history.goBack()
		}
	}

	const actions = [
		{
			label: __( 'Move To...' ),
			onClick: moveItem,
		},
		{
			label: __( 'Delete Item' ),
			onClick: deleteItem,
			status: 'destructive'
		},
	]

	if ( methods[ type ] ) {
		return methods[ type ].getActions().concat( actions )
	}

	return actions
}

/**
 * Item specific form defaults.
 */
export const getFormDefaults = () => {
	const { item } = ItemContext.use()
	const { type, name, collections } = item
	const defaults = { name, collections }
	if ( methods[ type ] ) {
		return methods[ type ].getDefaults( defaults )
	}
	return defaults
}

/**
 * Item specific data sent to the API.
 */
export const getFormData = ( values ) => {
	const { type, name, collections } = values
	const data = { name, collections }
	if ( methods[ type ] ) {
		return methods[ type ].getData( values, data )
	}
	return data
}
