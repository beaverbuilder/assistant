import React from 'react'
import { __ } from '@wordpress/i18n'
import { getSystemConfig, useSystemState } from 'assistant/data'
import { Button, Icon } from 'assistant/ui'
import './style.scss'

const TileGrid = () => {
    const { counts } = useSystemState()
    const { currentPageView } = getSystemConfig()
	const { site, name, intro, actions } = currentPageView
	const { icon } = site
    return (
        <div className="fl-asst-tile-grid">
            <Button style={{ alignItems: 'flex-end' }} to="/fl-content/tab/post">
                <span style={{ fontSize: 33, fontWeight: 100 }}>{counts['content/post']}</span>
                <span>{__('Posts')}</span>
            </Button>
            <Button style={{ alignItems: 'flex-end' }} to="/fl-content/tab/page">
                <span style={{ fontSize: 33, fontWeight: 100 }}>{counts['content/page']}</span>
                <span>{__('Pages')}</span>
            </Button>
            <div style={{ padding: 0 }}>
                <img src={icon} />
            </div>
            <div style={{ gridColumnStart: 1, gridColumnEnd: '-1' }}>
                <div style={{ marginBottom: 5, textTransform: 'uppercase' }}>{intro}</div>
                <div style={{ fontSize: 16, fontWeight: 500 }}>{name}</div>
            </div>
        </div>
    )
}

TileGrid.Edit = () => null

export default TileGrid
