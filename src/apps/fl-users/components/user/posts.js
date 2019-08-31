import { __ } from '@wordpress/i18n'
import React from 'fl-react'
import { Form, List } from 'assistant/lib'

export const PostsTab = ( props ) => {

	const { user } = props

	return (
		<Form>
			<Form.Section label={ __( 'Posts by ' ) + user.displayName }>
				<Form.Item>
					<List.Posts query={ { author: user.id } }></List.Posts>
				</Form.Item>
			</Form.Section>
		</Form>
	)
}
