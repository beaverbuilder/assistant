import { Libraries } from '@beaverbuilder/cloud-ui'
import cloud from 'assistant/cloud'
import { getAppState, getAppActions } from 'assistant/data'

export const state = {
	...Libraries.defaultAppState
}

export const actions = {
	...Libraries.defaultAppActions
}

export const reducers = {
	...Libraries.defaultAppReducers
}

export const loadLibraries = () => {
	const state = getAppState( 'libraries' )
	const actions = getAppActions( 'libraries' )

	Libraries.loadAppState( cloud, state, actions )
}
