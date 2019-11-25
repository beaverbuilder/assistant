export const selectors = {
	getQueuedUpdate( state, id ) {
		const { updateQueue } = state
		return 'undefined' === typeof updateQueue[ id ] ? null : updateQueue[ id ]
	},
	getCompletedUpdate( state, id ) {
		const { completedUpdates } = state
		if ( completedUpdates.includes( id ) ) {
			return completedUpdates[ completedUpdates.indexOf( id ) ]
		}
		return null
	}
}
