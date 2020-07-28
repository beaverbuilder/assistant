import React, { useEffect, useState } from 'react'
import { __ } from '@wordpress/i18n'
import { Filter } from 'assistant/ui'
import { useAppState, getAppHooks } from 'assistant/data'

export default () => {
	const { useItemsFilter } = getAppHooks( 'fl-cloud-libraries' )
	const [ itemsFilter, setItemsFilter ] = useItemsFilter()

	const {
		defaultItemsFilter,
		itemTypes
	} = useAppState( 'fl-cloud-libraries', [
		'defaultItemsFilter',
		'itemTypes'
	] )

	const updateFilter = ( newFilter ) => {
		setItemsFilter( newFilter )
	}

	const getTypeOptions = () => {
		const options = {
			all: __( 'All' ),
		}
		Object.keys( itemTypes ).map( key => {
			options[ key ] = itemTypes[ key ].plural
		} )
		return options
	}

	const TypeOrCollectionFilter = () => {
		if ( 'type' === itemsFilter.view_by ) {
			return (
				<Filter.RadioGroupItem
					title={ __( 'Type' ) }
					items={ getTypeOptions() }
					value={ itemsFilter.type }
					defaultValue={ defaultItemsFilter.type }
					onChange={ value => updateFilter( { ...itemsFilter, type: value } ) }
				/>
			)
		}
		return (
			<Filter.RadioGroupItem
				title={ __( 'Collection' ) }
				items={ {
					all: __( 'All' ),
				} }
				value={ itemsFilter.collection }
				defaultValue={ defaultItemsFilter.collection }
				onChange={ value => updateFilter( { ...itemsFilter, collection: value } ) }
			/>
		)
	}

	return (
		<Filter>
			<Filter.RadioGroupItem
				title={ __( 'View By' ) }
				items={ {
					type: __( 'Type' ),
					collection: __( 'Collection' ),
				} }
				value={ itemsFilter.view_by }
				defaultValue={ defaultItemsFilter.view_by }
				onChange={ value => updateFilter( { ...itemsFilter, view_by: value } ) }
			/>
			<TypeOrCollectionFilter />
			<Filter.RadioGroupItem
				title={ __( 'Sort By' ) }
				items={ {
					name: __( 'Title' ),
					created_at: __( 'Date Created' ),
					updated_at: __( 'Last Updated' ),
				} }
				value={ itemsFilter.order_by }
				defaultValue={ defaultItemsFilter.order_by }
				onChange={ value => updateFilter( { ...itemsFilter, order_by: value } ) }
			/>
			<Filter.RadioGroupItem
				title={ __( 'Order' ) }
				items={ {
					ASC: __( 'Ascending' ),
					DESC: __( 'Descending' ),
				} }
				value={ itemsFilter.order }
				defaultValue={ defaultItemsFilter.order }
				onChange={ value => updateFilter( { ...itemsFilter, order: value } ) }
			/>
			<Filter.Button onClick={ () => updateFilter( defaultItemsFilter ) }>{__( 'Reset Filter' )}</Filter.Button>
		</Filter>
	)
}
