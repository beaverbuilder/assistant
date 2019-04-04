import React, { Fragment, useContext } from 'react'
import { __ } from '@wordpress/i18n'
import {
	ContentItem,
	ContentListDetail,
	ScreenHeader,
	SettingsGroup,
	SettingsItem,
	TagGroup,
	Tag,
	ViewContext,
} from 'components'

export const UserDetail = () => {
	const {
		editUrl,
		email,
		url,
		title,
		thumbnail,
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

			<ScreenHeader title={ headerTitle }>
				<TagGroup appearance='muted'>
					<Tag href={url}>{__( 'View' )}</Tag>
					<Tag href={editUrl}>{__( 'Edit' )}</Tag>
				</TagGroup>
			</ScreenHeader>

			<UserSettings />

		</ContentListDetail>
	)
}

const UserSettings = () => {
	const {
		date,
		displayName,
		username,
		website,
	} = useContext( ViewContext )
	return (
		<Fragment>
			<SettingsGroup>
				<SettingsItem label={__( 'Display Name' )}>
					{ displayName }
				</SettingsItem>
				<SettingsItem label={__( 'Username' )}>
					{ username }
				</SettingsItem>
				<SettingsItem label={__( 'Signup Date' )}>
					{ date }
				</SettingsItem>
				{ website &&
					<SettingsItem label={__( 'Website' )}>
						<a href={ website }>{__( 'Visit Website' )}</a>
					</SettingsItem>
				}
			</SettingsGroup>
		</Fragment>
	)
}
