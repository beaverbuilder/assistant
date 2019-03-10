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
			count: counts[ 'attachment/image' ] || '0',
		},
		{
			label: 'Videos',
			value: 'video',
			count: counts[ 'attachment/video' ] || '0',
		},
		{
			label: 'Audio',
			value: 'audio',
			count: counts[ 'attachment/audio' ] || '0',
		},
		{
			label: 'Documents',
			value: 'application',
			count: counts[ 'attachment/application' ] || '0',
		}
	]

	return { typeTags }
}
