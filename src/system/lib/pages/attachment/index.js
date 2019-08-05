import React from 'fl-react'
import { Page, Button } from 'lib'
import utils from 'utils'
const { react: { useInitialFocus }} = utils

/**
 * Get a srcset string from an object of sizes.
 * Expects size.url and size.width to be present.
 */
const getSrcSet = ( sizes = {} ) => {
    return Object.values(sizes).map( size => {
        return size.url + ' ' + size.width + 'w'
    }).join(', ')
}

export const Attachment = ({ location }) => {
    const firstRef = useInitialFocus()
    const defaultItem = {
        sizes: {}
    }
	const item = typeof location.state.item !== 'undefined' ? location.state.item : defaultItem
    const srcSet = getSrcSet( item.sizes )
	return (
		<Page>
            <img src={item.thumbnail} srcSet={srcSet} />
            <Button ref={firstRef}>Test</Button>
		</Page>
	)
}
