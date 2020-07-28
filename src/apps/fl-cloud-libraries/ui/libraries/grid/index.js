import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { __ } from '@wordpress/i18n'
import { Button, Icon, Layout } from 'assistant/ui'
import { getAppHooks } from 'assistant/data'
import cloud from 'assistant/cloud'

export default ( {
	headline = '',
	team = null,
	query = null,
} ) => {
	const history = useHistory()
	const teamId = team ? team.id : 0
	const [ showAll, setShowAll ] = useState( false )
	const { useLibraries } = getAppHooks( 'fl-cloud-libraries' )
	const [ libraries, setLibraries ] = useLibraries()
	const ownerLibraries = libraries[ teamId ]

	const canAddNew = team ? team.user_permissions.update : true
	const [ isAddingNew, setIsAddingNew ] = useState( false )
	const [ newName, setNewName ] = useState( '' )
	const [ loading, setLoading ] = useState()

	const createLibrary = () => {
		if ( ! newName ) {
			return
		}
		const data = {
			name: newName,
			team_id: teamId
		}
		setNewName( '' )
		setIsAddingNew( false )
		setLoading( true )
		cloud.libraries.create( data ).then( response => {
			ownerLibraries.unshift( response.data )
			setLibraries( { ...libraries, [ teamId ]: ownerLibraries } )
		} ).catch( error => {
			alert( __( 'Something went wrong. Please try again.' ) )
		} ).finally( () => {
			setLoading( false )
		} )
	}

	const getVisibleLibraries = () => {
		return showAll ? ownerLibraries : [ ...ownerLibraries ].splice( 0, 4 )
	}

	return (
		<Layout.Box
			className='fl-asst-libraries-grid'
			padX={ false }
			padY={ false }
		>
			{ ! isAddingNew &&
				<Layout.Toolbar>
					<Layout.Headline>
						{ headline }
					</Layout.Headline>
					{ loading &&
						<Icon.Loading
							style={ {
								marginLeft: 'auto'
							} }
						/>
					}
					{ canAddNew && ! loading &&
						<Button
							appearance='transparent'
							onClick={ () => setIsAddingNew( true ) }
							style={ {
								marginLeft: 'auto'
							} }
						>
							<Icon.Plus />
						</Button>
					}
				</Layout.Toolbar>
			}

			{ isAddingNew &&
				<Layout.Toolbar>
					<input
						type='text'
						placeholder={ __( 'New Library Name' ) }
						value={ newName }
						onChange={ e => setNewName( e.target.value ) }
					/>
					<Button
						onClick={ createLibrary }
						style={ {
							marginLeft: 'var(--fluid-sm-space)'
						} }
					>
						<Icon.Plus />
					</Button>
					<Button
						onClick={ () => setIsAddingNew( false ) }
					>
						<Icon.Close />
					</Button>
				</Layout.Toolbar>
			}

			{ ownerLibraries && 0 === ownerLibraries.length &&
				<Layout.Box style={ { textAlign: 'center' } }>
					{ __( 'No libraries found.' ) }
				</Layout.Box>
			}

			{ ownerLibraries && 0 !== ownerLibraries.length &&
				<Layout.Box style={ {
					flexDirection: 'row',
					flexWrap: 'wrap',
					padding: 0,
				} }>
					{ getVisibleLibraries().map( ( library, i ) =>
						<Layout.Box
							key={ i }
							style={ {
								width: '50%',
								cursor: 'pointer'
							} }
							onClick={ () => history.push( `/fl-cloud-libraries/${ library.id }` ) }
						>
							<Layout.AspectBox>
								{ library.thumb && <img src={ library.thumb } /> }
							</Layout.AspectBox>
							<Layout.Box style={ {
								textAlign: 'center'
							} }>
								{ library.name }
							</Layout.Box>
						</Layout.Box>
					) }
				</Layout.Box>
			}

			{ ownerLibraries && ownerLibraries.length > 4 &&
				<Layout.Box style={ {
					paddingTop: 0,
				} }>
					<Button
						appearance='transparent'
						onClick={ () => setShowAll( ! showAll ) }
					>
						{ showAll ? __( 'Show Less' ) :  __( 'Show All' ) }
					</Button>
				</Layout.Box>
			}
		</Layout.Box>
	)
}
