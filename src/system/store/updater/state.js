import { getCache } from 'shared-utils/cache'

const cache = getCache( 'updater', 'queue' )

export const state = {
	currentUpdate: null,
	updateQueue: cache ? cache : {},
	completedUpdates: [],
}
