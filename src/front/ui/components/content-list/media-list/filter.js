import React, { useEffect, useState } from 'react'
import { TagGroupControl } from 'components'
import { mediaQuery } from './queries'

export const MediaListFilter = ( { onChange } ) => {
	const [ activeTag, setActiveTag ] = useState( 'images' )
	const tags = [
		{
			label: 'Images',
			value: 'images',
		},
		{
			label: 'Videos',
			value: 'videos',
		},
		{
			label: 'Documents',
			value: 'documents',
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
