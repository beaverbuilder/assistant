import React from 'react'
import { __ } from '@wordpress/i18n'
import { Page, Nav, List, Filter } from 'assistant/ui'
import { useAppState, getAppActions } from 'assistant/data'
import { defaultState } from './'
import './style.scss'

export const MediaApp = ( { match } ) => (
	<Nav.Switch>
		<Nav.Route exact path={ `${match.url}/` } component={ Main } />
		<Nav.Route path={ `${match.url}/attachment/:id` } component={ Page.Attachment } />
	</Nav.Switch>
)

const Main = ( { match } ) => {
	const { listStyle, query } = useAppState( 'fl-media' )
	const { setListStyle, setQuery } = getAppActions( 'fl-media' )


	const MediaFilter = () => {

		const types = {
			all: __( 'All' ),
			image: __( 'Image' ),
			video: __( 'Video' ),
			audio: __( 'Audio' ),
			document: __( 'Documents' ),
		}

		const sorts = {
			ID: __( 'ID' ),
			date: __( 'Date Uploaded' ),
			modified: __( 'Last Modified' ),
		}

		const listStyles = {
			'': __( 'List' ),
			grid: __( 'Grid' ),
		}

		const orders = {
			ASC: __( 'Ascending' ),
			DESC: __( 'Descending' )
		}

		const resetFilter = () => {
			setQuery( defaultState.query )
			setListStyle( defaultState.listStyle )
		}

		return (
			<Filter>
				<Filter.RadioGroupItem
					title={ __( 'Type' ) }
					items={ types }
					value={ query.post_mime_type }
					defaultValue={ '' }
					onChange={ value => setQuery( { ...query, post_mime_type: value } ) }
				/>
				<Filter.RadioGroupItem
					title={ __( 'Display As' ) }
					items={ listStyles }
					value={ listStyle }
					defaultValue={ defaultState.listStyle }
					onChange={ value => setListStyle( value ) }
				/>
				<Filter.RadioGroupItem
					title={ __( 'Sort By' ) }
					items={ sorts }
					value={ query.orderby }
					defaultValue={ defaultState.query.orderby }
					onChange={ value => setQuery( { ...query, orderby: value } ) }
				/>
				<Filter.RadioGroupItem
					title={ __( 'Order' ) }
					items={ orders }
					value={ query.order }
					defaultValue={ defaultState.query.order }
					onChange={ value => setQuery( { ...query, order: value } ) }
				/>
				<Filter.Button onClick={ resetFilter }>{__( 'Reset Filter' )}</Filter.Button>
			</Filter>
		)
	}

	return (
		<Page title={ __( 'Media' ) } padX={ false } padY={ false } shouldScroll={ false }>
			<List.Attachments
				key={ listStyle }
				baseURL={ match.url }
				query={ query }
				listStyle={ listStyle }
				before={ <MediaFilter /> }
			/>
		</Page>
	)
}
