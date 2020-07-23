import React, { useEffect, useState } from 'react'
import { __ } from '@wordpress/i18n'
import { Filter } from 'assistant/ui'
import cloud from 'assistant/cloud'

export default ( { teams, onChange } ) => {
	const cloudUser = cloud.session.getUser()

	const defaultFilter = {
		owner: null,
		order_by: 'name',
	}

	const [ filter, setFilter ] = useState( defaultFilter )

	const updateFilter = ( newFilter ) => {
		setFilter( newFilter )
		onChange( newFilter )
	}

	const getOwnerOptions = () => {
		const options = {
			0: sprintf( __( '%s (You)' ), cloudUser.name ),
		}
		if ( teams ) {
			teams.map( team => options[ team.id ] = team.name )
		}
		return options
	}

	return (
		<Filter>
			<Filter.RadioGroupItem
				title={ __( 'Owner' ) }
				items={ getOwnerOptions() }
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
				value={ filter.order_by }
				defaultValue={ defaultFilter.order_by }
				onChange={ value => updateFilter( { ...filter, order_by: value } ) }
			/>
			<Filter.Button onClick={ () => updateFilter( defaultFilter ) }>{__( 'Reset Filter' )}</Filter.Button>
		</Filter>
	)
}
