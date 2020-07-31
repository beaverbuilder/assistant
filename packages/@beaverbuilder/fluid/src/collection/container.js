import React, { Children, createContext, useContext } from 'react'
import c from 'classnames'
import { motion, AnimatePresence } from 'framer-motion'
import CollectionContext from './context'

const limitChildren = ( children, count = null ) => {

	if ( Number.isInteger( count ) ) {
		return Children.map( children, ( child, i ) => {
			return ( i + 1 ) > count ? null : child
		} )
	}
	return Children.toArray( children )
}

const appearances = [ 'grid', 'list' ]

const CollectionContainer = ({
    tag: Tag = 'ul',
    appearance = 'grid',
    maxItems,
    className,
    children,
    ...rest
}) => {
    const classes = c( 'fluid-collection', {
        [`fluid-collection-appearance-${appearance}`] : appearances.includes( appearance )
    }, className )

    const context = {
        appearance
    }

    return (
        <CollectionContext.Provider value={context}>
            <AnimatePresence>
                <Tag
                    className={ classes }
                    {...rest}
                >
                    { limitChildren( children, maxItems ) }
                </Tag>
            </AnimatePresence>
        </CollectionContext.Provider>
    )
}

export default CollectionContainer
