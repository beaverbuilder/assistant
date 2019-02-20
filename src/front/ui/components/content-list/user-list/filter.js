import React, { useEffect } from 'react'
import { maybeUseAppState, useConfig, useStore } from 'store'
import { TagGroupControl } from 'components'

export const UserListFilter = ( { onChange, ...props } ) => {
	const { counts } = useStore()
	const { userRoles } = useConfig()
	const [ role, setRole ] = maybeUseAppState( props, 'role', 'all' )

	const tags = [
		{
			label: 'All',
			value: 'all',
			count: counts[ 'role/total' ],
		},
		...userRoles.map( ( { key, name } ) => ( {
			label: name,
			value: key,
			count: counts[ `role/${ key }` ] || '0',
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
			appearance="muted"
		/>
	)
}
