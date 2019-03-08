import React, { useState } from 'react'
import classname from 'classnames'
import { Button } from 'components'
import './style.scss'

export const TagGroup = props => {
	const { title, children, className, appearance, isDisabled } = props

	const classes = classname( {
		'fl-asst-tag-group': true,
		'fl-asst-tag-group-appearance-vibrant': 'vibrant' == appearance ? true : false,
		'fl-asst-tag-group-appearance-muted': 'muted' == appearance ? true : false,
		'fl-asst-tag-group-is-disabled': isDisabled,
	}, className )

	const merged = {
		...props,
		className: classes,
	}
	delete merged.title
	delete merged.appearance
	delete merged.isDisabled

	return (
		<div {...merged}>
			{ title && <div className="fl-asst-tag-group-title">{title}</div> }
			<div className="fl-asst-tag-group-content">{children}</div>
		</div>
	)
}

export const Tag = ( { appearance, children, onClick = () => {}, count, isSelected, isDisabled, href, target } ) => {
	const classes = classname( {
		'fl-asst-button': true,
		'fl-asst-tag': true,
		'is-selected': isSelected,
		'is-disabled': isDisabled,
		'is-warning': 'warning' === appearance,
	} )
	if ( href ) {
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

export const TagGroupControl = ( { title, tags, value, appearance, onChange, isDisabled, limit } ) => {
	const [ moreShowing, setMoreShowing ] = useState( false )
	const renderMoreTag = limit && tags.length > limit
	let items = tags

	if ( renderMoreTag && ! moreShowing ) {
		items = tags.filter( ( tag, i ) => i < limit )
	}

	return (
		<TagGroup title={title} appearance={appearance} isDisabled={isDisabled}>
			{ items.map( ( tag, i ) => {
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
			{ renderMoreTag &&
				<Button
					className='fl-asst-tag'
					onClick={() => setMoreShowing( ! moreShowing )}
				>{ moreShowing ? 'Less...' : 'More...' }</Button>
			}
		</TagGroup>
	)
}

export const ActionGroup = ( { actions = [], appearance } ) => {
	return (
		<TagGroup appearance={appearance}>
			{ actions.map( ( action, i ) => {
				return (
					<Tag key={i} {...action}>{action.label}</Tag>
				)
			} )}
		</TagGroup>
	)
}
