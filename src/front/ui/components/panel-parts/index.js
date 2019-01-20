import React from 'react'
import { Button, Icon } from 'components'
import './style.scss'

export const PanelFrame = ({ children }) => {
    const styles = {
        position: 'fixed',
        top: 0,
        bottom:0,
        right:0,
        left: 'auto',
        width: 440,
    }
    return (
        <div className="fl-asst-panel-frame" style={styles}>{children}</div>
    )
}

export const PanelHeader = ({ title, onClose }) => {
    return (
        <div className="fl-asst-panel-header">
            <div className="fl-asst-panel-title-bar">
                <div className="fl-asst-panel-title">
                    <Icon />
                    <span>{title}</span>
                </div>
                <div className="fl-asst-panel-title-actions">
                    <Button onClick={onClose}>
                        <Icon name="close" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export const PanelChrome = ({ tabs, activeTabName, onTabClick, onClose }) => {
    return (
        <div className="fl-asst-panel-chrome">
            <Button>
                <Icon name="notification-active" />
            </Button>

            <div className="fl-asst-app-tabs-area">
                { Object.keys(tabs).map( key => {
                    const tab = tabs[key]
                    const isSelected = ( key === activeTabName ) ? true : false
                    return (
                        <Button key={key} isSelected={isSelected} onClick={() => onTabClick(key)}>
                            <Icon />
                        </Button>
                    )
                }) }
            </div>

            <Button onClick={onClose}>
                <Icon name="close" />
            </Button>
        </div>
    )
}
