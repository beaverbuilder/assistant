import React from 'react'
import { useAppState, getAppActions, getSystemConfig, useSystemState } from 'store'
import { TagGroupControl } from 'components'

export const UserListFilter = () => {
	const { filter } = useAppState()
	const { setRole } = getAppActions()
	const { roleTags } = getFilterTags()
	const { role } = filter

	return (
		<TagGroupControl
			limit={ 6 }
			tags={ roleTags }
			value={ role }
			onChange={ setRole }
			appearance="muted"
		/>
	)
}

export const getFilterTags = () => {
	const { counts } = useSystemState()
	const { userRoles } = getSystemConfig()

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

	return { roleTags }
}
