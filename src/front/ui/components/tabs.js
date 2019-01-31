import React from 'react'

export const Tab = ( { children, isSelected } ) => {
	return (
		<div className="fl-asst-tab" hidden={ ! isSelected }>{children}</div>
	)
}
