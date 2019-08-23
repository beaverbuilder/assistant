import { getCache } from 'shared-utils/cache'

export const cache = getCache( 'updater', 'state' )

export const state = {
	currentUpdate: null,
	updateQueue: {},
}
