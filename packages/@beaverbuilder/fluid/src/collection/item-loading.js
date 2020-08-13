import React from 'react'
import Item from './item'

const LoadingItem = ( { ...rest } ) => (
	<Item
		thumbnail={ true }
		title="loading..."
		{ ...rest }
	/>
)

export default LoadingItem
