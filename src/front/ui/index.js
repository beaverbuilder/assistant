import React from 'react'
import { Button, Icon, Separator, CurrentTabContext } from 'components'
import { PanelFrame, PanelChrome, UIContext } from 'components'
import { TabManager, Tab } from 'components/tabs'
import { useStore, useDispatch } from 'store'
import './style.scss'

/**
 * Main UI Controller
 */
export const UI = ( { isShowing, toggleUI } ) => {
	const { apps, activeApp, panelPosition } = useStore()
	const { setActiveApp } = useDispatch()

	if ( ! isShowing ) {
		return null
	}

	return (
		<PanelFrame position={panelPosition}>
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
export const ShowUITrigger = ( { onClick } ) => {
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
			<Button className="fl-asst-outline-button" onClick={onClick} style={buttonStyles} isSelected={true}>
				<Icon name="trigger-button"/>
			</Button>
		</div>
	)
}
