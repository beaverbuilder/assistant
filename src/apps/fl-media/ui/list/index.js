import React, { useLayoutEffect } from 'react'
import { __, sprintf } from '@wordpress/i18n'
import { Text } from 'assistant/ui'
import { useMediaApp } from '../../data'
import { AttachmentItem, PlaceholderItem } from './items'
import UploadCard from '../upload-card'
import FileList from './file-list'
import './style.scss'

const hasReachedBounds = e => {
	const { scrollTop, clientHeight, scrollHeight } = e.target
	const bottom = scrollTop + clientHeight
	return bottom + 150 >= scrollHeight
}

const MediaList = () => {
	const {
		items,
		isFetching,
		loadItems,
		hasMore,
		lastViewed,
		setLastViewed,
		uploads,
		uploadFiles,
		currentUpload,
		showUploader,
		setShowUploader,
	} = useMediaApp()
	const hasItems = 0 < items.length

	const placeholders = new Array( 18 ).fill( 18 )
	const displayPlaceholders = isFetching && ! hasItems

	const onScroll = e => {
		if ( hasMore && hasReachedBounds( e ) && ! isFetching ) {
			loadItems( items.length )
		}
	}

	useLayoutEffect( () => {

		if ( null === lastViewed ) {
			return
		}
		const el = document.getElementById( `attachment-${lastViewed}` )
		if ( el ) {
			el.scrollIntoView( { block: 'center' } )
			setLastViewed( null )
		}
	}, [] )

	return (
		<div className="fl-asst-media-app-list-scroller" onScroll={ onScroll } style={ { position: 'relative' } }>

			<ul className="fl-asst-media-app-list">

				{ showUploader && (
					<li className="fl-asst-media-upload-card-area">
						<UploadCard
							onInput={ uploadFiles }
							onDismiss={ () => setShowUploader( false ) }
						/>
					</li>
				) }

				{ 0 < uploads.length && (
					<FileList
						files={ uploads }
						current={ currentUpload }
					/>
				) }

				{ displayPlaceholders && placeholders.map( ( _, i ) => (
					<li key={ i }>
						<PlaceholderItem />
					</li>
				) ) }

				{ items.map( item => {
					return (
						<li key={ item.id } id={ `attachment-${item.id}` } tabIndex="0">
							<AttachmentItem
								onClick={ () => setLastViewed( item.id ) }
								{ ...item }
							/>
						</li>
					)
				} ) }
				<Endcap isFetching={ isFetching } totalItems={ items.length } />
			</ul>

		</div>
	)
}

const Endcap = ( { isFetching = false, totalItems = 0 } ) => {
	return (
		<li className="fl-asst-media-app-list-endcap">
			{ isFetching && <Text.Title>{ __( 'Loading...', 'fl-assistant' ) }</Text.Title> }
			{ ! isFetching && (
				<Text.Title>{ sprintf( '%s Items', totalItems ) }</Text.Title>
			) }
		</li>
	)
}

export default MediaList
