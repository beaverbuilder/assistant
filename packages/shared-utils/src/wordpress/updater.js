import { updatePlugin, updateTheme } from 'shared-utils/wordpress'

/**
 * Cached queue array retrieved from local storage.
 */
const cache = localStorage.getItem( 'fl-assistant-updater-queue' )

/**
 * An array of updates waiting to be processed
 * once the current update finishes.
 */
const queue = cache ? JSON.parse( cache ) : []

/**
 * Callback functions that are called when an
 * update matching the type and key completes.
 */
const subscriptions = {}

/**
 * Data for the current update.
 */
let current = null

/**
 * Caches the queue to local storage.
 */
const cacheQueue = () => {
	localStorage.setItem( 'fl-assistant-updater-queue', JSON.stringify( queue ) )
}

/**
 * Adds an update to the queue.
 */
const queueUpdate = ( type, key ) => {
	if ( ! isUpdateQueued( type, key ) ) {
		queue.push( { type, key } )
		cacheQueue()
		requestUpdate()
	}
}

/**
 * Checks if an update has been queued.
 */
const isUpdateQueued = ( type, key ) => {
	const filtered = queue.filter( item => {
		return type === item.type && key === item.key
	} )
	return !! filtered.length
}

/**
 * Checks if the queue is empty or not.
 */
const isQueueEmpty = () => {
	return ! queue.length
}

/**
 * Checks if an update is currently updating.
 */
const isUpdateUpdating = ( type, key ) => {
	if ( ! current ) {
		return false
	}
	return type === current.type && key === current.key
}

/**
 * Requests the next update if one isn't running.
 */
const requestUpdate = () => {
	if ( queue.length ) {
		const { type, key } = queue[ 0 ]
		if ( ! isUpdateUpdating( type, key ) ) {
			current = { type, key }
			if ( 'plugin' === type ) {
				updatePlugin( key, requestUpdateComplete, requestUpdateError )
			} else {
				updateTheme( key, requestUpdateComplete )
			}
		}
	}
}

/**
 * Callback for when an update completes.
 */
const requestUpdateComplete = response => {
	const { type, key } = queue.shift()
	current = null
	cacheQueue()
	resolveSubscription( type, key, response )
	requestUpdate()
}

/**
 * Callback for update request errors.
 */
const requestUpdateError = () => {
	requestUpdateComplete( { success: false } )
}

/**
 * Subscribes a custom callback for when an update
 * completes. This and the unsubscribe method are
 * useful in useEffect when you want updates to run
 * but don't want to set state if the component has
 * already unmounted.
 */
const subscribeToUpdate = ( type, key, callback ) => {
	if ( ! subscriptions[ `${ type }-${ key }` ] ) {
		subscriptions[ `${ type }-${ key }` ] = callback
	}
}

/**
 * Unsubscribes a custom callback for an update.
 */
const unsubscribeToUpdate = ( type, key ) => {
	subscriptions[ `${ type }-${ key }` ] = null
	delete subscriptions[ `${ type }-${ key }` ]
}

/**
 * Resolves a custom callback subscription when a
 * update has completed.
 */
const resolveSubscription = ( type, key, response ) => {
	if ( subscriptions[ `${ type }-${ key }` ] ) {
		subscriptions[ `${ type }-${ key }` ]( response )
	}
	unsubscribeToUpdate( type, key )
}

/**
 * Fire up the queue if it's not empty.
 */
requestUpdate()

/**
 * The public updater.
 */
export const updater = {
	queue: queueUpdate,
	isQueued: isUpdateQueued,
	isQueueEmpty: isQueueEmpty,
	subscribe: subscribeToUpdate,
	unsubscribe: unsubscribeToUpdate,
}
