import React, { useState } from 'react'
import { __, sprintf } from '@wordpress/i18n'
import { List, Layout, Text } from 'assistant/ui'
import { getSystemConfig } from 'assistant/data'
import './style.scss'

const RecentPosts = () => {
	const { contentTypes } = getSystemConfig()
	const [ type, setType ] = useState( 'page' )
	const baseUrl = '/fl-content'
	const label = sprintf( 'Recent %s', contentTypes[type].labels.plural )

	const types = {
		post: __( 'Posts' ),
		page: __( 'Pages' ),
	}

	return (
		<>
			<Layout.Toolbar>
				<Text.Title>{label}</Text.Title>

				<select
					onChange={ e => setType( e.target.value ) }
					style={ {
						marginLeft: 'auto',
						width: 'auto',
						flexGrow: 0,
						padding: '10px 5px', /* Firefox vertical align fix */
						paddingRight: 30
					} }
				>
					{ Object.keys( types ).map( postType => (
						<option
							key={ postType }
							value={ postType }
							selected={ postType === type }
						>{ types[postType] }</option>
					) ) }
				</select>
			</Layout.Toolbar>
			<List.Posts
				query={ {
					post_type: type,
					posts_per_page: 5,
					post_status: 'any'
				} }
				getItemProps={ ( item, defaultProps ) => {
					if ( item.id ) {
						return {
							...defaultProps,
							description: null,
							thumbnailSize: 'sm',
							marks: [],
							to: {
								pathname: `${baseUrl}/post/${item.id}`,
								state: { item }
							},
						}
					}
					return defaultProps
				} }
			/>
		</>
	)
}

export default RecentPosts
