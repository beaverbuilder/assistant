import React from 'react'
import { __ } from '@wordpress/i18n'
import { Page, Form, Button } from 'ui'
import { getWpRest } from 'utils/wordpress'
import { getSystemActions } from 'data'


export const Term = ( { location, history } ) => {
	const { item } = location.state
	const {
		id,
		title,
		description,
		slug,
		parent,
		count,
		taxonomy,
		isHierarchical
	} = item
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

		if ( 'parent' in changed ) {
			item.parent = changed.parent
			data.parent = changed.parent
		}

		if ( 'slug' in changed ) {
			item.slug = changed.slug
		}

		const handleError = error => {
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
				alert( __( 'Changes Saved!' ) )
			}
		} ).catch( error => {
			handleError( error )
		} )
	}

	const deleteTerm = () => {
		if ( confirm( __( 'Do you really want to delete this term?' ) ) ) {
			wpRest.terms().update( id, 'trash' ).then( () => {
				alert( 'Term permanently deleted!' )
			} )
			history.goBack()
		}
	}


	const { hasChanges, resetForm, submitForm, renderForm } = Form.useForm( {


		sections: {
			details: {
				label: __( 'Details' ),
				fields: {
					title: {
						label: __( 'Name' ),
						labelPlacement: 'above',
						value: title
					},
					slug: {
						label: __( 'Slug' ),
						labelPlacement: 'above',
						value: slug,
					},
					parent: {
						label: __( 'Parent' ),
						labelPlacement: 'above',
						component: 'parent-terms',
						termId: item.id,
						taxonomy,
						value: parent,
						isVisible: isHierarchical ? true : false

					},
					description: {
						label: __( 'Description' ),
						labelPlacement: 'above',
						value: description,
						component: 'textarea',
						rows: 6,
					},
					count: {
						label: __( 'Post Count' ),
						labelPlacement: 'beside',
						type: 'text',
						component: 'plain-text',
						value: count
					}

				}
			},
			actions: {
				label: __( 'Actions' ),
				fields: {
					actions: {
						component: 'actions',
						options: [
							{
								label: __( 'Edit in Admin' ),
								href: item.editUrl,
							},
							{
								label: __( 'View Archive' ),
								href: item.url,
							},
							{
								label: __( 'Delete' ),
								onClick: deleteTerm,
								status: 'destructive'
							},
						]
					}
				}
			},
		},
		onSubmit,
		defaults: item } )

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
		<Page title={ __( 'Edit Term' ) } padX={ true } footer={ hasChanges && <Footer /> }>

			{renderForm()}

		</Page >
	)
}
