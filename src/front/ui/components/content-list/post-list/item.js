import React, { useContext } from 'react'
import { __ } from '@wordpress/i18n'
import { redirect } from 'utils/location'
import { Button, ContentListItem, Icon, ItemContext, StackContext } from 'components'
import { PostListDetail } from './post-detail'
import { TermListDetail } from './term-detail'

export const PostListItem = props => {
	const context = useContext( ItemContext )
	const { url } = context
	const { present } = useContext( StackContext )

	const onClick = () => {

		// Terms don't have a status.
		if ( context.status ) {
			present( {
				label: __( 'Edit Post' ),
				content: <PostListDetail />,
				appearance: 'form',
				context,
			} )
		} else {
			present( {
				label: __( 'Edit Term' ),
				content: <TermListDetail />,
				appearance: 'form',
				context,
			} )
		}
	}

	const onPrimaryClick = e => {
		e.stopPropagation()
		onClick(e)
	}

	const onAccessoryClick = e => {
		e.stopPropagation()
		redirect( url )
	}

	return (
		<ContentListItem onClick={ onPrimaryClick } { ...props }>
			<div className="fl-asst-list-item-accessory">
				<Button appearance="icon" onClick={ onAccessoryClick }>
					<Icon name="go" />
				</Button>
				<Button appearance="icon" onClick={ onPrimaryClick }>
					<Icon name="forward" />
				</Button>
			</div>
		</ContentListItem>
	)
}
