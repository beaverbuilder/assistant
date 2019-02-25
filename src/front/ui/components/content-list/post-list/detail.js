import React, { Fragment, useContext, useState } from 'react'
import Clipboard from 'react-clipboard.js'
import { getSystemActions } from 'store'
import { updatePost } from 'utils/wordpress'
import {
	Button,
	ContentListDetail,
	FormField,
	FormSection,
	ScreenHeader,
	Separator,
	TagGroup,
	Tag,
	ToggleControl,
	StackContext,
	ViewContext,
} from 'components'

export const PostListDetail = () => {
	const { incrementCount, decrementCount } = getSystemActions()
	const { popView } = useContext( StackContext )
	const viewContext = useContext( ViewContext )
	const [ post, setPost ] = useState( viewContext )
	const {
		commentsAllowed = true,
		editUrl,
		id,
		meta,
		status,
		slug,
		title,
		type,
		url,
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

	return (
		<ContentListDetail>
			<ScreenHeader title={title}>
				<TagGroup appearance='muted'>
					{ 'trash' !== status &&
						<Fragment>
							<Tag href={url}>View</Tag>
							<Tag href={editUrl}>Edit</Tag>
							<Tag onClick={trashClicked} appearance='warning'>Trash</Tag>
						</Fragment>
					}
					{ 'trash' === status &&
						<Tag onClick={restoreClicked}>Restore</Tag>
					}
				</TagGroup>
			</ScreenHeader>

			<FormSection label='Basic Info'>
				<FormField label='Title'>
					<input type='text' name='title' value={ title } onChange={ onChange } />
				</FormField>
				<FormField label='Slug'>
					<input type='text' name='slug' value={ slug } onChange={ onChange } />
					<Clipboard data-clipboard-text={url} button-className="fl-asst-button">Copy URL</Clipboard>
				</FormField>
			</FormSection>

			<FormSection label='Discussion'>
				<FormField label='Comments' labelPosition='beside'>
					<ToggleControl
						name='commentsAllowed'
						value={ commentsAllowed }
						onChange={ ( value, e ) => onChange( e ) }
					/>
				</FormField>
			</FormSection>

		</ContentListDetail>
	)
}
