import React from 'react'
import classname from 'classnames'
import './style.scss'

export const TagGroup = ( { title, children, appearance, isDisabled } ) => {
	const classes = classname( {
		'fl-asst-tag-group': true,
		'fl-asst-tag-group-appearance-vibrant': 'vibrant' == appearance ? true : false,
		'fl-asst-tag-group-appearance-muted': 'muted' == appearance ? true : false,
		'fl-asst-tag-group-is-disabled': isDisabled,
	} )
	return (
		<div className={classes}>
			{ title && <div className="fl-asst-tag-group-title">{title}</div> }
			<div className="fl-asst-tag-group-content">{children}</div>
		</div>
	)
}

export const Tag = ({ children, onClick = () => {}, count, isSelected, isDisabled, href, target }) => {
	const classes = classname({
		'fl-asst-button' : true,
		'fl-asst-tag' : true,
		'is-selected' : isSelected,
		'is-disabled' : isDisabled,
	})
	if (href) {
		return (
			<a className={classes} href={href} target={target}>
				{children}
				{ count && <span className="fl-asst-tag-count">{count}</span> }
			</a>
		)
	} else {
		return (
			<button className={classes} onClick={onClick}>
				{children}
				{ count && <span className="fl-asst-tag-count">{count}</span> }
			</button>
		)
	}
}

export const TagGroupControl = ( { title, tags, value, appearance, onChange, isDisabled } ) => {
	return (
		<TagGroup title={title} appearance={appearance} isDisabled={isDisabled}>
			{ tags.map( ( tag, i ) => {
				const { label, count } = tag

				let isSelected = value == tag.value
				if ( Array.isArray( value ) ) {
					isSelected = JSON.stringify( value ) === JSON.stringify( tag.value )
				}

				return (
					<Tag
						key={i}
						count={count}
						onClick={() => onChange( tag.value )}
						isSelected={isSelected}
					>{label}</Tag>
				)
			} )}
		</TagGroup>
	)
}

export const ActionGroup = ({ actions = [], appearance }) => {
	return (
		<TagGroup appearance={appearance}>
		{ actions.map( (action, i) => {
			return (
				<Tag key={i} {...action}>{action.label}</Tag>
			)
		})}
		</TagGroup>
	)
}
