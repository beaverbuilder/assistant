import React, { useEffect } from 'react'
import { useAppState, getConfig, useStore } from 'store'
import { TagGroupControl } from 'components'

export const UserListFilter = ( { onChange } ) => {
	const { counts } = useStore()
	const { userRoles } = getConfig()
	const [ role, setRole ] = useAppState( 'user-filter-role', 'all' )

	const tags = [
		{
			label: 'All',
			value: 'all',
			count: counts[ 'role/total' ] || '0',
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
			appearance="vibrant"
		/>
	)
}
