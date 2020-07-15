import React from 'react'
import c from 'classnames'

// Keeps content centered and at a ledgible line length
const ContentBoundary = ( { tag: Tag = 'div', className, ...rest } ) => (
	<Tag
		className={ c( 'fluid-content-boundary', className ) }
		{ ...rest }
	/>
)

export default ContentBoundary
