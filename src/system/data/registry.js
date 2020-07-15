import { createStoreRegistry } from '@beaverbuilder/app-core'

export const {
	registerStore,
	useStore,
	getStore,
	getDispatch,
	getSelectors,
	getHooks,
} = createStoreRegistry()
