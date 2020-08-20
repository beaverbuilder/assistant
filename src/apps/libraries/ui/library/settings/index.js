import React from 'react'
import { useHistory } from 'react-router-dom'
import { __ } from '@wordpress/i18n'
import { Libraries } from '@beaverbuilder/cloud-ui'
import { Button, Form, Layout, Page } from 'assistant/ui'
import { useAppState, getAppActions } from 'assistant/data'
import cloud from 'assistant/cloud'
import LibraryCollections from './collections'

export default () => {
	const history = useHistory()
	useAppState( 'libraries', 'libraries' ) // @TODO Still needed? "libraries" variable was unused
	const { updateLibrary, removeLibrary } = getAppActions( 'libraries' )
	const { library, setLibrary } = Libraries.LibraryContext.use()

	const fields = {
		name: {
			label: __( 'Name' ),
			component: 'text',
			validate: ( { value, setError } ) => {
				if ( '' === value ) {
					setError( __( 'Please enter a name.' ) )
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
			accept: 'image/jpg,image/png,image/gif'
		},
	}

	const onSubmit = ( { values, setErrors } ) => {
		const { name, description, thumb } = values
		const data = new FormData()

		data.append( 'name', name )
		data.append( 'description', description ? description : '' )

		if ( thumb && thumb instanceof File ) {
			data.append( 'media[thumb]', thumb )
		} else if ( ! thumb ) {
			data.append( 'media[thumb]', null )
		}

		return cloud.libraries.update( library.id, data ).then( response => {
			updateLibrary( response.data )
			setLibrary( response.data )
		} ).catch( error => {
			setErrors( error.response.data.errors )
		} )
	}

	const getDefaults = () => {
		const { name, description, media } = library
		const defaults = {
			name,
			description: description ? description : ''
		}

		if ( media.thumb && 'library' === media.thumb.model_type ) {
			defaults.thumb = media.thumb.sizes.thumb.url
		}

		return defaults
	}

	const {
		renderForm,
		submitForm,
		isSubmitting,
		hasChanges
	} = Form.useForm( {
		fields,
		onSubmit,
		defaults: getDefaults(),
	} )

	const deleteLibrary = () => {
		if ( confirm( __( 'Do you really want to delete this library?' ) ) ) {
			cloud.libraries.delete( library.id )
			removeLibrary( library.id )
			history.replace( '/libraries' )
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
