import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { __, sprintf } from '@wordpress/i18n'
import { Libraries } from '@beaverbuilder/cloud-ui'
import { getSystemConfig } from 'assistant/data'
import { getWpRest } from 'assistant/utils/wordpress'

export const getActions = ( item, actions ) => {
	const [ previewing, setPreviewing ] = useState( false )
	const postsApi = getWpRest().posts()

	const previewPost = () => {
		setPreviewing( true )
		postsApi.previewLibraryPost( item.id ).then( response => {
			setPreviewing( false )
			window.open( response.data.url )
		} )
	}

	actions.push( {
		component: <CreateButton item={ item } />
	} )

	actions.push( {
		component: <ReplaceButton item={ item } />
	} )

	actions.push( {
		label: __( 'Preview' ),
		onClick: previewPost,
		disabled: previewing,
	} )

	return actions
}

const CreateButton = ( { item } ) => {
	const history = useHistory()
	const { createNotice } = Libraries.ItemContext.use()
	const [ action, setAction ] = useState( null )
	const postsApi = getWpRest().posts()

	const createPost = ( action ) => {
		setAction( action )
		postsApi.importFromLibrary( item.id ).then( response => {
			if ( 'create' === action ) {
				createPostComplete( response )
			} else {
				importPostComplete( response )
				setAction( null )
			}
		} )
	}

	const createPostComplete = ( response ) => {
		const { type } = item.data.builder
		const { bbEditUrl, editUrl } = response.data

		if ( 'beaver-builder' === type && bbEditUrl ) {
			window.location.href = bbEditUrl
		} else {
			window.location.href = editUrl
		}
	}

	const importPostComplete = ( response ) => {
		if ( response.data.error ) {
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
								history.push( `/fl-content/post/${ response.data.id }`, {
									item: response.data
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
	const [ post, setPost ] = useState( null )
	const [ posts, setPosts ] = useState( null )
	const postsApi = getWpRest().posts()
	const label = contentTypes[ post_type ] ? contentTypes[ post_type ].labels.plural : `${ post_type }s`

	useEffect( () => {
		postsApi.findWhere( {
			post_type,
			posts_per_page: -1,
			orderby: 'post_title',
			order: 'ASC'
		} ).then( response => {
			setPosts( response.data.items )
		} ).catch( () => {
			setPosts( [] )
		} )
	}, [] )

	const replacePost = ( id ) => {
		if ( ! id ) {
			return
		} else if ( ! confirm( __( 'Are you sure you want to replace this library item?' ) ) ) {
			return
		}
		setPost( id )
		postsApi.syncToLibrary( id, item.id ).then( response => {
			replacePostComplete( response )
		} ).catch( () => {
			replacePostComplete()
		} ).finally( () => {
			setPost( null )
		} )
	}

	const replacePostComplete = ( response ) => {
		if ( ! response || ! response.data ) {
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
					{ ! post && __( 'Replace With...' ) }
					{ post && __( 'Replacing...' ) }
				</option>
				{ null === posts &&
					<optgroup label={ __( 'Loading...' ) } />
				}
				{ null !== posts && ! posts.length &&
					<optgroup label={ sprintf( __( 'No %s found' ), label.toLowerCase() ) } />
				}
				{ null !== posts && !! posts.length &&
					<ReplaceButtonOptions />
				}
			</select>
		</>
	)
}
