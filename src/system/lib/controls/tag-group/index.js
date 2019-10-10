import React, { useState, useRef } from 'fl-react'
import classname from 'fl-classnames'
import { Button, Color, Icon } from 'lib'
import './style.scss'

export const TagGroup = ( {
	className,
	disabled = false,
	options = [],
	value = [],
	onRemove = () => {},
	onAdd = () => {},
} ) => {
	const [ inputValue, setInputValue ] = useState( '' )
	const inputRef = useRef()

	const classes = classname( {
		'fl-asst-tag-group': true,
		'fl-asst-is-disabled': disabled,
	}, className )

	return (
		<div className={ classes }
			onClick={ () => inputRef.current.focus() }
		>
			{ value.map( ( v, i ) => {
				if ( v in options ) {
					return (
						<Tag
							key={ i }
							label={ options[ v ] }
							onRemove={ () => onRemove( v, i ) }
						/>
					)
				}
			} )}
			<input
				type='text'
				ref={ inputRef }
				value={ inputValue }
				size={ inputValue.length + 1 }
				onChange={ e => setInputValue( e.target.value ) }
				onKeyDown={ e => {
					if ( 13 === e.keyCode ) {
						e.preventDefault()
						onAdd( inputValue )
						setInputValue( '' )
					}
				} }
			/>
		</div>
	)
}

export const Tag = ( {
	className,
	label,
	color,
	onRemove = () => {}
} ) => {

	const classes = classname( {
		'fl-asst-tag': true,
	}, className )

	const knownColors = Color.knownColors
	let tagColor = color
	if ( color && Object.keys( knownColors ).includes( color ) ) {
		tagColor = knownColors[color]
	}

	return (
		<div className={ classes }>
			{ color && <div className="fl-asst-tag-color" style={ { background: tagColor } } /> }
			{ label && <div className="fl-asst-tag-label">{label}</div> }
			<Button className="fl-asst-tag-remove-btn" appearance="transparent" onClick={ onRemove }>
				<Icon.CloseCompact />
			</Button>
		</div>
	)
}
