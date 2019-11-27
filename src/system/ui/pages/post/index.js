import React from 'react'
import { __ } from '@wordpress/i18n'
import { Page, Button, Form } from 'ui'
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

	const config = {
		id: {
			label: __( 'ID' ),
		},
		title: {
			label: __( 'Title' ),
			id: 'post_title',
			onChange: ( { value, setValue } ) => {
				setValue( 'slug', value )
			}
		},
		slug: {
			label: __( 'Slug' ),
			id: 'post_name',
			sanitize: createSlug,
		},
		url: {
			label: __( 'URL' ),
			id: 'post_url',
		},
		status: {
			label: __( 'Status' ),
			labelPlacement: 'beside',
			sanitize: value => contentStatus[ value ] ? contentStatus[ value ] : value,
		},
		visibility: {
			label: __( 'Visibility' ),
			labelPlacement: 'beside',
			options: {
				'public': __( 'Public' ),
				'private': __( 'Private' ),
				'protected': __( 'Protected' ),
			},
			onChange: ( { value, setValue, setIsVisible } ) => {
				switch ( value ) {
				case 'public':
				case 'protected':
					setValue( 'status', 'publish' )
					break
				case 'private':
					setValue( 'status', 'private' )
					break
				}
				setIsVisible( 'password', 'protected' == value )
			}
		},
		password: {
			label: __( 'Password' ),
			labelPlacement: 'beside',
			id: 'post_password',
			isVisible: 'protected' == item.visibility,
		},
		date: {
			label: __( 'Publish Date' ),
			labelPlacement: 'beside',
		},
		terms: {
			label: __( 'Terms' ),
		},
		excerpt: {
			id: 'post_excerpt',
			type: 'textarea',
			isVisible: supports.excerpt,
			rows: 5,
		},
		commentsAllowed: {
			label: __( 'Allow Comments' ),
			labelPlacement: 'beside',
			isVisible: supports.comments,
		},
		pingbacksAllowed: {
			label: __( 'Allow Pingbacks' ),
			labelPlacement: 'beside',
			isVisible: supports.trackbacks,
		},
		template: {
			label: __( 'Template' ),
			labelPlacement: 'beside',
			isVisible: !! Object.keys( templates ).length,
			options: () => {
				const options = {
					'default': __( 'Default' ),
				}
				Object.keys( templates ).map( ( key ) => {
					options[ templates[ key ] ] = key
				} )
				return options
			},
		},
		parent: {
			label: __( 'Parent' ),
			labelPlacement: 'beside',
			id: 'post_parent',
			isVisible: isHierarchical,
			options: ( { setOptions } ) => {
				return setParentOptions( item.type, setOptions )
			},
		},
		order: {
			label: __( 'Order' ),
			labelPlacement: 'beside',
			id: 'menu_order',
			isVisible: supports.order,
		},
		labels: {
			label: __( 'Labels' ),
			alwaysCommit: true,
			onAdd: label => {
				wpRest.notations().createLabel( 'post', item.id, label.id )
			},
			onRemove: label => {
				wpRest.notations().deleteLabel( 'post', item.id, label.id )
			},
		},
		actions: {
			value: args => getPostActions( { history, ...args } ),
		},
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

	const tabs = [
		{
			label: __( 'General' ),
			path: match.url,
			exact: true,
			sections: [
				{
					location: {
						type: 'post'
					},
					data: {
						post: item,
					}
				}
			],
		},
		{
			label: __( 'Edit' ),
			path: match.url + '/edit',
			sections: [
				{
					location: {
						type: 'post',
						tab: 'edit',
					},
					data: {
						post: item,
					}
				}
			],
		},
		{
			label: __( 'Comments' ),
			path: match.url + '/comments',
			sections: [
				{
					location: {
						type: 'post',
						tab: 'comments',
					},
					data: {
						post: item,
					}
				}
			],
		},
	]

	const {
		renderForm,
		resetForm,
		submitForm,
		setIsSubmitting,
		values,
		hasChanges,
	} = Form.useFormRenderer( {
		tabs,
		config,
		options: {
			onSubmit,
		},
		values: item,
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
			shouldPadSides={ false }
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
