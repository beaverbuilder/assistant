import React from 'react'
import { __ } from '@wordpress/i18n'
import { Icon, Layout } from 'assistant/ui'
import Branding from '../branding'
import './style.scss'

const ConnectCard = ({ children }) => {
    return (
        <Layout.Box className="fl-asst-connect-card">
            <Icon.Pencil size={70} />
            <Branding style={{ marginTop: 10 }} />
            {children}
        </Layout.Box>
    )
}

export default ConnectCard
