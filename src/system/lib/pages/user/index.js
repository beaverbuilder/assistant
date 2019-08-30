import React from 'fl-react'
import { __ } from '@wordpress/i18n'
import { getSystemConfig } from 'store'
import { Page, Form } from 'lib'

export const User = ( { location } ) => {
	const defaultItem = {
		id: null,
		url: '',
		displayName: '',
		email: '',
	}
	const item = 'undefined' !== typeof location.state.item ? { ...defaultItem, ...location.state.item } : defaultItem
	const { id } = item

	const { currentUser } = getSystemConfig()
	const isYou = currentUser.id === id

	return (
		<Page
			shouldPadSides={ false }
			title={ isYou ? __( 'Your Profile' ) : __( 'Edit User' ) }
		>
			<Page.TitleCard title={ item.displayName }>
				{item.email}
			</Page.TitleCard>

			<Form>
				<Page.RegisteredSections
					location={ {
						type: 'user'
					} }
					data={ { user: item, isYou } }
				/>
			</Form>
		</Page>
	)
}
