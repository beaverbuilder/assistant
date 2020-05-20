import React from 'react'
import { Layout, Icon } from 'assistant/ui'
import AppsWidget from './apps'
import RecentContentWidget from './recent-content'
import './style.scss'

const Widgets = () => {
    return (
        <ul className="fl-asst-widget-list">
            <li>
                <Layout.Box style={{ paddingTop: 0 }}>
                    <RecentContentWidget />
                </Layout.Box>
            </li>
            <li>
                <Layout.Box style={{ paddingTop: 0 }}>
                    <AppsWidget />
                </Layout.Box>
            </li>
            <li>
                <Layout.Row padY={true}>
                    <Icon.Pencil />
                </Layout.Row>
            </li>
        </ul>
    )
}

export default Widgets
