import React, { useContext } from 'react'
import { __ } from '@wordpress/i18n'
import {
	ContentItem,
	ContentListDetail,
	ScreenHeader,
	SettingsGroup,
	SettingsItem,
	TagGroup,
	Tag,
	Title,
	ViewContext,
} from 'components'

export const UserDetail = () => {
	const {
		date,
		displayName,
		editUrl,
		email,
		url,
		username,
		title,
		thumbnail,
		website,
	} = useContext( ViewContext )

	const headerTitle = (
		<ContentItem
			thumbnail={ thumbnail }
			title={ <strong>{ title }</strong> }
			meta={ email }
		/>
	)

	return (
		<ContentListDetail className='fl-asst-user-detail'>

			<Title>{__( 'Edit Profile' )}</Title>

			<ScreenHeader title={ headerTitle }>
				<TagGroup appearance='muted'>
					<Tag href={url}>View</Tag>
					<Tag href={editUrl}>Edit</Tag>
				</TagGroup>
			</ScreenHeader>

			<SettingsGroup>
				<SettingsItem label='Display Name'>
					{ displayName }
				</SettingsItem>
				<SettingsItem label='Username'>
					{ username }
				</SettingsItem>
				<SettingsItem label='Signup Date'>
					{ date }
				</SettingsItem>
				{ website &&
					<SettingsItem label='Website'>
						<a href={ website }>Visit Website</a>
					</SettingsItem>
				}
			</SettingsGroup>

		</ContentListDetail>
	)
}
