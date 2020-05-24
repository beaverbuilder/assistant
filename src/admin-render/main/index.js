import React from 'react'
import { App as FLUIDApp } from 'fluid/ui'
import { Env, App } from 'assistant/ui'
import { useSystemState, getSystemActions } from 'assistant/data'
import Sidebar from './sidebar'
import AppMain from '../app'
import './style.scss'

const getRouterProps = history => {
	const props = {
		initialIndex: history.index,

		/* do NOT include a default for initialEntries */
	}
	if ( history.entries && history.entries.length ) {
		props.initialEntries = history.entries
	}
	return props
}

const AssistantAdmin = () => {
    const { appearance, history } = useSystemState( ( state, newState ) => {
		return (
			state.appearance.brightness !== newState.appearance.brightness ||
			state.isAppHidden !== newState.isAppHidden
		// We only need history initially - we're not listening for changes
		)
	} )

	const { setHistory } = getSystemActions()
	const { brightness = 'light' } = appearance
	const onHistoryChanged = history => setHistory( history.index, history.entries )

    return (
        <FLUIDApp.Root
			routerProps={ getRouterProps( history ) }
			onHistoryChanged={ onHistoryChanged }
			colorScheme={ brightness }
		>
            <Env.Provider>
                <App.Provider>
                    <UI />
                </App.Provider>
            </Env.Provider>
        </FLUIDApp.Root>
    )
}

const UI = () => {
    return (
        <div className="fl-asst-page-wrap">
            <Sidebar />
            <AppMain />
        </div>
    )
}

export default AssistantAdmin
