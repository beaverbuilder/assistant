import React from 'react'

export const ContentListContainer = ( { className, children } ) => {
	return (
		<ul className={ className }>
			{ children }
		</ul>
	)
}

export const ContentListItem = ( { className, title } ) => {
	return (
		<li className={ className }>
			{ title }
		</li>
	)
}
