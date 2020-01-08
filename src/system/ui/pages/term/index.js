import React from 'react'
import { __ } from '@wordpress/i18n'
import { Page, Form, Button } from 'ui'
import { getWpRest } from 'utils/wordpress'
import { getSystemActions } from 'data'

export const Term = ( { location } ) => {
	const { item } = location.state
	const wpRest = getWpRest()
	const { setCurrentHistoryState } = getSystemActions()
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

		if ( 'description' in changed ) {
			item.description = changed.description
		}

		if ( 'title' in changed ) {
			item.title = changed.title
			data.name = changed.title
		}

		if ( 'slug' in changed ) {
			item.slug = changed.slug
		}

		const handleError = error => {
			setIsSubmitting( false )
			alert( __( 'Error: Changes not saved! Please try again.' ) )
			if ( error ) {
				console.log( error ) // eslint-disable-line no-console
			}
		}

		wpRest.terms().update( item.id, 'data', data ).then( response => {
			const { data } = response
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

	const { form, useFormContext, hasChanges, resetForm, submitForm, setIsSubmitting } = Form.useFormData( {
		title: {
			label: __( 'Name' ),
			labelPlacement: 'beside',
			component: 'text',
		},
		slug: {
			label: __( 'Slug' ),
			labelPlacement: 'beside',
			component: 'text',
		},
		parent: {
			label: __( 'Parent' ),
			labelPlacement: 'beside',
			options: {
				'': __( 'None' ),
			},
		},
		description: {
			label: __( 'Description' ),
			labelPlacement: 'beside',
			component: 'textarea',
			rows: 6,
		},
	}, { onSubmit }, item )

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
	return (
		<Page.NewPage title={ __( 'Edit Term' ) } padX={ true } footer={ hasChanges && <Footer /> }>
			<Form { ...form }>
				<Page.RegisteredSections
					location={ { type: 'term' } }
					data={ { useFormData: useFormContext } }
				/>
			</Form>
		</Page.NewPage >
	)
}
