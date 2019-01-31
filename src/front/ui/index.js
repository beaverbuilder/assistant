import React, { useContext } from 'react'
import {
	Button,
	Icon,
	Separator,
	Tab,
	TabManager,
	CurrentTabContext,
	PanelFrame,
	PanelChrome,
	UIContext
} from 'components'

import { useStore, useDispatch } from 'store'
import './style.scss'

/**
 * Main UI Controller
 */
export const UI = () => {
	const { apps, activeApp, panelPosition } = useStore()
	const { setActiveApp } = useDispatch()
	const { isShowingUI, toggleIsShowingUI } = useContext( UIContext )

	if ( ! isShowingUI ) {
		return null
	}

	return (
		<PanelFrame position={panelPosition}>
			<div className="fl-asst-panel-wrap">
				<PanelChrome
					tabs={apps}
					onTabClick={setActiveApp}
					activeTabName={activeApp}
					onClose={toggleIsShowingUI}
				/>
				<Separator isSlim={true} />

				<div className="fl-asst-panel-contents">
					<TabManager activeTabName={activeApp}>
						{Object.keys( apps ).map( key => {
							const tab = apps[key]
							return (
								<Tab key={key} name={key}>
									<CurrentTabContext.Provider value={tab}>
										{tab.content()}
									</CurrentTabContext.Provider>
								</Tab>
							)
						} )}
					</TabManager>
				</div>
			</div>
		</PanelFrame>
	)
}

/**
 * Button To Show/Hide The UI
 */
export const ShowUITrigger = () => {
	const { toggleIsShowingUI } = useContext( UIContext )

	const styles = {
		position: 'fixed',
		right: 0,
		bottom: 0,
		padding: 10,
		zIndex: 999,
	}
	const buttonStyles = {
		borderRadius: '8px'
	}
	return (
		<div style={styles}>
			<Button className="fl-asst-outline-button" onClick={toggleIsShowingUI} style={buttonStyles} isSelected={true}>
				<Icon name="trigger-button"/>
			</Button>
		</div>
	)
}
