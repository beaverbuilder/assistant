import React from 'react'
import { useHistory } from 'react-router-dom'
import { __ } from '@wordpress/i18n'
import { Button, Form, Layout, Page } from 'assistant/ui'
import { getAppHooks } from 'assistant/data'
import cloud from 'assistant/cloud'

import LibraryContext from '../context'
import LibraryCollections from './collections'

export default () => {
	const history = useHistory()
	const { useLibraries } = getAppHooks( 'fl-cloud-libraries' )
	const [ libraries, setLibraries ] = useLibraries()
	const { library, setLibrary } = LibraryContext.use()

	const fields = {
		name: {
			label: __( 'Name' ),
			component: 'text',
			validate: ( value, errors ) => {
				if ( '' === value ) {
					errors.push( __( 'Please enter a name.' ) )
				}
			}
		},
		description: {
			label: __( 'Description' ),
			component: 'text',
		},
		thumb: {
			label: __( 'Featured Image' ),
			component: 'file',
		},
	}

	const onSubmit = ( { values, setErrors } ) => {
		return cloud.libraries.update( library.id, values ).then( response => {
			const library = response.data
			const owner = 'team' === library.owner_type ? library.owner_id : 0
			setLibraries( {
				...libraries,
				[ owner ]: libraries[ owner ].map( entry => entry.id === library.id ? library : entry )
			} )
			setLibrary( library )
		} ).catch( error => {
			setErrors( error.response.data.errors )
		} )
	}

	const {
		renderForm,
		submitForm,
		isSubmitting,
		hasChanges
	} = Form.useForm( {
		fields,
		onSubmit,
		defaults: library,
	} )

	const deleteLibrary = () => {
		if ( confirm( __( 'Do you really want to delete this library?' ) ) ) {
			cloud.libraries.delete( library.id )
			const owner = 'team' === library.owner_type ? library.owner_id : 0
			setLibraries( {
				...libraries,
				[ owner ]: libraries[ owner ].filter( entry => entry.id !== library.id )
			} )
			history.replace( '/fl-cloud-libraries' )
		}
	}

	return (
		<>
			<Layout.Box padY={ false }>
				<Page.Section label={ __( 'Library Settings' ) }>
					{ renderForm() }
					{ hasChanges &&
						<Button onClick={ submitForm } disabled={ isSubmitting }>
							{ __( 'Update Library' ) }
						</Button>
					}
				</Page.Section>
			</Layout.Box>

			<LibraryCollections library={ library } />

			{ library.permissions.delete &&
				<Layout.Box>
					<Page.Section label={ __( 'Danger Zone' ) }>
						<Layout.Headline>{ __( 'Delete This Library' ) }</Layout.Headline>
						<p style={ { margin: '0' } }>{ __( 'Once a library has been deleted, it is gone forever. Please be sure you want to delete this library.' ) }</p>
					</Page.Section>
					<Button onClick={ deleteLibrary } status='destructive'>Delete Library</Button>
				</Layout.Box>
			}
		</>
	)
}
