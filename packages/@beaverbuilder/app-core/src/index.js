const app = {
    handle: '',
    label: '',
    render: () => null,
    icon: () => null,
    isEnabled: true
}

const createAppState = ( defaultApp = app ) => {
    return {
        reducers: {
            apps: ( state = {}, action ) => {
            	switch ( action.type ) {
            	case 'REGISTER_APP':
            		return {
            			[ action.handle ]: {
            				...defaultApp,
            				handle: action.handle,
            				...action.config,
            			},
            			...state,
            		}
                case 'UNREGISTER_APP':
                    delete state[ action.handle ]
                    return {
                        ...state
                    }
                case 'UPDATE_APP':
                    return {
                        ...state[ action.handle ],
                        ...action.state,
                        ...state,
                    }
            	default:
            		return state
            	}
            },
            order: ( state = [], action ) => {
                switch ( action.type ) {
                case 'REGISTER_APP':

                    // Is it already in the array?
                    // If not, push it on the end

                default:
                    return state
                }
            },
        },
        actions: {
            registerApp: ( handle = '', config = {} ) => ({
                type: 'REGISTER_APP',
                handle,
                config,
            }),
            unregisterApp: ( handle = '' ) => ({
                type: 'UNREGISTER_APP',
                handle,
            }),
            updateApp: ( handle = '', state = {} ) => ({
                type: 'UPDATE_APP',
                state,
            })
        },
    }
}

export default createAppState
