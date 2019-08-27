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
	const { title, thumbnail } = item

	const setTab = path => history.replace( path, location.state )

	const PageHeader = () => {
		return (
			<div>
				{ thumbnail && <img src={ thumbnail } style={ { height: 150, width: 150 } } /> }
				<h2>{title}</h2>

				<Page.Toolbar>
					<Button.Group>
						<Button onClick={ () => setTab( `${match.url}/general` ) }>{__( 'General' )}</Button>
						<Button onClick={ () => setTab( `${match.url}/meta` ) }>{__( 'Metadata' )}</Button>
						<Button onClick={ () => setTab( `${match.url}/comments` ) }>{__( 'Comments' )}</Button>
					</Button.Group>
				</Page.Toolbar>
			</div>
		)
	}

	return (
		<Page title={ __( 'Post' ) } header={ <PageHeader item={ item } /> } shouldPadSides={ false }>
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
	const { url } = location.state.item
	return (
		<Form>
			<Form.Section label={ __( 'Permalink' ) }>
				<Form.Item>
					<Control.URL url={ url } />
				</Form.Item>
			</Form.Section>
		</Form>
	)
}

const MetaTab = () => {
	return (
		<Form>
			<Form.Section label={ __( 'Categories' ) }>
				<Form.Item>
					Category controls
				</Form.Item>
			</Form.Section>
			<Form.Section label={ __( 'Tags' ) }>
				<Form.Item>
					tag controls
				</Form.Item>
			</Form.Section>
			<Form.Section label={ __( 'Excerpt' ) }>
				<Form.Item>
					Excerpt controls
				</Form.Item>
			</Form.Section>
		</Form>
	)
}

const CommentsTab = () => {
	return (
		<>
			Comments Tab Content.
		</>
	)
}

export const CreatePost = () => {
	return (
		<Page title={ __( 'Create New' ) }>
			<p>Make something new right here.</p>
		</Page>
	)
}
