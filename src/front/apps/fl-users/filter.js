import React, { useEffect } from 'react'
import { useAppState, getAppDispatch, getSystemConfig, useSystemState } from 'store'
import { TagGroupControl } from 'components'

export const UserListFilter = () => {
	const { roleTags, setRole, role } = getFilterData()

	return (
		<TagGroupControl
			tags={ roleTags }
			value={ role }
			onChange={ setRole }
			appearance="muted"
		/>
	)
}

export const getFilterData = () => {
	const { filter } = useAppState()
	const { setFilter, setQuery } = getAppDispatch()
	const { counts } = useSystemState()
	const { userRoles } = getSystemConfig()
	const { role } = filter

	const roleTags = [
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

	const setRole = role => {
		setFilter( { ...filter, role } )
	}

	useEffect( () => {
		setQuery( 'all' === role ? {} : { role } )
	}, [ role ] )

	return { roleTags, setRole, role }
}
