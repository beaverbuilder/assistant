import React, { useEffect } from 'react'
import { maybeUseAppState, useStore } from 'store'
import { TagGroupControl } from 'components'

export const MediaListFilter = ( { onChange, ...props } ) => {
	const [ activeTag, setActiveTag ] = maybeUseAppState( props, 'type', 'image' )
	const { counts } = useStore()
	const tags = [
		{
			label: 'Images',
			value: 'image',
			count: counts[ 'media/images' ] || '0',
		},
		{
			label: 'Videos',
			value: 'video',
			count: counts[ 'media/video' ] || '0',
		},
		{
			label: 'Audio',
			value: 'audio',
			count: counts[ 'media/audio' ] || '0',
		},
		{
			label: 'Documents',
			value: 'application',
			count: counts[ 'media/documents' ] || '0',
		}
	]

	useEffect( () => {
		onChange( {
			posts_per_page: 20,
			post_type: 'attachment',
			post_mime_type: activeTag,
		} )
	}, [ activeTag ] )

	return (
		<TagGroupControl
			appearance="vibrant"
			tags={ tags }
			value={ activeTag }
			onChange={ setActiveTag }
		/>
	)
}
