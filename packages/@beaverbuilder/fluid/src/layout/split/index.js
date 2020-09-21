import React, { useState, useEffect } from 'react'
import c from 'classnames'
import './style.scss'

const Pane = ( {
	tag: Tag = 'div',
	className,
	children,
	size,
	style,
	...rest
} ) => {

	const width = Number.isInteger( size ) ? `${size}px` : size

	const styles = {
		...style,
		flex: 'undefined' !== typeof width && `0 0 ${width}`
	}

	return (
		<Tag
			className={ c( 'fluid-split-pane', className ) }
			style={ styles }
			{ ...rest }
		>
			{children}
		</Tag>
	)
}

const Split = ( {
	tag: Tag = 'div',
	panes = [],
	sizes = [ 240 ],
	className,

	// Drive internal state with props
	isShowingFirstPane = true,
	onToggleFirstPane = () => {},
	...rest
} ) => {
	const [ showFirst, setShowFirst ] = useState( isShowingFirstPane )
	const toggleFirstPane = () => {
		const val = ! showFirst
		setShowFirst( val )
		onToggleFirstPane( val )
	}

	// Keep state consistent with prop
	useEffect( () => setShowFirst( isShowingFirstPane ), [ isShowingFirstPane ] )

	const paneProps = {
		...rest,
		toggleFirstPane,
		isFirstPaneHidden: ! showFirst
	}

	return (
		<Tag
			className={ c( 'fluid-split', className ) }
			{ ...rest }
		>

			{ 0 < panes.length && panes.map( ( Content, i ) => {

				// Allow hidding the first pane
				if ( 0 === i && ! showFirst ) {
					return null
				}

				return (
					<Pane className="fluid-split-pane" key={ i } size={ sizes[i] }>
						<Content { ...paneProps } />
					</Pane>
				)
			} )}
		</Tag>
	)
}

export default Split
