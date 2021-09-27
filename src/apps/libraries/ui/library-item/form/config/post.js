import React, { useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { __, sprintf } from '@wordpress/i18n'
import { Libraries } from '@beaverbuilder/cloud-ui'
import { getSystemConfig } from 'assistant/data'
import { getWpRest } from 'assistant/utils/wordpress'

export const getActions = ( item, actions ) => {
	const { library } = Libraries.ItemContext.use()
	const [ previewing, setPreviewing ] = useState( false )
	const api = getWpRest().libraries()

	const previewPost = () => {
		setPreviewing( true )
		api.previewPost( item.id ).then( response => {
			setPreviewing( false )
			window.open( response.data.url )
		} )
	}

	actions.unshift( {
		label: __( 'Preview' ),
		onClick: previewPost,
		disabled: previewing,
	} )

	actions.unshift( {
		component: <ReplaceButton item={ item } />,
		shouldRender: library.permissions.edit_items
	} )

	actions.unshift( {
		component: <CreateButton item={ item } />
	} )

	return actions
}

const usePostMediaImport = ( {
	onComplete = () => {}
} ) => {
	const api = getWpRest().libraries()
	const nextAttachment = useRef( 0 )

	const importPostMedia = ( post, item ) => {

		if ( item.media.thumb ) {
			importPostThumb( post, item )
		} else {
			importPostAttachments( post, item )
		}
	}

	const importPostThumb = ( post, item ) => {
		api.importPostThumb( post.id, item.media.thumb ).finally( () => {
			importPostAttachments( post, item )
		} )
	}

	const importPostAttachments = ( post, item ) => {
		const { attachments } = item.media

		if ( ! attachments ) {
			onComplete( post )
		}

		const attachment = attachments[ nextAttachment.current ]

		if ( ! attachment ) {
			nextAttachment.current = 0
			onComplete( post )
		} else {
			api.importPostMedia( post.id, attachment ).finally( () => {
				nextAttachment.current++
				importPostAttachments( post, item )
			} )
		}
	}

	return importPostMedia
}

const CreateButton = ( { item } ) => {
	const history = useHistory()
	const { createNotice } = Libraries.ItemContext.use()
	const [ action, setAction ] = useState( null )
	const api = getWpRest().libraries()

	const createPostComplete = ( post ) => {
		setAction( null )

		if ( 'create' === action ) {
			const { type } = item.data.builder
			const { bbEditUrl, editUrl } = post

			if ( 'beaver-builder' === type && bbEditUrl ) {
				window.location.href = bbEditUrl
			} else {
				window.location.href = editUrl
			}
		} else {
			importPostComplete( post )
		}
	}

	const importPostComplete = ( post ) => {
		if ( post.error ) {
			createNotice( {
				status: 'error',
				content: __( 'Error importing content.' )
			} )
		} else {
			createNotice( {
				status: 'success',
				content: (
					<>
						{ __( 'Content imported!' ) }
						<a
							style={ {
								textDecoration: 'underline',
								marginLeft: 'var(--fluid-sm-space)'
							} }
							onClick={ () => {
								history.push( `/fl-content/post/${ post.id }`, {
									item: post.data
								} )
							} }
						>
							{ __( 'View content.' ) }
						</a>
					</>
				)
			} )
		}
	}

	const importPostMedia = usePostMediaImport( {
		onComplete: createPostComplete
	} )

	const createPost = ( action ) => {
		setAction( action )
		api.importPost( item.id ).then( response => {
			setAction( 'media' )
			importPostMedia( response.data, item )
		} ).catch( () => {
			setAction( null )
			createNotice( {
				status: 'error',
				content: __( 'Error importing content.' )
			} )
		} )
	}

	return (
		<>
			<select
				value={ '' }
				onChange={ e => createPost( e.target.value ) }
				disabled={ action }
			>
				<option value=''>
					{ ! action && __( 'Create New...' ) }
					{ 'create' === action && __( 'Creating...' ) }
					{ 'import' === action && __( 'Importing...' ) }
					{ 'media' === action && __( 'Importing media...' ) }
				</option>
				<option value='create'>{ __( 'Create and Edit' ) }</option>
				<option value='import'>{ __( 'Import' ) }</option>
			</select>
		</>
	)
}

const ReplaceButton = ( { item } ) => {
	const { contentTypes } = getSystemConfig()
	const { post_type } = item.data.post
	const { createNotice } = Libraries.ItemContext.use()
	const [ action, setAction ] = useState( null )
	const [ post, setPost ] = useState( null )
	const [ posts, setPosts ] = useState( null )
	const postsApi = getWpRest().posts()
	const librariesApi = getWpRest().libraries()
	const pluralLabel = contentTypes[ post_type ] ? contentTypes[ post_type ].labels.plural : `${ post_type }s`
	const singularLabel = contentTypes[ post_type ] ? contentTypes[ post_type ].labels.singular : `${ post_type }`

	useEffect( () => {
		postsApi.findWhere( {
			post_type,
			posts_per_page: -1,
			orderby: 'post_title',
			order: 'ASC',
			post_status: 'any'
		} ).then( response => {
			setPosts( response.data.items )
		} ).catch( () => {
			setPosts( [] )
		} )
	}, [] )

	const replacePostComplete = ( post ) => {
		setPost( null )
		setAction( null )

		if ( ! post || post.error ) {
			createNotice( {
				status: 'error',
				content: __( 'Error replacing content.' )
			} )
		} else {
			createNotice( {
				status: 'success',
				content: __( 'Content replaced!' )
			} )
		}
	}

	const importPostMedia = usePostMediaImport( {
		onComplete: replacePostComplete
	} )

	const replacePost = ( id ) => {
		const message = sprintf( __( 'Do you really want to replace the selected %s with this library item? This cannot be undone.' ), singularLabel.toLowerCase() )

		if ( ! id ) {
			return
		} else if ( ! confirm( message ) ) {
			return
		}

		setPost( id )
		setAction( 'replace' )

		librariesApi.syncPost( id, item.id ).then( response => {
			setAction( 'media' )
			importPostMedia( response.data, item )
		} ).catch( () => {
			replacePostComplete()
		} )
	}

	const ReplaceButtonOptions = () => {
		return posts.map( ( post, i ) => {
			return (
				<option key={ i } value={ post.id }>
					{ post.title }
				</option>
			)
		} )
	}

	return (
		<>
			<select
				value={ '' }
				onChange={ e => replacePost( e.target.value ) }
				disabled={ post }
			>
				<option value=''>
					{ ! action && __( 'Replace...' ) }
					{ 'replace' === action && __( 'Replacing...' ) }
					{ 'media' === action && __( 'Importing media...' ) }
				</option>
				{ null === posts &&
					<optgroup label={ __( 'Loading...' ) } />
				}
				{ null !== posts && ! posts.length &&
					<optgroup label={ sprintf( __( 'No %s found' ), pluralLabel.toLowerCase() ) } />
				}
				{ null !== posts && !! posts.length &&
					<ReplaceButtonOptions />
				}
			</select>
		</>
	)
}
