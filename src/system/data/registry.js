import { createStoreRegistry } from 'fluid/data'

export const {
	registerStore,
	useStore,
	getStore,
	getDispatch,
	getSelectors
} = createStoreRegistry()
