import store from 'store'

export function registerApp( key, config ) {
	store.dispatch( {
		type: 'REGISTER_APP',
		key,
		config,
	} )
}

export function setActiveApp( key ) {
	store.dispatch( {
		type: 'SET_ACTIVE_APP',
		key,
	} )
}
