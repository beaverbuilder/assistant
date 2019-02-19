import React, { useEffect, useState } from 'react'
import { maybeUseAppState } from 'store'
import { ExpandedContents, TagGroupControl } from 'components'

export const UpdateListFilter = ( { onChange, ...props } ) => {
	const [ activeTag, setActiveTag ] = maybeUseAppState( props, 'type', 'all' )
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
		onChange( {
			type: activeTag,
		} )
	}, [ activeTag ] )

	return (
		<ExpandedContents>
			<TagGroupControl tags={ tags } value={ activeTag } title="Status" onChange={ setActiveTag } />
		</ExpandedContents>
	)
}
