import React from 'react'
import { __ } from '@wordpress/i18n'
import { App, Page, List, Filter } from 'assistant/ui'
import { useAppState, getAppActions } from 'assistant/data'
import { defaultState } from './'
import AppIcon from './icon'
import './style.scss'

export default props => (
	<App.Config
		pages={ {
			default: Main,
			'attachment/:id': Page.Attachment
		} }
		{ ...props }
	/>
)

const Main = ( { baseURL } ) => {
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
				<Filter.LabelsItem
					value={ query.label }
					defaultValue={ defaultState.query.label }
					onChange={ value => setQuery( { ...query, label: value } ) }
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

	const onLoad = () => {
		const item = document.querySelector( '.fl-asst-filter .fluid-button' )
		if ( item ) {
			item.focus()
		}
	}

	return (
		<Page
			title={ __( 'Media' ) }
			icon={ <AppIcon context="sidebar" /> }
			shouldShowBackButton={ false }
			padX={ false }
			padY={ false }
			shouldScroll={ false }
			onLoad={ onLoad }
		>
			<List.Attachments
				key={ listStyle }
				baseURL={ baseURL }
				query={ query }
				listStyle={ listStyle }
				before={ <MediaFilter /> }
			/>
		</Page>
	)
}
