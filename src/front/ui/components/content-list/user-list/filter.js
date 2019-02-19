import React, { useEffect, useState } from 'react'
import { useConfig } from 'store'
import { TagGroupControl } from 'components'

export const UserListFilter = ( { onChange } ) => {
	const { userRoles } = useConfig()
	const [ role, setRole ] = useState( 'all' )

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
