import React, { Children } from 'react'
import c from 'classnames'
import { AnimatePresence } from 'framer-motion'
import CollectionContext from './context'
import LoadingItem from './item-loading'

const limitChildren = ( children, count = null ) => {

	if ( Number.isInteger( count ) ) {
		return Children.map( children, ( child, i ) => {
			return ( i + 1 ) > count ? null : child
		} )
	}
	return Children.toArray( children )
}

const appearances = [ 'grid', 'list' ]

const CollectionContainer = ( {
	tag: Tag = 'ul',
	appearance = 'grid',
	maxItems,
	className,
	children,
	isLoading = false,
	loadingItems = 4,
	...rest
} ) => {
	const classes = c( 'fluid-collection', {
		[`fluid-collection-appearance-${appearance}`]: appearances.includes( appearance )
	}, className )

	const context = {
		appearance
	}

	return (
		<CollectionContext.Provider value={ context }>
			<AnimatePresence>
				<Tag
					className={ classes }
					{ ...rest }
				>
					{ isLoading && <LoadingItems total={ loadingItems } /> }
					{ ! isLoading && limitChildren( children, maxItems ) }
				</Tag>
			</AnimatePresence>
		</CollectionContext.Provider>
	)
}

const LoadingItems = ({ total = 4 }) => {
	return (
		<>
			<LoadingItem />
			<LoadingItem />
			<LoadingItem />
			<LoadingItem />
		</>
	)
}

export default CollectionContainer
