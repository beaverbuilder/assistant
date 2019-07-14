import { registerAppStore } from '../app'
import { updateUserState } from 'shared-utils/wordpress'
import cloud from 'shared-utils/cloud'
import {setDoingLogin, setCloudToken, setCloudUser, setIsCloudConnected, addError,  clearErrors, clearNotices} from "./actions";

/**
 * Effects that fire before an action.
 */
export const before = {

	REGISTER_APP: ( action ) => {
		registerAppStore( {
			key: action.key,
			...action.config,
		} )
	},
}

/**
 * Effects that fire after an action.
 */
export const after = {

	DO_LOGIN: (action, store) => {
		store.dispatch(setDoingLogin(true));
		store.dispatch(clearErrors());
		store.dispatch(clearNotices());


		cloud.auth.login(action.email, action.password)
			.then((token) => {
				store.dispatch(clearErrors());
				store.dispatch(setCloudToken(token));
				store.dispatch(setIsCloudConnected(true));
			})
			.catch(error => {
				console.log('login error', error);
				if(error.status == 401 ) {
					store.dispatch(addError("Invalid Credentials"));
				}
				store.dispatch(setIsCloudConnected(false));
			})
			.finally(() => store.dispatch(setDoingLogin(false)));
	},
	DO_LOGOUT: (action, store) => {
		cloud.auth.logout().then(() => {
			store.dispatch(setDoingLogin(true));
			store.dispatch(setCloudToken(null));
			store.dispatch(setCloudUser(null));
			store.dispatch(setDoingLogin(false));
			store.dispatch(setIsCloudConnected(false));
		})
	},
	SET_CLOUD_TOKEN: (action, store) => {
		if(action.cloudToken !== null) {
			cloud.auth.me().then((user) => {
				store.dispatch(setCloudUser(user));
			})
		}
	},
	SET_SHOULD_REDUCE_MOTION: ( action, store ) => {
		const { shouldReduceMotion } = store.getState()
		updateUserState( { shouldReduceMotion } )
	},

	SET_APP_POSITION: ( action, store ) => {
		const { appOrder } = store.getState()
		updateUserState( { appOrder } )
	},

	SET_WINDOW: ( action, store ) => {
		const { window } = store.getState()
		updateUserState( { window: {...window} } )
	},
	SET_BRIGHTNESS: ( action, store ) => {
		const { appearance } = store.getState()
		updateUserState( { appearance } )
	},

	SET_SHOULD_SHOW_LABELS: ( action, store ) => {
		const { shouldShowLabels } = store.getState()
		updateUserState( { shouldShowLabels } )
	},

	SET_HISTORY: ( action, store ) => {
		const { history } = store.getState()
		updateUserState( { history } )
	},

	SET_SEARCH_HISTORY: ( action, store ) => {
		const { searchHistory } = store.getState()
		updateUserState( { searchHistory } )
	},
	SET_LOGIN_SUCCESS: async( action, store ) => {
		// const user = await cloud.auth.me();
		// cloud.auth.setUser(user);
		console.log('effect - user succsesfully logged in');
	}
}
