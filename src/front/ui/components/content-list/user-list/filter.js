import React, { useEffect, useState } from 'react'
import { maybeUseAppState, useConfig } from 'store'
import { TagGroupControl } from 'components'

export const UserListFilter = ( { onChange, ...props } ) => {
	const { userRoles } = useConfig()
	const [ role, setRole ] = maybeUseAppState( props, 'role', 'all' )

	const tags = [
		{
			label: 'All',
			value: 'all',
		},
		...userRoles.map( ( { key, name } ) => ( {
			label: name,
			value: key,
		} ) )
	]

	useEffect( () => {
		onChange( 'all' === role ? {} : { role } )
	}, [ role ] )

	return (
		<TagGroupControl
			tags={ tags }
			value={ role }
			onChange={ setRole }
			appearance="vibrant"
		/>
	)
}
