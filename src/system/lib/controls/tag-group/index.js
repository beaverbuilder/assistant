import React from 'fl-react'
import classname from 'fl-classnames'
import { Button } from 'lib'
import './style.scss'

export const TagGroup = ( { value: tags, className } ) => {

	const classes = classname( {
		'fl-asst-tag-group': true,
	}, className )

	return (
		<div className={ classes }>
			{ Object.values( tags ).map( ( tag, i ) => <Tag key={ i } { ...tag } /> )}
		</div>
	)
}

const knownColors = {
	red: '#FF305C',
	blue: '#1BADF8',
	green: '#00D281',
	yellow: '#FFD000',
	orange: '#FF9500',
	purple: '#CC73E1',
	pink: '#FF2968',
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

	let tagColor = color
	if ( color && Object.keys( knownColors ).includes( color ) ) {
		tagColor = knownColors[color]
	}

	return (
		<div className={ classes }>
			{ color && <div className="fl-asst-tag-color" style={ { background: tagColor } } /> }
			{ label && <div className="fl-asst-tag-label">{label}</div> }
			<Button className="fl-asst-tag-remove-btn" appearance="transparent" onClick={ onRemove }>X</Button>
		</div>
	)
}
