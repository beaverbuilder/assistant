import React from 'react'
import { __ } from '@wordpress/i18n'
import { Libraries } from '@beaverbuilder/cloud-ui'
import { Toolbar } from '@beaverbuilder/fluid'
import { Filter } from 'assistant/ui'
import { useAppState, getAppHooks } from 'assistant/data'

export default props => {
	const { useItemsFilter } = getAppHooks( 'libraries' )
	const [ itemsFilter, setItemsFilter ] = useItemsFilter()
	const { defaultItemsFilter, showFilters } = useAppState( 'libraries', [
		'defaultItemsFilter', 'showFilters'
	] )

	const TypeOrCollectionFilter = () => {
		if ( 'type' === itemsFilter.viewBy ) {
			return (
				<Filter.RadioGroupItem
					title={ __( 'Type' ) }
					items={ Libraries.getItemTypeOptions() }
					value={ itemsFilter.type }
					defaultValue={ defaultItemsFilter.type }
					onChange={ value => setItemsFilter( { ...itemsFilter, type: value } ) }
				/>
			)
		}
		return (
			<Filter.RadioGroupItem
				title={ __( 'Collection' ) }
				items={ Libraries.getCollectionOptions() }
				value={ itemsFilter.collection }
				defaultValue={ defaultItemsFilter.collection }
				onChange={ value => setItemsFilter( { ...itemsFilter, collection: value } ) }
			/>
		)
	}

	return (
		<>
			<Filter { ...props }>
				{ showFilters &&
					<Filter.TextInputItem
						className="fl-asst-filter-item-full-width fl-asst-filter-item-search"
						title={ __( 'Search' ) }
						placeholder={ __( 'Filter...' ) }
						value={ itemsFilter.search }
						onChange={ value => setItemsFilter( { ...itemsFilter, search: value } ) }
					/>
				}
				<Filter.RadioGroupItem
					title={ __( 'View By' ) }
					items={ {
						type: __( 'Type' ),
						collection: __( 'Collection' ),
					} }
					value={ itemsFilter.viewBy }
					defaultValue={ defaultItemsFilter.viewBy }
					onChange={ value => setItemsFilter( { ...itemsFilter, viewBy: value } ) }
				/>
				<TypeOrCollectionFilter />
				<Filter.RadioGroupItem
					title={ __( 'Sort By' ) }
					items={ {
						name: __( 'Title' ),
						created_at: __( 'Date Created' ),
						updated_at: __( 'Last Updated' ),
					} }
					value={ itemsFilter.orderBy }
					defaultValue={ defaultItemsFilter.orderBy }
					onChange={ value => setItemsFilter( { ...itemsFilter, orderBy: value } ) }
				/>
				<Filter.RadioGroupItem
					title={ __( 'Order' ) }
					items={ {
						ASC: __( 'Ascending' ),
						DESC: __( 'Descending' ),
					} }
					value={ itemsFilter.order }
					defaultValue={ defaultItemsFilter.order }
					onChange={ value => setItemsFilter( { ...itemsFilter, order: value } ) }
				/>
				<Filter.Button onClick={ () => setItemsFilter( defaultItemsFilter ) }>{__( 'Reset Filter' )}</Filter.Button>
			</Filter>
		</>
	)
}
