import React from 'react'
import { __ } from '@wordpress/i18n'
import { Form } from 'components'
import './style.scss'

export const CreatePost = () => {
	return (
		<form>
			<Form.Item label={__( 'Title' )} labelFor="fl-asst-post-title" isRequired={true}>
				<input
					id="fl-asst-post-title"
					name="fl-asst-post-title"
					type="text"
					placeholder={__( 'Title Your Post Something Great!' )}
				/>
			</Form.Item>

			<Form.Item label={__( 'Post Type' )} labelFor="fl-asst-post-type" placement="beside">
				<select id="fl-asst-post-type" name="fl-asst-post-type">
					<optgroup label={__( 'Built-in Types' )}>
						<option value="post">{__( 'Post' )}</option>
						<option value="page">{__( 'Page' )}</option>
					</optgroup>
					<optgroup label={__( 'Additional Types' )}>
						<option value="whatever">{__( 'Squirrel' )}</option>
					</optgroup>
				</select>
			</Form.Item>

			<Form.Item label={__( 'Slug' )} labelFor="fl-asst-post-slug">
				<input
					id="fl-asst-post-slug"
					name="fl-asst-post-slug"
					type="text"
					placeholder={__( 'my-great-post-slug' )}
				/>
			</Form.Item>
		</form>
	)
}
