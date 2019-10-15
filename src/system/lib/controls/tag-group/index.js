import React from 'fl-react'
import classname from 'fl-classnames'
import { Button, Color, Icon } from 'lib'
import './style.scss'

export const TagGroup = ( {
	children,
	className,
	disabled = false,
	value = [],
	onRemove = () => {},
} ) => {

	const classes = classname( {
		'fl-asst-tag-group': true,
		'fl-asst-is-disabled': disabled,
	}, className )

	return (
		<div className={ classes }>
			{ value.map( ( v, i ) => {
				return (
					<Tag
						key={ i }
						onRemove={ () => onRemove( v, i ) }
						{ ...v }
					/>
				)
			} )}
			{ children }
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
