import React, { Children, useState } from 'react'
import classname from 'classnames'
import { __ } from '@wordpress/i18n'
import { ToggleLayer } from 'react-laag'
import ResizeObserver from 'resize-observer-polyfill'
import { Button, Icon } from '../../'
import { RadioGroupItem } from './items'
import './style.scss'

const Filter = ( { className, children, ...rest } ) => {
	const [ showAll, setShowAll ] = useState( false )
	const hasMore = 3 < Children.count( children )

	const classes = classname( {
		'fl-asst-filter': true,
	}, className )

	const style = {
		display: 'grid',
		gridTemplateColumns: 'repeat(3, 1fr)',
		gridAutoRows: 'minmax(40px, 50px)',
		gridGap: 'var(--fluid-sm-space)'
	}

	return (
		<>
			<ul className={ classes } style={ style } { ...rest }>
				{ Children.map( children, ( child, i ) => {

					if ( hasMore && ! showAll ) {
						return 2 < i ? null : child
					}
					return child
				} ) }
			</ul>
			{ hasMore && (
				<div className="fl-asst-filter-more">
					<Button
						appearance="transparent"
						status="primary"
						title={ __( 'More Options' ) }
						onClick={ () => setShowAll( ! showAll ) }
					>
						<svg width="40" height="4" viewBox="0 0 40 4" version="1.1" xmlns="http://www.w3.org/2000/svg">
							<path d="M2,2 L38,2" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
						</svg>
					</Button>
				</div>
			)}
		</>
	)
}

const Item = ( { title, subtitle, children } ) => {
	const [ isOpen, setIsOpen ] = useState( false )
	const toggle = () => setIsOpen( ! isOpen )

	return (
		<li className="fl-asst-filter-item">
			<ToggleLayer
				isOpen={ isOpen }
				ResizeObserver={ ResizeObserver }
				placement={ {
					anchor: 'BOTTOM_LEFT',
					possibleAnchors: [ 'BOTTOM_LEFT', 'BOTTOM_RIGHT' ],
					triggerOffset: 4,
					autoAdjust: true,
				} }
				onOutsideClick={ () => setIsOpen( false ) }
				renderLayer={ ( { layerProps, isOpen } ) => {

					if ( ! children ) {
						return null
					}

					return isOpen && (
						<div
							{ ...layerProps }
							className={ classname( 'fl-asst-filter-menu', layerProps.className ) }
						>{children}</div>
					)
				} }
			>
				{( { triggerRef } ) => (
					<Button
						ref={ triggerRef }
						onClick={ toggle }
						className="fl-asst-filter-button"
						status="primary"
					>
						<span className="fl-asst-filter-button-content">
							<span className="fl-asst-filter-button-title">{title}</span>
							{ subtitle && <span className="fl-asst-filter-button-subtitle">{subtitle}</span> }
						</span>
						<span className="fl-asst-filter-button-caret">
							<Icon.DownCaretSmall />
						</span>
					</Button>
				)}
			</ToggleLayer>
		</li>
	)
}

Filter.Item = Item
Filter.Item.displayName = 'Filter.Item'

const ButtonItem = ( { children, className, ...rest } ) => {
	const classes = classname( 'fl-asst-filter-button', className )
	return (
		<li className="fl-asst-filter-item">
			<Button status="primary" className={ classes } { ...rest }>{children}</Button>
		</li>
	)
}

Filter.Button = ButtonItem
Filter.Button.displayName = 'Filter.Button'

Filter.RadioGroupItem = RadioGroupItem
Filter.RadioGroupItem.displayName = 'Filter.RadioGroupItem'

export default Filter
