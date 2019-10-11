import React, { useEffect, useState, useRef } from 'fl-react'
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
	const [ suggestOptions, setSuggestOptions ] = useState( null )
	const [ inputValue, setInputValue ] = useState( '' )
	const inputRef = useRef()

	const classes = classname( {
		'fl-asst-tag-group': true,
		'fl-asst-is-disabled': disabled,
	}, className )

	useEffect( () => {
		if ( 2 > inputValue.length ) {
			setSuggestOptions( null )
			return
		}
		const newOptions = []
		Object.keys( options ).map( key => {
			if ( options[ key ].includes( inputValue ) ) {
				newOptions[ key ] = options[ key ]
			}
		} )
		setSuggestOptions( Object.keys( newOptions ).length ? newOptions : null )
	}, [ inputValue ] )

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
			{ suggestOptions &&
				<div className='fl-asst-tag-group-suggest'>
					{ Object.keys( suggestOptions ).map( ( key, i ) => {
						return (
							<div
								key={ i }
								className='fl-asst-tag-group-suggest-item'
								onClick={ () => {
									onAdd( suggestOptions[ key ] )
									setInputValue( '' )
								} }
							>
								{ suggestOptions[ key ] }
							</div>
						)
					} ) }
				</div>
			}
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
