import React, { useState } from 'react'
import { __ } from '@wordpress/i18n'
import {
	Widget,
	PostList,
	NavBar,
} from 'components'

export const RecentlyEditedWidget = () => {
	const [ postType, setPostType ] = useState( 'any' )

	const navItems = [
		{
			children: __( 'Any Type' ),
			onClick: () => setPostType( 'any' ),
			isSelected: 'any' === postType
		},
		{
			children: __( 'Posts' ),
			onClick: () => setPostType( 'post' ),
			isSelected: 'post' === postType
		},
		{
			children: __( 'Pages' ),
			onClick: () => setPostType( 'page' ),
			isSelected: 'page' === postType
		},
	]

	return (
		<Widget title={__( 'Recently Created' )} isPadded={false}>
			<div style={{
				padding: '0 var(--fl-asst-base-padding)',
				display: 'flex',
			}}>
				<NavBar items={navItems} />
			</div>
			<PostList
				query={{
					posts_per_page: 5,
					post_type: postType,
				}}
				placeholderItemCount={5}
			/>
		</Widget>
	)
}
