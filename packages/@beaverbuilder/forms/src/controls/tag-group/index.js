import React from 'react'
import classname from 'classnames'
import { Button, Icon } from '@beaverbuilder/fluid'
import './style.scss'

export const TagGroup = ( {
	children,
	className,
	disabled = false,
	value = [],
	onRemove = () => {},
	colors = {}
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
						onRemove={ () => onRemove( v ) }
						colors={ colors }
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
	onRemove = () => {},
	color,
	colors = {}
} ) => {

	const classes = classname( {
		'fl-asst-tag': true,
	}, className )

	let tagColor = color
	if ( color && Object.keys( colors ).includes( color ) ) {
		tagColor = colors[ color ]
	}

	return (
		<div className={ classes }>
			{ tagColor && <div className="fl-asst-tag-color" style={ { background: tagColor } } /> }
			{ label && <div className="fl-asst-tag-label">{ label }</div> }
			<Button className="fl-asst-tag-remove-btn" appearance="transparent" onClick={ onRemove }>
				<Icon.CloseCompact />
			</Button>
		</div>
	)
}
