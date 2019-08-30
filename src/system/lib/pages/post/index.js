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

	const tabs = [
		{
			path: match.url,
			label: __( 'General' ),
			exact: true,
			component: () => (
				<Page.RegisteredSections
					location={ { type: 'post' } }
					data={ { post: item } }
				/>
			),
		},
		{
			path: match.url + '/comments',
			label: __( 'Comments' ),
			component: () => (
				<Page.RegisteredSections
					location={ { type: 'post', tab: 'comments' } }
					data={ { post: location.state.item } }
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
							isSelected={ path === match.url }
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
				<Form.Section label={ __( 'Basic Info' ) }>
					<Form.Item label={ __( 'Title' ) }>
						<input
							type="text"

						/>
					</Form.Item>
				</Form.Section>
			</Form>
		</Page>
	)
}
