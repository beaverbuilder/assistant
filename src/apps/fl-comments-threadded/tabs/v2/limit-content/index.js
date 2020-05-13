import React, { useState, useRef, useLayoutEffect } from 'react'
import { motion, useMotionValue } from 'framer-motion'
import { __ } from '@wordpress/i18n'
import { Button } from 'assistant/ui'
import './style.scss'

const LimitContent = ({
    children,
    maxHeight = 200
}) => {
    const [needsTruncate, setNeedsTruncate] = useState( false )
    const [isOpen, setIsOpen] = useState( false )
    const container = useRef( null )

    const toggleIsOpen = () => setIsOpen( !isOpen )

    useLayoutEffect( () => {
        if ( container.current && container.current.offsetHeight > maxHeight ) {
            setNeedsTruncate( true )
        } else {
            setIsOpen( true )
        }
    }, [])

    const variants = {
        open: { height: 'auto', transition: { ease: 'easeInOut' } },
        truncated: { height: maxHeight, transition: { ease: 'easeInOut' } }
    }

    return (
        <div className="fl-asst-limit-content">
            { ! needsTruncate && (
                <div className="fl-asst-limit-content-cell">
                    <div ref={container}>{children}</div>
                </div>
            )}
            { needsTruncate && (
                <motion.div
                    className="fl-asst-limit-content-cell"
                    initial={ false }
                    animate={ isOpen ? 'open' : 'truncated' }
                    variants={variants}
                >
                    <div ref={container}>{children}</div>

                    { needsTruncate && (
                        <motion.div
                            className="fl-asst-limit-content-fadeout"
                            initial={false}
                            animate={ isOpen ? 'open' : 'truncated' }
                            variants={{
                                open: { opacity: 0 },
                                truncated: { opacity: 1 }
                            }}
                        />
                    ) }

                </motion.div>
            )}
            { needsTruncate && <div className="fl-asst-limit-content-controls">
                <Button
                    onClick={ e => {
                        toggleIsOpen()
                        e.stopPropagation()
                        e.preventDefault()
                    } }
                    appearance="transparent"
                >{ ! isOpen ? __('Show More') : __('Show Less')}</Button>
            </div> }
        </div>
    )
}

export default LimitContent
