import { useRef } from 'react'
import { getWpRest } from 'assistant/utils/wordpress'

export const usePostMediaImport = () => {
	const api = getWpRest().libraries()
	const nextAttachment = useRef( 0 )

	const importPostMedia = ( post, item ) => {
		return new Promise( ( resolve ) => {
			if ( item.media.thumb ) {
				importPostThumb( post, item, resolve )
			} else {
				importPostAttachments( post, item, resolve )
			}
		} )
	}

	const importPostThumb = ( post, item, resolve ) => {
		api.importPostThumb( post.id, item.media.thumb ).finally( () => {
			importPostAttachments( post, item, resolve )
		} )
	}

	const importPostAttachments = ( post, item, resolve ) => {
		const { attachments } = item.media

		if ( 'undefined' === typeof attachments ) {
			resolve( post )
			return
		}

		const attachment = attachments[ nextAttachment.current ]

		if ( 'undefined' === typeof attachment ) {
			nextAttachment.current = 0
			resolve( post )
		} else {
			api.importPostMedia( post.id, attachment ).finally( () => {
				nextAttachment.current++
				importPostAttachments( post, item, resolve )
			} )
		}
	}

	return importPostMedia
}
