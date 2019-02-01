import React, { useContext, useRef } from 'react'
import {
	Button,
	Icon,
	Separator,
	Tab,
	PanelFrame,
	PanelChrome,
	Stack,
	AppContext,
	UIContext,
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
	const scrollParent = useRef( null )

	return (
		<PanelFrame position={panelPosition} isShowing={isShowingUI}>
			<div className="fl-asst-panel-wrap">
				<PanelChrome
					tabs={apps}
					onTabClick={setActiveApp}
					activeTabName={activeApp}
					onClose={toggleIsShowingUI}
				/>
				<Separator isSlim={true} />

				<div className="fl-asst-panel-contents" ref={scrollParent}>
					{Object.keys( apps ).map( key => {
						const app = Object.assign( {}, apps[ key ] )
						app.isActive = app.app === activeApp ? true : false
						app.scrollParent = scrollParent
						return (
							<AppContext.Provider key={key} value={app}>
								<Tab name={key} isSelected={app.isActive}>
									<Stack>
										{ app.content() }
									</Stack>
								</Tab>
							</AppContext.Provider>
						)
					} )}
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
