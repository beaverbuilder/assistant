import React, { useContext } from 'react'
import { redirect } from 'utils/location'
import { Button, ContentListItem, Icon, ItemContext, StackContext } from 'components'
import { PostListDetail } from './post-detail'
import { TermListDetail } from './term-detail'

export const PostListItem = props => {
	const context = useContext( ItemContext )
	const { url } = context
	const { pushView } = useContext( StackContext )

	const onClick = () => {

		// Terms don't have a status.
		if ( context.status ) {
			pushView( <PostListDetail />, { context } )
		} else {
			pushView( <TermListDetail />, { context } )
		}
	}

	const onAccessoryClick = e => {
		e.stopPropagation()
		redirect( url )
	}

	return (
		<ContentListItem onClick={ onClick } { ...props }>
			<div className="fl-asst-list-item-accessory">
				<Button appearance="icon" onClick={ onAccessoryClick }>
					<Icon name="go-diagonal" />
				</Button>
			</div>
		</ContentListItem>
	)
}
