import React from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Form } from 'components'

export const CreateTerm = () => {
	return (
		<form>
			<Form.Item label={__( 'Name' )} labelFor="fl-asst-term-name" isRequired={true}>
				<input
					id="fl-asst-term-name"
					name="fl-asst-term-name"
					type="text"
					placeholder={__( 'My Great Name!' )}
				/>
			</Form.Item>

			<Form.Item label={__( 'Slug' )} labelFor="fl-asst-term-slug">
				<input
					id="fl-asst-term-slug"
					name="fl-asst-term-slug"
					type="text"
					placeholder={__( 'my-great-slug' )}
				/>
			</Form.Item>

			<Form.Item label={__( 'Description' )} labelFor="fl-asst-term-description">
				<textarea name='description' id="fl-asst-term-description" rows={6} />
			</Form.Item>

			<Form.Item>
				<Button style={{ marginLeft: 'auto' }}>{ __( 'Create Term' ) }</Button>
			</Form.Item>
		</form>
	)
}
