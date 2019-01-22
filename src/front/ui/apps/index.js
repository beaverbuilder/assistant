import store from 'store'
import { addApp, updateActiveApp } from 'store/actions'

export const registerApp = ( key, config ) => {
	store.dispatch( addApp( key, config ) )
}

export const setActiveApp = ( key ) => {
	store.dispatch( updateActiveApp( key ) )
}
