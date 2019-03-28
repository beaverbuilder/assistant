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
	ScreenHeader,
	SettingsItem,
	SettingsGroup,
	TagGroup,
	Tag,
	ToggleControl,
	Title,
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
	const { popView } = useContext( StackContext )
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
			popView()
		}
	}

	const restoreClicked = () => {
		updatePost( id, 'untrash' )
		incrementCount( `content/${ type }` )
		removeItem()
		popView()
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
			presentNotification( 'Changes published!' )
			if ( mounted.current ) {
				setPublishing( false )
			}
		}, () => {
			presentNotification( 'Error! Changes not published.', { appearance: 'error' } )
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

			<Title>{__('Edit Post')}</Title>

			<ScreenHeader title={ headerTitle }>

				<SettingsGroup>
					<SettingsItem label='Visibility'>
						{ visibility }
					</SettingsItem>
					<SettingsItem label='Status'>
						{ contentStatus[ status ] ? contentStatus[ status ] : status }
					</SettingsItem>
					<SettingsItem label='Publish Date'>
						{ date }
					</SettingsItem>
				</SettingsGroup>

				<TagGroup appearance='muted' className='fl-asst-post-actions'>
					{ 'trash' !== status &&
						<Fragment>
							<Tag href={ url }>{__('View')}</Tag>
							<Tag href={ editUrl }>{__('Edit')}</Tag>
							{ bbCanEdit &&
								<Tag href={ bbEditUrl }>{ bbBranding }</Tag>
							}
							<Tag onClick={ trashClicked } appearance='warning'>{__('Trash')}</Tag>
						</Fragment>
					}
					{ 'trash' === status &&
						<Tag onClick={restoreClicked}>{__('Restore')}</Tag>
					}
				</TagGroup>

			</ScreenHeader>

			<SettingsGroup>
				<SettingsItem label='Title' labelPosition='above'>
					<input type='text' name='title' value={ title } onChange={ onChange } autoFocus />
				</SettingsItem>
				<SettingsItem label='Slug' labelPosition='above'>
					<input type='text' name='slug' value={ slug } onChange={ onChange } />
					<CopyButton label='Copy URL' text={ url } />
				</SettingsItem>
				<SettingsItem label='Comments'>
					<ToggleControl
						name='commentsAllowed'
						value={ commentsAllowed }
						onChange={ ( value ) => setPost( { ...post, commentsAllowed: value } ) }
					/>
				</SettingsItem>
				<SettingsItem>
					{ publishing &&
						<Button>{ __( 'Publishing' ) } &nbsp;<Icon name='small-spinner' /></Button>
					}
					{ ! publishing &&
						<Button onClick={ publishClicked }>{ __( 'Publish Changes' ) }</Button>
					}
				</SettingsItem>
			</SettingsGroup>

		</ContentListDetail>
	)
}
