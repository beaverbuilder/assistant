import React, { useContext } from 'react'
import { redirect } from 'shared-utils/location'
import { getSystemConfig } from 'data'
import { Button, ContentListItem, Icon, ItemContext, StackContext } from 'components'
import { PostListDetail, TermListDetail } from './detail'

export const PostListItem = props => {
	const { contentTypes, taxonomies } = getSystemConfig()
	const context = useContext( ItemContext )
	const { url } = context
	const { present } = useContext( StackContext )

	const onClick = () => {

		// Terms don't have a status.
		if ( context.status ) {
			present( {
				label: contentTypes[ context.type ].labels.editItem,
				content: <PostListDetail />,
				appearance: 'form',
				shouldShowTitle: false,
				context,
			} )
		} else {
			present( {
				label: taxonomies[ context.taxonomy ].labels.editItem,
				content: <TermListDetail />,
				appearance: 'form',
				context,
			} )
		}
	}

	const onPrimaryClick = e => {
		e.stopPropagation()
		onClick( e )
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
					<Icon name="forward-arrow" />
				</Button>
			</div>
		</ContentListItem>
	)
}
