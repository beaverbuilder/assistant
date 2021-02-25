import React, { Children } from 'react'
import c from 'classnames'
import './style.scss'

const FilterBar = ( { className, children, ...rest } ) => {
	const classes = c( 'fluid-filter', className )
	return (
		<>
			<ul className={ classes } { ...rest }>
				{ Children.map( children, ( child ) => {
					return child
				} ) }
			</ul>
		</>
	)
}

export default FilterBar
