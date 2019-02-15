import React, { useContext } from 'react'
import { redirect } from 'utils/location'
import { Button, ContentListItem, Icon, ItemContext, StackContext } from 'components'
import { PostListDetail } from './detail'

export const PostListItem = props => {
	const context = useContext( ItemContext )
	const { url } = context
	const { pushView } = useContext( StackContext )

	const onClick = () => {
		pushView( <PostListDetail />, { context } )
	}

	const onAccessoryClick = e => {
		e.stopPropagation()
		redirect( url )
	}

	return (
		<ContentListItem onClick={ onClick } { ...props }>
			<Button appearance="icon" onClick={ onAccessoryClick }>
				<Icon name="forward" />
			</Button>
		</ContentListItem>
	)
}
