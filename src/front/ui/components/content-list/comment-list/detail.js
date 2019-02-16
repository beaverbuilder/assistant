import React, { Fragment, useContext } from 'react'
import { updateComment } from 'utils/wordpress'
import {
	ContentListDetail,
	ScreenHeader,
	TagGroup,
	Tag,
	Widget,
	StackContext,
	ViewContext,
} from 'components'

export const CommentDetail = () => {
	const { popView } = useContext( StackContext )
	const {
		approved,
		content,
		editUrl,
		id,
		url,
		spam,
		trash,
		updateItem,
		removeItem
	} = useContext( ViewContext )

	const approveClicked = () => {
		updateComment( id, approved ? 'unapprove' : 'approve' )
		updateItem( {
			approved: ! approved
		} )
	}

	const spamClicked = () => {
		updateComment( id, spam ? 'unspam' : 'spam' )
		removeItem()
		popView()
	}

	const trashClicked = () => {
		updateComment( id, 'trash' )
		removeItem()
		popView()
	}

	const restoreClicked = () => {
		updateComment( id, 'untrash' )
		removeItem()
		popView()
	}

	return (
		<ContentListDetail className='fl-asst-comment-detail'>
			<ScreenHeader title={ <CommentDetailTitle /> }>
				<TagGroup appearance='muted'>
					{ ! spam && ! trash &&
						<Fragment>
							<Tag href={url}>View</Tag>
							<Tag href={editUrl}>Edit</Tag>
							<Tag onClick={ approveClicked }>{ approved ? 'Unapprove' : 'Approve' }</Tag>
						</Fragment>
					}
					<Tag onClick={ spamClicked }>{ spam ? 'Not Spam' : 'Spam' }</Tag>
					{ ! trash && <Tag onClick={ trashClicked } appearance='warning'>Trash</Tag> }
					{ trash && <Tag onClick={ restoreClicked }>Restore</Tag> }
				</TagGroup>
			</ScreenHeader>
			<Widget title='Comment'>
				<div dangerouslySetInnerHTML={ { __html: content } } />
			</Widget>
		</ContentListDetail>
	)
}

const CommentDetailTitle = () => {
	const { author, postTitle, thumbnail } = useContext( ViewContext )
	const thumbStyles = {
		backgroundImage: thumbnail ? `url(${ thumbnail })` : '',
	}
	return (
		<div className='fl-asst-comment-title'>
			<div className='fl-asst-comment-title-visual'>
				<div className='fl-asst-comment-title-visual-box' style={ thumbStyles }></div>
			</div>
			<div className='fl-asst-comment-title-meta'>
				<div className='fl-asst-comment-title-author'>
					<strong>{ author }</strong> commented
				</div>
				<div className='fl-asst-comment-title-post'>
					In response to <strong>{ postTitle }</strong>
				</div>
			</div>
		</div>
	)
}
