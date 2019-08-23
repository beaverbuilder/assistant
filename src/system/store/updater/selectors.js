export const selectors = {
	getQueuedUpdate( state, key ) {
		const { updateQueue } = state
		return 'undefined' === typeof updateQueue[ key ] ? null : updateQueue[ key ]
	}
}
