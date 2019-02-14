import React, { useContext } from 'react'
import { redirect } from 'utils/location'
import { Button, ContentListItem, Icon, StackContext } from 'components'
import { PostListDetail } from './detail'

export const PostListItem = props => {
	const { pushView } = useContext( StackContext )
	const { data } = props
	const { url } = data

	const onClick = () => {
		pushView( <PostListDetail data={ data } /> )
	}

	const onAccessoryClick = e => {
		e.stopPropagation()
		redirect( url )
	}

	return (
		<ContentListItem onClick={ onClick } { ...props }>
			<div className="fl-asst-list-item-accessory">
				<Button appearance="icon" onClick={ onAccessoryClick }>
					<Icon name="forward" />
				</Button>
			</div>
		</ContentListItem>
	)
}
