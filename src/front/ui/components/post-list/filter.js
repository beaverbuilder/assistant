import React, { useState } from 'react'

export const PostListFilter = props => {
	const [ search, setSearch ] = useState( '' )
	const [ searchChangeTimeout, setSearchChangeTimeout ] = useState( null )
	const { onChange } = props

	const handleSearchChange = e => {
		if ( searchChangeTimeout ) {
			clearTimeout( searchChangeTimeout )
		}
		const value = e.target.value
		const timeout = setTimeout( () => onChange( value ), 500 )
		setSearch( value )
		setSearchChangeTimeout( timeout )
	}

	return (
		<div className="fl-asst-list-filter">
			<input
				type="text"
				placeholder="Search..."
				value={ search }
				onChange={ handleSearchChange }
			/>
		</div>
	)
}
