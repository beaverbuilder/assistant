import React, { useState, useEffect } from 'react'
import { __ } from '@wordpress/i18n'
import { Modal, Layout } from 'ui'
import { getSystemConfig, useSystemState } from 'data'
import cloud from 'cloud'

const LibrarySelect = ( {
	onChange = () => {}
} ) => {
	const [ library, setLibrary ] = useState( null )
	const [ libraries, setLibraries ] = useState( null )
	const [ teams, setTeams ] = useState( null )

	useEffect( () => {
		cloud.libraries.getAllSortedByOwner().then( response => {
			setLibraries( response )
		} )
		cloud.teams.getAll().then( response => {
			setTeams( response.data )
		} )
	}, [] )

	if ( ! libraries || ! teams ) {
		return (
			<Layout.Box padX={ false } style={ { alignItems: 'center' } }>
				<Layout.Loading />
			</Layout.Box>
		)
	}

	return (
		<Layout.Box padX={ false } >
			<select
				value={ library }
				onChange={ e => {
					setLibrary( e.target.value )
					onChange( e.target.value )
				} }
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
	)
}

export const getLibrarySaveAction = () => {
	const { cloudConfig } = getSystemConfig()
	const { isCloudConnected } = useSystemState()
	const [ library, setLibrary ] = useState( null )

	const [ showLibraryDialog, SaveDialog ] = Modal.useDialog( {
		title: __( 'Save to Library' ),
		message: (
			<>
				<div>{ __( 'Select a library below to save this post.' ) }</div>
				<LibrarySelect onChange={ library => setLibrary( library ) } />
			</>
		),
		buttons: [
			{
				label: __( 'Cancel' ),
				onClick: ( { closeDialog } ) => closeDialog()
			},
			{
				label: __( 'Save to Library' ),
				onClick: () => {},
				isSelected: true
			}
		]
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
		if ( isCloudConnected ) {
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
