import React from '@assistant/react'
import { useAppState, getAppActions, useSystemState } from '@assistant/store'
import { TagGroupControl } from '@assistant/components'

export const MediaListFilter = () => {
	const { filter } = useAppState()
	const { setType } = getAppActions()
	const { typeTags } = getFilterTags()
	const { type } = filter

	return (
		<TagGroupControl
			appearance="muted"
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
			label: 'All',
			value: '',
		},
		{
			label: 'Images',
			value: 'image',
			count: counts[ 'media/images' ] || null,
		},
		{
			label: 'Videos',
			value: 'video',
			count: counts[ 'media/video' ] || null,
		},
		{
			label: 'Audio',
			value: 'audio',
			count: counts[ 'media/audio' ] || null,
		},
		{
			label: 'Documents',
			value: 'application',
			count: counts[ 'media/documents' ] || null,
		}
	]

	return { typeTags }
}
