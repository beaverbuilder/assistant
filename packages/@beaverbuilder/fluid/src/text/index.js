import React from 'react'
import classname from 'classnames'
import './style.scss'

const Title = ({
    tag: Tag = 'div',
    eyebrow,
    eyebrowTag: Eyebrow = 'div',
    subtitle,
    subtitleTag: Subtitle = 'div',
    children,
    className,
    ...rest
}) => {
    const classes = classname( 'fluid-text-title', className )
    return (
        <Tag className={classes} {...rest}>
            { eyebrow && <Eyebrow className="fluid-text-eyebrow">{eyebrow}</Eyebrow> }
            <span style={{ display: 'inline-flex' }}>{ children }</span>
            { subtitle && <Subtitle className="fluid-text-subtitle">{subtitle}</Subtitle> }
        </Tag>
    )
}

// Keeps content centered and at a ledgible line length
const ContentArea = ({ tag: Tag = 'div', style = {}, ...rest }) => {
    const styles = {
        maxWidth: '60ch',
        marginLeft: 'auto',
        marginRight: 'auto',
        ...style,
    }
    return (
        <Tag style={styles} {...rest} />
    )
}

export {
    Title,
    ContentArea,
}
