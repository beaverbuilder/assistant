import React, { useEffect, useState } from 'react'
import { __ } from '@wordpress/i18n'
import { LibraryNav, formatItem, formatSection } from '@beaverbuilder/cloud-ui'
import { Page, Button, Icon } from 'assistant/ui'
import { getSystemActions, getAppActions, useAppState, useSystemState } from 'assistant/data'
import cloud from 'assistant/cloud'
import Actions from './actions'

const getSections = ( user, teams, libraries, folders, folderHandlers ) => {

	const getItems = ( type = 'user', id = null ) => {
		const items = id ? libraries[ type ][ id ] : libraries[ type ]
		if ( ! items ) return []
		return items.map( formatItem )
	}

	const getFolders = ( type = 'user', id = null ) => {
		const source = id ? folders?.[ type ]?.[ id ] : folders?.[ type ]
		return source || []
	}

	const getTeamSections = ( teams = [] ) => {
		return teams.map( section => ( {
			...formatSection( section ),
			items: getItems( 'team', section.id ),
			folders: getFolders( 'team', section.id ),
			canCreateLibraries: section.permissions.edit_libraries,
			canManageFolders: section.permissions.edit_libraries,
			headerAccessory: section.permissions.edit_libraries ? (
				<Button
					appearance="transparent"
					size="sm"
					title={ __( 'Create folder' ) }
					style={ { marginRight: 'var(--fluid-sm-space)' } }
					onClick={ e => {
						e.preventDefault()
						e.stopPropagation()
						folderHandlers.createFolder( section.id )
					} }
				>
					<Icon.FolderPlus />
				</Button>
			) : null,
			onRenameFolder: folder => folderHandlers.renameFolder( folder ),
			onDeleteFolder: folder => folderHandlers.deleteFolder( folder ),
			canMoveLibrariesToFolder: section.permissions.edit_libraries,
			onMoveLibraryToFolder: folderHandlers.moveLibraryToFolder,
		} ) )
	}

	const communityLibs = getItems( 'access' )

	const sections = [
		{
			key: 'user',
			label: user ? user.name : '',
			avatar: user?.avatar ? user.avatar.sizes.thumb.url : user?.gravatar?.md,
			to: '/libraries/user',
			items: getItems(),
			folders: getFolders( 'user' ),
			canCreateLibraries: true,
			canManageFolders: true,
			headerAccessory: (
				<Button
					appearance="transparent"
					size="sm"
					title={ __( 'Create folder' ) }
					style={ { marginRight: 'var(--fluid-sm-space)' } }
					onClick={ e => {
						e.preventDefault()
						e.stopPropagation()
						folderHandlers.createFolder()
					} }
				>
					<Icon.FolderPlus />
				</Button>
			),
			onRenameFolder: folder => folderHandlers.renameFolder( folder ),
			onDeleteFolder: folder => folderHandlers.deleteFolder( folder ),
			canMoveLibrariesToFolder: true,
			onMoveLibraryToFolder: folderHandlers.moveLibraryToFolder,
		},
		{
			key: 'shared',
			label: __( 'Shared Libraries' ),
			avatar: <Icon.Shared />,
			to: '/libraries/shared',
			isEnabled: !! libraries?.shared?.length,
			items: getItems( 'shared' ),
			canCreateLibraries: false,
		},
		{
			key: 'community',
			label: __( 'Community Libraries' ),
			avatar: <Icon.Swirl />,
			isEnabled: !! communityLibs.length,
			items: communityLibs,
			canCreateLibraries: false,
		},
		...getTeamSections( teams )
	]

	return sections
}

const useFolderHandlers = ( {
	libraries,
	setLibraries,
	folders,
	setFolders,
	isPreloaded,
} ) => {
	const { createNotice } = getSystemActions()
	const {
		addFolder,
		updateFolder,
		removeFolder,
		updateLibrary,
		setUserLibraries,
		setTeamLibraries,
	} = getAppActions( 'libraries' )

	const createFolder = async ( teamId = null ) => {
		const name = prompt( __( 'New folder name' ) )
		if ( null === name ) {
			return
		}

		const trimmedName = name.trim()
		if ( ! trimmedName ) {
			return
		}

		try {
			const response = await cloud.libraries.createFolder( {
				name: trimmedName,
				team_id: teamId || undefined,
			} )
			const folder = response.data

			if ( isPreloaded ) {
				setFolders( prev => {
					if ( 'team' === folder.owner_type ) {
						return {
							...prev,
							team: {
								...prev.team,
								[ folder.owner_id ]: [
									...( prev.team[ folder.owner_id ] || [] ),
									folder,
								],
							},
						}
					}
					return {
						...prev,
						user: [ ...prev.user, folder ],
					}
				} )
			} else {
				addFolder( folder )
			}
		} catch ( error ) {
			createNotice( {
				status: 'error',
				content: error?.response?.data?.message || __( 'Unable to create folder.' ),
			} )
		}
	}

	const renameFolder = async ( folder ) => {
		const name = prompt( __( 'Rename folder' ), folder.name )
		if ( null === name ) {
			return
		}
		const trimmedName = name.trim()
		if ( ! trimmedName || trimmedName === folder.name ) {
			return
		}

		try {
			const response = await cloud.libraries.renameFolder( folder.id, { name: trimmedName } )
			const updatedFolder = response.data

			if ( isPreloaded ) {
				setFolders( prev => {
					if ( 'team' === updatedFolder.owner_type ) {
						return {
							...prev,
							team: {
								...prev.team,
								[ updatedFolder.owner_id ]: ( prev.team[ updatedFolder.owner_id ] || [] ).map(
									f => f.id === updatedFolder.id ? updatedFolder : f
								),
							},
						}
					}
					return {
						...prev,
						user: prev.user.map( f => f.id === updatedFolder.id ? updatedFolder : f ),
					}
				} )
			} else {
				updateFolder( updatedFolder )
			}
		} catch ( error ) {
			createNotice( {
				status: 'error',
				content: error?.response?.data?.message || __( 'Unable to rename folder.' ),
			} )
		}
	}

	const moveLibraryToFolder = async ( libraryId, folderId, section ) => {
		let library

		if ( 'user' === section.key ) {
			library = libraries.user?.find( l => l.id === libraryId )
		} else if ( section.key?.startsWith( 'team-' ) && section.id ) {
			library = libraries.team?.[ section.id ]?.find( l => l.id === libraryId )
		}

		if ( ! library ) {
			createNotice( {
				status: 'error',
				content: __( 'Library not found.' ),
			} )
			throw new Error( 'Library not found.' )
		}

		if ( ( library.library_folder_id || null ) === ( folderId || null ) ) {
			return
		}

		try {
			const response = await cloud.libraries.update( library.id, {
				name: library.name,
				description: library.description || '',
				visibility: library.visibility || ( library.is_public ? 'public' : 'private' ),
				for_sale: !! library.for_sale,
				price: library.price || 0,
				library_folder_id: folderId,
			} )
			const updatedLibrary = response.data

			if ( isPreloaded ) {
				setLibraries( prev => {
					if ( 'user' === updatedLibrary.owner_type ) {
						return {
							...prev,
							user: prev.user.map( l => l.id === updatedLibrary.id ? updatedLibrary : l ),
						}
					}
					if ( 'team' === updatedLibrary.owner_type ) {
						return {
							...prev,
							team: {
								...prev.team,
								[ updatedLibrary.owner_id ]: ( prev.team[ updatedLibrary.owner_id ] || [] ).map(
									l => l.id === updatedLibrary.id ? updatedLibrary : l
								),
							},
						}
					}
					return prev
				} )
			} else {
				updateLibrary( updatedLibrary )
			}

			return response
		} catch ( error ) {
			createNotice( {
				status: 'error',
				content: error?.response?.data?.message || __( 'Unable to move library to folder.' ),
			} )
			throw error
		}
	}

	const deleteFolder = async ( folder ) => {
		if ( ! confirm( __( 'Do you really want to delete this folder?' ) ) ) {
			return
		}

		try {
			await cloud.libraries.deleteFolder( folder.id )

			if ( isPreloaded ) {
				setFolders( prev => {
					const teamState = { ...prev.team }
					Object.keys( teamState ).forEach( key => {
						teamState[ key ] = teamState[ key ].filter( f => f.id !== folder.id )
					} )
					return {
						user: prev.user.filter( f => f.id !== folder.id ),
						team: teamState,
					}
				} )

				if ( 'team' === folder.owner_type ) {
					setLibraries( prev => ( {
						...prev,
						team: {
							...prev.team,
							[ folder.owner_id ]: ( prev.team[ folder.owner_id ] || [] ).map( library => (
								library.library_folder_id === folder.id
									? { ...library, library_folder_id: null, folder_name: null }
									: library
							) ),
						},
					} ) )
				} else {
					setLibraries( prev => ( {
						...prev,
						user: ( prev.user || [] ).map( library => (
							library.library_folder_id === folder.id
								? { ...library, library_folder_id: null, folder_name: null }
								: library
						) ),
					} ) )
				}
			} else {
				removeFolder( folder.id )

				if ( 'team' === folder.owner_type ) {
					const teamLibraries = libraries.team[ folder.owner_id ] || []
					setTeamLibraries(
						folder.owner_id,
						teamLibraries.map( library => (
							library.library_folder_id === folder.id
								? { ...library, library_folder_id: null, folder_name: null }
								: library
						) )
					)
				} else {
					setUserLibraries(
						( libraries.user || [] ).map( library => (
							library.library_folder_id === folder.id
								? { ...library, library_folder_id: null, folder_name: null }
								: library
						) )
					)
				}
			}
		} catch ( error ) {
			createNotice( {
				status: 'error',
				content: error?.response?.data?.message || __( 'Unable to delete folder.' ),
			} )
		}
	}

	return {
		createFolder,
		renameFolder,
		deleteFolder,
		moveLibraryToFolder,
	}
}

export default ( {
	preloadedLib = false,
	preloadedTeams = false,
	preloadedFolders = false,
	isLoadingLibraries: preloadedLoading = false,
} ) => {
	const { cloudUser } = useSystemState()
	const {
		libraries: storeLibraries,
		teams: storeTeams,
		folders: storeFolders,
		isLoadingLibraries: storeLoading,
	} = useAppState( 'libraries' )

	const isPreloaded = !! preloadedLib
	const [ libraries, setLibraries ] = useState( preloadedLib || null )
	const [ teams, setTeams ] = useState( preloadedTeams || null )
	const [ folders, setFolders ] = useState( preloadedFolders || { user: [], team: {} } )

	useEffect( () => {
		if ( preloadedLib ) {
			setLibraries( preloadedLib )
		}
	}, [ preloadedLib ] )

	useEffect( () => {
		if ( preloadedTeams ) {
			setTeams( preloadedTeams )
		}
	}, [ preloadedTeams ] )

	useEffect( () => {
		if ( preloadedFolders ) {
			setFolders( preloadedFolders )
		}
	}, [ preloadedFolders ] )

	const librariesData = isPreloaded ? libraries : storeLibraries
	const teamsData = isPreloaded ? teams : storeTeams
	const foldersData = isPreloaded ? folders : storeFolders
	const isLoadingLibraries = isPreloaded ? preloadedLoading : storeLoading

	const folderHandlers = useFolderHandlers( {
		libraries: librariesData,
		setLibraries,
		folders: foldersData,
		setFolders,
		isPreloaded,
	} )

	return (
		<Page
			title={ __( 'Libraries' ) }
			icon={ <Icon.Library context="sidebar" /> }
			shouldShowBackButton={ false }
			actions={ <Actions /> }
			padX={ false }
			padY={ false }
		>
			<LibraryNav
				sections={ getSections( cloudUser, teamsData, librariesData, foldersData, folderHandlers ) }
				isLoading={ isLoadingLibraries }
				linkSectionHeaders={ false }
				displayItemsAs="grid"
			/>
		</Page>
	)
}
