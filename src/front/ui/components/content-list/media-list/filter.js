import React, { useEffect } from 'react'
import { maybeUseAppState } from 'store'
import { TagGroupControl } from 'components'

export const MediaListFilter = ( { onChange, ...props } ) => {
	const [ activeTag, setActiveTag ] = maybeUseAppState( props, 'type', 'image' )
	const tags = [
		{
			label: 'Images',
			value: 'image',
		},
		{
			label: 'Videos',
			value: 'video',
		},
		{
			label: 'Audio',
			value: 'audio',
		},
		{
			label: 'Documents',
			value: 'application',
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
