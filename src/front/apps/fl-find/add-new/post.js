import React from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Form } from 'components'
import './style.scss'

export const CreatePost = () => {
	return (
		<form>
			<Form.Item label={__( 'Title' )} labelFor="fl-asst-post-title" isRequired={true}>
				<input
					id="fl-asst-post-title"
					name="fl-asst-post-title"
					type="text"
					placeholder={__( 'My Great Title!' )}
				/>
			</Form.Item>

			<Form.Item label={__( 'Slug' )} labelFor="fl-asst-post-slug">
				<input
					id="fl-asst-post-slug"
					name="fl-asst-post-slug"
					type="text"
					placeholder={__( 'my-great-slug' )}
				/>
			</Form.Item>

			<Form.Item label={__( 'Excerpt' )} labelFor="fl-asst-post-excerpt">
				<textarea name='excerpt' id="fl-asst-post-excerpt" rows={6} />
			</Form.Item>

			<Form.Item>
				<Button style={{ marginLeft: 'auto' }}>{ __( 'Create Draft' ) }</Button>
				<Button>{ __( 'Create & Edit' ) }</Button>
			</Form.Item>
		</form>
	)
}
