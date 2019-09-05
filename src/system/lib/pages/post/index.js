import React from 'fl-react'
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
	const item = 'undefined' !== typeof location.state && 'undefined' !== typeof location.state.item ? location.state.item : defaultItem
	const { title } = item

	const setTab = path => history.replace( path, location.state )


	// What should we be sending to sections?
	/*
	- Post data or a getter function (ex: getPost('ID') )
	- Comments for this post
	- A collection of actions that can be turned into buttons.
	- location, match, history for navigation
	*/
	const sectionData = {
		post: item,
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
		labels: [
			{ id: 4, label: __( 'Red' ), color: 'red', onRemove: () => {} },
			{ id: 5, label: __( 'Blue' ), color: 'blue', onRemove: () => {} },
			{ id: 6, label: __( 'Needs SEO' ), color: 'green', onRemove: () => {} },
			{ id: 7, label: __( 'This is Stupid' ), color: 'orange', onRemove: () => {} },
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

			<Page.TitleCard title={ title } />

			<Page.Pad style={ { display: 'flex', justifyContent: 'center' } }>
				<Button.Group>
					{ tabs.map( ( { label, path }, i ) => (
						<Button key={ i }
							onClick={ () => setTab( path ) }
							isSelected={ path === location.pathname }
						>{label}</Button>
					) )}
				</Button.Group>
			</Page.Pad>

			<Form>
				<Nav.Switch>
					{ tabs.map( ( tab, i ) => <Nav.Route key={ i } { ...tab } /> ) }
				</Nav.Switch>
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
