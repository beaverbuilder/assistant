
export const defaultState = {
    isAppHeaderExpanded: false,
}

export const defaultActions = {
    setIsAppHeaderExpanded: value => {
    	return {
    		type: 'SET_IS_APP_HEADER_EXPANDED',
    		value,
    	}
    }
}

export const defaultReducers = {}

export const defaultEffects = {}
