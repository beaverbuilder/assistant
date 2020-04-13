import React, { cloneElement } from 'react'
import { ToggleLayer } from 'react-laag'
import classname from 'classnames'
import Button from '../'
import './style.scss'

const Menu = ( { children, content, isShowing, className, style, ...rest } ) => {

	if ( ! isShowing ) {
		return children
	}

	return (
		<ToggleLayer
			isOpen={ true }
			closeOnOutsideClick={ true }
			placement={ {
				anchor: 'BOTTOM_RIGHT',
			} }
			renderLayer={ ( { layerProps, isOpen } ) => {
				return isOpen && (
					<div
						{ ...layerProps }
						{ ...rest }
						className={ classname( 'fl-asst-menu', layerProps.className, className ) }
						style={ {
							...style,
							...layerProps.style,
						} }
					>
						{content}
					</div>

				)
			} }
		>
			{( { triggerRef } ) => cloneElement( children, { ref: triggerRef } ) }
		</ToggleLayer>
	)
}

const Item = ( { className, ...rest } ) => {
	const classes = classname( 'fl-asst-menu-item', className )
	return (
		<Button
			className={ classes }
			appearance="transparent"
			{ ...rest }
		/>
	)
}
Menu.Item = Item
Menu.Item.displayName = 'Menu.Item'

export default Menu
