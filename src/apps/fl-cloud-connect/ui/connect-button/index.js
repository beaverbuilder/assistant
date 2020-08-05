import React from 'react'
import { __ } from '@wordpress/i18n'
import { Button } from 'assistant/ui'
import Plugs from './plugs'
import './style.scss'

const ConnectButton = ({ children, ...rest }) => {
    return (
        <Button
            className="fl-asst-connect-button"
            size="lg"
            {...rest}
        >
            <Plugs style={{ marginRight: 20 }} />
            {children}
        </Button>
    )
}

export default ConnectButton
