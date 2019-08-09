import React, { Fragment, useContext } from 'react'
import { __ } from '@wordpress/i18n'
import {
	ContentListDetail,
	TagGroup,
	Tag,
	ViewContext,
	Form,
	Title,
} from 'components'

export const UserDetail = props => {
	const { label = __( 'Edit User' ) } = props
	const {
		editUrl,
		url,
		title,
		thumbnail,
	} = useContext( ViewContext )

	return (
		<ContentListDetail className='fl-asst-user-detail'>

			<Title
				shouldOverlay={ true }
				shouldInvertColors={ true }
			>{label}</Title>

			<div className="fl-asst-detail-feature">
				<div className="fl-asst-detail-feature-content">
					<div className="fl-asst-detail-feature-title">{title}</div>
					{ thumbnail && <img className="fl-asst-detail-user-avatar" src={ thumbnail } alt={ __( 'User Avatar' ) } /> }
				</div>
			</div>

			<form>
				<Form.Item>
					<TagGroup appearance='muted'>
						<Tag href={ url }>{__( 'View' )}</Tag>
						<Tag href={ editUrl }>{__( 'Edit' )}</Tag>
					</TagGroup>
				</Form.Item>

				<UserSettings />
			</form>
		</ContentListDetail>
	)
}

const UserSettings = () => {
	const view = useContext( ViewContext )
	const {
		date,
		displayName,
		username,
		website,
		content,
		meta,
	} = view

	return (
		<Fragment>
			<Form.Section label={ __( 'General Information' ) } isInset={ true }>
				<Form.Item label={ __( 'Display Name' ) } placement="beside">
					{ displayName }
				</Form.Item>
				<Form.Item label={ __( 'Username' ) } placement="beside">
					{ username }
				</Form.Item>
				<Form.Item label={ __( 'Signup Date' ) } placement="beside">
					{ date }
				</Form.Item>
				{ meta &&
					<Form.Item label={ __( 'Email Address' ) } placement="beside">
						<a href={ `mailto:${meta}` }>{meta}</a>
					</Form.Item>
				}
				{ website &&
					<Form.Item label={ __( 'Website' ) } placement="beside">
						<a href={ website } target="_blank" rel="noopener noreferrer">{website}</a>
					</Form.Item>
				}
			</Form.Section>

			{ content &&
			<Form.Section isInset={ true } label={ __( 'Biographical Info' ) }>
				<Form.Item>{content}</Form.Item>
			</Form.Section> }
		</Fragment>
	)
}
