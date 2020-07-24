import React, { useEffect, useState } from 'react'
import { __ } from '@wordpress/i18n'
import { Filter } from 'assistant/ui'
import { getAppState } from 'assistant/data'

export default ( { teams, onChange } ) => {
	const { itemTypes } = getAppState( 'fl-cloud-libraries' )

	const defaultFilter = {
		view_by: 'type',
		type: 'all',
		collection: 'all',
		order_by: 'name',
		order: 'ASC'
	}

	const [ filter, setFilter ] = useState( defaultFilter )

	const updateFilter = ( newFilter ) => {
		setFilter( newFilter )
		onChange( newFilter )
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
		if ( 'type' === filter.view_by ) {
			return (
				<Filter.RadioGroupItem
					title={ __( 'Type' ) }
					items={ getTypeOptions() }
					value={ filter.type }
					defaultValue={ defaultFilter.type }
					onChange={ value => updateFilter( { ...filter, type: value } ) }
				/>
			)
		}
		return (
			<Filter.RadioGroupItem
				title={ __( 'Collection' ) }
				items={ {
					all: __( 'All' ),
				} }
				value={ filter.collection }
				defaultValue={ defaultFilter.collection }
				onChange={ value => updateFilter( { ...filter, collection: value } ) }
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
				value={ filter.view_by }
				defaultValue={ defaultFilter.view_by }
				onChange={ value => updateFilter( { ...filter, view_by: value } ) }
			/>
			<TypeOrCollectionFilter />
			<Filter.RadioGroupItem
				title={ __( 'Sort By' ) }
				items={ {
					name: __( 'Title' ),
					created_at: __( 'Date Created' ),
					updated_at: __( 'Last Updated' ),
				} }
				value={ filter.order_by }
				defaultValue={ defaultFilter.order_by }
				onChange={ value => updateFilter( { ...filter, order_by: value } ) }
			/>
			<Filter.RadioGroupItem
				title={ __( 'Order' ) }
				items={ {
					ASC: __( 'Ascending' ),
					DESC: __( 'Descending' ),
				} }
				value={ filter.order }
				defaultValue={ defaultFilter.order }
				onChange={ value => updateFilter( { ...filter, order: value } ) }
			/>
			<Filter.Button onClick={ () => updateFilter( defaultFilter ) }>{__( 'Reset Filter' )}</Filter.Button>
		</Filter>
	)
}
