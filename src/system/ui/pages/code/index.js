import React, { useState } from 'react'
import { __ } from '@wordpress/i18n'
import { Page, Form, Layout, Notice, Button } from 'ui'
import { getWpRest } from 'utils/wordpress'
import { getSystemActions, getSystemConfig, useSystemState } from 'data'
import { getCodeActions } from './actions'
import { Location } from './location'
import { Icon } from 'ui'
import './style.scss'

export const Code = ( { location, match, history, CloudUI } ) => {
	const { item } = location.state
	const wpRest = getWpRest()
	const { setCurrentHistoryState } = getSystemActions()
	const { contentTypes } = getSystemConfig()
	const { createNotice } = Notice.useNotices()
	const { appearance } = useSystemState( [ 'appearance' ] )
	const mode = appearance.brightness
	const { id, type, subtype, title, description } = item
	const label = contentTypes[ item.type ].labels.singular

	const onSubmit = ( { changed, ids, setValue } ) => {

		const data = {
			meta: {},
		}

		if ( 'code' in changed ) {
			data.meta._fl_asst_code = changed.code
			item.code = changed.code
		}

		if ( 'title' in changed ) {
			item.title = changed.title
			data.post_title = changed.title
		}

		if ( 'description' in changed ) {
			item.description = changed.description
			data.post_content = changed.description
		}

		if ( 'enable' in changed ) {
			data.meta._fl_asst_enable = changed.enable
			item.enable = changed.enable
		}

		if ( 'location' in changed ) {
			data.meta._fl_asst_code_locations = changed.location
			item.locations = changed.location
		}

		const handleError = error => {
			createNotice( {
				id: 'update-error',
				status: 'error',
				content: __( 'Error saving! Please try again.' )
			} )
			if ( error ) {
				console.log( error ) // eslint-disable-line no-console
			}
		}

		return wpRest
			.posts()
			.update( id, 'data', data )
			.then( response => {
				const { data } = response
				if ( data.error ) {
					handleError()
				} else {
					setCurrentHistoryState( { item } )
					createNotice( {
						id: 'update-success',
						status: 'success',
						content: __( 'Changes saved!' )
					} )
				}
			} )
			.catch( error => {
				handleError( error )
			} )
	}

	const sections = {
		meta: {
			fields: {
				title: {
					label: __( 'Title' ),
					id: 'post_title',
					component: 'text',
				},
				description: {
					label: __( 'Description' ),
					id: 'post_content',
					component: 'textarea',
					rows: 4,
				},
				code: {
					width: '400px',
					height: '500px',
					mode: mode,
					extension: 'JavaScript' === subtype ? 'js' : 'css',
					component: 'code-editor',
					preview: true,
					className: 'fl-asst-code-editor'
				},
			},
		},
		locations: {
			label: __( 'Location' ),
			fields: {
				enable: {
					component: ( { value, onChange } ) => {
						return (
							<Form.Item label={ __( 'Status' ) } labelPlacement="beside">
								<Layout.Row gap={ 5 }>
									<Button
										isSelected={ '1' === value }
										appearance="transparent"
										onClick={ () => onChange( '1' ) }
									>
										{ __( 'Enable' ) }
									</Button>
									<Button
										isSelected={ '1' !== value }
										appearance="transparent"
										onClick={ () => onChange( '' ) }
									>
										{ __( 'Disable' ) }
									</Button>
								</Layout.Row>
							</Form.Item>
						)
					}
				},
				location: {
					component: ( { value, onChange } ) => {
						return (
							<Location
								item={ item }
								onChange={ newValue => {
									onChange( { ...newValue } )
								} }
							/>
						)
					}
				},
			},
		},
		actions: {
			label: __( 'Actions' ),
			fields: {
				actions: {
					component: 'actions',
					options: args => getCodeActions( { history, createNotice, CloudUI, ...args } ),
				},
			}
		},
	}

	const defaults = {
		...item,
		type: type
	}

	const {
		hasChanges,
		submitForm,
		renderForm,
		values,
	} = Form.useForm( {
		sections,
		onSubmit,
		defaults,
	} )

	const ToolbarActions = () => {
		return (
			<>
				<Button
					disabled={ ! hasChanges }
					isSelected={ hasChanges }
					onClick={ submitForm }
				>
					{ hasChanges ? __( 'Update' ) : __( 'Saved' ) }
				</Button>
			</>
		)
	}

	return (
		<Page.Detail
			id="fl-asst-code-detail"
			toolbarTitle={ sprintf( __( 'Edit %s' ), label ) }
			toolbarActions={ <ToolbarActions /> }
			className={ hasChanges ? 'fl-asst-code-update' : 'fl-asst-code-save' }
		>
			{ renderForm() }
		</Page.Detail>
	)
}
