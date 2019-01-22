import store from 'store'
import { addApp } from 'store/actions'

export const registerApp = ( key, config ) => {
	store.dispatch( addApp( key, config ) )
}
