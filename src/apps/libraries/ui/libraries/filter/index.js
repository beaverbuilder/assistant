import React from 'react'
import { __ } from '@wordpress/i18n'
import { Libraries } from '@beaverbuilder/cloud-ui'
import { Filter } from 'assistant/ui'
import { getAppHooks } from 'assistant/data'

export default () => {
	const { useDefaultFilter, useFilter } = getAppHooks( 'libraries' )
	const [ defaultFilter ] = useDefaultFilter()
	const [ filter, setFilter ] = useFilter()

	const updateFilter = ( data ) => {
		setFilter( data )
		Libraries.loadAppState()
	}

	return (
		<Filter>
			<Filter.RadioGroupItem
				title={ __( 'Owner' ) }
				items={ Libraries.getLibraryOwnerOptions() }
				value={ filter.owner }
				defaultValue={ defaultFilter.owner }
				onChange={ value => updateFilter( { ...filter, owner: value } ) }
			/>
			<Filter.RadioGroupItem
				title={ __( 'Sort By' ) }
				items={ {
					name: __( 'Title' ),
					created_at: __( 'Date Created' ),
					updated_at: __( 'Last Updated' ),
				} }
				value={ filter.orderBy }
				defaultValue={ defaultFilter.orderBy }
				onChange={ value => updateFilter( { ...filter, orderBy: value } ) }
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
			<Filter.RadioGroupItem
				title={ __( 'Display As' ) }
				items={ {
					grid: __( 'Grid' ),
					list: __( 'List' ),
				} }
				value={ filter.displayAs }
				defaultValue={ defaultFilter.displayAs }
				onChange={ value => updateFilter( { ...filter, displayAs: value } ) }
			/>
			<Filter.Button onClick={ () => updateFilter( defaultFilter ) }>{__( 'Reset Filter' )}</Filter.Button>
		</Filter>
	)
}
