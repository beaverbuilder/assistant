import React, { Fragment, useContext } from 'react'
import { __ } from '@wordpress/i18n'
import {
	ContentItem,
	ContentListDetail,
	TagGroup,
	Tag,
	ViewContext,
	Form,
} from 'components'

export const UserDetail = () => {
	const {
		editUrl,
		email,
		url,
		title,
		thumbnail,
	} = useContext( ViewContext )

	return (
		<ContentListDetail className='fl-asst-user-detail'>
			<form>
				<Form.Item>
					<ContentItem
						thumbnail={ thumbnail }
						title={ <strong>{ title }</strong> }
						meta={ email }
					/>
				</Form.Item>
				<Form.Item>
					<TagGroup appearance='muted'>
						<Tag href={url}>{__( 'View' )}</Tag>
						<Tag href={editUrl}>{__( 'Edit' )}</Tag>
					</TagGroup>
				</Form.Item>

				<UserSettings />
			</form>
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
			<Form.Section label={__( 'General Information' )} isInset={true}>
				<Form.Item label={__( 'Display Name' )} placement="beside">
					{ displayName }
				</Form.Item>
				<Form.Item label={__( 'Username' )} placement="beside">
					{ username }
				</Form.Item>
				<Form.Item label={__( 'Signup Date' )} placement="beside">
					{ date }
				</Form.Item>
				{ website &&
					<Form.Item label={__( 'Website' )} placement="beside">
						<a href={ website }>{__( 'Visit Website' )}</a>
					</Form.Item>
				}
			</Form.Section>
		</Fragment>
	)
}
