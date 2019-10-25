import React, { useContext } from 'react'
import { sprintf } from '@wordpress/i18n'
import { Form, List, App } from 'assistant/lib'

export const PostsTab = ( { user } ) => {
	const { handle } = useContext( App.Context )
	return (
		<>
			<Form.Section label={ sprintf( 'Posts by %s', user.displayName ) } shouldPadSides={ false }>
				<List.Posts
					query={ { author: user.id } }
					getItemProps={ ( item, defaultProps ) => {
						return {
							...defaultProps,
							extras: null,
							description: null,
							thumbnailSize: 'sm',
							to: {
								pathname: '/' + handle + '/post/' + item.id,
								state: { item }
							}
						}
					} }
				/>
			</Form.Section>
		</>
	)
}
