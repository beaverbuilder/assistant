import React, { Fragment, useContext, useEffect, useRef, useState } from 'react'
import { __ } from '@wordpress/i18n'
import { getSystemActions, getSystemConfig } from 'store'
import { updatePost } from 'utils/wordpress'
import {
	Button,
	CopyButton,
	ContentItem,
	ContentListDetail,
	Icon,
	FormItem,
	TagGroup,
	Tag,
	ToggleControl,
	UIContext,
	StackContext,
	ViewContext,
} from 'components'
import './style.scss'

export const PostListDetail = () => {
	const mounted = useRef( false )
	const { incrementCount, decrementCount } = getSystemActions()
	const { contentStatus } = getSystemConfig()
	const { presentNotification } = useContext( UIContext )
	const { dismiss } = useContext( StackContext )
	const viewContext = useContext( ViewContext )
	const [ publishing, setPublishing ] = useState( false )
	const [ post, setPost ] = useState( viewContext )
	const {
		author,
		bbCanEdit,
		bbBranding,
		bbEditUrl,
		commentsAllowed,
		date,
		editUrl,
		id,
		status,
		slug,
		thumbnail,
		title,
		type,
		url,
		visibility,
		removeItem,
		updateItem,
	} = post

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
		}, () => {
			updateItem( { title, slug, commentsAllowed } )
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

	const headerTitle = (
		<ContentItem
			thumbnail={ thumbnail }
			title={ <strong>{ title }</strong> }
			meta={ author }
		/>
	)

	return (
		<ContentListDetail>

			<form>

				<FormItem label={__('Visibility')} placement="beside">{ visibility }</FormItem>
				<FormItem label={__('Status')} placement="beside">
					{ contentStatus[ status ] ? contentStatus[ status ] : status }
				</FormItem>
				<FormItem label={__('PublishDate')} placement="beside">{ date }</FormItem>

				<FormItem>
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
				</FormItem>

				<FormItem label={__('Title')} labelFor="title">
					<input type='text' name='title' id="title" value={ title } onChange={ onChange } />
				</FormItem>
				<FormItem label={__('Slug')} labelFor="slug">
					<input type='text' name='slug' id="slug" value={ slug } onChange={ onChange } />
					<CopyButton label={__('Copy URL')} text={ url } />
				</FormItem>
				<FormItem label={__('Comments')} labelFor="commentsAllowed" placement="beside">
					<ToggleControl
						id="commentsAllowed"
						name='commentsAllowed'
						value={ commentsAllowed }
						onChange={ ( value ) => setPost( { ...post, commentsAllowed: value } ) }
					/>
				</FormItem>
				<FormItem>
				{ publishing &&
					<Button style={{ marginLeft: 'auto' }}>{ __( 'Publishing' ) } &nbsp;<Icon name='small-spinner' /></Button>
				}
				{ ! publishing &&
					<Button style={{ marginLeft: 'auto' }} onClick={ publishClicked }>{ __( 'Publish Changes' ) }</Button>
				}
				</FormItem>
			</form>

		</ContentListDetail>
	)
}
