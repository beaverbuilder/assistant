import React, { useEffect } from 'react'
import { useAppState, getConfig, useStore } from 'store'
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
	const [ query, setQuery ] = useAppState( 'query' ) // eslint-disable-line no-unused-vars
	const [ filter, setFilter ] = useAppState( 'filter' )
	const { counts } = useStore()
	const { userRoles } = getConfig()
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
