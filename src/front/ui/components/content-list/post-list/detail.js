import React, { Fragment, useContext } from 'react'
import Clipboard from 'react-clipboard.js'
import { useDispatch } from 'store'
import { updatePost } from 'utils/wordpress'
import {
	ContentListDetail,
	Padding,
	ScreenHeader,
	TagGroup,
	Tag,
	StackContext,
	ViewContext,
} from 'components'

export const PostListDetail = () => {
	const { incrementCount, decrementCount } = useDispatch()
	const { popView } = useContext( StackContext )
	const {
		editUrl,
		id,
		meta,
		status,
		title,
		type,
		url,
		removeItem
	} = useContext( ViewContext )

	const trashClicked = () => {
		updatePost( id, 'trash' )
		decrementCount( `content/${ type }` )
		removeItem()
		popView()
	}

	const restoreClicked = () => {
		updatePost( id, 'untrash' )
		incrementCount( `content/${ type }` )
		removeItem()
		popView()
	}

	return (
		<ContentListDetail>
			<ScreenHeader title={title}>
				<TagGroup appearance='muted'>
					{ 'trash' !== status &&
						<Fragment>
							<Tag href={url}>View</Tag>
							<Tag href={editUrl}>Edit</Tag>
							<Tag onClick={trashClicked} appearance='warning'>Trash</Tag>
						</Fragment>
					}
					{ 'trash' === status &&
						<Tag onClick={restoreClicked}>Restore</Tag>
					}
				</TagGroup>
			</ScreenHeader>
			<Padding>
				<div>By { meta }</div>
				<Clipboard data-clipboard-text={url} button-className="fl-asst-button">Copy URL</Clipboard>
			</Padding>
		</ContentListDetail>
	)
}
