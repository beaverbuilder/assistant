import { createStore } from 'redux'
import reducers from './reducers'

export default createStore( reducers, {
	activeApp: 'fl-navigate',
	apps: {},
	...FLAssistantInitialData,
} )
