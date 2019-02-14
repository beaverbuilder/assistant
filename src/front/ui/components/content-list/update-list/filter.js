import React, { useEffect, useState } from 'react'
import { ExpandedContents, TagGroupControl } from 'components'
import { updatesQuery } from './queries'

export const UpdateListFilter = ( { onChange } ) => {
	const [ activeTag, setActiveTag ] = useState( 'all' )
	const tags = [
		{
			label: 'All',
			value: 'all',
		},
		{
			label: 'Plugins',
			value: 'plugins',
		},
		{
			label: 'Themes',
			value: 'themes',
		}
	]

	useEffect( () => {
		onChange( updatesQuery( activeTag ) )
	}, [ activeTag ] )

	return (
		<ExpandedContents>
			<TagGroupControl tags={ tags } value={ activeTag } title="Status" onChange={ setActiveTag } />
		</ExpandedContents>
	)
}
