import React, { useMemo } from 'react'
import { __ } from '@wordpress/i18n'
import { Page, Nav, Button, Form } from 'ui'
import { getSystemConfig } from 'data'
import { getWpRest } from 'utils/wordpress'
import { createSlug } from 'utils/url'
import { getPostActions } from './actions'
import { setParentOptions } from './parent'

export const Post = ( { location, match, history } ) => {

	const defaultItem = {
		author: null,
		bbBranding: null,
		bbCanEdit: true,
		bbEditUrl: null,
		bbIsEnabled: null,
		isFavorite: false,
		commentsAllowed: null,
		content: null,
		date: null,
		editUrl: null,
		id: null,
		meta: null,
		parent: 0,
		slug: null,
		status: null,
		thumbnail: null,
		title: null,
		type: 'post',
		url: null,
		visibility: 'Public',
	}

	let item = defaultItem
	if ( 'undefined' !== typeof location.state && 'undefined' !== typeof location.state.item ) {
		item = { ...defaultItem, ...location.state.item }
	}

	const { contentTypes, contentStatus } = getSystemConfig()
	const { isHierarchical, labels, supports, templates } = contentTypes[ item.type ]
	const wpRest = getWpRest()

	const tabs = {
		general: {
			label: __( 'General' ),
			path: match.url,
			exact: true,
			sections: {
				labels: {
					label: __( 'Labels' ),
					fields: {
						labels: {
							component: Form.LabelsItem,
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
				actions: {
					label: __( 'Actions' ),
					fields: {
						actions: {
							component: Form.ActionsItem,
							options: args => getPostActions( { history, ...args } ),
						}
					}
				}
			},
		},
		// edit: {
		// 	label: __( 'Edit' ),
		// 	path: match.url + '/edit',
		// 	sections: {
		//
		// 	},
		// },
		// comments: {
		// 	label: __( 'Comments' ),
		// 	path: match.url + '/comments',
		// 	isVisible: supports.comments,
		// 	sections: {
		//
		// 	},
		// },
	}

	const onSubmit = ( { changed, ids, setValue } ) => {
		const data = {
			meta: {},
			terms: {},
		}

		for ( let key in changed ) {
			if ( ! ids[ key ] ) {
				continue
			}
			data[ ids[ key ] ] = changed[ key ]
		}

		if ( 'visibility' in changed ) {
			switch ( changed.visibility ) {
			case 'public':
				data.post_status = 'publish'
				data.post_password = ''
				break
			case 'private':
				data.post_status = 'private'
				data.post_password = ''
				break
			case 'protected':
				data.post_status = 'publish'
				break
			}
		}
		if ( 'commentsAllowed' in changed ) {
			data.comment_status = changed.commentsAllowed ? 'open' : 'closed'
		}
		if ( 'pingbacksAllowed' in changed ) {
			data.ping_status = changed.pingbacksAllowed ? 'open' : 'closed'
		}
		if ( 'template' in changed ) {
			data.meta._wp_page_template = changed.template
		}
		if ( 'terms' in changed ) {
			data.terms = changed.terms
		}

		const handleError = error => {
			setIsSubmitting( false )
			alert( __( 'Error: Changes not published! Please try again.' ) )
			if ( error ) {
				console.log( error ) // eslint-disable-line no-console
			}
		}

		wpRest.posts().update( item.id, 'data', data ).then( response => {
			const { data } = response
			if ( data.error ) {
				handleError()
			} else {
				setValue( 'url', data.post.url )
				setIsSubmitting( false )
				alert( __( 'Changes published!' ) )
			}
		} ).catch( error => {
			handleError( error )
		} )
	}

	const {
		renderForm,
		resetForm,
		submitForm,
		values,
		hasChanges,
		setIsSubmitting,
	} = Form.useForm( {
		tabs,
		onSubmit,
		defaults: item,
	} )

	const Footer = () => {
		return (
            <>
				<Page.Toolbar>
					<Button
						onClick={ resetForm }
					>{__( 'Cancel' )}</Button>
					<div style={ { flex: '1 1 auto', margin: 'auto' } } />
					<Button type="submit" onClick={ submitForm } >{__( 'Publish' )}</Button>
				</Page.Toolbar>
            </>
		)
	}

	return (
		<Page
			title={ labels.editItem }
			footer={ hasChanges && <Footer /> }
		>
			<Page.TitleCard
				title={ values.title }
				style={ {
					marginBottom: 'var(--fl-asst-inner-space)'
				} }
			/>
			{ renderForm() }
		</Page>
	)
}
