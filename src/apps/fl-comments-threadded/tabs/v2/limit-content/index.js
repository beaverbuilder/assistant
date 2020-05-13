import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { __ } from '@wordpress/i18n'
import { Button } from 'assistant/ui'
import './style.scss'

const LimitContent = ({
    children,
    label = __('Expand')
}) => {
    const [isExpanded, setIsExpanded] = useState( false )

    return (
        <div className="fl-asst-limit-content">
            <motion.div
                className="fl-asst-limit-content-cell"
                initial={false}
                animate={ isExpanded ? 'expanded' : 'hidden' }
                variants={{
                    expanded: {
                        height: 'auto',
                        transition: { ease: 'easeInOut' }
                    },
                    hidden: {
                        height: 200,
                        transition: { ease: 'easeInOut' }
                    }
                }}
            >
                {children}
                { ! isExpanded && <div className="fl-asst-limit-content-fadeout" /> }
            </motion.div>
            <div className="fl-asst-limit-content-controls">
                <Button
                    onClick={ e => {
                        setIsExpanded( ! isExpanded )
                        e.stopPropagation()
                        e.preventDefault()
                    } }
                    appearance="transparent"
                >{label}</Button>
            </div>
        </div>
    )
}

export default LimitContent
