import React from 'react'
import Item from './item'

const LoadingItem = ( { ...rest } ) => (
	<Item
		thumbnail={ true }
		title="Loading..."
		{ ...rest }
	/>
)

export default LoadingItem
