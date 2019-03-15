import React from 'react'
import { __ } from '@wordpress/i18n'
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
			label: __('All'),
			value: '',
		},
		{
			label: __('Images'),
			value: 'image',
			count: counts[ 'attachment/image' ] || '0',
		},
		{
			label: __('Videos'),
			value: 'video',
			count: counts[ 'attachment/video' ] || '0',
		},
		{
			label: __('Audio'),
			value: 'audio',
			count: counts[ 'attachment/audio' ] || '0',
		},
		{
			label: __('Documents'),
			value: 'application',
			count: counts[ 'attachment/application' ] || '0',
		}
	]

	return { typeTags }
}
