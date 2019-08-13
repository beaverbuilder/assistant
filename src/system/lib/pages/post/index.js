import React from 'fl-react'
import { __ } from '@wordpress/i18n'
import { Page, Nav, Button } from 'lib'

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
				Page Header!
				{ thumbnail && <img src={ thumbnail } /> }
				<h2>{title}</h2>

				<Page.Toolbar>
					<Button onClick={ () => setTab(`${match.url}/general`) }>{__('General')}</Button>
					<Button onClick={ () => setTab(`${match.url}/meta`) }>{__('Metadata')}</Button>
					<Button onClick={ () => setTab(`${match.url}/comments`) }>{__('Comments')}</Button>
				</Page.Toolbar>
			</div>
		)
	}

	return (
		<Page title={ __( 'Post' ) } header={<PageHeader item={item} />}>
			<Nav.Switch>
				<Nav.Route exact path={`${match.url}/`} component={GeneralTab} />
				<Nav.Route path={`${match.url}/general`} component={GeneralTab} />
				<Nav.Route path={`${match.url}/meta`} component={MetaTab} />
				<Nav.Route path={`${match.url}/comments`} component={CommentsTab} />
			</Nav.Switch>
		</Page>
	)
}

const GeneralTab = () => {
	return (
		<>
			General Tab Content.
		</>
	)
}

const MetaTab = () => {
	return (
		<>
			Metadata Tab Content.
		</>
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
