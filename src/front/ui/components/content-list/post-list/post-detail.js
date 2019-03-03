import React, { Fragment, useContext, useState } from 'react'
import { getSystemActions, getSystemConfig } from 'store'
import { updatePost } from 'utils/wordpress'
import {
	Button,
	CopyButton,
	ContentItem,
	ContentListDetail,
	ScreenHeader,
	SettingsItem,
	SettingsGroup,
	TagGroup,
	Tag,
	ToggleControl,
	StackContext,
	ViewContext,
} from 'components'
import './style.scss'

export const PostListDetail = () => {
	const { incrementCount, decrementCount } = getSystemActions()
	const { contentStatus } = getSystemConfig()
	const { popView } = useContext( StackContext )
	const viewContext = useContext( ViewContext )
	const [ post, setPost ] = useState( viewContext )
	const {
		author,
		bbCanEdit,
		bbBranding,
		bbEditUrl,
		commentsAllowed,
		date,
		editUrl,
		id,
		status,
		slug,
		thumbnail,
		title,
		type,
		url,
		visibility,
		removeItem
	} = post

	const trashClicked = () => {
		updatePost( id, 'trash' )
		decrementCount( `content/${ type }` )
		removeItem()
		popView()
	}

	const restoreClicked = () => {
		updatePost( id, 'untrash' )
		incrementCount( `content/${ type }` )
		removeItem()
		popView()
	}

	const onChange = e => {
		const { name, value } = e.target
		setPost( { ...post, [ name ]: value } )
	}

	const headerTitle = (
		<ContentItem
			thumbnail={ thumbnail }
			title={ <strong>{ title }</strong> }
			meta={ author }
		/>
	)

	return (
		<ContentListDetail>

			<ScreenHeader title={ headerTitle }>

				<SettingsGroup>
					<SettingsItem label='Visibility'>
						{ visibility }
					</SettingsItem>
					<SettingsItem label='Status'>
						{ contentStatus[ status ] ? contentStatus[ status ] : status }
					</SettingsItem>
					<SettingsItem label='Publish Date'>
						{ date }
					</SettingsItem>
				</SettingsGroup>

				<TagGroup appearance='muted' className='fl-asst-post-actions'>
					{ 'trash' !== status &&
						<Fragment>
							<Tag href={ url }>View</Tag>
							<Tag href={ editUrl }>Edit</Tag>
							{ bbCanEdit &&
								<Tag href={ bbEditUrl }>{ bbBranding }</Tag>
							}
							<Tag onClick={ trashClicked } appearance='warning'>Trash</Tag>
						</Fragment>
					}
					{ 'trash' === status &&
						<Tag onClick={restoreClicked}>Restore</Tag>
					}
				</TagGroup>

			</ScreenHeader>

			<SettingsGroup>
				<SettingsItem label='Title' labelPosition='above'>
					<input type='text' name='title' value={ title } onChange={ onChange } />
				</SettingsItem>
				<SettingsItem label='Slug' labelPosition='above'>
					<input type='text' name='slug' value={ slug } onChange={ onChange } />
					<CopyButton label='Copy URL' text={ url } />
				</SettingsItem>
				<SettingsItem label='Comments'>
					<ToggleControl
						name='commentsAllowed'
						value={ commentsAllowed }
						onChange={ ( value, e ) => onChange( e ) }
					/>
				</SettingsItem>
				<SettingsItem>
					<Button>Publish Changes</Button>
				</SettingsItem>
			</SettingsGroup>

		</ContentListDetail>
	)
}
