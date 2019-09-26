import { createStoreRegistry } from 'shared-utils/store'

export const {
	registerStore,
	useStore,
	getStore,
	getDispatch,
	getSelectors
} = createStoreRegistry()
