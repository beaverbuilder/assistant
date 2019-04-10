import React, { Fragment, useContext, useEffect, useRef, useState } from 'react'
import { __ } from '@wordpress/i18n'
import { getSystemActions, getSystemConfig } from 'store'
import { updatePost } from 'utils/wordpress'
import { PostParentSelect } from './post-parent-select'
import {
	Button,
	CopyButton,
	ContentListDetail,
	Icon,
	Form,
	TagGroup,
	Tag,
	ToggleControl,
	Title,
	UIContext,
	StackContext,
	ViewContext,
} from 'components'

export const PostListDetail = () => {
	const mounted = useRef( false )
	const { incrementCount, decrementCount } = getSystemActions()
	const { contentStatus, contentTypes } = getSystemConfig()
	const { presentNotification } = useContext( UIContext )
	const { dismiss } = useContext( StackContext )
	const viewContext = useContext( ViewContext )
	const [ publishing, setPublishing ] = useState( false )
	const [ post, setPost ] = useState( viewContext )
	const {
		bbCanEdit,
		bbBranding,
		bbEditUrl,
		commentsAllowed,
		excerpt,
		date,
		editUrl,
		id,
		parent,
		status,
		slug,
		title,
		type,
		url,
		visibility,
		removeItem,
		updateItem,
	} = post
	const { supports, isHierarchical } = contentTypes[ type ]
	const viewTitle = contentTypes[ type ].labels.editItem

	useEffect( () => {
		mounted.current = true
		return () => mounted.current = false
	} )

	const trashClicked = () => {
		const message = __( 'Do you really want to trash this item?' )
		if ( confirm( message ) ) {
			updatePost( id, 'trash' )
			decrementCount( `content/${ type }` )
			removeItem()
			dismiss()
		}
	}

	const restoreClicked = () => {
		updatePost( id, 'untrash' )
		incrementCount( `content/${ type }` )
		removeItem()
		dismiss()
	}

	const publishClicked = () => {
		setPublishing( true )

		updatePost( id, 'data', {
			comment_status: commentsAllowed ? 'open' : 'closed',
			ping_status: commentsAllowed ? 'open' : 'closed',
			post_name: slug,
			post_title: title,
			post_excerpt: excerpt,
			post_parent: parent,
		}, () => {
			updateItem( { title, slug, excerpt, parent, commentsAllowed } )
			presentNotification( __( 'Changes published!' ) )
			if ( mounted.current ) {
				setPublishing( false )
			}
		}, () => {
			presentNotification( __( 'Error! Changes not published.' ), { appearance: 'error' } )
			if ( mounted.current ) {
				setPublishing( false )
			}
		} )
	}

	const onChange = e => {
		const { name, value } = e.currentTarget
		setPost( { ...post, [ name ]: value } )
	}

	const titleStyles = {
		background: 'var(--fl-asst-light-color)',
		color: 'var(--fl-asst-dark-color)'
	}

	return (
		<ContentListDetail>
			<PostDetailHeader data={post} />
			<Title shouldOverlay={true} style={titleStyles}>{viewTitle}</Title>

			<form>

				<Form.Item>
					<TagGroup appearance='muted' className='fl-asst-post-actions'>
						{ 'trash' !== status &&
							<Fragment>
								<Tag href={ url }>{__( 'View' )}</Tag>
								<Tag href={ editUrl }>{__( 'Edit' )}</Tag>
								{ bbCanEdit &&
									<Tag href={ bbEditUrl }>{ bbBranding }</Tag>
								}
								<Tag onClick={ trashClicked } appearance='warning'>{__( 'Trash' )}</Tag>
							</Fragment>
						}
						{ 'trash' === status &&
							<Tag onClick={restoreClicked}>{__( 'Restore' )}</Tag>
						}
					</TagGroup>
				</Form.Item>

				<Form.Item label={__( 'Title' )} labelFor="title">
					<input type='text' name='title' id="title" value={ title } onChange={ onChange } />
				</Form.Item>

				<Form.Item label={__( 'Slug' )} labelFor="slug">
					<input type='text' name='slug' id="slug" value={ slug } onChange={ onChange } />
					<CopyButton label={__( 'Copy URL' )} text={ url } />
				</Form.Item>

				{ isHierarchical &&
					<Form.Item label={__( 'Parent' )} labelFor="fl-asst-post-parent">
						<PostParentSelect
							type={ type }
							exclude={ id }
							name='parent'
							id='fl-asst-post-parent'
							value={ parent }
							onChange={ onChange }
						/>
					</Form.Item>
				}

				{ supports.excerpt &&
					<Form.Item label={__( 'Excerpt' )} labelFor="fl-asst-post-excerpt">
						<textarea
							name='excerpt'
							id="fl-asst-post-excerpt"
							rows={6}
							value={ excerpt }
							onChange={ onChange }
						/>
					</Form.Item>
				}

				<Form.Section label={__( 'Publish Settings' )} isInset={true}>
					<Form.Item label={__( 'Visibility' )} placement="beside">{ visibility }</Form.Item>
					<Form.Item label={__( 'Status' )} placement="beside">
						{ contentStatus[ status ] ? contentStatus[ status ] : status }
					</Form.Item>
					<Form.Item label={__( 'PublishDate' )} placement="beside">{ date }</Form.Item>
				</Form.Section>

				<Form.Section label={__( 'Discussion Settings' )} isInset={true}>
					<Form.Item label={__( 'Comments' )} labelFor="commentsAllowed" placement="beside">
						<ToggleControl
							id="commentsAllowed"
							name='commentsAllowed'
							value={ commentsAllowed }
							onChange={ ( value ) => setPost( { ...post, commentsAllowed: value } ) }
						/>
					</Form.Item>
				</Form.Section>

				<Form.Footer>
					{ publishing &&
					<Button>{ __( 'Publishing' ) } &nbsp;<Icon name='small-spinner' /></Button>
					}
					{ ! publishing &&
					<Button onClick={ publishClicked }>{ __( 'Publish Changes' ) }</Button>
					}
				</Form.Footer>
			</form>

		</ContentListDetail>
	)
}

const PostDetailHeader = ( { data } ) => {
	const { title, thumbnail } = data
	return (
		<div className="fl-asst-detail-feature">
			{ thumbnail && <img className="fl-asst-detail-feature-thumbnail" src={thumbnail} /> }
			<div className="fl-asst-detail-feature-content">

				<div className="fl-asst-detail-feature-title">{title}</div>
			</div>
		</div>
	)
}
