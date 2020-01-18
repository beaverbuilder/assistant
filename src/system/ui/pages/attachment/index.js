import React from 'react'
import { __ } from '@wordpress/i18n'
import { Page, Form, Button } from 'ui'
import { getSrcSet } from 'utils/image'
import { getWpRest } from 'utils/wordpress'
import { getSystemActions } from 'data'

export const Attachment = ( { location, history } ) => {
	const { item } = location.state
	const srcSet = getSrcSet( item.sizes )
	const wpRest = getWpRest()
	const { setCurrentHistoryState } = getSystemActions()
	const {
		id,
		title,
		description,
		type,
		subtype,
		filesize,
		date
	} = item


	const onSubmit = ( { changed, ids } ) => {

		const data = {
			meta: {},
		}
		for ( let key in changed ) {
			if ( ! ids[key] ) {
				continue
			}
			data[ids[key]] = changed[key]
		}



		if ( 'title' in changed ) {
			item.title = changed.title
		}

		if ( 'alt' in changed ) {
			item.alt = changed.alt
		}

		if ( 'description' in changed ) {
			item.description = changed.description
		}

		const handleError = error => {
			setIsSubmitting( false )
			alert( __( 'Error: Changes not saved! Please try again.' ) )
			if ( error ) {
				console.log( error ) // eslint-disable-line no-console
			}
		}

		wpRest.attachments().update( id, 'data', data ).then( response => {
			const { data } = response
			console.log(data.error)
			if ( data.error ) {
				handleError()
			} else {
				setCurrentHistoryState( { item } )
				setIsSubmitting( false )
				alert( __( 'Changes Saved!' ) )
			}
		} ).catch( error => {
			handleError( error )
		} )

	}

	const deleteAttchment = () => {
		if ( confirm( __( 'Do you really want to delete this media?' ) ) ) {
			wpRest.attachments().update( id, 'trash' ).then( () => {
				alert( 'Media permanently deleted!' )
			} )
			history.goBack()
		}
	}

	const sections = {
		labels: {
			label: __( 'Labels' ),
			fields: {
				labels: {
					component: 'labels',
					alwaysCommit: true,
					onAdd: label => {
						wpRest.notations().createLabel( 'post', item.id, label.id )
					},
					onRemove: label => {
						wpRest.notations().deleteLabel( 'post', item.id, label.id )
					},
				},
			}
		},
		meta: {
			label: __( 'Metadata' ),
			fields: {
				title: {
					label: __( 'Title' ),
				},
				alt: {
					label: __( 'Alternative Text' ),
				},
				description: {
					label: __( 'Description' ),
					component: 'textarea',
					rows: 2,
				},
				filesize: {
					label: __( 'File size' ),
					component: 'plain-text',
				},
				type: {
					label: __( 'File type' ),
					component: 'plain-text',
				},
				date: {
					label: __( 'Uploaded on' ),
					component: 'plain-text',
				},
			},
		},
		links: {
			label: __( 'Links' ),
			fields: {
				fileUrl: {
					label: __( 'File URL' ),
					component: 'url',
					isVisible: !! item.sizes.full,
				},
				url: {
					label: __( 'URL' ),
					component: 'url',
				},
			},
		},
		actions: {
			label: __( 'Actions' ),
			fields: {
				actions: {
					component: 'actions',
					options: [
						{
							label: __( 'View Attachment' ),
							href: item.url,
						},
						{
							label: __( 'Edit in Admin' ),
							href: item.editUrl,
						},
						{
							label: __( 'Delete' ),
							status:'destructive',
							onClick:deleteAttchment

						},
					]
				}
			}
		}
	}

	const Footer = () => {
		return (
			<>
				<Button
					onClick={ resetForm }
				>{__( 'Cancel' )}</Button>
				<div style={ { flex: '1 1 auto', margin: 'auto' } } />
				<Button type="submit" status="primary" onClick={ submitForm }>{__( 'Save' )}</Button>
			</>
		)
	}

	const defaults = {
		...item,
		fileUrl: item.sizes.full ? item.sizes.full.url : null,
		type: type+'/'+subtype
	}

	const { hasChanges, resetForm, setIsSubmitting, submitForm, renderForm } = Form.useForm( {
		sections,
		onSubmit,
		defaults,
	} )

	const Hero = () => <img src={ item.thumbnail } srcSet={ srcSet } />

	return (
		<Page title={ __( 'Attachment' ) } hero={ <Hero /> } footer={ hasChanges && <Footer /> }>
			{ renderForm() }
		</Page>
	)
}
