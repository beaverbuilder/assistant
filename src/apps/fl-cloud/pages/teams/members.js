import React from 'react'
import { __ } from '@wordpress/i18n'
import { Filter, List } from 'assistant/ui'
import { MembersListAccessory } from './components/members-list-accessory'

export const TeamMembers = () => {
	const items = [
		{ label: 'Brent Jett', description: 'Admin', role: 'admin' },
		{ label: 'Danny Holt', description: 'Member', role: 'member' },
		{ label: 'Jamie VanRaalte', description: 'Member', role: 'member' }
	]

	const getItemProps = ( item, defaults ) => {
		return {
			...defaults,
			label: item.label,
			description: item.description,
			shouldAlwaysShowThumbnail: true,
			thumbnailSize: 'sm',
			accessory: () => <MembersListAccessory item={ item } />
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
