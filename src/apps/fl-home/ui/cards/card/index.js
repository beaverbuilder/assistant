import React from 'react'
import classname from 'classnames'
import './style.scss'

const Card = ({
    className,
    children,
    title,
    actions,
    tag: Tag = 'div',
    contentTag: ContentTag = 'div',
    isEditing = false,
    ...rest
}) => {

    const classes = classname({
        'fl-asst-card': true,
        'fl-asst-card-is-editing' : isEditing,
    }, className )

    return (
        <Tag className={classes} {...rest}>
            { title && <div className="fl-asst-card-title">
                <span className="fl-asst-card-title-text">{title}</span>
                { actions && <span className="fl-asst-card-title-actions">{actions}</span> }
            </div> }
            <ContentTag className="fl-asst-card-content">
                {children}
            </ContentTag>
        </Tag>
    )
}

export default Card
