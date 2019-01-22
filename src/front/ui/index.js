import React, { Fragment, useState } from 'react'
import { Button, Icon, VerticalGroup, Separator } from 'components'
import { PanelFrame, PanelChrome } from 'components/panel-parts'
import { TabManager, Tab } from 'components/tabs'
import store from 'store'
import 'apps/core'
import './style.scss'

/**
 * Main UI Controller
 */
const UI = ({ isShowing, toggleUI }) => {
	const { apps } = store.getState()
	const [ tabs, setTabs ] = useState(apps)
    const [ activeTabName, setActiveTabName ] = useState('fl-navigate')
    const { label, title } = tabs[activeTabName]

	store.subscribe( () => {
		setTabs( store.getState().apps )
	} )

    if ( !isShowing ) return null

    return (
        <PanelFrame>
            <div className="fl-asst-panel-wrap">
                <PanelChrome
                    tabs={tabs}
                    onTabClick={setActiveTabName}
                    activeTabName={activeTabName}
                    onClose={toggleUI}
                />
                <Separator isSlim={true} />

                <div className="fl-asst-panel-contents">
                    <TabManager activeTabName={activeTabName}>
                        {Object.keys(tabs).map( key => {
                            const tab = tabs[key]
                            return (
                                <Tab key={key} name={key}>{tab.content}</Tab>
                            )
                        })}
                    </TabManager>
                </div>
            </div>
        </PanelFrame>
    )
}

/**
 * Button To Show/Hide The UI
 */
const ShowUITrigger = ({ onClick }) => {
    const styles = {
        position: 'fixed',
        right: 0,
        bottom: 0,
        padding: 10
    }
    return (
        <div style={styles}>
            <Button className="fl-asst-outline-button" onClick={onClick}>
                <Icon />
                <span>Assistant</span>
            </Button>
        </div>
    )
}

export { UI, ShowUITrigger }
