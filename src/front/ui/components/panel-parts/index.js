import React from 'react'
import { Button, AppTabButton, Icon } from 'components'
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

export const PanelChrome = ({ tabs, activeTabName, onTabClick, onClose }) => {
    return (
        <div className="fl-asst-panel-chrome">
            <AppTabButton>
                <Icon name="notification-active" />
            </AppTabButton>

            <div className="fl-asst-app-tabs-area">
                { Object.keys(tabs).map( key => {
                    const tab = tabs[key]
                    const isSelected = ( key === activeTabName ) ? true : false
                    return (
                        <AppTabButton key={key} isSelected={isSelected} onClick={() => onTabClick(key)}>
                            <Icon />
                        </AppTabButton>
                    )
                }) }
            </div>

            <Button onClick={onClose}>
                <Icon name="close" />
            </Button>
        </div>
    )
}

export const ScreenHeader = ({ children }) => {
    return (
        <div className="fl-asst-screen-header">{children}</div>
    )
}
