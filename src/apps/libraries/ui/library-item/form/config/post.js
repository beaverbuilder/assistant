import React, { useEffect, useState } from 'react'
import { __, sprintf } from '@wordpress/i18n'
import { Libraries } from '@beaverbuilder/cloud-ui'
import { Button, Modal } from 'assistant/ui'
import { getSystemConfig } from 'assistant/data'
import { getWpRest } from 'assistant/utils/wordpress'
import { usePostMediaImport } from 'ui/library/use-post-media-import'

export const getActions = ( item, actions ) => {
	const { library } = Libraries.LibraryContext.use()

	actions.unshift( {
		component: <PreviewButton item={ item } />
	} )

	actions.unshift( {
		component: <UpdateButton item={ item } />,
		shouldRender: library.permissions.edit_items
	} )

	actions.unshift( {
		component: <ImportButton item={ item } />
	} )

	return actions
}

const PreviewButton = ( { item } ) => {
	const { createNotice } = Libraries.ItemContext.use()
	const [ previewing, setPreviewing ] = useState( false )
	const librariesApi = getWpRest().libraries()

	const previewPost = () => {
		setPreviewing( true )

		librariesApi.previewPost( item ).then( response => {
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
						content: __( 'Library item updated!' ),
						shouldDismiss: false,
					} )
				} ).catch( () => {
					createNotice( {
						status: 'error',
						content: __( 'Error updating library item.' ),
						shouldDismiss: false,
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

const ImportButton = ( { item } ) => {
	const { currentPageView, contentTypes } = getSystemConfig()
	const { createNotice } = Libraries.ItemContext.use()
	const [ action, setAction ] = useState( null )
	const [ importingMedia, setImportingMedia ] = useState( false )
	const librariesApi = getWpRest().libraries()
	const importPostMedia = usePostMediaImport()

	const createPost = () => {
		librariesApi.importPost( item ).then( response => {
			setImportingMedia( true )
			importPostMedia( response.data, item ).then( createPostComplete )
		} ).catch( () => {
			setAction( null )
			setImportingMedia( false )
			createNotice( {
				status: 'error',
				content: __( 'Error importing library item.' )
			} )
		} )
	}

	const createPostComplete = ( post ) => {
		const { editUrl, type } = post
		const label = contentTypes[ type ] ? contentTypes[ type ].labels.singular : __( 'Content' )

		setAction( null )
		setImportingMedia( false )

		if ( post.error ) {
			createNotice( {
				status: 'error',
				shouldDismiss: false,
				content: __( 'Error importing library item.' )
			} )
		} else {
			createNotice( {
				status: 'success',
				shouldDismiss: false,
				content: (
					<>
						{ __( 'Library item imported!' ) }
						{ editUrl &&
							<a
								style={ {
									textDecoration: 'underline',
									marginLeft: 'var(--fluid-sm-space)'
								} }
								onClick={ () => {
									window.location.href = editUrl
								} }
							>
								{ sprintf( __( 'Edit %s.' ), label ) }
							</a>
						}
					</>
				)
			} )
		}
	}

	const replacePost = () => {
		if ( ! currentPageView.isSingular ) {
			alert( __( 'Replacing is currently not available. Navigate to the post or page you\'d like to replace and click the import button again.' ) )
			setAction( null )
			return
		}

		const message = sprintf( __( 'Do you really want to replace the current %s with this library item? This cannot be undone.' ), currentPageView.type.toLowerCase() )

		if ( ! confirm( message ) ) {
			setAction( null )
			return
		}

		librariesApi.syncPost( currentPageView.id, item ).then( response => {
			setImportingMedia( true )
			importPostMedia( response.data, item ).then( () => {
				replacePostComplete( response.data )
			} )
		} ).catch( () => {
			replacePostComplete()
		} )
	}

	const replacePostComplete = ( post ) => {
		setAction( null )
		setImportingMedia( false )

		if ( ! post || post.error ) {
			createNotice( {
				status: 'error',
				shouldDismiss: false,
				content: sprintf( __( 'Error replacing %s.' ), currentPageView.type.toLowerCase() )
			} )
		} else {
			createNotice( {
				status: 'success',
				shouldDismiss: false,
				content: sprintf( __( '%s replaced!' ), currentPageView.type )
			} )
			window.location.reload()
		}
	}

	useEffect( () => {
		if ( 'create' === action ) {
			createPost()
		} else if ( 'replace' === action ) {
			replacePost()
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
					{ ! importingMedia && ! action && __( 'Import...' ) }
					{ ! importingMedia && action && __( 'Importing...' ) }
					{ importingMedia && __( 'Importing media...' ) }
				</option>
				<option value='create'>{ __( 'Create New' ) }</option>
				<option value='replace'>
					{
						currentPageView.isSingular ?
							sprintf( __( 'Replace Current %s' ), currentPageView.type ) :
							__( 'Replace Current Page' )
					}
				</option>
			</select>
		</>
	)
}
