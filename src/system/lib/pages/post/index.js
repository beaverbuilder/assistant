import React, { useMemo } from 'fl-react'
import { __ } from '@wordpress/i18n'
import { Page, Nav, Button, Form } from 'lib'
import { getSystemConfig } from 'store'
import { getWpRest } from 'shared-utils/wordpress'
import { createSlug } from 'shared-utils/url'
import { getPostActions } from './actions'

const getFormConfig = () => {
	return {
		id: {
			label: __( 'ID' ),
		},
		title: {
			label: __( 'Title' ),
			id: 'post_title',
		},
		slug: {
			label: __( 'Slug' ),
			id: 'post_name',
			sanitize: createSlug,
		},
		url: {
			label: __( 'URL' ),
			id: 'postURL',
		},
		status: {
			label: __( 'Publish Status' ),
			id: 'post_status',
			options: {
				'publish': __( 'Published' ),
				'pending': __( 'Pending Review' ),
				'draft': __( 'Drafted' ),
			},
			labelPlacement: 'beside',
		},
		visibility: {
			label: __( 'Visibility' ),
			id: 'postVisibility',
			options: {
				'public': __( 'Public' ),
				'private': __( 'Private' ),
				'protected': __( 'Protected' ),
			},
			labelPlacement: 'beside',
		},
		parent: {
			label: __( 'Parent' ),
			id: 'postParent',
			options: () => ( {
				0: __( 'None' )
			} ),
			labelPlacement: 'beside',
		},
		tags: {
			label: __( 'Tags' ),
			value: [
				{ id: 4, label: __( 'WordPress' ), onRemove: () => {} },
				{ id: 5, label: __( 'Best Posts' ), onRemove: () => {} },
				{ id: 6, label: __( 'Hot Dogs' ), onRemove: () => {} },
			]
		},
		actions: {
			value: getPostActions,
		},
		labels: {
			label: __( 'Labels' ),
			id: 'postLabels',
			value: () => [
				{ id: 4, label: __( 'Red' ), color: 'red', onRemove: () => {} },
				{ id: 5, label: __( 'Blue' ), color: 'blue', onRemove: () => {} },
				{ id: 6, label: __( 'Needs SEO' ), color: 'green', onRemove: () => {} },
				{ id: 7, label: __( 'This is Stupid' ), color: 'orange', onRemove: () => {} },
			],
		}
	}
}

export const Post = ( { location, match, history } ) => {
	const { contentTypes } = getSystemConfig()

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

	// Setup Form Hook
	const {
		values,
		form, // Spread this into the <Form> component
		useFormContext,
		hasChanges,
		resetForm, // Function to revert back to last committed values
		submitForm,

	} = Form.useForm(
		{
			...getFormConfig()
		},
		{
			onSubmit: ({ changes, ids }) => {

				const wpRest = getWpRest()
				const data = {}
				const keyMap = ids
				for ( let key in changes ) {
					if ( ! keyMap[ key ] ) {
						continue
					}
					data[ keyMap[ key ] ] = changes[ key ]
				}
				wpRest.posts().update( item.id, 'data', data ).then( () => {
					alert( 'Changes Published!' )
				} )
			},
		},
		item,
	)


	// Setup Tab Handling
	const tabs = [
		{
			path: match.url,
			label: __( 'General' ),
			exact: true,
			component: () => (
				<Page.RegisteredSections
					location={ { type: 'post' } }
					data={ sectionData }
				/>
			),
		},
		{
			path: match.url + '/comments',
			label: __( 'Comments' ),
			component: () => (
				<Page.RegisteredSections
					location={ { type: 'post', tab: 'comments' } }
					data={ sectionData }
				/>
			),
		},
	]
	const setTab = path => history.replace( path, location.state )

	/*
	This stuff only gets passed to each section once. Sections are memo-ized so they only render on mount. After that, use Form.Context to update section content.
	*/
	const sectionData = {
		post: item,
		useForm: useFormContext, // Rename
	}

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
			title={ contentTypes[ item.type ].labels.editItem }
			shouldPadSides={ false }
			footer={ hasChanges && <Footer /> }
		>

			<Page.TitleCard
				title={ values.title }
				style={ {
					marginBottom: 'var(--fl-asst-inner-space)'
				} }
			/>

			{ useMemo( () => (
				<Page.Pad
					className="fl-asst-stick-to-top"
					style={ {
						display: 'flex',
						justifyContent: 'center',
						flexShrink: 0,
						padding: 0,
					} }
				>
					<Button.Group appearance="tabs">
						{ tabs.map( ( { label, path }, i ) => (
							<Button key={ i }
								onClick={ () => setTab( path ) }
								isSelected={ path === location.pathname }
							>{label}</Button>
						) )}
					</Button.Group>
				</Page.Pad>
			), [ location.pathname ] )}

			<Form { ...form }>

				{ useMemo( () => (
					<Nav.Switch>
						{ tabs.map( ( tab, i ) => <Nav.Route key={ i } { ...tab } /> ) }
					</Nav.Switch>
				), [] )}
			</Form>

		</Page>
	)
}
