import React, { forwardRef, useRef, useImperativeHandle, useState, useEffect } from 'react'
import { __ } from '@wordpress/i18n'
import { Modal, Layout } from 'ui'
import { getSystemConfig, useSystemState } from 'data'
import cloud from 'cloud'

export const useLibrarySaveAction = ( {
	history,
	values,
	createNotice,
	CloudUI
} ) => {
	const { cloudConfig } = getSystemConfig()
	const { isCloudConnected } = useSystemState()
	const [ saving, setSaving ] = useState( false )
	const selectRef = useRef()

	const [ showLibraryDialog, SaveDialog ] = Modal.useDialog( {
		title: __( 'Save to Library' ),
		message: (
			<LibrarySelect
				ref={ selectRef }
				post={ values }
				CloudUI={ CloudUI }
			/>
		),
		buttons: [
			{
				label: __( 'Cancel' ),
				onClick: ( { closeDialog } ) => closeDialog()
			},
			{
				label: __( 'Save to Library' ),
				onClick: ( { closeDialog } ) => {
					if ( ! selectRef.current.library ) {
						return
					}
					closeDialog()
					showSavingDialog()
					setSaving( true )
					selectRef.current.savePost( response => {
						setSaving( false )
						createNotice( {
							status: 'success',
							content: (
								<LibrarySuccessMessage
									response={ response }
									history={ history }
								/>
							)
						} )
					}, () => {
						setSaving( false )
						createNotice( {
							status: 'error',
							content: __( 'Error saving content.' )
						} )
					} )
				},
				isSelected: true
			}
		]
	} )

	const [ showSavingDialog, SavingDialog ] = Modal.useDialog( {
		title: __( 'Saving...' ),
		message: __( 'Please wait while your content is saved to Assistant Pro.' ),
		buttons: []
	} )

	const [ showConnectDialog, ConnectDialog ] = Modal.useDialog( {
		title: __( 'Connect to Assistant Pro' ),
		message: __( 'Libraries require a connection to Assistant Pro. Would you like to connect now?' ),
		buttons: [
			{
				label: __( 'Cancel' ),
				onClick: ( { closeDialog } ) => closeDialog()
			},
			{
				label: __( 'Connect' ),
				onClick: () => {
					const redirect = encodeURIComponent( window.location )
					window.location.href = `${ cloudConfig.appUrl }/login/connect?redirect=${ redirect }`
				},
				isSelected: true
			}
		]
	} )

	const saveToLibrary = () => {
		if ( isCloudConnected ) {
			showLibraryDialog()
		} else {
			showConnectDialog()
		}
	}

	const LibraryDialog = () => {
		if ( saving ) {
			return <SavingDialog />
		} else if ( isCloudConnected ) {
			return <SaveDialog />
		} else {
			return <ConnectDialog />
		}
	}

	return {
		saveToLibrary,
		LibraryDialog
	}
}

const LibrarySuccessMessage = ( { history, response } ) => {
	return (
		<>
			{ __( 'Content saved!' ) }
			<a
				style={ {
					textDecoration: 'underline',
					marginLeft: 'var(--fluid-sm-space)'
				} }
				onClick={ () => {
					history.push( `/libraries/${ response.library_id }` )
				} }
			>
				{ __( 'View library.' ) }
			</a>
		</>
	)
}

const LibrarySelect = forwardRef( ( { post, CloudUI }, ref ) => {
	const [ libraries, setLibraries ] = useState( null )
	const [ teams, setTeams ] = useState( null )
	const [ library, setLibrary ] = useState( '' )
	const uploader = CloudUI.Uploader.useLibrary( parseInt( library ) )

	const savePost = ( success = () => {}, error = () => {} ) => {
		uploader.addFile( {
			id: post.id,
			name: post.title,
			type: 'post',
			thumbnail: post.thumbnail,
			previewUrl: post.previewUrl,
			onComplete: success,
			onError: error
		} )
	}

	useEffect( () => {
		cloud.libraries.getAllSortedByOwner().then( response => {
			setLibraries( response )
		} )
		cloud.teams.getAll().then( response => {
			setTeams( response.data )
		} )
	}, [] )

	useImperativeHandle( ref, () => ( {
		library,
		savePost
	} ) )

	if ( ! libraries || ! teams ) {
		return (
			<Layout.Box padX={ false } style={ { alignItems: 'center' } }>
				<Layout.Loading />
			</Layout.Box>
		)
	}

	return (
		<>
			<div>{ __( 'Select a library below to save this post.' ) }</div>
			<Layout.Box padX={ false } >
				<select
					value={ library }
					onChange={ e => setLibrary( e.target.value ) }
				>
					<option value=''>{ __( 'Choose...' ) }</option>
					{ libraries.user &&
						<optgroup label={ __( 'Your Libraries' ) }>
							{ libraries.user.map( ( { id, name }, i ) =>
								<option key={ i } value={ id }>{ name }</option>
							) }
						</optgroup>
					}
					{ libraries.shared &&
						<optgroup label={ __( 'Shared Libraries' ) }>
							{ libraries.shared.map( ( { id, name, permissions }, i ) => {
								if ( ! permissions.edit_items ) {
									return null
								}
								return <option key={ i } value={ id }>{ name }</option>
							} ) }
						</optgroup>
					}
					{ teams.map( ( { id, name }, i ) =>
						<optgroup key={ i } label={ name }>
							{ libraries.team[ id ] && libraries.team[ id ].map( ( { id, name, permissions }, i ) => {
								if ( ! permissions.edit_items ) {
									return null
								}
								return <option key={ i } value={ id }>{ name }</option>
							} ) }
						</optgroup>
					) }
				</select>
			</Layout.Box>
		</>
	)
} )
