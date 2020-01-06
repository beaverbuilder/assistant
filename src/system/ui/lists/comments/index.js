import React from 'react'
import { List, Button, Icon } from 'ui'
import { truncate } from 'utils/text'
import { __ } from '@wordpress/i18n'
import { getWpRest } from 'utils/wordpress'
export const Comments = ( {

	getItemProps = ( item, defaultProps ) => defaultProps,
	type = { type },
	query = {
		status: type,
	},
	...rest
} ) => {
	const comments = getWpRest()
	return (

		<List.WordPress
			type={ 'comments' }
			query={ query }

			getItemProps={ ( item, defaultProps ) => {
				const { updateItem } = defaultProps
				const [ approveStatus, set_approveStatus ] = React.useState( item.approved )
				const [ trashStatus, set_trashStatus ] = React.useState( item.trash )
				const [ spamStatus, set_spamStatus ] = React.useState( item.spam )
				const approveComment = () => {
					comments
						.comments()
						.update( item.id, 'approve', item )
						.then( response => {
							if ( '1' == response.data.commentData.comment_approved ) {
								item.approved = true
								set_approveStatus( true )
							}
						} )
				}

				const unapproveComment = () => {
					comments
						.comments()
						.update( item.id, 'unapprove', item )
						.then( response => {
							if ( '0' == response.data.commentData.comment_approved ) {
								item.approved = false
								set_approveStatus( false )
							}
						} )
				}

				const spamComment = () => {
					comments
						.comments()
						.update( item.id, 'spam', item )
						.then( () => {
							item.spam = true
							set_spamStatus( true )
							updateItem( item.uuid, {
								title: __( 'This item has been moved to the spam' ),
								isSpam: true,
								isunSpam: false
							} )
						} )
				}

				const UnspamComment = () => {
					comments
						.comments()
						.update( item.id, 'unspam', item )
						.then( () => {
							item.spam = false
							set_spamStatus( false )
							updateItem( item.uuid, {
								title: __( 'This item has been restored from spam' ),
								isSpam: false,
								isunSpam: true
							} )
						} )
				}

				const trashComment = () => {
					if ( confirm( __( 'Do you really want to trash this item?' ) ) ) {

						comments
							.comments()
							.update( item.id, 'trash', item )
							.then( response => {

								if ( 'trash' == response.data.commentData.comment_approved ) {
									item.trash = true
									set_trashStatus( true )
									updateItem( item.uuid, {
										title: __( 'This item has been moved to the trash' ),
										isTrashing: true,
										isTrashed: true,
										isrestore: false
									} )
								}
							} )
					}

				}

				const untrashComment = () => {
					comments
						.comments()
						.update( item.id, 'untrash', item )
						.then( () => {

							item.trash = false
							set_trashStatus( false )
							updateItem( item.uuid, {
								title: __( 'This item has been restored from trash' ),
								isTrashing: false,
								isTrashed: false,
								isrestore: true


							} )
						} )
				}

				const Accessory = () => {
					if ( item.isTrashed && 'trash' !== type ) {
						return <Button onClick={ untrashComment } tabIndex="-1">Restore</Button>
					} else if ( false === item.isTrashed && 'trash' == type ) {
						return <Button onClick={ trashComment } tabIndex="-1">Trash</Button>
					}
					if ( item.isSpam && 'spam' !== type ) {
						return <Button onClick={ UnspamComment } tabIndex="-1">Restore</Button>
					}
					if ( item.isunSpam && 'spam' == type ) {
						return <Button onClick={ spamComment } tabIndex="-1">Spam</Button>
					}
					return null
				}


				const Extras = () => {
					if (
						item.isCloning ||
						( item.isTrashing && 'trash' !== type ) ||
						( item.isTrashed && 'trash' !== type ) ||
						item.isRestoring ||
						( item.isSpam && 'spam' !== type ) ||
						( item.isunSpam && 'spam' == type ) ||
						( item.isrestore && 'trash' == type )


					) {
						return null
					}
					return (
						<div className="fl-asst-comment-extras fl-asst-item-extras">
							<div
								style={ {
									display: 'grid',
									gridTemplateColumns: 'repeat(4, 1fr)',
									gridAutoRows: 55,
									justifyItems: 'center',
									alignItems: 'center',
								} }
							>
								<Button href={ item.url } >
									<Icon.View title="View" />
								</Button>

								{approveStatus ? (
									<Button onClick={ unapproveComment }><Icon.Reject /></Button>
								) : (
									<Button onClick={ approveComment }><Icon.Approve /></Button>
								)}


								{spamStatus ? (
									<Button onClick={ UnspamComment }><Icon.Unspam /></Button>
								) : (
									<Button onClick={ spamComment }><Icon.Spam /></Button>
								)}


								{trashStatus ? (
									<Button onClick={ untrashComment }><Icon.Restore /></Button>

								) : (
									<Button status="destructive" onClick={ trashComment }><Icon.Trash /></Button>
								)}

							</div>
						</div>
					)
				}


				return getItemProps( item, {
					...defaultProps,
					label: ( item.isTrashing && 'trash' !== type ) || ( item.isSpam && 'spam' !== type ) || ( item.isunSpam && 'spam' == type ) || ( item.isrestore && 'trash' == type ) ? item.title : (
						<em>
							<strong>{item.authorEmail}</strong> commented:
						</em>
					),
					description: ( item.isTrashing && 'trash' !== type ) || ( item.isSpam && 'spam' !== type ) || ( item.isunSpam && 'spam' == type ) || ( item.isrestore && 'trash' == type ) ? '' : truncate(
						item.content.replace( /<\/?[^>]+(>|$)/g, '' ),
						80
					),
					thumbnail: ( item.isTrashing && 'trash' !== type ) || ( item.isSpam && 'spam' !== type ) || ( item.isunSpam && 'spam' == type ) || ( item.isrestore && 'trash' == type ) ? '' : item.thumbnail,
					accessory: props => <Accessory { ...props } />,
					extras: props => <Extras { ...props } />,

				} )
			} }
			{ ...rest }
		/>
	)
}
