import React, { useState, useMemo, useContext } from 'fl-react'
import { __ } from '@wordpress/i18n'
import { Page, Nav, Button, Form, Control } from 'lib'


const useFormContext = ( initial ) => {

	// Temp
	const [titleVal, setTitle] = useState( initial.title )
	const [slugVal, setSlug] = useState( initial.slug )

	const context = {
		title: {
			label: __('Title'),
			id: 'postTitle',
			value: titleVal,
			onChange: e => setTitle( e.target.value )
		},
		slug: {
			label: __('Slug'),
			id: 'postSlug',
			value: slugVal,
			onChange: e => setSlug( e.target.value )
		}
	}
	const hook = () => {
		return useContext( Form.Context )
	}

	return [context, hook]
}

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

	const [formContext, useForm] = useFormContext( item )

	const setTab = path => history.replace( path, location.state )

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

			<Page.TitleCard title={formContext.title.value} />

			{ useMemo( () => (
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
			), [location.pathname] )}


			<Form context={formContext}>
			{ useMemo( () => (
				<Nav.Switch>
					{ tabs.map( ( tab, i ) => <Nav.Route key={i} { ...tab } /> ) }
				</Nav.Switch>
			), [])}
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
