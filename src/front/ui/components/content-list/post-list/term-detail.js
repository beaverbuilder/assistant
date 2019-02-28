import React, { useContext, useState } from 'react'
import Clipboard from 'react-clipboard.js'
import {
	Button,
	ContentListDetail,
	ScreenHeader,
	SettingsItem,
	SettingsGroup,
	TagGroup,
	Tag,
	StackContext,
	ViewContext,
} from 'components'
import './style.scss'

export const TermListDetail = () => {
	const { popView } = useContext( StackContext )
	const viewContext = useContext( ViewContext )
	const [ term, setTerm ] = useState( viewContext )
	const {
		description,
		editUrl,
		slug,
		title,
		url,
		removeItem,
	} = term

	const trashClicked = () => {

		// 'TODO: Trash terms'
		removeItem()
		popView()
	}

	const onChange = e => {
		const { name, value } = e.target
		setTerm( { ...term, [ name ]: value } )
	}

	return (
		<ContentListDetail>

			<ScreenHeader title={ title }>
				<TagGroup appearance='muted' className='fl-asst-post-actions'>
					<Tag href={ url }>View</Tag>
					<Tag href={ editUrl }>Edit</Tag>
					<Tag onClick={ trashClicked } appearance='warning'>Delete</Tag>
				</TagGroup>
			</ScreenHeader>

			<SettingsGroup>
				<SettingsItem label='Name' labelPosition='above'>
					<input type='text' name='title' value={ title } onChange={ onChange } />
				</SettingsItem>
				<SettingsItem label='Slug' labelPosition='above'>
					<input type='text' name='slug' value={ slug } onChange={ onChange } />
					<Clipboard data-clipboard-text={ url } button-className="fl-asst-button">Copy URL</Clipboard>
				</SettingsItem>
				<SettingsItem label='Description' labelPosition='above'>
					<textarea name='description' value={ description } onChange={ onChange } />
				</SettingsItem>
				<SettingsItem>
					<Button>Publish Changes</Button>
				</SettingsItem>
			</SettingsGroup>

		</ContentListDetail>
	)
}
