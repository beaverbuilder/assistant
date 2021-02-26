import React from 'react'
//import { __ } from '@wordpress/i18n'
import { App, Page, List, Filter, Button, Icon, Media } from 'assistant/ui'
//import { useAppState, getAppActions } from 'assistant/data'
//import { defaultState } from './config'
import { MediaAppProvider } from './data'
import { Main, UploadCard, FileList } from './ui'
//import AppIcon from './icon'

export default props => {
	return (
		<MediaAppProvider>
			<App.Config
				pages={ {
					default: Main,
					'attachment/:id': Page.Attachment
				} }
				{ ...props }
			/>
		</MediaAppProvider>
	)
}

/*
const Main = ( { baseURL } ) => {
	const { listStyle, query, showUploader } = useAppState( 'fl-media' )
	const { setListStyle, setQuery, setShowUploader } = getAppActions( 'fl-media' )
	const { files, uploadFiles, current } = Media.useMediaUploads()

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

	const UploadButton = () => (
		<Button
			isSelected={ showUploader }
			shape="round"
			icon={ <Icon.Plus /> }
			onClick={ () => setShowUploader( ! showUploader ) }
		/>
	)

	const Before = () => {
		return (
			<>
				{ showUploader && (
					<UploadCard
						onInput={ uploadFiles }
						onDismiss={ () => setShowUploader( false ) }
					/>
				) }
				{ 0 < files.length && <FileList files={ files } current={ current } />}
			</>
		)
	}

	const Header = () => (
		<MediaFilter />
	)

	const focusFirstButton = () => {
		const item = document.querySelector( '.fluid-page-content .fluid-button' )
		if ( item ) {
			item.focus()
		}
	}

	return (
		<Page
			id="fl-asst-media-list-page"
			title={ __( 'Media' ) }
			icon={ <AppIcon /> }
			shouldShowBackButton={ false }
			padX={ false }
			padY={ false }
			shouldScroll={ false }
			onLoad={ focusFirstButton }
			actions={ <UploadButton /> }
			header={ <Header /> }
		>
			<List.Attachments
				before={ <Before /> }
				key={ listStyle + current }
				baseURL={ baseURL }
				query={ {
					...query,
					posts_per_page: 36,
				} }
				listStyle={ listStyle }
			/>
		</Page>
	)
}
*/
