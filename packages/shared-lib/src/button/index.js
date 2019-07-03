import React, { forwardRef, Children } from 'fl-react'
import { Link } from 'fl-react-router-dom'
import classname from 'fl-classnames'
import './style.scss'

export const Button = forwardRef( ( props, ref) => {
    const {
        className,
        to,
        href,
        onClick,
        isSelected = false,
        ...rest
    } = props

    const classes = classname({
        'fl-asst-button' : true,
        'fl-asst-is-selected' : isSelected,
    }, className )

    let newProps = {
        ...rest,
        ref,
        className: classes,
    }

    // Determine the tag for this button based on props.
    let Tag = 'button'
    if ( to || href ) {
        // Routing Link
        Tag = 'a'
        if ( href ) {
            newProps.href = href
        } else {
            Tag = Link
            newProps.to = to
        }
    } else {
        newProps.onClick = onClick
    }

    return (
        <Tag {...newProps} />
    )
})

const Rule = ({ direction: dir = 'horizontal', isHidden = false }) => {
    const classes = classname({
        'fl-asst-divider' : true,
        'fl-asst-vertical-divider' : 'vertical' === dir,
        'fl-asst-horizontal-divider' : 'horizontal' === dir,
        'fl-asst-is-hidden' : isHidden,
    })
    return (
        <hr className={classes} />
    )
}

Button.Group = ({ children: passedChildren, className, direction = 'row', ...rest }) => {
    const classes = classname({
        'fl-asst-button-group': true,
        [`fl-asst-button-group-${direction}`] : direction,
    }, className )

    let children = passedChildren
    const count = Children.count( passedChildren )

    if ( count > 0 ) {
        children = Children.map( passedChildren, ( child, i ) => {
            const isFirst = i === 0
            const shouldInsertDivider = !isFirst
            const shouldHideDivider = child.props.isSelected
            const dividerDirection = direction === 'row' ? 'vertical' : 'horizontal'
            return (
                <>
                    { shouldInsertDivider && <Rule direction={dividerDirection} isHidden={shouldHideDivider} /> }
                    {child}
                </>
            )
        })
    }

    return (
        <div className={classes} role="group" {...rest}>{children}</div>
    )
}
