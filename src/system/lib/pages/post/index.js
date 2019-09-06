import React, { useMemo } from 'fl-react'
import { __ } from '@wordpress/i18n'
import { Page, Nav, Button, Form, Control } from 'lib'

export const Post = ( { location, match, history } ) => {

	const defaultItem = {
		author: null,
		bbBranding: null,
		bbCanEdit: true,
		bbEditUrl: null,
		bbIsEnabled: null,
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

	// Setup Form Handler & Context
	const { values, formContext, useForm } = Form.useFormContext( {
		title: {
			label: __( 'Title' ),
			id: 'postTitle',
		},
		slug: {
			label: __( 'Slug' ),
			id: 'postSlug',
		},
		url: {
			label: __( 'URL' ),
			id: 'postURL',
		},
		status: {
			label: __( 'Publish Status' ),
			id: 'postStatus',
			options: {
				'publish': __( 'Published' ),
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
			options: {
				0: __( 'None' )
			},
			labelPlacement: 'beside',
		},
		labels: {
			label: __( 'Labels' ),
			id: 'postLabels',
			value: [
				{ id: 4, label: __( 'Red' ), color: 'red', onRemove: () => {} },
				{ id: 5, label: __( 'Blue' ), color: 'blue', onRemove: () => {} },
				{ id: 6, label: __( 'Needs SEO' ), color: 'green', onRemove: () => {} },
				{ id: 7, label: __( 'This is Stupid' ), color: 'orange', onRemove: () => {} },
			],
		}
	}, item )

	const setTab = path => history.replace( path, location.state )

	/*
	This stuff only gets passed to each section once. Sections are memo-ized so they only render on mount. After that, use Form.Context to update section content.
	*/
	const sectionData = {
		post: item,
		useForm,

		actions: [
			{
				label: __( 'View Post' ),
				href: item.url,
			},
			{
				label: __( 'Edit in Admin' ),
				href: '#',
			},
			{
				label: __( 'Beaver Builder' ),
				href: '#', /* Maybe we want to check here if we can re-enter BB without refresh? */
			},
			{
				label: __( 'Duplicate' ),
				onClick: () => {},
			},
			{
				label: __( 'Mark as Favorite' ),
				onClick: () => {},
			},
			{
				label: __( 'Move to Trash' ),
				onClick: () => {},
			}
		],
		nav: { location, match, history },
	}

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

	const Actions = () => {
		return (
			<Control.NextPrev
				onPrev={ () => {} }
				onNext={ () => {} }
			/>
		)
	}

	return (
		<Page title={ __( 'Edit Post' ) } headerActions={ <Actions /> } shouldPadSides={ false }>

			<Page.TitleCard title={ values.title } />

			{ useMemo( () => (
				<Page.Pad style={ { display: 'flex', justifyContent: 'center' } } bottom={ false }>
					<Button.Group>
						{ tabs.map( ( { label, path }, i ) => (
							<Button key={ i }
								onClick={ () => setTab( path ) }
								isSelected={ path === location.pathname }
							>{label}</Button>
						) )}
					</Button.Group>
				</Page.Pad>
			), [ location.pathname ] )}


			<Form context={ formContext }>
				{ useMemo( () => (
					<Nav.Switch>
						{ tabs.map( ( tab, i ) => <Nav.Route key={ i } { ...tab } /> ) }
					</Nav.Switch>
				), [] )}
			</Form>

		</Page>
	)
}


export const CreatePost = () => {
	return (
		<Page title={ __( 'Create New' ) } shouldPadSides={ false }>
			<Form>
				<Page.RegisteredSections
					location={ { type: 'create-post' } }
					data={ {} }
				/>
			</Form>
		</Page>
	)
}
