import React from 'react'
import { useAppState, getAppActions, useSystemState } from 'store'
import { TagGroupControl } from 'components'

export const MediaListFilter = () => {
	const { filter } = useAppState()
	const { setType } = getAppActions()
	const { typeTags } = getFilterTags()
	const { type } = filter

	return (
		<TagGroupControl
			appearance="vibrant"
			tags={ typeTags }
			value={ type }
			onChange={ setType }
		/>
	)
}

export const getFilterTags = () => {
	const { counts } = useSystemState()

	const typeTags = [
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

	return { typeTags }
}
