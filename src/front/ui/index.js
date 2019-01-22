import React, { Fragment, useState } from 'react'
import { connect } from 'react-redux'
import { Button, Icon, VerticalGroup, Separator } from 'components'
import { PanelFrame, PanelChrome } from 'components/panel-parts'
import { TabManager, Tab } from 'components/tabs'
import { updateActiveApp } from 'store/actions'
import 'apps/core'
import './style.scss'

/**
 * Main UI Controller
 */
const UI = ( {
	isShowing,
	toggleUI,
	apps,
	activeApp,
	setActiveApp,
} ) => {
    const { label, title } = apps[ activeApp ]

    if ( !isShowing ) return null

    return (
        <PanelFrame>
            <div className="fl-asst-panel-wrap">
                <PanelChrome
                    tabs={apps}
                    onTabClick={setActiveApp}
                    activeTabName={activeApp}
                    onClose={toggleUI}
                />
                <Separator isSlim={true} />

                <div className="fl-asst-panel-contents">
                    <TabManager activeTabName={activeApp}>
                        {Object.keys(apps).map( key => {
                            const tab = apps[key]
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

export default connect(
	state => {
		return {
			activeApp: state.activeApp,
			apps: state.apps,
		}
	},
	dispatch => {
		return {
			setActiveApp: key => {
				dispatch( updateActiveApp( key ) )
			}
		}
	}
)( UI )

/**
 * Button To Show/Hide The UI
 */
export const ShowUITrigger = ({ onClick }) => {
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
