import React, { forwardRef, useRef, useImperativeHandle, useState, useEffect } from 'react'
import { __ } from '@wordpress/i18n'
import { Modal, Layout } from 'ui'
import { getSystemConfig, useSystemState } from 'data'
import { getWpRest } from 'utils/wordpress'
import cloud from 'cloud'

export const useLibrarySaveAction = ( {
	type,
	history,
	item,
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
				type={ type }
				item={ item }
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
					selectRef.current.save( response => {
						setSaving( false )
						createNotice( {
							status: 'success',
							content: (
								<LibrarySuccessMessage
									response={ response.data ? response.data : response }
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

const LibrarySelect = forwardRef( ( { type, item, CloudUI }, ref ) => {
	const [ libraries, setLibraries ] = useState( null )
	const [ teams, setTeams ] = useState( null )
	const [ library, setLibrary ] = useState( '' )
	const uploader = CloudUI.Uploader.useLibrary( parseInt( library ) )
	const wpRest = getWpRest()

	const savePost = ( success, error ) => {
		uploader.addFile( {
			id: item.id,
			name: item.title,
			type: 'post',
			thumbnail: item.thumbnail,
			previewUrl: item.previewUrl,
			onComplete: success,
			onError: error
		} )
	}

	const saveCode = ( success, error ) => {
		uploader.addFile( {
			type: 'code',
			name: item.title,
			extension: 'JavaScript' === item.subtype ? 'js' : 'css',
			content: item.code,
			onComplete: success,
			onError: error,
			...( item.description !== '' && { description: item.description } )
		} )
	}

	const saveAttachment = ( success, error ) => {
		wpRest.libraries().exportImage( item.id, library )
			.then( success )
			.catch( error )
	}

	const save = ( success = () => {}, error = () => {} ) => {

		if ( 'post' === type ) {
			savePost( success, error )
		} else if ( 'attachment' === type ) {
			saveAttachment( success, error )
		} else if ( 'code' === type ) {
			saveCode( success, error )
		}
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
		save
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
			<div>{ __( 'Select a library below to save this content.' ) }</div>
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
