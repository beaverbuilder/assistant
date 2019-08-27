export const selectors = {
	getQueuedUpdate( state, id ) {
		const { updateQueue } = state
		return 'undefined' === typeof updateQueue[ id ] ? null : updateQueue[ id ]
	}
}
