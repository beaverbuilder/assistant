import { updateUserState } from 'utils/rest-api'

export default {
	SET_ACTIVE_APP: action => {
		updateUserState( { activeApp: action.key } )
	},
	SET_SHOW_UI: action => {
		updateUserState( { showUI: action.show } )
	},
}
