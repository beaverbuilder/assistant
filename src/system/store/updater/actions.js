export const actions = {
	setUpdateQueue( queue ) {
		return {
			type: 'SET_UPDATE_QUEUE',
			queue,
		}
	},
	setUpdateQueueItem( item ) {
		return {
			type: 'SET_UPDATE_QUEUE_ITEM',
			item,
		}
	},
	setUpdateQueueItems( items ) {
		return {
			type: 'SET_UPDATE_QUEUE_ITEMS',
			items,
		}
	},
	setCompletedUpdates( ids ) {
		return {
			type: 'SET_COMPLETED_UPDATES',
			ids,
		}
	},
	removeCompletedUpdate( id ) {
		return {
			type: 'REMOVE_COMPLETED_UPDATE',
			id,
		}
	}
}
