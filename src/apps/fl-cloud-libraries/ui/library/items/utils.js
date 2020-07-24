import { __ } from '@wordpress/i18n'
import { getAppState } from 'assistant/data'

export const getFilteredItems = ( filter, items ) => {
	const viewBy = filter ? filter.view_by : 'type'
	const categorized = getCategorizedItems( viewBy, items )

	if ( ! filter ) {
		return categorized
	}

	const { view_by, type, collection } = filter

	if ( 'type' === view_by && 'all' !== type ) {
		return categorized[ type ] ? { [ type ]: categorized[ type ] } : {}
	} else if ( 'collection' === view_by && 'all' !== collection ) {
		return categorized[ collection ] ? { [ collection ]: categorized[ collection ] } : {}
	} else {
		return categorized
	}
}

export const getCategorizedItems = ( viewBy, items ) => {
	if ( ! items ) {
		return {}
	} else if ( 'collection' === viewBy ) {
		return getItemsByCollection( items )
	}
	return getItemsByType( items )
}

export const getItemsByCollection = ( items ) => {
	const collections = {
		uncategorized: {
			name: __( 'Uncategorized' ),
			items: []
		}
	}
	items.map( item => {
		if ( ! item.collections || ! item.collections.length ) {
			collections.uncategorized.items.push( item )
		} else {
			item.collections.map( ( { name, slug } ) => {
				if ( ! collections[ slug ] ) {
					collections[ slug ] = {
						name,
						items: []
					}
				}
				collections[ slug ].items.push( item )
			} )
		}
	} )
	return collections
}

export const getItemsByType = ( items ) => {
	const { itemTypes } = getAppState( 'fl-cloud-libraries' )
	const types = {}
	items.map( item => {
		if ( ! types[ item.type ] ) {
			types[ item.type ] = {
				name: itemTypes[ item.type ].plural,
				items: []
			}
		}
		types[ item.type ].items.push( item )
	} )
	return types
}
