import React, { useContext } from 'react'
import c from 'classnames'
import { motion } from 'framer-motion'
import CollectionContext from './context'
import * as Layout from '../layout'
import Button from '../button'

const Item = ({
    tag: Tag = motion.li,

    title,
    description,
    thumbnail,
    thumbnailProps,
    truncateTitle = true,

    onClick,
    href,
    to,

    className,
    children,
    ...rest
}) => {
    const { appearance } = useContext( CollectionContext )
    const Component = 'list' === appearance ? ListItem : GridItem

    const props = {
        title,
        truncateTitle,
        thumbnail,
        thumbnailProps,
        description,
    }
    const btnProps = {
        onClick,
        href,
        to,
        className: 'fluid-collection-item-primary-action',
        appearance: 'transparent',
    }

    return (
        <Tag
            layout
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className={ c( 'fluid-collection-item', className ) }
            {...rest}
        >
            <Button {...btnProps}>
                { ( title || thumbnail ) && <Component {...props}/>}
                {children}
            </Button>
        </Tag>
    )
}

const Thumbnail = ({ children, ratio, ...rest }) => {
    return (
        <div className="fluid-collection-item-thumbnail">
            <Layout.AspectBox
                ratio={ratio}
                {...rest}
            >
                {children}
            </Layout.AspectBox>
        </div>
    )
}

const Text = ({ title, description, truncate, ...rest }) => {

    if ( !title && ! description ) return null

    const titleClasses = c( 'fluid-item-title', {
        'fluid-truncate' : truncate,
    })

    return (
        <div className="fluid-collection-item-text">
            { title && <div className={titleClasses}>{title}</div> }
            { description && <div>{description}</div> }
        </div>
    )
}

const GridItem = ({ title, description, truncateTitle, thumbnail, thumbnailProps }) => {
    return (
        <div className="fluid-collection-item-grid-content">
            { thumbnail && <Thumbnail {...thumbnailProps}>{thumbnail}</Thumbnail>}
            <Text
                title={title}
                truncate={truncateTitle}
                description={description}
            />
        </div>
    )
}

const ListItem = ({ title, description, truncateTitle, thumbnail, thumbnailProps }) => {
    return (
        <div className="fluid-collection-item-list-content">
            { thumbnail && <Thumbnail {...thumbnailProps}>{thumbnail}</Thumbnail>}
            <Text
                title={title}
                truncate={truncateTitle}
                description={description}
            />
        </div>
    )
}

export default Item
