import { createStoreRegistry } from 'utils/store'

export const {
	registerStore,
	useStore,
	getStore,
	getDispatch,
	getSelectors
} = createStoreRegistry()
