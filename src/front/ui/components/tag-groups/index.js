import React from 'react'
import classname from 'classnames'
import './style.scss'

export const TagGroup = ({ title, children, appearance }) => {
    const classes = classname({
        'fl-asst-tag-group' : true,
        'fl-asst-tag-group-appearance-vibrant' : 'vibrant' == appearance ? true : false,
        'fl-asst-tag-group-appearance-muted' : 'muted' == appearance ? true : false,
    })
    return (
        <div className={classes}>
            { title && <div className="fl-asst-tag-group-title">{title}</div> }
            <div className="fl-asst-tag-group-content">{children}</div>
        </div>
    )
}

export const Tag = ({ children, onClick = () => {}, count, isSelected }) => {
    const classes = classname({
        'fl-asst-tag' : true,
        'is-selected' : isSelected,
    })

    return (
        <button className={classes} onClick={onClick}>
            {children}
            { count && <span className="fl-asst-tag-count">{count}</span> }
        </button>
    )
}

export const TagGroupControl = ({ title, tags, appearance, onChange = () => {} }) => {
    return (
        <TagGroup title={title} appearance={appearance}>
            { tags.map( (tag, i) => {
                const { label, value, count } = tag
                const isSelected = false
                return (
                    <Tag
                        key={i}
                        count={count}
                        onClick={() => onChange(value)}
                        isSelected={isSelected}
                    >{label}</Tag>
                )
            })}
        </TagGroup>
    )
}
