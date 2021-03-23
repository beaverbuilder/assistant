import React from 'react'
import c from 'classnames'
import './style.scss'

export const SidebarBackdrop = ( { className, ...rest } ) => (
	<div
		className={ c( 'fl-asst-sidebar-backdrop', className ) }
		{ ...rest }
	/>
)

export const SidebarSection = ( {
	title,
	className,
	children,
	...rest
} ) => {

	return (
		<div
			className={ c( 'fl-asst-sidebar-section', className ) }
			{ ...rest }
		>
			{ title && (
				<div className="fl-asst-sidebar-section-title">
					{title}
				</div>
			) }
			<div>{children}</div>
		</div>
	)
}
