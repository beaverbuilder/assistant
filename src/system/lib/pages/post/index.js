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

	const Header = () => {
		return (
			<>
				<Page.TitleCard title={ title } />

				<Page.Pad style={ { display: 'flex', justifyContent: 'center' } }>
					<Button.Group>
						<Button
							onClick={ () => setTab( `${match.url}/general` ) }
							isSelected={   location.pathname === `${match.url}/general` ||
										location.pathname === `${match.url}` }
						>{__( 'General' )}</Button>
						<Button
							onClick={ () => setTab( `${match.url}/meta` ) }
							isSelected={ location.pathname === `${match.url}/meta` }
						>{__( 'Metadata' )}</Button>
						<Button
							onClick={ () => setTab( `${match.url}/comments` ) }
							isSelected={ location.pathname === `${match.url}/comments` }
						>{__( 'Comments' )}</Button>
					</Button.Group>
				</Page.Pad>
			</>
		)
	}

	const Actions = () => {
		return (
			<Control.NextPrev
				onPrev={ () => {} }
				onNext={ () => {} }
			/>
		)
	}

	return (
		<Page title={ __( 'Edit Post' ) } header={ <Header /> } headerActions={ <Actions /> } shouldPadSides={ false }>
			<Nav.Switch>
				<Nav.Route exact path={ `${match.url}/` } component={ GeneralTab } />
				<Nav.Route path={ `${match.url}/general` } component={ GeneralTab } />
				<Nav.Route path={ `${match.url}/meta` } component={ MetaTab } />
				<Nav.Route path={ `${match.url}/comments` } component={ CommentsTab } />
			</Nav.Switch>
		</Page>
	)
}

const GeneralTab = ( { location } ) => {
	return (
		<Form>
			<Page.RegisteredSections
				location={ { type: 'post' } }
				data={ { post: location.state.item } }
			/>

			<Form.Section label={ __( 'Actions' ) }>
				<Form.Item>
					<Button.Group appearance="grid">
						<Button>{__( 'View Post' )}</Button>
						<Button>{__( 'Edit in Admin' )}</Button>
						<Button>{__( 'Beaver Builder' )}</Button>
						<Button>{__( 'Bookmark' )}</Button>
						<Button>{__( 'Duplicate' )}</Button>
						<Button>{__( 'Move to Trash' )}</Button>
					</Button.Group>
				</Form.Item>
			</Form.Section>
		</Form>
	)
}

const MetaTab = ( { location } ) => {
	return (
		<Form>
			<Page.RegisteredSections
				location={ { type: 'post', tab: 'metadata' } }
				data={ { post: location.state.item } }
			/>
		</Form>
	)
}

const CommentsTab = () => {
	return (
		<Page.Section label={ __( 'Comments' ) }>
			Comments List
		</Page.Section>
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
