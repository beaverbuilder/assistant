import React, { Children, useState } from 'react'
import classname from 'classnames'
import { __ } from '@wordpress/i18n'
import { ToggleLayer } from 'react-laag'
import { Button, Icon } from '../../'
import './style.scss'

const Filter = ( { className, children, ...rest } ) => {
	const [showAll, setShowAll] = useState( false )
	const hasMore = Children.count( children ) > 3

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
				{ Children.map(children, (child, i) => {

					if ( hasMore && !showAll ) {
						return i > 2 ? null : child
					}
					return child
				}) }
			</ul>
			{ hasMore && (
				<div className="fl-asst-filter-more">
					<Button
						appearance="transparent"
						status="primary"
						title={__('More Options')}
						onClick={ () => setShowAll( !showAll ) }
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
							ref={ layerProps.ref }
							className="fl-asst-filter-menu"
							style={ {
								...layerProps.style,
								background: 'var(--fluid-background)',
								color: 'var(--fluid-color)',
								boxShadow: 'rgba(0, 0, 0, 0.25) 0px 6px 14px',
								padding: 'var(--fluid-med-space)',
								borderTop: '2px solid var(--fluid-primary-color)',
								minWidth: 120,
								maxWidth: 220,
							} }
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

export default Filter
