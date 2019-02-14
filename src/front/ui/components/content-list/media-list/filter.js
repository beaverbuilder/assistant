import React, { useEffect, useState } from 'react'
import { TagGroupControl } from 'components'
import { mediaQuery } from './queries'

export const MediaListFilter = ( { onChange } ) => {
	const [ activeTag, setActiveTag ] = useState( 'image' )
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
		onChange( mediaQuery( activeTag ) )
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
