import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { __, sprintf } from '@wordpress/i18n'
import { Libraries } from '@beaverbuilder/cloud-ui'
import { Button, Modal } from 'assistant/ui'
import { getSystemConfig } from 'assistant/data'
import { getWpRest } from 'assistant/utils/wordpress'
import { usePostMediaImport } from 'ui/library/use-post-media-import'

export const getActions = ( item, actions ) => {
	actions.unshift( {
		component: <PreviewButton item={ item } />
	} )

	actions.unshift( {
		component: <UpdateButton item={ item } />
	} )

	actions.unshift( {
		component: <CreateButton item={ item } />
	} )

	return actions
}

const PreviewButton = ( { item } ) => {
	const { createNotice } = Libraries.ItemContext.use()
	const [ previewing, setPreviewing ] = useState( false )
	const api = getWpRest().libraries()

	const previewPost = () => {
		setPreviewing( true )

		api.previewPost( item ).then( response => {
			previewPostComplete( response )
		} ).catch( () => {
			previewPostComplete()
		} ).finally( () => {
			setPreviewing( false )
		} )
	}

	const previewPostComplete = ( response ) => {
		if ( ! response || response.data.error ) {
			createNotice( {
				status: 'error',
				content: __( 'Error previewing content.' )
			} )
		} else {
			window.open( response.data.url )
		}
	}

	return (
		<Button
			onClick={ previewPost }
			disabled={ previewing }
		>
			{ __( 'Preview' ) }
		</Button>
	)
}

const UpdateButton = ( { item } ) => {
	const { currentPageView } = getSystemConfig()
	const { id, type, isSingular } = currentPageView
	const [ updating, setUpdating ] = useState( false )
	const { createNotice } = Libraries.ItemContext.use()
	const librariesApi = getWpRest().libraries()

	const buttons = [
		{
			label: __( 'Cancel' ),
			disabled: updating,
			onClick: ( { closeDialog } ) => closeDialog(),
		}
	]

	if ( isSingular ) {
		buttons.push( {
			label: updating ? __( 'Updating...' ) : __( 'Update' ),
			isSelected: true,
			disabled: updating,
			onClick: ( { closeDialog } ) => {
				const message = sprintf( __( 'Do you really want to update this library item and replace its content with the current %s? This cannot be undone.' ), type.toLowerCase() )

				if ( ! confirm( message ) ) {
					return
				}

				setUpdating( true )

				librariesApi.syncLibraryPost( id, item ).then( () => {
					createNotice( {
						status: 'success',
						content: __( 'Library item updated!' )
					} )
				} ).catch( () => {
					createNotice( {
						status: 'error',
						content: __( 'Error updating library item.' )
					} )
				} ).finally( () => {
					setUpdating( false )
					closeDialog()
				} )
			},
		} )
	}

	const [ showUpdateDialog, UpdateDialog ] = Modal.useDialog( {
		title: __( 'Update this Library Item' ),
		message: <UpdateDialogContent />,
		buttons
	} )

	return (
		<>
			<Button onClick={ showUpdateDialog }>
				{ __( 'Update' ) }
			</Button>
			<UpdateDialog />
		</>
	)
}

const UpdateDialogContent = () => {
	const { currentPageView } = getSystemConfig()
	const { intro, name, type, isSingular } = currentPageView

	if ( ! isSingular ) {
		return __( 'Updating is currently not available. To update this library item, navigate to the post or page you\'d like to update it with and click the update button again.' )
	}

	return (
		<>
			<div style={ { padding: 'var(--fluid-med-space) 0' } }>
				<strong>{ intro }:</strong> { name }
			</div>
			<div>
				{ sprintf( __( 'Updating this library item will replace its content with the content of the current %s.' ), type.toLowerCase() ) }
			</div>
		</>
	)
}

const CreateButton = ( { item } ) => {
	const history = useHistory()
	const { createNotice } = Libraries.ItemContext.use()
	const [ action, setAction ] = useState( null )
	const [ importingMedia, setImportingMedia ] = useState( false )
	const api = getWpRest().libraries()
	const importPostMedia = usePostMediaImport()

	const createPost = () => {
		api.importPost( item ).then( response => {
			setImportingMedia( true )
			importPostMedia( response.data, item ).then( createPostComplete )
		} ).catch( () => {
			setAction( null )
			setImportingMedia( false )
			createNotice( {
				status: 'error',
				content: __( 'Error importing content.' )
			} )
		} )
	}

	const createPostComplete = ( post ) => {
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

		setAction( null )
		setImportingMedia( false )
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
									item: post
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

	useEffect( () => {
		if ( action ) {
			createPost()
		}
	}, [ action ] )

	return (
		<>
			<select
				value={ '' }
				onChange={ e => setAction( e.target.value ) }
				disabled={ action }
			>
				<option value=''>
					{ ! importingMedia && ! action && __( 'Create New...' ) }
					{ ! importingMedia && 'create' === action && __( 'Creating...' ) }
					{ ! importingMedia && 'import' === action && __( 'Importing...' ) }
					{ importingMedia && __( 'Importing media...' ) }
				</option>
				<option value='create'>{ __( 'Create and Edit' ) }</option>
				<option value='import'>{ __( 'Import' ) }</option>
			</select>
		</>
	)
}

// const SyncSettings = ( { item } ) => {
// 	const { currentPageView } = getSystemConfig()
// 	const { intro, name, type, isSingular } = currentPageView
//
// 	if ( ! isSingular ) {
// 		return (
// 			<div>
// 				{ __( 'Syncing is currently not available. To sync this library item, navigate to the post or page you\'d like to sync.' ) }
// 			</div>
// 		)
// 	}
//
// 	return (
// 		<div className='fl-asst-library-item-syncing'>
// 			<div style={ { marginBottom: 'var(--fluid-med-space)' } }>
// 				<strong>{ intro }:</strong> { name }
// 			</div>
// 			<div style={ { marginBottom: 'var(--fluid-lg-space)' } }>
// 				{ sprintf(
// 					__( 'Updating the library item will replace its content with the current %s. Updating the %s will replace its content with the library item.' ),
// 					type.toLowerCase(),
// 					type.toLowerCase()
// 				) }
// 			</div>
// 			<Button.Group appearance='grid'>
// 				<SyncLibraryItemButton item={ item } />
// 				<SyncPostButton item={ item } />
// 			</Button.Group>
// 		</div>
// 	)
// }
//
// const SyncPostButton = ( { item } ) => {
// 	const { currentPageView } = getSystemConfig()
// 	const { id, type } = currentPageView
// 	const [ syncing, setSyncing ] = useState( false )
// 	const { createNotice } = Libraries.ItemContext.use()
// 	const librariesApi = getWpRest().libraries()
// 	const importPostMedia = usePostMediaImport()
//
// 	const syncPost = () => {
// 		const message = sprintf( __( 'Do you really want to sync and replace the current %s with this library item? This cannot be undone.' ), type.toLowerCase() )
//
// 		if ( ! confirm( message ) ) {
// 			return
// 		}
//
// 		setSyncing( 'content' )
//
// 		librariesApi.syncPost( id, item ).then( response => {
// 			setSyncing( 'media' )
// 			importPostMedia( response.data, item ).then( () => {
// 				syncPostComplete( response.data )
// 			} )
// 		} ).catch( () => {
// 			syncPostComplete()
// 		} )
// 	}
//
// 	const syncPostComplete = ( post ) => {
// 		setSyncing( false )
//
// 		if ( ! post || post.error ) {
// 			createNotice( {
// 				status: 'error',
// 				content: __( 'Error syncing content.' )
// 			} )
// 		} else {
// 			createNotice( {
// 				status: 'success',
// 				content: __( 'Content replaced!' )
// 			} )
// 			window.location.reload()
// 		}
// 	}
//
// 	return (
// 		<Button onClick={ syncPost } disabled={ syncing }>
// 			<Icon.Download />
// 			{ ! syncing && sprintf( __( 'Update %s' ), type ) }
// 			{ 'content' === syncing && __( 'Syncing content...' ) }
// 			{ 'media' === syncing && __( 'Syncing media...' ) }
// 		</Button>
// 	)
// }
