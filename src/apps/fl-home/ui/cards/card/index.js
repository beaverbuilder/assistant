import React from 'react'
import classname from 'classnames'
import './style.scss'

const Card = ({
    className,
    children,
    title,
    icon: CardIcon,
    actions,
    tag: Tag = 'div',
    contentTag: ContentTag = 'div',
    contentProps,
    isEditing = false,
    type, // Remove from rest
    ...rest
}) => {

    const classes = classname({
        'fl-asst-card': true,
        'fl-asst-card-is-editing' : isEditing,
    }, className )

    return (
        <Tag className={classes} {...rest}>
            { title && <div className="fl-asst-card-title">
                <span className="fl-asst-card-title-text">
                    <CardIcon />
                    {title}
                </span>
                { actions && <span className="fl-asst-card-title-actions">{actions}</span> }
            </div> }
            <ContentTag className="fl-asst-card-content" {...contentProps}>
                {children}
            </ContentTag>
        </Tag>
    )
}

export default Card
