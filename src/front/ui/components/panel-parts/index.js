import React, { useContext, useState } from 'react'
import classname from 'classnames'
import { Button, AppTabButton, Icon, CurrentTabContext } from 'components'
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

            <div className="fl-asst-panel-chrome-area">
                <AppTabButton onClick={ () => onTabClick('fl-notifications')} isSelected={ activeTabName === 'fl-notifications' ? true : false }>
                    <Icon name="notifications-active" />
                </AppTabButton>
            </div>

            <div className="fl-asst-app-tabs-wrap">
                <div className="fl-asst-app-tabs-area">
                    { Object.keys(tabs).map( key => {
                        const tab = tabs[key]
                        const isSelected = ( key === activeTabName ) ? true : false

                        if ( tab.showTabIcon === false ) return null

                        return (
                            <AppTabButton key={key} isSelected={isSelected} onClick={() => onTabClick(key)}>{tab.icon}</AppTabButton>
                        )
                    }) }
                </div>
            </div>

            <div className="fl-asst-panel-chrome-area">
                <Button onClick={onClose}>
                    <Icon name="close" />
                </Button>
            </div>
        </div>
    )
}

export const ScreenHeader = ({ children, showTitle, title }) => {
    const tab = useContext(CurrentTabContext)
    const screenTitle = title ? title : tab.label
    return (
        <div className="fl-asst-screen-header">
            { showTitle !== false && <div className="fl-asst-screen-title">{screenTitle}</div> }
            {children}
        </div>
    )
}

export const ExpandedContents = ({ children }) => {
    /*
    const [isExpanded, setIsExpanded ] = useState(false)
    const toggleExpanded = () => {
        isExpanded ? setIsExpanded(false) : setIsExpanded(true)
    }*/
    return (
        <div className="fl-asst-screen-header-expanded-contents">{children}</div>
    )
}

export const EmptyMessage = ({ children }) => {
    return (
        <div className="fl-asst-empty-message">{children}</div>
    )
}
