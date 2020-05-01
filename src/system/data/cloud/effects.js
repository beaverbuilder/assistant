import cloud from 'utils/cloud'

/**
 * Effects that fire after an action.
 */
export const after = {

	SET_CLOUD_USER: ( action, store ) => {
		const { cloudUser } = store.getState()
		cloud.session.setUser( cloudUser )
	},
}
