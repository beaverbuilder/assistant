import React, { useEffect } from 'react'
import { __ } from '@wordpress/i18n'
import classname from 'classnames'
import { Button, Icon, Layout } from 'assistant/ui'
import Card from '../card'
import useCards from '../use-cards'
import useCardTypes from '../use-card-types'
import './style.scss'

import SortableList from '../sortable-list'

const CardPage = ({
    page = 'home',
    isEditing = false,
    ...rest
}) => {
    const { cards, setPage, setCards } = useCards( page )

    // Listen for page prop changing and update hook
    useEffect( () => setPage( page ), [page] )

    return (
        <>
            <Layout.Box>
                <SortableList
                    items={cards}
                    setItems={ setCards }
                >
                { card => {
                    const {
                        id,
                        actions,
                        moveUp,
                        moveDown,
                        isFirst,
                        isLast,
                    } = card

                    const EditActions = () => (
                        <>
                            { ! isFirst && <Button
                                appearance="transparent"
                                onClick={ moveUp }
                            >
                                <Icon.UpCaret />
                            </Button> }
                            { ! isLast && <Button
                                appearance="transparent"
                                onClick={ moveDown }
                            >
                                <Icon.DownCaret />
                            </Button> }
                        </>
                    )

                    return (
                        <Card
                            key={id}
                            isEditing={ isEditing }
                            actions={ isEditing ? <EditActions /> : actions }
                            {...card}
                        />
                    )
                }}
                </SortableList>
            </Layout.Box>

            { /*
            <ul
                className="fl-asst-card-list"
                ref={ref}
                {...rest}
            >
                { cards.map( ( card, i ) => {
                    const [isDragging, setIsDragging] = useState(false)
                    const dragOriginY = useMotionValue(0)
                    const {
                        id,
                        content,
                        actions,
                        moveUp,
                        moveDown,
                        setPosition,
                        isFirst,
                        isLast,
                        className,
                        ...rest
                    } = card

                    const EditActions = () => (
                        <>
                            { ! isFirst && <Button
                                appearance="transparent"
                                onClick={ moveUp }
                            >
                                <Icon.UpCaret />
                            </Button> }
                            { ! isLast && <Button
                                appearance="transparent"
                                onClick={ moveDown }
                            >
                                <Icon.DownCaret />
                            </Button> }
                        </>
                    )

                    const onTop = {
                        zIndex: 1,
                    }
                    const flat = {
                        zIndex: 0,
                        transition: { delay: 0.3 },
                    }

                    const classes = classname({
                        'is-dragging' : isDragging
                    }, className )

                    const moveItem = ( i, dragOffset ) => {
                        const targetIndex = findIndex( i, dragOffset, positions )
                        if ( targetIndex !== i ) {
                            console.log('set', i, targetIndex )
                            setPosition( targetIndex )
                        }
                    }

                    return (
                        <Card
                            key={id}
                            isEditing={ isEditing }
                            actions={ isEditing ? <EditActions /> : actions }
                            className={ classes }

                            // Animation stuff
                            tag={motion.li}
                            animate={ isDragging ? onTop : flat }
                            whileTap={{ scale: 1.05 }}
                            drag="y"
                            dragOriginY={dragOriginY}
                            dragConstraints={{ top: 0, bottom: 0 }}
                            dragElastic={1}
                            onDragStart={() => setIsDragging(true)}
                            onDragEnd={() => setIsDragging(false)}
                            onDrag={( e, { point } ) => moveItem( i, point.y )}
                            positionTransition={({ delta }) => {
                                if ( isDragging ) {
                                    console.log('origin', dragOriginY.get() + delta.y )
                                    dragOriginY.set( dragOriginY.get() + delta.y )
                                }
                                return ! isDragging
                            }}

                            {...rest}
                        >
                            {content}
                        </Card>
                    )
                })}
            </ul>
            */ }

            { isEditing && (
                <div style={{ padding: '0 var(--fluid-lg-space)' }}>
                    <h2>{__('Available Cards')}</h2>
                    <CardTypesList />
                </div>
            )}
        </>
    )
}

const CardType = ({
    label,
    icon: TypeIcon  = () => {},
    insert = () => {},
    ...rest
}) => {

    return (
        <Button
            className="fl-asst-card-type"
            status="primary"
            onClick={ () => insert( 'home' ) }
            {...rest}
        >
            <span className="fl-asst-card-type-title">
                <TypeIcon />
                { label }
            </span>
            <span className="fl-asst-card-type-actions">
                <Icon.Plus />
            </span>
        </Button>
    )
}

const CardTypesList = () => {
    const types = useCardTypes()
    return (
        <ul className="fl-asst-card-type-list">
        { types.map( ( type, i ) => {
            return (
                <li
                    key={i}
                >
                    <CardType {...type} />
                </li>
            )
        })}
        </ul>
    )
}

export default CardPage
