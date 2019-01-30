import React from 'react'
import { Stack } from 'components'

export const TabManager = ( { activeTabName, children } ) => {
	return React.Children.map( children, child => {
		const isSelected = child.props.name === activeTabName ? true : false
		return React.cloneElement( child, { isSelected: isSelected } )
	} )
}

export const Tab = ( { children, isSelected } ) => {
	return (
		<div className="fl-asst-tab" hidden={ ! isSelected }>
			<Stack>
				{children}
			</Stack>
		</div>
	)
}
