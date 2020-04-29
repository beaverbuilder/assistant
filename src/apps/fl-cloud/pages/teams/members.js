import React from 'react'
import { __ } from '@wordpress/i18n'
import { Filter, List } from 'assistant/ui'

export const TeamMembers = () => {
	const items = [
		{ label: 'Brent Jett', description: 'Admin' },
		{ label: 'Danny Holt', description: 'Member' },
		{ label: 'Jamie VanRaalte', description: 'Member' }
	]

	const getItemProps = ( item, defaults ) => {
		return {
			...defaults,
			label: item.label,
			description: item.description,
			shouldAlwaysShowThumbnail: true,
			thumbnailSize: 'sm',
		}
	}

	return (
		<>
			<Filter>
				<Filter.RadioGroupItem
					title={ __( 'Role' ) }
					items={ {
						any: __( 'Any' ),
						admin: __( 'Admin' ),
						member: __( 'Member' )
					} }
					value={ 'any' }
					defaultValue={ 'any' }
					onChange={ () => {} }
				/>
				<Filter.RadioGroupItem
					title={ __( 'Status' ) }
					items={ {
						active: __( 'Active' ),
						pending: __( 'Pending' )
					} }
					value={ 'active' }
					defaultValue={ 'active' }
					onChange={ () => {} }
				/>
			</Filter>
			<List
				items={ items }
				getItemProps={ getItemProps }
			/>
		</>
	)
}
